import { AbstractMessageAction, MessageType, getAppStore, appActions, type Message, type MessageDescription } from 'jimu-core'

export default class ToggleSidebarAction extends AbstractMessageAction {
  filterMessageDescription (messageDescription: MessageDescription): boolean {
    return messageDescription.messageType === MessageType.ButtonClick
  }

  filterMessage (message: Message): boolean {
    return true
  }

  onExecute (message: Message): Promise<boolean> | boolean {
    const store = getAppStore()
    const widgetsState = store.getState().widgetsState
    const collapse = widgetsState?.[this.widgetId]?.collapse ?? false

    getAppStore().dispatch(appActions.widgetStatePropChange(this.widgetId, 'collapse', !collapse))

    return true
  }
}
