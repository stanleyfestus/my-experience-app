import type { CalculatedMinMaxBoundsPayload, LegendItemVisibility, SelectionData, SeriesSymbolsMap, ValidationStatus, WebChartGenericDataItem } from 'arcgis-charts-components';
import { type DataWarningKeywords } from './shared-utils';
interface ElementCountExceededParams {
    actualCount: number;
    totalLimit: number;
    seriesLimit?: number;
}
interface DataWarningObject {
    keyword: DataWarningKeywords;
    header: string;
    message: string;
    params?: ElementCountExceededParams;
}
export interface ArcgisChartsCustomEvent<T, E extends EventTarget> extends CustomEvent<T> {
    detail: T;
    target: E;
}
export interface ChartComponentEventCallbacks<T extends EventTarget, D = WebChartGenericDataItem> {
    /**
     * Event triggered once the chart axes min/max values are computed
     * @type {EventEmitter<CalculatedMinMaxBoundsPayload[]>}
     */
    onArcgisAxesMinMaxChange?: (event: ArcgisChartsCustomEvent<CalculatedMinMaxBoundsPayload[], T>) => void;
    /**
     * Event triggered when an error is detected with the data set
     * @type {EventEmitter<DataWarningObject>}
     * @event
     */
    onArcgisBadDataWarningRaise?: (event: ArcgisChartsCustomEvent<DataWarningObject, T>) => void;
    /**
     * Event triggered once the chart data has been processed
     * @type {EventEmitter<D>}
     * @event
     */
    onArcgisDataProcessComplete?: (event: ArcgisChartsCustomEvent<D, T>) => void;
    /**
     * Event triggered when an error occurred while fetching of processing the data for the chart
     * @type {EventEmitter}
     * @event
     */
    onArcgisDataProcessError?: (event: ArcgisChartsCustomEvent<any, T>) => void;
    /**
     * Event triggered once a legend item visibility has been changed
     * @type {EventEmitter<LegendItemVisibility>}
     * @event
     */
    onArcgisLegendItemVisibilityChange?: (event: ArcgisChartsCustomEvent<LegendItemVisibility, T>) => void;
    /**
     * Event triggered when a selection is done on the chart, whether it is by drawing a rectangle or clicking on a line
     * @type {EventEmitter<SelectionData>}
     * @event
     */
    onArcgisSelectionComplete?: (event: ArcgisChartsCustomEvent<SelectionData, T>) => void;
    /**
     * Event triggered once the chart series color have been assigned
     * @type {EventEmitter<SeriesSymbolsMap>}
     * @event
     * Node: Not supported for scatter-plot and gauge.
     */
    onArcgisSeriesColorChange?: (event: ArcgisChartsCustomEvent<SeriesSymbolsMap, T>) => void;
    /**
     * Event triggered once the chart is updated
     * @type {EventEmitter<ValidationStatus>}
     * @event
     */
    onArcgisUpdateComplete?: (event: ArcgisChartsCustomEvent<ValidationStatus, T>) => void;
}
export {};
