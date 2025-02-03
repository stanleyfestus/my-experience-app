import { type extensionSpec, type IMAppConfig } from 'jimu-core'
import { type IMConfig } from '../config'

export default class AppConfigOperation implements extensionSpec.AppConfigOperationsExtension {
  id = 'image-app-config-operation'
  widgetId: string

  /**
   * Cleanup the widget config when the useDataSource will be removed
   * @returns The updated appConfig
   */
  useDataSourceWillRemove (appConfig: IMAppConfig, dataSourceId: string): IMAppConfig {
    const widgetJson = appConfig.widgets[this.widgetId]
    const useDataSourceToRemove = widgetJson.useDataSources.find(useDs => useDs.dataSourceId === dataSourceId)
    if (useDataSourceToRemove) {
      const config: IMConfig = widgetJson.config
      const functionConfig = config.functionConfig
      const newFunctionConfig = functionConfig.without('srcExpression').without('altTextExpression').without('toolTipExpression')
      const newAppConfig = appConfig.setIn(['widgets', this.widgetId, 'config', 'functionConfig'], newFunctionConfig)
      return newAppConfig
    }
    return appConfig
  }
}
