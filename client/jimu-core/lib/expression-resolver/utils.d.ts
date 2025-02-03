import { type ExpressionPart, ExpressionFunctions, type ExpressionPartGroup } from '../types/expression';
import { type ArcGISQueryParams, type DataRecord } from '../data-sources/interfaces';
import { type RepeatedDataSource } from '../repeat-data-source-context';
import { type ImmutableArray } from 'seamless-immutable';
import { type FormatNumberOptions } from 'react-intl';
export declare function calculatePostfixExpressionWithoutFunction(parts: ExpressionPart[], records: {
    [dataSourceId: string]: DataRecord[];
}, repeatedDataSource: RepeatedDataSource | RepeatedDataSource[], numberFormat: FormatNumberOptions): string;
export declare function resolveFunction(part: ExpressionPartGroup, records: {
    [dataSourceId: string]: DataRecord[];
}, repeatedDataSource: RepeatedDataSource | RepeatedDataSource[]): Promise<number | string>;
export declare function getQueryParams(parts: ExpressionPart[], func: ExpressionFunctions): ArcGISQueryParams;
/**
 * Put parameter field parts into function parts.
 * For example, if the input is.
 * [{
 *  "type": "FUNCTION",
 *  "exp": "AVERAGE"
 * },
 * {
 *  "type": "OPERATOR",
 *  "exp": "("
 * },
 * {
 *  "type": "FIELD",
 *  "exp": "{OBJECTID}",
 *  "dataSourceId": "dataSource_1",
 *  "jimuFieldName": "OBJECTID"
 * },
 * {
 *  "type": "OPERATOR",
 *  "exp": ")"
 * }]
 *
 * The output will be.
 * [{
 *   "type": "FUNCTION",
 *   "exp": "AVERAGE",
 *   "parts": [{
 *     "type": "FIELD",
 *     "exp": "{OBJECTID}",
 *     "dataSourceId": "dataSource_1",
 *     "jimuFieldName": "OBJECTID"
 *   }]
 * }]
 */
export declare function groupPartsByFunction(parts: ExpressionPart[] | ImmutableArray<ExpressionPart>): ExpressionPartGroup[];
export declare function getPostfixParts(parts: ExpressionPartGroup[]): ExpressionPartGroup[];
export declare function getStringOrNumberPartFromExp(e: string | number): ExpressionPart;
