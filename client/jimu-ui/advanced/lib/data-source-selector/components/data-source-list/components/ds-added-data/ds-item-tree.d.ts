import { type DataSource, React, type ImmutableArray, type IntlShape, type UseDataSource } from 'jimu-core';
interface State {
    isNodeSelectable: (dataSource: Partial<DataSource>) => boolean;
    isOpen: boolean;
}
interface Props {
    ds: DataSource;
    /**
     * All [to-use data sources](../ds-add-data.tsx).
     * Use the array to get whether a data source can be list here and select.
     */
    allToUseDss: DataSource[];
    intl: IntlShape;
    widgetId: string;
    isMultiple: boolean;
    isBatched: boolean;
    isSearching: boolean;
    useDataSources: ImmutableArray<UseDataSource>;
    disableSelection: boolean;
    disableRemove: boolean;
    onChange: (useDataSources: UseDataSource[]) => void;
    onClickDisabledDsItem?: () => void;
}
export default class DsItemTree extends React.PureComponent<Props, State> {
    constructor(props: any);
    componentDidUpdate(prevProps: Props): void;
    getIsNodeSelectable: () => (ds: Partial<DataSource>) => boolean;
    renderDsItem: (ds: DataSource) => React.JSX.Element;
    renderDsLabel: (label: string, dataSource: DataSource, isRootTree: boolean) => React.JSX.Element;
    getChildDataSources: (ds: DataSource) => DataSource[];
    getLabel: (ds: DataSource) => string;
    toggle: () => void;
    render(): React.JSX.Element;
}
export {};
