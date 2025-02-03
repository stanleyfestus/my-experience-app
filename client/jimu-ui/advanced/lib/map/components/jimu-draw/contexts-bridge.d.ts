/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { type JimuMapView } from 'jimu-arcgis';
import { /*JimuSymbolType, JimuSymbol,*/ type JimuPointSymbol, type JimuPolylineSymbol, type JimuPolygonSymbol } from 'jimu-ui/advanced/map';
import { type JimuDrawUIOptions } from './components/layouts';
import { type JimuDrawingOptions, type JimuDrawCreatedDescriptor, type DrawingUpdatedDescriptor, type JimuSymbolsGroup } from './components/sketch';
import { type MeasurementsPropsInfo, type MeasurementsUnitsInfo } from './components/measurements/constraints';
export interface JimuDrawProps {
    jimuMapView: JimuMapView;
    isDisplayCanvasLayer?: boolean;
    drawingOptions?: JimuDrawingOptions;
    measurementsInfo?: MeasurementsPropsInfo;
    measurementsUnitsInfos?: MeasurementsUnitsInfo[];
    uiOptions?: JimuDrawUIOptions;
    disableSymbolSelector?: boolean;
    defaultSymbols?: JimuSymbolsGroup;
    onPointSymbolChanged?: (symbol: JimuPointSymbol) => void;
    onPolylineSymbolChanged?: (symbol: JimuPolylineSymbol) => void;
    onPolygonSymbolChanged?: (symbol: JimuPolygonSymbol) => void;
    onJimuDrawCreated?: (jimuDrawCreatedDescriptor: JimuDrawCreatedDescriptor) => void;
    onToolsActivated?: (drawingMode: string) => void;
    onDrawingStarted?: () => void;
    onDrawingCanceled?: () => void;
    onDrawingFinished?: (graphic: __esri.Graphic) => void;
    onDrawingUpdated?: (res: DrawingUpdatedDescriptor) => void;
    onDrawingCleared?: () => void;
}
export declare const ContextsBridge: React.MemoExoticComponent<(props: JimuDrawProps) => jsx.JSX.Element>;
