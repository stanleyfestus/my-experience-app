import { type FeatureLayerQueryParams, type ImmutableArray, type ImmutableObject } from 'jimu-core'
import { getSeriesType, getSplitByValue } from 'jimu-ui/advanced/chart'
import { CategoryType, type WebChartSeries } from '../../../../config'
import { getSplitOutStatisticName, getCategoryType, whetherUseIdFieldForNonCount } from '../../../../utils/common'
import { isSerialSeries } from '../../../../utils/default'

const getSingleQueryForByGroup = (serie: ImmutableObject<WebChartSeries>, queries: ImmutableObject<FeatureLayerQueryParams>): ImmutableObject<WebChartSeries> => {
  const y = (serie as any).y
  const outStatistics = queries.outStatistics.filter((s) => s.outStatisticFieldName === y)
  const { groupByFieldsForStatistics, pageSize } = queries
  const query = { groupByFieldsForStatistics, outStatistics, num: pageSize }
  return serie.set('query', query)
}

const getSingleQueryForByField = (serie: ImmutableObject<WebChartSeries>, queries: ImmutableObject<FeatureLayerQueryParams>): ImmutableObject<WebChartSeries> => {
  const { outStatistics } = queries
  const query = { outStatistics }
  return serie.set('query', query)
}

const getSingleQueryForGauge = (serie: ImmutableObject<WebChartSeries>, queries: ImmutableObject<FeatureLayerQueryParams>): ImmutableObject<WebChartSeries> => {
  const { outStatistics, pageSize } = queries
  const query = { outStatistics: [outStatistics[0]], num: pageSize }
  return serie.set('query', query)
}

const getSingleQueryForNoAggregation = (serie: ImmutableObject<WebChartSeries>, queries: ImmutableObject<FeatureLayerQueryParams>): ImmutableObject<WebChartSeries> => {
  const { pageSize, groupByFieldsForStatistics = [], outFields: _outFields = [] } = queries
  const outFields = groupByFieldsForStatistics.concat(_outFields)
  const query = { outFields, num: pageSize }
  return serie.set('query', query)
}

const getSingleQueryForSplitBy = (serie: ImmutableObject<WebChartSeries>, queries: ImmutableObject<FeatureLayerQueryParams>): ImmutableObject<WebChartSeries> => {
  const where = serie.query.where
  const splitByValue = getSplitByValue({ where, normalize: true })
  if (queries.outFields?.length) { //no aggregation
    const { pageSize } = queries
    const query = { where, num: pageSize }
    return serie.set('query', query)
  } else {
    const onStatisticField = queries.outStatistics[0].onStatisticField
    const statisticType = queries.outStatistics[0].statisticType
    const outStatisticFieldName = getSplitOutStatisticName(onStatisticField, statisticType, splitByValue)
    const outStatistics = [{
      ...queries.outStatistics[0],
      outStatisticFieldName
    }]
    const { groupByFieldsForStatistics, pageSize } = queries
    const query = { where, groupByFieldsForStatistics, outStatistics, num: pageSize }
    return serie.set('query', query).set('y', outStatisticFieldName)
  }
}

export const filterOutSeriesUseIdFieldForNonCount = (propSeries: ImmutableArray<WebChartSeries>, idField: string) => {
  const series = propSeries?.filter((serie) => {
    const outStatistics = serie.query.outStatistics
    const statisticsType = outStatistics?.[0].statisticType
    if (statisticsType === 'count') return true
    const usedFields = outStatistics?.filter((outStatistic) => !!outStatistic).map((outStatistic) => outStatistic.onStatisticField)
    return !usedFields.includes(idField)
  })
  return series
}

const normalizeSeriesWithQuery = (series: ImmutableArray<WebChartSeries>, query: ImmutableObject<FeatureLayerQueryParams>) => {
  let callback = null
  const type = getSeriesType(series as any)
  const useSplitBy = !!query.where
  if (useSplitBy) {
    callback = getSingleQueryForSplitBy
  } else {
    if (isSerialSeries(type) || type === 'pieSeries') {
      const outFields = query?.outFields
      if (outFields?.length) { //no aggregation
        callback = getSingleQueryForNoAggregation
      } else {
        const categoryType = getCategoryType(query)
        if (categoryType === CategoryType.ByGroup) {
          callback = getSingleQueryForByGroup
        } else if (categoryType === CategoryType.ByField) {
          callback = getSingleQueryForByField
        }
      }
    } else if (type === 'gaugeSeries') {
      callback = getSingleQueryForGauge
    }
  }
  if (callback) {
    return series?.map((serie) => callback(serie, query))
  }
  return series
}

export const normalizeSeries = (input: ImmutableArray<WebChartSeries>, query: ImmutableObject<FeatureLayerQueryParams>, idField: string) => {
  const type = getSeriesType(input as any)
  const useSplitBy = !!query.where
  let series = normalizeSeriesWithQuery(input, query)
  const useIdFieldForNonCount = (isSerialSeries(type) && !useSplitBy) ? whetherUseIdFieldForNonCount(query, idField) : false
  if (useIdFieldForNonCount) {
    series = filterOutSeriesUseIdFieldForNonCount(series, idField)
  }
  return series
}
