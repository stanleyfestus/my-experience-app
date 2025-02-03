import { AbstractDataSource } from './abstract-data-source';
import { type LoadableDataSource, type DataRecord } from '../interfaces';
/** @ignore */
export declare abstract class AbstractLoadableDataSource extends AbstractDataSource implements LoadableDataSource {
    load(): Promise<DataRecord[]>;
    abstract doLoad(): Promise<DataRecord[]>;
}
