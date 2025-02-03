import { type ImmutableObject, type ImmutableArray } from 'jimu-core'
import { type WebChartSeries } from '../../../../config'
import { isSerialSeries } from '../../../../utils/default'
import { getSeriesType, type ChartTypes, LimitBehavior, type ChartElementLimit, type WebChartBarChartSeries, type WebChartLineChartSeries, type WebChartPieChartSeries, type WebChartScatterPlotSeries, type WebChartHistogramSeries } from 'jimu-ui/advanced/chart'

/**
 * Convert the matching coded label into coded value
 */
export const matchCodedValueLabel = (data: { [key: string]: any }) => {
  const domainFieldName = data.arcgis_charts_type_domain_field_name
  if (typeof domainFieldName !== 'string') return data
  const domainFieldValue = data.arcgis_charts_type_domain_id_value
  if (data[domainFieldName] && domainFieldValue) {
    data.arcgis_charts_type_domain_id_label = data[domainFieldName]
    data[domainFieldName] = domainFieldValue
  }
  return data
}

export const createRecordsFromChartData = (data = [], dataSource) => {
  const idField = dataSource.getIdField()
  const records = data?.map((item, i) => {
    const feature = { attributes: null }
    let data = { ...item }
    data[idField] = i
    data = matchCodedValueLabel(data)
    feature.attributes = data
    return dataSource.buildRecord(feature)
  })

  return records
}

export const getDataItemsFromChartPayloadData = (type: ChartTypes, detail) => {
  let dataItems = []
  if (isSerialSeries(type) || type === 'pieSeries' || type === 'scatterSeries' || type === 'gaugeSeries') {
    dataItems = detail?.dataItems
  } else if (type === 'histogramSeries') {
    dataItems = detail?.bins
  }
  return dataItems
}

export const getMinSafeValue = (v1, v2) => {
  if (v1 == null && v2 == null) return
  if (v1 == null && v2 != null) return v2
  if (v1 != null && v2 == null) return v1
  return Math.min(v1, v2)
}

export const getChartLimits = (series: any, defaultChartLimits: Partial<ChartElementLimit>, num?: number) => {
  const chartLimits: Partial<ChartElementLimit> = {}
  const seriesLength = series?.length
  if (!seriesLength) return defaultChartLimits
  const seriesType = getSeriesType(series)

  let behaviorAfterLimit: LimitBehavior = LimitBehavior.Reject

  if (seriesType === 'scatterSeries') {
    chartLimits.maxScatterPointsBeforeAggregation = defaultChartLimits.maxScatterPointsBeforeAggregation
    chartLimits.maxScatterPointsAfterAggregation = defaultChartLimits.maxScatterPointsAfterAggregation
  }

  let limitKey = ''
  let limitNum = -1

  if (seriesType === 'barSeries') {
    chartLimits.maxBarChartSeriesCount = defaultChartLimits.maxBarChartSeriesCount
    if (series.length === 1) {
      limitKey = 'maxBarUniqueSeriesCountTotal'
    } else if (series.length === 2) {
      chartLimits.maxBarTwoSeriesCountTotal = defaultChartLimits.maxBarTwoSeriesCountTotal
      limitKey = 'maxBarTwoSeriesCountPerSeries'
    } else if (series.length > 2) {
      chartLimits.maxBarThreePlusSeriesCountTotal = defaultChartLimits.maxBarThreePlusSeriesCountTotal
      limitKey = 'maxBarThreePlusSeriesCountPerSeries'
    }
  } else if (seriesType === 'lineSeries') {
    chartLimits.maxLineChartSeriesCount = defaultChartLimits.maxLineChartSeriesCount
    if (series.length === 1) {
      limitKey = 'maxLineUniqueSeriesCountTotal'
    } else if (series.length === 2) {
      chartLimits.maxLineTwoSeriesCountTotal = defaultChartLimits.maxLineTwoSeriesCountTotal
      limitKey = 'maxLineTwoSeriesCountPerSeries'
    } else if (series.length > 2) {
      chartLimits.maxLineThreePlusSeriesCountTotal = defaultChartLimits.maxLineThreePlusSeriesCountTotal
      limitKey = 'maxLineThreePlusSeriesCountPerSeries'
    }
  } else if (seriesType === 'pieSeries') {
    limitKey = 'maxPieChartSliceCountTotal'
  }
  const defaultLimitNum = defaultChartLimits[limitKey]
  if (num && num <= defaultLimitNum) {
    limitNum = num
    behaviorAfterLimit = LimitBehavior.RenderUpToTheLimit
  } else {
    limitNum = defaultLimitNum
  }
  if (limitKey) {
    chartLimits[limitKey] = limitNum
  }
  chartLimits.behaviorAfterLimit = behaviorAfterLimit
  return chartLimits
}

export const getDataItemsWithMixedValue = (dataItems, mixedValue: { [key: string]: any }) => {
  if (!mixedValue || !dataItems) return dataItems
  return dataItems.map((item) => {
    return { ...item, ...mixedValue }
  })
}

export const getSeriesConfigColor = (series: ImmutableArray<WebChartSeries>): string[] => {
  const type = getSeriesType(series as any)
  const seriesReference = series?.[0]
  if (!seriesReference) return
  let seriesColor = []
  if (type === 'barSeries') {
    seriesColor = [(seriesReference as ImmutableObject<WebChartBarChartSeries>).fillSymbol.color]
  } else if (type === 'lineSeries') {
    seriesColor = [(seriesReference as ImmutableObject<WebChartLineChartSeries>).lineSymbol.color]
  } else if (type === 'pieSeries') {
    const slices = (seriesReference as ImmutableObject<WebChartPieChartSeries>).slices
    if (slices?.length) {
      seriesColor = (slices.asMutable({ deep: true })).map((slice) => slice.fillSymbol.color)
    } else {
      seriesColor = [(seriesReference as ImmutableObject<WebChartPieChartSeries>).fillSymbol.color]
    }
  } else if (type === 'scatterSeries') {
    seriesColor = [(seriesReference as ImmutableObject<WebChartScatterPlotSeries>).markerSymbol.color]
  } else if (type === 'histogramSeries') {
    seriesColor = [(seriesReference as ImmutableObject<WebChartHistogramSeries>).fillSymbol.color]
  }

  return seriesColor
}

export { useChartRenderState } from './use-render-state'
export { useSelection } from './use-selection'
export { normalizeAxes } from './normalize-axes'
export { normalizeSeries } from './normalize-series'
export { normalizeOrderOptions } from './normalize-order-options'
