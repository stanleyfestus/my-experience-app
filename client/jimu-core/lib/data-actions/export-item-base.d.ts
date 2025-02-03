import { AbstractDataAction, DataLevel } from '../base-data-action';
import { type DataSource, type DataRecord, type DataRecordSet } from '../data-sources/interfaces';
import { type IItemAdd, type ICreateItemOptions, type ICreateItemResponse } from '@esri/arcgis-rest-portal';
import { type IDomain, type ArcGISIdentityManager } from '@esri/arcgis-rest-request';
import { type ILayerDefinition, type IField } from '@esri/arcgis-rest-feature-service';
import { type FieldSchema } from '../types/app-config';
export declare abstract class ExportToItemBase extends AbstractDataAction {
    isSupported(dataSets: DataRecordSet[], dataLevel: DataLevel): Promise<boolean>;
    isDataSetSupportExportItem(dataSet: DataRecordSet, dataLevel: DataLevel): Promise<boolean>;
    addItem(item: IItemAdd, auth: ArcGISIdentityManager, option?: Partial<ICreateItemOptions>, folderId?: string): Promise<ICreateItemResponse>;
    createItem(item: IItemAdd, folderId: string): Promise<string>;
    createServiceItem(dataSet: DataRecordSet, name: string, folderId: string): Promise<string>;
    getFieldDomain(field: FieldSchema | IField, dataSource: DataSource, records: DataRecord[]): IDomain;
    getFieldForLayerDefinition(field: FieldSchema | IField, dataSource: DataSource, records: DataRecord[]): IField;
    getLayerForFeatureCollection(dataSet: DataRecordSet, dataLevel: DataLevel, featureUtils: any, widgetId: string, returnGeometry?: boolean): Promise<{
        popupInfo: import("@esri/arcgis-rest-feature-service").IPopupInfo;
        layerDefinition: ILayerDefinition;
        featureSet: any;
    }>;
    createFeatureCollectionItem(dataSets: DataRecordSet[], dataLevel: DataLevel, name: string, folderId: string, widgetId: string, returnGeometry?: boolean): Promise<string>;
    checkPrivilege(): Promise<boolean>;
    private checkRenderPrivilege;
    private getAllFeatureCollection;
    private query;
}
