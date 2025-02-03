import { type MessageType, type MessageJson, type IMWidgetJson, type MessageAction, type MessageActionJson, Immutable, type ImmutableObject, type WidgetJson, type ImmutableArray, type UseDataSource } from 'jimu-core';
import { type FrameWorkTargetJson } from '../type';
/**
 * Get new message json
*/
export declare const getNewMessage: (messageType: MessageType, widgetId: string) => MessageJson;
/**
 * Get new action item json
*/
export declare const getNewActionItem: (target: IMWidgetJson | FrameWorkTargetJson, action: MessageAction, widgetId: string, messageType: MessageType) => MessageActionJson;
/**
 * Get map useDataSources by widgetJson.useMapWidgetIds
 * @param widgetId Note, widgetId is not the map widget id. widgetId is the message widgetId.
 * @returns
 */
export declare function getMapUseDataSourcesByUseMapWidgetIds(widgetId: string): ImmutableArray<UseDataSource>;
export declare function getWidgetJson(widgetId: string): ImmutableObject<WidgetJson>;
export declare function getAppConfig(): Immutable.ImmutableObject<import("jimu-core").AppConfig>;
