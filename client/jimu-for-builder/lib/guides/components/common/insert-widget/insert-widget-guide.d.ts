import { React, ReactRedux, type IMAppConfig, type IMSelection } from 'jimu-core';
import { type StepOnChangeCallBackProps, type GuideProps } from 'jimu-ui/basic/guide';
interface StateToProps {
    appConfig: IMAppConfig;
    widgetSelection: IMSelection;
}
export declare const _InsertWidgetGuide: (props: GuideProps & StateToProps) => React.JSX.Element;
export declare const InsertWidgetGuide: ReactRedux.ConnectedComponent<(props: GuideProps & StateToProps) => React.JSX.Element, {
    disabled?: boolean;
    className?: string;
    params?: any;
    steps: import("jimu-ui/basic/guide").Steps;
    stepIndex?: number;
    run?: boolean;
    isInjected?: boolean;
    onStepChange?: (data: StepOnChangeCallBackProps) => void;
    conditionalStepIndexes?: import("jimu-ui/basic/guide").ConditionalStepIndexes;
    onActionTriggered?: (e: any, step: import("jimu-ui/basic/guide").Step, index: number) => void;
    widgetJson?: import("jimu-core").WidgetJson;
    sectionJson?: import("jimu-core").SectionJson;
    footerNav?: string | JSX.Element;
    context?: React.Context<ReactRedux.ReactReduxContextValue<any, import("redux").UnknownAction>>;
    store?: import("redux").Store;
}>;
export {};
