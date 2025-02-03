import { DataSourceTypes, type DataSource, type DataSourceConstructorOptions, type DataSourceError } from '../interfaces';
import { AbstractDataSource } from '../base-classes';
export interface ErrorDataSourceConstructorOptions extends DataSourceConstructorOptions {
    error: DataSourceError;
}
export declare class ErrorDataSourceImpl extends AbstractDataSource implements DataSource {
    type: DataSourceTypes.Error;
    error: DataSourceError;
}
