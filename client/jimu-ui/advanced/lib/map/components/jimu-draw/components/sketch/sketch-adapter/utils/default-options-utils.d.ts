import { JimuDrawCreationMode } from '../..';
export declare const getDefaultVisibleElements: (visibleElements: __esri.SketchVisibleElements) => __esri.SketchVisibleElements;
export declare const getDefaultSnappingOptions: (snappingOptions: __esri.SnappingOptionsProperties, tmpCanvasLayer: __esri.GraphicsLayer) => __esri.SnappingOptionsProperties;
export declare const getDefaultCreationMode: (creationMode: JimuDrawCreationMode) => JimuDrawCreationMode;
export declare const getDefaultOptions: (params: {
    creationMode: JimuDrawCreationMode;
    visibleElements: __esri.SketchVisibleElements;
    updateOnGraphicClick: any;
    defaultCreateOptions: __esri.SketchViewModelDefaultCreateOptions;
    defaultUpdateOptions: __esri.SketchViewModelDefaultUpdateOptions;
    snappingOptions: any;
}, canvasLayer: __esri.GraphicsLayer) => {
    creationMode: JimuDrawCreationMode;
    visibleElements: __esri.SketchVisibleElements;
    updateOnGraphicClick: any;
    defaultCreateOptions: __esri.SketchViewModelDefaultCreateOptions;
    defaultUpdateOptions: __esri.SketchViewModelDefaultUpdateOptions;
    snappingOptions: any;
};
