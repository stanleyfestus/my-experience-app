/** @jsx jsx */
import { Immutable, type UseDataSource, MessageCarryData, MessageType, type ImmutableArray, type IMWidgetJson, type IMUseDataSource } from 'jimu-core';
import { type IMConfig, type Config } from './type';
export interface getDsSelectorSourceDataParams {
    widgetId: string;
    useDataSource: Immutable.ImmutableObject<UseDataSource>;
    messageType: MessageType;
    arcGISDataSourceTypes: any;
}
export interface InitUseDataSourceParam {
    widgetId: string;
    oldUseDataSource: Immutable.ImmutableObject<UseDataSource>;
    messageType: MessageType;
    arcGISDataSourceTypes: any;
}
export interface DsSelectorSource {
    isReadOnly: boolean;
    useDataSources: ImmutableArray<UseDataSource>;
    fromRootDsIds: ImmutableArray<string>;
    fromDsIds: ImmutableArray<string>;
}
export declare function getDsSelectorSourceData(props: getDsSelectorSourceDataParams): DsSelectorSource;
export declare function checkIsOnlyOneDs(widgetJson: IMWidgetJson, messageCarryData: MessageCarryData, dsRootIds: ImmutableArray<string>): boolean;
export declare function getDsRootIdsByWidgetId(wId: string, arcGISDataSourceTypes: any): ImmutableArray<string>;
export declare function getDsIdsByWidgetId(wId: string, messageType: MessageType): ImmutableArray<string>;
export declare function getDsByWidgetId(wId: string, messageType: MessageType): ImmutableArray<UseDataSource>;
export declare function isUseOutputDs(wId: string, messageType: MessageType): boolean;
/**
 * Get MessageCarryData by widget id and messageType
*/
export declare function getMessageCarryData(wId: string, messageType: MessageType): MessageCarryData;
export declare function initOutputDataSources(outputDataSources: any): ImmutableArray<UseDataSource>;
export declare function getMessageCarryDataByWidgetId(wId: string, messageType: MessageType): MessageCarryData;
/**
 * Initialize the useDataSource by comparing the current useDatasources and oldUseDatasources of the widget,
 * if they are the same, use oldDatasources, otherwise update to null
*/
export declare function checkAndGetInitUseDataSource(props: InitUseDataSourceParam): Immutable.ImmutableObject<UseDataSource>;
export declare function checkTriggerLayerIsSameToActionLayer(config: IMConfig): boolean;
export declare function checkIsSameRootDataSourceId(config: IMConfig): boolean;
export declare function getUseDataSourceFromActionConfig(config: IMConfig | ImmutableArray<Config>): UseDataSource[];
export declare function getNewActionConfigWhenAllUseDataSourceChange(actionConfig: IMConfig, allUseDataSourceOfAction: UseDataSource[]): {
    isConfigChange: boolean;
    newActionConfig: any;
};
export declare function getNewActionDataSources(allUseDataSourceOfAction: UseDataSource[], actionUseDataSource: IMUseDataSource): IMUseDataSource;
