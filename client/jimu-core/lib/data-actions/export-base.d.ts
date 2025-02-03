import { AbstractDataAction, DataLevel } from '../base-data-action';
import { type DataSource, type QueriableDataSource, type DataRecord, type DataRecordSet } from '../data-sources/interfaces';
import { type GeometryType, type IGeometry, type Units } from '@esri/arcgis-rest-feature-service';
export declare abstract class ExportBase extends AbstractDataAction {
    isSupported(dataSets: DataRecordSet[], dataLevel: DataLevel): Promise<boolean>;
    dataSourceAllowExport(dataSet: DataRecordSet, dataLevel: DataLevel): Promise<boolean>;
    checkPrivilege(): Promise<boolean>;
    confirm(dataSource: DataSource, dataLevel: DataLevel): Promise<{
        needed: boolean;
        content?: {
            title: string;
            content: string;
            okLabel: string;
            cancelLabel: string;
        };
    }>;
    getExportFileName(dataSource: DataSource): string;
    /**
     * Used in DataLevel.Records, return dataSet records or dataSource selection.
     * @param dataSet
     */
    getLocalRecrods(dataSet: DataRecordSet): DataRecord[];
    getRecords(dataSource: DataSource, fields?: string[], returnGeometry?: boolean): Promise<DataRecord[]>;
    processGeometryAndBuffer(geometry: IGeometry, distance: number, units: Units): Promise<[IGeometry, GeometryType]>;
    tryCreateReplica(dataSource: QueriableDataSource, format: string, outFields?: string[]): Promise<string>;
    saveAsLocalFile(blob: Blob, fileName: string): void;
}
