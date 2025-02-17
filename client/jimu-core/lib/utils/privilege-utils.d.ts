import { type ArcGISIdentityManager } from '@esri/arcgis-rest-request';
export interface ExbAccess {
    valid: boolean;
    capabilities: Capabilities;
    invalidInfo: InvalidInfo;
    invalidMessage: string;
}
export interface ExbLicense {
    valid: boolean;
    viewOnly: boolean;
    messageCode?: string;
}
export interface ResourcePermission {
    valid: boolean;
    isExperience: boolean;
    isValidItem: boolean;
    hasPermissionToAccess: boolean;
    viewOnly: boolean;
}
export interface Capabilities {
    canViewExperience: boolean;
    canCreateExperience: boolean;
    canUpdateExperience: boolean;
    canDeleteExperience: boolean;
    canShareExperience: boolean;
    canEditFeature?: boolean;
}
export declare enum CheckTarget {
    AppList = "AppList",
    Builder = "Builder",
    Experience = "Experience"
}
export declare enum InvalidInfo {
    InvalidUserLevel = "InvalidUserLevel",
    InvalidPrivilege = "InvalidPrivilege",
    InvalidLicense = "InvalidLicense",
    InvalidAppBlockedByOrg = "InvalidAppBlockedByOrg",
    InvalidResourceExperience = "InvalidResourceExperience",
    InvalidResourceItem = "InvalidResourceItem",
    InvalidResourcePermission = "InvalidResourcePermission",
    InvalidResourcePermissionForReadOnly = "InvalidResourcePermissionForReadOnly",
    NullInfo = ""
}
export declare function checkAccess(checkTarget: CheckTarget): Promise<boolean>;
export declare function getAccessCapabilities(checkTarget: CheckTarget): Promise<Capabilities>;
export declare function checkExbAccess(checkTarget: CheckTarget, isExBChromeExtensionInstalled?: boolean): Promise<ExbAccess>;
export declare function getPortalVersion(): Promise<string>;
export declare function isPortal1061OrBefore(): Promise<boolean>;
export declare function isPortal1080OrBefore(): Promise<boolean>;
export declare function canCreateItem(): Promise<boolean>;
export declare function canPublishFeatures(): Promise<boolean>;
export declare function shouldCheckAppAccess(checkTarget: CheckTarget): Promise<boolean>;
export declare function isItemInTheUpdatedGroup(itemId: string, sessionForItem?: ArcGISIdentityManager): Promise<boolean>;
