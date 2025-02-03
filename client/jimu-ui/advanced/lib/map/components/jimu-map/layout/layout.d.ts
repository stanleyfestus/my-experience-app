/** @jsx jsx */
import { React, jsx, type AppMode, type IntlShape } from 'jimu-core';
import { type ToolConfig } from '../config';
import { type LayoutJson, type HiddenElementNames } from './config';
import { type JimuMapView } from 'jimu-arcgis';
interface LayoutProps {
    layoutConfig: LayoutJson;
    toolConfig: ToolConfig;
    jimuMapView: JimuMapView;
    isMobile: boolean;
    appMode: AppMode;
    widgetHeight?: number;
    intl?: IntlShape;
    children?: React.ReactNode;
}
interface LayoutState {
    activeToolName: string;
    toolsContentInMobileExpandPanel?: JSX.Element;
    hiddenElementNames: HiddenElementNames;
}
export default class Layout extends React.PureComponent<LayoutProps, LayoutState> {
    contentRef: HTMLElement;
    constructor(props: any);
    getStyle(): import("jimu-core").SerializedStyles;
    getMaxHeightForPcExpand: (widgetHeight: number) => number;
    handleActiveNameChange: (activeToolName: string) => void;
    handSetHiddenElementNames: (elementNames: HiddenElementNames) => void;
    getLayoutContent: (layoutJson: LayoutJson) => jsx.JSX.Element;
    componentDidMount(): void;
    render(): jsx.JSX.Element;
}
export {};
