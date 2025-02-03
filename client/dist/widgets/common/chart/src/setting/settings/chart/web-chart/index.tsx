import { React, ReactRedux, type IMState, type IMFeatureLayerQueryParams, type ImmutableArray, type ImmutableObject, type UseDataSource } from 'jimu-core'
import { type ChartTypes } from 'jimu-ui/advanced/chart'
import { isSerialSeries } from '../../../../utils/default'
import { type ChartSettingSection } from '../type'
import { type ChartComponentOptions, type IWebChart } from '../../../../config'
import SerialSetting from './serial'
import PieSetting from './pie'
import ScatterPlotSetting from './scatter'
import HistogramSetting from './histogram'
import GaugeSetting from './gauge'
interface WebChartSettingProps {
  type: ChartTypes
  widgetId?: string
  section: ChartSettingSection
  webChart: ImmutableObject<IWebChart>
  options: ImmutableObject<ChartComponentOptions>
  useDataSources: ImmutableArray<UseDataSource>
  onOptionsChange: (options: ImmutableObject<ChartComponentOptions>) => void
  onSectionChange: (section: ChartSettingSection) => void
  onWebChartChange: (webChart: ImmutableObject<IWebChart>, query?: IMFeatureLayerQueryParams) => void
}

const WebChartSetting = (props: WebChartSettingProps) => {
  const {
    type,
    section,
    webChart,
    options,
    widgetId,
    onSectionChange,
    useDataSources,
    onWebChartChange,
    onOptionsChange
  } = props

  const colorMatchingApplied = ReactRedux.useSelector((state: IMState) => state.appStateInBuilder.widgetsState?.[widgetId]?.colorMatchingApplied)

  return (
    <>
      {isSerialSeries(type) && (
        <SerialSetting
          type={type}
          section={section}
          options={options}
          webChart={webChart}
          onSectionChange={onSectionChange}
          useDataSources={useDataSources}
          onWebChartChange={onWebChartChange}
          onOptionsChange={onOptionsChange}
          colorMatchingApplied={colorMatchingApplied}
        />
      )}
      {type === 'pieSeries' && (
        <PieSetting
          type={type}
          section={section}
          webChart={webChart}
          onSectionChange={onSectionChange}
          useDataSources={useDataSources}
          onWebChartChange={onWebChartChange}
          colorMatchingApplied={colorMatchingApplied}
        />
      )}
      {type === 'scatterSeries' && (
        <ScatterPlotSetting
          section={section}
          webChart={webChart}
          onSectionChange={onSectionChange}
          useDataSources={useDataSources}
          onWebChartChange={onWebChartChange}
          colorMatchingApplied={colorMatchingApplied}
        />
      )}
      {type === 'histogramSeries' && (
        <HistogramSetting
          section={section}
          webChart={webChart}
          onSectionChange={onSectionChange}
          useDataSources={useDataSources}
          onWebChartChange={onWebChartChange}
          colorMatchingApplied={colorMatchingApplied}
        />
      )}
      {type === 'gaugeSeries' && (
        <GaugeSetting
          section={section}
          webChart={webChart}
          onSectionChange={onSectionChange}
          useDataSources={useDataSources}
          onWebChartChange={onWebChartChange}
        />
      )}
    </>
  )
}

export default WebChartSetting
