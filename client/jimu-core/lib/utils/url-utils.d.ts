import { type UrlParameters, type IMUrlParameters, type UrlHashParameters, DataSourceSelectionTypes } from '../types/url-parameters';
import { type Location, type LinkTo, type UrlProtocol, type URIScheme } from '../types/common';
import { type IMAppConfig, type AppConfig } from '../types/app-config';
import { type SectionNavInfo } from '../types/state';
import { type ArcGISSelectOptions, type QueryParams } from '../data-sources/interfaces';
export declare function parseUrl(path: string): Location;
export declare function isAbsoluteUrl(url: string): boolean;
export declare function checkAbsoluteUrl(url: string, supportedSchemes?: URIScheme[]): 'schemeError' | 'invalidUrlError' | 'valid';
export declare function getFolder(url: string): string;
export declare function createLocation(currentLocation: Location, linkResult: string): Location;
export declare function createHref(location: Location): string;
export declare function updateQueryStringParameter(uri: string, key: string, value: string): string;
export declare function getProtocol(url: string): UrlProtocol;
export declare function setProtocol(url: string, protocol: UrlProtocol): string;
export declare function removeProtocol(url: string): string;
export declare function getUrlHost(url: string): string;
export declare function removeSearchFromUrl(url: string): string;
export declare function appendQueryParam(url: string, key: string, val: string): string;
export declare function normalize(url: string): string;
export interface DataSourceInfosInUrl {
    [dsId: string]: {
        selection?: string[] | ArcGISSelectOptions;
        filter?: QueryParams;
        gdbVersion?: string;
    };
}
export declare function getDataSourceInfosFromUrlParams(queryObject: UrlParameters, urlHashObject: UrlHashParameters): DataSourceInfosInUrl;
export declare function splitDataSToParts(dataS: string): Array<{
    type: DataSourceSelectionTypes;
    dsIds: string[];
    value: string;
}>;
export declare function getSectionNavInfoFromQueryObject(queryObject: UrlParameters, appConfig: AppConfig | IMAppConfig): {
    [sectionId: string]: SectionNavInfo;
};
export declare function getAppIdPageIdFromUrl(location?: Location): {
    appId: string;
    pageId: string;
};
/**
 * the path may be:
 *  ->app id is null:
 *  :rootPath
 *  :rootPath/index.html
 *  :rootPath/page
 *  :rootPath/page/:pageId
 *  :rootPath/page/page => page id is "page"

    -> app is not null, page id is null
 *  :rootPath/:appId, this means we can't have a app whose id is "page"
 *  :rootPath/:appId/index.html => page id is null
 *  :rootPath/:appId/page => page id is null

    -> both are not null
 *  :rootPath/:appId/page/:pageId
 */
export declare function parseAppPath(pathName: string, appConfig: AppConfig | IMAppConfig): {
    appId: string;
    pageId: string;
};
export declare function getPageIdFromIdOrLabel(idOrLabel: string, appConfig: AppConfig | IMAppConfig): string;
export declare function getViewIdFromIdOrLabel(idOrLabel: string, appConfig: AppConfig | IMAppConfig): string;
export declare function getDialogIdFromIdOrLabel(idOrLabel: string, appConfig: AppConfig | IMAppConfig): string;
export declare function fixPageLabel(label: string): string;
export declare function fixDialogLabel(label: string): string;
export declare function fixViewLabel(label: string): string;
export declare function getPageLinkInfo(pageId: string): {
    path: string;
    qo: {
        page: string;
    };
};
export declare function getPageLinkUrl(pageId: string, qo?: Partial<UrlParameters>, currentLocation?: Location, hash?: string): string;
export declare function getFixedRootPath(): string;
export declare function getAbsoluteRootUrl(): string;
export declare function getHrefFromLinkTo(linkResult: LinkTo, queryObject: IMUrlParameters, currentLocation?: Location, keepQueryObjectDlg?: boolean): string;
export interface GetAppUrlParameter {
    appId: string;
    isTemplate?: boolean;
    isArcGisOnlineTemplate?: boolean;
    isPortalRequest?: boolean;
    isDraft?: boolean;
    defaultTemplateName?: string;
}
export declare function getAppUrl(getAppUrlParameter: GetAppUrlParameter): string;
export declare function getExperienceBuilderOnlineUrl(): any;
export declare function getArcgisOnlineUrl(): any;
export declare function getArcgisOnlineOrgId(): any;
export declare function isZoomToSelection(): boolean;
