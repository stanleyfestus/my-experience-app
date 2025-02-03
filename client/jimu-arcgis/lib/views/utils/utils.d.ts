import { type SubtypeGroupLayerDataSource, type FeatureDataRecord } from 'jimu-core';
import { type JimuQueriableLayerView } from '../layers/jimu-queriable-layer-view';
export declare function convertSubtypeGrouplayerRecordsToSubtypeSublayerRecords(subtypeGroupLayerDataSource: SubtypeGroupLayerDataSource, subtypeGrouplayerRecords: FeatureDataRecord[]): {
    [subtypeSublayerDataSourceId: string]: FeatureDataRecord[];
};
export declare function publishSelectionChangeMessage(jimuLayerView: JimuQueriableLayerView, records: FeatureDataRecord[]): void;
export declare function getSubtypeField(layer: __esri.SubtypeGroupLayer | __esri.SubtypeSublayer): string;
