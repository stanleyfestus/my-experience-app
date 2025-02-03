import { LayoutItemType, type LayoutItemConstructorProps, type IMLayoutJson, type LayoutInfo, getAppStore, appActions, type ImmutableObject, type LayoutJson, WidgetType, type IMWidgetJson, i18n, type BrowserSizeMode, LayoutParentType, AppMode, LayoutType } from 'jimu-core'
import { LayoutItemSizeModes, utils } from 'jimu-layouts/layout-runtime'
import { type AppConfigAction, builderAppSync, getAppConfigAction } from 'jimu-for-builder'
import { BASE_LAYOUT_NAME } from '../../common/consts'
import { type IMConfig } from '../../config'
import { type Config as AccordionConfig } from 'widgets/layout/accordion/src/config'
import accordionStyle from './accordion-style'

export const isLayoutItemAcceptedForController = (item: LayoutItemConstructorProps): boolean => {
  let isAccepted = true
  const itemType = item?.itemType
  const name = item?.manifest?.name
  if (itemType === LayoutItemType.Section || ['controller', 'navigator', 'divider', 'menu'].includes(name)) {
    isAccepted = false
  }
  const state = getAppStore().getState()
  const appState = state.appStateInBuilder ? state.appStateInBuilder : state
  const isExpressMode = appState.appRuntimeInfo.appMode === AppMode.Express
  const widgetType = item?.manifest?.widgetType
  if (isExpressMode && (['arcgis-map'].includes(name) || widgetType === WidgetType.Layout)) {
    isAccepted = false
  }
  if (utils.isWidgetPlaceholder(utils.getAppConfig(), item)) {
    isAccepted = false
  }
  return isAccepted
}

export const widgetStatePropChange = (controllerId: string, propKey: string, value: any) => {
  if (window.jimuConfig.isBuilder) {
    builderAppSync.publishChangeWidgetStatePropToApp({ widgetId: controllerId, propKey, value })
  } else {
    getAppStore().dispatch(appActions.widgetStatePropChange(controllerId, propKey, value))
  }
}

export const widgetToolbarStateChange = (controllerId: string, toolNames: string[]) => {
  if (window.jimuConfig.isBuilder) {
    builderAppSync.publishWidgetToolbarStateChangeToApp(controllerId, toolNames)
  } else {
    getAppStore().dispatch(appActions.widgetToolbarStateChange(controllerId, toolNames))
  }
}

export const calInsertPositionForColumn = (boundingRect: Partial<DOMRectReadOnly>,
  childRects: Array<Partial<DOMRectReadOnly> & { id: string }>,
  clientY: number): { insertY: number, refId: string } => {
  let result, refId
  let found = false
  childRects.some((rect, i) => {
    const rectY = rect.top + rect.height / 2
    if (rectY > clientY) {
      if (i === 0) { // insert before the first item
        result = rect.top
      } else { // insert between this and previous one
        const previousItem = childRects[i - 1]
        result = (rect.top + previousItem.top + previousItem.height) / 2
      }
      found = true
      refId = rect.id
    }
    return found
  })
  if (!found) { // insert after the last one
    const lastItem = childRects[childRects.length - 1]
    result = lastItem.top + lastItem.height
  }
  return {
    insertY: result,
    refId
  }
}

export const calInsertPositionForRow = (boundingRect: Partial<DOMRectReadOnly>,
  childRects: Array<Partial<DOMRectReadOnly> & { id: string }>,
  clientX: number): { insertX: number, refId: string } => {
  let result, refId
  let found = false
  childRects.some((rect, i) => {
    const rectX = rect.left + rect.width / 2
    if (rectX > clientX) {
      if (i === 0) { // insert before the first item
        result = rect.left
      } else { // insert between this and previous one
        const previousItem = childRects[i - 1]
        result = (rect.left + previousItem.left + previousItem.width) / 2
      }
      found = true
      refId = rect.id
    }
    return found
  })
  if (!found) { // insert after the last one
    const lastItem = childRects[childRects.length - 1]
    result = lastItem.left + lastItem.width
  }
  return {
    insertX: result,
    refId
  }
}

export const insertWidgetToLayout = async (
  layout: IMLayoutJson,
  itemProps: LayoutItemConstructorProps,
  insertIndex: number
) => {
  // This function always runs in builder, so builder's getAppConfigAction is invoked to avoid buidler-app sync issues.
  // This is a temporary solustion for 2024R03. We'll make a framework change in 2025R01 and revert this solution.
  const appConfigAction = parent._getAppConfigAction()
  const layoutInfo = await insertWidgetToLayoutAction(appConfigAction, layout, itemProps, insertIndex)
  if (layout.type === LayoutType.AccordionLayout) {
    const accordionWidgetId = layout.parent.id
    updateAccordionConfigAction(appConfigAction, accordionWidgetId, [layoutInfo])
  }
  appConfigAction.exec()
  return layoutInfo
}

export const insertWidgetToLayoutAction = async (
  appConfigAction: AppConfigAction,
  layout: IMLayoutJson,
  item: LayoutItemConstructorProps,
  insertIndex: number
) => {
  const layoutInfo = item.layoutInfo
  let newLayoutInfo: LayoutInfo
  if (layoutInfo && layoutInfo.layoutId && layoutInfo.layoutItemId) {
    const currentSizeMode = getAppStore().getState().browserSizeMode
    newLayoutInfo = appConfigAction.moveLayoutItem(item.layoutInfo, layout.id, currentSizeMode, currentSizeMode)
  } else if (item.uri) {
    const layoutItemId = await appConfigAction.addNewWidgetToLayout(layout.id, { uri: item.uri }, true)
    newLayoutInfo = { layoutId: layout.id, layoutItemId }
  }
  appConfigAction.adjustOrderOfItem(newLayoutInfo, insertIndex || 0, true)
  appConfigAction.editLayoutItemProperty(newLayoutInfo, 'bbox', {}, true)
  appConfigAction.editLayoutItemProperty(newLayoutInfo, 'setting', {}, true)
  return newLayoutInfo
}

export const applyChangeToOtherSizeModes = (appConfigAction: AppConfigAction, controllerId: string, otherSizeMode: BrowserSizeMode) => {
  const appConfig = appConfigAction.appConfig
  let sizeModeLayoutJson = appConfig.widgets[controllerId]?.layouts?.[BASE_LAYOUT_NAME]
  const otherLayoutId = sizeModeLayoutJson?.[otherSizeMode]
  if (otherLayoutId) {
    appConfigAction.removeSizeModeLayout(otherLayoutId, otherSizeMode)
    sizeModeLayoutJson = sizeModeLayoutJson.without(otherSizeMode)
    appConfigAction.editWidgetProperty(controllerId, `layouts.${BASE_LAYOUT_NAME}`, sizeModeLayoutJson)
  }
  const mainSizeMode = appConfig.mainSizeMode
  appConfigAction.createLayoutForSizeMode(
    otherSizeMode,
    mainSizeMode,
    sizeModeLayoutJson,
    LayoutParentType.Widget,
    controllerId,
    BASE_LAYOUT_NAME
  )
}

export const removeLayoutItem = (layoutInfo: LayoutInfo, controllerId?: string) => {
  const appConfigAction = getAppConfigAction()
  appConfigAction.removeLayoutItem(layoutInfo, true, true)
  const { layoutId, layoutItemId } = layoutInfo
  if (controllerId) {
    const config = appConfigAction.appConfig.widgets[controllerId]?.config as IMConfig
    const widgetId = appConfigAction.appConfig.layouts[layoutId]?.content?.[layoutItemId]?.widgetId
    if (Array.isArray(config?.behavior?.openStarts) && config.behavior.openStarts.includes(widgetId)) {
      const newConfig = config.setIn(['behavior', 'openStarts'], config.behavior.openStarts.filter(id => id !== widgetId))
      appConfigAction.editWidgetConfig(controllerId, newConfig)
    }
  }
  appConfigAction.exec()
  const state = getAppStore().getState()
  const selection = state.appRuntimeInfo.selection
  if (!selection || (selection?.layoutId === layoutInfo.layoutId && selection?.layoutItemId === layoutInfo.layoutItemId)) {
    const controllerLayoutInfo = state.appConfig.widgets[controllerId]?.parent?.[state.browserSizeMode]?.[0]
    getAppStore().dispatch(appActions.selectionChanged(controllerLayoutInfo))
  }
}

export const getWidgetItem = (widgetJson: IMWidgetJson, layoutInfo: LayoutInfo) => {
  if (!widgetJson || !layoutInfo) return null
  const widgetItem: LayoutItemConstructorProps = {
    id: widgetJson.id,
    layoutInfo: layoutInfo,
    itemType: LayoutItemType.Widget,
    manifest: widgetJson.manifest?.asMutable({ deep: true }),
    icon: typeof widgetJson.icon === 'string' ? widgetJson.icon : widgetJson.icon?.asMutable({ deep: true }),
    label: widgetJson.label
  }
  return widgetItem
}

export const groupWidgetsInAccordion = async (
  controllerLayout: ImmutableObject<LayoutJson>,
  sourceItem: LayoutItemConstructorProps,
  sourceIndex: number,
  targetItem: LayoutItemConstructorProps,
  targetIndex: number,
  sameLevel: boolean = true
) => {
  const appConfigAction = getAppConfigAction()
  // Add a new Accorion widget to the target's place
  const acccordionItem = {
    name: 'accordion',
    label: 'Group',
    uri: 'widgets/layout/accordion/',
    icon: null,
    itemType: LayoutItemType.Widget,
    manifest: {
      widgetType: WidgetType.Layout,
      properties: {}
    }
  } as LayoutItemConstructorProps
  const insertIndex = sameLevel && sourceIndex < targetIndex ? targetIndex - 1 : targetIndex
  const accordionLayoutInfo = await insertWidgetToLayoutAction(appConfigAction, controllerLayout, acccordionItem, insertIndex)
  const accordionWidgetId = appConfigAction.appConfig.layouts[controllerLayout.id]?.content?.[accordionLayoutInfo.layoutItemId]?.widgetId
  appConfigAction.editWidgetProperty(accordionWidgetId, 'label', getGroupLabel())
  appConfigAction.adjustOrderOfItem(accordionLayoutInfo, insertIndex, true)
  // Move the target and the source into the accordion
  const browserSizeMode = getAppStore().getState().browserSizeMode
  const accordionLayoutId = appConfigAction.appConfig.widgets?.[accordionWidgetId]?.layouts?.DEFAULT?.[browserSizeMode]
  const accordionLayout = appConfigAction.appConfig.layouts[accordionLayoutId]
  const targetLayoutInfo = await insertWidgetToLayoutAction(appConfigAction, accordionLayout, targetItem, 0)
  const sourceLayoutInfo = await insertWidgetToLayoutAction(appConfigAction, accordionLayout, sourceItem, 1)
  updateAccordionConfigAction(appConfigAction, accordionWidgetId, [targetLayoutInfo, sourceLayoutInfo])
  appConfigAction.exec()
  const groupedWidgetIds = sourceItem.id ? [sourceItem.id, targetItem.id] : [targetItem.id]
  getAppStore().dispatch(appActions.closeWidgets(groupedWidgetIds))
  const state = getAppStore().getState()
  const selection = state.appRuntimeInfo.selection
  if (
    !selection ||
    (selection?.layoutId === controllerLayout.id &&
    [sourceItem.layoutInfo?.layoutItemId, targetItem.layoutInfo?.layoutItemId].includes(selection?.layoutItemId))
  ) {
    const controllerId = controllerLayout.parent?.id
    const controllerLayoutInfo = state.appConfig.widgets[controllerId]?.parent?.[state.browserSizeMode]?.[0]
    getAppStore().dispatch(appActions.selectionChanged(controllerLayoutInfo))
  }
}

function getGroupLabel () {
  const intl = i18n.getIntl()
  return intl ? intl.formatMessage({ id: 'groupLabel' }) : 'Group'
}

function updateAccordionConfigAction (
  appConfigAction: AppConfigAction,
  accordionWidgetId: string,
  layoutInfos: LayoutInfo[]
) {
  const appConfig = appConfigAction.appConfig
  const accordionConfig = (appConfig.widgets[accordionWidgetId].config?.asMutable?.({ deep: true }) || {}) as AccordionConfig
  let updatedAccordionConfig = accordionConfig
  // Use the plain style
  if (accordionConfig.useQuickStyle !== 3) {
    updatedAccordionConfig = accordionStyle
  }
  const expandedItems = accordionConfig.expandedItems || []
  const widgetIds: string[] = []
  // Adjust height for newly added widgets
  for (const layoutInfo of layoutInfos) {
    const { layoutId, layoutItemId } = layoutInfo
    const widgetId = appConfig.layouts[layoutId]?.content?.[layoutItemId]?.widgetId
    const widgetJson = appConfig.widgets[widgetId]
    if (widgetId) widgetIds.push(widgetId)
    if (widgetJson.manifest.properties?.supportAutoSize) {
      appConfigAction.editLayoutItemProperty(layoutInfo, 'setting.autoProps.height', LayoutItemSizeModes.Auto, true)
    } else if (widgetJson.manifest.defaultSize?.height) {
      appConfigAction.editLayoutItemProperty(layoutInfo, 'bbox', { height: widgetJson.manifest.defaultSize.height + 'px' }, true)
    } else {
      appConfigAction.editLayoutItemProperty(layoutInfo, 'bbox', { height: 300 + 'px' }, true)
    }
  }
  // Make sure widgets inside are expanded by default
  updatedAccordionConfig.expandedItems = expandedItems.concat(widgetIds)
  appConfigAction.editWidgetConfig(accordionWidgetId, updatedAccordionConfig)
}
