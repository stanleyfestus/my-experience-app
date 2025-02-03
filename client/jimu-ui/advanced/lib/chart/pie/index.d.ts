import { React } from 'jimu-core';
import { type WebChartDataItem, type WebChartGenericDataItem, type Components, type PieSlicesSymbols } from 'arcgis-charts-components';
import { type UnprivilegedChart, type ChartComponentEventCallbacks, type ArcgisChartsCustomEvent } from '../utils';
export interface PieChartProps extends Partial<Components.ArcgisChartsPieChart>, Omit<ChartComponentEventCallbacks<HTMLArcgisChartsPieChartElement, WebChartGenericDataItem>, 'onArcgisSeriesColorChange'> {
    /**
     * Defines the class names added to the component.
     */
    className?: string;
    /**
     * Event triggered once the chart data has been fetched. Does not contain information about the group of slices.
     * @type {EventEmitter<WebChartDataItem[]>}
     * @event
     */
    onArcgisDataFetchComplete?: (event: ArcgisChartsCustomEvent<WebChartDataItem[], HTMLArcgisChartsPieChartElement>) => void;
    /**
     * Event triggered once the chart series color have been assigned
     * @type {EventEmitter<PieSlicesSymbols>}
     * @event
     * Node: Not supported for scatter-plot and gauge.
     */
    onArcgisSeriesColorChange?: (event: ArcgisChartsCustomEvent<PieSlicesSymbols, HTMLArcgisChartsPieChartElement>) => void;
}
export declare const PieChart: React.MemoExoticComponent<React.ForwardRefExoticComponent<PieChartProps & React.RefAttributes<UnprivilegedChart>>>;
