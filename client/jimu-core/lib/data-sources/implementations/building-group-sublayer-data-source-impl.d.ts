import { type ServiceDefinition } from 'jimu-core/lib/types/service-definition';
import { AbstractLayerFolderDataSource, type LayerFolderChildDataSourceConstructorOptions } from '../base-classes';
import { DataSourceTypes } from '../interfaces';
export declare class BuildingGroupSubLayerDataSourceImpl extends AbstractLayerFolderDataSource {
    type: DataSourceTypes.BuildingGroupSubLayer;
    serviceUrl: string;
    layerDefinition: any;
    ready(): Promise<void>;
    fetchServiceDefinition(): Promise<ServiceDefinition>;
    createChildDataSourceOptionsById(childDsId: string, jimuChildId: string, childId: string): LayerFolderChildDataSourceConstructorOptions;
    getChildIds(): string[];
    getSubLayerByChildId(childId: string): __esri.BuildingComponentSublayer | __esri.BuildingGroupSublayer;
    getSubLayerDefinitionByChildId(childId: string): any;
    getSubLayerUrlByChildId(childId: string): string;
}
