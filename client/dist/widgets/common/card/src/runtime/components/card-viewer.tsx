/** @jsx jsx */
import {
  jsx,
  React,
  type DataRecord,
  type ImmutableObject,
  type UrlParameters,
  getNextAnimationId
} from 'jimu-core'
import { styleUtils } from 'jimu-ui'
import { Status } from '../../config'
import Card, { type CardProps, type CardStates } from './card-base'
import { type IMLinkParam } from 'jimu-ui/advanced/setting-components'
import CardContent from './card-content'

interface ListCardViewerProps extends CardProps {
  /**
   * one or more expressions
   */
  linkParam?: IMLinkParam
  queryObject: ImmutableObject<UrlParameters>
  LayoutEntry?: any
}

interface ListCardViewerStates extends CardStates {
  url: string
  isHover: boolean
  previousIndex: number
  currentIndex: number
  regularPlayId: number
  hoverPlayId: number
}

export default class CardViewer extends Card<
ListCardViewerProps,
ListCardViewerStates
> {
  regularLayoutRef: any
  hoverLayoutRef: any
  linkRef: React.RefObject<HTMLButtonElement>
  expressionRecords: { [key: string]: DataRecord }
  didMount: boolean
  constructor (props) {
    super(props)

    this.state = {
      url: '',
      isHover: false,
      previousIndex: 1,
      currentIndex: 0,
      regularPlayId: null,
      hoverPlayId: null
    }

    this.regularLayoutRef = React.createRef()
    this.hoverLayoutRef = React.createRef()
    this.linkRef = React.createRef<HTMLButtonElement>()
    this.didMount = false
  }

  componentDidMount () {
    this.didMount = true
  }

  componentDidUpdate (prevProps) {
    const oldCardConfig = this.props.cardConfigs
    const { cardConfigs } = prevProps
    const isPreviewIdChange =
      oldCardConfig?.transitionInfo?.previewId ===
      cardConfigs?.transitionInfo?.previewId
    if (!isPreviewIdChange) {
      this.setState({
        hoverPlayId: getNextAnimationId(),
        regularPlayId: getNextAnimationId()
      })
    }
  }

  onMouse = (evt, isHover = false) => {
    const { cardConfigs } = this.props
    const isHoverEnable = cardConfigs?.HOVER?.enable
    let { previousIndex, currentIndex, hoverPlayId, regularPlayId } = this.state
    if (isHoverEnable) {
      previousIndex = isHover ? 0 : 1
      currentIndex = isHover ? 1 : 0
      hoverPlayId = isHover ? getNextAnimationId() : null
      regularPlayId = isHover ? null : getNextAnimationId()
    }
    this.setState({
      isHover: isHover,
      previousIndex: previousIndex,
      currentIndex: currentIndex,
      hoverPlayId: hoverPlayId,
      regularPlayId: regularPlayId
    })
  }

  getCardShadowStyle = () => {
    const { cardConfigs } = this.props
    const { isHover } = this.state
    const isShowHoverBoxShadow = isHover && cardConfigs[Status.Hover].enable
    const status = isShowHoverBoxShadow ? Status.Hover : Status.Default
    const style = {
      boxShadow: cardConfigs[status].backgroundStyle?.boxShadow,
      borderRadius: cardConfigs[status].backgroundStyle?.borderRadius
    }

    const cardShadowStyle: any = {
      ...styleUtils.toCSSStyle(style as any)
    }
    return cardShadowStyle
  }

  render () {
    const { widgetId, cardConfigs, linkParam, queryObject, layouts, appMode, browserSizeMode, cardLayout, LayoutEntry } = this.props
    const { previousIndex, currentIndex, regularPlayId, hoverPlayId } = this.state
    const transitionInfo = cardConfigs.transitionInfo
    const cardViewerClass = `card-${widgetId}`
    const previewId = transitionInfo?.previewId || null
    const status = currentIndex === 0 ? Status.Default : Status.Hover
    return (
      <div
        css={this.getStyle(status)}
        style={this.getCardShadowStyle()}
        className={cardViewerClass}
        onMouseLeave={e => {
          this.onMouse(e, false)
        }}
        onMouseEnter={e => {
          this.onMouse(e, true)
        }}
      >
        <CardContent
          linkParam={linkParam}
          queryObject={queryObject}
          cardConfigs={cardConfigs}
          layouts={layouts}
          appMode={appMode}
          browserSizeMode={browserSizeMode}
          hoverPlayId={hoverPlayId}
          regularPlayId={regularPlayId}
          previousIndex={previousIndex}
          currentIndex={currentIndex}
          previewId={previewId}
          cardLayout={cardLayout}
          LayoutEntry={LayoutEntry}
        />
      </div>
    )
  }
}
