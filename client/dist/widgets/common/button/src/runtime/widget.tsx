/** @jsx jsx */
import {
  React, LinkType, type AllWidgetProps, ExpressionPartType, ExpressionResolverErrorCode, type LinkResult, classNames,
  type IMExpression, jsx, ExpressionResolverComponent, Immutable, type IMState, AppMode, css, type IMIconProps, type SerializedStyles,
  getAppStore, type IMUrlParameters, type BrowserSizeMode, MessageManager, ButtonClickMessage
} from 'jimu-core'
import { styleUtils, Link, type ButtonProps, type LinkTarget, Icon, DistanceUnits, defaultMessages as jimuUiDefaultMessages } from 'jimu-ui'
import { type IMConfig, IconPosition, type IMWidgetState } from '../config'
import { getStyle } from './style'
import { versionManager } from '../version-manager'

interface State {
  text: string
  toolTip: string
  url: string
  textExpression: IMExpression
  tipExpression: IMExpression
  urlExpression: IMExpression
}

interface ExtraProps {
  active: boolean
  appMode: AppMode
  queryObject: IMUrlParameters
  isRTL: boolean
  browserSizeMode: BrowserSizeMode
  uri: string
}

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig> & ExtraProps, State> {
  domNode: React.RefObject<HTMLDivElement>
  lastClickTimestamp: number = null

  constructor (props) {
    super(props)
    this.state = {
      text: this.getTextFromProps(),
      toolTip: this.props.config?.functionConfig?.toolTip || '',
      url: this.props.config?.functionConfig?.linkParam?.value || '',
      textExpression: this.props.useDataSourcesEnabled && this.getTextExpression(),
      tipExpression: this.props.useDataSourcesEnabled && this.getTipExpression(),
      urlExpression: this.props.useDataSourcesEnabled && this.getUrlExpression()
    }
    this.domNode = React.createRef()
  }

  static mapExtraStateProps = (state: IMState, ownProps: AllWidgetProps<IMConfig>): ExtraProps => {
    let selected = false
    const selection = state.appRuntimeInfo.selection
    if (selection && state.appConfig.layouts[selection.layoutId]) {
      const layoutItem = state.appConfig.layouts[selection.layoutId].content[selection.layoutItemId]
      selected = layoutItem && layoutItem.widgetId === ownProps.id
    }
    const isInBuilder = state.appContext.isInBuilder
    const active = isInBuilder && selected

    return {
      active,
      appMode: state.appRuntimeInfo.appMode,
      queryObject: state.queryObject,
      isRTL: state.appContext.isRTL,
      browserSizeMode: state.browserSizeMode,
      uri: state.appConfig.widgets[ownProps.id]?.uri
    }
  }

  static versionManager = versionManager

  componentDidUpdate (prevProps: AllWidgetProps<IMConfig> & ExtraProps, prevState: State) {
    if (!this.props.useDataSourcesEnabled &&
      (
        this.props.config !== prevProps.config || prevProps.useDataSourcesEnabled
      )
    ) {
      this.setState({
        text: this.getTextFromProps(),
        toolTip: this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.toolTip,
        url: this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.linkParam && this.props.config.functionConfig.linkParam.value
      })
    }

    if (this.props.useDataSourcesEnabled &&
      (
        this.props.config !== prevProps.config || !prevProps.useDataSourcesEnabled
      )
    ) {
      this.setState({
        textExpression: this.getTextExpression(),
        tipExpression: this.getTipExpression(),
        urlExpression: this.getUrlExpression()
      })
    }
  }

  getTextFromProps = (): string => {
    return typeof this.props.config?.functionConfig?.text === 'string'
      ? this.props.config?.functionConfig?.text
      : this.props.intl.formatMessage({ id: 'variableButton', defaultMessage: jimuUiDefaultMessages.variableButton })
  }

  getTipExpression = (): IMExpression => {
    return (this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.toolTipExpression &&
      this.props.config.functionConfig.toolTipExpression) ||
      Immutable({
        name: '',
        parts: [{ type: ExpressionPartType.String, exp: `"${this.props.config?.functionConfig?.toolTip || ''}"` }]
      })
  }

  getTextExpression = (): IMExpression => {
    return (this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.textExpression &&
      this.props.config.functionConfig.textExpression) ||
      Immutable({
        name: '',
        parts: [{ type: ExpressionPartType.String, exp: `"${this.props.config?.functionConfig?.text || this.getTextFromProps()}"` }]
      })
  }

  getUrlExpression = (): IMExpression => {
    const expression = this.props.config && this.props.config.functionConfig && this.props.config.functionConfig.linkParam &&
      this.props.config.functionConfig.linkParam && this.props.config.functionConfig.linkParam.expression

    return expression || null
  }

  onTextExpResolveChange = result => {
    if (result.isSuccessful) {
      this.setState({ text: result.value })
    } else {
      let res: string = ''
      const errorCode = result.value
      if (errorCode === ExpressionResolverErrorCode.Failed) {
        res = this.state.textExpression && this.state.textExpression.name
      }

      this.setState({ text: res })
    }
  }

  onTipExpResolveChange = result => {
    if (result.isSuccessful) {
      this.setState({ toolTip: result.value })
    } else {
      this.setState({ toolTip: '' })
    }
  }

  onUrlExpResolveChange = result => {
    if (result.isSuccessful) {
      this.setState({ url: result.value })
    } else {
      let res: string = ''
      const errorCode = result.value
      if (errorCode === ExpressionResolverErrorCode.Failed) {
        res = this.state.urlExpression && this.state.urlExpression.name
      }

      this.setState({ url: res })
    }
  }

  getWhetherUseQuickStyle = (config: IMConfig): boolean => {
    return !!(config && config.styleConfig && config.styleConfig.themeStyle && config.styleConfig.themeStyle.quickStyleType)
  }

  getIconStyle = (regularIconProps: IMIconProps, hoverIconProps: IMIconProps): SerializedStyles => {
    const r = regularIconProps || ({} as IMIconProps)
    const h = hoverIconProps || ({} as IMIconProps)

    return css`
      & img, & svg{
        color: ${r.color};
        fill: ${r.color};
        width: ${r.size}${DistanceUnits.PIXEL};
        height: ${r.size}${DistanceUnits.PIXEL};
      }
      &:hover{
        img, svg{
          color: ${h.color};
          fill: ${h.color};
          width: ${h.size}${DistanceUnits.PIXEL};
          height: ${h.size}${DistanceUnits.PIXEL};
        }
      }
    `
  }

  removeUndefinedStyle = (style: React.CSSProperties): React.CSSProperties => {
    if (!style) {
      return style
    }
    const removedUndefinedStyle = {}
    Object.keys(style).forEach(styleName => {
      if ((typeof style[styleName] === 'string' && !style[styleName].includes('undefined')) ||
        typeof style[styleName] === 'number') {
        removedUndefinedStyle[styleName] = style[styleName]
      }
    })
    return removedUndefinedStyle
  }

  getLinkComponent = () => {
    const config = this.props.config
    const linkParam = config.functionConfig.linkParam
    const text = this.state.text
    const title = this.state.toolTip
    const iconProperty = config.functionConfig?.icon?.data?.properties
    const iconName = iconProperty?.isUploaded ? iconProperty?.originalName : iconProperty?.filename
    let accessibilityLabel = this.state.toolTip || text || iconName

    let customStyle
    let iconStyle
    if (config.styleConfig && config.styleConfig.customStyle) {
      const regular = config.styleConfig.customStyle.regular
      const hover = config.styleConfig.customStyle.hover
      if (config.styleConfig.useCustom) {
        const style = styleUtils.toCSSStyle(regular && regular.without('iconProps').asMutable({ deep: true })) as React.CSSProperties
        const originalHoverStyle = styleUtils.toCSSStyle(hover && hover.without('iconProps').asMutable({ deep: true })) as React.CSSProperties
        const hoverStyle = { ...style, ...originalHoverStyle }
        if (this.props.active && this.props.appMode !== AppMode.Run) {
          const widgetState: IMWidgetState = getAppStore().getState().widgetsState[this.props.id] || Immutable({})
          customStyle = {
            style: widgetState.isConfiguringHover
              ? { ...this.removeUndefinedStyle(style), ...this.removeUndefinedStyle(hoverStyle) }
              : style,
            hoverStyle
          }
          iconStyle = this.getIconStyle(
            widgetState.isConfiguringHover ? { ...regular?.iconProps, ...hover?.iconProps } : regular?.iconProps,
            hover?.iconProps
          )
        } else {
          customStyle = {
            style,
            hoverStyle
          }
          iconStyle = this.getIconStyle(regular && regular.iconProps, hover && hover.iconProps)
        }
      }
    }

    const useQuickStyle = this.getWhetherUseQuickStyle(config)
    const themeStyle: ButtonProps = useQuickStyle
      ? {
          type: config.styleConfig.themeStyle.quickStyleType
        }
      : {
          type: 'default'
        }

    const basicClassNames = 'widget-button-link text-truncate w-100 h-100 p-0 d-flex align-items-center justify-content-center'

    let queryObject
    let target: LinkTarget
    let linkTo: LinkResult
    if (linkParam && linkParam.linkType) {
      target = linkParam.openType
      linkTo = {
        linkType: linkParam.linkType
      } as LinkResult

      if (linkParam.linkType === LinkType.WebAddress) {
        linkTo.value = this.state.url
      } else {
        linkTo.value = linkParam.value
        queryObject = this.props.queryObject
      }
    }

    const icon = config.functionConfig.icon
    const isRTL = this.props.isRTL
    const leftIcon = icon && (!icon.position || icon.position === IconPosition.Left) && <Icon icon={icon.data.svg} className={classNames({ 'mr-2 ml-0': !!text && !isRTL, 'ml-2 mr-0': !!text && isRTL, 'mx-0': !text })} aria-hidden={true} />
    const rightIcon = icon && icon.position && icon.position === IconPosition.Right && <Icon icon={icon.data.svg} className={classNames({ 'ml-2 mr-0': !!text && !isRTL, 'mr-2 ml-0': !!text && isRTL, 'mx-0': !text })} aria-hidden={true} />

    if (target === '_blank') {
      accessibilityLabel = `${accessibilityLabel}, ${this.props.intl.formatMessage({ id: 'openInNewWindow' })}`
    }

    const autoSize = this.props.autoWidth && this.props.autoHeight
    const isIcon = icon && !text

    return <Link to={linkTo} target={target} queryObject={queryObject}
      title={title} className={basicClassNames} role='button'
      customStyle={customStyle} {...themeStyle} css={iconStyle}
      aria-label={accessibilityLabel}
    >
      <span className={classNames('text-truncate widget-button-text d-flex align-items-center', { 'auto-size-icon': autoSize && isIcon })}>
        {
          isRTL ? rightIcon : leftIcon
        }
        <span className='text-truncate'>{text}</span>
        {
          isRTL ? leftIcon : rightIcon
        }
      </span>
    </Link>
  }

  onClick = e => {
    const timestamp = (new Date()).getTime()
    // in case that both click and touchend be triggered in iOS
    if (this.lastClickTimestamp && timestamp - this.lastClickTimestamp < 200) return
    this.lastClickTimestamp = timestamp
    e.exbEventType = 'linkClick'
    MessageManager.getInstance().publishMessage(
      new ButtonClickMessage(this.props.id)
    )
  }

  render () {
    const isDataSourceUsed = this.props.useDataSourcesEnabled

    const LinkComponent = this.getLinkComponent()

    return (
      <div
        className="jimu-widget widget-button w-100 h-100"
        css={getStyle(this.props.theme)} ref={this.domNode}
        onClick={this.onClick}
        onTouchEnd={this.onClick}
        onKeyUp={evt => {
          if (evt.key === ' ' || evt.key === 'Enter') {
            this.onClick(evt)
          }
        }}
      >
        {LinkComponent}
        <div style={{ display: 'none' }}>
          {
            isDataSourceUsed &&
            <div>
              <ExpressionResolverComponent useDataSources={this.props.useDataSources} expression={this.state.textExpression}
                onChange={this.onTextExpResolveChange} widgetId={this.props.id}
              />
              <ExpressionResolverComponent useDataSources={this.props.useDataSources} expression={this.state.tipExpression}
                onChange={this.onTipExpResolveChange} widgetId={this.props.id}
              />
              <ExpressionResolverComponent useDataSources={this.props.useDataSources} expression={this.state.urlExpression}
                onChange={this.onUrlExpResolveChange} widgetId={this.props.id}
              />
            </div>
          }
        </div>
      </div>
    )
  }
}
