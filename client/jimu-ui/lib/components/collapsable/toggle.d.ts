import { React } from 'jimu-core';
import { type BaseCollapsablePanelProps } from './base';
import { type CollapsableToggleHeaderProps } from './header';
/**
 * The `CollapsableToggle` component props.
 */
export interface CollapsableToggleProps extends Omit<BaseCollapsablePanelProps, 'header'>, CollapsableToggleHeaderProps {
    /**
     * The default open state of the component.
     */
    defaultIsOpen?: boolean;
}
/**
 * The `CollapsableToggle` component allows users to show the collapsible panel.
 *
 * ```ts
 * import { CollapsableToggle } from 'jimu-ui'
 * ```
 */
export declare const CollapsableToggle: (props: CollapsableToggleProps) => React.JSX.Element;
