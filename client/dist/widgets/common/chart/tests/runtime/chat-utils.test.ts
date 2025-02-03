import { Immutable, type FeatureLayerQueryParams, type ImmutableObject } from 'jimu-core'
import { getChartLimits, createRecordsFromChartData, matchCodedValueLabel, normalizeOrderOptions } from '../../src/runtime/chart/web-chart/utils'
import { ChartLimits } from '../../src/constants'
import { filterOutSeriesUseIdFieldForNonCount } from '../../src/runtime/chart/web-chart/utils/normalize-series'
import { type WebChartOrderOptions } from '../../src/config'

jest.mock('@arcgis/charts-components', () => jest.fn())
jest.mock('@arcgis/charts-components-react', () => jest.fn())
describe('src/runtime/chart/utils/index.ts', () => {
  describe('getChartLimits', () => {
    it('should work well when no `num`', () => {
      let series = [{
        type: 'barSeries'
      }]
      let res = getChartLimits(series, ChartLimits)
      expect(res).toEqual({
        behaviorAfterLimit: 'reject',
        maxBarChartSeriesCount: 100,
        maxBarUniqueSeriesCountTotal: 10000
      })

      series = [{
        type: 'barSeries'
      }, {
        type: 'barSeries'
      }]
      res = getChartLimits(series, ChartLimits)
      expect(res).toEqual({
        behaviorAfterLimit: 'reject',
        maxBarChartSeriesCount: 100,
        maxBarTwoSeriesCountPerSeries: 1000,
        maxBarTwoSeriesCountTotal: 2000
      })

      series = [{
        type: 'barSeries'
      }, {
        type: 'barSeries'
      }, {
        type: 'barSeries'
      }]
      res = getChartLimits(series, ChartLimits)
      expect(res).toEqual({
        behaviorAfterLimit: 'reject',
        maxBarChartSeriesCount: 100,
        maxBarThreePlusSeriesCountPerSeries: 100,
        maxBarThreePlusSeriesCountTotal: 2000
      })

      series = [{
        type: 'lineSeries'
      }]
      res = getChartLimits(series, ChartLimits)
      expect(res).toEqual({
        behaviorAfterLimit: 'reject',
        maxLineChartSeriesCount: 100,
        maxLineUniqueSeriesCountTotal: 10000
      })

      series = [{
        type: 'lineSeries'
      }, {
        type: 'lineSeries'
      }]
      res = getChartLimits(series, ChartLimits)
      expect(res).toEqual({
        behaviorAfterLimit: 'reject',
        maxLineChartSeriesCount: 100,
        maxLineTwoSeriesCountPerSeries: 1000,
        maxLineTwoSeriesCountTotal: 2000
      })

      series = [{
        type: 'lineSeries'
      }, {
        type: 'lineSeries'
      }, {
        type: 'lineSeries'
      }]
      res = getChartLimits(series, ChartLimits)
      expect(res).toEqual({
        behaviorAfterLimit: 'reject',
        maxLineChartSeriesCount: 100,
        maxLineThreePlusSeriesCountPerSeries: 100,
        maxLineThreePlusSeriesCountTotal: 2000
      })

      series = [{
        type: 'pieSeries'
      }]
      res = getChartLimits(series, ChartLimits)
      expect(res).toEqual({
        behaviorAfterLimit: 'reject',
        maxPieChartSliceCountTotal: 300
      })
    })

    it('should work well when `num` less than default limit', () => {
      let series = [{
        type: 'barSeries'
      }]
      let res = getChartLimits(series, ChartLimits, 10)
      expect(res).toEqual({
        behaviorAfterLimit: 'renderUpToTheLimit',
        maxBarChartSeriesCount: 100,
        maxBarUniqueSeriesCountTotal: 10
      })

      series = [{
        type: 'barSeries'
      }, {
        type: 'barSeries'
      }]
      res = getChartLimits(series, ChartLimits, 10)
      expect(res).toEqual({
        behaviorAfterLimit: 'renderUpToTheLimit',
        maxBarChartSeriesCount: 100,
        maxBarTwoSeriesCountPerSeries: 10,
        maxBarTwoSeriesCountTotal: 2000
      })

      series = [{
        type: 'barSeries'
      }, {
        type: 'barSeries'
      }, {
        type: 'barSeries'
      }]
      res = getChartLimits(series, ChartLimits, 10)
      expect(res).toEqual({
        behaviorAfterLimit: 'renderUpToTheLimit',
        maxBarChartSeriesCount: 100,
        maxBarThreePlusSeriesCountPerSeries: 10,
        maxBarThreePlusSeriesCountTotal: 2000
      })

      series = [{
        type: 'lineSeries'
      }]
      res = getChartLimits(series, ChartLimits, 100)
      expect(res).toEqual({
        behaviorAfterLimit: 'renderUpToTheLimit',
        maxLineChartSeriesCount: 100,
        maxLineUniqueSeriesCountTotal: 100
      })

      series = [{
        type: 'lineSeries'
      }, {
        type: 'lineSeries'
      }]
      res = getChartLimits(series, ChartLimits, 100)
      expect(res).toEqual({
        behaviorAfterLimit: 'renderUpToTheLimit',
        maxLineChartSeriesCount: 100,
        maxLineTwoSeriesCountPerSeries: 100,
        maxLineTwoSeriesCountTotal: 2000
      })

      series = [{
        type: 'lineSeries'
      }, {
        type: 'lineSeries'
      }, {
        type: 'lineSeries'
      }]
      res = getChartLimits(series, ChartLimits, 100)
      expect(res).toEqual({
        behaviorAfterLimit: 'renderUpToTheLimit',
        maxLineChartSeriesCount: 100,
        maxLineThreePlusSeriesCountPerSeries: 100,
        maxLineThreePlusSeriesCountTotal: 2000
      })

      series = [{
        type: 'pieSeries'
      }]
      res = getChartLimits(series, ChartLimits, 100)
      expect(res).toEqual({
        behaviorAfterLimit: 'renderUpToTheLimit',
        maxPieChartSliceCountTotal: 100
      })
    })

    it('should work well when `num` more than default limit', () => {
      let series = [{
        type: 'barSeries'
      }]
      let res = getChartLimits(series, ChartLimits, 11000)
      expect(res).toEqual({
        behaviorAfterLimit: 'reject',
        maxBarChartSeriesCount: 100,
        maxBarUniqueSeriesCountTotal: 10000
      })

      series = [{
        type: 'barSeries'
      }, {
        type: 'barSeries'
      }]
      res = getChartLimits(series, ChartLimits, 1100)
      expect(res).toEqual({
        behaviorAfterLimit: 'reject',
        maxBarChartSeriesCount: 100,
        maxBarTwoSeriesCountPerSeries: 1000,
        maxBarTwoSeriesCountTotal: 2000
      })

      series = [{
        type: 'barSeries'
      }, {
        type: 'barSeries'
      }, {
        type: 'barSeries'
      }]
      res = getChartLimits(series, ChartLimits, 200)
      expect(res).toEqual({
        behaviorAfterLimit: 'reject',
        maxBarChartSeriesCount: 100,
        maxBarThreePlusSeriesCountPerSeries: 100,
        maxBarThreePlusSeriesCountTotal: 2000
      })

      series = [{
        type: 'lineSeries'
      }]
      res = getChartLimits(series, ChartLimits, 11000)
      expect(res).toEqual({
        behaviorAfterLimit: 'reject',
        maxLineChartSeriesCount: 100,
        maxLineUniqueSeriesCountTotal: 10000
      })

      series = [{
        type: 'lineSeries'
      }, {
        type: 'lineSeries'
      }]
      res = getChartLimits(series, ChartLimits, 5100)
      expect(res).toEqual({
        behaviorAfterLimit: 'reject',
        maxLineChartSeriesCount: 100,
        maxLineTwoSeriesCountPerSeries: 1000,
        maxLineTwoSeriesCountTotal: 2000
      })

      series = [{
        type: 'lineSeries'
      }, {
        type: 'lineSeries'
      }, {
        type: 'lineSeries'
      }]
      res = getChartLimits(series, ChartLimits, 3500)
      expect(res).toEqual({
        behaviorAfterLimit: 'reject',
        maxLineChartSeriesCount: 100,
        maxLineThreePlusSeriesCountPerSeries: 100,
        maxLineThreePlusSeriesCountTotal: 2000
      })

      series = [{
        type: 'pieSeries'
      }]
      res = getChartLimits(series, ChartLimits, 330)
      expect(res).toEqual({
        behaviorAfterLimit: 'reject',
        maxPieChartSliceCountTotal: 300
      })
    })

    it('should work well for scatter-plot', () => {
      const series = [{
        type: 'scatterSeries'
      }]
      const res = getChartLimits(series, ChartLimits)
      expect(res).toEqual({
        behaviorAfterLimit: 'reject',
        maxScatterPointsBeforeAggregation: 10000,
        maxScatterPointsAfterAggregation: 10000
      })
    })
  })

  describe('matchCodedValueLabel', () => {
    it('matchCodedValueLabel', () => {
      let dataItem: { [key: string]: any } = {
        OBJECTID_count: 2,
        MISMATCH: 'matching fields one'
      }
      expect(matchCodedValueLabel(dataItem)).toEqual({
        OBJECTID_count: 2,
        MISMATCH: 'matching fields one'
      })
      dataItem = {
        OBJECTID_count: 2,
        MISMATCH: 'matching fields one',
        arcgis_charts_type_domain_field_name: 'MISMATCH',
        arcgis_charts_type_domain_id_value: 'one'
      }
      expect(matchCodedValueLabel(dataItem)).toEqual({
        OBJECTID_count: 2,
        MISMATCH: 'one',
        arcgis_charts_type_domain_field_name: 'MISMATCH',
        arcgis_charts_type_domain_id_value: 'one',
        arcgis_charts_type_domain_id_label: 'matching fields one'
      })
    })
  })

  describe('createRecordsFromChartData', () => {
    it('createRecordsFromChartData', () => {
      const dataSource = {
        getIdField: () => 'objectid',
        buildRecord: (feature) => feature.attributes
      }

      let dataItems: Array<{ [key: string]: any }> = [
        {
          OBJECTID_count: 2,
          MISMATCH: 'matching fields one'
        },
        {
          OBJECTID_count: 1,
          MISMATCH: 'matching fields three'
        },
        {
          OBJECTID_count: 1,
          MISMATCH: 'matching fields two'
        }
      ]

      expect(createRecordsFromChartData(dataItems, dataSource)).toEqual([
        {
          objectid: 0,
          OBJECTID_count: 2,
          MISMATCH: 'matching fields one'
        },
        {
          objectid: 1,
          OBJECTID_count: 1,
          MISMATCH: 'matching fields three'
        },
        {
          objectid: 2,
          OBJECTID_count: 1,
          MISMATCH: 'matching fields two'
        }
      ])

      dataItems = [
        {
          OBJECTID_count: 2,
          MISMATCH: 'matching fields one',
          arcgis_charts_type_domain_field_name: 'MISMATCH',
          arcgis_charts_type_domain_id_value: 'one'
        },
        {
          OBJECTID_count: 1,
          MISMATCH: 'matching fields three',
          arcgis_charts_type_domain_field_name: 'MISMATCH',
          arcgis_charts_type_domain_id_value: 'three'
        },
        {
          OBJECTID_count: 1,
          MISMATCH: 'matching fields two',
          arcgis_charts_type_domain_field_name: 'MISMATCH',
          arcgis_charts_type_domain_id_value: 'two'
        }
      ]
      expect(createRecordsFromChartData(dataItems, dataSource)).toEqual([
        {
          objectid: 0,
          OBJECTID_count: 2,
          MISMATCH: 'one',
          arcgis_charts_type_domain_field_name: 'MISMATCH',
          arcgis_charts_type_domain_id_value: 'one',
          arcgis_charts_type_domain_id_label: 'matching fields one'
        },
        {
          objectid: 1,
          OBJECTID_count: 1,
          MISMATCH: 'three',
          arcgis_charts_type_domain_field_name: 'MISMATCH',
          arcgis_charts_type_domain_id_value: 'three',
          arcgis_charts_type_domain_id_label: 'matching fields three'
        },
        {
          objectid: 2,
          OBJECTID_count: 1,
          MISMATCH: 'two',
          arcgis_charts_type_domain_field_name: 'MISMATCH',
          arcgis_charts_type_domain_id_value: 'two',
          arcgis_charts_type_domain_id_label: 'matching fields two'
        }
      ])
    })
  })

  describe('normalizeOrderOptions', () => {
    it('should work well with normal cases', () => {
      let input: ImmutableObject<WebChartOrderOptions> = Immutable({
        orderByFields: ['FID_sum ASC'],
        data: {
          orderType: 'arcgis-charts-y-value',
          preferLabel: false,
          orderBy: 'ASC'
        }
      })
      let query: ImmutableObject<FeatureLayerQueryParams> = Immutable({
        groupByFieldsForStatistics: ['Field0'],
        outStatistics: [{
          onStatisticField: 'Field1',
          statisticType: 'sum',
          outStatisticFieldName: 'Field1_sum'
        }, {
          onStatisticField: 'FID',
          statisticType: 'sum',
          outStatisticFieldName: 'FID_sum'
        }]
      })
      expect(normalizeOrderOptions('barSeries', input, query, 'FID')).toEqual({
        orderByFields: ['Field0 ASC'],
        data: {
          orderType: 'arcgis-charts-category',
          preferLabel: false,
          orderBy: 'ASC'
        }
      })

      input = Immutable({
        orderByFields: ['Field1_sum ASC'],
        data: {
          orderType: 'arcgis-charts-y-value',
          preferLabel: false,
          orderBy: 'ASC'
        }
      })
      query = Immutable({
        groupByFieldsForStatistics: ['Field0'],
        outStatistics: [{
          onStatisticField: 'Field1',
          statisticType: 'sum',
          outStatisticFieldName: 'Field1_sum'
        }, {
          onStatisticField: 'FID',
          statisticType: 'sum',
          outStatisticFieldName: 'FID_sum'
        }]
      })
      expect(normalizeOrderOptions('barSeries', input, query, 'FID')).toEqual({
        orderByFields: ['Field1_sum ASC'],
        data: {
          orderType: 'arcgis-charts-y-value',
          preferLabel: false,
          orderBy: 'ASC'
        }
      })

      input = Immutable({
        orderByFields: ['Field0 ASC'],
        data: {
          orderType: 'arcgis-charts-category',
          preferLabel: false,
          orderBy: 'ASC'
        }
      })
      query = Immutable({
        groupByFieldsForStatistics: ['Field0'],
        outStatistics: [{
          onStatisticField: 'Field1',
          statisticType: 'sum',
          outStatisticFieldName: 'Field1_sum'
        }, {
          onStatisticField: 'FID',
          statisticType: 'sum',
          outStatisticFieldName: 'FID_sum'
        }]
      })
      expect(normalizeOrderOptions('barSeries', input, query, 'FID')).toEqual({
        orderByFields: ['Field0 ASC'],
        data: {
          orderType: 'arcgis-charts-category',
          preferLabel: false,
          orderBy: 'ASC'
        }
      })
    })
    it('should work well with id as category', () => {
      const input: ImmutableObject<WebChartOrderOptions> = Immutable({
        orderByFields: ['FID ASC'],
        data: {
          orderType: 'arcgis-charts-category',
          preferLabel: false,
          orderBy: 'ASC'
        }
      })
      const query: ImmutableObject<FeatureLayerQueryParams> = Immutable({
        groupByFieldsForStatistics: ['FID'],
        outStatistics: [{
          onStatisticField: 'Field0',
          statisticType: 'sum',
          outStatisticFieldName: 'Field0_sum'
        }, {
          onStatisticField: 'Field1',
          statisticType: 'sum',
          outStatisticFieldName: 'Field1_sum'
        }]
      })
      expect(normalizeOrderOptions('barSeries', input, query, 'FID')).toEqual({
        orderByFields: ['FID ASC'],
        data: {
          orderType: 'arcgis-charts-category',
          preferLabel: false,
          orderBy: 'ASC'
        }
      })
    })
    it('should work well with count id statistic', () => {
      const input: ImmutableObject<WebChartOrderOptions> = Immutable({
        orderByFields: ['FID_count ASC'],
        data: {
          orderType: 'arcgis-charts-y-value',
          preferLabel: false,
          orderBy: 'ASC'
        }
      })
      const query: ImmutableObject<FeatureLayerQueryParams> = Immutable({
        groupByFieldsForStatistics: ['Field0'],
        outStatistics: [{
          onStatisticField: 'FID',
          statisticType: 'count',
          outStatisticFieldName: 'FID_count'
        }]
      })
      expect(normalizeOrderOptions('barSeries', input, query, 'FID')).toEqual({
        orderByFields: ['FID_count ASC'],
        data: {
          orderType: 'arcgis-charts-y-value',
          preferLabel: false,
          orderBy: 'ASC'
        }
      })
    })
    it('should work well with no-aggregation statistic', () => {
      let input: ImmutableObject<WebChartOrderOptions> = Immutable({
        orderByFields: ['Field0 DESC'],
        data: {
          orderType: 'arcgis-charts-category',
          preferLabel: false,
          orderBy: 'DESC'
        }
      })
      const query: ImmutableObject<FeatureLayerQueryParams> = Immutable({
        groupByFieldsForStatistics: ['Field0'],
        outFields: ['Field1', 'Field2']
      })
      expect(normalizeOrderOptions('barSeries', input, query, 'FID')).toEqual({
        orderByFields: ['Field0 DESC'],
        data: {
          orderType: 'arcgis-charts-category',
          preferLabel: false,
          orderBy: 'DESC'
        }
      })

      input = Immutable({
        orderByFields: ['Field1 DESC'],
        data: {
          orderType: 'arcgis-charts-y-value',
          preferLabel: false,
          orderBy: 'DESC'
        }
      })
      expect(normalizeOrderOptions('barSeries', input, query, 'FID')).toEqual({
        orderByFields: ['Field1 DESC'],
        data: {
          orderType: 'arcgis-charts-y-value',
          preferLabel: false,
          orderBy: 'DESC'
        }
      })
    })
  })

  describe('filterOutSeriesUseIdFieldForNonCount', () => {
    it('should work well', () => {
      let propSeries = Immutable([{
        query: {
          outStatistics: [{
            onStatisticField: 'FID',
            statisticType: 'sum',
            outStatisticFieldName: 'FID_sum'
          }]
        }
      }, {
        query: {
          outStatistics: [{
            onStatisticField: 'Field1',
            statisticType: 'sum',
            outStatisticFieldName: 'Field1_sum'
          }]
        }
      }]) as any
      expect(filterOutSeriesUseIdFieldForNonCount(propSeries, 'FID')).toEqual([{
        query: {
          outStatistics: [{
            onStatisticField: 'Field1',
            statisticType: 'sum',
            outStatisticFieldName: 'Field1_sum'
          }]
        }
      }])

      propSeries = Immutable([{
        query: {
          outStatistics: [{
            onStatisticField: 'FID',
            statisticType: 'count',
            outStatisticFieldName: 'FID_count'
          }]
        }
      }]) as any
      expect(filterOutSeriesUseIdFieldForNonCount(propSeries, 'FID')).toEqual([{
        query: {
          outStatistics: [{
            onStatisticField: 'FID',
            statisticType: 'count',
            outStatisticFieldName: 'FID_count'
          }]
        }
      }])
    })
  })
})
