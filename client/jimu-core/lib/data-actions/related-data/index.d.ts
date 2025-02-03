/** @jsx jsx */
import * as React from 'react';
import type { Popper, Loading, LoadingType, Label, Button, Select, Icon, DataActionList, DataActionListStyle, CollapsablePanel } from 'jimu-ui';
import { AbstractDataAction, DataLevel, type DataActionConstructorOptions } from '../../base-data-action';
import { type DataRecordSet } from '../../data-sources/interfaces';
export interface UIComponents {
    Popper: typeof Popper;
    Loading: typeof Loading;
    LoadingType: typeof LoadingType;
    Label: typeof Label;
    Button: typeof Button;
    Select: typeof Select;
    Icon: typeof Icon;
    DataActionList: typeof DataActionList;
    DataActionListStyle: typeof DataActionListStyle;
    CollapsablePanel: typeof CollapsablePanel;
    jimuUIMessages: {
        [key: string]: any;
    };
}
export default class RelatedData extends AbstractDataAction {
    private _version;
    private _modules;
    static dataViewInfo: {};
    private relatedDataPopperRef;
    isWatchingDataSetsChange: boolean;
    constructor(props: DataActionConstructorOptions);
    loadModules(): Promise<void>;
    isSupported(dataSets: DataRecordSet[], dataLevel: DataLevel): Promise<boolean>;
    onExecute(dataSets: DataRecordSet[], dataLevel: DataLevel, widgetId: string, actionConfig?: any): Promise<boolean | React.ReactElement>;
    onDataSetsChange(dataSets: DataRecordSet[], widgetId: string): void;
}
