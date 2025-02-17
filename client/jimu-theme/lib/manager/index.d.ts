import { React } from 'jimu-core';
import { useThemeSwitching } from './use-theme-switching';
import * as _mapping from './mapping';
declare const mapping: {
    getClassicVarsMapping: (uri: string, hasSharedTheme: boolean) => {
        '--org-header-bg'?: string;
        '--org-header-color'?: string;
        '--org-body-bg'?: string;
        '--org-body-color'?: string;
        '--org-body-link'?: string;
        '--org-button-bg'?: string;
        '--org-button-color'?: string;
        '--transparent': string;
        '--white': string;
        '--black': string;
    };
    createShadeOptions: (uri: string, isDark?: boolean) => import("jimu-core").ImmutableObject<_mapping.color.ShadeOptions>;
    createMappedThemeOption: (classicTheme: import("jimu-core").ThemeVariables, compStyles: import("./theme-module").StyleFunctions, shadeOptions: _mapping.color.ShadeOptions, sharedThemeButtonVars?: import("jimu-core").SharedThemeElementsVariables["button"]) => import("..").ThemeOptions;
    whetherIsNewTheme: (module: import("./theme-module").ThemeModule) => boolean;
    createMixedTheme: (module?: import("./theme-module").ThemeModule, inputThemeOptions?: import("jimu-core").ImmutableObject<import("./theme-module").MixedRawThemeOptions>, mixins?: import("..").ThemeMixinsOptions) => import("jimu-core").IMThemeVariables;
    palette: typeof _mapping.palette;
    typeface: typeof _mapping.typeface;
    color: typeof _mapping.color;
    typography: typeof _mapping.typography;
    shadow: typeof _mapping.shadow;
    shape: typeof _mapping.shape;
    spacing: typeof _mapping.spacing;
    components: typeof _mapping.components;
    utils: typeof _mapping.utils;
    TypographyVariantsMap: {
        display1: string;
        display2: string;
        display3: string;
        display4: string;
        display5: string;
        display6: string;
        body1: string;
        body2: string;
        caption1: string;
        caption2: string;
    };
};
export declare const ThemeManager: ({ children }: {
    children: any;
}) => React.JSX.Element;
export { default as styled } from './styled';
export * from './global';
export * from './context';
export * from './utils';
export * from './theme-module';
export * from './with-theme';
export { mapping, useThemeSwitching };
export { type ShadeOptions, createMixedTheme } from './mapping';
