/** @jsx jsx */
/** @jsxFrag */
import { jsx, type IMThemeVariables, type IMFixedPositionSizeJson } from 'jimu-core';
export interface CookieBannerProps {
    template?: string;
}
export declare function getResizeStyle(): import("jimu-core").SerializedStyles;
export declare const DEFAULT_FIXED_POSITION_SIZE_JSON: IMFixedPositionSizeJson;
interface Props {
    theme: IMThemeVariables;
}
export declare const CookieBanner: (props: Props) => jsx.JSX.Element;
export {};
