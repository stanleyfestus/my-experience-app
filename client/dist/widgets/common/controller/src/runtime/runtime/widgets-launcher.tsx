/**@jsx jsx */
import {
  React, jsx, appActions, getAppStore, type Size, hooks, ReactRedux, ContainerType,
  type IMSectionNavInfo, type IMState, LayoutItemType, type IMRuntimeInfos, type IMLayoutJson,
  AppMode
} from 'jimu-core'
import { type IMSizeMap, type IMConfig } from '../../config'
import { BASE_LAYOUT_NAME, DEFAULT_WIDGET_START_POSITION, DEFAULT_PANEL_SIZE, DEFAULT_PANEL_SPACE } from '../../common/consts'
import { getLayoutItemId, isWidgetOpening, useControlledWidgets, useWidgetChildLayoutJson } from '../common/layout-utils'
import { MobileWidgetLuncher } from './mobile-widget-luncher'
import { MultipleWidgetsLuncher } from './multiple-widgets-luncher'
import { SingleWidgetsLuncher } from './single-widget-luncher'
import { getMoreButtonNode, getWidgetButtonNode } from './utils'
import { PageContext, searchUtils } from 'jimu-layouts/layout-runtime'
import { OffPanelWidgetsLuncher } from './off-panel-widget-launcher'

interface WidgetsLauncherProps {
  id: string
  config: IMConfig
  version: number
  rootRef: React.RefObject<HTMLDivElement>
  onResizeStop?: (widgetId: string, size: Size) => void
}

export interface CommonLauncherProps {
  widgets: IMRuntimeInfos
  layout: IMLayoutJson
  onClick: (evt: React.MouseEvent<HTMLDivElement>, widgetId: string) => void
  onClose?: (evt: React.MouseEvent<any> | React.KeyboardEvent<any> | React.TouchEvent<any>, widgetId: string) => void
}

export interface FloatingLauncherProps extends CommonLauncherProps {
  sizes: IMSizeMap
  onResizeStop?: (widgetId: string, size: Size) => void
}

//If current widget place in map widget, the id of map widget will be passed to the mobile panel
export const useContainerMapId = (id: string): string => {
  return ReactRedux.useSelector((state: IMState) => {
    const appConfig = state.appConfig
    const browserSizeMode = state.browserSizeMode
    const layoutInfosObject = appConfig.widgets[id].parent
    let layoutInfos = layoutInfosObject[browserSizeMode] ?? []
    // In Auto mode, SMALL and MEDIUM do not own a layout. So adopt LARGE's layout.
    if (layoutInfos.length === 0) {
      const mainSizeMode = appConfig.mainSizeMode
      layoutInfos = layoutInfosObject[mainSizeMode] ?? []
    }
    const layoutId = layoutInfos[0]?.layoutId
    const containerId = searchUtils.getWidgetIdThatUseTheLayoutId(appConfig, layoutId)
    const container = appConfig.widgets[containerId]
    return container?.manifest?.name === 'arcgis-map' ? container.id : ''
  })
}

/**
 * Get the section where the view is located.
 * @param viewId
 */
export const getParentSection = (viewId: string) => {
  const appConfig = getAppStore().getState().appConfig
  const sections = appConfig.sections
  const section = Object.values(sections ?? {}).find((section) => section.views?.includes(viewId))
  return section?.id
}

/**
 * Get all activated views.
 * @param sectionNavInfos
 */
export const getActiveViews = (sectionNavInfos: IMSectionNavInfo) => {
  const appConfig = getAppStore().getState().appConfig
  const sections = appConfig.sections
  const activedViews = sectionNavInfos ? Object.values(sectionNavInfos).map((section) => section.currentViewId) : []
  const activedSections = activedViews.map(getParentSection)
  const defaultActivedViews = Object.values(sections ?? {}).map(section => {
    if (!activedSections.includes(section.id)) {
      return section.views?.[0]
    }
    return undefined
  }).filter((view) => !!view)
  const views = activedViews
  defaultActivedViews.forEach((view) => {
    if (!activedViews.includes(view)) {
      views.push(view)
    }
  })
  return views
}

/**
 * Check whether current widget is hidden in section view or not.
 * @param sectionNavInfos
 * @param id
 */
const getWhetherWidgetVisible = (sectionNavInfos: IMSectionNavInfo, id: string) => {
  const activedViews = getActiveViews(sectionNavInfos)
  const browserSizeMode = getAppStore().getState().browserSizeMode
  const appConfig = getAppStore().getState().appConfig
  const info = searchUtils.getContentContainerInfo(appConfig, id, LayoutItemType.Widget, browserSizeMode)

  let visible = true

  if (!info) return visible

  if (info.type === ContainerType.View) {
    if (!activedViews.includes(info.id)) {
      visible = false
    } else {
      const parentViewId = info.id
      const parentSectionId = getParentSection(parentViewId)
      const sectionContainerViewInfo = searchUtils.getContentContainerInfo(appConfig, parentSectionId, LayoutItemType.Section, browserSizeMode)

      if (sectionContainerViewInfo && sectionContainerViewInfo.type === ContainerType.View) {
        if (!activedViews.includes(sectionContainerViewInfo.id)) {
          visible = false
        }
      }
    }
  }
  return visible
}

export const useWhetherWidgetVisible = (id: string): boolean => {
  const sectionNavInfos = ReactRedux.useSelector((state: IMState) => state.appRuntimeInfo?.sectionNavInfos)
  return getWhetherWidgetVisible(sectionNavInfos, id)
}

export default function WidgetsLauncher (props: WidgetsLauncherProps) {
  const { id, config, version, rootRef, onResizeStop } = props
  const { viewOnly } = React.useContext(PageContext)

  // mode: mobile, single, multiple
  const mobile = hooks.useCheckSmallBrowserSizeMode()
  const onlyOpenOne = config.behavior?.onlyOpenOne
  const arrangement = config?.behavior?.arrangement ?? 'floating'
  const singleFloatingMode = onlyOpenOne && arrangement === 'floating'
  const multiFloatingMode = !onlyOpenOne && arrangement === 'floating'

  // common props
  const layout = useWidgetChildLayoutJson(id, BASE_LAYOUT_NAME)
  const handleClickWidget = React.useCallback((evt: React.MouseEvent<HTMLDivElement>, widgetId: string) => {
    evt.stopPropagation()
    const state = getAppStore().getState()
    const isExpressMode = state.appRuntimeInfo.appMode === AppMode.Express
    const notMainSizeMode = state.browserSizeMode !== state.appConfig.mainSizeMode
    if (viewOnly || (isExpressMode && notMainSizeMode)) return
    const layoutId = layout?.id
    const layoutItemId = getLayoutItemId(layout, widgetId)
    const selection = getAppStore().getState().appRuntimeInfo?.selection

    if (!selection || selection.layoutId !== layoutId || selection.layoutItemId !== layoutItemId) {
      getAppStore().dispatch(appActions.selectionChanged({ layoutId, layoutItemId }))
    }
  }, [layout, viewOnly])
  const handleCloseWidget = React.useCallback((evt: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>, widgetId: string) => {
    if (!widgetId) return
    evt?.stopPropagation()
    evt?.preventDefault()
    getAppStore().dispatch(appActions.closeWidget(widgetId))
    const widgetButtonNode = getWidgetButtonNode(widgetId) || getMoreButtonNode(id)
    widgetButtonNode?.focus?.()
    getAppStore().dispatch(appActions.selectionChanged(null))
  }, [id])

  // mobile props
  const containerMapId = useContainerMapId(id)

  // single & off panel props
  const placement = !config.behavior?.vertical ? 'bottom-start' : 'right-start'

  // multiple props
  const displayType = config.behavior?.displayType
  const isRTL = getAppStore()?.getState()?.appContext?.isRTL
  const widgetsLuncherStart = React.useMemo(() => {
    return isRTL ? { ...DEFAULT_WIDGET_START_POSITION, x: document.body.clientWidth - DEFAULT_PANEL_SIZE.width - DEFAULT_WIDGET_START_POSITION.x } : DEFAULT_WIDGET_START_POSITION
  }, [isRTL])
  const widgetsLuncherSpace = React.useMemo(() => isRTL ? { ...DEFAULT_PANEL_SPACE, x: -DEFAULT_PANEL_SPACE.x } : DEFAULT_PANEL_SPACE, [isRTL])

  // single & multiple props
  const size = config.behavior?.size

  const widgets = useControlledWidgets(id, BASE_LAYOUT_NAME)
  const latestWidgets = hooks.useLatest(widgets)
  const widgetIds = Object.keys(widgets)
  const closeWidgets = React.useCallback(() => {
    const widgets = latestWidgets.current
    const widgetIds = Object.keys(widgets)
    const openingWidgets = widgetIds.filter((widgetId) => isWidgetOpening(widgets[widgetId]))
    getAppStore().dispatch(appActions.closeWidgets(openingWidgets))
  }, [latestWidgets])

  // When version changed(it means in builder and related config changed), reset widgets' state
  hooks.useUpdateEffect(() => {
    getAppStore().dispatch(appActions.resetWidgetsState(widgetIds))
  }, [version])
  // When currentPageId changed, close opening widgets
  const currentPageId = ReactRedux.useSelector((state: IMState) => state.appRuntimeInfo.currentPageId)
  hooks.useUpdateEffect(() => {
    closeWidgets()
  }, [currentPageId])
  // When visible changed, close opening widgets/open at start widgets
  const visible = useWhetherWidgetVisible(id)
  const isInBuilder = ReactRedux.useSelector((state: IMState) => state.appContext.isInBuilder)
  const openStarts = config.behavior?.openStarts as unknown as string[]
  hooks.useUpdateEffect(() => {
    if (!visible) {
      closeWidgets()
    } else if (!isInBuilder && openStarts?.length > 0) {
      setTimeout(() => {
        getAppStore().dispatch(appActions.openWidgets(openStarts))
      }, 1000)
    }
  }, [visible])

  //When widget mounted, trigger open at start widgets
  React.useEffect(() => {
    if (isInBuilder) {
      getAppStore().dispatch(appActions.resetWidgetsState(widgetIds))
    } else if (openStarts?.length && visible) {
      setTimeout(() => {
        getAppStore().dispatch(appActions.openWidgets(openStarts))
      }, 1000)
    }
    // When widget unmount, close opening widgets
    return () => {
      closeWidgets()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const widgetIdsOffPanel = ReactRedux.useSelector((state: IMState) => {
    const widgetsJson = state.appConfig.widgets
    return widgetIds.filter(widgetId => widgetsJson[widgetId].offPanel).join(',')
  }, ReactRedux.shallowEqual)

  const widgetIdsInPanel = widgetIds.filter(widgetId => !widgetIdsOffPanel.split(',').includes(widgetId)).join(',')

  const widgetsOffPanel = React.useMemo(() => {
    return widgets.without.apply(widgets, widgetIdsInPanel.split(','))
  }, [widgetIdsInPanel, widgets])

  const widgetsInPanel = React.useMemo(() => {
    return widgets.without.apply(widgets, widgetIdsOffPanel.split(','))
  }, [widgetIdsOffPanel, widgets])

  return <React.Fragment>
    {
      mobile && <MobileWidgetLuncher
        containerMapId={containerMapId}
        layout={layout}
        widgets={widgets}
        onClick={handleClickWidget}
        onClose={handleCloseWidget}
      />
    }
    {!mobile && singleFloatingMode && <SingleWidgetsLuncher
      sizes={size}
      root={rootRef.current}
      placement={placement}
      widgets={widgetsInPanel}
      layout={layout}
      onResizeStop={onResizeStop}
      onClick={handleClickWidget}
      onClose={handleCloseWidget}
    />}
    {!mobile && multiFloatingMode && <MultipleWidgetsLuncher
      sizes={size}
      mode={displayType}
      start={widgetsLuncherStart}
      spaceX={widgetsLuncherSpace.x}
      spaceY={widgetsLuncherSpace.y}
      widgets={widgetsInPanel}
      layout={layout}
      onResizeStop={onResizeStop}
      onClick={handleClickWidget}
      onClose={handleCloseWidget}
    />}
    {!mobile && <OffPanelWidgetsLuncher
      root={rootRef.current}
      placement={placement}
      widgets={widgetsOffPanel}
      layout={layout}
      onClick={handleClickWidget}
      onClose={handleCloseWidget}
    />}
  </React.Fragment>
}
