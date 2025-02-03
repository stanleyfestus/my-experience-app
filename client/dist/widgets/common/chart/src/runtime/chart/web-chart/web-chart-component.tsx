import {
  React,
  hooks,
  dataSourceUtils,
  type FeatureLayerDataSource,
  type ImmutableObject,
  type UseDataSource,
  type QueriableDataSource,
  type FeatureLayerQueryParams,
  type WidgetInitDragCallback,
  appActions,
  getAppStore
} from 'jimu-core'
import { type ChartElementLimit, type UnprivilegedChart, type WebMapWebChart, getSeriesType, type WebChartDataFilters, type SupportedLayer } from 'jimu-ui/advanced/chart'
import { useChartRuntimeDispatch, useChartRuntimeState } from '../../state'
import { useSelection, normalizeSeries, getMinSafeValue, getChartLimits, getDataItemsWithMixedValue, getDataItemsFromChartPayloadData, createRecordsFromChartData, normalizeAxes, getSeriesConfigColor, normalizeOrderOptions } from './utils'
import { type ChartComponentOptions, type IWebChart } from '../../../config'
import { ChartComponents } from '../components'
import { GaugeMaxValueField, GaugeMinValueField, WebChartCurrentVersion } from '../../../constants'
import { useDataSourceFeatureLayer } from '../../../utils/common'
import { colorUtils } from 'jimu-theme'
interface WebChartComponentProps {
  className?: string
  widgetId: string
  webChart: ImmutableObject<IWebChart>
  options?: ChartComponentOptions
  useDataSource?: ImmutableObject<UseDataSource>
  chartLimits?: Partial<ChartElementLimit>
  onInitDragHandler: WidgetInitDragCallback
  onLayerStatusChange?: (status: 'loading' | 'loaded') => void
}

const background = [0, 0, 0, 0] as any

function WebChartComponent (props: WebChartComponentProps): React.ReactElement {
  const {
    className,
    widgetId,
    webChart: propWebChart,
    useDataSource,
    chartLimits: defaultChartLimit,
    options,
    onInitDragHandler,
    onLayerStatusChange
  } = props

  const chartRef = React.useRef<UnprivilegedChart>(null)
  const type = getSeriesType(propWebChart?.series as any)
  const colorMatchAllowed = propWebChart.colorMatch && (propWebChart?.series?.length === 1 || !!propWebChart?.series?.[0]?.query?.where)

  const seriesColorRef = hooks.useLatest(getSeriesConfigColor(propWebChart?.series))
  const id = widgetId + '-' + (propWebChart?.id ?? 'chart')
  const dispatch = useChartRuntimeDispatch()
  const { outputDataSource, dataSource, queryVersion, records } = useChartRuntimeState()
  const dataSourceId = useDataSource?.dataSourceId
  const idField = dataSource?.getIdField()
  const layer = useDataSourceFeatureLayer<SupportedLayer>(dataSourceId)
  const onLayerStatusChangeRef = hooks.useLatest(onLayerStatusChange)
  const recordsRef = hooks.useLatest(records)

  const minimumRef = React.useRef<number>()
  const maximumRef = React.useRef<number>()

  const layerLoadedRef = React.useRef(false)
  React.useEffect(() => {
    if (!layerLoadedRef.current) {
      onLayerStatusChangeRef.current?.(layer ? 'loaded' : 'loading')
    }
    layerLoadedRef.current = !!layer
  }, [layer, onLayerStatusChangeRef])

  const queryParams: FeatureLayerQueryParams = React.useMemo(() => {
    const queryParams = (dataSource as QueriableDataSource)?.getCurrentQueryParams() ?? {}
    const pageSize = (dataSource as QueriableDataSource)?.getMaxRecordCount()
    queryParams.pageSize = pageSize
    return queryParams
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource, queryVersion])

  const timeZone = React.useMemo(() => {
    let timeZone = (dataSource as FeatureLayerDataSource)?.getTimezone()
    if (timeZone) {
      timeZone = dataSourceUtils.getTimezoneAPIFromRuntime(timeZone)
    }
    return timeZone
  }, [dataSource])

  const { where, geometry, gdbVersion, time, distance, units, pageSize } = queryParams

  const num = getMinSafeValue(pageSize, propWebChart.dataSource?.query?.pageSize)
  const chartLimits = React.useMemo(() => getChartLimits(propWebChart?.series, defaultChartLimit, num), [defaultChartLimit, num, propWebChart?.series])

  const webMapWebChart = React.useMemo(() => {
    let query = propWebChart.dataSource?.query
    if (query) {
      query = query.set('pageSize', num)
    }
    const type = getSeriesType(propWebChart.series as any)
    const orderOptions = normalizeOrderOptions(type, propWebChart.orderOptions, query, idField)
    const series = normalizeSeries(propWebChart.series, query, idField)
    const axes = normalizeAxes(propWebChart.series, propWebChart.axes, query)
    return propWebChart
      .set('version', WebChartCurrentVersion)
      .without('dataSource')
      .set('series', series)
      .set('axes', axes)
      .set('id', id)
      .set('background', background)
      .set('orderOptions', orderOptions) as unknown as ImmutableObject<WebMapWebChart>
  }, [id, propWebChart, num, idField])

  const runtimeDataFilters = React.useMemo(() => {
    const runtimeDataFilters: WebChartDataFilters = {}
    if (where) {
      runtimeDataFilters.where = where
    }
    if (geometry) {
      runtimeDataFilters.geometry = geometry as any
      if (distance && units) {
        runtimeDataFilters.distance = distance
        runtimeDataFilters.units = units as any
      }
    }
    if (time) {
      runtimeDataFilters.timeExtent = time as [number, number]
    }
    if (gdbVersion) {
      runtimeDataFilters.gdbVersion = gdbVersion
    }
    return Object.keys(runtimeDataFilters).length ? runtimeDataFilters : undefined
  }, [where, geometry, distance, units, time, gdbVersion])

  hooks.useEffectOnce(() => {
    onInitDragHandler?.(null, null, () => {
      if (!chartRef.current) return
      chartRef.current.refresh(false, false)
    })
  })

  const handleCreated = React.useCallback(
    (chart: UnprivilegedChart) => {
      chartRef.current = chart
      dispatch({ type: 'SET_CHART', value: chart })
    },
    [dispatch]
  )

  const handleDataProcessComplete = hooks.useEventCallback((e) => {
    const dataItems = getDataItemsFromChartPayloadData(type, e.detail)
    const records = createRecordsFromChartData(dataItems, outputDataSource)
    minimumRef.current = undefined
    maximumRef.current = undefined
    dispatch({ type: 'SET_RECORDS', value: records })
    dispatch({ type: 'SET_RENDER_STATE', value: 'success' })
  })

  const handleAxesMinMaxChange = hooks.useEventCallback((e) => {
    if (type !== 'gaugeSeries' || !recordsRef.current || !e.detail[0]) return

    const { minimum, maximum } = e.detail[0]
    if (minimum === minimumRef.current && maximum === maximumRef.current) return
    minimumRef.current = minimum
    maximumRef.current = maximum

    const mixedValue = { [GaugeMinValueField]: minimum, [GaugeMaxValueField]: maximum }
    let dataItems = recordsRef.current.map(record => record.getData())
    dataItems = getDataItemsWithMixedValue(dataItems, mixedValue)
    const records = createRecordsFromChartData(dataItems, outputDataSource)
    dispatch({ type: 'SET_RECORDS', value: records })
  })

  const handleDataProcessError = hooks.useEventCallback((e) => {
    dispatch({ type: 'SET_RECORDS', value: undefined })
    dispatch({ type: 'SET_RENDER_STATE', value: 'error' })
  })

  hooks.useUpdateEffect(() => {
    if (!chartRef.current || !layer) return
    chartRef.current.refresh(false, false)
  }, [layer, gdbVersion, time])

  const [selectionData, handleSelectionChange] = useSelection(
    widgetId,
    outputDataSource,
    propWebChart.series
  )

  const handleChartsSeriesColorChange = React.useCallback((evt) => {
    // Pass "whether color match is applied" result to the settings page in order to display a warning
    if (window.jimuConfig.isInBuilder) {
      if (colorMatchAllowed) {
        const data = evt.detail.data
        const seriesColor = seriesColorRef.current?.[0]?.toLowerCase()
        let colorMatchingApplied = false
        if (type === 'barSeries') {
          const symbolColor = data?.get(0)?.color
          colorMatchingApplied = symbolColor === undefined ||
          colorUtils.convertJsAPISymbolColorToStringColor(symbolColor)?.toLowerCase() !== seriesColor
        } else if (type === 'lineSeries') {
          const symbolColor = data?.get(0)?.lineSymbol?.color
          colorMatchingApplied = symbolColor === undefined ||
          colorUtils.convertJsAPISymbolColorToStringColor(symbolColor)?.toLowerCase() !== seriesColor
        } else if (type === 'pieSeries') {
          const symbolSlicesColor: string[] = data?.slices.map((slice) => colorUtils.convertJsAPISymbolColorToStringColor(slice.fillSymbol.color).toLowerCase())
          colorMatchingApplied = seriesColorRef.current?.some((seriesColor, index) => seriesColor.toLowerCase() !== symbolSlicesColor[index])
        } else if (type === 'scatterSeries') {
          const symbolColor = data?.get(0)?.color
          colorMatchingApplied = symbolColor === undefined ||
          colorUtils.convertJsAPISymbolColorToStringColor(symbolColor)?.toLowerCase() !== seriesColor
        } else if (type === 'histogramSeries') {
          const symbolColor = data?.get(0)?.color
          colorMatchingApplied = symbolColor === undefined ||
          colorUtils.convertJsAPISymbolColorToStringColor(symbolColor)?.toLowerCase() !== seriesColor
        }
        getAppStore().dispatch(appActions.widgetStatePropChange(widgetId, 'colorMatchingApplied', colorMatchingApplied))
      } else {
        getAppStore().dispatch(appActions.widgetStatePropChange(widgetId, 'colorMatchingApplied', undefined))
      }
    }
  }, [widgetId, type, colorMatchAllowed, seriesColorRef])

  return (
    <>
      {layer && <ChartComponents
        {...options}
        ref={handleCreated}
        timeZone={timeZone}
        className={className}
        config={webMapWebChart}
        runtimeDataFilters={runtimeDataFilters}
        layer={layer}
        chartLimits={chartLimits}
        selectionData={selectionData}
        onArcgisSelectionComplete={handleSelectionChange}
        onArcgisDataProcessComplete={handleDataProcessComplete}
        onArcgisDataProcessError={handleDataProcessError}
        onArcgisAxesMinMaxChange={handleAxesMinMaxChange}
        onArcgisSeriesColorChange={handleChartsSeriesColorChange}
      />}
    </>
  )
}

export default WebChartComponent
