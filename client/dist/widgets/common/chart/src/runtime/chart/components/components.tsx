import { React, type ImmutableObject, hooks } from 'jimu-core'
import {
  Gauge,
  BarChart,
  LineChart,
  PieChart,
  Histogram,
  ScatterPlot,
  getSeriesType,
  type UnprivilegedChart,
  type WebChartDataFilters,
  type WebMapWebChart,
  type PreRenderCallback,
  type WebMapWebGaugeChart,
  type PieChartLegendValueLabelFormatCallback,
  type ChartComponentEventCallbacks,
  type ArcgisChartsCustomEvent,
  type NoRenderPropChangePayload,
  type SelectionData,
  type ChartElementLimit,
  type SupportedLayer
} from 'jimu-ui/advanced/chart'

export interface ChartComponentsProps extends ChartComponentEventCallbacks<HTMLElement, any> {
  /**
   * Defines the class names added to the component.
   */
  className?: string
  /**
   * Used by `@arcgis/charts-components` package, both mutable and immutable are supported.
   */
  config: WebMapWebChart | ImmutableObject<WebMapWebChart> | WebMapWebGaugeChart | ImmutableObject<WebMapWebGaugeChart>
  /**
   * used to perform queries or client-side queries (if the view is provided)
   */
  layer?: SupportedLayer
  /**
   * Used to apply runtime filters to the chart's data while in Feature Layer mode.
   */
  runtimeDataFilters?: WebChartDataFilters
  /**
   * Used to customize the number maximum of bars allowed on the chart. The chart's behavior once that limit is reached can be adjusted through the `behaviorAfterLimit` nested property, to either reject the creation or update of the chart, or render the elements up to the given limits.
   * @type {ChartElementLimit}
   */
  chartLimits?: ChartElementLimit
  /**
   * Used to set a custom time zone for the chart.
   * @type {string}
   */
  timeZone?: string
  /**
   * A property representing the selection to apply on the chart.
   * The properties are considered in the following order:
   * - selectionData.selectionOIDs: an array of Object Ids (for Feature Layer) representing a selection to apply to the chart.
   * - selectionData.selectionItems: an array of data items representing a selection to apply to the chart.
   */
  selectionData?: SelectionData
  /**
   * Lifecycle function executed after the data has been processed and before the chart renders. Can be used to alter the config.series[0].slices property from instance.
   * Note: only valid for pie chart.
   */
  chartWillRender?: PreRenderCallback
  /**
   * Can be used to disable the default setting that uses debounce functions to handle the visibility of markers that are outside of the plotting area
   * when the min/max bound changes and/or when a zoom action is performed (via chart cursor or scrollbar), to increase performance.
   * This property will be set when the chart is created and cannot be updated after that. It's recommended that this property should only be set to true for small datasets.
   * @default false
   * Note: Only valid for `lineSeries` and `scatterSeries`.
   */
  ignoreSmoothRenderingLimit?: boolean
  /**
   * Can be used when creating or updating a chart compatible with time binning. If this option is `true`, the series properties
   * `timeIntervalUnits` and `timeIntervalSize` become optional and will be automatically set to values that fit the data set.
   * @default false
   * Note: Only valid for `lineSeries`.
   */
  setTimeBinningInfoWhenNotProvided?: boolean
  /**
   * A callback function used to format the legend value labels. If the returned string contains HTML tags they will be interpreted as such.
   * If provided, the formatter will be used if at least `WebChartPieChartLegend.displayNumericValue` or `WebChartPieChartLegend.displayPercentage` is true.
   * Note: Only valid for `pieSeries`.
   */
  legendValueLabelFormatter?: PieChartLegendValueLabelFormatCallback
  /**
   * Indicates if the selection indexes need to be computed whenever a selection is made on or passed to the chart.
   * @default true
   */
  returnSelectionIndexes?: boolean
  /**
   * Indicates if the object ids need to be computed whenever a selection is made on or passed to the chart. Only considered for a data source using a feature layer.
   * @default false
   */
  returnSelectionOIDs?: boolean
  /**
   * When `true`, the series is hidden in the legend if it doesn't have data (i.e. empty).
   * For eg. after applying a filter by attribute or geometry (as when using the filter by extent)
   * @default false
   */
  hideEmptySeries?: boolean
  /**
   * Event triggered when a no-render prop is changed
   * @event
   */
  onArcgisNoRenderPropChange?: (event: ArcgisChartsCustomEvent<NoRenderPropChangePayload, HTMLArcgisChartsBarChartElement | HTMLArcgisChartsLineChartElement>) => void
}

const defaultGlobalOptions = {
  autoDisposeChart: false,
  enableResponsiveFeatures: false,
  queueChartCreation: true,
  useAnimatedCharts: false,
  hideLicenceWatermark: true
}

export const ChartComponents = React.forwardRef(
  (
    props: ChartComponentsProps,
    ref: React.Ref<UnprivilegedChart>
  ): React.ReactElement => {
    const {
      config,
      returnSelectionIndexes = true,
      returnSelectionOIDs = false,
      chartWillRender,
      hideEmptySeries = false,
      ignoreSmoothRenderingLimit = false,
      setTimeBinningInfoWhenNotProvided = false,
      legendValueLabelFormatter,
      onArcgisNoRenderPropChange,
      onArcgisSeriesColorChange,
      ...others
    } = props

    const chartRef = React.useRef<UnprivilegedChart>(null)
    const handleRef = hooks.useForkRef(ref, chartRef)

    const seriesType = getSeriesType(props.config?.series as any)

    return (
      <>
        {seriesType === 'barSeries' && (
          <BarChart
            ref={handleRef}
            {...others}
            {...defaultGlobalOptions}
            config={config as WebMapWebChart}
            returnSelectionOIDs={returnSelectionOIDs}
            returnSelectionIndexes={returnSelectionIndexes}
            hideEmptySeries={hideEmptySeries}
            onArcgisSeriesColorChange={onArcgisSeriesColorChange}
            onArcgisNoRenderPropChange={onArcgisNoRenderPropChange} />
        )}
        {seriesType === 'lineSeries' && (
          <LineChart
            ref={handleRef}
            {...others}
            {...defaultGlobalOptions}
            config={config as WebMapWebChart}
            returnSelectionOIDs={returnSelectionOIDs}
            returnSelectionIndexes={returnSelectionIndexes}
            hideEmptySeries={hideEmptySeries}
            onArcgisSeriesColorChange={onArcgisSeriesColorChange}
            onArcgisNoRenderPropChange={onArcgisNoRenderPropChange}
            ignoreSmoothRenderingLimit={ignoreSmoothRenderingLimit}
            setTimeBinningInfoWhenNotProvided={setTimeBinningInfoWhenNotProvided}
          />
        )}
        {seriesType === 'pieSeries' && (
          <PieChart
            ref={handleRef}
            {...others}
            {...defaultGlobalOptions}
            config={config as WebMapWebChart}
            chartWillRender={chartWillRender}
            returnSelectionOIDs={returnSelectionOIDs}
            returnSelectionIndexes={returnSelectionIndexes}
            legendValueLabelFormatter={legendValueLabelFormatter}
            onArcgisSeriesColorChange={onArcgisSeriesColorChange as any}
          />
        )}
        {seriesType === 'scatterSeries' && (
          <ScatterPlot
            ref={handleRef}
            {...others}
            {...defaultGlobalOptions}
            config={config as WebMapWebChart}
            returnSelectionOIDs={returnSelectionOIDs}
            returnSelectionIndexes={returnSelectionIndexes}
            ignoreSmoothRenderingLimit={ignoreSmoothRenderingLimit}
            onArcgisSeriesColorChange={onArcgisSeriesColorChange}
          />
        )}
        {seriesType === 'histogramSeries' && (
          <Histogram
            ref={handleRef}
            {...others}
            {...defaultGlobalOptions}
            config={config as WebMapWebChart}
            returnSelectionOIDs={returnSelectionOIDs}
            returnSelectionIndexes={returnSelectionIndexes}
            onArcgisSeriesColorChange={onArcgisSeriesColorChange}
          />
        )}
        {seriesType === 'gaugeSeries' && (
          <Gauge
            ref={handleRef}
            {...others}
            {...defaultGlobalOptions}
            config={config as WebMapWebGaugeChart}
          />
        )}
      </>
    )
  }
)
