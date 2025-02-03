/** @jsx jsx */
import { React, ReactRedux } from 'jimu-core';
import type { LayoutProps, StateToLayoutProps } from '../../types';
import { type FourSidesUnit } from 'jimu-ui';
type AccordionLayoutProps = LayoutProps & StateToLayoutProps & {
    singleMode: boolean;
    showToggleAll: boolean;
    expandByDefault: string;
    gap: number;
    padding: FourSidesUnit;
};
interface State {
    expandedItems: string[];
}
declare class Layout extends React.PureComponent<AccordionLayoutProps, State> {
    constructor(props: AccordionLayoutProps);
    handleExpandedChange: (layoutItemId: string, expanded: boolean) => void;
    expandAll: () => void;
    collapseAll: () => void;
    createItem(itemId: string): JSX.Element;
    render(): JSX.Element;
}
declare const _default: ReactRedux.ConnectedComponent<typeof Layout, {
    gap: number;
    padding: FourSidesUnit;
    className?: string;
    style?: any;
    children?: React.ReactNode;
    ref?: React.LegacyRef<Layout>;
    key?: React.Key | null | undefined;
    visible?: boolean;
    layouts: import("seamless-immutable").ImmutableObjectMixin<import("jimu-core").SizeModeLayoutJson> & {
        readonly [x: string]: string;
    };
    singleMode: boolean;
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
    showToggleAll: boolean;
    expandByDefault: string;
    context?: React.Context<ReactRedux.ReactReduxContextValue<any, import("redux").UnknownAction>>;
    store?: import("redux").Store;
}>;
export default _default;
