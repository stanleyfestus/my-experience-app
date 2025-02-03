import { type ImmutableObject, type FeatureLayerQueryParams } from 'jimu-core'
import { type WebChartOrderOptions } from '../../../../config'
import { type ChartTypes } from 'jimu-ui/advanced/chart'
import { isSerialSeries } from '../../../../utils/default'

const getStatisticFromQuery = (query: ImmutableObject<FeatureLayerQueryParams>, outStatisticFieldName: string) => {
  const statistic = query.outStatistics?.find((outStatistic) => outStatistic.outStatisticFieldName === outStatisticFieldName)
  return statistic
}

export const normalizeOrderOptions = (type: ChartTypes, input: ImmutableObject<WebChartOrderOptions>, query: ImmutableObject<FeatureLayerQueryParams>, idField: string) => {
  let orderOptions = input
  const useSplitBy = !!query.where
  const orderByField = input?.orderByFields?.[0]
  if (!isSerialSeries(type) || useSplitBy || !orderByField || !idField) return orderOptions
  const [orderField, orderBy] = orderByField.split(' ')
  const statistic = getStatisticFromQuery(query, orderField)
  const categoryField = query?.groupByFieldsForStatistics?.[0]
  if (categoryField && statistic?.onStatisticField === idField && statistic?.statisticType !== 'count') {
    orderOptions = orderOptions.set('orderByFields', [`${categoryField} ${orderBy}`]).set('data', {
      orderType: 'arcgis-charts-category',
      preferLabel: false,
      orderBy: 'ASC'
    })
  }
  return orderOptions
}
