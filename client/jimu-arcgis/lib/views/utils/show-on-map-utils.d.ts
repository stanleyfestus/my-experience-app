import { type SymbolOption } from '../jimu-map-view';
import { type DefaultSymbolType } from '../../utils/feature-utils';
export declare function createSimpleRenderer(symbol: __esri.SymbolProperties | __esri.Symbol): Promise<__esri.SimpleRenderer>;
export declare function createSimpleRendererBySymbolOption(symbolsSupportJsonUtils: __esri.symbolsSupportJsonUtils, symbolOption: SymbolOption, symbolGeometryType: DefaultSymbolType): Promise<__esri.SimpleRenderer>;
export declare function createDefaultSimpleRenderer(symbolsSupportJsonUtils: __esri.symbolsSupportJsonUtils, symbolGeometryType: DefaultSymbolType): Promise<__esri.SimpleRenderer>;
export declare function getDefaultSymbol(symbolsSupportJsonUtils: __esri.symbolsSupportJsonUtils, symbolGeometryType: DefaultSymbolType): __esri.Symbol;
export declare function convertRenderer3DSymbolsTo2DSymbolsForMapView(symbolsSupportJsonUtils: __esri.symbolsSupportJsonUtils, _renderer: __esri.Renderer, view: __esri.MapView | __esri.SceneView): void;
export declare function convert3DSymbolTo2DSymbol(symbolsSupportJsonUtils: __esri.symbolsSupportJsonUtils, inputSymbol: __esri.Symbol): __esri.Symbol;
export declare function setDefaultSymbolForRenderer(symbolsSupportJsonUtils: __esri.symbolsSupportJsonUtils, symbolGeometryType: DefaultSymbolType, _renderer: __esri.Renderer): void;
export declare function createUniqueValueRendererByUserDefinedSymbol(view: __esri.View, rawFeatureSet: __esri.FeatureSet, objectIdFieldName: string, symbolGeometryType: DefaultSymbolType, symbolUtils: __esri.symbolUtils, supportJsonUtils: __esri.symbolsSupportJsonUtils, UniqueValueRenderer: typeof __esri.UniqueValueRenderer): Promise<__esri.UniqueValueRenderer>;
/**
 * get default symbol from renderer, maybe return null
 */
export declare function getGraphicDisplaySymbolByRenderer(view: __esri.View, graphic: __esri.Graphic, symbolUtils: __esri.symbolUtils, jsonUtils: __esri.symbolsSupportJsonUtils): Promise<any>;
