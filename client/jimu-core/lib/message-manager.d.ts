import { type IMWidgetJson, type MessageActionJson, type AppConfig } from './types/app-config';
import { type Message, type DummyMessageAction, type MessageAction, type RegisterMessageActionOptions } from './message/message-base-types';
import { type BaseVersionManager } from './version-manager';
/**
 * The `MessageManager` is used to manage message and message action.
 * When you need to publish a message in widget, you can use `MessageManager.getInstance().publishMessage()`.
 */
export declare class MessageManager {
    static instance: MessageManager;
    static getInstance(): MessageManager;
    private actions;
    private actionClassPromises;
    getActions(): MessageAction[];
    getWidgetActions(widgetId: string): MessageAction[];
    getAction(widgetId: string, actionName: string): MessageAction;
    destroyWidgetActions(widgetId: string): void;
    registerWidgetActions(widgetJson: IMWidgetJson, appConfig?: AppConfig): Promise<any>;
    registerAction(options: RegisterMessageActionOptions): Promise<MessageAction>;
    upgradeActionConfig(actionJson: MessageActionJson, versionManager: BaseVersionManager, widgetVersion: string): Promise<void>;
    loadActionClass(uri: string): Promise<typeof DummyMessageAction>;
    /**
     * Publish a message: the registered message actions that match will be executed.
     * @param message The message to be published.
     */
    publishMessage(message: Message): Promise<void>;
    /**
     * Open the widget if it's in a widget controller
     */
    private openWidget;
    private exeAction;
}
/** @ignore */
export default MessageManager;
