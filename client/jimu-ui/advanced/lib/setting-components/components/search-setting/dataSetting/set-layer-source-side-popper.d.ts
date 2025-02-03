/** @jsx jsx */
import { jsx, type UseDataSource, type ImmutableArray } from 'jimu-core';
import { type SearchDataConfig, type DSInWidgetJson, type PropsForDataSourceSelector } from '../type/type';
interface LayerSourceSidePopperProps {
    id: string;
    viewId?: string;
    trigger: HTMLElement;
    isOpen: boolean;
    datasourceConfig: ImmutableArray<SearchDataConfig>;
    dsConfigItemIndex: number;
    toggle: () => void;
    updateConfigForLayerOptions: (datasourceConfig: ImmutableArray<SearchDataConfig>, closeSidePopper?: boolean) => void;
    onSettingChange: (datasourceConfig: ImmutableArray<SearchDataConfig>, dsInWidgetJson?: DSInWidgetJson, viewId?: string) => void;
    useDataSources: ImmutableArray<UseDataSource>;
    popperFocusNode: HTMLElement;
    hideIconSetting: boolean;
    propsForDataSourceSelector: PropsForDataSourceSelector;
    dsStatusChange: (dsId: string, isDsCreateSuccess?: boolean) => void;
}
declare const LayerSourceSidePopper: (props: LayerSourceSidePopperProps) => jsx.JSX.Element;
export default LayerSourceSidePopper;
