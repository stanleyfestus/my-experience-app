import { type extensionSpec, type IMAppConfig } from 'jimu-core'
import { type IMConfig } from '../config'

export default class AppConfigOperation implements extensionSpec.AppConfigOperationsExtension {
  id = 'query-app-config-operation'

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

    const widgetJson = sourceAppConfig.widgets[sourceWidgetId]
    const config: IMConfig = widgetJson?.config
    let newAppConfig = destAppConfig

    config.queryItems?.forEach((queryItem, index) => {
      if (queryItem.spatialMapWidgetIds?.length > 0) {
        const newWidgetIds = queryItem.spatialMapWidgetIds.map(wId => widgetMap[wId])
        newAppConfig = newAppConfig.setIn(['widgets', destWidgetId, 'config', 'queryItems', index as any, 'spatialMapWidgetIds'], newWidgetIds)
      }
    })

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
