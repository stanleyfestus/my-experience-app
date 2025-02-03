import { React, type ThemeVariable } from 'jimu-core';
export declare const getClassicVarsMapping: (uri: string, hasSharedTheme: boolean) => {
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
interface CssVarsAdapterProps {
    uri: string;
    theme: ThemeVariable;
}
export declare const CssVarsAdapter: (props: CssVarsAdapterProps) => React.JSX.Element;
export {};
