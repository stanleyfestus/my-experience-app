import { React, ReactRedux, type ImmutableObject, type ImmutableArray, type DataSourceInfo, type UseDataSource, type WidgetsJson, type SectionsJson, type PlaceholderInfo, type ControllerPanelsJson, type MessagesJson, type LayoutsJson } from 'jimu-core';
import { type Step, type GuideProps, type StepOnChangeCallBackProps, type Steps } from 'jimu-ui/basic/guide';
interface StateToProps {
    layouts?: ImmutableObject<LayoutsJson>;
    widgets?: ImmutableObject<WidgetsJson>;
    sections?: ImmutableObject<SectionsJson>;
    placeholderInfos?: ImmutableObject<{
        [placeholderId: string]: PlaceholderInfo;
    }>;
    controllerPanels?: ImmutableObject<ControllerPanelsJson>;
    messageConfigs?: ImmutableObject<MessagesJson>;
    dataSourcesInfo?: ImmutableObject<{
        [dsId: string]: DataSourceInfo;
    }>;
    widgetsState?: ImmutableObject<{
        [widgetId: string]: any;
    }>;
    widgetDs?: ImmutableArray<UseDataSource>;
}
export declare const GeneralExpressModeGuide: ReactRedux.ConnectedComponent<(props: GuideProps & StateToProps) => React.JSX.Element, {
    disabled?: boolean;
    className?: string;
    params?: any;
    steps: Steps;
    stepIndex?: number;
    run?: boolean;
    isInjected?: boolean;
    onStepChange?: (data: StepOnChangeCallBackProps) => void;
    conditionalStepIndexes?: import("jimu-ui/basic/guide").ConditionalStepIndexes;
    onActionTriggered?: (e: any, step: Step, index: number) => void;
    widgetJson?: import("jimu-core").WidgetJson;
    sectionJson?: import("jimu-core").SectionJson;
    footerNav?: string | JSX.Element;
    context?: React.Context<ReactRedux.ReactReduxContextValue<any, import("redux").UnknownAction>>;
    store?: import("redux").Store;
}>;
export {};
