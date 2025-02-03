import { AbstractLayerFolderDataSource, type LayerFolderChildDataSourceConstructorOptions } from '../base-classes';
import { type DataSourceConstructorOptions, DataSourceTypes, type SqlQueryParams } from '../interfaces';
import { type BuildingSceneLayerDataSourceInterface } from '../interfaces/building-scene-layer-data-source-interface';
type SubLayer = __esri.BuildingComponentSublayer | __esri.BuildingGroupSublayer;
export interface BuildingSubLayerDataSourceOptions extends DataSourceConstructorOptions {
    serviceUrl?: string;
    layerDefinition?: any;
    layer?: any;
}
export declare class BuildingSceneLayerDataSourceImpl extends AbstractLayerFolderDataSource implements BuildingSceneLayerDataSourceInterface {
    type: DataSourceTypes.BuildingSceneLayer;
    layer?: __esri.BuildingSceneLayer;
    constructor(options: any);
    ready(): Promise<any>;
    createChildDataSourceOptionsById(childDsId: string, jimuChildId: string, childId: string): LayerFolderChildDataSourceConstructorOptions;
    getChildIds(): string[];
    getSubLayerByChildId(childId: string): SubLayer;
    getSubLayerDefinitionByChildId(childId: string): any;
    getSubLayerUrlByChildId(childId: string): string;
    updateQueryParams(sqlQueryParams: SqlQueryParams, widgetId: string): void;
}
export {};
