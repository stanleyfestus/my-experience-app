import { AbstractDataSource } from '../base-classes';
import { type DataRecord, type SimpleLocalDataSource, DataSourceTypes } from '../interfaces';
/**
 * @ignore
 */
export declare class SimpleLocalDataSourceImpl extends AbstractDataSource implements SimpleLocalDataSource {
    type: DataSourceTypes.SimpleLocal;
    updateRecords(records: DataRecord[]): Promise<boolean>;
    addRecord(record: DataRecord): Promise<DataRecord>;
    updateRecord(record: DataRecord): Promise<boolean>;
    deleteRecord(index: number): Promise<boolean>;
}
