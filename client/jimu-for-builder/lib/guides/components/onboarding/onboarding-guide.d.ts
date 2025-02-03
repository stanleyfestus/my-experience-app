/** @jsx jsx */
import { React, ReactRedux, jsx, PageMode, type ImmutableObject, type UrlParameters } from 'jimu-core';
import { type Step, type ConditionalStepIndexes, type Steps, type GuideProps } from 'jimu-ui/basic/guide';
interface StateToProps {
    queryObject: ImmutableObject<UrlParameters>;
    pageMode: PageMode;
}
interface State {
    stepIndex: number;
    steps: Steps;
    conditionalStepIndexes: ConditionalStepIndexes;
    run: boolean;
}
export declare class _OnboardingGuide extends React.PureComponent<GuideProps & StateToProps, State> {
    private readonly currentStep;
    constructor(props: any);
    componentDidUpdate(prevProps: GuideProps & StateToProps): void;
    private readonly handleChange;
    private readonly handleClick;
    render(): jsx.JSX.Element;
}
export declare const OnboardingGuide: ReactRedux.ConnectedComponent<typeof _OnboardingGuide, {
    disabled?: boolean;
    className?: string;
    ref?: React.LegacyRef<_OnboardingGuide>;
    key?: React.Key | null | undefined;
    params?: any;
    steps: Steps;
    stepIndex?: number;
    run?: boolean;
    isInjected?: boolean;
    onStepChange?: (data: import("jimu-ui/basic/guide").StepOnChangeCallBackProps) => void;
    conditionalStepIndexes?: ConditionalStepIndexes;
    onActionTriggered?: (e: any, step: Step, index: number) => void;
    widgetJson?: import("jimu-core").WidgetJson;
    sectionJson?: import("jimu-core").SectionJson;
    footerNav?: string | JSX.Element;
    context?: React.Context<ReactRedux.ReactReduxContextValue<any, import("redux").UnknownAction>>;
    store?: import("redux").Store;
}>;
export {};
