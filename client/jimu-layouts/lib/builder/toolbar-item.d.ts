/** @jsx jsx */
import { React, ReactRedux, jsx } from 'jimu-core';
import type { ToolItemConfig } from '../types';
import { type ToolbarContextProps } from './toolbar-context';
export declare const DEFAULT_ICON_SIZE = 16;
interface StateToProps {
    toolState: number;
    isNewAdded: boolean;
}
declare class _ToolbarItem extends React.PureComponent<ToolItemConfig & StateToProps & {
    uid: string;
    isInGroup?: boolean;
}> {
    contextProps: ToolbarContextProps;
    reference: HTMLButtonElement;
    version: number;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    select: (e?: React.MouseEvent) => void;
    handleDoubleClick: (e: React.MouseEvent) => void;
    handleMouseEnter: (e: React.MouseEvent) => void;
    handleMouseLeave: (e: React.MouseEvent) => void;
    getValue(target: any, props: any): any;
    getStyle(): import("jimu-core").SerializedStyles;
    separatorStyle(): import("jimu-core").SerializedStyles;
    tooltipStyle(): import("jimu-core").SerializedStyles;
    createButton({ textContent, iconContent, tooltip, isDisabled, noAction, isChecked, rotate, iconSize, autoFlipIcon, ref }: {
        textContent: any;
        iconContent: any;
        tooltip: any;
        isDisabled: any;
        noAction: any;
        isChecked: any;
        rotate: any;
        iconSize: any;
        autoFlipIcon: any;
        ref: any;
    }): jsx.JSX.Element;
    render(): jsx.JSX.Element;
}
export declare const ToolbarItem: ReactRedux.ConnectedComponent<typeof _ToolbarItem, {
    rotate?: number;
    caret?: boolean;
    disabled?: boolean | ((props: import("jimu-core").LayoutContextToolProps) => boolean);
    className?: string;
    title?: string | ((props: import("jimu-core").LayoutContextToolProps & {
        formatMessage: (id: string, values?: any) => string;
    }) => string);
    onClick?: (props: import("jimu-core").LayoutContextToolProps, evt?: React.MouseEvent<any>) => void;
    onMouseEnter?: (props: import("jimu-core").LayoutContextToolProps, evt?: React.MouseEvent<any>) => void;
    onMouseLeave?: (props: import("jimu-core").LayoutContextToolProps, evt?: React.MouseEvent<any>) => void;
    size?: number;
    ref?: React.LegacyRef<_ToolbarItem>;
    key?: React.Key | null | undefined;
    separator?: boolean;
    visible?: boolean | ((props: import("jimu-core").LayoutContextToolProps) => boolean);
    icon?: React.ComponentClass<React.SVGAttributes<SVGElement>> | ((props: import("jimu-core").LayoutContextToolProps) => React.ComponentClass<React.SVGAttributes<SVGElement>>);
    checked?: boolean | ((props: import("jimu-core").LayoutContextToolProps) => boolean);
    label?: string | ((props: import("jimu-core").LayoutContextToolProps & {
        formatMessage: (id: string, values?: any) => string;
    }) => string);
    widgetId?: string;
    uid: string;
    autoFlipIcon?: boolean;
    openWhenAdded?: boolean;
    settingPanel?: React.ComponentClass<import("../types").ToolSettingPanelProps> | React.FunctionComponent<import("../types").ToolSettingPanelProps>;
    extName?: string;
    isInGroup?: boolean;
    context?: React.Context<ReactRedux.ReactReduxContextValue<any, import("redux").UnknownAction>>;
    store?: import("redux").Store;
}>;
export {};
