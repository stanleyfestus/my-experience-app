import { React } from 'jimu-core';
import { type Components, type WebChartHistogramDataItem } from 'arcgis-charts-components';
import { type UnprivilegedChart, type ChartComponentEventCallbacks } from '../utils';
export interface HistogramProps extends Partial<Components.ArcgisChartsHistogram>, ChartComponentEventCallbacks<HTMLArcgisChartsHistogramElement, WebChartHistogramDataItem> {
    /**
     * Defines the class names added to the component.
     */
    className?: string;
}
export declare const Histogram: React.MemoExoticComponent<React.ForwardRefExoticComponent<HistogramProps & React.RefAttributes<UnprivilegedChart>>>;
