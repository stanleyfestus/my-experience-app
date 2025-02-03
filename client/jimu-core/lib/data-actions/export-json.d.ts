import * as React from 'react';
import { ExportBase } from './export-base';
import { type DataRecordSet, type DataRecord, type DataSource } from '../data-sources/interfaces';
import { DataLevel } from '../base-data-action';
export default class ExportJson extends ExportBase {
    constructor(props: any);
    onExecute(dataSets: DataRecordSet[], dataLevel: DataLevel): Promise<boolean | React.ReactElement>;
    processDataRecord(record: DataRecord, fields?: string[]): any;
    exportRecords(dataSource: DataSource, records: DataRecord[], fields?: string[]): Promise<void>;
    batchExport(dataSets: DataRecordSet[]): Promise<boolean>;
    doExport(dataSet: DataRecordSet, dataLevel: DataLevel): Promise<boolean>;
}
