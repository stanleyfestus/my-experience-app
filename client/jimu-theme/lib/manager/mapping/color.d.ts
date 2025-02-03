import { type ThemeThemeColorKeys, type ThemeVariables } from 'jimu-core';
import { type ActionColorOption, type DividerColor, type ModeBasedColorSchemeOptions, type SurfaceColor } from '../../system';
interface ShadeOption {
    light: number;
    main: number;
    dark: number;
}
export type ShadeOptions = {
    [key in ThemeThemeColorKeys]: ShadeOption;
};
export declare const getMappedColors: (inputTheme: ThemeVariables, shadeOptions: ShadeOptions) => {};
export declare const getMappedDivider: (theme: ThemeVariables) => Partial<DividerColor>;
export declare const getMappedSurface: (theme: ThemeVariables) => Partial<SurfaceColor>;
export declare const getMappedAction: (theme: ThemeVariables) => ActionColorOption;
export declare const getMappedColorOptions: (inputTheme: ThemeVariables, shadeOptions: ShadeOptions) => ModeBasedColorSchemeOptions;
export {};
