import * as React from 'react';
import { AbstractDataAction, DataLevel } from '../base-data-action';
import { type DataRecordSet } from '../data-sources/interfaces';
export default class SetFilter extends AbstractDataAction {
    _version: number;
    _modules: any;
    dsId: string;
    constructor(props: any);
    loadModules(): Promise<void>;
    isSupported(dataSets: DataRecordSet[], dataLevel: DataLevel, widgetId: string): Promise<boolean>;
    onExecute(dataSets: DataRecordSet[], dataLevel: DataLevel, widgetId: string): Promise<boolean | React.ReactElement>;
    private onDsInfoChange;
}
