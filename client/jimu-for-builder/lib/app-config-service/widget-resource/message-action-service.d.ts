import { type IMAppConfig } from 'jimu-core';
export declare class MessageActionService {
    /**
     * Duplicate a widget's message action config. Including:
     * 1. duplicate the item that matches widgetId
     * 2. duplicate actions that matches widgetId
     * @param appConfig
     * @param widgetId
     * @param newWidgetId
     * @returns
     */
    duplicate(appConfig: IMAppConfig, widgetId: string, newWidgetId: string): [IMAppConfig, string];
    /**
     * Clean the messageConfigs, remove anything that related to the widgetId
     * @param appConfig
     * @param widgetId
     * @returns
     */
    removeFromWidget(appConfig: IMAppConfig, widgetId: string): IMAppConfig;
}
declare const _default: MessageActionService;
export default _default;
