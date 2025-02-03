import { type AppConfig, type IMAppConfig } from '../types/app-config';
import { type WidgetProps } from '../types/props';
import { type IMState } from '../types/state';
import { type Resource } from '../types/common';
import { type LayoutContextToolProps, type LayoutTransformFunc, type LayoutItemTransformFunc } from '../types/layout';
import { type WidgetManifest } from '../types/manifest';
/**
 * Extension points allow a widget to run code at certain specific times of the Experience Builder application lifecycle.
 *
 * To add a extension in a widget, add the `extensions` in the widget's manifest.json file.
 *
 * The extension points supported by the Jimu framework are defined here.
 */
export declare enum ExtensionPoints {
    /**
     * This extension point gives widgets a opportunity to run code just after the app config is loaded.
     *
     * The extension for this extension point should implement the `AppConfigProcessorExtension` interface.
     * The `process()` method of the extension will be invoked with the loaded app config, and this method should return the processed app config.
     *
     */
    AppConfigProcessor = "APP_CONFIG_PROCESSOR",
    /**
     * @ignore
     * The extension for the `WidgetClassWrapper` extension point will be invoked after the widget class is loaded and core props have been injected.
     *
     * The class for this extension should implement the `IWidgetClassWrapperExtension` interface.
     */
    WidgetClassWrapper = "WIDGET_CLASS_WRAPPER",
    /**
     * @ignore
     * The `AppConfigService` extension point is used to get the config service, which is used to save and load the app config.
     *
     * The class for this extension should implement the `IAppConfigServiceExtension` interface.
     */
    AppConfigService = "APP_CONFIG_SERVICE",
    /**
     * A redux-based application has only one store. If a widget needs to use redux to manage its state, it can use the `ReduxStore` extension to extend the redux store.
     *
     * The extension for this extension point should implement the `ReduxStoreExtension` interface.
     */
    ReduxStore = "REDUX_STORE",
    /**
     * This extension point is used to include third-party libraries.
     * Usually the `dependency` property of the widget manifest should be used to load third-party libraries instead of this extension point.
     * This extension point can be used as an alternative in case where the third-party library requires initialization.
     *
     * The extension for this extension point should implement the `DependencyDefineExtension` interface.
     */
    DependencyDefine = "DEPENDENCY_DEFINE",
    /**
     * @ignore
     * The `DataSourceFactoryUri` extension point is used to find the data source factory.
     * Because ds factory is heavy so app can't load all ds factories.
     * So, we define this extension and app will load all of these extensions and use this extension to load factory.
     */
    DataSourceFactoryUri = "DATA_SOURCE_FACTORY_URI",
    /**
     * This extension point allows the developer to add additional tools to the context toolbar that shows when the widget is selected in the builder interface.
     *
     * The extension for this extension point should implement the the `ContextToolExtension` interface.
     */
    ContextTool = "CONTEXT_TOOL",
    /**
     * Some widgets may need to know app config changes even when its setting panel is not loaded, such as data source will be removed, map widget will be removed, etc.
     * Widget can define the extensions for this extension point to listen to the changes.
     *
     * The extension for this extension point should implement the the `AppConfigOperationsExtension` interface.
     */
    AppConfigOperations = "APP_CONFIG_OPERATIONS",
    /** @ignore */
    LayoutTransformer = "LAYOUT_TRANSFORMER"
}
/**
 * The extension points that support multiple extensions.
 */
export declare const EP_SUPPORT_MULTIPLE_EXTENSIONS: ExtensionPoints[];
/**
 * The extension points that are only used in builder.
 */
export declare const EP_BUILDER_ONLY_EXTENSIONS: ExtensionPoints[];
/**
 * Base extension interface
 */
export interface BaseExtension {
    /**
     * If an extension point supports multiple extensions, the index is used to determine the extension order.
     */
    index?: number;
    /**
     * The unique ID. For widget's provided extension, the id pattern is: widgetId + extensionName
     */
    id: string;
    /** The extension name. */
    name?: string;
    /**
     * The extension label.
     */
    label?: string;
    /**
     * The widget ID that provides the extension. No widget id means the extension is provided by Jimu.
     */
    widgetId?: string;
    destroy?: () => void;
}
/**
 * @ignore
 * A dummy extension class, for type checking.
 */
export declare class DummyExtension implements BaseExtension {
    index?: number;
    id: string;
    name?: string;
    widgetId?: string;
    label?: string;
}
/**
 * The extension interface for AppConfigProcessor extension point.
 */
export interface AppConfigProcessorExtension extends BaseExtension {
    /** The method to process the app config. */
    process: (appConfig: AppConfig) => Promise<AppConfig>;
}
export interface WidgetClassWrapperExtension extends BaseExtension {
    wrap: (WidgetClass: React.ComponentType<WidgetProps>, manifest: WidgetManifest) => React.ComponentClass<WidgetProps>;
}
export interface AppConfigServiceExtension extends BaseExtension {
    loadAppConfig: () => Promise<AppConfig>;
}
/**
 * The extension interface for ReduxStore extension point.
 */
export interface ReduxStoreExtension extends BaseExtension {
    /** The method that returns the redux actions. */
    getActions: () => string[];
    /**
     * The method that returns the redux store key. The key supports this format: a.b.c.
     */
    getStoreKey: () => string;
    /** The method that returns the redux initial store state. */
    getInitLocalState: () => any;
    /**
     * The method that returns the redux reducer. The reducer should return local state.
     */
    getReducer: () => (localState: any, action: any, state: IMState) => any;
}
/**
 * The extension interface for DependencyDefine extension point.
 */
export interface DependencyDefineExtension extends BaseExtension {
    /** Return the dependency key. */
    getDependencyKey: () => string;
    /** Return the resources. */
    getResources: () => Resource[];
    /** This method will be invoked after the resources are loaded. You can put post initialization code in this method. */
    postInit?: () => Promise<void>;
}
export interface DataSourceFactoryUriExtension extends BaseExtension {
    getFactoryUri: (dataSourceType: any) => string;
}
/**
 * The extension interface for ContextTool extension point.
 */
export interface ContextToolExtension extends BaseExtension {
    /** Return group id. */
    getGroupId: () => string;
    /** Return the icon. */
    getIcon: () => React.ComponentClass<React.SVGAttributes<SVGElement>>;
    /** Return the title. */
    getTitle: (props: LayoutContextToolProps) => string;
    /** OnClick callback. */
    onClick?: (props: LayoutContextToolProps, evt?: React.MouseEvent<any>) => void;
    /** Check whether this tool is visible. */
    visible?: (props: LayoutContextToolProps) => boolean;
    /** Check whether this tool is checked. */
    checked?: (props: LayoutContextToolProps) => boolean;
    /** Check whether this tool is disabled. */
    disabled?: (props: LayoutContextToolProps) => boolean;
    /** Check whether this tool should be opened by default when the toolbar opened. */
    openWhenAdded?: boolean;
    /**
     * The setting panel of the tool. Returning null means there is no setting panel for the tool. If the returned value is not null, the setting panel will be rendered.
     */
    getSettingPanel: (props: LayoutContextToolProps) => React.ComponentClass<any> | React.FunctionComponent<any>;
}
/**
 * The extension interface for ContextTool extension point.
 * The methods in this class must return the new appConfig
 */
export interface AppConfigOperationsExtension extends BaseExtension {
    /**
     * Process the widget's internal config after it is copied if necessary.
     * Only the original widget's extension should get invoked with the new copiedWidgetId.
     * @param sourceWidgetId Id of the widget that is copied.
     * @param sourceAppConfig The app config the sourceWidgetId comes from.
     * @param destWidgetId Id of the widget that is created in the destAppConfig.
     * @param destAppConfig The app config the destWidgetId is created in.
     * @param widgetMap The map of widget ids after copying. Only provided when the whole page is duplicated.
     * The key is the widget id in the original page, and the value is the widget id in the copied page.
     * @returns The updated appConfig
     */
    afterWidgetCopied?: (sourceWidgetId: string, sourceAppConfig: IMAppConfig, destWidgetId: string, destAppConfig: IMAppConfig, widgetMap?: {
        [key: string]: string;
    }) => IMAppConfig;
    /**
     * Do some cleanup operations before current widget is removed.
     * This method is invoked after the widget has been removed from the layout.
     * @returns The updated appConfig
     */
    widgetWillRemove?: (appConfig: IMAppConfig) => IMAppConfig;
    /**
     * This method is invoked when a widget is going to be removed from the app config.
     * This method is invoked before the widget has been removed from the layout.
     * @param appConfig
     * @param widgetId the widget id that is going to be removed
     * @returns  The updated appConfig
     */
    anyWidgetWillRemove?: (appConfig: IMAppConfig, widgetId: string) => IMAppConfig;
    /**
     * If a widget saves the data source id in its internal config, it should override this method to do the clean ups.
     * Only the widgets that save the data source id in it's useDataSources will get invoked.
     * @param appConfig The app config.
     * @param dataSourceId The data source id that is going to be removed.
     * @returns The updated appConfig
     */
    dataSourceWillRemove?: (appConfig: IMAppConfig, dataSourceId: string) => IMAppConfig;
    /**
     * If a widget saves some config that is related to the data source in its internal config, it should override this method to do the clean ups.
     * In most cases, a widget can just do the clean ups in its setting panel.
     * However, when we remove a used data source from the list, the list internal widgets don't have the chance to do the clean ups.
     * These widgets (Text/Image/Button) should override this method to do the clean ups.
     * Another case is in Express mode, when the map widget de-selects a data source, all related widgets "useDataSources" are cleared.
     *
     * For config in the widget message action and data action, widget can clean up the config in the `useDataSourceWillRemove` method.
     * For the framework actions, the action can provide the `useDataSourceWillRemove` method to clean up the config.
     * @param appConfig The app config.
     * @param dataSourceId The use data source id that is going to be removed.
     * @returns The updated appConfig
     */
    useDataSourceWillRemove?: (appConfig: IMAppConfig, dataSourceId: string) => IMAppConfig;
    /**
     * If a widget saves the utility id in its internal config, it should override this method to do the clean ups.
     * Only the widgets that save the utility id in it's useUtilities will get invoked.
     * @param appConfig The app config.
     * @param utilityId The utility id that is going to be removed.
     * @returns The updated appConfig
     */
    utilityWillRemove?: (appConfig: IMAppConfig, utilityId: string) => IMAppConfig;
    /**
     * If a widget saves some map related data its internal config, it should override this method to do the clean ups.
     * Only the widgets that save the map widget id in it's useMapWidgets will get invoked.
     * @param appConfig The app config.
     * @param mapWidgetId The map widget id that is going to be removed.
     * @returns The updated appConfig
     */
    mapWidgetWillRemove?: (appConfig: IMAppConfig, mapWidgetId: string) => IMAppConfig;
    /**
     * This method is invoked before the app config is changed.
     * @param appConfig
     * @returns
     */
    appConfigWillChange?: (appConfig: IMAppConfig) => IMAppConfig;
}
export interface LayoutTransformerExtension extends BaseExtension {
    layoutType: string;
    transformLayout: LayoutTransformFunc;
    transformLayoutItem: LayoutItemTransformFunc;
}
