import { type extensionSpec, type IMAppConfig, type AppConfig, Immutable } from 'jimu-core'

export default class AppConfigOperation implements extensionSpec.AppConfigOperationsExtension {
  id = 'print-app-config-operation'
  dataSourceWillRemove (appConfig: IMAppConfig, dataSourceId: string): IMAppConfig {
    let isPrintConfigChanged = false
    const addUseDatasourcesForPrintWidget = (config: AppConfig): AppConfig => {
      config.widgets && Object.keys(config.widgets).forEach(widgetId => {
        const widgetJson = config.widgets[widgetId]
        if (widgetJson.uri === 'widgets/common/print/') {
          const printTemplates = widgetJson.config?.printCustomTemplate || []
          const newPrintTemplates = printTemplates.map(temp => {
            const reportOptions = temp?.reportOptions || {}
            const reportSectionOverrides = reportOptions?.reportSectionOverrides || {}
            Object.keys(reportSectionOverrides).forEach(key => {
              const exbDatasource = reportSectionOverrides[key]?.exbDatasource
              if (exbDatasource) {
                const newExbDatasource = exbDatasource.filter(ds => {
                  const needRemoveDs = ds?.dataSourceId === dataSourceId || ds?.rootDataSourceId === dataSourceId || ds?.mainDataSourceId === dataSourceId
                  if (needRemoveDs) {
                    isPrintConfigChanged = true
                  }
                  return !needRemoveDs
                })
                if (newExbDatasource?.length === 0) {
                  if (reportSectionOverrides[key]?.isDsOutputDs) {
                    delete reportSectionOverrides[key]?.isDsOutputDs
                  }
                  delete reportSectionOverrides[key].exbDatasource
                } else {
                  reportSectionOverrides[key].exbDatasource = newExbDatasource
                }
              }
            })
            reportOptions.reportSectionOverrides = reportSectionOverrides
            temp.reportOptions = reportOptions
            return temp
          })
          isPrintConfigChanged && (config.widgets[widgetId].config.printCustomTemplate = newPrintTemplates)
        }
      })
      return config
    }
    const newAppConfig = addUseDatasourcesForPrintWidget(appConfig?.asMutable({ deep: true }))
    return isPrintConfigChanged ? Immutable(newAppConfig) : appConfig
  }
}
