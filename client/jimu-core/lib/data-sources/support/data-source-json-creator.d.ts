import { type IMDataSourceJson, Immutable, type DataSourceSchema, type ServiceDefinition } from 'jimu-core';
import type { IItem } from '@esri/arcgis-rest-portal';
import { AllDataSourceTypes, type ArcGISSubLayer } from '../interfaces/common-data-source-interface';
export declare function createDataSourceJson(dsId: string, layer: __esri.Layer, itemInfo: {
    portalUrl: string;
    item?: IItem;
    data?: any;
}, serviceInfo: {
    url: string;
    layerDefinition: ServiceDefinition;
}, dsJsonInConfig?: IMDataSourceJson, schemaInConfig?: Immutable.ImmutableObject<DataSourceSchema>): IMDataSourceJson;
export declare function createDataSourceJsonByJSAPILayer(dsId: string, layer: __esri.Layer | ArcGISSubLayer, dsJsonInConfig?: IMDataSourceJson, schemaInConfig?: Immutable.ImmutableObject<DataSourceSchema>): IMDataSourceJson;
/**
 * Generally, we only use this method to get raw data source json to get data source type and label.
 * Item info misses some information such as geometry type.
 */
export declare function createDataSourceJsonByItemInfo(dsId: string, item: IItem, portalUrl: string, dsJsonInConfig?: IMDataSourceJson, schemaInConfig?: Immutable.ImmutableObject<DataSourceSchema>): IMDataSourceJson;
export declare function createDataSourceJsonByItemData(dsId: string, itemData: any, portalUrl: string, dsJsonInConfig?: IMDataSourceJson, schemaInConfig?: Immutable.ImmutableObject<DataSourceSchema>): IMDataSourceJson;
export declare function createDataSourceJsonByLayerDefinition(dsId: string, layerDefinition: ServiceDefinition, url: string, dsJsonInConfig?: IMDataSourceJson, schemaInConfig?: Immutable.ImmutableObject<DataSourceSchema>): IMDataSourceJson;
export declare function getDataSourceTypeFromArcGISWholeServiceUrl(url: string, options?: any): AllDataSourceTypes;
