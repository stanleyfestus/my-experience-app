import { DataSourceStatus, type IMFeatureLayerQueryParams, type ImmutableArray, type ImmutableObject, type IMState, React, hooks, ReactRedux, type UseDataSource } from 'jimu-core'
import { SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components'
import { type ChartComponentOptions, type ChartTools, type IWebChart } from '../../config'
import ChartSetting from './chart'
import defaultMessages from '../translations/default'
import ChartTypeSelector from './chart-type-selector'
import { type ChartTypes } from 'jimu-ui/advanced/chart'
import { Placeholder } from './components'

interface ChartSettingsProps {
  widgetId?: string
  type: ChartTypes
  template: string
  tools: ImmutableObject<ChartTools>
  webChart: ImmutableObject<IWebChart>
  options: ImmutableObject<ChartComponentOptions>
  useDataSources: ImmutableArray<UseDataSource>
  onOptionsChange: (options: ImmutableObject<ChartComponentOptions>) => void
  onTemplateChange: (templateId: string, webChart: ImmutableObject<IWebChart>) => void
  onToolsChange: (tools: ImmutableObject<ChartTools>) => void
  onWebChartChange: (webChart: ImmutableObject<IWebChart>, query?: IMFeatureLayerQueryParams) => void
}

export const ChartSettings = (props: ChartSettingsProps) => {
  const {
    type,
    widgetId,
    template,
    tools,
    webChart,
    options,
    useDataSources,
    onTemplateChange,
    onToolsChange,
    onWebChartChange,
    onOptionsChange
  } = props

  const translate = hooks.useTranslation(defaultMessages)
  const sourceStatus = ReactRedux.useSelector((state: IMState) => state.appStateInBuilder?.dataSourcesInfo?.[useDataSources?.[0]?.dataSourceId]?.instanceStatus)
  const hasDataSource = !!useDataSources?.[0]?.dataSourceId

  return (
    <>
      {sourceStatus === DataSourceStatus.Created && <>
        <SettingSection>
          <SettingRow label={translate('chartType')} flow='wrap' level={1}>
            <ChartTypeSelector
              templateId={template}
              useDataSources={useDataSources}
              webChart={webChart}
              onChange={onTemplateChange}
            />
          </SettingRow>
        </SettingSection>
        {webChart && (
          <ChartSetting
            type={type}
            tools={tools}
            webChart={webChart}
            options={options}
            widgetId={widgetId}
            useDataSources={useDataSources}
            onToolsChange={onToolsChange}
            onWebChartChange={onWebChartChange}
            onOptionsChange={onOptionsChange}
          />
        )}
      </>}
      {!hasDataSource && <Placeholder messageId='chart-blank-msg' placeholder={translate('selectDataPlaceholder')} />}
    </>
  )
}
