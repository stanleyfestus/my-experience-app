import { type ImmutableObject } from 'seamless-immutable';
import { type IMLayoutItemJson, type IMLayoutJson, type IMAppConfig } from './app-config';
import { type BrowserSizeMode } from './common';
export declare enum LayoutItemType {
    Unkown = "UNKNOWN",
    Widget = "WIDGET",
    Section = "SECTION",
    ScreenGroup = "SCREEN_GROUP"
}
export declare enum LayoutType {
    FixedLayout = "FIXED",
    FlowLayout = "FLOW",
    GridLayout = "GRID",
    ColumnLayout = "COLUMN",
    RowLayout = "ROW",
    AccordionLayout = "ACCORDION"
}
export interface LayoutInfo {
    layoutId: string;
    layoutItemId?: string;
}
export interface LayoutContextToolProps {
    layoutId: string;
    layoutItem: IMLayoutItemJson;
    clientRect: DOMRect;
}
export type Selection = LayoutInfo & {
    autoScroll?: boolean;
    additionalInfo?: any;
};
export type ClipboardItem = LayoutInfo & {
    width: number;
    height: number;
};
export type IMRuntimeLayoutInfo = ImmutableObject<{
    selection?: LayoutInfo;
}>;
export type LayoutTransformFunc = (layout: IMLayoutJson, fromSizeMode: BrowserSizeMode, toSizeMode: BrowserSizeMode, appConfig?: IMAppConfig) => IMLayoutJson;
export type LayoutItemTransformFunc = (item: IMLayoutItemJson, index: number, fromLayoutId: string, toLayoutId: string, fromSizeMode: BrowserSizeMode, toSizeMode: BrowserSizeMode) => {
    item: IMLayoutItemJson;
    index: number;
};
