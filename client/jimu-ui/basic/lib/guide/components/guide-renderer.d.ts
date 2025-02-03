/** @jsx jsx */
import { jsx, ReactRedux } from 'jimu-core';
interface GuideRendererProps {
    isBusy: boolean;
    guideId: string;
    shouldCheckGuideDisplay: boolean;
}
type Props = GuideRendererProps;
declare function _GuideRenderer(props: Props): "" | jsx.JSX.Element;
export declare const GuideRenderer: ReactRedux.ConnectedComponent<typeof _GuideRenderer, {
    context?: import("react").Context<ReactRedux.ReactReduxContextValue<any, import("redux").UnknownAction>>;
    store?: import("redux").Store;
}>;
export {};
