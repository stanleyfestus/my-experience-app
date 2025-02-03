import { type FeatureLayerDataSourceImpl, SceneLayerDataSourceImpl, type BuildingComponentSubLayerDataSource } from '..';
export declare class BuildingComponentSubLayerDataSourceImpl extends SceneLayerDataSourceImpl implements BuildingComponentSubLayerDataSource {
    type: any;
    createAssociatedDataSource(): Promise<FeatureLayerDataSourceImpl>;
    getAssociatedFeatureServerUrl(): string;
    _createAssociatedDataSourceWithLayer(): Promise<FeatureLayerDataSourceImpl>;
    _createAssociatedDataSourceWithLayerDefinition(): Promise<FeatureLayerDataSourceImpl>;
}
