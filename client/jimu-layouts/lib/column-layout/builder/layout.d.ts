/** @jsx jsx */
import { React, ReactRedux, type LayoutItemJson, type LayoutItemConstructorProps, type IMThemeVariables } from 'jimu-core';
import type { DropHandlers } from '../../builder/types';
import { type LayoutProps, type StateToLayoutProps } from 'jimu-layouts/layout-runtime';
import { CanvasPane } from '../../builder/interactive/canvas-pane';
interface State {
    isDragover: boolean;
}
declare class Layout extends React.PureComponent<LayoutProps & StateToLayoutProps, State> implements DropHandlers {
    ref: HTMLElement;
    canvasRef: HTMLCanvasElement;
    canvasPane: CanvasPane;
    boundingRect: DOMRect;
    isDragging: boolean;
    childRects: Array<DOMRect & {
        id: string;
    }>;
    domRect: DOMRect;
    resizingRect: DOMRect;
    referenceId: string;
    theme: IMThemeVariables;
    builderTheme: IMThemeVariables;
    state: State;
    componentDidMount(): void;
    componentDidUpdate(): void;
    handleItemResizeStart: (id: string) => void;
    handleItemResizing: () => void;
    handleItemResizeEnd: (id: string, x: number, y: number, dw: number, dh: number, layoutItem: LayoutItemJson) => void;
    handleDragOver: (draggingItem: LayoutItemConstructorProps, draggingElement: HTMLElement, containerRect: Partial<DOMRect>, itemRect: Partial<DOMRect & {
        handlerRect?: DOMRect;
    }>) => void;
    handleToggleDragoverEffect: (value: boolean) => void;
    handleDrop: (draggingItem: LayoutItemConstructorProps, containerRect: DOMRect, itemRect: DOMRect & {
        handlerRect?: DOMRect;
    }) => void;
    collectBounds(id: string): Array<DOMRect & {
        id: string;
    }>;
    createItem(itemId: string, index: number, layoutSetting: any): JSX.Element;
    isEmpty(): boolean;
    render(): JSX.Element;
}
declare const _default: ReactRedux.ConnectedComponent<typeof Layout, {
    className?: string;
    style?: any;
    children?: React.ReactNode;
    ref?: React.LegacyRef<Layout>;
    key?: React.Key | null | undefined;
    visible?: boolean;
    layouts: import("seamless-immutable").ImmutableObjectMixin<import("jimu-core").SizeModeLayoutJson> & {
        readonly [x: string]: string;
    };
    isInSection?: boolean;
    isInWidget?: boolean;
    isRepeat?: boolean;
    isPageItem?: boolean;
    itemDraggable?: boolean;
    itemResizable?: boolean;
    itemSelectable?: boolean;
    droppable?: boolean;
    showDefaultTools?: boolean;
    isItemAccepted?: (item: LayoutItemConstructorProps, isReplacePlaceholder: boolean) => boolean;
    onItemClick?: (e: any, widgetId: string) => void;
    ignoreMinHeight?: boolean;
    context?: React.Context<ReactRedux.ReactReduxContextValue<any, import("redux").UnknownAction>>;
    store?: import("redux").Store;
}>;
export default _default;
