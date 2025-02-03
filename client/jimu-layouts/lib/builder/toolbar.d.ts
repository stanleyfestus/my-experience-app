/** @jsx jsx */
import { React, ReactRedux, type IMThemeVariables, jsx, type IMLayoutItemJson, type LayoutItemJson } from 'jimu-core';
import type { ToolItemConfig } from '../types';
export interface ToolbarProps {
    tools: Array<ToolItemConfig | ToolItemConfig[]>;
    layoutId: string;
    layoutItem: IMLayoutItemJson | LayoutItemJson;
    parentRef: HTMLElement;
    theme: IMThemeVariables;
    formatMessage: (id: string, values?: any) => string;
}
interface StateToProps {
    isLockLayout: boolean;
    numOfViewis?: number;
    activeViewId?: string;
}
interface State {
    activeItem?: string;
    toggleOn?: boolean;
}
declare class _Toolbar extends React.PureComponent<ToolbarProps & StateToProps, State> {
    state: State;
    onItemClick: (value: string) => void;
    onItemUnSelected: (value: string) => void;
    getStyle(): import("jimu-core").SerializedStyles;
    reOrganizeTools(): (ToolItemConfig | ToolItemConfig[])[];
    render(): jsx.JSX.Element;
}
export declare const Toolbar: ReactRedux.ConnectedComponent<typeof _Toolbar, {
    ref?: React.LegacyRef<_Toolbar>;
    key?: React.Key | null | undefined;
    theme: import("seamless-immutable").ImmutableObjectMixin<import("jimu-core").ThemeVariable> & {
        readonly uri?: string;
        readonly darkTheme?: boolean;
        readonly coloration?: import("jimu-core").ThemeColorationType;
        readonly colorationVariants?: import("seamless-immutable").ImmutableObject<import("jimu-core").ThemeColorationVariants>;
        readonly typography?: import("seamless-immutable").ImmutableObject<import("jimu-core").ThemeTypography>;
        readonly colors?: import("seamless-immutable").ImmutableObject<import("jimu-core").ThemeAllColors>;
        readonly sizes?: import("seamless-immutable").ImmutableObject<import("jimu-core").ThemeSizes>;
        readonly borderRadiuses?: import("seamless-immutable").ImmutableObject<import("jimu-core").ThemeBorderRadiuses>;
        readonly boxShadows?: import("seamless-immutable").ImmutableObject<import("jimu-core").ThemeBoxShadows>;
        readonly focusedStyles?: import("seamless-immutable").ImmutableObject<import("jimu-core").ThemeFocusedStyles>;
        readonly surfaces?: import("seamless-immutable").ImmutableObject<import("jimu-core").ThemeSurfaces>;
        readonly header?: import("seamless-immutable").ImmutableObject<import("jimu-core").ThemeHeader>;
        readonly footer?: import("seamless-immutable").ImmutableObject<import("jimu-core").ThemeFooter>;
        readonly body?: import("seamless-immutable").ImmutableObject<import("jimu-core").ThemeBody>;
        readonly link?: import("seamless-immutable").ImmutableObject<import("jimu-core").ThemeLink>;
        readonly border?: import("seamless-immutable").ImmutableObject<import("jimu-ui").BorderStyle>;
        readonly components?: import("seamless-immutable").ImmutableObject<import("jimu-core").ThemeComponents>;
        readonly arcgis?: import("seamless-immutable").ImmutableObject<import("jimu-core").ThemeArcGIS>;
        readonly src?: import("seamless-immutable").ImmutableObject<import("jimu-theme").ThemeSourceOptions>;
        readonly ref: import("seamless-immutable").ImmutableObject<import("jimu-theme").ThemeReference>;
        readonly sys: import("seamless-immutable").ImmutableObject<import("jimu-theme/lib/system/create-theme").ThemeSystem>;
        readonly mixin?: import("seamless-immutable").ImmutableObject<import("jimu-theme/lib/system/mixin").ThemeMixin>;
        readonly comp?: import("seamless-immutable").ImmutableObject<import("jimu-theme").ThemeComponents<import("jimu-theme").Theme>>;
    };
    layoutId: string;
    tools: Array<ToolItemConfig | ToolItemConfig[]>;
    formatMessage: (id: string, values?: any) => string;
    layoutItem: IMLayoutItemJson | LayoutItemJson;
    parentRef: HTMLElement;
    context?: React.Context<ReactRedux.ReactReduxContextValue<any, import("redux").UnknownAction>>;
    store?: import("redux").Store;
}>;
export {};
