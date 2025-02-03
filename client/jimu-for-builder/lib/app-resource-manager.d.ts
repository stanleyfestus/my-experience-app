import { type AppConfig, ResourceType, AjaxState, type IconResult } from 'jimu-core';
import { type IRequestOptions } from '@esri/arcgis-rest-request';
import { type IGetItemResourceOptions } from '@esri/arcgis-rest-portal';
export interface ResourceItemInfo {
    /**
     * The final URL of the resource, widget should use this URL to display resource.
     * The URL has two forms, one is the blobUrl, the other is the url with portal and token.
     *
     * * When the resource is just uploaded, it is blobUrl, like this: 'blob:https://......'
     * * When the resource is fetched from server, it is resourceURL, like this: 'https://www.arcgis.com/sharing/rest/content/items/alskdhfoaug/resources/images/widget_1/1641535897496.png?token=...'
     *
     *
     * However, when the resource item is saved in the management resource, the URL is like this: '${appResourceUrl}/images/widget_1/1641535897496.png'.
     * After the resource fetched to client, the '${appResourceUrl}' is replaced with the portalUrl and token is appended. So, widget will never read this kind of URL.
     */
    url?: string;
    created?: number;
    fileFormat?: string;
    fileName?: string;
    originalName?: string;
    resourcesPrefix?: string;
    size?: number;
    originalWidth?: number;
    originalHeight?: number;
    id?: string;
    appId?: string;
    widgetId?: string;
    blobUrl?: string;
    file?: Blob | string;
    resourceUrl?: string;
    type?: ResourceType;
    status?: AjaxState;
    promise?: Promise<any>;
    owner?: string;
}
export interface ImageResourceItemInfo extends ResourceItemInfo {
    width?: number;
    height?: number;
    referredIds?: string[];
    originId?: string;
    isUseCompress?: boolean;
}
export declare enum AppResourceFilePath {
    Config = "config/config.json",
    Image = "images/image-resources-list.json",
    Icon = "images/icon-resources-list.json"
}
export interface AppResourceInfo {
    access: string;
    created: number;
    resource: string;
    size: number;
}
export interface AppResourceInfoList {
    resources: AppResourceInfo[];
    nextStart?: number;
    num?: number;
    start?: number;
    total?: number;
}
export interface ImageResourceList {
    [id: string]: ImageResourceItemInfo;
}
export interface IconResource extends IconResult {
}
export interface IconResourceList {
    [id: string]: IconResource;
}
export interface Resources {
    imageResources?: ImageResourceList;
    iconResources?: IconResourceList;
}
/**
 * The resource manager is used to process the resources in the app. It can be used to upload resources to the server, update the config, and to fetch resources from the server.
 *
 * App resources refer to files used by the app, such as images, icons, and config.json. They are stored on the ArcGIS rest server associated with the app item.
 * The storage structure of the resources are as follows:
 * {
 *    resources: [
 *        { resource: 'config/config.json' , ...}, // This file is the draft version appConfig
 *        { resource: 'images/image-resources-list.json' , ...}, // This file is stored imageResources.
 *        { resource: 'images/icon-resources-list.json' , ...}, // This file is stored iconResources.
 *        { resource: 'images/widget_1/123456.jpg' , ...}, // This file is stored image item.
 *        ...
 *    ]
 * }
 *
 * These first 3 app resources are special. The config.json is the draft version appConfig.
 * The image-resources-list.json and icon-resources-list.json are used to manage other resources, we call them management resources, they don't have `ResourceItemInfo` but their content have `ResourceItemInfo` to manage the item resources.
 * All other resources are called resource items, they have `ResourceItemInfo`.
 *
 * The manager handles mapping app resource URLs to the underlying storage location. So code can refer to a normalized URL like ${appResourceUrl}/images/widget1/image.png. And the manager will handle uploading resources to the proper /images/widget1/location.
 *
 * Here is how the resources are processed:
 *  * When uploading resources, it converts files to blobs and generates blob URLs.
 *  * When saving and updating the app config, it replaces blob URLs with the corresponding resource URLs.
 *  * When fetching resources from server, it replaces `${appResourceUrl}` with portalUrl and add token to the end of the url.
 *
 */
export declare class AppResourceManager {
    static _instance: AppResourceManager;
    static getInstance(): any;
    private resourceMap;
    private blobToResourceMap;
    private resources;
    static assignBlobUrlToResourceItem(resourceItemInfo: ResourceItemInfo): Promise<ResourceItemInfo>;
    static getBlobByBlobUrl(blobUrl: string): Promise<Blob>;
    static getResourcePrefix({ resourcesPrefix, widgetId, type }: {
        resourcesPrefix: any;
        widgetId: any;
        type: any;
    }): string;
    getResourcesInDraft: () => Resources;
    setResourcesInDraft: (resources: Resources) => void;
    /**
     * Get the image resource list from the draft. The draft resources contains the resources that have been uploaded or fetched from the server.
     * If the resource is already cached in the draft, return the image resources in the draft.
     * If not, will fetch the image resources from the server and replace `${appResourceUrl}` with portalUrl and add token.
     */
    getImageResourceListFromDraft: (appId: string) => Promise<ImageResourceList>;
    getIconResourceListFromDraft: (appId: string) => Promise<IconResourceList>;
    /**
     * Filter out the image resources being used by widgets or components in the app from the image resource list.
     * It checks the app config for matches. And it will replace the local image blob url or portal url to `${appResourceUrl}` so that it can be matched. The result will be cached into configSourceMap.
     */
    getInUseImageResources: (imageResourceList: ImageResourceList) => ImageResourceItemInfo[];
    getInUseIconResources: (iconResourceList: IconResourceList) => IconResult[];
    /**
     * Upload config.json (AppConfig) to the app resources, this function is called when the save app button is clicked.
     */
    upLoadAppConfig: (appId: string, config: AppConfig, owner: string) => Promise<AppConfig>;
    /**
     * Upload the image-resources-list.json to app resources list.
     */
    upLoadImageResourceList: (resourceList: ImageResourceList, newAppId?: string) => Promise<ImageResourceList>;
    upLoadIconResourceList: (resourceList: IconResourceList, newAppId?: string) => Promise<IconResourceList>;
    /**
     * Upload a resource file to the server via rest api.
     * It will check if the resource already exists on the server. If it does, will update the resource. If not, will add the resource.
     *
     * The resource file can be a config/config.json, images/image-resources-list.json, images/icon-resources-list.json, and the image items like images/widget_1/1689818129651.png
     */
    upLoadAppResource: (resourceItemInfo: ResourceItemInfo) => Promise<any>;
    /**
     * Upload the local blob resources. It will replaces the blobUrl with resource url '${appResource}/...' in the config.
     * This helps persist local draft resources to the server.
     */
    upLoadLocalResource: (config: any) => Promise<any>;
    /**
     * Fetch app resource list data from arcgis rest api.
     * The list includes the files of config.json, image-resources-list.json, icon-resources-list.json, and image items including the images that just uploaded without saved.
     */
    fetchAppResourceInfoList: (appId: string, option?: IRequestOptions) => Promise<AppResourceInfoList>;
    /**
     * Fetch app resource item data from arcgis rest api. Like image-resources-list.json.
     *
     * Note: image-resources-list.json only includes the images that have been saved. Because only call appResourceManagerInstance.upLoadImageResourceList(cloneObj(imageResources)) after upLoadAppConfig Promise in saveApp() function in jimu-for-builder\lib\service\app-service\index.ts.
     */
    fetchAppResource: (appId: string, option?: IGetItemResourceOptions) => Promise<any>;
    /**
     * Clear out unused resources from the app.
     * It will clean resourceMap and blobToResourceMap and release the blob url cached in memory.
     * It will also remove the unsaved resources.
     * @param appId
     */
    clearResources: (appId: string) => void;
    /**
     * Update the image resource item info.
     * This function will be called when the image resource item is updated, like after cropping image.
     */
    updateImageResourceItemInfo: (imageResourceItemInfo: ImageResourceItemInfo) => void;
    private addAppResource;
    private updateAppResource;
    private removeAppResource;
    private getAppId;
    private getSession;
    private getPortalUrlWithTemplate;
    private getPortalUrlWithFull;
    private setResourceMap;
    private setResourceItemInfoStatus;
    private clearResourceMap;
    /**
     * Filter out the resources that have been uploaded without saved from the 'resourceUrlList'. Return the remaining resource items.
     * The resourceUrlList is the 'shouldClearResources' list which contains all the resource list (upload + saved) and not in the config being used.
     * @param appId May be not equal with current app id.
     * @param resourceUrlList For example: [images/widget_1/123456.jpg, ...]. Include resource url such as images or icons.
     * @returns
     */
    private clearValueWithoutInResourcesInDraft;
    /**
     * Clear resources that have not been saved as well as not in the config.
     * Any resources on the draft not referenced on server resource list will be deleted.
     * @param appId
     */
    private clearResourcesWithoutSaved;
    private formatRelatedImageResources;
    private checkResourcesUploadStatus;
    /**
     * Upload image resources list (images/image-resources-list.json) or icon resources list (images/icon-resources-list.json).
     */
    private upLoadResourceList;
    private getAppInfo;
}
