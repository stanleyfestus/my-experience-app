/** @jsx jsx */
import { React, ReactRedux, type IMLayoutItemJson, jsx, type SerializedStyles } from 'jimu-core';
import { type LayoutItemProps, type FlowLayoutItemSetting } from '../../types';
import { type StateToFlowItemProps } from '../layout-utils';
interface OwnProps {
    index: number;
    layoutItem: IMLayoutItemJson;
    gutter: number;
}
declare class FlowLayoutItem extends React.PureComponent<LayoutItemProps & StateToFlowItemProps & OwnProps> {
    autoHeight: boolean;
    componentDidMount(): void;
    calHeight(itemSetting: FlowLayoutItemSetting): string;
    getStyle(itemSetting: FlowLayoutItemSetting): [SerializedStyles, string];
    render(): jsx.JSX.Element;
}
declare const _default: ReactRedux.ConnectedComponent<typeof FlowLayoutItem, {
    aspectRatio?: number;
    className?: string;
    draggable?: boolean;
    style?: React.CSSProperties;
    children?: any;
    onClick?: (e: any, layoutInfo: import("jimu-core").LayoutInfo) => void;
    onDoubleClick?: (e: any, layoutInfo: import("jimu-core").LayoutInfo) => void;
    ref?: React.LegacyRef<FlowLayoutItem>;
    key?: React.Key | null | undefined;
    index: number;
    layoutId: string;
    layoutItemId: string;
    autoWidth?: boolean;
    resizable?: boolean;
    gutter: number;
    autoHeight?: boolean;
    isInSection?: boolean;
    showDefaultTools?: boolean;
    selectable?: boolean;
    forbidContextMenu?: boolean;
    forbidToolbar?: boolean;
    trailOrder?: number;
    forceAspectRatio?: boolean;
    resizeObserver?: ResizeObserver;
    layoutItem: import("seamless-immutable").ImmutableObjectMixin<import("jimu-core").LayoutItemJson> & {
        readonly id?: string;
        readonly bbox?: import("seamless-immutable").ImmutableObject<import("jimu-core").BoundingBox>;
        readonly type?: import("jimu-core").LayoutItemType;
        readonly setting?: any;
        readonly widgetId?: string;
        readonly sectionId?: string;
        readonly screenGroupId?: string;
        readonly isPlaceholder?: boolean;
        readonly isPending?: boolean;
        readonly parent?: string;
        readonly children?: import("seamless-immutable").ImmutableArray<string>;
    };
    context?: React.Context<ReactRedux.ReactReduxContextValue<any, import("redux").UnknownAction>>;
    store?: import("redux").Store;
}>;
export default _default;
