import { type Expression, type IMExpression } from '../types/expression';
import { groupPartsByFunction } from './utils';
import { type RepeatedDataSource } from '../repeat-data-source-context';
import { type DataRecord } from '../data-sources/interfaces';
export { groupPartsByFunction as groupExpressionPartsByFunction };
export * from './types';
export declare function resolveExpression(expression: Expression | IMExpression, records: {
    [dataSourceId: string]: DataRecord[];
}, repeatedDataSource: RepeatedDataSource | RepeatedDataSource[]): Promise<string>;
