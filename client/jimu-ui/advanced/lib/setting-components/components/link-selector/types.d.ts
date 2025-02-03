import { type Expression, type ImmutableObject, type LinkType } from 'jimu-core';
import { type LinkTarget } from 'jimu-ui';
export declare enum OpenTypes {
    CurrentWindow = "_self",
    TopWindow = "_top",
    NewWindow = "_blank"
}
export interface LinkParam {
    linkType?: LinkType;
    openType?: LinkTarget;
    value?: string;
    expression?: Expression;
}
export type IMLinkParam = ImmutableObject<LinkParam>;
