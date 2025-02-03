import type Polyline from 'esri/geometry/Polyline'
import { round } from 'lodash-es'
import { AbstractDataAction, type DataRecordSet, MutableStoreManager, DataLevel, getAppStore, type DataSource, DataSourceStatus, type JSAPILayerMixin, type ImmutableObject, loadArcGISJSAPIModules, DataSourceTypes } from 'jimu-core'
import { type RouteInfo, type EventInfo, isDefined, getRouteFromEndMeasures, QueryRouteMeasures, type NetworkInfo, queryRouteIdOrName, getDateWithTZOffset } from 'widgets/shared-code/lrs'
import { type FeatureLayerDataSourceImpl } from 'jimu-core/data-source'

export default class ExportJson extends AbstractDataAction {
  async isSupported (dataSets: DataRecordSet[], dataLevel: DataLevel): Promise<boolean> {
    if (dataSets.length > 1) {
      return false
    }

    const dataSet = dataSets[0]
    const record = dataSet.records[0]
    if (!isDefined(record)) {
      return false
    }
    const data = record.getData()
    const dataAttributes = JSON.parse(JSON.stringify(data))
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

    // get the network datasource
    let networkDS = dataSource
    if (dataSource.id.includes('output_point') || dataSource.id.includes('output_line')) {
      networkDS = dataSource.getOriginDataSources()[0] as FeatureLayerDataSourceImpl
    }

    if (!isDefined(networkDS)) {
      return false
    }

    const appConfig = getAppConfig()
    const widgetJson = appConfig?.widgets?.[this.widgetId]

    // check if the network datasource is registered as a datasouce in addPointEvent widget
    let networkInfo: ImmutableObject<NetworkInfo>
    widgetJson.config.lrsLayers.forEach((lrsLayer: any) => {
      if ((isDefined(networkDS) && lrsLayer.id === networkDS.id)) {
        networkInfo = lrsLayer.networkInfo
      }
    })

    if (!networkInfo) {
      return false
    }

    // if networkInfo has no events associated with it, don't show the data action
    if (!isDefined(networkInfo.eventLayers) || networkInfo.eventLayers.length === 0) {
      return false
    }

    let eventInfo: ImmutableObject<EventInfo>
    const eventLayers = networkInfo.eventLayers
    widgetJson.config.lrsLayers.forEach((lrsLayer: any) => {
      eventLayers.forEach((eventLayer: string) => {
        if (String(lrsLayer.originName) === eventLayer) {
          eventInfo = lrsLayer.eventInfo
        }
      })
    })

    // event is not registered for this network
    if (!eventInfo) {
      return false
    }

    const routeIdField = Object.keys(dataAttributes).find(key => key === networkInfo.routeIdFieldSchema.name)

    // all LRS records have a routeId
    if (!isDefined(routeIdField) || !isDefined(dataAttributes[routeIdField])) {
      return false
    }

    // don't show data action if more than one record is selected
    if (dataSet.records.length > 1) {
      return false
    }

    // determine if the datasource is from an LRS widget (Search By Route or Identify)
    let fromLRSWidget = false
    const dataSourceId = dataSource.id
    // does dataSourceId include 'output_line' in the id
    if (dataSourceId.includes('output_point') || dataSourceId.includes('output_line')) {
      fromLRSWidget = true
    }

    // data action only supports point features
    let Poly: typeof __esri.Polyline = null
    let isPoint = false
    await loadArcGISJSAPIModules(['esri/geometry/Polyline']).then(modules => {
      [Poly] = modules
    }).then(() => {
      const geometry = record.getGeometry()
      const poly = new Poly(geometry)
      if (poly.paths.length === 0) {
        isPoint = true
      }
    })

    // if the record is coming from an LRS widget, it must be a point
    if (fromLRSWidget && !isPoint) {
      return false
    }

    // came from Search By Route or Identify
    if (fromLRSWidget && dataSet.records.length !== 1) {
      return false
    }

    //Don't support if dataSource is not valid or notReady
    if (!dataSource || dataSource.getStatus() === DataSourceStatus.NotReady) {
      return false
    }

    return true
  }

  async onExecute (dataSets: DataRecordSet[], dataLevel: DataLevel): Promise<boolean> {
    const dataSet = dataSets[0]
    const { records, dataSource } = dataSet
    const appConfig = getAppConfig()
    const widgetJson = appConfig?.widgets?.[this.widgetId]

    // get the network datasource
    let networkDS = dataSource
    if (dataSource.id.includes('output_point') || dataSource.id.includes('output_line')) {
      networkDS = dataSource.getOriginDataSources()[0] as FeatureLayerDataSourceImpl
    }

    if (!isDefined(networkDS)) {
      return false
    }

    let networkInfo: ImmutableObject<NetworkInfo>
    widgetJson.config.lrsLayers.forEach((lrsLayer: any) => {
      if ((isDefined(networkDS) && lrsLayer.id === networkDS.id)) {
        networkInfo = lrsLayer.networkInfo
      }
    })

    const record = records[0]
    const data = record.getData()
    const dataAttributes = JSON.parse(JSON.stringify(data))
    const dataAttributesNoCase = Object.fromEntries(Object.entries(dataAttributes).map(([key, val]) => [key.toLowerCase(), val]))

    const rteInfo: RouteInfo = {
      routeId: '',
      routeName: '',
      fromMeasure: NaN,
      toMeasure: NaN,
      fromDate: undefined,
      toDate: undefined,
      selectedMeasure: NaN,
      selectedFromDate: undefined,
      selectedToDate: undefined
    }

    // network fields
    const routeIdField = Object.keys(dataAttributes).find(key => key === networkInfo.routeIdFieldSchema.name)
    const routeNameField = Object.keys(dataAttributes).find(key => key === networkInfo.routeNameFieldSchema?.name)
    const fromDateField = Object.keys(dataAttributes).find(key => key === networkInfo.fromDateFieldSchema.name)
    const toDateField = Object.keys(dataAttributes).find(key => key === networkInfo.toDateFieldSchema.name)
    const lineIdField = Object.keys(dataAttributes).find(key => key === networkInfo.lineIdFieldSchema?.name)
    const lineOrderField = Object.keys(dataAttributes).find(key => key === networkInfo.lineOrderFieldSchema?.name)

    const fromDate = isDefined(dataAttributes[fromDateField]) ? getDateWithTZOffset(dataAttributes[fromDateField], networkDS) : null
    const toDate = isDefined(dataAttributes[toDateField]) ? getDateWithTZOffset(dataAttributes[toDateField], networkDS) : null

    rteInfo.fromDate = fromDate
    rteInfo.selectedFromDate = fromDate
    rteInfo.toDate = toDate
    rteInfo.selectedToDate = toDate
    rteInfo.routeId = isDefined(dataAttributes[routeIdField]) ? String(dataAttributes[routeIdField]) : null
    rteInfo.routeName = isDefined(dataAttributes[routeNameField]) ? String(dataAttributes[routeNameField]) : null
    rteInfo.lineId = isDefined(dataAttributes[lineIdField]) ? String(dataAttributes[lineIdField]) : null
    rteInfo.routeLineOrder = isDefined(dataAttributes[lineOrderField]) ? Number(dataAttributes[lineOrderField]) : null

    rteInfo.fromMeasure = isDefined(dataAttributesNoCase.measure) ? Number(dataAttributesNoCase.measure) : NaN
    rteInfo.selectedMeasure = isDefined(dataAttributesNoCase.measure) ? Number(dataAttributesNoCase.measure) : NaN
    rteInfo.validRoute = true

    // set the point from the feature
    if (isDefined(dataAttributes.Measure)) {
      let Point: typeof __esri.Point = null
      await loadArcGISJSAPIModules(['esri/geometry/Point']).then(modules => {
        [Point] = modules
      }).then(() => {
        const geometry = record.getGeometry()
        const pnt = new Point(geometry)
        rteInfo.selectedPoint = pnt
      })
    }

    let routePolyline = null
    // get the route polyline for the specified route.  The feature that comes across in the record is only a polyline from the start/end measure
    if (isDefined(networkInfo)) {
      const routeIdOrName = networkInfo.useRouteName ? rteInfo.routeName : rteInfo.routeId
      await queryRouteIdOrName(routeIdOrName.trim(), networkInfo, networkDS, false, true, '', rteInfo.fromDate)
        .then(async (results) => {
          if (isDefined(results)) {
            await Promise.all(results.features.map(async (feature) => {
              routePolyline = feature.geometry as Polyline
            }))

            // get the endpoints of the route polyline
            if (isDefined(routePolyline)) {
              rteInfo.selectedPolyline = routePolyline
              const routeEndPoints = getRouteFromEndMeasures(routePolyline)

              // query for the from and to measures for the route
              if (isDefined(routeEndPoints)) {
                const measures = await QueryRouteMeasures(networkDS, networkInfo, routeEndPoints, rteInfo.fromDate, rteInfo.routeId)
                const minMeasure = Math.min(...measures)
                const maxMeasure = Math.max(...measures)

                rteInfo.fromMeasure = round(minMeasure, networkInfo.measurePrecision)
                rteInfo.toMeasure = round(maxMeasure, networkInfo.measurePrecision)
              }
            }
          }
        })
    }

    MutableStoreManager.getInstance().updateStateValue(this.widgetId, 'selectedNetworkDataSource', networkDS)
    MutableStoreManager.getInstance().updateStateValue(this.widgetId, 'selectedRouteInfo', rteInfo)

    return true
  }
}

//get the whole app config
function getAppConfig () {
  return window.jimuConfig.isBuilder ? getAppStore().getState()?.appStateInBuilder?.appConfig : getAppStore().getState()?.appConfig
}
