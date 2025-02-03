import { React, type DataSource, type ImmutableArray, type IntlShape, type UseDataSource } from 'jimu-core';
interface Props {
    intl: IntlShape;
    ds: DataSource;
    widgetId: string;
    useDataSources: ImmutableArray<UseDataSource>;
    isMultiple: boolean;
    isBatched: boolean;
    onChange: (useDataSources: UseDataSource[]) => void;
    isDataSourceSelectable: (ds: DataSource) => boolean;
    onClickDisabledDsItem?: () => void;
    disableSelection: boolean;
    disableRemove: boolean;
    className: string;
}
export default class DsItem extends React.PureComponent<Props, unknown> {
    getWhetherSelected: () => boolean;
    getUseDs: () => UseDataSource;
    getDsLabel: (ds: DataSource) => string;
    onItemClick: (e: any) => void;
    onRemoveClick: (e: any) => void;
    stopPropagation: (e: any) => void;
    onDsSelected: (selectedDs: UseDataSource) => void;
    onDsRemoved: (removedDs: UseDataSource) => void;
    render(): React.JSX.Element;
}
export {};
