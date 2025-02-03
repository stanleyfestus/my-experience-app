import { React } from 'jimu-core';
import { type Components, type WebChartScatterPlotDataItem } from 'arcgis-charts-components';
import { type UnprivilegedChart, type ChartComponentEventCallbacks } from '../utils';
export interface ScatterPlotProps extends Partial<Components.ArcgisChartsScatterPlot>, ChartComponentEventCallbacks<HTMLArcgisChartsScatterPlotElement, WebChartScatterPlotDataItem> {
    /**
     * Defines the class names added to the component.
     */
    className?: string;
}
export declare const ScatterPlot: React.MemoExoticComponent<React.ForwardRefExoticComponent<ScatterPlotProps & React.RefAttributes<UnprivilegedChart>>>;
