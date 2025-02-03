import { React, classNames } from 'jimu-core'
import { BaseTool, type BaseToolProps, type IconType } from '../layout/base/base-tool'
import type { MapbaseView } from '../components/mapbase'
import { getViewpointInstanceFromHistory } from '../utils'
import { ArrowFatLeftOutlined } from 'jimu-icons/outlined/directional/arrow-fat-left'
import { ArrowFatRightOutlined } from 'jimu-icons/outlined/directional/arrow-fat-right'
import { defaultMessages } from 'jimu-ui'

export default class ExtentNavigate extends BaseTool<BaseToolProps, unknown> {
  toolName = 'ExtentNavigate'

  view: MapbaseView

  getTitle () {
    return 'ExtentNavigate'
  }

  getIcon (): IconType {
    return {
      icon: null
    }
  }

  getExtendCssStyle () {
    return `
      .extent-navigate-btn {
        width: 32px;
        height: 32px;
        text-align: center;
        line-height: 32px;
        cursor: default;
      }

      .extent-navigate-btn.extent-navigate-btn-disabled {
        color: grey;
      }

      .extent-navigate-prev-btn {
        border-bottom: 1px solid #ccc;
      }
    `
  }

  getExpandPanel (): JSX.Element {
    const isPrevBtnDisabled = !this.isPrevBtnEnabled()
    const isNextBtnDisabled = !this.isNextBtnEnabled()

    const prevBtnClassName = classNames('esri-widget--button extent-navigate-btn extent-navigate-prev-btn', { 'extent-navigate-btn-disabled': isPrevBtnDisabled })
    const nextBtnClassName = classNames('esri-widget--button extent-navigate-btn extent-navigate-next-btn', { 'extent-navigate-btn-disabled': isNextBtnDisabled })
    const prevExtentTitle = this.formatMessage('prevExtent')
    const nextExtentTitle = this.formatMessage('nextExtent')

    return (
      <div>
        <div className={prevBtnClassName} title={prevExtentTitle} onClick={this.onClickPrevBtn}>
          <ArrowFatLeftOutlined />
        </div>
        <div className={nextBtnClassName} title={nextExtentTitle} onClick={this.onClickNextBtn}>
          <ArrowFatRightOutlined />
        </div>
      </div>
    )
  }

  formatMessage (strId: string) {
    return this.props.intl.formatMessage({ id: strId, defaultMessage: defaultMessages[strId] })
  }

  componentDidMount (): void {
    this.bindView()
  }

  componentDidUpdate () {
    this.bindView()
  }

  bindView () {
    const view = this.props.jimuMapView?.view as MapbaseView

    if (this.view !== view) {
      // active view changes
      if (this.view) {
        this.view.stationaryCallback = null
      }

      this.view = view

      if (this.view) {
        this.view.stationaryCallback = this.onViewStationary
      }

      this.updateByCurrentView()
    }
  }

  updateByCurrentView (): void {
    this.forceUpdate()
  }

  onViewStationary = () => {
    // view static, view.viewpointHistory maybe changed
    this.updateByCurrentView()
  }

  isPrevBtnEnabled () {
    return this.view && this.view.viewpointHistory.length >= 2 && this.view.viewpointIndex >= 1
  }

  isNextBtnEnabled () {
    return this.view && this.view.viewpointHistory.length >= 2 && this.view.viewpointIndex < (this.view.viewpointHistory.length - 1)
  }

  onClickPrevBtn = () => {
    if (!this.isPrevBtnEnabled()) {
      return
    }

    this.view.viewpointIndex--
    const viewpoint = getViewpointInstanceFromHistory(this.view, this.view.viewpointIndex)

    if (viewpoint) {
      this.view.goTo(viewpoint)
    }

    this.updateByCurrentView()
  }

  onClickNextBtn = () => {
    if (!this.isNextBtnEnabled()) {
      return
    }

    this.view.viewpointIndex++
    const viewpoint = getViewpointInstanceFromHistory(this.view, this.view.viewpointIndex)

    if (viewpoint) {
      this.view.goTo(viewpoint)
    }

    this.updateByCurrentView()
  }
}
