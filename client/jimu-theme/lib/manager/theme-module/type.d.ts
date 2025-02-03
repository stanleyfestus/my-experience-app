import { type ThemeManifest, type IMThemeVariables, type CustomThemeJson } from 'jimu-core';
import { type ThemeStylesOptions, type OverridesStyleRules, type RawThemeOptions } from '../../system';
export type CompSlotKeys = 'root' | (string & {
    [key: string]: any;
});
export type CompSlotStyle = OverridesStyleRules<{
    [key: string]: any;
}, IMThemeVariables>;
export type CompRootStyle = CompSlotStyle;
export type MixedRawThemeOptions = RawThemeOptions | CustomThemeJson;
/**
   * A set of functions to return the serialized style of emotion.
   */
export interface StyleFunctions {
    [name: string]: CompRootStyle;
}
export type MixedThemeStylesOptions = ThemeStylesOptions<IMThemeVariables> | StyleFunctions;
/**
 * The theme in ExB is defined as a theme module.
 */
export interface ThemeModule {
    uri: string;
    manifest: ThemeManifest;
    /**
     * The components styles defined in the `theme/style.ts` file to override the components styles.
     * Note: styles structures that are still considered classic themes in this version.
     */
    styles?: MixedThemeStylesOptions;
    /**
     * The theme variables defined in the `theme/variables.json` file to override the theme variables.
     * Note: Variable structures that are still considered classic themes in this version.
     */
    variables?: MixedRawThemeOptions;
    /**
     * The final theme variable, which is generated dynamically at run time
     * based on overridden theme variables and custom theme variables.
     */
    theme?: IMThemeVariables;
}
