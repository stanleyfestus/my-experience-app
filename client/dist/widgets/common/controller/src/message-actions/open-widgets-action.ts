import {
  AbstractMessageAction, type Message, type MessageDescription, getAppStore, appActions, type ImmutableObject,
  type RuntimeInfos, MessageType, type DataRecordsSelectionChangeMessage, type SceneLayerDataSource,
  type FeatureLayerDataSource, type BuildingComponentSubLayerDataSource, AppMode
} from 'jimu-core'
import { type IMConfig, type IMActionConfig } from '../config'
import { isWidgetOpening } from '../runtime/common/layout-utils'

export default class OpenWidgetsAction extends AbstractMessageAction {
  private readonly supportedMessageTypes = [
    MessageType.ButtonClick,
    MessageType.DataRecordsSelectionChange
  ]

  private readonly supportedMessageTypesInExpressMode = [
    MessageType.ButtonClick
  ]

  filterMessageDescription (messageDescription: MessageDescription): boolean {
    const appMode = getAppStore().getState().appRuntimeInfo.appMode
    if (appMode === AppMode.Express) {
      return this.supportedMessageTypesInExpressMode.includes(messageDescription.messageType)
    } else {
      return this.supportedMessageTypes.includes(messageDescription.messageType)
    }
  }

  filterMessage (message: Message): boolean {
    return true
  }

  onExecute (message: Message, actionConfig?: IMActionConfig): Promise<boolean> | boolean {
    let isSelectionEmpty = false
    let notTriggerData = false
    if (message.type === MessageType.DataRecordsSelectionChange) {
      const selectionMessage = message as DataRecordsSelectionChangeMessage
      if ((selectionMessage.records || []).length === 0) {
        isSelectionEmpty = true
      } else {
        const ds = selectionMessage.records[0].dataSource
        const dsId = ds.id
        const mainDsId = ds.getMainDataSource()?.id
        const rootDsId = ds.getRootDataSource()?.id
        const associatedDsId = (ds as SceneLayerDataSource | FeatureLayerDataSource | BuildingComponentSubLayerDataSource)?.getAssociatedDataSource?.()?.id
        if (!actionConfig.useDataSources || actionConfig.useDataSources.length === 0) {
          // If there's no trigger data, selecting all use data sources will trigger this action.
          const allUseDsIds = getAppStore().getState().appConfig?.widgets?.[message.widgetId]?.useDataSources?.map?.(useDs => useDs.mainDataSourceId) || []
          const isUseDs = allUseDsIds.some(useDsId => [dsId, mainDsId, rootDsId, associatedDsId].includes(useDsId))
          if (!isUseDs) notTriggerData = true
        } else {
          // When there's one or more trigger data, only selecting these data can trigger this action.
          const isTriggerData = actionConfig.useDataSources.some(useDs => [dsId, mainDsId, rootDsId, associatedDsId].includes(useDs.mainDataSourceId))
          if (!isTriggerData) notTriggerData = true
        }
      }
    }
    if (!actionConfig || isSelectionEmpty || notTriggerData) return Promise.resolve(true)
    let widgetIds = actionConfig?.widgetIds.asMutable()
    const controllerId = actionConfig?.controllerId
    const state = getAppStore().getState()
    const widgetConfig = state.appConfig.widgets[controllerId].config as IMConfig
    const isSingle = widgetConfig?.behavior?.onlyOpenOne
    if (isSingle) {
      const widgetsRuntimInfo = state.widgetsRuntimeInfo ?? {} as ImmutableObject<RuntimeInfos>
      const openingWidgets = Object.keys(widgetsRuntimInfo).filter(widgetId => {
        const runtimeInfo = widgetsRuntimInfo[widgetId]
        return runtimeInfo.controllerWidgetId === controllerId && isWidgetOpening(runtimeInfo)
      })
      if (openingWidgets.length > 0) {
        getAppStore().dispatch(appActions.closeWidgets(openingWidgets))
      }
      if (widgetIds.length > 1) {
        widgetIds = widgetIds.slice(0, 1)
      }
    }
    getAppStore().dispatch(appActions.openWidgets(widgetIds))
    return Promise.resolve(true)
  }
}
