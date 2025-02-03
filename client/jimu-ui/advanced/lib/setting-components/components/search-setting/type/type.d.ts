import { type UseDataSource, type FieldSchema, type ImmutableObject, type UseUtility, type ImmutableArray } from 'jimu-core';
import { type ISpatialReference } from '@esri/arcgis-rest-feature-service';
export declare const DEFAULT_MAX_SUGGESTION = 6;
export declare const MAX_SUGGESTION = 20;
export declare const MAX_RECENT_SEARCHES = 6;
export declare const DEFAULT_GEOCODE_KEY = "default_geocode";
export declare enum SearchDataType {
    Both = "Both",
    GeocodeService = "GeocodeService",
    FeatureService = "FeatureService"
}
export declare enum SearchServiceType {
    GeocodeService = "GeocodeService",
    FeatureService = "FeatureService"
}
export interface AddressFields {
    alias: string;
    length: number;
    name: string;
    required: boolean;
    type: string;
}
export interface SearchLayerDataConfig {
    configId: string;
    label: string;
    useDataSource: UseDataSource;
    icon?: any;
    searchFields?: FieldSchema[];
    searchExact?: boolean;
    displayFields?: FieldSchema[];
    hint?: string;
    searchServiceType?: SearchServiceType;
    layerViewId?: string;
}
export interface DSInWidgetJson {
    isWidgetJsonDsChanged: boolean;
    dsInWidgetJson: any;
}
export interface SearchGeocodeDataConfig {
    configId: string;
    label: string;
    useUtility: UseUtility;
    outputDataSourceId?: string;
    icon?: any;
    hint?: string;
    searchServiceType?: SearchServiceType;
    singleLineFieldName?: string;
    displayFields?: FieldSchema[];
    addressFields?: FieldSchema[];
    defaultAddressFieldName?: string;
    isSupportSuggest?: boolean;
    spatialReference?: ISpatialReference;
    synchronizeSettings?: boolean;
    layerViewId?: string;
    enableCountryCode?: boolean;
    countryCode?: string;
}
export interface PropsForDataSourceSelector {
    disableDataView?: boolean;
    fromDsIds: ImmutableArray<string>;
    fromRootDsIds: ImmutableArray<string>;
}
export interface DataSourceCreateStatus {
    [key: string]: boolean;
}
export type IMDataSourceCreateStatus = ImmutableObject<DataSourceCreateStatus>;
export type IMSearchLayerDataConfig = ImmutableObject<SearchLayerDataConfig>;
export type IMSearchGeocodeDataConfig = ImmutableObject<SearchGeocodeDataConfig>;
export type SearchDataConfig = SearchLayerDataConfig & SearchGeocodeDataConfig;
export interface DataSourceConfigItemWithMapCentric {
    synchronizeSettings?: boolean;
    dataSourceConfig?: SearchDataConfig[];
}
export type IMDataSourceConfigItemWithMapCentric = ImmutableObject<DataSourceConfigItemWithMapCentric>;
export interface DataSourceConfigWithMapCentric {
    [key: string]: DataSourceConfigItemWithMapCentric;
}
export type IMDataSourceConfigWithMapCentric = ImmutableObject<DataSourceConfigWithMapCentric>;
export type IMSearchDataConfig = ImmutableObject<SearchDataConfig>;
export interface SearchSuggestionConfig {
    /**
     * Max number of suggestion
    */
    maxSuggestions: number;
    /**
     * Is show 'Use current location'
    */
    isUseCurrentLoation: boolean;
    /**
     * Is show recent searches
    */
    isShowRecentSearches: boolean;
    /**
     * Max number of recent searches
    */
    recentSearchesMaxNumber: number;
    /**
     * Enable filtering when searching for layer sources
    */
    enableFiltering?: boolean;
}
export type IMSearchSuggestionConfig = ImmutableObject<SearchSuggestionConfig>;
