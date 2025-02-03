import { type IMFeatureLayerQueryParams, type ImmutableObject } from 'jimu-core'
import { type NumberFormatOptions, type DateTimeFormatOptions, type CategoryFormatOptions } from 'jimu-ui/advanced/chart'
import { type WebChartOrderOptions, type ChartDataSource } from '../../../../../../config'

export interface SeriesRelatedProps {
  query?: IMFeatureLayerQueryParams
  orderOptions?: WebChartOrderOptions
  chartDataSource: ImmutableObject<ChartDataSource>
  colorMatch?: boolean
  valueFormat?: NumberFormatOptions | DateTimeFormatOptions | CategoryFormatOptions
}
