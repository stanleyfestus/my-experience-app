export interface JimuDrawUIOptions {
    arrangement?: Arrangement;
    isHideBorder?: boolean;
    isHideBgColor?: boolean;
    isAutoWidth?: boolean;
    isAutoHeight?: boolean;
}
export declare enum Arrangement {
    Panel = "Panel",// drawWidget
    Toolbar = "Toolbar",// bookmark
    Hidden = "Hidden"
}
