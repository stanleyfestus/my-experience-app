import type { IGeometry, GeometryType, IFeature, IPopupInfo, ILayerDefinition, SpatialRelationship, Units, ISpatialReference } from '@esri/arcgis-rest-feature-service'
import { type IMDataSourceSchema, type ImmutableObject, type IntlShape } from 'jimu-core'

import type {
  QueriableDataSource, JSAPILayerMixin, ItemMixin, DataRecord, SqlQueryParams, QueryOptions, QueryResult, GetCurrentQueryParamsOptions,
  AttachmentInfo, TimeExtent, TimeInfo, CodedValue, StatisticDefinition, QueriableSelectOptions, Capabilities, QueryCapabilities, QueryProgressCallback,
  QueriableUsedFieldsOptions, TimezoneRuntime
} from './common-data-source-interface'
import type { ArcGISSubtypeSublayer } from './subtype-sublayer-data-source-interface'
import type { ArcGISSubtypeGroupLayer } from './subtype-group-layer-data-source-interface'

export type ArcGISQueriableLayerTypes = __esri.FeatureLayer | __esri.SceneLayer | __esri.OrientedImageryLayer | __esri.ImageryLayer | ArcGISSubtypeGroupLayer | ArcGISSubtypeSublayer

/**
 * `ArcGISQueriableDataSource` is created from a single ArcGIS queriable layer, such as feature layer, imagery layer and subtype group layer.
 */
export interface ArcGISQueriableDataSource extends QueriableDataSource, JSAPILayerMixin, ItemMixin {
  url?: string
  portalUrl?: string
  itemId?: string
  layerId?: string
  layer?: ArcGISQueriableLayerTypes
  /** Return the current GDB version. */
  getGDBVersion: () => string
  /** Change the layer GDB version. */
  changeGDBVersion: (gdbVersion: string) => void
  supportSymbol: () => boolean
  supportAttachment: () => boolean
  setLayerDefinition: (layerDefinition: ILayerDefinition) => void
  getLayerDefinition: () => ILayerDefinition
  setPopupInfo: (popupInfo: IPopupInfo) => void
  getPopupInfo: () => IPopupInfo
  /**
   * @ignore
   * To do query based on query capabilities of the layer, we do two things.
   * 1. Before doing query, we fix query object by removing some conflicts params, see `fixQueryParam`.
   * 2. When doing query, we send query request by query capabilities (may remove some params), then enhance the result (using the removed params), see `doQuery`.
   */
  getCapabilities: () => ArcGISCapabilities
  supportTime: () => boolean
  getTimeInfo: () => TimeInfo
  /**
   * @ignore
   * If layer is in unknown timezone, will return 'unknown'.
   * If use device timezone, will return 'device'.
   * If use a specific timezone, will return the timezone name.
   *    There are two datasets: Calcite component values such as'Asia/shanghai', Services values such as'Pacific Standard Time'.
   * If do not find any timezone settings, will return null.
   */
  getTimezone: () => TimezoneRuntime

  // #region Overrides for parent interface
  load: (query: ArcGISQueryParams, options?: QueryOptions) => Promise<DataRecord[]>
  loadCount: (query: ArcGISQueryParams, options?: QueryOptions) => Promise<number>
  query: (query: ArcGISQueryParams, options?: QueryOptions) => Promise<QueryResult>
  queryIds: (query: ArcGISQueryParams, options?: QueryOptions) => Promise<QueryResult>
  queryExtent: (query: ArcGISQueryParams, options?: QueryOptions) => Promise<QueryResult>
  queryCount: (query: ArcGISQueryParams, options?: QueryOptions) => Promise<QueryResult>
  selectRecords: (options: ArcGISSelectOptions, signal?: AbortSignal, progressCallback?: QueryProgressCallback) => Promise<QueryResult>
  selectRecordById: (id: string, record?: FeatureDataRecord) => void
  selectRecordsByIds: (ids: string[], records?: FeatureDataRecord[]) => void
  getIdField: () => string
  getGeometryType: () => GeometryType
  getConfigQueryParams: () => ArcGISQueryParams
  mergeQueryParams: (...queries: ArcGISQueryParams[]) => ArcGISQueryParams
  getRealQueryParams: (query, flag: 'query' | 'load', options?: QueryOptions) => ArcGISQueryParams
  getCurrentQueryParams: (options?: GetCurrentQueryParamsOptions) => ArcGISQueryParams
  getAllUsedFields: (options?: ArcGISQueriableUsedFieldsOptions) => string[] | '*'
  fetchSchema: () => Promise<IMDataSourceSchema>
  getFieldCodedValueList: (jimuFieldName: string, record?: FeatureDataRecord) => CodedValue[]
  buildRecord: (feature: IFeature | __esri.Graphic) => FeatureDataRecord
  getDataViews: () => ArcGISQueriableDataSource[]
  getDataView: (dataViewId: string) => ArcGISQueriableDataSource
  getMainDataSource: () => ArcGISQueriableDataSource

  /**
   * When current data source is created from an array of records (`DataRecord`), will save it in `sourceRecords`.
   * These two methods are used to update or get the source data.
   * Please note, use these two methods only when `isDataInDataSourceInstance` is true.
   */
  setSourceRecords: (records: DataRecord[]) => void
  /** Return the source records */
  getSourceRecords: () => DataRecord[]
  /**
   * When current data source is created from an array of features (__esri.Graphic), will save it in an ArcGIS Maps SDK for JavaScript feature layer.
   * This method is used to update the source data.
   * Please note, use this method only when `isDataInDataSourceInstance` is not true.
   */
  setSourceFeatures: (features: Array<__esri.Graphic | __esri.GraphicProperties>, others?: Omit<__esri.FeatureLayerProperties, 'source' | 'fields' | 'objectIdField'>) => Promise<void>
  // #endregion
}

/**
 * Query parameters for the arcgis queriable data source.
 */
export interface ArcGISQueryParams extends SqlQueryParams {
  /**
   * Object IDs of records to be queried.
   */
  objectIds?: string[]
  /**
   * The geometry of the spatial filter.
   */
  geometry?: IGeometry
  geometryType?: GeometryType
  /**
   * The spatial relationship to be applied to the input geometry while performing the query.
   */
  spatialRel?: SpatialRelationship
  /**
   * The buffer distance for the input geometries.
   */
  distance?: number
  /**
   * The unit for calculating the buffer distance.
   */
  units?: Units
  /**
   * The spatial reference of the returned geometry.
   */
  outSR?: number | ISpatialReference
  /**
   * If true, the geometry of each result feature will be returned.
   */
  returnGeometry?: boolean
  /**
   * This option can be used to specify the number of decimal places for the returned geometries.
   */
  geometryPrecision?: number
  /**
   * The definitions for one or more field-based statistics to be calculated.
   */
  outStatistics?: StatisticDefinition[]
  /**
   * One or more `jimuFieldName` by which the values will be grouped for calculating the statistics.
   */
  groupByFieldsForStatistics?: string[]
  /**
   * If true, z-values are included in the results if the features have z-values. Otherwise, z-values are not returned.
   */
  returnZ?: boolean
  /**
   * If true, m-values are included in the results if the features have m-values. Otherwise, m-values are not returned.
   */
  returnM?: boolean
  /**
   * Specify the geodatabase version to be queried.
   */
  gdbVersion?: string
  /**
   * The sqlFormat parameter can be either standard SQL-92 standard or it can use the native SQL of the underlying data store.
   */
  sqlFormat?: 'none' | 'standard' | 'native'
  /**
   * If true, it returns distinct values based on the fields specified in outFields.
   */
  returnDistinctValues?: boolean
  /**
   * The time instant or the time extent to query. A null value specified for start time or end time will represent infinity for start or end time, respectively.
   */
  time?: TimeExtent
  /**
   * If true, the queried features have full precision geometry.
   */
  returnFullGeometry?: boolean
  /**
   * If true, don't add missed fields into layer.outFields for client query.
   */
  notAddFieldsToClient?: boolean
  /**
   * If true, it always sends http request to server to get the response.
   */
  disableClientQuery?: boolean
}

export type IMArcGISQueryParams = ImmutableObject<ArcGISQueryParams>

/**
 * @ignore
 */
export interface ArcGISCapabilities extends Capabilities {
  getQueryCapabilities: () => ArcGISQueryCapabilities
  // TODO: edit, attachment, operation, queryRelated and so on.
}

/**
 * @ignore
 */
export interface ArcGISQueryCapabilities extends QueryCapabilities {
  supportsStatistics: boolean
  supportsPagination: boolean
  supportsOrderBy: boolean
  supportsDistinct: boolean
  // map from supportsPaginationOnAggregatedQueries, undefined will be regarded as true since some services do not have this capability but support to use pagination with distinct
  supportsPaginationOnDistinct: boolean
  // map from supportsPaginationOnAggregatedQueries, undefined will be regarded as false
  supportsPaginationOnStatisticsWithGroupBy: boolean
  // if true, can not use out statistic fields as order by fields
  supportsOrderByOnlyOnLayerFields: boolean
  // supports percentile as a statisticType when using outStatistics
  supportsPercentileStatistics: boolean
  supportedQueryFormats: string
  supportsReturningQueryExtent: boolean
}

/**
 * Record of the ArcGIS queriable data source.
 */
export interface FeatureDataRecord extends DataRecord {
  /** The feature returned from query ArcGIS REST APIs or the ArcGIS Maps SDK for JavaScript [Graphic](https://developers.arcgis.com/javascript/latest/api-reference/esri-Graphic.html) object */
  feature: IFeature | __esri.Graphic
  dataSource: ArcGISQueriableDataSource
  attachmentInfos: AttachmentInfo[]
  /**
   * Whether the feature has full precision geometry. Default is true.
   * If a client-side query is enabled in the map widget, it may be false.
   */
  hasFullGeometry: boolean
  clone: (deep?: boolean) => FeatureDataRecord
  queryAttachments: (attachmentTypes?: string[]) => Promise<AttachmentInfo[]>
  fetchSymbolPreviewHTML: () => Promise<HTMLElement>
  getData: () => { [key: string]: any }
  getFormattedFieldValue: (jimuFieldName: string, intl: IntlShape) => string
  getDataBeforeMapping: () => { [key: string]: any }
  getOriginData: () => { [key: string]: any }
  toJson: () => IFeature | __esri.Graphic
  getId: () => string
  setId: (id: string) => void
  getGeometry: () => IGeometry
  setFeature: (feature: IFeature | __esri.Graphic) => void
  getFeature: () => IFeature | __esri.Graphic
  getJSAPIGraphic: () => Promise<__esri.Graphic>
}

export interface ArcGISSelectOptions extends QueriableSelectOptions {
  queryParams?: Pick<ArcGISQueryParams, 'where' | 'geometry' | 'spatialRel'>
}

export interface ArcGISQueriableUsedFieldsOptions extends QueriableUsedFieldsOptions {
  queryParams?: ArcGISQueryParams
}
