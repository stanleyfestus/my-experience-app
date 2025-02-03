/** @jsx jsx */
import { React, jsx, Immutable, type UseDataSource, defaultMessages as jimuCoreMessages, type ImmutableObject, getAppStore, AllDataSourceTypes, hooks, type DataSourceJson, DataSourceManager, AppMode } from 'jimu-core'
import { builderActions, type AllWidgetSettingProps } from 'jimu-for-builder'
import { defaultMessages as jimUiMessages } from 'jimu-ui'
import { SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components'
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector'
import { type ChartComponentOptions, type ChartTools, type IMConfig, type IWebChart } from '../config'
import { ChartSettings } from './settings'
import defaultMessages from './translations/default'
import { getSeriesType } from 'jimu-ui/advanced/chart'
import OutputSourceManager from './data-source'
import { getDefaultTools, isGaugeChart } from '../utils/default'
import utilities from './style'
import { DefaultOptions } from '../constants'

const SupportImageryLayer = false

const ImageryTypes = [AllDataSourceTypes.OrientedImageryLayer, AllDataSourceTypes.ImageryLayer]

const SUPPORTED_TYPES = Immutable([AllDataSourceTypes.FeatureLayer, AllDataSourceTypes.SceneLayer, AllDataSourceTypes.BuildingComponentSubLayer, AllDataSourceTypes.SubtypeSublayer].concat(SupportImageryLayer ? ImageryTypes : []))

const getDefaultToolsOption = (seriesType?: string) => {
  const isGauge = isGaugeChart(seriesType)
  return isGauge ? { cursorEnable: false } : { cursorEnable: true }
}

type SettingProps = AllWidgetSettingProps<IMConfig>

const Setting = (props: SettingProps): React.ReactElement => {
  const {
    id,
    useDataSources: propUseDataSources,
    outputDataSources: propOutputDataSources,
    onSettingChange,
    config: propConfig,
    label
  } = props

  const translate = hooks.useTranslation(defaultMessages, jimUiMessages, jimuCoreMessages)

  const { template = '', webChart, tools: propTools, options = DefaultOptions } = propConfig
  const seriesType = getSeriesType(webChart?.series as any) ?? 'barSeries'
  const outputDataSourceId = propOutputDataSources?.[0] ?? ''
  const outputDataSourceLabel = translate('outputStatistics', { name: label })
  const tools = propTools ?? getDefaultTools(seriesType)

  const handleUseDataSourceChange = (useDataSources: UseDataSource[]): void => {
    const config = propConfig.without('webChart').without('tools').without('template')
    if (outputDataSourceId) {
      let outputDataSourceJson = DataSourceManager.getInstance().getDataSource(outputDataSourceId).getDataSourceJson()
      outputDataSourceJson = outputDataSourceJson.set('originDataSources', useDataSources)
      onSettingChange({ id, useDataSources, config }, [outputDataSourceJson.asMutable({ deep: true })])
    } else {
      onSettingChange({ id, useDataSources, config })
    }
  }

  const handleOutputCreate = (dataSourceJson: DataSourceJson) => {
    onSettingChange({ id }, [dataSourceJson])
  }

  const handleFieldsChange = (fields: string[]) => {
    const useDataSources = Immutable.setIn(propUseDataSources, ['0', 'fields'], fields).asMutable({ deep: true })
    onSettingChange({ id, useDataSources })
  }

  const handleTemplateChange = (templateId: string, webChart: ImmutableObject<IWebChart>): void => {
    const seriesType = getSeriesType(webChart.series as any)
    const config = propConfig.set('template', templateId).set('webChart', webChart).set('tools', getDefaultToolsOption(seriesType))
    onSettingChange({ id, config })
  }

  //Update output ds label when the label of widget changes
  React.useEffect(() => {
    const outputDataSource = getAppStore().getState().appStateInBuilder.appConfig?.dataSources?.[outputDataSourceId]
    if (outputDataSource && outputDataSource.label !== outputDataSourceLabel) {
      onSettingChange({ id }, [{ id: outputDataSourceId, label: outputDataSourceLabel }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outputDataSourceLabel])

  React.useEffect(() => {
    const isExpressMode = getAppStore().getState().appStateInBuilder?.appRuntimeInfo.appMode === AppMode.Express
    if (isExpressMode) {
      getAppStore().dispatch(builderActions.changeMessageActionSettingOpenState(id, false))
    }
  }, [id])

  const handleWebChartChange = (webChart: ImmutableObject<IWebChart>): void => {
    const config = propConfig.set('webChart', webChart)
    onSettingChange({ id, config })
  }

  const handleToolsChange = (tools: ImmutableObject<ChartTools>): void => {
    onSettingChange({ id, config: propConfig.set('tools', tools) })
  }

  const handleOptionsChange = (options: ImmutableObject<ChartComponentOptions>): void => {
    onSettingChange({ id, config: propConfig.set('options', options) })
  }

  return (
    <div className='widget-setting-chart jimu-widget-setting' css={utilities}>
      <div className='w-100 h-100'>
        <div className='w-100'>
          <SettingSection className='d-flex flex-column pb-0'>
            <SettingRow label={translate('data')} flow="wrap" level={1}>
              <DataSourceSelector
                isMultiple={false}
                aria-describedby='chart-blank-msg'
                mustUseDataSource
                types={SUPPORTED_TYPES}
                useDataSources={propUseDataSources}
                onChange={handleUseDataSourceChange}
                widgetId={id}
              />
            </SettingRow>
          </SettingSection>
        </div>
        <ChartSettings
          widgetId={id}
          type={seriesType}
          template={template}
          onTemplateChange={handleTemplateChange}
          useDataSources={propUseDataSources}
          tools={tools}
          options={options}
          webChart={webChart}
          onToolsChange={handleToolsChange}
          onWebChartChange={handleWebChartChange}
          onOptionsChange={handleOptionsChange}
        />
        {!!propUseDataSources?.length && <OutputSourceManager
          widgetId={id}
          dataSourceId={outputDataSourceId}
          originalUseDataSource={propUseDataSources?.[0]}
          onCreate={handleOutputCreate}
          onFieldsChange={handleFieldsChange} />}
      </div>
    </div>
  )
}

export default Setting
