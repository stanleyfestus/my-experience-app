import { React, ReactRedux } from 'jimu-core';
import { type StepOnChangeCallBackProps, type GuideProps, type Steps } from 'jimu-ui/basic/guide';
export declare const _WelcomeIntroductionGuide: (props: GuideProps) => React.JSX.Element;
export declare const ExpressWelcomeIntroductionGuide: ReactRedux.ConnectedComponent<(props: GuideProps) => React.JSX.Element, {
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
