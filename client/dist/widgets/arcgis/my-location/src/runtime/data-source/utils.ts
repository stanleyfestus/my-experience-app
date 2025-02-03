import Graphic from '@arcgis/core/Graphic'
import { type GeometryType } from '@esri/arcgis-rest-request'
import { type FeatureLayerDataSource, type JimuLayerView, type JimuMapView, zoomToUtils } from 'jimu-arcgis'
import { type DataSourceJson, type DataSourceSchema, DataSourceStatus, DataSourceTypes, EsriFieldType, getAppStore, type IMDataSourceSchema, type IntlShape, JimuFieldType, type TimeInfo, utils } from 'jimu-core'
import { type TrackLine, type TrackLinePoint, type TrackPoint } from '../../config'
import defaultMessages from '../translations/default'

export enum Operations {
  CREATE = 'CREATE',
  ADD = 'ADD',
  DELETE = 'DELETE',
  UPDATE = 'UPDATE',
  CLEAR = 'CLEAR',
  REFRESH = 'REFRESH'
}
const IdSchema = {
  jimuName: 'OBJECTID',
  name: 'OBJECTID',
  type: JimuFieldType.Number,
  esriType: EsriFieldType.OID,
  alias: 'ObjectID'
}

// track point
const TimeSchema = {
  jimuName: 'location_timestamp',
  name: 'location_timestamp',
  type: JimuFieldType.Date,
  esriType: EsriFieldType.Date,
  alias: 'Time',
  format: { dateFormat: 'shortDateLongTime24' }
}
const LongitudeSchema = {
  jimuName: 'Longitude',
  name: 'Longitude',
  type: JimuFieldType.Number,
  esriType: EsriFieldType.Double,
  alias: 'Longitude'
}
const LatitudeSchema = {
  jimuName: 'Latitude',
  name: 'Latitude',
  type: JimuFieldType.Number,
  esriType: EsriFieldType.Double,
  alias: 'Latitude'
}
const AltitudeSchema = {
  jimuName: 'altitude',
  name: 'altitude',
  type: JimuFieldType.Number,
  esriType: EsriFieldType.Double,
  alias: 'Altitude'
}
const OrientationSchema = {
  jimuName: 'Orientation',
  name: 'Orientation',
  type: JimuFieldType.Number,
  esriType: EsriFieldType.Double,
  alias: 'Orientation'
}
const SpeedSchema = {
  jimuName: 'speed',
  name: 'speed',
  type: JimuFieldType.Number,
  esriType: EsriFieldType.Double,
  alias: 'Speed'
}
const AccuracySchema = {
  jimuName: 'Accuracy',
  name: 'Accuracy',
  type: JimuFieldType.Number,
  esriType: EsriFieldType.Double,
  alias: 'Accuracy'
}

// trackline
const LineIdSchema = {
  jimuName: 'LineID',
  name: 'LineID',
  type: JimuFieldType.Number,
  esriType: EsriFieldType.Integer,
  alias: 'LineID'
}

const StartTimeSchema = {
  jimuName: 'StartTime',
  name: 'StartTime',
  type: JimuFieldType.Date,
  esriType: EsriFieldType.Date,
  alias: 'StartTime',
  format: { dateFormat: 'shortDateLongTime24' }
}
const EndTimeSchema = {
  jimuName: 'EndTime',
  name: 'EndTime',
  type: JimuFieldType.Date,
  esriType: EsriFieldType.Date,
  alias: 'EndTime',
  format: { dateFormat: 'shortDateLongTime24' }
}

const AverageAltitudeSchema = {
  jimuName: 'AverageAltitude',
  name: 'AverageAltitude',
  type: JimuFieldType.Number,
  esriType: EsriFieldType.Double,
  alias: 'AverageAltitude'
}

const AverageSpeedSchema = {
  jimuName: 'AverageSpeed',
  name: 'averageSpeed',
  type: JimuFieldType.Number,
  esriType: EsriFieldType.Double,
  alias: 'AverageSpeed'
}

const AverageAccuracySchema = {
  jimuName: 'AverageAccuracy',
  name: 'AverageAccuracy',
  type: JimuFieldType.Number,
  esriType: EsriFieldType.Double,
  alias: 'AverageAccuracy'
}

const getFieldsByType = (name: string, intl: IntlShape) => {
  TimeSchema.alias = intl.formatMessage({ id: 'trackTime', defaultMessage: defaultMessages.trackTime })
  LongitudeSchema.alias = intl.formatMessage({ id: 'trackLongitude', defaultMessage: defaultMessages.trackLongitude })
  LatitudeSchema.alias = intl.formatMessage({ id: 'trackLatitude', defaultMessage: defaultMessages.trackLatitude })
  AltitudeSchema.alias = intl.formatMessage({ id: 'trackAltitude', defaultMessage: defaultMessages.trackAltitude })
  OrientationSchema.alias = intl.formatMessage({ id: 'trackOrientation', defaultMessage: defaultMessages.trackOrientation })
  SpeedSchema.alias = intl.formatMessage({ id: 'trackSpeed', defaultMessage: defaultMessages.trackSpeed })
  AccuracySchema.alias = intl.formatMessage({ id: 'trackAccuracy', defaultMessage: defaultMessages.trackAccuracy })
  StartTimeSchema.alias = intl.formatMessage({ id: 'trackStartTime', defaultMessage: defaultMessages.trackStartTime })
  EndTimeSchema.alias = intl.formatMessage({ id: 'trackEndTime', defaultMessage: defaultMessages.trackEndTime })
  AverageAltitudeSchema.alias = intl.formatMessage({ id: 'averageAltitude', defaultMessage: defaultMessages.averageAltitude })
  AverageSpeedSchema.alias = intl.formatMessage({ id: 'averageSpeed', defaultMessage: defaultMessages.averageSpeed })
  AverageAccuracySchema.alias = intl.formatMessage({ id: 'averageAccuracy', defaultMessage: defaultMessages.averageAccuracy })
  let fields
  if (name === 'track') {
    fields = {
      [IdSchema.jimuName]: IdSchema,
      [TimeSchema.jimuName]: TimeSchema,
      [LongitudeSchema.jimuName]: LongitudeSchema,
      [LatitudeSchema.jimuName]: LatitudeSchema,
      [AltitudeSchema.jimuName]: AltitudeSchema,
      [OrientationSchema.jimuName]: OrientationSchema,
      [SpeedSchema.jimuName]: SpeedSchema,
      [AccuracySchema.jimuName]: AccuracySchema
    }
  } else if (name === 'trackline_point') {
    fields = {
      [IdSchema.jimuName]: IdSchema,
      [LineIdSchema.jimuName]: LineIdSchema,
      [TimeSchema.jimuName]: TimeSchema,
      [LongitudeSchema.jimuName]: LongitudeSchema,
      [LatitudeSchema.jimuName]: LatitudeSchema,
      [AltitudeSchema.jimuName]: AltitudeSchema,
      [OrientationSchema.jimuName]: OrientationSchema,
      [SpeedSchema.jimuName]: SpeedSchema,
      [AccuracySchema.jimuName]: AccuracySchema
    }
  } else if (name === 'trackline') {
    fields = {
      [IdSchema.jimuName]: IdSchema,
      [StartTimeSchema.jimuName]: StartTimeSchema,
      [EndTimeSchema.jimuName]: EndTimeSchema,
      [AverageAltitudeSchema.jimuName]: AverageAltitudeSchema,
      [AverageSpeedSchema.jimuName]: AverageSpeedSchema,
      [AverageAccuracySchema.jimuName]: AverageAccuracySchema
    }
  }
  return fields
}

export const getHiddenFields = (name: string) => {
  let hiddenFields
  if (name === 'track') {
    hiddenFields = [IdSchema.jimuName, TimeSchema.jimuName]
  } else if (name === 'trackline_point') {
    hiddenFields = [IdSchema.jimuName, TimeSchema.jimuName]
  } else if (name === 'trackline') {
    hiddenFields = []
  }
  return hiddenFields
}

/**
 * Get the initial data source schema.
 * @param label
 * @param name
 */
export const getInitSchema = (intl: IntlShape, label: string = '', name: string = ''): DataSourceSchema => {
  const fields = getFieldsByType(name, intl)
  return {
    label,
    idField: IdSchema.jimuName,
    fields: fields
  } as DataSourceSchema
}

/**
 * Get original fields from output ds schema (without objectid field)
 * @param schema
 */
export const getSchemaOriginFields = (schema: IMDataSourceSchema): string[] => {
  if (!schema?.fields) return
  const fields = []
  Object.entries(schema.fields)?.forEach(([fieldName, fieldSchema]) => {
    //The objectid field is required in the schema, but it may not be used.
    if (fieldName === IdSchema.jimuName && fieldSchema.jimuName === IdSchema.jimuName) {
      return null
    }
    const originFields = fieldSchema.originFields ?? []
    originFields.forEach((field) => {
      if (field) {
        fields.push(field)
      }
    })
  })
  return Array.from(new Set(fields))
}

/**
 * Create the initial output data source.
 * @param originalId
 * @param label
 * @param useDataSource
 */
export const createInitOutputDataSource = (intl: IntlShape, id: string, label: string, name: string, geometryType: GeometryType) => {
  const schema = getInitSchema(intl, label, name)
  const layerId = id + '__layer'
  const outputDsJson: DataSourceJson = {
    id,
    type: DataSourceTypes.FeatureLayer,
    label,
    originDataSources: [],
    isOutputFromWidget: true,
    isDataInDataSourceInstance: false,
    schema,
    geometryType,
    layerId
  }

  return outputDsJson
}

export const setShowRuntimeLayers = (jimuMapView: JimuMapView, dataSourceId: string, showRuntimeLayers: boolean) => {
  if (jimuMapView) {
    const layerView = jimuMapView.getJimuLayerViewByDataSourceId(dataSourceId)
    if (layerView) {
      layerView.layer.listMode = !showRuntimeLayers ? 'hide' : 'show'
    }
  }
}

export const syncToMap = async (operation: Operations, dataSourceId: string, jimuMapView: JimuMapView, operGraphics: Graphic[], rendererObject: object, visible: boolean = true, showRuntimeLayers: boolean = true): Promise<JimuLayerView> => {
  if (!dataSourceId || !jimuMapView) {
    return
  }
  let layerView = jimuMapView.getJimuLayerViewByDataSourceId(dataSourceId)
  if (layerView) {
    if (operation === Operations.ADD) {
      await layerView.layer.applyEdits({
        addFeatures: operGraphics
      })
    } else if (operation === Operations.DELETE) {
      const fs = await layerView.layer.queryFeatures()
      const ids = operGraphics.map(o => o.attributes.OBJECTID)
      if (fs.features.length > 0) {
        const features = fs.features.filter(f => ids.includes(f.getObjectId()))
        if (features.length > 0) {
          await layerView.layer.applyEdits({
            deleteFeatures: features
          })
        }
      }
    } else if (operation === Operations.UPDATE) {
      await layerView.layer.applyEdits({
        updateFeatures: operGraphics
      })
    } else if (operation === Operations.CLEAR) {
      const fs = layerView.getLayerDataSource().getRecords().map((dr: any) => dr.toJson())
      await layerView.layer.applyEdits({
        deleteFeatures: fs.map(f => Graphic.fromJSON(f))
      })
    } else {
      // delete all then add new
      const fs = layerView.getLayerDataSource().getRecords().map(dr => dr.toJson())
      await layerView.layer.applyEdits({
        addFeatures: operGraphics,
        deleteFeatures: fs.map(f => Graphic.fromJSON(f))
      })
    }
    return
  }
  layerView = await jimuMapView.addLayerToMap(dataSourceId, dataSourceId + '__layer')
  layerView.layer.visible = visible
  // hide the layer in Editor widget
  layerView.layer._exb_not_editable = true
  // hide the runtime layers in the layer lists
  layerView.layer.listMode = !showRuntimeLayers ? 'hide' : 'show'
  if (rendererObject) {
    layerView.layer.renderer = rendererObject
  }
  return layerView
}

/**
 * remove layers from jimuMapView
 * @param jimuMapView JimuMapView
 * @param dataSourceId DataSourceID
 */
export const removeLayerFromJimuLayerViews = (jimuMapView: JimuMapView, dataSourceId: string) => {
  if (dataSourceId && jimuMapView) {
    const layerView = jimuMapView.getJimuLayerViewByDataSourceId(dataSourceId)
    if (layerView) {
      const dataSource = layerView.getLayerDataSource()
      jimuMapView.removeJimuLayerView(layerView)
      if (dataSource) {
        dataSource.clearRecords()
        dataSource?.setStatus(DataSourceStatus.NotReady)
        dataSource?.setCountStatus(DataSourceStatus.NotReady)
      }
    }
  }
}
export const updateToSource = (dataSource: FeatureLayerDataSource, graphics: Graphic[], geometryType: 'point' | 'multipoint' | 'polyline' | 'polygon' | 'multipatch' | 'mesh') => {
  if (graphics.length === 0) {
    dataSource.clearRecords()
    dataSource?.setStatus(DataSourceStatus.NotReady)
    dataSource?.setCountStatus(DataSourceStatus.NotReady)
    return
  }
  return dataSource?.setSourceFeatures(graphics, { geometryType })
}

export const createJimuLayerView = async (dataSourceId: string, jimuMapView: JimuMapView, rendererObject: object, visible: boolean = true, showRuntimeLayers: boolean = true): Promise<JimuLayerView> => {
  const layerView = await jimuMapView.addLayerToMap(dataSourceId, dataSourceId + '__layer')
  layerView.layer.visible = visible
  // hide the layer in Editor widget
  layerView.layer._exb_not_editable = true
  // hide the runtime layers in the layer lists
  layerView.layer.listMode = !showRuntimeLayers ? 'hide' : 'show'
  if (rendererObject) {
    layerView.layer.renderer = rendererObject
  }
  return Promise.resolve(layerView)
}
export const createDataSourceLayer = (dataSource: FeatureLayerDataSource, graphics: Graphic[], geometryType: 'point' | 'polyline'): Promise<void> => {
  return dataSource?.setSourceFeatures(graphics, { geometryType })
}

export const syncDataToLayer = async (dataSource: FeatureLayerDataSource, layer: __esri.FeatureLayer, operation: Operations, operGraphics: Graphic[]): Promise<void> => {
  if (!layer) {
    console.error('The layer is not found.')
    return
  }
  const ids = operGraphics?.map(o => o.attributes.OBJECTID)
  if (operation === Operations.ADD) {
    await layer.applyEdits({
      addFeatures: operGraphics
    })
    operGraphics.forEach(g => {
      dataSource.afterAddRecord(g.attributes)
    })
  } else if (operation === Operations.DELETE) {
    await layer.applyEdits({
      deleteFeatures: operGraphics
    })
    dataSource.afterDeleteRecordsByIds(ids)
  } else if (operation === Operations.UPDATE) {
    await layer.applyEdits({
      updateFeatures: operGraphics
    })
  } else if (operation === Operations.CLEAR) {
    const fs = await layer.queryFeatures()
    await layer.applyEdits({
      deleteFeatures: fs.features
    })
    dataSource.afterDeleteRecordsByIds(fs.features.map(f => f.getObjectId().toString()))
  } else if (operation === Operations.CREATE) {
    await layer.applyEdits({
      addFeatures: operGraphics
    })
    operGraphics.forEach(g => {
      dataSource.afterAddRecord(g.attributes)
    })
  }
}

export const zoomToGraphics = (jimuMapView: JimuMapView, graphics: Graphic[], scale: number) => {
  if (jimuMapView) {
    zoomToUtils.zoomTo(jimuMapView.view, graphics, {
      scale: scale
    })
  }
}

export const getPointGraphic = (model: TrackPoint | TrackLinePoint): Graphic => {
  const attributes = model
  const geometry = {
    type: 'point',
    x: model.Longitude,
    y: model.Latitude
  }
  return Graphic.fromJSON({ geometry, attributes })
}

export const getLineGraphic = (line: TrackLine, points: TrackLinePoint[]): Graphic => {
  const attributes = line
  const paths = points.map(t => [t.Longitude, t.Latitude])
  if (points.length === 1) {
    paths.push([points[0].Longitude, points[0].Latitude])
  }
  const geometry = {
    type: 'polyline',
    paths: [paths]
  }
  return Graphic.fromJSON({ geometry, attributes })
}

export const setTimeInfo = (dataSource: FeatureLayerDataSource, graphics: Graphic[], type: string) => {
  const schema = dataSource.getSchema()
  let start = 1
  let end = 1
  const startTimeField = type === 'point' ? TimeSchema.jimuName : StartTimeSchema.jimuName
  const endTimeField = type === 'point' ? TimeSchema.jimuName : EndTimeSchema.jimuName
  if (graphics.length > 1) {
    start = graphics[graphics.length - 1].attributes?.[startTimeField]
    end = graphics[0].attributes?.[endTimeField]
  }
  const timeInfo: TimeInfo = { trackIdField: schema.idField, timeExtent: [start, end], startTimeField: startTimeField }
  if (type === 'polyline') {
    timeInfo.endTimeField = endTimeField
  }
  const layerDefinition = {
    timeInfo
  }
  dataSource.setLayerDefinition(layerDefinition)
}

/**
 * create highlight graphics layer id by widget id
 * @param widgetId  widget id
 * @returns {string} GraphicsLayerId
 */
export const getHighLightGraphicsLayerId = (widgetId: string): string => {
  return `${widgetId}-point-of-sight-track-layer`
}

export function getWidgetObjectIdKey (widgetId: string, dataSourceId: string) {
  const appId = window.jimuConfig?.isBuilder ? getAppStore().getState().appStateInBuilder?.appId : getAppStore().getState().appId
  return `exb-${appId}-${widgetId}-${dataSourceId}-key`
}

/**
 * Get dataSource new feature object id
 * @param dataSourceKey dataSource key
 * @returns oid
 */
export const getObjectId = (dataSourceKey): number => {
  const oid = utils.readLocalStorage(dataSourceKey) ?? '0'
  const nextOid = Number(oid) + 1
  utils.setLocalStorage(dataSourceKey, nextOid.toString())
  return nextOid
}
