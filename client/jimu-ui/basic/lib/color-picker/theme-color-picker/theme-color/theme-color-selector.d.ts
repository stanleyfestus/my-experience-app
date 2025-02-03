import { React, type ThemeAllColors } from 'jimu-core';
import { type ReferencePalette } from 'jimu-theme';
interface Props {
    value?: string;
    className?: string;
    'aria-label'?: string;
    style?: React.CSSProperties;
    colors?: ThemeAllColors;
    palette?: ReferencePalette;
    onChange: (value: string) => void;
    newThemeFeatures?: boolean;
}
export declare const ThemeColorSelector: import("@emotion/styled").StyledComponent<Props, {}, {}>;
export {};
