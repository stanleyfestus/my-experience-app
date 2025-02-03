import { type extensionSpec, type IMAppConfig } from 'jimu-core'
import { type IMConfig } from '../config'

export default class AppConfigOperation implements extensionSpec.AppConfigOperationsExtension {
  id = 'map-app-config-operation'

  afterWidgetCopied (
    sourceWidgetId: string,
    sourceAppConfig: IMAppConfig,
    destWidgetId: string,
    destAppConfig: IMAppConfig,
    widgetMap?: { [key: string]: string }
  ): IMAppConfig {
    if (!widgetMap) { // no need to change widget linkage if it is not performed during a page copying
      return destAppConfig
    }

    let newAppConfig = destAppConfig
    const sourceWidgetJson = sourceAppConfig.widgets[sourceWidgetId]
    const sourceWidgetConfig: IMConfig = sourceWidgetJson?.config

    const destWidgetJson = newAppConfig.widgets[destWidgetId]
    const destWidgetConfig: IMConfig = destWidgetJson?.config

    if (sourceWidgetConfig && destWidgetConfig && sourceWidgetConfig.clientQueryDataSourceIds?.length > 0) {
      // client query should be enabled by only one map widget for one webmap data source
      newAppConfig = newAppConfig.setIn(['widgets', destWidgetId, 'config', 'clientQueryDataSourceIds'], [])
    }

    return newAppConfig
  }

  /**
   * Do some cleanup operations before current widget is removed.
   * @returns The updated appConfig
   */
  widgetWillRemove (appConfig: IMAppConfig): IMAppConfig {
    return appConfig
  }
}
