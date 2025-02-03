import { type FeatureLayerDataSourceImpl, type SceneLayerDataSourceImpl } from '../data-sources';
import { type StatisticDefinition, type DataRecord } from '../data-sources/interfaces';
export type StatResult = {
    [statType in StatisticDefinition['statisticType'] | 'countEmpty']?: number;
};
export declare const statTypes: Array<keyof StatResult>;
export declare const queryFieldStatistics: (ds: FeatureLayerDataSourceImpl | SceneLayerDataSourceImpl, fieldName: string) => Promise<StatResult>;
export declare const getFieldStatistics: (records: DataRecord[], fieldName: string) => StatResult;
