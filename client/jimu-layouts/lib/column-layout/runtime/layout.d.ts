/** @jsx jsx */
import { React, ReactRedux, jsx, Immutable } from 'jimu-core';
import { type LayoutProps, type StateToLayoutProps, type ColumnLayoutSetting } from '../../types';
declare class Layout extends React.PureComponent<LayoutProps & StateToLayoutProps> {
    createItem(itemId: string, index: number, layoutSetting: ColumnLayoutSetting): jsx.JSX.Element;
    render(): jsx.JSX.Element;
}
declare const _default: ReactRedux.ConnectedComponent<typeof Layout, {
    className?: string;
    style?: any;
    children?: React.ReactNode;
    ref?: React.LegacyRef<Layout>;
    key?: React.Key | null | undefined;
    visible?: boolean;
    layouts: Immutable.ImmutableObjectMixin<import("jimu-core").SizeModeLayoutJson> & {
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
    isItemAccepted?: (item: import("jimu-core").LayoutItemConstructorProps, isReplacePlaceholder: boolean) => boolean;
    onItemClick?: (e: any, widgetId: string) => void;
    ignoreMinHeight?: boolean;
    context?: React.Context<ReactRedux.ReactReduxContextValue<any, import("redux").UnknownAction>>;
    store?: import("redux").Store;
}>;
export default _default;
