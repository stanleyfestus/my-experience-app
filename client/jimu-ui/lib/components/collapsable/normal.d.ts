import { React } from 'jimu-core';
import { type CollapsableHeaderProps } from './header';
import { type BaseCollapsablePanelProps } from './base';
/**
 * The `CollapsablePanel` component props.
 */
export interface CollapsablePanelProps extends Omit<BaseCollapsablePanelProps, 'header'>, CollapsableHeaderProps {
    /**
     * The default open state of the component.
     */
    defaultIsOpen?: boolean;
}
/**
 * The `CollapsablePanel` component allows users to show the collapsible panel.
 *
 * ```ts
 * import { CollapsablePanel } from 'jimu-ui'
 * ```
 */
export declare const CollapsablePanel: (props: CollapsablePanelProps) => React.JSX.Element;
