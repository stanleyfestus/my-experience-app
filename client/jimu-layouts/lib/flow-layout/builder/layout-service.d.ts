import { type IMAppConfig, type BrowserSizeMode, type LayoutInfo, type LayoutItemConstructorProps } from 'jimu-core';
import { BaseLayoutService, type TocNode, type DuplicateContext } from 'jimu-for-builder';
import { type ToolItemConfig } from 'jimu-layouts/layout-runtime';
export declare class FlowLayoutService extends BaseLayoutService {
    private removeItemFromOrder;
    afterItemMoved(appConfig: IMAppConfig, layoutInfo: LayoutInfo): IMAppConfig;
    afterItemRemoved(appConfig: IMAppConfig, layoutInfo: LayoutInfo): IMAppConfig;
    duplicateItemInSameLayout(appConfig: IMAppConfig, layoutInfo: LayoutInfo, sizeMode: BrowserSizeMode, context: DuplicateContext): [appConfig: IMAppConfig, layoutItemId: string];
    getTocStructure(appConfig: IMAppConfig, layoutId: string): TocNode[];
    processAfterItemAdded(appConfig: IMAppConfig, draggingItem: LayoutItemConstructorProps, layoutInfo: LayoutInfo, currentSizeMode: BrowserSizeMode, containerRect: DOMRectReadOnly, itemRect: DOMRectReadOnly, insertIndex: number): IMAppConfig;
    getToolItems(appConfig: IMAppConfig, layoutInfo: LayoutInfo, type: string): Array<ToolItemConfig | ToolItemConfig[]>;
    private offsetDuplicateItem;
}
