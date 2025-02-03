/** @jsx jsx */
import { css, jsx, polished, getAppStore, classNames, appActions } from 'jimu-core'
import { Icon, defaultMessages } from 'jimu-ui'
import { BaseTool, type BaseToolProps, type IconType } from '../layout/base/base-tool'
import { MultiSourceMapContext } from '../components/multisourcemap-context'
import MapThumb from '../components/map-thumb'
import { type ToolShellProps } from '../layout/base/base-tool-shell'

export default class MapSwitch extends BaseTool<BaseToolProps, unknown> {
  toolName = 'MapSwitch'

  static getIsNeedSetting () {
    return false
  }

  static isAvailable (toolShellProps: ToolShellProps): boolean {
    if (toolShellProps.isMobile) {
      const widgetId = toolShellProps.mapWidgetId

      if (widgetId) {
        const widgetInfo = getAppStore().getState().appConfig.widgets[widgetId]

        if (widgetInfo) {
          return widgetInfo.useDataSources && widgetInfo.useDataSources.length >= 2
        }
      }

      return false
    }

    // Always return true for pc layout because false will let SelectState-FullScreen-Container in wroing position.
    return true
  }

  getStyle () {
    return css`
      width: ${polished.rem(68)};
      height: ${polished.rem(52)};
      cursor: pointer;
      position: relative;

      .mapthumb-item {
        position: absolute;
        width: ${polished.rem(64)};
        height: ${polished.rem(48)};
        transition: bottom 0.5s, left 0.5s, top 0.5s, right 0.5s, z-index 0.5s;
      }

      .front {
        z-index: 1;
        bottom: 0;
        left: 0;
      }

      .back {
        z-index: 0;
        top: 0;
        right: 0;
      }
    `
  }

  getTitle () {
    return 'MapSwitch'
  }

  getIcon (): IconType {
    return {
      icon: require('../assets/icons/exchange.svg'),
      onIconClick: () => {
        this.switchMap()
      }
    }
  }

  switchMap = () => {}

  getExpandPanel (): JSX.Element {
    if (this.props.toolJson.isOnlyExpanded) {
      return (
        <MultiSourceMapContext.Consumer>
          {({ isShowMapSwitchBtn, dataSourceIds, activeDataSourceId, switchMap, mapWidgetId, theme }) => (
            this.getContent(isShowMapSwitchBtn, dataSourceIds, activeDataSourceId, switchMap, mapWidgetId, theme)
          )}
        </MultiSourceMapContext.Consumer>
      )
    } else {
      return null
    }
  }

  handleKeyDown = (e: React.KeyboardEvent<any>, onClick) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e?.preventDefault()
      onClick()
    }
  }

  getContent = (isShowMapSwitchBtn: boolean, dataSourceIds: string[], activeDataSourceId: string, switchMap, mapWidgetId, theme) => {
    const onClick = () => {
      getAppStore().dispatch(appActions.requestAutoControlMapWidget(mapWidgetId, mapWidgetId))
      switchMap()
    }
    if (isShowMapSwitchBtn) {
      if (this.props.isMobile) {
        return (
          <div className='exbmap-ui-tool esri-widget--button' onClick={onClick} role='button' tabIndex={0} onKeyDown={e => { this.handleKeyDown(e, onClick) }} aria-label={this.props.intl.formatMessage({ id: 'SwitchMap', defaultMessage: defaultMessages.SwitchMap })}>
            <Icon width={16} height={16} className='exbmap-ui-tool-icon' icon={this.getIcon().icon} />
          </div>
        )
      } else {
        const dsJsons = getAppStore().getState().appConfig.dataSources

        return (
          <div className='mapswitch-map-tool' css={this.getStyle()} onClick={onClick} role='button' tabIndex={0} onKeyDown={e => { this.handleKeyDown(e, onClick) }} aria-label={this.props.intl.formatMessage({ id: 'SwitchMap', defaultMessage: defaultMessages.SwitchMap })}>
            <div
              title={dsJsons[dataSourceIds[0]] ? dsJsons[dataSourceIds[0]].label : null} className={classNames('mapthumb-item', { front: dataSourceIds[0] !== activeDataSourceId },
                { back: dataSourceIds[0] === activeDataSourceId })}
            >
              <MapThumb
                mapItemId={dsJsons[dataSourceIds[0]] ? dsJsons[dataSourceIds[0]].itemId : null}
                portUrl={dsJsons[dataSourceIds[0]] ? dsJsons[dataSourceIds[0]].portalUrl : null}
                theme={theme}
              />
            </div>
            <div
              title={dsJsons[dataSourceIds[1]] ? dsJsons[dataSourceIds[1]].label : null} className={classNames('mapthumb-item', { front: dataSourceIds[1] !== activeDataSourceId },
                { back: dataSourceIds[1] === activeDataSourceId })}
            >
              <MapThumb
                mapItemId={dsJsons[dataSourceIds[1]] ? dsJsons[dataSourceIds[1]].itemId : null}
                portUrl={dsJsons[dataSourceIds[1]] ? dsJsons[dataSourceIds[1]].portalUrl : null}
                theme={theme}
              />
            </div>
          </div>
        )
      }
    } else {
      return null
    }
  }

  getIconContent = (isShowMapSwitchBtn: boolean, dataSourceIds: string[], activeDataSourceId: string, switchMap) => {
    if (isShowMapSwitchBtn) {
      this.switchMap = switchMap
      return super.render()
    } else {
      return null
    }
  }

  render () {
    if (this.props.toolJson.isOnlyExpanded) {
      return super.render()
      // In fact, it never goes here.
    } else {
      return (
        <MultiSourceMapContext.Consumer>
          {({ isShowMapSwitchBtn, dataSourceIds, activeDataSourceId, switchMap }) => (
            this.getIconContent(isShowMapSwitchBtn, dataSourceIds, activeDataSourceId, switchMap)
          )}
        </MultiSourceMapContext.Consumer>
      )
    }
  }
}
