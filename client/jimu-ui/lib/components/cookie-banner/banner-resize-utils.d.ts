/** @jsx jsx */
import { type BrowserSizeMode, type IMFixedPositionSizeJson } from 'jimu-core';
import { type AppConfigAction } from 'jimu-for-builder';
export declare const RESIZE_HANDLER_SIZE = "4px";
export declare function bindResizeHandler(interact: any, resizeRef: HTMLDivElement, fixedPositionSizeJson: IMFixedPositionSizeJson, browserSizeMode: BrowserSizeMode, getAppConfigAction: () => AppConfigAction): Interact.Interactable;
