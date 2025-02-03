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
  loadArcGISJSAPIModules,
  type FeatureLayerQueryParams,
  type FeatureLayerDataSource
} from 'jimu-core'
import { isDefined, type NetworkInfo } from 'widgets/shared-code/lrs'
import { type RouteInfoFromDataAction } from '../config'
import { round } from 'lodash-es'

export default class ExportJson extends AbstractDataAction {
  async isSupported (dataSets: DataRecordSet[], dataLevel: DataLevel): Promise<boolean> {
    if (dataSets.length > 1) {
      return false
    }

    const dataSet = dataSets[0]
    if (dataSet.records.length !== 1) {
      return false
    }

    const record = dataSet.records[0]
    const data = record.getData()
    const dataAttributes = JSON.parse(JSON.stringify(data))

    const { dataSource, records } = dataSet
    const typeIsLayer = dataSource.type === DataSourceTypes.FeatureLayer || dataSource.type === DataSourceTypes.SceneLayer
    const notRecordLevel = dataLevel !== DataLevel.Records
    const dataSourceSpatial = dataSet.dataSource as DataSource & JSAPILayerMixin
    const supportSpatialInfo = dataSourceSpatial?.supportSpatialInfo && dataSourceSpatial?.supportSpatialInfo()
    const recordIsEmpty = dataLevel === DataLevel.Records && records?.length === 0
    const notInConfigAndNotLayer = !dataSource.isInAppConfig() && !typeIsLayer
    if (notRecordLevel || recordIsEmpty || notInConfigAndNotLayer || !supportSpatialInfo) {
      return false
    }

    //Don't support if dataSource is not valid or notReady
    if (!dataSource || dataSource.getStatus() === DataSourceStatus.NotReady) {
      return false
    }

    // check if the network datasource is registered as a datasouce in widget
    const networkDS = isDefined(dataSource.getOriginDataSources()[0]) ? dataSource.getOriginDataSources()[0] : dataSource
    const appConfig = getAppConfig()
    const widgetJson = appConfig?.widgets?.[this.widgetId]

    if (!isDefined(networkDS)) {
      return false
    }

    let networkInfo: ImmutableObject<NetworkInfo>
    widgetJson.config.lrsLayers.forEach((lrsLayer: any) => {
      if (lrsLayer.id === networkDS.id) {
        networkInfo = lrsLayer.networkInfo
      }
    })

    if (!networkInfo) {
      return false
    }

    if (!isDefined(dataAttributes[networkInfo.routeIdFieldSchema.name]) || dataAttributes[networkInfo.routeIdFieldSchema.name] === '') {
      return false
    }

    return true
  }

  async onExecute (dataSets: DataRecordSet[], dataLevel: DataLevel): Promise<boolean> {
    const dataSet = dataSets[0]
    const { records, dataSource } = dataSet
    const appConfig = getAppConfig()
    const widgetJson = appConfig?.widgets?.[this.widgetId]
    const networkDS = isDefined(dataSource.getOriginDataSources()[0]) ? dataSource.getOriginDataSources()[0] : dataSource

    let networkInfo: ImmutableObject<NetworkInfo>
    widgetJson.config.lrsLayers.forEach((lrsLayer: any) => {
      if (lrsLayer.id === networkDS.id) {
        networkInfo = lrsLayer.networkInfo
      }
    })

    const record = records[0]
    const data = record.getData()
    const dataAttributes = JSON.parse(JSON.stringify(data))

    const routeParams: RouteInfoFromDataAction = {
      networkInfo: networkInfo,
      routeId: '',
      routeName: '',
      fromMeasure: null,
      toMeasure: null
    }

    const routeIdField = Object.keys(dataAttributes).find(key => key === networkInfo.routeIdFieldSchema.name)
    const routeNameField = Object.keys(dataAttributes).find(key => key === networkInfo.routeNameFieldSchema?.name)
    const measureField = Object.keys(dataAttributes).find(key => key === 'Measure')
    const toMeasureField = Object.keys(dataAttributes).find(key => key === 'ToMeasure')

    routeParams.routeId = isDefined(routeIdField) ? dataAttributes[routeIdField] : null
    routeParams.routeName = isDefined(routeNameField) ? dataAttributes[routeNameField] : null
    routeParams.fromMeasure = isDefined(measureField) ? dataAttributes[measureField] : null
    routeParams.toMeasure = isDefined(toMeasureField) ? dataAttributes[toMeasureField] : null

    // Use entire route if fromMeasure and toMeasure are not provided
    if (isNaN(routeParams.fromMeasure) || isNaN(routeParams.toMeasure) || routeParams.fromMeasure === null || routeParams.toMeasure === null) {
      const objectIdField = networkDS.getIdField()
      const searchByRouteOIDField = Object.keys(dataAttributes).find(key => key === 'Network_OBJECTID')
      let objectId = null
      if (isDefined(searchByRouteOIDField)) {
        objectId = dataAttributes[searchByRouteOIDField]
      } else {
        objectId = dataAttributes[objectIdField]
      }

      if (objectId === null) {
        return false
      }

      const featureDS = networkDS as FeatureLayerDataSource
      const featureQuery: FeatureLayerQueryParams = ({
        returnGeometry: true,
        returnM: true,
        where: `${networkDS.getIdField()} = ${objectId}`
      })

      await featureDS.query(featureQuery).then(async (response) => {
        if (response.records.length > 0) {
          let Polyline: typeof __esri.Polyline = null
          await loadArcGISJSAPIModules(['esri/geometry/Polyline']).then(modules => {
            Polyline = modules[0]

            const geometry = new Polyline(response.records[0].getGeometry())
            if (!isDefined(geometry)) {
              return false
            }

            const firstPoint = geometry.getPoint(0, 0)
            const lastIdx = geometry.paths[geometry.paths.length - 1].length - 1
            const lastPoint = geometry.getPoint(geometry.paths.length - 1, lastIdx)
            routeParams.fromMeasure = round(firstPoint.m, networkInfo.measurePrecision)
            routeParams.toMeasure = round(lastPoint.m, networkInfo.measurePrecision)

            MutableStoreManager.getInstance().updateStateValue(this.widgetId, 'selectedNetworkDataSource', networkDS)
            MutableStoreManager.getInstance().updateStateValue(this.widgetId, 'routeLocationParams', routeParams)
          })
        } else {
          return false
        }
      })
    } else {
      MutableStoreManager.getInstance().updateStateValue(this.widgetId, 'selectedNetworkDataSource', networkDS)
      MutableStoreManager.getInstance().updateStateValue(this.widgetId, 'routeLocationParams', routeParams)
    }
    return true
  }
}

//get the whole app config
function getAppConfig () {
  return window.jimuConfig.isBuilder ? getAppStore().getState()?.appStateInBuilder?.appConfig : getAppStore().getState()?.appConfig
}
