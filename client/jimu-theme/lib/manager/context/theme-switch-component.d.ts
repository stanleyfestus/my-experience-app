import { React } from 'jimu-core';
/**
 * The `ThemeSwitchComponent` props.
 */
export interface ThemeSwitchComponentProps {
    /**
     * Whether to switch the theme of the sub-component to `theme2`.
     */
    useTheme2?: boolean;
    /**
     * A single child content element.
     */
    children: React.ReactElement | React.ReactElement[];
    /**
     * Whether to insert the class name corresponding to the global style(`ThemeGlobalStyleClassName` and `Theme2GlobalStyleClassName`) into the child content.
     */
    useGlobalStyles?: boolean;
}
/**
 * The `ThemeSwitchComponent` allows users to to create a context area that can switch between `theme` and `theme2`.
 * Note: `ThemeSwitchComponent` can only be used in the app-in-builder environment.
 *
 * ```ts
 * import { ThemeSwitchComponent } from 'jimu-theme'
 * ```
 */
export declare const ThemeSwitchComponent: (props: ThemeSwitchComponentProps) => React.JSX.Element;
