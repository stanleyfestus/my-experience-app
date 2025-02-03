/**@jsx jsx */
import { React, jsx, ReactRedux, type IMState, appActions, getAppStore, hooks, Immutable, type Size, AppMode, type LayoutInfo } from 'jimu-core'
import { type IMSizeMap, type IMConfig } from '../../config'
import { BASE_LAYOUT_NAME } from '../../common/consts'
import { getAppConfigAction } from 'jimu-for-builder'
import { isWidgetOpening, useControlledWidgets } from '../common/layout-utils'
import { ListPlaceholder } from '../common'
import { LayoutList } from './layout/layout-list'
import { PageContext } from 'jimu-layouts/layout-runtime'
import WidgetsLauncher from '../runtime/widgets-launcher'
import WidgetToolbar from './widget-toolbar'
import { toggleWidget } from '../runtime/utils'
import { type ResponsiveViewportResult } from '../common/scroll-list/utils'
import useManageWidgets from './use-manage-widgets'
import useAddWidget from './use-add-widget'

export interface BuilderProps {
  id: string
  config: IMConfig
  version?: number
  autoSize?: boolean
}

export const Builder = (props: BuilderProps) => {
  const { id, config, version, autoSize } = props

  const mobile = hooks.useCheckSmallBrowserSizeMode()
  const { viewOnly } = React.useContext(PageContext)
  const isExpressMode = ReactRedux.useSelector((state: IMState) => state.appRuntimeInfo.appMode === AppMode.Express)
  const rootRef = React.useRef<HTMLDivElement>(null)

  //Get all open state widgets in controller
  const widgets = useControlledWidgets(id, BASE_LAYOUT_NAME)
  const showPlaceholder = !Object.keys(widgets ?? {}).length

  React.useEffect(() => {
    // After adding the first widget or removing the last widget, update the "manage widgets" tool state.
    getAppStore().dispatch(appActions.widgetToolbarStateChange(id, ['controller-manage-widgets']))
  }, [id, showPlaceholder])

  const handleScrollStatusChange = React.useCallback((hideArrow: boolean, disablePrevious?: boolean, disableNext?: boolean) => {
    getAppStore().dispatch(appActions.widgetStatePropChange(id, 'hideArrow', hideArrow))
    getAppStore().dispatch(appActions.widgetStatePropChange(id, 'disablePrevious', disablePrevious))
    getAppStore().dispatch(appActions.widgetStatePropChange(id, 'disableNext', disableNext))
    getAppStore().dispatch(appActions.widgetToolbarStateChange(id, ['controller-previous', 'controller-next']))
  }, [id])

  //Synchronize the state and method of scroll-list component to toolbar
  const syncScroll = React.useCallback((scroll: ResponsiveViewportResult['scroll']) => {
    getAppStore().dispatch(appActions.widgetStatePropChange(id, 'onArrowClick', scroll))
  }, [id])

  const clickXY = React.useRef([0, 0])
  const widgetIds = Object.keys(widgets)
  const openingWidgets = widgetIds.filter((widgetId) => isWidgetOpening(widgets[widgetId]))
  const onlyOpenOne = config.behavior?.onlyOpenOne
  const keepOneOpened = mobile ? true : onlyOpenOne
  const notMainSizeMode = ReactRedux.useSelector((state: IMState) => state.browserSizeMode !== state.appConfig.mainSizeMode)
  const handleItemClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    const reference = evt.currentTarget
    const widgetId = reference.dataset?.widgetid
    const isDragging = clickXY.current[0] !== evt.clientX || clickXY.current[1] !== evt.clientY
    if (!widgetId || isDragging) return
    if (!openingWidgets.includes(widgetId)) {
      evt.stopPropagation()
    }
    toggleWidget(id, widgetId, openingWidgets, keepOneOpened, !viewOnly && !(isExpressMode && notMainSizeMode))
  }
  const handleMouseDown: React.MouseEventHandler = (e) => {
    clickXY.current = [e.clientX, e.clientY]
  }

  const onWidgetSizeChanged = (widgetId: string, _size: Size) => {
    if (!widgetId) {
      return
    }
    let size = config?.behavior.size || Immutable({}) as IMSizeMap
    size = size.set(widgetId, _size)
    const newConfig = config.setIn(['behavior', 'size'], size)
    getAppConfigAction().editWidgetConfig(id, newConfig).exec()
  }

  const vertical = config.behavior.vertical
  const itemStyle = config.appearance.card
  const space = config.appearance.space
  const alignment = config.behavior.alignment
  const overflownStyle = config.behavior.overflownStyle

  const placeholder = React.useMemo(() => <ListPlaceholder
    size={itemStyle.avatar?.size}
    space={vertical ? space : itemStyle.labelGrowth}
    vertical={vertical}
    alignment={alignment}
  />, [alignment, itemStyle.avatar?.size, itemStyle.labelGrowth, space, vertical])

  // In express, open and select the widget after adding
  const openingWidgetsRef = hooks.useLatest(openingWidgets)
  const afterAddWidget = React.useCallback((layoutInfo: LayoutInfo) => {
    if (layoutInfo && isExpressMode) {
      getAppStore().dispatch(appActions.selectionChanged(layoutInfo))
      const widgetId = getAppStore().getState().appConfig.layouts[layoutInfo.layoutId]?.content?.[layoutInfo.layoutItemId]?.widgetId
      setTimeout(() => {
        toggleWidget(id, widgetId, openingWidgetsRef.current, keepOneOpened)
      }, 50)
    }
  }, [id, isExpressMode, keepOneOpened, openingWidgetsRef])

  useAddWidget(id, afterAddWidget)
  useManageWidgets(id)

  return <div className='controller-builder w-100 h-100' ref={rootRef}>
    <WidgetsLauncher
      id={id}
      config={config}
      version={version}
      rootRef={rootRef}
      onResizeStop={onWidgetSizeChanged}
    />
    {!isExpressMode && <WidgetToolbar id={id} />}
    <LayoutList
      autoSize={autoSize}
      syncScroll={syncScroll}
      onScrollStatusChange={handleScrollStatusChange}
      vertical={vertical}
      controllerId={id}
      onItemClick={handleItemClick}
      onMouseDown={handleMouseDown}
      itemStyle={itemStyle}
      draggable={true}
      markerEnabled={!viewOnly && !isExpressMode}
      space={space}
      alignment={alignment}
      overflownStyle={overflownStyle}
      placeholder={showPlaceholder ? placeholder : null}
      advanced={config.appearance.advanced}
    />
  </div>
}
