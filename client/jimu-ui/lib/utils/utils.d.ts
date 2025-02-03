import { type IconResult, type IMState, LinkType, type LinkTo, type IMDialogJson } from 'jimu-core';
import { type LinearUnit, type LinkTarget, type ValidityResult } from '../types';
export declare const setRef: (ref: any, value: any) => void;
/**
 * Safe chained function
 *
 * Will only create a new function if needed,
 * otherwise will pass back existing functions or null.
 *
 * @param {function} functions to chain
 * @returns {function|null}
 */
export declare const createChainedFunction: (...funcs: any[]) => any;
export declare function toLinearUnit(cssValue: string | number): LinearUnit;
export declare function stringOfLinearUnit(cssValue: string | number | LinearUnit): string;
export declare const toIconResult: (icon: any, filename: string, size?: number) => IconResult;
export declare const isOutOrTopTargetLink: (linkType: LinkType, href: string, target?: LinkTarget) => boolean;
export declare const capitalizeFirstLetter: (string: string) => string;
/**
 * Check if the specified widget is selected
 * @param widgetId
 */
export declare const isWidgetSelected: (widgetId: string, state?: IMState) => boolean;
export declare function fetchTextInputValidityResult(value: string, checkValidityFunc: (text: string) => ValidityResult | Promise<ValidityResult>): Promise<ValidityResult>;
export declare const isModifiedEvent: (evt: any) => boolean;
export declare const applyLinkStringAndLocation: (evt: any, target: any, linkHref: any, replace: any, history: any, onClick: any) => void;
export declare const applyLinkResult: (props: any) => void;
interface isHrefCanBeChangedProps {
    linkTo: LinkTo;
    currentDialogJson: IMDialogJson;
    isPageDlg: boolean;
    currentPageId: string;
    currentDialogId: string;
    queryObject: any;
    dispatch: any;
    dialogInfos: any;
    currentPageDlgId: any;
}
export declare const isHrefCanBeChanged: (props: isHrefCanBeChangedProps) => boolean;
export declare const isCurrentDlgCanBeClosed: (props: any) => boolean;
export declare const getLinkHrefByLinkResult: (linkTo: any, queryObject: any, history: any) => any;
export declare const getSetingTextClassesMap: (level: 0 | 1 | 2 | 3) => "title2 text-paper" | "title2 hint-paper" | "title3 text-paper" | "title3 hint-default";
export {};
