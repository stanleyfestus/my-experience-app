import { type ImmutableObject, React, ReactRedux, type WidgetsJson } from 'jimu-core';
import { type StepOnChangeCallBackProps, type GuideProps, type Steps } from 'jimu-ui/basic/guide';
interface StateToProps {
    widgets: ImmutableObject<WidgetsJson>;
}
export declare const _MapWidgetGuide: (props: GuideProps & StateToProps) => React.JSX.Element;
export declare const ExpressMapWidgetGuide: ReactRedux.ConnectedComponent<(props: GuideProps & StateToProps) => React.JSX.Element, {
    disabled?: boolean;
    className?: string;
    params?: any;
    steps: Steps;
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
