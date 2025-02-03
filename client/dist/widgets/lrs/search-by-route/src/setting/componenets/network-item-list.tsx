/** @jsx jsx */
import {
  type FeatureLayerDataSource,
  React,
  classNames,
  css,
  esri,
  hooks,
  jsx,
  urlUtils,
  type UseDataSource,
  Immutable,
  type SceneLayerDataSource,
  DataSourceTypes,
  DataSourceManager,
  type IMThemeVariables,
  polished,
  OrderRule,
  type OrderByOption,
  type DataSource,
  getAppStore,
  SessionManager,
  type IntlShape
} from 'jimu-core'
import {
  formatMessage,
  errorMessageDelay,
  SearchMethod,
  messages
} from 'widgets/shared-code/lrs'
import { Button } from 'jimu-ui'
import defaultMessages from '../translations/default'
import { type CommandActionDataType, List, TreeItemActionType, type TreeItemType, type TreeItemsType } from 'jimu-ui/basic/list-tree'
import { type ImmutableObject, type ImmutableArray } from 'seamless-immutable'
import { Identifiers, type NetworkItem, SpatialReferenceFrom, type RouteIdFieldsSettings, LineIdentifiers } from '../../config'
import { MapWidgetSelector, SettingRow, SettingSection, SidePopper } from 'jimu-ui/advanced/setting-components'
import { Fragment } from 'react'
import { WarningOutlined } from 'jimu-icons/outlined/suggested/warning'
import { NetworkItemConfig } from './network-item-config'
import { ClickOutlined } from 'jimu-icons/outlined/application/click'
import { measureFields } from '../../constants'
import { type MapDataSourceImpl } from 'jimu-arcgis/arcgis-data-source'
import { ReferentItemConfig } from './referent-item-config'
const IconClose = require('jimu-icons/svg/outlined/editor/close.svg')

interface Props {
  intl: IntlShape
  widgetId: string
  networkItems?: ImmutableArray<NetworkItem>
  mapWidgetIds: ImmutableArray<string>
  portalUrl: string
  runningQuery: boolean
  theme: IMThemeVariables
  onNewNetworkItemsAdded: (item: ImmutableArray<NetworkItem> | any, dsUpdateRequired?: boolean) => void
  onNetworkItemRemoved: (index: number) => void
  onClearAll: () => void
  onNetworkItemChanged: (index: number, item: ImmutableObject<NetworkItem>, dsUpdateRequired?: boolean) => void
  onNetworkOrderChanged: (networkItems: NetworkItem[]) => void
  onMapWidgetChanged: (mapWidgetIds: string[]) => void
  setRunningQuery: (val: boolean) => void
}

export function NetworkItemList (props: Props) {
  const {
    intl,
    widgetId,
    networkItems = [],
    mapWidgetIds,
    portalUrl,
    theme,
    runningQuery,
    setRunningQuery,
    onNewNetworkItemsAdded,
    onNetworkItemRemoved,
    onClearAll,
    onNetworkItemChanged,
    onNetworkOrderChanged,
    onMapWidgetChanged
  } = props
  const sidePopperTrigger = React.useRef<HTMLDivElement>(null)
  const [noLrsLayers, setNoLrsLayers] = React.useState<boolean>(false)
  const [noNetworkLayers, setNoNetworkLayers] = React.useState<boolean>(false)
  const [noMapSelected, setNoMapSelected] = React.useState<boolean>(false)
  const [selectedIndex, setSelectedIndex] = React.useState<number>(-1)
  const [multipleServices, setMultipleServices] = React.useState<boolean>(false)
  const getI18nMessage = hooks.useTranslation(defaultMessages, messages)
  let isRunningQuery = runningQuery

  const importAll = () => {
    // Reset the error messages.
    setNoLrsLayers(false)
    setMultipleServices(false)
    setNoNetworkLayers(false)
    setNoMapSelected(false)

    if (mapWidgetIds?.[0] === undefined) {
      setNoMapSelected(true)
      setTimeout(() => {
        setNoMapSelected(false)
      }, errorMessageDelay)
    } else {
      // Get a list of unique urls
      const urls = GetUniqueUrls()
      if (urls.length > 1) {
        // Display multiple services error
        setMultipleServices(true)
        setTimeout(() => {
          setMultipleServices(false)
        }, errorMessageDelay)
      } else if (urls.length > 0) {
        if (!isRunningQuery) {
          // Check for networks
          FindLrsNetworks(urls, 0)
            .then((valid) => {
              if (!valid) {
                setNoLrsLayers(true)
                setTimeout(() => {
                  setNoLrsLayers(false)
                }, errorMessageDelay)
              }
            })
            .catch((error) => {
              isRunningQuery = false
              setRunningQuery(false)
              console.error(error)
            })
        }
      } else {
        // Display no lrs error.
        setNoLrsLayers(true)
        setTimeout(() => {
          setNoLrsLayers(false)
        }, errorMessageDelay)
      }
    }
  }

  const GetUniqueUrls = (): string[] => {
    // Get a list of unique LRS urls. If there are more than one
    // LRS's in the map, we use the first one.
    const useMapWidget = mapWidgetIds?.[0]
    const allLayers = getMapAllLayers(useMapWidget)
    const urlList = []
    allLayers.forEach((layer) => {
      const url = layer?.getDataSourceJson()?.url
      const lrsUrl = GetLrsRequestUrl(url)
      if (!urlList.includes(lrsUrl)) {
        urlList.push(lrsUrl)
      }
    })

    return urlList
  }

  const getMapAllLayers = (useMapWidgetId: string): DataSource[] => {
    let allLayers: DataSource[] = []
    if (!useMapWidgetId) return allLayers
    const isBuilder = window?.jimuConfig?.isBuilder
    const appConfig = isBuilder ? getAppStore().getState()?.appStateInBuilder?.appConfig : getAppStore().getState()?.appConfig
    if (!appConfig) return allLayers
    const mapUseDataSources = appConfig.widgets[useMapWidgetId]?.useDataSources
    if (typeof mapUseDataSources !== 'undefined') {
      const mapUseDataSourcesIds = mapUseDataSources.map(item => item.dataSourceId)
      mapUseDataSourcesIds.forEach(dsId => {
        const currentDs = DataSourceManager.getInstance().getDataSource(dsId)
        const layers = (currentDs as MapDataSourceImpl)?.getDataSourcesByType(DataSourceTypes.FeatureLayer)
        if (layers) {
          allLayers = allLayers.concat(layers)
        }
      })
    }
    return allLayers
  }

  const FindLrsNetworks = async (urls: string[], index: number): Promise<boolean> => {
    isRunningQuery = true
    setRunningQuery(true)
    let returnVal = false
    const requestURL = urls[index]
    let params = null
    const session = SessionManager.getInstance().getSessionByUrl(portalUrl)
    const currentToken = session && session.token ? session.token : ''

    if (currentToken) {
      params = { f: 'json', token: currentToken }
    } else {
      params = { f: 'json' }
    }

    returnVal = await requestService({
      method: 'GET',
      url: requestURL,
      params: params
    })
      .then((result: any) => {
        // eslint-disable-next-line no-prototype-builtins
        if (result.hasOwnProperty('lrs')) {
          // eslint-disable-next-line no-prototype-builtins
          if (result.hasOwnProperty('networkLayers') || result.hasOwnProperty('eventLayers') || result.hasOwnProperty('calibrationPointLayers') ||
          // eslint-disable-next-line no-prototype-builtins
          result.hasOwnProperty('intersectionLayers') || result.hasOwnProperty('nonLRSLayers')) {
            const layersToPopulate = ['networkLayers', 'eventLayers', 'calibrationPointLayers',
              'intersectionLayers', 'nonLRSLayers']

            layersToPopulate.forEach(async (layerKey) => {
              // eslint-disable-next-line no-prototype-builtins
              if (result.hasOwnProperty(layerKey)) {
                if (layerKey === 'eventLayers') {
                  const eventLayers = result[layerKey]
                  result[layerKey] = eventLayers.filter(item => item.type === 'esriLRSPointEventLayer')
                }
                const layer = result[layerKey]
                if (layer?.length > 0) await PopulateLrsNetworks(result[layerKey], layerKey)
              }
            })
            return true
          } else {
            // No LRS networks in map
            setNoNetworkLayers(true)
            setTimeout(() => {
              setNoNetworkLayers(false)
            }, errorMessageDelay)
            return false
          }
        } else {
          setNoLrsLayers(true)
          setTimeout(() => {
            setNoLrsLayers(false)
          }, errorMessageDelay)
          return false
        }
      })
      .catch((e: any) => {
        return false
      })
    return returnVal
  }

  const requestService = (opts: any): Promise<any> => {
    return new Promise(function (resolve, reject) {
      const requestOptions = {
        params: opts.params,
        httpMethod: opts.method
      }
      esri.restRequest
        .request(opts.url, requestOptions)
        .then((result: any) => {
          resolve(result)
        })
        .catch((e: any) => {
          resolve(e)
        })
    })
  }

  const PopulateLrsNetworks = async (layers: any[], type: string) => {
    const useMapWidget = mapWidgetIds?.[0]
    const allLayers = getMapAllLayers(useMapWidget)
    const useDataSources = []
    const layerIds = []

    // Use the layer id we got from the LRServer REST call
    // to find the DS in the map widget.
    layers.forEach((item) => {
      layerIds.push(item.id)
    })
    const ids = []
    allLayers.forEach((layer) => {
      const haveUrl = layer?.getDataSourceJson()?.url
      const layerDefinition = (layer as FeatureLayerDataSource)?.getLayerDefinition()

      // Check if we already load this layer.
      const find1 = networkItems.findIndex((config) => config.id === layer.id) === -1
      // Check if this layer is an LRS network layer
      const find2 = layerIds.findIndex((id) => id === layerDefinition.id) > -1
      // Checks if its datasouce has already been added
      const find3 = ids.findIndex((id) => id === layerDefinition.id) === -1
      if (haveUrl && find1 && find2 && find3) {
        // only keep track of layerDefinition.ids that have had there datasource added
        ids.push(layerDefinition.id)
        useDataSources.push({
          dataSourceId: layer.id,
          mainDataSourceId: layer.id,
          dataViewId: layer.dataViewId,
          rootDataSourceId: layer.getRootDataSource()?.id
        })
      }
    })

    if (type === 'networkLayers' && layerIds.length === 0) {
      // No network layers found.
      setNoNetworkLayers(true)
      setTimeout(() => {
        setNoNetworkLayers(false)
      }, errorMessageDelay)
    } else if (useDataSources.length > 0) {
      // Import the network settings.
      await importAllLayersConfigSave(useDataSources, type)
    }
  }

  const importAllLayersConfigSave = async (useDataSources: UseDataSource[], type: string) => {
    if (useDataSources?.length === 0 || !type) return
    const loopAddConfigs = async () => {
      let layerItems = []
      const promises = []
      useDataSources.forEach((useDataSource) => {
        promises.push(
          DataSourceManager.getInstance()
            .createDataSourceByUseDataSource(Immutable(useDataSource))
            .then(async (originDs: FeatureLayerDataSource | SceneLayerDataSource) => {
              const outputJsonOriginDs = getOutputJsonOriginDs(originDs)
              if (!outputJsonOriginDs) Promise.reject(Error(''))

              // Get the LRS REST url
              const layerDefinition = originDs?.getLayerDefinition()
              const layerUrl = outputJsonOriginDs?.url
              let url
              if (type === 'networkLayers') {
                url = GetLrsRequestUrl(layerUrl) + '/networkLayers/' + layerDefinition.id
              } else if (type === 'eventLayers') {
                url = GetLrsRequestUrl(layerUrl) + '/eventLayers/' + layerDefinition.id
              } else if (type === 'calibrationPointLayers') {
                url = GetLrsRequestUrl(layerUrl) + '/calibrationPointLayers/' + layerDefinition.id
              } else if (type === 'intersectionLayers') {
                url = GetLrsRequestUrl(layerUrl) + '/intersectionLayers/' + layerDefinition.id
              } else if (type === 'nonLRSLayers') {
                url = GetLrsRequestUrl(layerUrl) + '/nonLRSLayers/' + layerDefinition.id
              }

              if (type === 'networkLayers') {
                await CreateLrsNetwork(originDs, useDataSource, outputJsonOriginDs, url, layerUrl).then(
                  (networkResults: ImmutableObject<NetworkItem>) => {
                    if (networkResults) {
                      layerItems = layerItems.concat([Immutable(networkResults)])
                    }
                    return layerItems
                  }
                )
              } else {
                await CreateLrsReferent(originDs, useDataSource, outputJsonOriginDs, url, type)
                  .then(
                    (results) => {
                      if (results) {
                        layerItems = layerItems.concat([Immutable(results)])
                      }
                      return layerItems
                    }
                  )
              }
            })
        )
      })
      await Promise.all(promises)
      return layerItems
    }
    const layerItems = await loopAddConfigs()
    onNewNetworkItemsAdded(layerItems)
  }

  const CreateLrsNetwork = (
    originDs: FeatureLayerDataSource | SceneLayerDataSource,
    useDataSource: UseDataSource,
    outputJsonOriginDs: FeatureLayerDataSource,
    networkUrl: string,
    layerUrl: string
  ): Promise< ImmutableObject<NetworkItem>> => {
    const session = SessionManager.getInstance().getSessionByUrl(portalUrl)
    const currentToken = session && session.token ? session.token : ''

    let params = null
    if (currentToken) {
      params = { f: 'json', token: currentToken }
    } else {
      params = { f: 'json' }
    }

    return new Promise((resolve, reject) => {
      requestService({ method: 'POST', url: networkUrl, params: params })
        .then(async (result: any) => {
          if (!result) {
            return
          }

          // Extract LRS specific info.
          const routeIdFieldName = result.routeIdFieldName as string
          const routeNameFieldName = result.routeNameFieldName as string
          const fromDateFieldName = result.fromDateFieldName as string
          const toDateFieldName = result.toDateFieldName as string
          const routeIdFields = result.routeIdFields as string[]
          const useRouteId = routeIdFieldName ? routeIdFieldName.length > 0 : false
          const useRouteName = routeNameFieldName ? routeNameFieldName.length > 0 : false
          const useMultiField = routeIdFields ? routeIdFields.length > 1 : false
          const supportsLines = result.supportsLines
          let useLineId, lineIdFieldName, lineOrderFieldName, useLineName, lineNameFieldName, defaultLineIdentifier
          const displayFields: string[] = []
          const measurePrecision = result.measurePrecision as number
          const isDerived = result.isDerived as boolean
          const derivedFromNetworkId = result.derivedFromNetworkId

          // Set the default identifier.
          let defaultIdentifer = Identifiers.RouteId
          if (supportsLines) {
            defaultIdentifer = Identifiers.RouteName
          } else if (routeIdFields?.length > 1) {
            defaultIdentifer = Identifiers.MultiField
          }

          if (supportsLines) {
            lineIdFieldName = result.lineIdFieldName as string
            useLineId = lineIdFieldName ? lineIdFieldName.length > 0 : false
            lineNameFieldName = result.lineNameFieldName as string
            useLineName = lineNameFieldName ? lineNameFieldName.length > 0 : false
            lineOrderFieldName = result.lineOrderFieldName as string
            if (useLineName) defaultLineIdentifier = LineIdentifiers.LineName
            else if (useLineId) defaultLineIdentifier = LineIdentifiers.LineId
          }

          // RouteIdFields can contain routeId or routeName.
          // Filter those fields out.
          const filteredFields = []
          if (routeIdFields) {
            routeIdFields.forEach((field) => {
              if (routeIdFieldName !== field && routeNameFieldName !== field) {
                filteredFields.push(field)
              }
            })
          }

          // Get all fields from original datasource.
          const allFields = originDs?.getSchema()
          const allFieldsDetails = allFields?.fields ? Object.values(allFields?.fields) : []

          // Set the field information for the identifiers.
          const IMRouteIdField = allFieldsDetails.find(
            item => routeIdFieldName === item.name
          )
          const IMRouteNameField = allFieldsDetails.find(
            item => routeNameFieldName === item.name
          )
          const IMLineIdField = allFieldsDetails.find(
            item => lineIdFieldName === item.name
          )
          const IMLineNameField = allFieldsDetails.find(
            item => lineNameFieldName === item.name
          )
          const IMRouteIdFields = allFieldsDetails.filter(
            item => filteredFields.includes(item.name)
          )
          const IMLineOrderField = allFieldsDetails.find(
            item => lineOrderFieldName === item.name
          )
          const IMFromDateField = allFieldsDetails.find(
            item => fromDateFieldName === item.name
          )
          const IMToDateField = allFieldsDetails.find(
            item => toDateFieldName === item.name
          )

          // Check if its a line network but without route name configured.
          if (defaultIdentifer === Identifiers.RouteName && (IMRouteNameField === undefined || IMRouteNameField === null)) {
            defaultIdentifer = Identifiers.RouteId
            if (routeIdFields?.length > 1) {
              defaultIdentifer = Identifiers.MultiField
            }
          }

          // Set the display fields.
          if (IMRouteIdField) {
            displayFields.push(IMRouteIdField.alias)
          }
          if (IMRouteNameField) {
            displayFields.push(IMRouteNameField.alias)
          }
          if (IMRouteIdFields.length > 1) {
            IMRouteIdFields.forEach((field) => {
              displayFields.push(field.alias)
            })
          }

          displayFields.push(measureFields.at(0).value)
          displayFields.push(measureFields.at(1).value)

          const routeIdFieldsConfig: RouteIdFieldsSettings[] = []
          IMRouteIdFields.forEach((fieldInfo) => {
            const fieldSettings: RouteIdFieldsSettings = {
              field: fieldInfo,
              enabled: true
            }
            routeIdFieldsConfig.push(fieldSettings)
          })

          // Set the default sort field.
          let defaultSortField = ''
          if (supportsLines) {
            defaultSortField = IMRouteNameField?.jimuName
          } else {
            defaultSortField = IMRouteIdField?.jimuName
          }

          const orderBy: OrderByOption[] = []
          const orderByDefault: OrderByOption = ({
            jimuFieldName: defaultSortField,
            order: OrderRule.Asc
          })
          orderBy.push(orderByDefault)

          // Generate output datasoruce id/label.
          const nextConfigId = `${Math.random()}`.slice(2)
          const networkItemLabel = outputJsonOriginDs?.getLabel()

          // Default tolerance (search radius) is 1000 meters. Convert from meters to network's units of measure.
          let defaultSearchRadius: number = 1000 // meters
          if (result.unitsOfMeasure !== 'esriMeters') {
            switch (result.unitsOfMeasure) {
              case 'esriDecimalDegrees':
                defaultSearchRadius = 0.009
                break
              case 'esriNauticalMiles':
              case 'esriIntNauticalMiles':
                defaultSearchRadius = 0.54
                break
              case 'esriMiles':
              case 'esriIntMiles':
                defaultSearchRadius = 0.62
                break
              case 'esriKilometers':
                defaultSearchRadius = 1
                break
              case 'esriYards':
              case 'esriIntYards':
                defaultSearchRadius = 5468
                break
              case 'esriFeet':
              case 'esriIntFeet':
                defaultSearchRadius = 1093.6
                break
              case 'esriDecimeters':
                defaultSearchRadius = 10000
                break
              case 'esriInches':
              case 'esriIntInches':
                defaultSearchRadius = 39370
                break
              case 'esriCentimeters':
                defaultSearchRadius = 100000
                break
              case 'esriMillimeters':
                defaultSearchRadius = 1000000
                break
              case 'esriPoints':
                defaultSearchRadius = 2834640
                break
            }
          }

          // Exclude global id, editor tracking fields and fields with esriFieldTypeDate type
          // for advanced field display options
          const layerFields = []
          const layerDefinition = originDs?.getLayerDefinition()
          const globalIdFieldName = layerDefinition?.globalIdField
          const objectIdFieldName = layerDefinition?.objectIdField
          const excludeFields = [globalIdFieldName, objectIdFieldName]
          const layerHasChangeTracking = layerDefinition?.editFieldsInfo
          if (layerHasChangeTracking) {
            excludeFields.push(layerHasChangeTracking.creationDateField)
            excludeFields.push(layerHasChangeTracking.creatorField)
            excludeFields.push(layerHasChangeTracking.editDateField)
            excludeFields.push(layerHasChangeTracking.editorField)
          }

          const layerDefineFields = layerDefinition?.fields
          const fields = originDs?.getSchema()?.fields
          for (const key in fields) {
            // eslint-disable-next-line no-empty
            if (excludeFields.includes(key)) {
            } else {
              layerFields.push(fields[key])
            }
          }

          const defaultChecked = []

          const routeId = layerDefineFields.find(
            item => routeIdFieldName === item.name
          )
          const routeName = layerDefineFields.find(
            item => routeNameFieldName === item.name
          )
          const fromDate = layerDefineFields.find(
            item => fromDateFieldName === item.name
          )
          const toDate = layerDefineFields.find(
            item => toDateFieldName === item.name
          )
          const lineId = layerDefineFields.find(
            item => lineIdFieldName === item.name
          )
          const lineName = layerDefineFields.find(
            item => lineNameFieldName === item.name
          )
          const lineOrder = layerDefineFields.find(
            item => lineOrderFieldName === item.name
          )

          defaultChecked.push(routeId.name)
          if (useRouteName) defaultChecked.push(routeName.name)
          defaultChecked.push(fromDate.name)
          defaultChecked.push(toDate.name)
          if (lineId) defaultChecked.push(lineId.name)
          if (lineName) defaultChecked.push(lineName.name)
          if (lineOrder) defaultChecked.push(lineOrder.name)

          // Create the network object.
          const networkInfo: NetworkItem = {
            id: originDs.id,
            name: networkItemLabel,
            configId: nextConfigId,
            lrsNetworkId: result.lrsNetworkId,
            outputLineDsId: `${widgetId}_output_line_${nextConfigId}`,
            outputPointDsId: `${widgetId}_output_point_${nextConfigId}`,
            networkUrl: networkUrl,
            useRouteId: useRouteId,
            useRouteName: useRouteName,
            useLineId: useLineId,
            useLineName: useLineName,
            useMultiField: useMultiField,
            useMeasure: true,
            useCoordinate: true,
            useReferent: true,
            useLineAndMeasure: supportsLines,
            showLineAndMeasure: supportsLines,
            useDataSource: useDataSource as any,
            defaultMethod: SearchMethod.Measure,
            enabledMethods: [SearchMethod.Measure],
            defaultIdentifer: defaultIdentifer,
            defaultLineIdentifier: defaultLineIdentifier,
            routeIdFieldName: routeIdFieldName,
            routeNameFieldName: routeNameFieldName,
            lineIdFieldName: lineIdFieldName,
            lineNameFieldName: lineNameFieldName,
            lineOrderFieldName: lineOrderFieldName,
            routeIdFields: routeIdFieldsConfig,
            routeIdField: IMRouteIdField || undefined,
            routeNameField: IMRouteNameField || undefined,
            lineIdField: IMLineIdField || undefined,
            lineNameField: IMLineNameField || undefined,
            lineOrderField: IMLineOrderField || undefined,
            routeIdFieldNames: routeIdFields,
            supportsLines: supportsLines,
            unitsOfMeasure: result.unitsOfMeasure,
            sortOptions: orderBy,
            measurePrecision: measurePrecision,
            defaultSpatialReferenceFrom: SpatialReferenceFrom.Lrs,
            searchRadius: defaultSearchRadius, // in network's unit
            referent: false,
            fromDateField: IMFromDateField,
            toDateField: IMToDateField,
            fromDateFieldName: result?.fromDateFieldName,
            toDateFieldName: result?.toDateFieldName,
            searchSingle: true,
            searchMultiple: true,
            searchRange: true,
            expandByDefault: false,
            spatialReferenceInfo: {
              wkid: result.spatialReferenceInfo.wkid,
              wkt: result.spatialReferenceInfo.wkt
            },
            isDerived: isDerived,
            derivedFromNetworkId: derivedFromNetworkId,
            layerFields: layerFields,
            defaultChecked: defaultChecked,
            showAdditionalFields: false,
            allFieldsDetails: allFieldsDetails
          }
          const network: ImmutableObject<NetworkItem> = Immutable(Object.assign({}, networkInfo, { networkInfo }))
          resolve(network)
        })
    })
  }

  const CreateLrsReferent = (
    originDs: FeatureLayerDataSource | SceneLayerDataSource,
    useDataSource: UseDataSource,
    outputJsonOriginDs: FeatureLayerDataSource,
    networkUrl: string,
    type: string
  ): Promise<any> => {
    const session = SessionManager.getInstance().getSessionByUrl(portalUrl)
    const currentToken = session && session.token ? session.token : ''

    let params = null
    if (currentToken) {
      params = { f: 'json', token: currentToken }
    } else {
      params = { f: 'json' }
    }

    return new Promise((resolve, reject) => {
      requestService({ method: 'POST', url: networkUrl, params: params })
        .then(async (result: any) => {
          if (!result) {
            return
          }
          const networkItemLabel = outputJsonOriginDs?.getLabel()

          // Exclude global id, editor tracking fields and fields with esriFieldTypeDate type
          // for referent field dropdown options
          const layerFields = []
          const layerDefinition = originDs?.getLayerDefinition()
          const globalIdFieldName = layerDefinition?.globalIdField
          const excludeFields = [globalIdFieldName]
          const layerHasChangeTracking = layerDefinition?.editFieldsInfo
          if (layerHasChangeTracking) {
            excludeFields.push(layerHasChangeTracking.creationDateField)
            excludeFields.push(layerHasChangeTracking.creatorField)
            excludeFields.push(layerHasChangeTracking.editDateField)
            excludeFields.push(layerHasChangeTracking.editorField)
          }

          const layerDefineFields = layerDefinition?.fields
          if (layerDefineFields?.length > 0) {
            layerDefineFields.forEach((field) => {
              if (field?.type === 'esriFieldTypeDate') {
                excludeFields.push(field?.name)
              }
            })
          }

          const fields = originDs?.getSchema()?.fields
          for (const key in fields) {
            // eslint-disable-next-line no-empty
            if (excludeFields.includes(key)) {
            } else {
              layerFields.push(fields[key])
            }
          }

          const networkInfo = {
            id: originDs.id,
            layerId: result.id,
            name: networkItemLabel,
            networkUrl: networkUrl,
            type: type,
            useDataSource: useDataSource as any,
            referent: true,
            defaultMethod: SearchMethod.Referent,
            displayName: layerFields[0]?.name,
            layerFields: layerFields,
            routeIdFieldName: result?.routeIdFieldName,
            fromDateFieldName: result?.fromDateFieldName,
            toDateFieldName: result?.toDateFieldName,
            dateFormat: result?.dateFormat,
            allFields: result?.fields
          }
          const network = Immutable(Object.assign({}, networkInfo, { networkInfo }))
          resolve(network)
        })
    })
  }

  const getOutputJsonOriginDs = (ds: SceneLayerDataSource | FeatureLayerDataSource): FeatureLayerDataSource => {
    if (!ds) {
      return null
    }

    if (ds.type === DataSourceTypes.SceneLayer) {
      return ds.getAssociatedDataSource()
    } else {
      return ds
    }
  }

  const GetLrsRequestUrl = (url: string): string => {
    let trunURL = url
    if (trunURL.includes('FeatureServer')) {
      trunURL = trunURL.substring(0, trunURL.indexOf('FeatureServer'))
    }
    if (trunURL.includes('MapServer')) {
      trunURL = trunURL.substring(0, trunURL.indexOf('MapServer'))
    }
    return trunURL + 'MapServer/exts/LRServer'
  }

  const onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    onMapWidgetChanged(useMapWidgetIds)
  }

  const onShowNetworkPanel = (index: number) => {
    if (index === selectedIndex) {
      setSelectedIndex(-1)
    } else {
      setSelectedIndex(index)
    }
  }

  const clearSelection = React.useCallback(() => {
    setSelectedIndex(-1)
  }, [])

  const style = css`
    border-bottom: 1px 
    solid var(--ref-palette-neutral-700);
        
    &.h-100 > 
    .jimu-widget-setting--section {
      border-bottom: none;
    }

    .error-tips {
      font-style: italic;
      font-size: 12px;
      color: var(--ref-palette-neutral-1000);
      margin-top: 5px;
      .display-error-tips {
        width: calc(100% - 20px);
        margin: 0 4px;
        color: ${theme.sys.color.error.main};
      }
    }

    .empty-placeholder {
      display: flex;
      flex-flow: column;
      justify-content: center;
      height: calc(100% - 255px);
      overflow: hidden;
      .empty-placeholder-inner {
        padding: 0px 20px;
        flex-direction: column;
        align-items: center;
        display: flex;

        .empty-placeholder-text {
          color: ${theme.ref.palette.neutral[1000]};
          font-size: ${polished.rem(14)};
          margin-top: 16px;
          text-align: center;
        }
        .empty-placeholder-icon {
          color: ${theme.ref.palette.neutral[800]};
        }
      }
    }
  `

  // Actions for list items
  const advancedActionMap = {
    overrideItemBlockInfo: ({ itemBlockInfo }: any, refComponent: any) => {
      return {
        name: TreeItemActionType.RenderOverrideItem,
        children: [{
          name: TreeItemActionType.RenderOverrideItemDroppableContainer,
          withListGroupItemWrapper: false,
          children: [{
            name: TreeItemActionType.RenderOverrideItemDraggableContainer,
            children: [{
              name: TreeItemActionType.RenderOverrideItemBody,
              children: [{
                name: TreeItemActionType.RenderOverrideItemMainLine,
                children: [{
                  name: TreeItemActionType.RenderOverrideItemDragHandle
                }, {
                  name: TreeItemActionType.RenderOverrideItemTitle
                }, {
                  name: TreeItemActionType.RenderOverrideItemCommands
                }]
              }]
            }]
          }]
        }]
      }
    }
  }

  let sectionLabel = getI18nMessage('networkConfig')
  if (networkItems[selectedIndex]?.referent) sectionLabel = getI18nMessage('referentConfig')

  return (
    <div
      ref={sidePopperTrigger}
      css={style}
      className={classNames('d-flex flex-column', { 'h-100': networkItems.length === 0 })}
    >
      <SettingSection className="border-0">
        <Fragment>
          <SettingRow label={getI18nMessage('selectMap')} />
          <SettingRow>
            <MapWidgetSelector
              onSelect={onMapWidgetSelected}
              useMapWidgetIds={mapWidgetIds}
            />
          </SettingRow>
          <SettingRow>
            <Button
              role={'button'}
              type={'primary'}
              className={'w-100 text-dark'}
              onClick={importAll}
              title={getI18nMessage('importAll')}
              aria-label={getI18nMessage('importAll')}
            >
              {getI18nMessage('loadLayers')}
            </Button>
          </SettingRow>
          {networkItems && networkItems.length > 0 && (
            <SettingRow>
              <Button
                role={'button'}
                className={'w-100 text-dark'}
                type={'primary'}
                onClick={onClearAll}
                title={getI18nMessage('clearLayers')}
                aria-label={getI18nMessage('clearLayers')}
              >
                {getI18nMessage('clearLayers')}
              </Button>
            </SettingRow>
          )}
         {noLrsLayers && (
            <div className="text-break error-tips d-flex align-items-center">
              <Fragment>
                <WarningOutlined color={theme.sys.color.error.main} />
                <div className="display-error-tips">
                  {formatMessage(intl, 'noLrsLayersTips')}
                </div>
              </Fragment>
            </div>
         )}
          {noMapSelected && (
            <div className="text-break error-tips d-flex align-items-center">
              <Fragment>
                <WarningOutlined color={theme.sys.color.error.main} />
                <div className="display-error-tips">
                  {formatMessage(intl, 'noMapSelectedTips')}
                </div>
              </Fragment>
            </div>
          )}
          { noNetworkLayers && (
            <div className="text-break error-tips d-flex align-items-center">
              <Fragment>
                <WarningOutlined color={theme.sys.color.error.main} />
                <div className="display-error-tips">
                  {formatMessage(intl, 'noNetworkLayersTips')}
                </div>
              </Fragment>
            </div>
          )}
          {multipleServices && (
            <div className="text-break error-tips d-flex align-items-center">
              <Fragment>
                <WarningOutlined color={theme.sys.color.error.main} />
                <div className="display-error-tips">
                  {formatMessage(intl, 'multipleServicesTips')}
                </div>
              </Fragment>
            </div>
          )}
        </Fragment>
      </SettingSection>

      <SettingSection className={classNames('pt-0 border-0', { 'h-100': networkItems.length === 0 })}>
        <div className="setting-ui-unit-list">
          <List
            className="setting-ui-unit-list-exsiting"
            itemsJson={networkItems.map((item, index) => ({
              itemStateDetailContent: item,
              itemKey: `${index}`,
              itemStateChecked: selectedIndex === index,
              itemStateTitle: item.name,
              itemStateCommands: [
                {
                  label: getI18nMessage('removeNetwork'),
                  iconProps: () => ({ icon: IconClose, size: 12 }),
                  action: ({ data }: CommandActionDataType) => {
                    const { itemJsons: [currentItemJson] } = data
                    const index = +currentItemJson.itemKey
                    if (index === selectedIndex) { clearSelection() }
                    onNetworkItemRemoved(index)
                  }
                }
              ]
            })) as TreeItemType[]}
            dndEnabled
            onUpdateItem={(actionData, refComponent) => {
              const { itemJsons } = refComponent.props
              const [, parentItemJson] = itemJsons as [TreeItemType, TreeItemsType]
              onNetworkOrderChanged(parentItemJson.map(i => i.itemStateDetailContent))
            }}
            onClickItemBody={(actionData, refComponent) => {
              const { itemJsons: [currentItemJson] } = refComponent.props
              onShowNetworkPanel(+currentItemJson.itemKey)
            }}
            {...advancedActionMap}
          />
          {networkItems.length === selectedIndex && (
            <List
              className="setting-ui-unit-list-new"
              css={css`.jimu-tree-item__detail-toggle { display: none !important; }`}
              itemsJson={[{
                name: '......'
              }
              ].map((item) => ({
                itemStateDetailContent: item,
                itemKey: `${selectedIndex}`,
                itemStateChecked: true,
                itemStateTitle: item.name,
                itemStateCommands: []
              }))}
              dndEnabled={false}
              {...advancedActionMap}
            />
          )}
        </div>
         {networkItems.length === 0 && (
            <div className="empty-placeholder w-100 h-100">
              <div className="empty-placeholder-inner">
                <div className="empty-placeholder-icon">
                  <ClickOutlined size={48} />
                </div>
                <div
                  className="empty-placeholder-text"
                  id="edit-blank-msg"
                  dangerouslySetInnerHTML={{
                    __html: getI18nMessage('blankStatus')
                  }}
                />
              </div>
            </div>
         )}
        <SidePopper
            isOpen={selectedIndex >= 0 && !urlUtils.getAppIdPageIdFromUrl().pageId}
            toggle={clearSelection}
            position="right"
            trigger={sidePopperTrigger?.current}
            title={sectionLabel}
          >
            {(networkItems[selectedIndex]?.referent === false)
              ? (
              <NetworkItemConfig
                intl={intl}
                widgetId={widgetId}
                index={selectedIndex}
                total={networkItems.length}
                networkItems={networkItems}
                networkItem={networkItems[selectedIndex]}
                onNetworkItemChanged={onNetworkItemChanged}
              />)
              : (
                <ReferentItemConfig
                  widgetId={widgetId}
                  index={selectedIndex}
                  total={networkItems.length}
                  referentItem={networkItems[selectedIndex]}
                  onReferentItemChanged={onNetworkItemChanged}/>
                )}
          </SidePopper>
      </SettingSection>
    </div>
  )
}
