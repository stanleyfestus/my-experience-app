import { type DataAction, type RegisterDataActionOptions, type DataLevel } from './base-data-action';
import { type DataRecordSet } from './data-sources/interfaces';
import { type IMWidgetJson } from './types/app-config';
import { type ImmutableArray } from 'seamless-immutable';
export default class DataActionManager {
    static instance: DataActionManager;
    static getInstance(): DataActionManager;
    private actions;
    private actionClassPromises;
    getActions(): DataAction[];
    getSupportedActions(widgetId: string, dataSets: DataRecordSet[], dataLevel: DataLevel): Promise<{
        [key: string]: DataAction[];
    }>;
    private getAllWidgetsInSameRootContainer;
    /**
     * This method works for both action and batch action
     * @param actionIdentify format is `${widgetName}.${actionName}`
     * @param excludedActions
     */
    isActionExcluded(actionIdentify: string, excludedActions?: string[] | ImmutableArray<string>): boolean;
    /**
     * Register both the DataAction and BatchDataAction for a widget
     */
    registerWidgetActions(widgetJson: IMWidgetJson): Promise<DataAction[]>;
    registerAction(options: RegisterDataActionOptions): Promise<DataAction>;
    executeDataAction(action: DataAction, dataSets: DataRecordSet[], dataLevel: DataLevel, widgetId: string, actionConfig?: any): Promise<boolean | React.ReactElement>;
    /**
     * Open the widget if it's in a widget controller
     */
    private openWidget;
    destroyWidgetActions(widgetId: string): void;
    private loadActionClass;
    private testActionSupportData;
}
