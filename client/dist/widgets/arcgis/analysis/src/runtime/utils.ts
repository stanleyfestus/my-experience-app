import {
  type SupportedLayer,
  getServiceName,
  isEmptyDataItem,
  type ConvertJobParamsToToolDataOptions,
  convertJobParamsToToolData as analysisConvertJobParamsToToolData,
  generateSelectedLayersKey,
  FeatureCollectionResultKey
} from '@arcgis/analysis-shared-utils'
import { type GPFeatureRecordSetLayer, type AnalysisToolDataItem, type AnalysisToolInfo, type AnalysisToolUI, type AnalysisToolUIParam, AnalysisToolParamDirection, type AnalysisToolParam, AnalysisToolUICurrentVersion, AnalysisToolParamDataType, type AnalysisToolUIRule, type AnalysisToolData, type LocaleItem, SerializationType, type FeatureCollection } from '@arcgis/analysis-ui-schema'
import { type DataSourceJson, DataSourceTypes, dataSourceUtils, type ServiceDefinition, ServiceManager, SupportedLayerServiceTypes, getAppStore, SessionManager, DataSourceManager, Immutable, uuidv1, DataSourcesChangeMessage, DataSourcesChangeType, MessageManager, portalUrlUtils, loadArcGISJSAPIModules, loadArcGISJSAPIModule, type hooks, type ImmutableObject } from 'jimu-core'
import { type CustomToolOutput, type StandardToolOutput, type ToolConfig, ToolType, type HistoryItemWithDs, type FailedLayer, type CustomToolParam } from '../config'
import { type IItem } from '@esri/arcgis-rest-portal'
import { type FeatureLayerDataSource, dataSourceJsonCreator, type DataSource, type FeatureLayerDataSourceConstructorOptions } from 'jimu-core/data-source'
import { React, SupportedItemTypes as JimuSupportedItemTypes, esri } from 'jimu-core'
import { depthTraversalProcessingValue, isLayerInputType, isNumberInput, resultValueIsFeatureCollectionJson, resultValueIsFeatureLayer, resultValueIsFeatureSet } from '../utils/util'
import { type JimuMapView, zoomToUtils, ADD_TO_MAP_DATA_ID_PREFIX, type JimuLayerView } from 'jimu-arcgis'
import { type ArcGISRequestError } from '@esri/arcgis-rest-request'

export function getNextResultDsId (widgetId: string, order: number): string {
  return `analysis-${widgetId}-${order}-${uuidv1()}`
}

export function getLayerUrlByServiceDefinition (serviceUrl: string, serviceDefinition: ServiceDefinition) {
  const layers = (serviceDefinition?.layers || []).concat(serviceDefinition?.tables || [])
  const layerId = `${layers[0]?.id || 0}`
  return `${serviceUrl}/${layerId}`
}

export async function getLayerInfoFromSingleLayerFeatureService (serviceUrl: string, serviceDefinition: ServiceDefinition) {
  const layers = (serviceDefinition?.layers || []).concat(serviceDefinition?.tables || [])
  // If the single layer is not feature layer or table, will still create feature service data source.
  if (layers.length === 1 && ((serviceDefinition?.layers?.length === 1 && serviceDefinition?.layers?.[0]?.type === SupportedLayerServiceTypes.FeatureLayer) || (serviceDefinition?.tables?.length === 1))) {
    const url = getLayerUrlByServiceDefinition(serviceUrl, serviceDefinition)
    const layerDefinition = await ServiceManager.getInstance().fetchServiceInfo(url).then(res => res.definition)
    return { url, layerDefinition }
  }
  return null
}

export async function getDsJsonFromArcGISService (url: string, dsId: string): Promise<DataSourceJson> {
  try {
    // remove timeout logic since if need login and user login slowly, it will be very easy to be timeout
    const res = await ServiceManager.getInstance().fetchServiceInfo(url)
    const serviceDefinition = res.definition

    let dsJsonUrl = url
    let layerDefinition = serviceDefinition

    /**
     * For feature service, if it is single layer but the url is not end up with layer id, we need to find the single layer and create a feature layer data source, not feature service data source.
     * This is to make single layer feature service item to support 'set filter' action and 'view in table' action.
     */
    if (dataSourceUtils.isSupportedWholeArcGISService(url) && dataSourceJsonCreator.getDataSourceTypeFromArcGISWholeServiceUrl(url) === DataSourceTypes.FeatureService) {
      const serviceUrl = url.split('?')[0].replace(/^http:/, 'https:').replace(/\/$/, '')
      const layerInfo = await getLayerInfoFromSingleLayerFeatureService(serviceUrl, serviceDefinition)
      if (layerInfo) {
        dsJsonUrl = layerInfo.url
        layerDefinition = layerInfo.layerDefinition
      }
    }

    return getSingleDsJsonFromArcGISServiceDefinition(dsId, dsJsonUrl, layerDefinition)
  } catch (error) {
    return Promise.reject(error)
  }
}

function getSingleDsJsonFromArcGISServiceDefinition (dsId: string, url: string, serviceDefinition: ServiceDefinition): DataSourceJson {
  const dsJson: DataSourceJson = dataSourceJsonCreator.createDataSourceJsonByLayerDefinition(dsId, serviceDefinition, url)?.asMutable({ deep: true })

  if (!dsJson) {
    throw new Error('Failed fetch')
  } else {
    return dsJson
  }
}

export function urlIsMapServiceLayerOutput (url: string) {
  return url?.includes('/MapServer/jobs/')
}

const getDataSourceJson = async (result: GPFeatureRecordSetLayer, widgetId: string, dsOrderRef: React.MutableRefObject<number>) => {
  // for featureSet output, they will be replaced with FeatureCollectionResultKey when store history to local
  // so after refresh, the result will be FeatureCollectionResultKey, should show error alert in history result
  if ((result as any) === FeatureCollectionResultKey) {
    return Promise.reject(new Error())
  }
  const dsId = getNextResultDsId(widgetId, dsOrderRef.current)
  if (resultValueIsFeatureSet(result) || resultValueIsFeatureLayer(result) || resultValueIsFeatureCollectionJson(result)) {
    return {
      id: dsId,
      type: DataSourceTypes.FeatureLayer
    }
  } else if (typeof result === 'object' && 'url' in result && !isEmptyDataItem(result.url)) {
    // for raster data
    if ('format' in result) {
      return
    }
    if (!dataSourceUtils.isSupportedArcGISService(result.url)) {
      return
    }
    // for map service layer output
    if (urlIsMapServiceLayerOutput(result.url)) {
      return {
        id: dsId,
        type: DataSourceTypes.MapService,
        url: result.url
      }
    }
    return getDsJsonFromArcGISService(result.url, dsId)
  } else if (typeof result === 'object' && 'itemId' in result && !isEmptyDataItem(result.itemId)) {
    const portalUrl = getAppStore().getState().portalUrl
    const item: IItem = await esri.restPortal.getItem(result.itemId, {
      portal: portalUrlUtils.getPortalRestUrl(portalUrl),
      authentication: SessionManager.getInstance().getSessionByUrl(portalUrl)
    }).catch(err => {
      return SessionManager.getInstance().handleAuthError(err, false) as any
    })

    if (item.type === JimuSupportedItemTypes.FeatureService) {
      const serviceUrl = item.url.split('?')[0].replace(/^http:/, 'https:').replace(/\/$/, '')
      const serviceDefinition = await ServiceManager.getInstance().fetchServiceInfo(serviceUrl).then(res => res.definition)

      let url: string
      let layerDefinition: ServiceDefinition
      const dsJsonPartial: Partial<DataSourceJson> = {
        itemId: item.id,
        portalUrl: portalUrl
      }

      if (dataSourceUtils.isSupportedSingleArcGISLayerService(item.url)) {
        url = item.url
        layerDefinition = serviceDefinition
      } else {
        const layers = (serviceDefinition?.layers || []).concat(serviceDefinition?.tables || [])
        const layerInfo = await getLayerInfoFromSingleLayerFeatureService(serviceUrl, serviceDefinition)
        if (layerInfo) {
          url = layerInfo.url
          layerDefinition = layerInfo.layerDefinition
          dsJsonPartial.sourceLabel = item.title || layers[0]?.name
        }
      }
      if (url && layerDefinition) {
        return dataSourceJsonCreator.createDataSourceJsonByLayerDefinition(dsId, layerDefinition, url)?.merge(dsJsonPartial)?.asMutable({ deep: true })
      }
    }

    return Promise.resolve(dataSourceJsonCreator.createDataSourceJsonByItemInfo(dsId, item, portalUrl).asMutable({ deep: true }))
  }
}

// for Date Object, isEmptyDataItem method will return true, because it use 'for in' to check if every property is empty
export function removeEmptyResults (results: __esri.ParameterValue[]) {
  return results.filter((result) => (result?.value instanceof Date) || !isEmptyDataItem(result?.value as AnalysisToolDataItem))
}

export const parseFailedLayerError = (value: __esri.ParameterValue['value'], error: ArcGISRequestError, defaultName?: string): FailedLayer => {
  const failedLayerObject: FailedLayer = {
    layerName: defaultName || '',
    reasonForFailure: ''
  }
  // parse the name from the URL.
  if (value !== null && typeof value === 'object' && 'url' in value && typeof value.url === 'string') {
    failedLayerObject.layerName = getServiceName(value.url ?? '')
  }

  if (error.code === 400) {
    // then it is an invalid URL
    failedLayerObject.reasonForFailure = 'invalidUrl'
  } else if (error.name === 'identity-manager:not-authorized') {
    // then it is an issue with sharing/permissions
    failedLayerObject.reasonForFailure = 'noAccess'
  } else {
    failedLayerObject.reasonForFailure = 'defaultLayerFailure'
  }
  return failedLayerObject
}

export async function createDsByResults (widgetId: string, toolType: ToolType, results: __esri.ParameterValue[], output: ToolConfig['config']['output'], history: HistoryItemWithDs, dsOrderRef: React.MutableRefObject<number>) {
  const createDsAndStoreInMap = async (id: string, value: __esri.ParameterValue['value'], paramName: string) => {
    if (value !== FeatureCollectionResultKey && (!value || ['boolean', 'number', 'string'].includes(typeof value) || value instanceof Date)) {
      return Promise.resolve()
    }
    try {
      const dsJson = await getDataSourceJson(value as GPFeatureRecordSetLayer, widgetId, dsOrderRef)
      dsOrderRef.current++
      if (dsJson) {
        let constructorOptions: FeatureLayerDataSourceConstructorOptions
        dsJson.disableExport = toolType === ToolType.Custom
          ? !((output as CustomToolOutput).allowExport[paramName] === undefined ? true : (output as CustomToolOutput).allowExport[paramName])
          : !(output as StandardToolOutput).allowExportResults
        // TODO maybe can delete this, check this after component support custom tool
        if (resultValueIsFeatureSet(value)) {
          // const FeatureLayer: typeof __esri.FeatureLayer = await loadArcGISJSAPIModule('esri/layers/FeatureLayer')
          const apiModules = await loadArcGISJSAPIModules(['esri/layers/FeatureLayer', 'esri/Graphic', 'esri/layers/support/Field'])
          const FeatureLayer: typeof __esri.FeatureLayer = apiModules[0]
          const Graphic: typeof __esri.Graphic = apiModules[1]
          const Field: typeof __esri.Field = apiModules[2]
          constructorOptions = {
            id: dsJson.id,
            dataSourceJson: Immutable({ ...dsJson, sourceLabel: paramName }),
            layer: new FeatureLayer({
              source: (value.features || []).map(f => {
                try {
                  return Graphic.fromJSON(f)
                } catch (error) {
                  return f
                }
              }),
              fields: (value.fields || []).map(f => {
                try {
                  return Field.fromJSON(f)
                } catch (error) {
                  return f
                }
              }),
              title: paramName
            })
          } as FeatureLayerDataSourceConstructorOptions
        } else if (resultValueIsFeatureCollectionJson(value)) {
          const apiModules = await loadArcGISJSAPIModules(['esri/layers/FeatureLayer', 'esri/Graphic', 'esri/layers/support/Field'])
          const FeatureLayer: typeof __esri.FeatureLayer = apiModules[0]
          const Graphic: typeof __esri.Graphic = apiModules[1]
          const Field: typeof __esri.Field = apiModules[2]
          const { featureSet, layerDefinition } = value as unknown as FeatureCollection
          constructorOptions = {
            id: dsJson.id,
            dataSourceJson: Immutable({ ...dsJson, sourceLabel: paramName }),
            layer: new FeatureLayer({
              source: featureSet?.features?.map(f => Graphic.fromJSON(f)) || [],
              objectIdField: layerDefinition?.objectIdField,
              fields: layerDefinition?.fields?.map(f => Field.fromJSON(f)),
              sourceJSON: layerDefinition
            })
          } as FeatureLayerDataSourceConstructorOptions
        } else if (resultValueIsFeatureLayer(value)) {
          constructorOptions = {
            id: dsJson.id,
            dataSourceJson: Immutable({ ...dsJson, sourceLabel: paramName }),
            layer: value
          } as FeatureLayerDataSourceConstructorOptions
        } else {
          if (!dsJson.sourceLabel) {
            dsJson.sourceLabel = paramName
          }
          constructorOptions = {
            id: dsJson.id,
            dataSourceJson: Immutable(dsJson)
          } as FeatureLayerDataSourceConstructorOptions
        }

        if (toolType !== ToolType.Custom) {
          const featureServiceName = dataSourceUtils.getLabelFromArcGISServiceUrl((value as any)?.url)
          // if has single layer, use feature service name
          // if has multiple layers, use feature service name-layer name
          const label = results.length === 1 ? featureServiceName : `${featureServiceName}-${dsJson.sourceLabel}`
          constructorOptions.dataSourceJson = constructorOptions.dataSourceJson.set('label', label)
        }

        await DataSourceManager
          .getInstance()
          .createDataSource(constructorOptions)
          .then((ds) => ds.isDataSourceSet() && !ds.areChildDataSourcesCreated() ? ds.childDataSourcesReady().then(() => ds) : ds)
          .then((ds) => {
            const dataSourcesChangeMessage = new DataSourcesChangeMessage(widgetId, DataSourcesChangeType.Create, [ds])
            MessageManager.getInstance().publishMessage(dataSourcesChangeMessage)
            if (!history.dsMap) {
              history.dsMap = new Map([[id, ds]])
            } else {
              history.dsMap.set(id, ds)
            }
          })
      }
    } catch (error) {
      const errorInfo = parseFailedLayerError(value, error, paramName)
      if (!history.dsCreateError) {
        history.dsCreateError = new Map([[id, errorInfo]])
      } else {
        history.dsCreateError.set(id, errorInfo)
      }
    }
  }
  const promises: Array<Promise<void>> = []
  results?.forEach((result, index) => {
    const value = result.value

    depthTraversalProcessingValue(value, `${index}`, (id: string, v: __esri.ParameterValue['value']) => {
      promises.push(createDsAndStoreInMap(id, v, result.paramName))
    })
  })
  await Promise.allSettled(promises)
  return {
    dsMap: history.dsMap,
    dsCreateError: history.dsCreateError
  }
}

export function jobDidComplete (jobStatus?: string) {
  const completedStatuses = [
    'job-failed',
    'job-cancelled',
    'job-deleted',
    'job-succeeded',
    'job-timed-out'
  ]
  return jobStatus !== undefined && completedStatuses.includes(jobStatus)
}

export function parameterIsInputGPValueTable (param: AnalysisToolParam) {
  return param.direction === AnalysisToolParamDirection.Input && param.dataType === AnalysisToolParamDataType.GPValueTable
}

export function getRulesOfParameters (parameters: AnalysisToolParam[]) {
  // must set `mapLayer` for field params use the value of their dependency
  const fieldParams = parameters?.filter((p) => p.dataType === AnalysisToolParamDataType.GPField || p.dataType === AnalysisToolParamDataType.GPMultiValueField) || []
  const rules = fieldParams.map((p) => {
    const { dependency } = p
    const dependsOn = parameters.find((p) => p.name === dependency)
    if (dependency && dependsOn) {
      return {
        ruleType: 'expression',
        expression: `$[Data].${dependsOn.name} NOT null`,
        destination: p.name,
        effectParams: {
          mapLayer: `$[Component].${dependsOn.name}.selectedLayers`
        }
      } as AnalysisToolUIRule
    }
    return null
  }).filter((r) => !!r)
  return rules
}

export function getParameterUIJson (param: AnalysisToolParam, translate: ReturnType<typeof hooks.useTranslation>, portal: __esri.Portal, commonStrings: LocaleItem) {
  const uiParam: AnalysisToolUIParam = { name: param.name, label: param.displayName }
  const { enableSketch, hideBrowseButton: paramHideBrowseButton } = param as CustomToolParam
  const hideBrowseButton = !!paramHideBrowseButton
  // TODO check if anonymous user can see browse layers button later
  // const hideBrowseButton = !portal?.user || !!paramHideBrowseButton

  // for filter, will use component filter convert logic for types: featureClass, field and file. As for range, component did not support linear unit, so keep the old logic
  const filter = param.filter as any
  if (isLayerInputType(param.dataType) && param.dataType !== AnalysisToolParamDataType.GPRasterDataLayer) {
    return {
      ...uiParam,
      enableSketch: ([
        AnalysisToolParamDataType.GPFeatureRecordSetLayer,
        AnalysisToolParamDataType.GPMultiValueFeatureRecordSetLayer
      ] as AnalysisToolParamDataType[]).includes(param.dataType) && (enableSketch || enableSketch === undefined),
      hideBrowseButton
    }
  }
  const webToolsUnits = commonStrings?.webToolsUnits
  const arealUnits = commonStrings?.arealUnits
  let componentUnits = webToolsUnits
  if (param.dataType === AnalysisToolParamDataType.GPLinearUnit || param.dataType === AnalysisToolParamDataType.GPMultiValueLinearUnit) {
    componentUnits = webToolsUnits
  } else if (param.dataType === AnalysisToolParamDataType.GPArealUnit || param.dataType === AnalysisToolParamDataType.GPMultiValueArealUnit) {
    componentUnits = arealUnits
  }
  if (param.dataType === AnalysisToolParamDataType.GPLinearUnit || param.dataType === AnalysisToolParamDataType.GPArealUnit) {
    if (!param.choiceList && componentUnits) {
      uiParam.choiceListLabels = componentUnits as { [key: string]: string }
      uiParam.choiceList = Object.keys(componentUnits)
    }
    if (filter?.type === 'range') {
      const { minimum, maximum } = filter ?? {}
      uiParam.maximum = maximum
      uiParam.minimum = minimum
    }
    return uiParam
  }
  if ((param.dataType === AnalysisToolParamDataType.GPMultiValueLinearUnit || param.dataType === AnalysisToolParamDataType.GPMultiValueArealUnit) && componentUnits) {
    uiParam.UIparameterInfos = [
      {
        choiceList: Object.keys(componentUnits),
        choiceListLabels: componentUnits as { [key: string]: string },
        name: ''
      }
    ]
  }
  if (isNumberInput(param.dataType)) {
    if (filter?.type === 'range') {
      const { minimum, maximum } = filter ?? {}
      uiParam.max = maximum
      uiParam.min = minimum
    }
    return uiParam
  }
  if (parameterIsInputGPValueTable(param)) {
    // A web tool will always have the default value for value table as array of arrays
    // Need to transform it into the column format so the UI can handle it
    const applyValueTableDefaultValue = (defaultValue: AnalysisToolDataItem[], parameterInfos?: AnalysisToolParam[]) => {
      const formattedDefaultValue: Array<{ [key: string]: AnalysisToolDataItem }> = []
      // [[1,2], [3,4]] -> [{long: 1, double: 2}, {long: 3, double: 4}]
      defaultValue.forEach((singleDefault) => {
        const columnNames: { [key: string]: AnalysisToolDataItem } = {}
        // Build keys for each parameter in the table
        parameterInfos?.forEach((info, index) => {
          columnNames[info.name] = (singleDefault as AnalysisToolDataItem[])?.[index] ?? undefined // Force a default value to undefined if null
        })
        formattedDefaultValue.push(columnNames)
      })
      return formattedDefaultValue
    }
    if (param.parameterInfos?.length) {
      const parameterInfoNames = param.parameterInfos?.map((parameterInfo) => parameterInfo.name)
      // Duplicate parameter infos are purposely not handled and passed through to the unsupported input
      const hasDuplicateParameterInfos = parameterInfoNames?.length !== new Set(parameterInfoNames).size
      if (!hasDuplicateParameterInfos && Array.isArray(param.defaultValue)) {
        uiParam.defaultValue = applyValueTableDefaultValue(<AnalysisToolDataItem[]>param.defaultValue, param.parameterInfos)
      } else if (hasDuplicateParameterInfos) {
        // Set the serializationType to "stringValue" to correctly serialize the unsupported array of array default
        // value when submitted. If an array of arrays is passed to the geoprocessor's submit/execute method, it will
        // stringify each element of the array as well as the whole array, which will cause the tool to fail.
        uiParam.serializationType = SerializationType.string
      }
      uiParam.UIparameterInfos = param.parameterInfos.map((p) => getParameterUIJson(p, translate, portal, commonStrings))
      uiParam.UIparameterRules = getRulesOfParameters(param.parameterInfos)
      return uiParam
    }
  }
  return uiParam
}

export function getDefaultToolUIJson (toolJson: AnalysisToolInfo, translate: ReturnType<typeof hooks.useTranslation>, portal: __esri.Portal, commonStrings: LocaleItem): AnalysisToolUI {
  // Analysis UI, parameters no category are added to a block by default, parameters have category are grouped by category info
  const inputUIParameters = new Map<string, AnalysisToolUIParam[]>([['', []]])
  const groupUIParameters = (param: AnalysisToolUIParam, category: string) => {
    const paramsInSameGroup = inputUIParameters.get(category)
    if (paramsInSameGroup) {
      inputUIParameters.set(category, [...paramsInSameGroup, param])
    } else {
      inputUIParameters.set(category, [param])
    }
  }
  toolJson.parameters?.forEach((param: AnalysisToolParam) => {
    if (param.direction === AnalysisToolParamDirection.Input) {
      const uiParam = getParameterUIJson(param, translate, portal, commonStrings)
      groupUIParameters(uiParam, param.category)
    }
  })

  const rules = getRulesOfParameters(toolJson?.parameters)

  const hasInputUIParameters = Array.from(inputUIParameters).map(item => item[1]).flat().length > 0

  const toolUIJson = {
    toolName: toolJson.name,
    version: AnalysisToolUICurrentVersion,
    UIparameters: hasInputUIParameters
      ? Array.from(inputUIParameters).map(([category, params]) => {
        return {
          componentName: 'analysis-block',
          UIparameters: params,
          label: category
        } as AnalysisToolUIParam
      })
      : [],
    rules
  }
  return toolUIJson
}

function isDrawLayer (layer: __esri.Layer) {
  if (!layer.id) {
    return false
  }
  return layer.id.includes('jimu-draw-layer-') || layer.id.includes('jimu-draw-measurements-layer-')
}

// TODO: Make use of the added / removed arrays in the reactive utils to be more efficient
// https://codepen.io/kevindoshier/pen/wvEvxEN?editors=1111
export const getAnalysisMapLayersFromMap = async (map: __esri.Map, collectionRef: React.MutableRefObject<typeof __esri.Collection>): Promise<any[]> => {
  if (!map) {
    return []
  }
  try {
    const { layers, tables }: { layers: __esri.Collection, tables: __esri.Collection } = map
    let Collection: typeof __esri.Collection
    if (collectionRef.current) {
      Collection = collectionRef.current
    } else {
      Collection = await loadArcGISJSAPIModule('esri/core/Collection') as typeof __esri.Collection
    }
    const mapNotesLayers = new Collection()
    const mapImageLayers = new Collection()
    const allOtherLayersAndSubLayers = new Collection()
    layers.forEach(layer => {
      if (layer.type === 'map-notes') {
        mapNotesLayers.add(layer)
      } else if (layer.type === 'map-image') {
        mapImageLayers.add(layer)
      } else if (layer.type === 'group') {
        // allLayers is a flattened collection of all subLayers, including nesting
        const flatLayers = layer.allLayers
        // Track sketch layers separately
        mapNotesLayers.addMany(flatLayers.filter((layer) => layer.type === 'map-notes'))
        // Track map image layers separately
        mapImageLayers.addMany(flatLayers.filter((layer) => layer.type === 'map-image'))
        // Add all other layers to the collection to pass to analysis
        allOtherLayersAndSubLayers.addMany(flatLayers.filter((layer) => layer.type !== 'map-notes' && layer.type !== 'group'))
      } else {
        allOtherLayersAndSubLayers.add(layer)
      }
    })
    // Reverse to match TOC
    const validLayers = allOtherLayersAndSubLayers.reverse()

    const allLayers = [
      ...mapNotesLayers.toArray(),
      ...mapImageLayers.toArray(),
      ...validLayers.toArray(),
      ...tables.toArray().reverse()
    ].filter((layer) => !isDrawLayer(layer))

    // analysis component won't load map image layers before get their subLayers, then they will get empty subLayers and will show empty in layer select panel
    // so we can load all layers before pass them to analysis component to avoid issues caused by their code change in future(eg: add other layer handle logic and not load them)
    await Promise.allSettled(allLayers.map(layer => layer.load() as Promise<any>))

    return allLayers
  } catch (error) {
    return []
  }
}

export const useAnalysisMapLayersFromMap = (map: __esri.Map) => {
  const collectionRef = React.useRef<typeof __esri.Collection>()
  const [layers, setLayers] = React.useState<any[]>()
  const updateAnalysisMapLayers = () => {
    getAnalysisMapLayersFromMap(map, collectionRef).then((lys) => {
      setLayers(lys || [])
    }).catch(() => {
      setLayers([])
    })
  }
  React.useEffect(() => {
    updateAnalysisMapLayers()
    if (!map) {
      return
    }
    const eventHandler = map.layers.on('change', (e) => {
      updateAnalysisMapLayers()
    })
    return () => {
      eventHandler?.remove()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])
  return layers
}

/**
 * @param dsMapKey the key in dsMap
 * @returns the index of result that target data source belongs to
 */
export const getCustomToolResultIndexByDsMapKey = (dsMapKey: string) => {
  return Number(dsMapKey.split('-')[0])
}

export const getCustomToolOutputParamNameByDsId = (dsMap: Map<string, DataSource>, targetDsId: string, results: __esri.ParameterValue[]) => {
  let targetDsKey: string
  dsMap.forEach((ds, key) => {
    if (ds.id === targetDsId) {
      targetDsKey = key
    }
  })
  if (!targetDsKey) {
    return
  }
  const targetDsMatchedResultIndex = getCustomToolResultIndexByDsMapKey(targetDsKey)
  return results[targetDsMatchedResultIndex]?.paramName
}

export const changeRendererForJimuLayerView = async (jimuLayerView: JimuLayerView, symbol: any, ds: DataSource) => {
  if (jimuLayerView) {
    if (symbol) {
      const apiModules = await loadArcGISJSAPIModules(['esri/renderers/SimpleRenderer', 'esri/symbols/support/jsonUtils'])
      const SimpleRenderer: typeof __esri.SimpleRenderer = apiModules[0]
      const jsonUtils: typeof __esri.symbolsSupportJsonUtils = apiModules[1]

      jimuLayerView.layer.renderer = new SimpleRenderer({ symbol: jsonUtils.fromJSON(symbol) })
    } else {
      const dsLayerRenderer = (ds as FeatureLayerDataSource).layer?.renderer
      const layerDefinitionRenderer = (ds as FeatureLayerDataSource).getLayerDefinition?.()?.drawingInfo?.renderer
      if (dsLayerRenderer) {
        jimuLayerView.layer.renderer = dsLayerRenderer
      } else if (layerDefinitionRenderer) {
        const jsonUtils: typeof __esri.supportJsonUtils = await loadArcGISJSAPIModule('esri/renderers/support/jsonUtils')
        jimuLayerView.layer.renderer = jsonUtils.fromJSON(layerDefinitionRenderer)
      }
    }
  }
}

export const addLayerToMapByDs = (ds: DataSource, currentJimuMapView: JimuMapView, toolId: string, output?: CustomToolOutput, paramName?: string) => {
  const targetLayerId = `${ADD_TO_MAP_DATA_ID_PREFIX}dataAction_${toolId}_${ds.id}`
  return currentJimuMapView.addLayerToMap(ds.id, targetLayerId).then((jimuLayerView) => {
    jimuLayerView.setRemoveableByMapTool(true)
    zoomToUtils.zoomTo(currentJimuMapView.view, jimuLayerView.layer, {
      padding: {
        left: 50,
        right: 50,
        top: 50,
        bottom: 50
      }
    })
    changeRendererForJimuLayerView(jimuLayerView, output?.symbol?.[paramName], ds)
  })
}

export const canDisplayAsLink = (value: __esri.ParameterValue['value']): value is __esri.DataFile => {
  return value != null && typeof value === 'object' && 'url' in value && typeof value.url === 'string'
}

export const resultHasItemId = (value: __esri.ParameterValue['value']): value is __esri.DataFile => {
  return value != null && typeof value === 'object' && 'itemId' in value && typeof value.itemId === 'string'
}

export const useShowToolDetail = (signIn: (toolInfo: ImmutableObject<ToolConfig>) => Promise<void>, toolInfo: ImmutableObject<ToolConfig>) => {
  const [showToolDetail, setShowToolDetail] = React.useState(false)
  const [showError, setShowError] = React.useState(false)
  React.useEffect(() => {
    signIn(toolInfo).then(() => {
      setShowToolDetail(true)
    }).catch(() => {
      setShowError(true)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { showToolDetail, showError }
}

/**
 * Add mapView, mapLayers, user for layer input parameters inner GPValueTable
 * @param parameterInfo
 * @param mapView
 * @param mapLayers
 * @param user
 * @returns
 */
export const convertParameterInfo = (parameterInfo: AnalysisToolParam, mapView: __esri.MapView, mapLayers: SupportedLayer[], user?: __esri.PortalUser) => {
  const { displayName, dataType } = parameterInfo
  const info: { [key: string]: any } = {
    ...parameterInfo,
    label: displayName
  }
  if (isLayerInputType(dataType)) {
    info.mapView = mapView
    info.mapLayers = mapLayers
    info.user = user
  }
  return info as AnalysisToolParam
}

export const convertParameterInfosOfGPValueTable = (parameterInfos: AnalysisToolParam[], mapView: __esri.MapView, mapLayers: SupportedLayer[], user?: __esri.PortalUser) => {
  if (!parameterInfos?.length) {
    return parameterInfos
  }
  return parameterInfos.map((info) => convertParameterInfo(info, mapView, mapLayers, user))
}

export const convertJobParamsToToolData = async (props: ConvertJobParamsToToolDataOptions) => {
  const { jobParams, uiOnlyParams, toolName, availableMapLayers, toolJSON } = props
  // selected layers for GPValueTable
  let valueTableSelectedLayers = [] as SupportedLayer[]
  let valueTableSelectedLayersConvertedParameters: AnalysisToolParam[] = []

  const hasValueTableParameters = !!toolJSON.parameters?.find((p) => parameterIsInputGPValueTable(p))

  // TODO temp fix for tool JSON has GPValueTable input parameters
  if (hasValueTableParameters) {
    const parametersToConvertPromises = toolJSON.parameters?.map(async (p) => {
      // since analysis did not handle with the layers inner GPValueTable parameters, convert the layers inner GPValueTable parameters here
      if (parameterIsInputGPValueTable(p)) {
        const { name, parameterInfos = [] } = p
        const vtJobParamsArr = jobParams[name] as Array<{ [key: string]: AnalysisToolDataItem } | AnalysisToolDataItem>
        const res = await Promise.allSettled(vtJobParamsArr.map((vtJobParams) => {
          return analysisConvertJobParamsToToolData({
            jobParams: vtJobParams as AnalysisToolData,
            uiOnlyParams,
            toolJSON: {
              name: '',
              displayName: '',
              parameters: parameterInfos
            },
            availableMapLayers: availableMapLayers,
            toolName
          })
        }))
        const newParameterInfos: Array<AnalysisToolParam & { selectedLayers?: SupportedLayer | SupportedLayer[] }> = parameterInfos.map((i) => ({ ...i }))
        res.forEach((r, index) => {
          if (r.status === 'fulfilled') {
            const { layers, convertedJobParams } = r.value
            valueTableSelectedLayers = [...valueTableSelectedLayers, ...layers]

            newParameterInfos.forEach((i) => {
              const pName = i.name
              const selectedLayersKey = generateSelectedLayersKey(pName)
              const selectedLayers = convertedJobParams[selectedLayersKey] as SupportedLayer[] | undefined
              let formattedSelectedLayers: SupportedLayer | SupportedLayer[] | undefined = selectedLayers
              if (selectedLayers?.length === 0) {
                formattedSelectedLayers = undefined
              } else if (selectedLayers?.length === 1) {
                formattedSelectedLayers = selectedLayers[0]
              }
              // selectedLayers must add to parameterInfo, so it can be passed to analysis-layer-input component,
              // otherwise analysis-layer-input component can't fill in the jobParams.
              i.selectedLayers = formattedSelectedLayers
            })
          }
          return vtJobParamsArr[index]
        })
        return { ...p, parameterInfos: newParameterInfos }
      }
      return p
    }) || []
    const res = await Promise.allSettled(parametersToConvertPromises)
    valueTableSelectedLayersConvertedParameters = res.map((r, i) => r.status === 'fulfilled' ? r.value : toolJSON.parameters[i])
  }
  const parameters = valueTableSelectedLayersConvertedParameters.length ? valueTableSelectedLayersConvertedParameters : toolJSON.parameters
  return analysisConvertJobParamsToToolData({
    jobParams: jobParams,
    uiOnlyParams: {},
    toolJSON: {
      ...toolJSON,
      parameters: parameters?.map((p) => {
        // TODO temp fix
        // when use convertJobParamsToToolData to convert jobParams to toolData, the GPValueTable type will be ignored
        // for GPBoolean type, it will use the parameters directly without no convert
        // so if parameter type is GPValueTable, convert to GPBoolean to make sure the tool data will be created correctly
        if (parameterIsInputGPValueTable(p)) {
          return { ...p, dataType: AnalysisToolParamDataType.GPBoolean }
        }
        return p
      })
    },
    availableMapLayers,
    toolName
  }).then((jobParamsAndLayers) => {
    return {
      valueTableSelectedLayersConvertedParameters,
      valueTableSelectedLayers,
      convertedJobParams: jobParamsAndLayers.convertedJobParams,
      layers: jobParamsAndLayers.layers
    }
  })
}
