import { type FeatureLayerDataSource, type DataSource, type UseDataSource, Immutable } from 'jimu-core'
import { LayerHonorModeType, ResponsiveType, SelectionModeType, type LayersConfig } from '../config'
import { type JimuLayerView, LayerTypes } from 'jimu-arcgis'

/**
 * Function to construct layer config from dataSource.
 * @param {DataSource} currentDs used dataSource
 * @param {boolean} isMapMode table widget is map mode
 * @param {(dsId: string) => string} getNewConfigId method to get config id in layer mode
 * @returns {LayersConfig} layer config
 */
export const constructConfig = (currentDs: DataSource, isMapMode?: boolean,
  getNewConfigId?: (dsId: string) => string, parentViewId?: string, isShowOrAddToMap?: boolean
): LayersConfig => {
  const allFields = currentDs.getSchema()
  const layerDefinition = (currentDs as FeatureLayerDataSource)?.getLayerDefinition()
  const defaultInvisible = [
    'CreationDate',
    'Creator',
    'EditDate',
    'Editor',
    'GlobalID'
  ]
  const allFieldsDetails = allFields?.fields ? Object.values(allFields?.fields) : []
  const fieldsConfig = layerDefinition?.fields || []
  let initTableFields = allFieldsDetails.filter(
    item => !defaultInvisible.includes(item.jimuName)
  ).map(item => {
    const orgField = fieldsConfig.find(field => field.name === item.jimuName)
    const defaultAuthority = orgField?.editable
    return { ...item, editAuthority: defaultAuthority, editable: defaultAuthority, visible: true }
  })
  // Field-maps setting is initially selected by default if the map has field-maps setting
  const popupSetting = (currentDs as FeatureLayerDataSource)?.getPopupInfo()?.fieldInfos
  // const popupSetting = (selectedDs as FeatureLayerDataSource)?.layer?.formTemplate?.elements
  if (currentDs.dataViewId !== 'output' && popupSetting && popupSetting?.length > 0) {
    const popupVisibleFieldNames = []
    popupSetting.forEach(item => {
      if (item?.visible) {
        popupVisibleFieldNames.push(item.fieldName)
      }
    })
    initTableFields = initTableFields.filter(
      item => popupVisibleFieldNames.includes(item.name)
    )
  }
  // If there are too many columns, only the first 50 columns will be displayed by default
  if (initTableFields?.length > 50) {
    initTableFields = initTableFields.slice(0, 50)
  }
  // save the fields they used in its `useDataSource.fields`
  const useDataSource = {
    dataSourceId: currentDs.id,
    mainDataSourceId: currentDs.getMainDataSource()?.id,
    dataViewId: currentDs.dataViewId,
    rootDataSourceId: currentDs.getRootDataSource()?.id
  } as UseDataSource
  const currentIMUseDs = Immutable(useDataSource)
  const usedFields = initTableFields.map(f => f.jimuName)
  const curIMUseDsWithFields = currentIMUseDs.set('fields', usedFields)
  const configId = isMapMode ? currentDs.id : (getNewConfigId ? getNewConfigId(currentDs.id) : currentDs.id)
  const layerItem: LayersConfig = {
    id: configId,
    name: currentDs.getLabel(),
    useDataSource: curIMUseDsWithFields.asMutable({ deep: true }),
    allFields: allFieldsDetails,
    tableFields: initTableFields,
    enableAttachments: false,
    enableEdit: false,
    allowCsv: false,
    enableSearch: false,
    searchFields: [],
    enableRefresh: true,
    enableSelect: true,
    enableDelete: false,
    selectMode: SelectionModeType.Single,
    showCount: true,
    headerFontSetting: {
      backgroundColor: '',
      fontSize: 14,
      bold: false,
      color: ''
    },
    columnSetting: {
      responsiveType: ResponsiveType.Fixed,
      columnWidth: 200
    },
    layerHonorMode: LayerHonorModeType.Webmap,
    parentViewId
  }
  return layerItem
}

export const SUPPORTED_JIMU_LAYER_TYPES: string[] = [
  LayerTypes.FeatureLayer,
  LayerTypes.SceneLayer,
  LayerTypes.BuildingComponentSublayer,
  LayerTypes.OrientedImageryLayer,
  LayerTypes.ImageryLayer,
  LayerTypes.SubtypeSublayer
]

export function isSupportedJimuLayerView (jimuLayerView: JimuLayerView): boolean {
  if (!jimuLayerView || !jimuLayerView.type) {
    return false
  }
  const viewType = jimuLayerView.type
  // Some BuildingComponentSublayer doesn't have layer view, so need to check jimuLayerView.view here.
  // Note, we only check jimuLayerView for BuildingComponentSublayer and don't need to check jimuLayerView.view
  // if layer is not BuildingComponentSublayer because sub feature layer doesn't have layer view.
  const isViewPass = (viewType !== LayerTypes.BuildingComponentSublayer) || (viewType === LayerTypes.BuildingComponentSublayer && jimuLayerView.view)
  const isValid = SUPPORTED_JIMU_LAYER_TYPES.includes(viewType) && isViewPass
  return !!isValid
}
