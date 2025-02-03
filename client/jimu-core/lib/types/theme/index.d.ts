import { type ImmutableObject } from 'seamless-immutable';
import { type BorderStyle } from 'jimu-ui';
import { type Theme as JimuTheme } from 'jimu-theme';
import { type Color, type LineHeight, type Size } from './common';
import { type ThemeComponents } from './components';
import { type ThemeArcGIS, type ThemeArcGISComponents } from './arcgis';
export type { Color, Size as ThemeSize, Color as ThemeColor };
export * from './components';
export * from './arcgis';
export type { ThemeBoxStyleKeys, ThemeBoxStyles, ThemeBoxStylesByState } from './common';
export interface ThemeTypographyBase {
    fontFamilyBase?: string;
    fontSizeRoot?: Size;
    fontSizeBase?: Size;
    sizes?: {
        display1?: Size;
        display2?: Size;
        display3?: Size;
        display4?: Size;
        display5?: Size;
        display6?: Size;
        body1?: Size;
        body2?: Size;
        caption1?: Size;
        caption2?: Size;
    };
    weights?: {
        extraLight?: string;
        light?: string;
        medium?: string;
        bold?: string;
        extraBold?: string;
    };
    lineHeights?: {
        sm?: LineHeight;
        medium?: LineHeight;
        lg?: LineHeight;
    };
    colors?: {
        title?: Color;
        normal?: Color;
        caption?: Color;
        disabled?: Color;
    };
}
export interface ThemeFontStyleBase {
    fontFamily?: string;
    fontWeight?: string;
    fontSize?: Size;
    fontStyle?: string;
    lineHeight?: LineHeight;
    color?: Color;
}
export declare enum ThemeFontVariantKeys {
    Display1 = "display1",
    Display2 = "display2",
    Display3 = "display3",
    Display4 = "display4",
    Display5 = "display5",
    Display6 = "display6",
    Body1 = "body1",
    Body2 = "body2",
    Caption1 = "caption1",
    Caption2 = "caption2"
}
export interface ThemeFontVariant extends ThemeFontStyleBase {
}
export type ThemeFontVariants = {
    [key in ThemeFontVariantKeys]?: ThemeFontVariant;
};
export interface ThemeTypography extends ThemeTypographyBase {
    variants?: ThemeFontVariants;
}
export declare enum ThemeCommonColorKeys {
    White = "white",
    Black = "black",
    Transparent = "transparent"
}
export declare enum ThemeThemeAlertColorKeys {
    Success = "success",
    Info = "info",
    Warning = "warning",
    Danger = "danger"
}
export declare enum ThemeThemeMainColorKeys {
    Primary = "primary",
    Secondary = "secondary",
    Light = "light",
    Dark = "dark"
}
export declare enum ThemeThemeColorKeys {
    Primary = "primary",
    Secondary = "secondary",
    Light = "light",
    Dark = "dark",
    Success = "success",
    Info = "info",
    Warning = "warning",
    Danger = "danger"
}
export type ThemeColorationType = 'minimal' | 'default';
export interface ThemeColorationVariant {
    header: {
        color?: Color;
        bg?: Color;
    };
    body?: {
        color?: Color;
        bg?: Color;
    };
    footer?: {
        color?: Color;
        bg?: Color;
    };
}
export type ThemeColorationVariants = {
    [index in ThemeColorationType]?: ThemeColorationVariant;
};
export type ThemeCommonColors = {
    [index in ThemeCommonColorKeys]?: Color;
};
export type ThemeThemeColors = {
    [index in ThemeThemeColorKeys]?: Color;
};
export interface ThemeColorPaletteItem {
    100?: Color;
    200?: Color;
    300?: Color;
    400?: Color;
    500?: Color;
    600?: Color;
    700?: Color;
    800?: Color;
    900?: Color;
}
export type PaletteLightnessRange = [number, number];
export type ThemeColorPalette = {
    [index in ThemeThemeColorKeys]?: ThemeColorPaletteItem;
};
export interface ThemeAllColors extends ThemeCommonColors, ThemeThemeColors {
    palette?: ThemeColorPalette;
    orgSharedColors?: SharedThemeElementsVariables;
    /** @deprecated use theme.colors.palette instead */
    getPalette?: () => IMThemeColorPalette;
    /** @deprecated use theme.colors.orgSharedColors instead */
    getOrgShareColors?: () => IMSharedThemeElementsVariables;
}
export interface ThemeBody extends ThemeFontStyleBase {
    color?: Color;
    bg?: Color;
}
export interface ThemeHeader {
    color?: Color;
    bg?: Color;
}
export interface ThemeFooter {
    color?: Color;
    bg?: Color;
}
export interface ThemeLink {
    color?: Color;
    decoration?: string;
    hover?: {
        color?: Color;
        decoration?: string;
    };
}
export interface ThemeSurface {
    bg?: Color;
    border?: BorderStyle;
    shadow?: string;
}
export interface ThemeSurfaces {
    1?: ThemeSurface;
    2?: ThemeSurface;
}
export interface ThemeSizes {
    0?: Size;
    1?: Size;
    2?: Size;
    3?: Size;
    4?: Size;
    5?: Size;
    6?: Size;
}
export interface ThemeBorderRadiuses {
    none?: Size;
    sm?: Size;
    default?: Size;
    lg?: Size;
}
export interface ThemeBoxShadows {
    none?: string;
    default?: string;
    sm?: string;
    lg?: string;
}
export interface ThemeFocusedStyles {
    width?: string | number;
    color?: Color;
    offset?: string | number;
}
export interface SharedThemeElementsVariables {
    header?: {
        bg?: Color;
        color?: Color;
    };
    body?: {
        bg?: Color;
        color?: Color;
        link?: Color;
    };
    button?: {
        bg?: Color;
        color?: Color;
    };
}
export interface SharedThemeVariables extends SharedThemeElementsVariables {
    logo?: {
        small?: string;
        link?: string;
    };
    fonts?: {
        base?: {
            url?: string;
            family?: string;
        };
        heading?: {
            url?: string;
            family?: string;
        };
    };
}
export type IMThemeTypography = ImmutableObject<ThemeTypography>;
export type IMThemeThemeColors = ImmutableObject<ThemeThemeColors>;
export type IMThemeColorPalette = ImmutableObject<ThemeColorPalette>;
export type IMThemeAllColors = ImmutableObject<ThemeAllColors>;
export type IMThemeFontStyleBase = ImmutableObject<ThemeFontStyleBase>;
export type IMThemeFontVariant = ImmutableObject<ThemeFontVariant>;
export type IMThemeFontVariants = ImmutableObject<ThemeFontVariants>;
export type IMThemeSizes = ImmutableObject<ThemeSizes>;
export type IMThemeBorder = ImmutableObject<BorderStyle>;
export type IMThemeBorderRadiuses = ImmutableObject<ThemeBorderRadiuses>;
export type IMThemeBoxShadows = ImmutableObject<ThemeBoxShadows>;
export type IMThemeFocusedStyles = ImmutableObject<ThemeFocusedStyles>;
export type IMThemeHeader = ImmutableObject<ThemeHeader>;
export type IMThemeFooter = ImmutableObject<ThemeFooter>;
export type IMThemeBody = ImmutableObject<ThemeBody>;
export type IMThemeLink = ImmutableObject<ThemeLink>;
export type IMThemeSurfaces = ImmutableObject<ThemeSurfaces>;
export type IMThemeComponents = ImmutableObject<ThemeComponents>;
export type IMThemeArcGIS = ImmutableObject<ThemeArcGIS>;
export type IMThemeArcGISComponents = ImmutableObject<ThemeArcGISComponents>;
export type IMSharedThemeElementsVariables = ImmutableObject<SharedThemeElementsVariables>;
export type IMSharedThemeVariables = ImmutableObject<SharedThemeVariables>;
/**
 * @deprecated Use `IMThemeVariables` instead.
 */
export interface ThemeVariables {
    darkTheme?: boolean;
    /**
     * @deprecated Please customize their styles directly in header, body, and footer.
     */
    coloration?: ThemeColorationType;
    /**
     * @deprecated Please customize their styles directly in header, body, and footer.
     */
    colorationVariants?: ThemeColorationVariants;
    typography?: ThemeTypography;
    colors?: ThemeAllColors;
    sizes?: ThemeSizes;
    borderRadiuses?: ThemeBorderRadiuses;
    boxShadows?: ThemeBoxShadows;
    focusedStyles?: ThemeFocusedStyles;
    surfaces?: ThemeSurfaces;
    header?: ThemeHeader;
    footer?: ThemeFooter;
    body?: ThemeBody;
    link?: ThemeLink;
    border?: BorderStyle;
    components?: ThemeComponents;
    /**
     * @deprecated The style override interface related to arcgis components will be rearranged. Please do not use it in widgets.
     */
    arcgis?: ThemeArcGIS;
}
export interface ThemeVariable extends ThemeVariables, JimuTheme {
    /**
     * The theme uri is used to identify the source (theme folder) of the theme object.
     * Note: It should not be empty in the builder or app runtime.
     */
    uri?: string;
}
export type IMThemeVariables = ImmutableObject<ThemeVariable>;
export interface ThemeInfo {
    name?: string;
    label?: string;
    uri?: string;
    colors?: IMThemeThemeColors;
    font?: IMThemeFontStyleBase;
    i18nLabel?: {
        [locale: string]: string;
    };
    isNewTheme?: boolean;
}
export type IMThemeInfo = ImmutableObject<ThemeInfo>;
