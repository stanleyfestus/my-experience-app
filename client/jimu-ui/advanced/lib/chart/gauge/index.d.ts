import { React } from 'jimu-core';
import { type Components, type WebChartGenericDataItem } from 'arcgis-charts-components';
import { type UnprivilegedChart, type ChartComponentEventCallbacks } from '../utils';
export interface GaugeProps extends Partial<Components.ArcgisChartsGauge>, Omit<ChartComponentEventCallbacks<HTMLArcgisChartsGaugeElement, WebChartGenericDataItem>, 'onArcgisSeriesColorChange'> {
    /**
     * Defines the class names added to the component.
     */
    className?: string;
}
export declare const Gauge: React.MemoExoticComponent<React.ForwardRefExoticComponent<GaugeProps & React.RefAttributes<UnprivilegedChart>>>;
