/** @jsx jsx */
import { jsx, type UseDataSource, type ImmutableArray } from 'jimu-core';
import { type SearchDataConfig, type DSInWidgetJson } from '../type/type';
interface LayerSourceSidePopperProps {
    id: string;
    datasourceConfig: ImmutableArray<SearchDataConfig>;
    toggle: () => void;
    onSettingChange: (datasourceConfig: ImmutableArray<SearchDataConfig>, dsInWidgetJson?: DSInWidgetJson, viewId?: string) => void;
    updateConfigForLayerOptions: (datasourceConfig?: ImmutableArray<SearchDataConfig>) => void;
    trigger: HTMLElement;
    isOpen: boolean;
    dsConfigItemIndex: number;
    useDataSources: ImmutableArray<UseDataSource>;
    popperFocusNode: HTMLElement;
    hideIconSetting: boolean;
    createOutputDs?: boolean;
    viewId?: string;
}
declare const LocatorSourceSidePopper: (props: LayerSourceSidePopperProps) => jsx.JSX.Element;
export default LocatorSourceSidePopper;
