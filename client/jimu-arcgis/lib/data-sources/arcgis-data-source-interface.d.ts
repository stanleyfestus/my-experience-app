import type { IMDataSourceSchema, DataSource, FeatureLayerDataSource, FeatureDataRecord, ItemMixin, ArcGISSubLayer, SetDataSourceMixin } from 'jimu-core';
/**
 * The data source types that `jimu-arcgis` supports.
 * For additional data source types, please see `DataSourceTypes` from the `jimu-core` package.
 */
export declare enum DataSourceTypes {
    Map = "MAP",
    WebMap = "WEB_MAP",
    WebScene = "WEB_SCENE"
}
/**
 * @ignore
 * JS API layer types.
 */
export declare enum LayerTypes {
    BaseDynamicLayer = "base-dynamic",
    BaseElevationLayer = "base-elevation",
    BaseTileLayer = "base-tile",
    BuildingSceneLayer = "building-scene",
    BuildingGroupSublayer = "building-group",
    BuildingComponentSublayer = "building-component",
    CSVLayer = "csv",
    ElevationLayer = "elevation",
    FeatureLayer = "feature",
    GeoJSONLayer = "geojson",
    GeoRSSLayer = "geo-rss",
    GraphicsLayer = "graphics",
    GroupLayer = "group",
    SubtypeGroupLayer = "subtype-group",
    SubtypeSublayer = "subtype-sublayer",
    ImageryLayer = "imagery",
    ImageryTileLayer = "imagery-tile",
    OrientedImageryLayer = "oriented-imagery",
    IntegratedMeshLayer = "integrated-mesh",
    KMLLayer = "kml",
    MapImageLayer = "map-image",
    MapNotesLayer = "map-notes",
    PointCloudLayer = "point-cloud",
    SceneLayer = "scene",
    TileLayer = "tile",
    UnknownLayer = "unknown",
    UnsupportedLayer = "unsupported",
    VectorTileLayer = "vector-tile",
    WMSLayer = "wms",
    WMTSLayer = "wmts",
    WebTileLayer = "web-tile"
}
/**
 * Interface for map related data sources.
 * It contains a JS API Map instance.
 */
export interface MapDataSource extends DataSource, SetDataSourceMixin {
    type: DataSourceTypes.Map | DataSourceTypes.WebMap | DataSourceTypes.WebScene;
    map: __esri.Map;
    ready: () => Promise<void>;
    childDataSourcesReady: () => Promise<DataSource[]>;
    fetchSchema: () => Promise<IMDataSourceSchema>;
    getDataSourceByLayer: (layer: __esri.Layer | ArcGISSubLayer) => DataSource;
    createDataSourceByLayer: (layer: __esri.Layer | ArcGISSubLayer) => Promise<DataSource>;
    createDataSourceById: (dataSourceId: string) => Promise<DataSource>;
}
/**
 * Web map data source is created from a webmap.
 * It may have child data sources (such as feature layer data source, group layer data source and so on).
 */
export interface WebMapDataSource extends MapDataSource, ItemMixin {
    type: DataSourceTypes.WebMap;
    map: __esri.WebMap;
}
/**
 * Web scene data source is created from a webscene.
 * It may have child data sources (such as feature layer data source, scene layer data source and so on).
 */
export interface WebSceneDataSource extends MapDataSource, ItemMixin {
    type: DataSourceTypes.WebScene;
    map: __esri.WebScene;
}
/**
 * The data source types that `jimu-arcgis` supports.
 * For additional data source types, please see `DataSourceTypes` from the `jimu-core` package.
 * See {@link DataSourceTypes} for details.
 */
export { DataSourceTypes as ArcGISDataSourceTypes };
export type { FeatureLayerDataSource, FeatureDataRecord };
