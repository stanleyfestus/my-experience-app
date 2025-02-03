import { React } from 'jimu-core';
/**
 * The SettingSection component props.
 */
export interface SettingSectionProps {
    /**
     * To provide a role for section
     */
    role?: string;
    /**
     * To provide a label for interactive components for accessibility purposes.
     * By default, the accessible name is computed from any text content inside the element.
     * If lacking, provide an aria-label.
     */
    'aria-label'?: string;
    /**
     * The aria-describedby attribute lists the ids of the elements that describe the object. It is used to establish a relationship between widgets or groups and the text that describes them.
     * @ignore
     */
    'aria-describedby'?: string;
    /**
     * Defines the title text for the setting section.
     */
    title?: string | JSX.Element;
    /**
     * Defines the class names added to the element.
     */
    className?: string;
    /**
     * Defines the style added to the element.
     */
    style?: any;
    /**
     * The children of this component.
     */
    children?: React.ReactNode;
}
/**
 * The unstyled version of the SettingSection component.
 */
export declare class _SettingSection extends React.PureComponent<SettingSectionProps> {
    render(): React.JSX.Element;
}
/**
 * The `SettingSection` component allows users to display setting content as a section.
 * Use this component to wrap `SettingRow` component(s).
 *
 * ```ts
 * import { SettingSection } from 'jimu-ui/advanced/setting-components'
 * ```
 */
export declare const SettingSection: import("@emotion/styled").StyledComponent<SettingSectionProps, {}, {}>;
