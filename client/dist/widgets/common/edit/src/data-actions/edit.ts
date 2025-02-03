import {
  AbstractDataAction,
  type DataRecordSet,
  getAppStore,
  appActions,
  DataSourceStatus,
  DataLevel
} from 'jimu-core'
import { EditModeType } from '../config'

export default class Edit extends AbstractDataAction {
  async isSupported (dataSets: DataRecordSet[], dataLevel: DataLevel, widgetId: string): Promise<boolean> {
    let isActionSupported = false
    let editHaveThisDs = false
    const dataSet = dataSets[0]
    const { dataSource, records } = dataSet
    const appState = getAppStore().getState()
    const appConfig = appState?.appConfig
    const isWidgetInController = appState?.widgetsRuntimeInfo[this.widgetId]?.controllerWidgetId
    const targetEditWidget = appConfig?.widgets[this.widgetId]
    if (!targetEditWidget) return
    const { layersConfig, mapViewsConfig, editMode } = targetEditWidget.config
    if (editMode === EditModeType.Geometry) {
      if (!mapViewsConfig) {
        editHaveThisDs = true
      } else {
        for (const viewId in mapViewsConfig) {
          const viewConfig = mapViewsConfig[viewId]
          const usedLayerViewIds = viewConfig.customJimuLayerViewIds
          usedLayerViewIds.forEach(viewId => {
            if (viewId.includes(dataSource.id)) {
              editHaveThisDs = true
            }
          })
        }
      }
    } else {
      editHaveThisDs = layersConfig.find(item => item.useDataSource.dataSourceId === dataSource.id)
    }
    if (editHaveThisDs && dataLevel === DataLevel.Records && records?.length > 0 && isWidgetInController) {
      isActionSupported = true
    }
    return isActionSupported && dataSource.getStatus() !== DataSourceStatus.NotReady
  }

  async onExecute (dataSets: DataRecordSet[], dataLevel: DataLevel, widgetId: string): Promise<boolean> {
    getAppStore().dispatch(
      appActions.openWidgets([this.widgetId])
    )
    return true
  }
}
