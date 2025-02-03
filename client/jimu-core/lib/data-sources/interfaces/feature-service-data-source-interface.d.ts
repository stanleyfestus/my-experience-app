import { type AbstractArcGISLayerFolderDataSource, type DataSourceTypes } from './common-data-source-interface';
/**
 * `FeatureServiceDataSource` is created from feature service.
 */
export interface FeatureServiceDataSource extends AbstractArcGISLayerFolderDataSource {
    type: DataSourceTypes.FeatureService;
}
