/** @jsx jsx */
import {
  React,
  jsx,
  type IMThemeVariables,
  type DataSource,
  getAppStore,
  DataSourceManager,
  DataSourceTypes,
  classNames,
  polished,
  css,
  hooks,
  urlUtils,
  type UseDataSource,
  Immutable,
  type SceneLayerDataSource,
  SessionManager,
  type IntlShape
} from 'jimu-core'
import { type ImmutableArray, type ImmutableObject } from 'seamless-immutable'
import { LrsLayerType, type LrsLayer, type NetworkInfo, type EventInfo, type AttributeFieldSettings } from '../../config'
import { type FeatureLayerDataSource, type MapDataSourceImpl } from 'jimu-arcgis/arcgis-data-source'
import { type CommandActionDataType, List, TreeItemActionType, type TreeItemType, type TreeItemsType } from 'jimu-ui/basic/list-tree'
import { MapWidgetSelector, SettingRow, SettingSection, SidePopper } from 'jimu-ui/advanced/setting-components'
import { Fragment } from 'react'
import { WarningOutlined } from 'jimu-icons/outlined/suggested/warning'
import { ClickOutlined } from 'jimu-icons/outlined/application/click'
import { LayerItemConfig } from './layer-item-config'
import { Alert, Button } from 'jimu-ui'
import defaultMessages from './../translations/default'
import {
  isDefined,
  getFeatureLayer,
  requestService,
  formatMessage,
  errorMessageDelay
} from 'widgets/shared-code/lrs'
const IconClose = require('jimu-icons/svg/outlined/editor/close.svg')

interface Props {
  widgetId: string
  layers?: ImmutableArray<LrsLayer>
  mapWidgetIds: ImmutableArray<string>
  portalUrl: string
  runningQuery: boolean
  intl: IntlShape
  theme: IMThemeVariables
  onLayersAdded: (item: ImmutableArray<LrsLayer> | any, dsUpdateRequired?: boolean) => void
  onLayerRemoved: (index: number) => void
  onClearAll: () => void
  onLayerChanged: (index: number, item: ImmutableObject<LrsLayer>, dsUpdateRequired?: boolean) => void
  onLayerOrderChanged: (layers: LrsLayer[]) => void
  onMapWidgetedChanged: (mapWidgetIds: string[]) => void
  updateAttributeSets: (attributeSet: any) => void
  setRunningQuery: (val: boolean) => void
}

export function LayerItemList (props: Props) {
  const {
    runningQuery, widgetId, layers = [], mapWidgetIds, portalUrl, theme, intl, onLayersAdded, setRunningQuery,
    onLayerRemoved, onClearAll, onLayerChanged, onLayerOrderChanged, onMapWidgetedChanged,
    updateAttributeSets
  } = props
  const getI18nMessage = hooks.useTranslation(defaultMessages)
  const sidePopperTrigger = React.useRef<HTMLDivElement>(null)
  const [noLrsLayers, setNoLrsLayers] = React.useState<boolean>(false)
  const [noNetworkLayers, setNoNetworkLayers] = React.useState<boolean>(false)
  const [noMapSelected, setNoMapSelected] = React.useState<boolean>(false)
  const [multipleServices, setMultipleServices] = React.useState<boolean>(false)
  const [selectedIndex, setSelectedIndex] = React.useState<number>(-1)
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
        // Check for networks
        if (!isRunningQuery) {
          FindLrs(urls, 0)
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

  const FindLrs = async (urls: string[], index: number): Promise<boolean> => {
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
          const valid = PopulateLrsLayers(result)
          PopulateAttributeSets(requestURL)
          return valid
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

  const PopulateLrsLayers = (lrsJson: any) => {
    const useMapWidget = mapWidgetIds?.[0]
    const allLayers = getMapAllLayers(useMapWidget)
    const useDataSources = []
    const allLayerIds = []
    const networkIds = []
    const eventIds = []
    const pointEventLayers = []

    const allLayersAsFeatureLayerDS: FeatureLayerDataSource[] = []
    allLayers.forEach((layer => {
      allLayersAsFeatureLayerDS.push(layer as FeatureLayerDataSource)
    }))

    // Use the layer id we got from the LRServer REST call
    // to find the DS in the map widget.

    allLayersAsFeatureLayerDS.forEach((layer) => {
    })

    lrsJson?.networkLayers?.forEach((item) => {
      allLayersAsFeatureLayerDS.forEach((layer) => {
        const id = layer?.getLayerDefinition()?.id
        if (id === item.id) {
          networkIds.push(item.id)
          allLayerIds.push(item.id)
        }
      })
    })

    lrsJson?.eventLayers?.forEach((item) => {
      allLayersAsFeatureLayerDS.forEach((layer) => {
        const id = layer?.getLayerDefinition()?.id
        if (id === item.id) {
          eventIds.push(item.id)
          allLayerIds.push(item.id)
          if (item.type === 'esriLRSPointEventLayer') {
            pointEventLayers.push(item)
          }
        }
      })
    })

    allLayers.forEach((layer) => {
      const haveUrl = layer?.getDataSourceJson()?.url
      const layerDefinition = (layer as FeatureLayerDataSource)?.getLayerDefinition()
      // Check if we already load this layer.
      const find1 = layers.findIndex((config) => config.id === layer.id) === -1
      // Check if this layer is an LRS layer.
      const find2 = allLayerIds.findIndex((id) => id === layerDefinition.id) > -1

      if (haveUrl && find1 && find2) {
        useDataSources.push({
          dataSourceId: layer.id,
          mainDataSourceId: layer.id,
          dataViewId: layer.dataViewId,
          rootDataSourceId: layer.getRootDataSource()?.id
        })
      }
    })

    if (allLayerIds.length === 0) {
      // No LRS networks found.
      setNoLrsLayers(true)
      setTimeout(() => {
        setNoLrsLayers(false)
      }, errorMessageDelay)
      return false
    } else if (networkIds.length === 0) {
      // No network layers found.
      setNoNetworkLayers(true)
      setTimeout(() => {
        setNoNetworkLayers(false)
      }, errorMessageDelay)
      return false
    } else if (useDataSources.length > 0) {
      // Import the network settings.
      importAllLayersConfigSave(useDataSources, networkIds, eventIds)
      return true
    } else if ((useDataSources.length === 0) && allLayerIds.length > 0) {
      return true
    }
  }

  const PopulateAttributeSets = async (url: string) => {
    const requestURL = url + '/attributeSets'
    const session = SessionManager.getInstance().getSessionByUrl(portalUrl)
    const currentToken = session && session.token ? session.token : ''

    let params = null
    if (currentToken) {
      params = { f: 'json', token: currentToken }
    } else {
      params = { f: 'json' }
    }

    const eventAttributeSets = {
      attributeSet: []
    }

    await requestService({
      method: 'GET',
      url: requestURL,
      params: params
    })
      .then((result: any) => {
        const attributeSets = result?.attributeSets
        if (isDefined(attributeSets)) {
          attributeSets.forEach((element) => {
            const attributeSet = {
              title: element.title,
              isDefault: element.isDefault,
              isPoint: element.isPoint,
              defaultSettings: element.defaultSettings,
              layers: element.layers
            }
            eventAttributeSets.attributeSet.push(attributeSet)
          })
        }
        updateAttributeSets(eventAttributeSets)
      })
  }

  const importAllLayersConfigSave = async (
    useDataSources: UseDataSource[],
    networkIds: number[],
    eventIds: number[]
  ) => {
    if (useDataSources?.length === 0) return
    const loopAddConfigs = async () => {
      let layerItems = []
      const promises = []
      useDataSources.forEach((useDataSource) => {
        promises.push(
          DataSourceManager.getInstance()
            .createDataSourceByUseDataSource(Immutable(useDataSource))
            .then(async (originDs: FeatureLayerDataSource | SceneLayerDataSource) => {
              const layerDefinition = originDs?.getLayerDefinition()

              const isNetwork = networkIds.findIndex((id) => id === layerDefinition.id) > -1
              const isEvent = eventIds.findIndex((id) => id === layerDefinition.id) > -1

              const layerUrl = originDs?.url
              const lrsMainUrl = GetLrsRequestUrl(layerUrl)
              let lrsFeatureUrl = ''
              if (isNetwork) {
                lrsFeatureUrl = lrsMainUrl + '/networkLayers/' + layerDefinition.id
              } else if (isEvent) {
                lrsFeatureUrl = lrsMainUrl + '/eventLayers/' + layerDefinition.id
              }

              if (lrsFeatureUrl.length > 0) {
                await CreateLrsLayer(originDs, useDataSource, lrsFeatureUrl, lrsMainUrl, isNetwork, isEvent).then(
                  (networkResults: ImmutableObject<LrsLayer>) => {
                    if (networkResults) {
                      layerItems = layerItems.concat([Immutable(networkResults)])
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
    onLayersAdded(layerItems)
  }

  const CreateLrsLayer = (
    originDs: FeatureLayerDataSource | SceneLayerDataSource,
    useDataSource: UseDataSource,
    lrsFeatureUrl: string,
    lrsMainUrl: string,
    isNetwork: boolean,
    isEvent: boolean
  ): Promise< ImmutableObject<LrsLayer>> => {
    return getFeatureLayer(originDs).then((featureLayer) => {
      const session = SessionManager.getInstance().getSessionByUrl(portalUrl)
      const currentToken = session && session.token ? session.token : ''

      let params = null
      if (currentToken) {
        params = { f: 'json', token: currentToken }
      } else {
        params = { f: 'json' }
      }

      return new Promise((resolve, reject) => {
        requestService({ method: 'POST', url: lrsFeatureUrl, params: params })
          .then((result: any) => {
            if (!result) {
              resolve(null)
            }

            const type = result.type as string
            if (type === 'esriLRSNetworkLayer' ||
              type === 'esriLRSPointEventLayer' || type === 'esriLRSLinearEventLayer') {
              const networkInfo: NetworkInfo = {} as NetworkInfo
              const eventInfo: EventInfo = {} as EventInfo

              // Get all fields from original datasource.
              const allFields = originDs?.getSchema()
              const allFieldsDetails = allFields?.fields ? Object.values(allFields?.fields) : []

              const serviceLayerId = result.id as number
              let layerType = LrsLayerType.nonLrs
              if (isNetwork) {
                const nextConfigId = `${Math.random()}`.slice(2)
                layerType = LrsLayerType.network
                networkInfo.networkUrl = lrsFeatureUrl

                const routeIdFieldName = result.routeIdFieldName as string
                networkInfo.routeIdFieldSchema = allFieldsDetails.find(
                  item => routeIdFieldName === item.name
                )

                const routeNameFieldName = result.routeNameFieldName as string
                networkInfo.routeNameFieldSchema = allFieldsDetails.find(
                  item => routeNameFieldName === item.name
                )

                const fromDateFieldName = result.fromDateFieldName as string
                networkInfo.fromDateFieldSchema = allFieldsDetails.find(
                  item => fromDateFieldName === item.name
                )

                const toDateFieldName = result.toDateFieldName as string
                networkInfo.toDateFieldSchema = allFieldsDetails.find(
                  item => toDateFieldName === item.name
                )

                networkInfo.measurePrecision = result.measurePrecision
                networkInfo.unitsOfMeasure = result.unitsOfMeasure
                networkInfo.supportsLines = result.supportsLines
                networkInfo.lineIdFieldName = result.lineIdFieldName
                networkInfo.lineNameFieldName = result.lineNameFieldName
                networkInfo.lineOrderFieldName = result.lineOrderFieldName

                const objectIdFieldName = featureLayer?.objectIdField
                const globalIdFieldName = featureLayer?.globalIdField
                const layerHasChangeTracking = featureLayer?.editFieldsInfo

                const shapeLengthField = allFieldsDetails.find(
                  item => item.name === 'Shape__Length'
                )

                const nonLrsFields = allFieldsDetails

                const attributeFields: AttributeFieldSettings[] = []
                nonLrsFields.forEach((fieldInfo) => {
                  let checked = true
                  const name = fieldInfo?.name?.toLocaleLowerCase()
                  // guid, object id and edtior tracking fields to be unchecked by
                  if ((name === globalIdFieldName?.toLocaleLowerCase()) ||
                      (name === objectIdFieldName?.toLocaleLowerCase()) ||
                      (name === layerHasChangeTracking.creationDateField?.toLocaleLowerCase()) ||
                      (name === layerHasChangeTracking.creatorField?.toLocaleLowerCase()) ||
                      (name === layerHasChangeTracking.editDateField?.toLocaleLowerCase()) ||
                      (name === layerHasChangeTracking.editorField?.toLocaleLowerCase()) ||
                      (name === shapeLengthField?.name?.toLocaleLowerCase())) {
                    checked = false
                  }
                  const attributeSetting: AttributeFieldSettings = {
                    field: fieldInfo,
                    enabled: checked,
                    editable: true,
                    description: ''
                  }
                  attributeFields.push(attributeSetting)
                })

                networkInfo.attributeFields = attributeFields

                const eventsList = []
                const resultEventLayers = result.eventLayers
                if (resultEventLayers.length > 0) {
                  resultEventLayers.forEach(element => {
                    eventsList.push(element.name)
                  })
                }
                networkInfo.lrsNetworkId = result.lrsNetworkId
                networkInfo.eventLayers = eventsList
                networkInfo.objectIdFieldName = objectIdFieldName
                networkInfo.outputPointDsId = `${widgetId}_output_point_${nextConfigId}`
              } else if (isEvent) {
                layerType = LrsLayerType.event
                eventInfo.eventUrl = lrsFeatureUrl
                eventInfo.fromDateFieldName = result.fromDateFieldName
                eventInfo.toDateFieldName = result.toDateFieldName
                eventInfo.derivedFromMeasureFieldName = result.derivedFromMeasureFieldName
                eventInfo.derivedRouteIdFieldName = result.derivedRouteIdFieldName
                eventInfo.derivedRouteNameFieldName = result.derivedRouteNameFieldName
                eventInfo.derivedToMeasureFieldName = result.derivedToMeasureFieldName
                eventInfo.fromReferentLocationFieldName = result.fromReferentLocationFieldName
                eventInfo.fromReferentMethodFieldName = result.fromReferentMethodFieldName
                eventInfo.fromReferentOffsetFieldName = result.fromReferentOffsetFieldName
                eventInfo.toReferentLocationFieldName = result.toReferentLocationFieldName
                eventInfo.toReferentMethodFieldName = result.toReferentMethodFieldName
                eventInfo.toReferentOffsetFieldName = result.toReferentOffsetFieldName
                eventInfo.locErrorFieldName = result.locErrorFieldName
                eventInfo.eventIdFieldName = result.eventIdFieldName
                eventInfo.routeIdFieldName = result.routeIdFieldName
                eventInfo.routeNameFieldName = result.routeNameFieldName
                eventInfo.fromMeasureFieldName = result.fromMeasureFieldName
                eventInfo.toRouteIdFieldName = result.toRouteIdFieldName
                eventInfo.toRouteNameFieldName = result.toRouteNameFieldName
                eventInfo.toMeasureFieldName = result.toMeasureFieldName
                eventInfo.canSpanRoutes = result.canSpanRoutes

                const eventLrsFields = [
                  eventInfo.fromDateFieldName,
                  eventInfo.toDateFieldName,
                  eventInfo.derivedFromMeasureFieldName,
                  eventInfo.derivedRouteIdFieldName,
                  eventInfo.derivedRouteNameFieldName,
                  eventInfo.derivedToMeasureFieldName,
                  eventInfo.fromReferentLocationFieldName,
                  eventInfo.fromReferentMethodFieldName,
                  eventInfo.fromReferentOffsetFieldName,
                  eventInfo.toReferentLocationFieldName,
                  eventInfo.toReferentMethodFieldName,
                  eventInfo.toReferentOffsetFieldName,
                  eventInfo.locErrorFieldName,
                  eventInfo.eventIdFieldName,
                  eventInfo.routeIdFieldName,
                  eventInfo.routeNameFieldName,
                  eventInfo.fromMeasureFieldName,
                  eventInfo.toRouteIdFieldName,
                  eventInfo.toRouteNameFieldName,
                  eventInfo.toMeasureFieldName
                ]

                const objectIdFieldName = featureLayer?.objectIdField
                const globalIdFieldName = featureLayer?.globalIdField
                const layerHasChangeTracking = featureLayer?.editFieldsInfo

                const excludedFields = [
                  objectIdFieldName,
                  globalIdFieldName
                ]

                if (layerHasChangeTracking) {
                  excludedFields.push(layerHasChangeTracking.creationDateField)
                  excludedFields.push(layerHasChangeTracking.creatorField)
                  excludedFields.push(layerHasChangeTracking.editDateField)
                  excludedFields.push(layerHasChangeTracking.editorField)
                }

                // Convert both the array elements and the search value to lowercase
                const lowerCaseEventLrsFields = eventLrsFields.map(element => isDefined(element) ? element.toLowerCase() : element)
                const lowerCaseExcludedFields = excludedFields.map(element => isDefined(element) ? element.toLowerCase() : element)

                eventInfo.lrsFields = allFieldsDetails.filter((item) =>
                  lowerCaseEventLrsFields.includes(item.name.toLowerCase())
                )

                const nonLrsFields = allFieldsDetails.filter(
                  (item) =>
                    !lowerCaseEventLrsFields.includes(item.name.toLowerCase()) &&
                !lowerCaseExcludedFields.includes(item.name.toLowerCase())
                )

                const attributeFields: AttributeFieldSettings[] = []
                nonLrsFields.forEach((fieldInfo) => {
                  const attributeSetting: AttributeFieldSettings = {
                    field: fieldInfo,
                    enabled: true,
                    editable: true,
                    description: ''
                  }
                  attributeFields.push(attributeSetting)
                })

                eventInfo.attributeFields = attributeFields
                eventInfo.parentNetworkId = result.lrsNetworkId as number
              }

              // Create the network object.
              const layerInfo: LrsLayer = {
                id: originDs.id,
                serviceId: serviceLayerId,
                name: originDs.getLabel(),
                lrsUrl: lrsMainUrl,
                useDataSource: useDataSource as any,
                layerType: layerType,
                networkInfo: networkInfo || undefined,
                eventInfo: eventInfo || undefined,
                useFieldAlias: true
              }
              const lrsLayer: ImmutableObject<LrsLayer> = Immutable(Object.assign({}, layerInfo, { layerInfo }))
              resolve(lrsLayer)
            } else {
              resolve(null)
            }
          })
      })
    })
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
    onMapWidgetedChanged(useMapWidgetIds)
  }

  const clearSelection = React.useCallback(() => {
    setSelectedIndex(-1)
  }, [])

  const onShowNetworkPanel = (index: number) => {
    if (index === selectedIndex) {
      setSelectedIndex(-1)
    } else {
      setSelectedIndex(index)
    }
  }

  const isParentNetworkAvailable = (index: number): boolean => {
    const eventLayer = layers.at(index)
    if (isDefined(eventLayer) && isDefined(eventLayer.eventInfo) && eventLayer.layerType === LrsLayerType.event) {
      return layers.findIndex(layer => isDefined(layer.networkInfo) && layer.networkInfo.lrsNetworkId === eventLayer.eventInfo.parentNetworkId) > -1
    }

    return true
  }

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
                  name: TreeItemActionType.RenderOverrideItemDetailToggle
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

  return (
    <div
      ref={sidePopperTrigger}
      css={style}
      className={classNames('d-flex flex-column', { 'h-100': layers.length === 0 })}
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
              className={'w-100 text-dark'}
              type={'primary'}
              onClick={importAll}
              title={getI18nMessage('loadLayers')}
              aria-label={getI18nMessage('loadLayers')}
            >
              {getI18nMessage('loadLayers')}
            </Button>
          </SettingRow>
          {layers && layers.length > 0 && (
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
          {noNetworkLayers && (
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

      <SettingSection className={classNames('pt-0 border-0', { 'h-100': layers.length === 0 })}>
        <SettingRow>
          <div className="setting-ui-unit-list w-100">
            <List
              className="setting-ui-unit-list-exsiting"
              itemsJson={layers.map((item, index) => ({
                itemStateDetailContent: item,
                itemKey: `${index}`,
                itemStateChecked: selectedIndex === index,
                itemStateTitle: item.name,
                itemStateCommands: [
                  {
                    // label: getI18nMessage('remove'),
                    label: 'remove',
                    iconProps: () => ({ icon: IconClose, size: 12 }),
                    action: ({ data }: CommandActionDataType) => {
                      const { itemJsons: [currentItemJson] } = data
                      const index = +currentItemJson.itemKey
                      if (index === selectedIndex) { clearSelection() }
                      onLayerRemoved(index)
                    }
                  }
                ]
              })) as TreeItemType[]}
              renderOverrideItemDetailToggle={(actionData, refComponent) => {
                const { itemJsons } = refComponent.props
                const [currentItemJson] = itemJsons
                const accessible = isParentNetworkAvailable(+currentItemJson.itemKey)
                return !accessible
                  ? <Alert
                    buttonType='tertiary'
                    form='tooltip'
                    size='small'
                    type='error'
                    text={getI18nMessage('missingParentNetwork')}
                  />
                  : ''
              }}
              dndEnabled
              onUpdateItem={(actionData, refComponent) => {
                const { itemJsons } = refComponent.props
                const [, parentItemJson] = itemJsons as [TreeItemType, TreeItemsType]
                onLayerOrderChanged(parentItemJson.map(i => i.itemStateDetailContent))
              }}
              onClickItemBody={(actionData, refComponent) => {
                const { itemJsons: [currentItemJson] } = refComponent.props
                onShowNetworkPanel(+currentItemJson.itemKey)
              }}
              {...advancedActionMap}
            />
            {layers.length === selectedIndex && (
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
        </SettingRow>
         {layers.length === 0 && (
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
            title={getI18nMessage('layerConfig')}
          >
            <LayerItemConfig
              widgetId={widgetId}
              index={selectedIndex}
              total={layers.length}
              lrsLayer={layers[selectedIndex]}
              onLayerChanged={onLayerChanged}
            />
        </SidePopper>
      </SettingSection>
    </div>
  )
}
