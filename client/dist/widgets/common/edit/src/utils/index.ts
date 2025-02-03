import { type FeatureLayerDataSource, type DataSource, Immutable, DataSourceManager } from 'jimu-core'
import { LayerHonorModeType, type LayersConfig } from '../config'
import { type JimuLayerView, LayerTypes, type JimuMapView, ADD_TO_MAP_DATA_ID_PREFIX, SHOW_ON_MAP_DATA_ID_PREFIX } from 'jimu-arcgis'
const INVISIBLE_FIELD = [
  'CreationDate',
  'Creator',
  'EditDate',
  'Editor',
  'GlobalID'
]

export const SUPPORTED_JIMU_LAYER_TYPES: string[] = [
  LayerTypes.FeatureLayer,
  LayerTypes.SceneLayer,
  LayerTypes.BuildingComponentSublayer,
  LayerTypes.OrientedImageryLayer,
  LayerTypes.SubtypeSublayer
]

/**
 * Function to check if ds have a specified capability.
 * @param {string} capabilities ds's capabilities
 * @param {string} capType capability to be checked
 * @returns {boolean}
 */
export const getDsCap = (capabilities: string, capType: string) => {
  if (capabilities) {
    return Array.isArray(capabilities)
      ? capabilities?.join().toLowerCase().includes(capType)
      : capabilities?.toLowerCase().includes(capType)
  } else {
    return false
  }
}

/**
 * Function to construct layer config from dataSource.
 * @param {DataSource} currentDs used dataSource
 * @returns {LayersConfig} edit layer config
 */
export const constructConfig = (currentDs: DataSource, parentViewId?: string): LayersConfig => {
  // Init capabilities
  const layerDefinition = (currentDs as FeatureLayerDataSource)?.getLayerDefinition()
  const allowGeometryUpdates = layerDefinition?.allowGeometryUpdates
  const capabilities = layerDefinition?.capabilities
  const create = getDsCap(capabilities, 'create')
  const update = getDsCap(capabilities, 'update')
  const deletable = getDsCap(capabilities, 'delete')
  // Fields operation
  const allFields = currentDs?.getSchema()
  let allFieldsDetails = allFields?.fields ? Object.values(allFields?.fields) : []
  // Filter uneditable field TODO
  const fieldsConfig = layerDefinition?.fields || []
  // According to the API, these five items do not displayed in the Editor by default
  allFieldsDetails = allFieldsDetails.filter(
    item => !INVISIBLE_FIELD.includes(item.name)
  )
  // Popup Setting is initially selected by default if the map has popup setting
  const popupSetting = (currentDs as FeatureLayerDataSource)?.layer?.formTemplate?.elements
  if (popupSetting) {
    const popupFieldNames = []
    popupSetting.forEach(ele => {
      const popupEle = ele as any
      if (popupEle?.elements?.length > 0) {
        popupEle?.elements.forEach(subEle => {
          if (subEle.fieldName) popupFieldNames.push(subEle.fieldName)
        })
      } else {
        if (popupEle.fieldName) popupFieldNames.push(popupEle.fieldName)
      }
    })
    allFieldsDetails = allFieldsDetails.filter(
      item => popupFieldNames.includes(item.name)
    )
  }
  // If there are too many columns, only the first 50 columns will be displayed by default
  if (allFieldsDetails?.length > 50) {
    allFieldsDetails = allFieldsDetails.slice(0, 50)
  }
  // Field editing is enabled by default
  const initGroupedFields = allFieldsDetails.map(item => {
    const orgField = fieldsConfig.find(field => field.name === item.jimuName)
    const defaultAuthority = orgField?.editable
    return { ...item, editAuthority: defaultAuthority, subDescription: item?.description || '', editable: defaultAuthority }
  })
  // useDs
  const useDataSources = {
    dataSourceId: currentDs.id,
    mainDataSourceId: currentDs.id,
    dataViewId: currentDs.dataViewId,
    rootDataSourceId: currentDs.getRootDataSource()?.id
  }
  const currentIMUseDs = Immutable(useDataSources)
  const layerItem: LayersConfig = {
    id: currentDs.id,
    name: currentDs.getLabel(),
    layerId: currentDs?.jimuChildId,
    useDataSource: currentIMUseDs,
    addRecords: create,
    deleteRecords: deletable,
    updateRecords: update,
    updateAttributes: update,
    updateGeometries: allowGeometryUpdates && update,
    featureSnapping: false,
    showFields: allFieldsDetails,
    groupedFields: initGroupedFields,
    layerHonorMode: LayerHonorModeType.Webmap,
    parentViewId
  }
  return layerItem
}

export function minusArray (array1, array2, key?: string) {
  const keyField = key || 'jimuName'
  const lengthFlag = array1.length > array2.length
  const arr1 = lengthFlag ? array1 : array2
  const arr2 = lengthFlag ? array2 : array1
  return arr1.filter(item => {
    const hasField = arr2.some(ele => {
      return ele?.[keyField] === item?.[keyField]
    })
    return !hasField
  })
}

export async function getAllLayersConfig (layersConfig, mapViewsConfig, jimuMapView: JimuMapView, isGeoMode: boolean): Promise<LayersConfig[]> {
  let allLayersConfig
  if (isGeoMode) {
    const mapLayersConfig = await getAllMapLayersConfig(mapViewsConfig?.asMutable({ deep: true }), jimuMapView)
    allLayersConfig = mapLayersConfig
  } else {
    allLayersConfig = layersConfig
  }
  return allLayersConfig
}

async function getAllMapLayersConfig (mapViewsConfig, jimuMapView: JimuMapView) {
  if (!jimuMapView) return []
  const mapLayersConfig = []
  const jimuLayerViews = jimuMapView.jimuLayerViews
  const jimuMapViewId = jimuMapView.id
  const currentMapViewConfig = mapViewsConfig?.[jimuMapViewId] || {}
  const { layersConfig = [], customJimuLayerViewIds = [], customizeLayers } = currentMapViewConfig
  // layerViewId is like 'widget_8-dataSource_1-18cae7226c6-layer-6'
  // layerConfig id is like 'dataSource_1-18cae7226c6-layer-6'
  for (const layerViewId in jimuLayerViews) {
    const viewInfo = jimuLayerViews[layerViewId]
    if (!SUPPORTED_JIMU_LAYER_TYPES.includes(viewInfo.layer?.type)) continue
    const { layerDataSourceId } = viewInfo
    // sync: Use layer's visible; not sync: Judging by the blacklist
    // sync: API will greyed out invisible layer, so always show the layer when async
    const isAddOrShow = layerViewId.includes(ADD_TO_MAP_DATA_ID_PREFIX) || layerViewId.includes(SHOW_ON_MAP_DATA_ID_PREFIX)
    const shouldShow = (!isAddOrShow && customizeLayers) ? customJimuLayerViewIds.includes(layerViewId) : true
    if (!shouldShow) continue
    const prefixIndex = layerViewId.indexOf('-')
    const layerViewConfigId = layerViewId.substring(prefixIndex + 1)
    const haveLayerConfig = layersConfig.find(item => item.id === layerViewConfigId)
    // When the setting config is available, use the runtime field information and other config.
    // When there is no setting config, use the ds of runtime to create a new config directly.
    let layerDs = viewInfo?.getLayerDataSource() || DataSourceManager.getInstance().getDataSource(layerDataSourceId)
    if (!layerDs) {
      layerDs = await viewInfo.createLayerDataSource()
    }
    if (!layerDs) continue
    const newLayerConfigItem = constructConfig(layerDs)
    if (haveLayerConfig) {
      // If the information related to ds changes, the latest config is used.
      const diffArray = minusArray(newLayerConfigItem.showFields, haveLayerConfig.showFields)
      if (diffArray.length !== 0) {
        if (shouldShow) {
          const newLayerConfig = {
            ...haveLayerConfig,
            name: newLayerConfigItem.name,
            useDataSource: newLayerConfigItem.useDataSource,
            showFields: newLayerConfigItem.showFields
          }
          mapLayersConfig.push(newLayerConfig)
        }
      } else {
        if (shouldShow) mapLayersConfig.push(haveLayerConfig)
      }
    } else {
      // no 'haveLayerConfig', indicate it’s a new config from runtime
      if (shouldShow) mapLayersConfig.push(newLayerConfigItem)
    }
  }
  return mapLayersConfig
}

export function isSupportedJimuLayerView (jimuLayerView: JimuLayerView): boolean {
  if (!jimuLayerView || !jimuLayerView.type) {
    return false
  }
  const viewType = jimuLayerView.layer.type
  // Some BuildingComponentSublayer doesn't have layer view, so need to check jimuLayerView.view here.
  // Note, we only check jimuLayerView for BuildingComponentSublayer and don't need to check jimuLayerView.view
  // if layer is not BuildingComponentSublayer because sub feature layer doesn't have layer view.
  const isViewPass = (viewType !== LayerTypes.BuildingComponentSublayer) || (viewType === LayerTypes.BuildingComponentSublayer && jimuLayerView.view)
  const isValid = SUPPORTED_JIMU_LAYER_TYPES.includes(viewType) && isViewPass
  return !!isValid
}

/**
* Sort jimuLayerViews according to the rendering order of the layer in the map.
* Note that this method does not modify the passed jimuLayerViews, but returns a sorted array.
* @param jimuLayerViews
*/
export function sortJimuLayerViews (jimuLayerViews: JimuLayerView[]): JimuLayerView[] {
  const sortedJimuLayerViews = jimuLayerViews.slice()

  sortedJimuLayerViews.sort((jimuLayerView1, jimuLayerView2) => {
    const hierarchyLevel1 = jimuLayerView1?.hierarchyLevel
    const hierarchyLevel2 = jimuLayerView2?.hierarchyLevel
    if (hierarchyLevel1 && hierarchyLevel2) {
      return compareHierarchyLevel(hierarchyLevel1, hierarchyLevel2)
    }
    return 0
  })

  return sortedJimuLayerViews
}

/**
* If version1 < version2, return -1.
* If version1 > version2, return 1.
* If version1 == version2, return 0.
* @param version1 like '0.3.4'
* @param version2 like '1.4.5.3'
* @returns
*/
function compareHierarchyLevel (version1: string, version2: string) {
  const numbers1 = version1.split('.').map(item => parseInt(item))
  const numbers2 = version2.split('.').map(item => parseInt(item))
  while (numbers1.length > 0 && numbers2.length > 0) {
    const num1 = numbers1.shift()
    const num2 = numbers2.shift()
    if (num1 < num2) {
      return -1
    } else if (num1 > num2) {
      return 1
    }
  }

  if (numbers1.length > 0) {
    return 1
  }
  if (numbers2.length > 0) {
    return -1
  }
  return 0
}
