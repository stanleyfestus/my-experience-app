import {
  AbstractDataAction,
  type DataRecordSet,
  MutableStoreManager,
  DataLevel,
  getAppStore,
  type DataSource,
  DataSourceStatus,
  type JSAPILayerMixin,
  type ImmutableObject,
  DataSourceTypes,
  Immutable
} from 'jimu-core'
import {
  isDefined,
  type EventInfo
} from 'widgets/shared-code/lrs'
import { type FeatureLayerDataSourceImpl } from 'jimu-core/data-source'

export default class ExportJson extends AbstractDataAction {
  async isSupported (dataSets: DataRecordSet[], dataLevel: DataLevel): Promise<boolean> {
    if (dataSets.length > 1) {
      return false
    }

    // Don't show data action if less than two records are selected
    const dataSet = dataSets[0]
    if (dataSet.records.length !== 1) {
      return false
    }

    const { dataSource, records } = dataSet
    const typeIsLayer = dataSource.type === DataSourceTypes.FeatureLayer || dataSource.type === DataSourceTypes.SceneLayer
    const isDataSourceSet = dataSource.isDataSourceSet()
    const notRecordLevel = dataLevel !== DataLevel.Records
    const dataSourceSpatial = dataSet.dataSource as DataSource & JSAPILayerMixin
    const supportSpatialInfo = dataSourceSpatial?.supportSpatialInfo && dataSourceSpatial?.supportSpatialInfo()
    const recordIsEmpty = dataLevel === DataLevel.Records && records?.length === 0
    const notInConfigAndNotLayer = !dataSource.isInAppConfig() && !typeIsLayer
    if (isDataSourceSet || notRecordLevel || recordIsEmpty || notInConfigAndNotLayer || !supportSpatialInfo) {
      return false
    }

    //Don't support if dataSource is not valid or notReady
    if (!dataSource || dataSource.getStatus() === DataSourceStatus.NotReady) {
      return false
    }

    const ds = dataSource as FeatureLayerDataSourceImpl
    if (!isDefined(ds)) {
      return false
    }

    const appConfig = getAppConfig()
    const widgetJson = appConfig?.widgets?.[this.widgetId]

    // check if the network datasource is registered as a datasouce in the associated LRS widget
    let eventInfo: ImmutableObject<EventInfo>
    let selectedLrsLayer
    widgetJson.config.lrsLayers.forEach((lrsLayer: any) => {
      if (lrsLayer.id === ds.id) {
        selectedLrsLayer = lrsLayer
        eventInfo = lrsLayer.eventInfo
      }
    })

    if (isDefined(selectedLrsLayer) && selectedLrsLayer.layerType === 'NETWORK') {
      return false
    }
    if (!eventInfo) {
      return false
    }
    return true
  }

  async onExecute (dataSets: DataRecordSet[], dataLevel: DataLevel): Promise<boolean> {
    const dataSet = dataSets[0]
    const ds = dataSet.dataSource as FeatureLayerDataSourceImpl
    const appConfig = getAppConfig()
    const widgetJson = appConfig?.widgets?.[this.widgetId]
    let lrsLayerFound
    // check if the network datasource is registered as a datasouce in the associated widget
    widgetJson.config.lrsLayers.forEach((lrsLayer: any) => {
      if (lrsLayer.id === ds.id) {
        lrsLayerFound = lrsLayer
      }
    })
    setTimeout(() => {
      MutableStoreManager.getInstance().updateStateValue(this.widgetId, 'selectedEventLyr', Immutable(lrsLayerFound))
      const record = dataSet.records[0]
      const data = record.getData()
      MutableStoreManager.getInstance().updateStateValue(this.widgetId, 'selectedEventObjectId', data[dataSet.dataSource.getSchema().idField])
      MutableStoreManager.getInstance().updateStateValue(this.widgetId, 'selectedEventRouteId', data[lrsLayerFound.eventInfo.routeIdFieldName])
      MutableStoreManager.getInstance().updateStateValue(this.widgetId, 'selectedEventFromDate', new Date(data[lrsLayerFound.eventInfo.fromDateFieldName]))
    }, 1000)
    return true
  }
}

//get the whole app config
function getAppConfig () {
  return window.jimuConfig.isBuilder ? getAppStore().getState()?.appStateInBuilder?.appConfig : getAppStore().getState()?.appConfig
}
