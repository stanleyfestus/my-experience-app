import { React } from 'jimu-core';
import { type WebChartGenericDataItem, type Components, type NoRenderPropChangePayload } from 'arcgis-charts-components';
import { type UnprivilegedChart, type ChartComponentEventCallbacks, type ArcgisChartsCustomEvent } from '../utils';
export interface BarChartProps extends Partial<Components.ArcgisChartsBarChart>, ChartComponentEventCallbacks<HTMLArcgisChartsBarChartElement, WebChartGenericDataItem> {
    /**
     * Defines the class names added to the component.
     */
    className?: string;
    /**
     * Event triggered when a no-render prop is changed
     * @type {EventEmitter<NoRenderPropChangePayload>}
     * @event
     */
    onArcgisNoRenderPropChange?: (event: ArcgisChartsCustomEvent<NoRenderPropChangePayload, HTMLArcgisChartsBarChartElement>) => void;
}
export declare const BarChart: React.MemoExoticComponent<React.ForwardRefExoticComponent<BarChartProps & React.RefAttributes<UnprivilegedChart>>>;
