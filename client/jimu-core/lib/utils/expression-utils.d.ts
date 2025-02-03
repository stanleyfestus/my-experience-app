import { type IMExpression, type ExpressionPart, type Expression, ExpressionFunctions, type PercentileParams } from '../types/expression';
import { type UseDataSource } from '../types/app-config';
import { type ImmutableArray } from 'seamless-immutable';
export declare function getUseDataSourceFromExpParts(parts: ExpressionPart[] | ImmutableArray<ExpressionPart>, currentUseDataSources: ImmutableArray<UseDataSource>): ImmutableArray<UseDataSource>;
export declare function mergeUseDataSources(u1?: ImmutableArray<UseDataSource>, u2?: ImmutableArray<UseDataSource>): ImmutableArray<UseDataSource>;
export declare function getWhetherExpressionValid(e: Expression | IMExpression): boolean;
export declare function getWhetherFieldInDs(dsId: string, jimuFieldName: string, alias: string): boolean;
export declare const isSingleStringExpression: (expression: Expression) => boolean;
export declare const getSingleStringExpressionText: (expression: Expression) => string;
export declare const getUseDataSourcesWithoutFields: (useDataSources: ImmutableArray<UseDataSource>) => ImmutableArray<UseDataSource>;
/**
 * Check whether has fields in every useDataSource
 * @param useDataSources
 */
export declare const whetherHasFieldsInUseDataSources: (useDataSources: ImmutableArray<UseDataSource>) => boolean;
export declare function getDataSourceIdsFromExpression(expression: IMExpression): string[];
export declare function getPercentileParams(paramParts: ExpressionPart[], func: ExpressionFunctions): PercentileParams;
