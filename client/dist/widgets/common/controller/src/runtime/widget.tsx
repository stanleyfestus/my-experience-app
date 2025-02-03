/** @jsx jsx */
import { React, jsx, css, type AllWidgetProps, type IMState, AppMode, ReactRedux, hooks } from 'jimu-core'
import { type ControllerButtonStyle, type IMConfig, type IMControllerButtonStylesByState } from '../config'
import { Runtime } from './runtime/runtime'
import { WIDGET_ITEM_SIZES } from '../common/consts'
import { styleUtils } from 'jimu-ui'
import { versionManager } from '../version-manager'

export type ControllerWidgetProps = AllWidgetProps<IMConfig>

const useStyle = (autoSize: boolean, autoWidth: boolean, autoHeight: boolean) => {
  const minWidth = !autoSize ? WIDGET_ITEM_SIZES.sm : 0
  const minHeight = !autoSize ? WIDGET_ITEM_SIZES.sm : 0
  const px = autoWidth ? '5px' : 0
  const py = autoHeight ? '5px' : 0
  return React.useMemo(() => {
    return css`
      overflow: visible;
      white-space: nowrap;
      .controller-container {
        width: 100%;
        height: 100%;
        padding: ${py} ${px};
        min-width:  ${minWidth}px;
        min-height: ${minHeight}px;
      }
    `
  }, [px, py, minWidth, minHeight])
}

const getAdvancedStyle = (style: ControllerButtonStyle, type?: 'regular' | 'active' | 'hover') => {
  const { bg, iconColor, boxShadow, color, italic, bold, underline, strike } = style || {}
  const textDecoration = styleUtils.toCSSTextUnderLine({ underline: underline, strike: strike })

  let activeIndicator = css``
  if (type === 'active') {
    activeIndicator = css`::after {
      background-color: ${bg};
    }`
  }

  return css`
    >.avatar {
      >.avatar-button {
        ${bg ? css`background-color: ${bg}; border-color: ${bg};` : ''}
        ${iconColor ? css`color: ${iconColor};` : ''}
        ${boxShadow?.color ? css`box-shadow: ${styleUtils.toCSSBoxshadow(boxShadow)};` : ''}
      }
      ${activeIndicator}
    }
    >.avatar-label {
      ${color ? css`color: ${color};` : ''}
      ${italic ? css`font-style: italic;` : ''}
      ${bold ? css`font-weight: bold;` : ''}
      ${underline || strike ? css`text-decoration: ${textDecoration};` : ''}
    }
  `
}

export const useAdvancedStyle = (variant: IMControllerButtonStylesByState, advanced: boolean) => {
  const regular = variant?.default
  const originalActive = variant?.active
  const active = regular && originalActive ? regular.merge(originalActive) : originalActive
  const originalHover = variant?.hover
  const hover = regular && originalHover ? regular.merge(originalHover) : originalHover

  return React.useMemo(() => {
    const regularStyle = advanced && regular ? getAdvancedStyle(regular, 'regular') : ''
    // The button component changed the default bg of active state in 2024R03.
    // So controller need to add back to keep backward compitable.
    const defaultActiveStyle = getAdvancedStyle({ bg: 'var(--sys-color-primary-dark)' }, 'active')
    const activeStyle = advanced && active ? getAdvancedStyle(active, 'active') : ''
    const hoverStyle = advanced && hover ? getAdvancedStyle(hover, 'hover') : ''
    return css`
      .avatar-card {
        ${regularStyle}
        ${css`&.active:not(.disabled) { ${defaultActiveStyle} }`}
        ${activeStyle ? css`&.active:not(.disabled) { ${activeStyle} }` : ''}
        ${hoverStyle ? css`&:hover { ${hoverStyle} }` : ''}
      }
    `
  }, [advanced, regular, active, hover])
}

const ControllerWidget = (props: ControllerWidgetProps) => {
  const { builderSupportModules, id, config, onInitResizeHandler, onInitDragHandler, autoWidth, autoHeight } = props
  const onlyOpenOne = config.behavior?.onlyOpenOne
  const displayType = config.behavior?.displayType
  const vertical = config?.behavior?.vertical
  const advanced = config?.appearance.advanced
  const variant = config?.appearance?.card.variant
  const autoSize = vertical ? autoHeight : autoWidth

  const isInBuilder = ReactRedux.useSelector(
    (state: IMState) => state.appContext.isInBuilder
  )
  const appMode = ReactRedux.useSelector((state: IMState) => state.appRuntimeInfo.appMode)

  React.useEffect(() => {
    onInitResizeHandler?.(null, null, () => {
      setVersion((v) => v + 1)
    })
  }, [onInitResizeHandler])

  React.useEffect(() => {
    onInitDragHandler?.(null, null, () => {
      setVersion((v) => v + 1)
    })
  }, [onInitDragHandler])

  const isBuilder = isInBuilder && appMode !== AppMode.Run
  const Builder = isBuilder && builderSupportModules.widgetModules.Builder
  const [version, setVersion] = React.useState(0)

  hooks.useUpdateEffect(() => {
    setVersion((v) => v + 1)
  }, [onlyOpenOne, displayType, appMode])

  const style = useStyle(autoSize, autoWidth, autoHeight)
  const advancedStyle = useAdvancedStyle(variant, advanced)
  return (
    <div
      className='widget-controller jimu-widget rw-controller'
      css={[style, advancedStyle]}
    >
      <div className='controller-container'>
        {!isBuilder && (
          <Runtime
            id={id}
            version={version}
            config={config}
            autoSize={autoSize}
          ></Runtime>
        )}
        {isBuilder && Builder && (
          <Builder
            id={id}
            version={version}
            config={config}
            autoSize={autoSize}
          ></Builder>
        )}
      </div>
    </div>
  )
}

ControllerWidget.versionManager = versionManager

export default ControllerWidget
