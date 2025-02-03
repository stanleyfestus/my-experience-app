import {
  AbstractDataAction,
  type DataRecordSet,
  MutableStoreManager,
  DataLevel,
  getAppStore,
  type DataSource,
  DataSourceStatus,
  type JSAPILayerMixin,
  DataSourceTypes,
  Immutable
} from 'jimu-core'
import { isDefined, LrsLayerType } from 'widgets/shared-code/lrs'
import { type FeatureLayerDataSourceImpl } from 'jimu-core/data-source'

export default class ExportJson extends AbstractDataAction {
  async isSupported (dataSets: DataRecordSet[], dataLevel: DataLevel): Promise<boolean> {
    if (dataSets.length > 1) {
      return false
    }

    // Don't show data action if less than two records are selected
    const dataSet = dataSets[0]
    if (dataSet.records.length < 2) {
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

    // check if the datasource is registered as a datasouce in addLineEvent widget
    let selectedLrsLayer
    widgetJson.config.lrsLayers.forEach((lrsLayer: any) => {
      if (lrsLayer.id === ds.id) {
        selectedLrsLayer = lrsLayer
      }
    })

    if (!isDefined(selectedLrsLayer) || selectedLrsLayer.layerType !== LrsLayerType.event) {
      return false
    }
    return true
  }

  async onExecute (dataSets: DataRecordSet[], dataLevel: DataLevel): Promise<boolean> {
    const dataSet = dataSets[0]
    const ds = dataSet.dataSource as FeatureLayerDataSourceImpl
    const appConfig = getAppConfig()
    const widgetJson = appConfig?.widgets?.[this.widgetId]

    // check if data action's datasource is registered as a datasouce in the associated widget
    let selectedLrsLayer
    widgetJson.config.lrsLayers.forEach((lrsLayer: any) => {
      if (lrsLayer.id === ds.id) {
        selectedLrsLayer = lrsLayer
      }
    })
    setTimeout(() => {
      MutableStoreManager.getInstance().updateStateValue(this.widgetId, 'selectedEventLyr', Immutable(selectedLrsLayer))
    }, 1000)
    return true
  }
}

//get the whole app config
function getAppConfig () {
  return window.jimuConfig.isBuilder ? getAppStore().getState()?.appStateInBuilder?.appConfig : getAppStore().getState()?.appConfig
}
