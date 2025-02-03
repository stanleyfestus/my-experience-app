import {
  AbstractDataAction,
  type DataRecordSet,
  utils,
  getAppStore,
  appActions,
  MutableStoreManager,
  DataSourceTypes,
  type UseDataSource,
  DataSourceStatus,
  DataLevel
} from 'jimu-core'
import { LayerHonorModeType, type LayersConfig, SelectionModeType, TableDataActionType } from '../config'

const supLayerTypes = [DataSourceTypes.FeatureLayer, DataSourceTypes.SceneLayer, DataSourceTypes.BuildingComponentSubLayer,
  DataSourceTypes.OrientedImageryLayer, DataSourceTypes.ImageryLayer]
const temporaryUnsupported = [DataSourceTypes.SubtypeGroupLayer, DataSourceTypes.ImageryTileLayer,
  DataSourceTypes.ElevationLayer]

export default class AddToTable extends AbstractDataAction {
  async isSupported (dataSets: DataRecordSet[], dataLevel: DataLevel): Promise<boolean> {
    if (dataSets.length > 1) {
      return false
    }
    let isActionSupported = true
    const dataSet = dataSets[0]
    const { dataSource } = dataSet
    const typeIsLayer = supLayerTypes.includes(dataSource.type as any)
    const isDataSourceSet = dataSource.isDataSourceSet()
    const notDataSourceLevel = dataLevel !== DataLevel.DataSource
    const notInConfigAndNotLayer = !dataSource.isInAppConfig() && !typeIsLayer
    const unSupportedType = temporaryUnsupported.includes(dataSource.type as any)
    if (isDataSourceSet || notDataSourceLevel || notInConfigAndNotLayer || unSupportedType) {
      isActionSupported = false
    }
    return isActionSupported && dataSource.getStatus() !== DataSourceStatus.NotReady
  }

  deepClone = (obj: any): any => {
    const isArray = Array.isArray(obj)
    const cloneObj = isArray ? [] : {}
    for (const key in obj) {
      const isObject = (typeof obj[key] === 'object' || typeof obj[key] === 'function') && obj[key] !== null
      cloneObj[key] = isObject ? this.deepClone(obj[key]) : obj[key]
    }
    return cloneObj
  }

  async onExecute (dataSets: DataRecordSet[], dataLevel: DataLevel): Promise<boolean> {
    const isDsLevel = dataLevel === DataLevel.DataSource
    const dataSet = dataSets[0]
    const { dataSource, records } = dataSet
    const allFields = dataSource && dataSource.getSchema()
    const isRuntimeData = !dataSource.isInAppConfig()
    const defaultInvisible = [
      'CreationDate',
      'Creator',
      'EditDate',
      'Editor',
      'GlobalID'
    ]
    const allFieldsDetails = Object.values(allFields?.fields)
    const initTableFields = allFieldsDetails.filter(
      item => !defaultInvisible.includes(item.jimuName)
    ).map(ele => {
      return { ...ele, visible: true }
    })
    const newItemId = `DaTable-${utils.getUUID()}`
    const name = (isDsLevel ? '' : dataSet.name) || dataSource.getLabel() || dataSource.getDataSourceJson()?.sourceLabel
    const useDataSource = {
      dataSourceId: dataSource.id,
      mainDataSourceId: dataSource.getMainDataSource()?.id,
      dataViewId: dataSource.dataViewId,
      rootDataSourceId: dataSource.getRootDataSource()?.id
    } as UseDataSource
    const daLayerItem: LayersConfig = {
      id: newItemId,
      name: name,
      allFields: allFieldsDetails,
      tableFields: initTableFields,
      enableAttachments: false,
      enableEdit: false,
      allowCsv: false,
      showCount: true,
      enableSearch: false,
      searchFields: [],
      enableRefresh: false,
      enableSelect: true,
      enableDelete: false,
      selectMode: SelectionModeType.Multiple,
      layerHonorMode: LayerHonorModeType.Webmap,
      dataActionObject: true,
      dataActionType: TableDataActionType.Add,
      ...(isRuntimeData ? { dataActionDataSource: dataSource } : { useDataSource })
    }
    const viewInTableObj = MutableStoreManager.getInstance().getStateValue([this.widgetId])?.viewInTableObj || {}
    const copyRecords = []
    if (!isDsLevel) {
      records.forEach(record => {
        copyRecords.push(record.clone(true))
      })
    }
    viewInTableObj[newItemId] = { daLayerItem, records: copyRecords }
    MutableStoreManager.getInstance().updateStateValue(this.widgetId, 'viewInTableObj', viewInTableObj)

    getAppStore().dispatch(
      appActions.widgetStatePropChange(this.widgetId, 'dataActionActiveObj', { activeTabId: newItemId, dataActionTable: true })
    )
    return true
  }
}
