/** @jsx jsx */
import { React, classNames, WidgetState, type IMRuntimeInfos, Immutable, jsx, css, ReactResizeDetector } from 'jimu-core'
import { Popper, type Placement } from 'jimu-ui'
import { WidgetRenderer } from './widget-renderer'
import { SINGLE_POPPER_MODIFIERS } from '../../common/consts'
import { getWidgetButtonNode } from './utils'
import { getLayoutItemId } from '../common/layout-utils'
import { type CommonLauncherProps } from './widgets-launcher'

export interface OffPanelWidgetsLuncherProps extends CommonLauncherProps {
  root: HTMLDivElement
  placement: Placement
}

const getPopperStyle = () => {
  return css`
    border-radius: 0;
    max-width: 100vw;
    overflow: hidden;
    .widget-content {
      padding: 0 !important;
    }
  `
}

const DefaultWidgets = Immutable({}) as IMRuntimeInfos
export const OffPanelWidgetsLuncher = (props: OffPanelWidgetsLuncherProps) => {
  const { widgets = DefaultWidgets, root, placement, layout, onClick, onClose } = props
  const [versions, setVersions] = React.useState({})
  const handleResize = React.useCallback((id: string) => {
    setVersions(oldVersions => ({ ...oldVersions, [id]: (oldVersions[id] || 0) + 1 }))
  }, [])

  return <React.Fragment>
    {Object.entries(widgets).map(([id, runtimeInfo]) => {
      const opened = runtimeInfo.state !== undefined
      if (!opened) return null
      const opening = runtimeInfo.state !== WidgetState.Closed
      let reference = getWidgetButtonNode(id)
      // no `offsetParent` means dom is hidden by style
      if (!reference || !reference.offsetParent) {
        reference = root?.querySelector('.popup-more-button button') || root?.querySelector('.avatar-button')
      }
      const layoutId = layout?.id
      const layoutItemId = getLayoutItemId(layout, id)

      return <Popper
        key={id}
        version={versions[id] || 0}
        css={getPopperStyle()}
        modifiers={SINGLE_POPPER_MODIFIERS}
        className={classNames({ 'd-none': !opening }, 'off-panel-widget-launcher')}
        dragBounds="body"
        open={true}
        autoFocus={opening}
        reference={reference}
        toggle={(evt, type) => { if (type === 'escape') onClose(evt, id) }}
        onClick={(evt) => { onClick(evt, id) }}
        placement={placement}>
        <WidgetRenderer widgetId={id} layoutId={layoutId} layoutItemId={layoutItemId}></WidgetRenderer>
        <ReactResizeDetector onResize={() => { handleResize(id) }} />
      </Popper>
    })}
  </React.Fragment>
}
