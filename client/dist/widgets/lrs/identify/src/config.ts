import { type GeometryType } from '@esri/arcgis-rest-request'
import { type ImmutableObject } from 'seamless-immutable'
import { type FeatureLayerDataSource, type IMFieldSchema, type UseDataSource, type DataSource } from 'jimu-core'

export enum LrsLayerType {
  network = 'NETWORK',
  event = 'EVENT',
  intersection = 'INTERSECTION',
  nonLrs = 'NONLRS'
}

export enum Method {
  measure = 'ROUTEANDMEASURE',
  coordinate = 'COORDINATE',
  locationOffset = 'LOCATIONOFFSET',
}

export interface MeasureToGeometryLocations {
  status: string
  routeId: string
  toRouteId: string
  geometryType: GeometryType
  geometry: __esri.Geometry
}

export interface MeasureToGeometryResponse {
  spatialReference: { wkid: number }
  locations: MeasureToGeometryLocations[]
}

export interface LocationInfo {
  ds: DataSource
  records?: any
  featureDS: FeatureLayerDataSource
  routeId: string
  objectIdFieldName?: string
  routeIdFieldName: string
  routeName: string
  routeNameFieldName: string
  lineIdFieldName?: string
  lineOrderFieldName?: string
  fromDate: Date
  toDate: Date
  supportsLines?: boolean
  selectedPoint?: __esri.Point
  selectedPolyline?: __esri.Polyline
  validRoute?: boolean
  attributes?: any[]
  configFields?: []
  measureUnit?: string
  timeDependedInfo?: TimeInfo[]
  fieldInfos: __esri.Field[]
}
export interface AttributeFieldSettings {
  field?: IMFieldSchema
  enabled?: boolean
  editable?: boolean
  description?: string
}

export interface NetworkInfo {
  networkUrl?: string
  objectIdFieldName?: string
  routeIdFieldSchema?: IMFieldSchema
  routeNameFieldSchema?: IMFieldSchema
  fromDateFieldSchema?: IMFieldSchema
  toDateFieldSchema?: IMFieldSchema
  useRouteName: boolean
  eventLayers: string[]
  intersectionLayers: string[]
  measurePrecision: number
  unitsOfMeasure: string
  attributeFields?: AttributeFieldSettings[]
  useFieldAlias?: boolean
  supportsLines?: boolean
  lineIdFieldName?: string
  lineNameFieldName?: string
  lineOrderFieldName?: string
  configFields?: AttributeFieldSettings[]
  routes?: any[]
  id?: string
  outputPointDsId?: string
  layerName?: string
  lrsNetworkId?: number
  networkId?: number
}

export interface TimeInfo {
  objectId: string
  fromDate?: Date | number
  toDate?: Date | number
  fromMeasure?: number
  toMeasure?: number
  selectedMeasures?: any[]
  attributes?: { [key: string]: string | number | Date }
  measureUnit?: string
}

export interface EventInfo {
  eventUrl?: string
  fromDateFieldName?: string
  toDateFieldName?: string
  derivedFromMeasureFieldName?: string
  derivedRouteIdFieldName?: string
  derivedRouteNameFieldName?: string
  derivedToMeasureFieldName?: string
  fromReferentLocationFieldName?: string
  fromReferentMethodFieldName?: string
  fromReferentOffsetFieldName?: string
  toReferentLocationFieldName?: string
  toReferentMethodFieldName?: string
  toReferentOffsetFieldName?: string
  locErrorFieldName?: string
  eventIdFieldName?: string
  routeIdFieldName?: string
  routeNameFieldName?: string
  fromMeasureFieldName?: string
  toRouteIdFieldName?: string
  toRouteNameFieldName?: string
  toMeasureFieldName?: string
  lrsFields?: IMFieldSchema[]
  attributeFields?: AttributeFieldSettings[]
  parentNetworkId: number
  useRouteName: boolean
  canSpanRoutes?: boolean
}

export interface IntersectionInfo {
  routeIdFieldSchema?: __esri.Field
  parentNetworkId: number
}

export interface LrsLayer {
  id: string
  serviceId: number
  name: string
  lrsUrl: string
  useDataSource?: UseDataSource
  layerType: LrsLayerType
  networkInfo?: NetworkInfo
  eventInfo?: EventInfo
  intersectionInfo?: IntersectionInfo
  useFieldAlias?: boolean
  layerInfo?: any
}
export interface DefaultInfo {
  index: number
  name: string
}

export interface AttributeSet {
  attributeSet: []
}

export interface Config {
  lrsLayers: LrsLayer[]
  networkLayers: string[]
  eventLayers: string[]
  intersectionLayers: string[]
  defaultEvent?: DefaultInfo
  defaultMethod?: Method
  highlightStyle?: HighlightStyle
  defaultPointAttributeSet: string
  defaultLineAttrbuteSet: string
  attributeSets?: AttributeSet[]
  lineEventToggle: boolean
  pointEventToggle: boolean
  defaultNetworkLayer?: number
}

export interface HighlightStyle {
  routeColor: string
  width: number
}

export type IMConfig = ImmutableObject<Config>
