import { React, type AllWidgetProps } from 'jimu-core'
import { versionManager } from '../version-manager'
import { DefaultOptions, ChartLimits } from '../constants'
import { ChartRuntimeStateProvider } from './state'
import { type IMConfig } from '../config'
import { getChartOrSeriesType } from '../utils/common'
import { getDefaultTools } from '../utils/default'
import Chart from './chart'

const Widget = (props: AllWidgetProps<IMConfig>): React.ReactElement => {
  const { outputDataSources, useDataSources, config, id, enableDataAction, onInitDragHandler } = props

  const webChart = config?.webChart
  const seriesType = getChartOrSeriesType(config?.webChart?.series)
  const tools = config?.tools ?? getDefaultTools(seriesType)
  const options = config?.options ?? DefaultOptions
  const defaultTemplateType = config?._templateType

  return (
    <div className='jimu-widget widget-chart'>
      <ChartRuntimeStateProvider>
        <Chart
          widgetId={id}
          tools={tools}
          options={options}
          webChart={webChart}
          chartLimits={ChartLimits}
          useDataSource={useDataSources?.[0]}
          enableDataAction={enableDataAction}
          onInitDragHandler={onInitDragHandler}
          defaultTemplateType={defaultTemplateType}
          outputDataSourceId={outputDataSources?.[0]}
        />
      </ChartRuntimeStateProvider>
    </div>
  )
}

Widget.versionManager = versionManager

export default Widget
