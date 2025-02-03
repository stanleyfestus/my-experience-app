/** @jsx jsx */
import { React, classNames, WidgetState, type IMRuntimeInfos, Immutable, type IMState, ReactRedux, jsx, AppMode } from 'jimu-core'
import { type IMSizeMap } from '../../config'
import { Popper, type Placement } from 'jimu-ui'
import { WidgetRenderer } from './widget-renderer'
import { DEFAULT_PANEL_SIZE, MIN_PANEL_SIZE, SINGLE_POPPER_MODIFIERS } from '../../common/consts'
import { getWidgetButtonNode, ResizerTooltip } from './utils'
import { getLayoutItemId } from '../common/layout-utils'
import { type FloatingLauncherProps } from './widgets-launcher'

export interface SingleWidgetsLuncherProps extends FloatingLauncherProps {
  root: HTMLDivElement
  placement: Placement
}

const DefaultWidgets = Immutable({}) as IMRuntimeInfos
export const SingleWidgetsLuncher = (props: SingleWidgetsLuncherProps) => {
  const { widgets = DefaultWidgets, root, placement, sizes: propSizes, layout, onResizeStop, onClick, onClose } = props
  const widgetsJson = ReactRedux.useSelector((state: IMState) => state.appConfig.widgets)

  const [sizes, setSizes] = React.useState<IMSizeMap>(propSizes)
  const [isResizing, setIsResizing] = React.useState(false)
  const handleResize = (widgetId: string, value) => {
    setSizes((sizes) => sizes.set(widgetId, value))
    setIsResizing(true)
  }
  const handleResizeStop = (widgetId: string, value) => {
    onResizeStop?.(widgetId, value)
    setIsResizing(false)
  }

  const isRuntime = ReactRedux.useSelector((state: IMState) => state.appRuntimeInfo.appMode === AppMode.Run)
  const resizeHandle = <ResizerTooltip isRuntime={isRuntime} isResizing={isResizing} />

  return <React.Fragment>
    {Object.entries(widgets).map(([id, runtimeInfo]) => {
      const opened = runtimeInfo.state !== undefined
      if (!opened) return null
      const opening = runtimeInfo.state !== WidgetState.Closed
      const size = sizes[id] ?? DEFAULT_PANEL_SIZE
      const title = widgetsJson?.[id]?.label
      let reference = getWidgetButtonNode(id)
      // no `offsetParent` means dom is hidden by style
      if (!reference || !reference.offsetParent) {
        reference = root?.querySelector('.popup-more-button button') || root?.querySelector('.avatar-card')
      }
      const layoutId = layout?.id
      const layoutItemId = getLayoutItemId(layout, id)

      return <Popper
        key={id}
        style={{ maxWidth: '100vw' }}
        modifiers={SINGLE_POPPER_MODIFIERS}
        className={classNames({ 'd-none': !opening }, 'single-widget-launcher')}
        headerTitle={title}
        activateOnlyForHeader={true}
        minSize={MIN_PANEL_SIZE}
        dragBounds="body"
        defaultSize={size}
        resizeHandle={resizeHandle}
        onResize={(size) => { handleResize(id, size) }}
        onResizeStop={(size) => { handleResizeStop(id, size) }}
        onHeaderClose={evt => { onClose(evt, id) }}
        showHeaderCollapse={true}
        floating={true}
        open={true}
        autoFocus={opening}
        reference={reference}
        onClick={(evt) => { onClick(evt, id) }}
        placement={placement}>
        <WidgetRenderer widgetId={id} layoutId={layoutId} layoutItemId={layoutItemId}></WidgetRenderer>
      </Popper>
    })}
  </React.Fragment>
}
