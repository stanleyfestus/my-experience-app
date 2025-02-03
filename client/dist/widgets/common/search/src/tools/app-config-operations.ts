import { type extensionSpec, type IMAppConfig, type ImmutableArray, type UseDataSource, type IMUseDataSource } from 'jimu-core'
import { type IMConfig, SearchServiceType, SourceType } from '../config'
export default class AppConfigOperation implements extensionSpec.AppConfigOperationsExtension {
  id = 'search-app-config-operation'
  widgetId: string
  afterWidgetCopied (
    sourceWidgetId: string,
    sourceAppConfig: IMAppConfig,
    destWidgetId: string,
    destAppConfig: IMAppConfig,
    widgetMap?: { [key: string]: string }
  ): IMAppConfig {
    const outputDataSourcesOfSourceWidget = sourceAppConfig.widgets[sourceWidgetId]?.outputDataSources?.asMutable({ deep: true }) || []
    const outputDataSourcesOfDestWidget = sourceAppConfig.widgets[destWidgetId]?.outputDataSources?.asMutable({ deep: true }) || []
    if (outputDataSourcesOfSourceWidget?.length === 0) {
      return destAppConfig
    }

    let newAppConfig = destAppConfig

    //Update output dsId in widget config
    const widgetConfigOfDestWidget = destAppConfig.widgets[destWidgetId].config as IMConfig
    const datasourceConfig = widgetConfigOfDestWidget?.datasourceConfig
    const newDatasourceConfig = datasourceConfig.map(item => {
      if (item.searchServiceType === SearchServiceType.FeatureService) {
        return item
      } else {
        const outputDataSourceIdInSourceWidget = item.outputDataSourceId
        const outputDsId = getOutputDsIdInDestWidgetConfig(outputDataSourcesOfSourceWidget, outputDataSourcesOfDestWidget, outputDataSourceIdInSourceWidget)
        item = item.set('outputDataSourceId', outputDsId)
        return item
      }
    })

    newAppConfig = newAppConfig.setIn(['widgets', destWidgetId, 'config', 'datasourceConfig'], newDatasourceConfig)

    //Update output dsId in message action config of destWidget
    const messageActionConfig = destAppConfig?.messageConfigs
    if (messageActionConfig) {
      const newMessageActionConfig = {}
      Object.keys(messageActionConfig).forEach(configId => {
        const configItem = messageActionConfig[configId]
        if (configItem?.widgetId !== destWidgetId || !configItem?.actions) {
          newMessageActionConfig[configId] = configItem
        } else {
          const actions = configItem.actions
          const newActions = actions.map(actionItem => {
            //Update useDataSources of action
            if (actionItem?.useDataSources) {
              const useDataSources = actionItem.useDataSources
              const newUseDataSources = getNewUseDataSources(outputDataSourcesOfSourceWidget, outputDataSourcesOfDestWidget, useDataSources)
              actionItem = actionItem.set('useDataSources', newUseDataSources)
            }

            //Update messageUseDataSource of message action
            const messageUseDataSource = actionItem?.config?.messageUseDataSource
            if (messageUseDataSource && outputDataSourcesOfSourceWidget.includes(messageUseDataSource?.dataSourceId)) {
              //Get new messageUseDataSource
              const newMessageUseDataSource = getNewUseDataSource(outputDataSourcesOfSourceWidget, outputDataSourcesOfDestWidget, messageUseDataSource)
              actionItem = actionItem.setIn(['config', 'messageUseDataSource'], newMessageUseDataSource)
            }

            //Update useDataSource of message actions
            if (actionItem?.config?.useDataSource && outputDataSourcesOfSourceWidget.includes(actionItem?.config?.useDataSource?.dataSourceId)) {
              //Get new useDataSource
              const preDs = actionItem?.config?.useDataSource
              const newUseDataSource = getNewUseDataSource(outputDataSourcesOfSourceWidget, outputDataSourcesOfDestWidget, preDs)
              actionItem = actionItem.setIn(['config', 'useDataSource'], newUseDataSource)
            }

            //Update useDataSources of message actions
            if (actionItem?.config?.useDataSources) {
              //Get new useDataSources
              const newUseDataSources = getNewUseDataSources(outputDataSourcesOfSourceWidget, outputDataSourcesOfDestWidget, actionItem?.config.useDataSources)
              actionItem = actionItem.setIn(['config', 'useDataSources'], newUseDataSources)
            }

            return actionItem
          })

          newMessageActionConfig[configId] = configItem.set('actions', newActions)
        }
      })

      newAppConfig = newAppConfig.set('messageConfigs', newMessageActionConfig)
    }

    return newAppConfig
  }

  /**
 * Cleanup the widget config when the useDataSource will be removed
 * @returns The updated appConfig
 */
  useDataSourceWillRemove (appConfig: IMAppConfig, dataSourceId: string): IMAppConfig {
    let widgetJson = appConfig.widgets[this.widgetId]
    let widgetConfig = widgetJson.config as IMConfig

    const useDsIdsToRemove = widgetJson.useDataSources.filter(useDs => {
      return useDs.dataSourceId === dataSourceId || useDs.rootDataSourceId === dataSourceId
    })?.map(ds => ds.dataSourceId)

    const newUseDataSources = widgetJson.useDataSources.filter(useDs => {
      return useDs.dataSourceId !== dataSourceId || useDs.rootDataSourceId !== dataSourceId
    })

    if (useDsIdsToRemove && useDsIdsToRemove?.length > 0) {
      if (widgetConfig.sourceType === SourceType.MapCentric) {
        const dataSourceConfigWithMapCentric = widgetConfig.dataSourceConfigWithMapCentric
        const newDataSourceConfigWithMapCentric = {}

        Object.keys(dataSourceConfigWithMapCentric).forEach(configId => {
          const dataSourceConfigItemWithMapCentric = dataSourceConfigWithMapCentric[configId]?.asMutable({ deep: true })
          if (dataSourceConfigItemWithMapCentric?.synchronizeSettings as any === false && dataSourceConfigItemWithMapCentric?.dataSourceConfig) {
            const newDataSourceConfig = dataSourceConfigItemWithMapCentric?.dataSourceConfig.filter(dataSourceConfigItem => !useDsIdsToRemove.includes(dataSourceConfigItem?.useDataSource?.dataSourceId))
            dataSourceConfigItemWithMapCentric.dataSourceConfig = newDataSourceConfig
          }
          const dsIdInConfigId = configId.split('-')[1]
          if (dsIdInConfigId !== dataSourceId) {
            newDataSourceConfigWithMapCentric[configId] = dataSourceConfigItemWithMapCentric
          }
        })

        widgetConfig = widgetConfig.set('dataSourceConfigWithMapCentric', newDataSourceConfigWithMapCentric)
      } else {
        const dataSourceConfig = widgetConfig.datasourceConfig
        const newDataSourceConfig = dataSourceConfig.filter(dataSourceConfigItem => !useDsIdsToRemove.includes(dataSourceConfigItem?.useDataSource?.dataSourceId))
        widgetConfig = widgetConfig.set('datasourceConfig', newDataSourceConfig)
      }
      widgetJson = widgetJson.set('useDataSources', newUseDataSources).set('config', widgetConfig)
      appConfig = appConfig.setIn(['widgets', this.widgetId], widgetJson)
    }
    return appConfig
  }
}

function getNewUseDataSources (outputDataSourcesOfSourceWidget: string[], outputDataSourcesOfDestWidget: string[], useDataSources: ImmutableArray<UseDataSource>) {
  return useDataSources.map(ds => {
    return getNewUseDataSource(outputDataSourcesOfSourceWidget, outputDataSourcesOfDestWidget, ds)
  })
}

function getNewUseDataSource (outputDataSourcesOfSourceWidget: string[], outputDataSourcesOfDestWidget: string[], ds: IMUseDataSource) {
  if (outputDataSourcesOfSourceWidget.includes(ds?.dataSourceId)) {
    const outputDsId = getOutputDsIdInDestWidgetConfig(outputDataSourcesOfSourceWidget, outputDataSourcesOfDestWidget, ds.dataSourceId)
    return ds.set('dataSourceId', outputDsId).set('mainDataSourceId', outputDsId)
  } else {
    return ds
  }
}

function getOutputDsIdInDestWidgetConfig (outputDataSourcesOfSourceWidget: string[], outputDataSourcesOfDestWidget: string[], dsIdInSourceWidget: string): string {
  const index = outputDataSourcesOfSourceWidget.indexOf(dsIdInSourceWidget)
  if (index > -1) {
    return outputDataSourcesOfDestWidget[index]
  } else {
    return dsIdInSourceWidget
  }
}
