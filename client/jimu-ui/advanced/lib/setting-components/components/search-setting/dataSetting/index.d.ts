/** @jsx jsx */
import { jsx, type UseDataSource, type ImmutableArray, type DataSourceJson } from 'jimu-core';
import { type SearchDataConfig, SearchDataType, type DSInWidgetJson, type PropsForDataSourceSelector } from '../type/type';
export interface SearchDataSettingProps {
    /**
     * Widget id
    */
    id: string;
    datasourceConfig?: ImmutableArray<SearchDataConfig>;
    useDataSources?: ImmutableArray<UseDataSource>;
    /**
     * Portal url of current app
    */
    portalUrl?: string;
    /**
     * The type of data service
     * @param Both Display all data setting
     * @param GeocodeService Only display data setting of geocode service
     * @param FeatureService Only display data setting of feature service
    */
    searchDataSettingType?: SearchDataType;
    /**
     * Whether to create outputDs by geocode service
    */
    createOutputDs?: boolean;
    /**
     * Whether to hide icon settings
     */
    hideIconSetting?: boolean;
    /**
     * Enable filtering when searching for layer sources
     */
    enableFiltering?: boolean;
    viewId?: string;
    hideEnableFiltering?: boolean;
    hideTitleOfNewSearchSource?: boolean;
    autoSelectSingleGeocodeService?: boolean;
    autoSelectAllOrgGeocodeService?: boolean;
    propsForDataSourceSelector?: PropsForDataSourceSelector;
    /**
     * Callback fired when dataSourceConfig change.
     * @event
    */
    onSettingChange?: (datasourceConfig: ImmutableArray<SearchDataConfig>, dsInWidgetJson?: DSInWidgetJson, viewId?: string) => void;
    /**
     * Callback fired when enable filtering change.
     * @event
    */
    onEnableFilteringChange?: (enable: boolean) => void;
    /**
     * The method of create output dataSources
     * @event
    */
    onOutputDsSettingChange?: (dataSourceJson: DataSourceJson[], datasourceConfig: ImmutableArray<SearchDataConfig>, dsInWidgetJson?: DSInWidgetJson, viewId?: string) => void;
}
export declare const SearchDataSetting: (props: SearchDataSettingProps) => jsx.JSX.Element;
