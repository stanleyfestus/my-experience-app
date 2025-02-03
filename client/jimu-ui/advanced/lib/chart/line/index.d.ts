import { React } from 'jimu-core';
import { type NoRenderPropChangePayload, type WebChartGenericDataItem, type Components } from 'arcgis-charts-components';
import { type UnprivilegedChart, type ChartComponentEventCallbacks, type ArcgisChartsCustomEvent } from '../utils';
export interface LineChartProps extends Partial<Components.ArcgisChartsLineChart>, ChartComponentEventCallbacks<HTMLArcgisChartsLineChartElement, WebChartGenericDataItem> {
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
export declare const LineChart: React.MemoExoticComponent<React.ForwardRefExoticComponent<LineChartProps & React.RefAttributes<UnprivilegedChart>>>;
