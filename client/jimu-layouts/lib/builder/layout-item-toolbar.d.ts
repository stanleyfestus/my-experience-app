/** @jsx jsx */
import { jsx, type IMLayoutItemJson, type IMThemeVariables } from 'jimu-core';
import { type Placement, type Modifiers } from 'jimu-ui';
import { type ToolbarConfig } from 'jimu-layouts/layout-runtime';
export interface LayoutItemToolbarProps {
    layoutId: string;
    layoutItem: IMLayoutItemJson;
    placement?: Placement;
    refElement: HTMLElement;
    modifiers: Modifiers;
    builderTheme: IMThemeVariables;
    formatMessage: (string: any, values?: any) => string;
    toolItems?: ToolbarConfig;
    showDefaultTools?: boolean;
}
export declare function LayoutItemToolbar(props: LayoutItemToolbarProps): jsx.JSX.Element;
