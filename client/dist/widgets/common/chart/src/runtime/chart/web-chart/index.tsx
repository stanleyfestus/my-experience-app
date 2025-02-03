import { React, type ImmutableObject, type UseDataSource, type WidgetInitDragCallback } from 'jimu-core'
import { type ChartElementLimit, getSeriesType } from 'jimu-ui/advanced/chart'
import { type ChartComponentOptions, type ChartTools, type IWebChart, type TemplateType } from '../../../config'
import WebChartComponent from './web-chart-component'
import { useChartRuntimeState } from '../../state'
import { getTemplateType } from '../../../utils/common'
import { ChartRoot } from '../components'
import Tools from '../tools'
import { useChartRenderState } from './utils'

export interface WebChartProps {
  className?: string
  widgetId: string
  webChart: ImmutableObject<IWebChart>
  tools: ImmutableObject<ChartTools>
  options?: ChartComponentOptions
  enableDataAction: boolean
  chartLimits?: Partial<ChartElementLimit>
  useDataSource: ImmutableObject<UseDataSource>
  defaultTemplateType: TemplateType
  onInitDragHandler: WidgetInitDragCallback
}

const WebChart = (props: WebChartProps) => {
  const {
    widgetId,
    tools: propTools,
    enableDataAction = true,
    webChart,
    options,
    chartLimits,
    useDataSource,
    defaultTemplateType = 'column',
    onInitDragHandler
  } = props

  const { dataSource, outputDataSource, renderStatus } = useChartRuntimeState()
  const [loading, setLoading] = React.useState(false)

  const type = getSeriesType(webChart?.series as any)
  const templateType = getTemplateType(webChart)?.[1] ?? defaultTemplateType
  const showTools = propTools?.cursorEnable || !!propTools?.filter || enableDataAction

  const [showPlaceholder, message] = useChartRenderState(useDataSource, dataSource, webChart, renderStatus)

  const tools = showTools
    ? (
      <Tools
        type={type}
        tools={propTools}
        widgetId={widgetId}
        enableDataAction={enableDataAction}
      />
      )
    : null

  const handleLayerStatusChange = (status: 'loading' | 'loaded') => {
    setLoading(status === 'loading')
  }

  return (
    <ChartRoot
      templateType={templateType}
      messageType='basic'
      message={message}
      showLoading={loading}
      background={webChart?.background}
      className='feature-layer-chart'
      showPlaceholder={showPlaceholder || !outputDataSource}
      tools={tools}
    >
      <WebChartComponent
        className='web-chart jimu-outline-inside'
        widgetId={widgetId}
        webChart={webChart}
        options={options}
        chartLimits={chartLimits}
        useDataSource={useDataSource}
        onInitDragHandler={onInitDragHandler}
        onLayerStatusChange={handleLayerStatusChange}
      />
    </ChartRoot>
  )
}

export default WebChart
