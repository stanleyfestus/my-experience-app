/** @jsx jsx */
import { React, css, jsx, getAppStore, MessageManager, LocationChangeMessage } from 'jimu-core'
import { BaseTool, type BaseToolProps, type IconType } from '../layout/base/base-tool'
import { loadArcGISJSAPIModules, type JimuMapView } from 'jimu-arcgis'
import { defaultMessages } from 'jimu-ui'

export default class Search extends BaseTool<BaseToolProps, unknown> {
  toolName = 'Search'

  getTitle () {
    return this.props.intl.formatMessage({ id: 'SearchLabel', defaultMessage: defaultMessages.SearchLabel })
  }

  getIcon (): IconType {
    return {
      icon: require('../assets/icons/search.svg')
    }
  }

  getExpandPanel (): JSX.Element {
    if (this.props.isMobile) {
      return (
        <div style={{ minHeight: '32px', position: 'relative', width: '100%' }}>
          <SearchInner jimuMapView={this.props.jimuMapView} mapWidgetId={this.props.mapWidgetId} />
        </div>
      )
    } else {
      return (
        <div style={{ minWidth: '250px', minHeight: '32px', position: 'relative' }}>
          <SearchInner jimuMapView={this.props.jimuMapView} mapWidgetId={this.props.mapWidgetId} />
        </div>
      )
    }
  }
}

interface SearchInnerProps {
  jimuMapView: JimuMapView
  mapWidgetId: string
}

interface SearchInnerState {
  apiLoaded: boolean
}

class SearchInner extends React.PureComponent<SearchInnerProps, SearchInnerState> {
  Search: typeof __esri.widgetsSearch = null
  Portal: typeof __esri.Portal = null
  SearchBtn: __esri.widgetsSearch
  container: HTMLElement
  popupEnabledWatchHandle: __esri.Handle

  constructor (props) {
    super(props)

    this.state = {
      apiLoaded: false
    }
  }

  getStyle () {
    return css`
      /* border: solid 1px rgba(110,110,110,0.3); */
    `
  }

  componentDidMount () {
    if (!this.state.apiLoaded) {
      loadArcGISJSAPIModules(['esri/widgets/Search', 'esri/portal/Portal']).then(modules => {
        [this.Search, this.Portal] = modules
        this.setState({
          apiLoaded: true
        })
      })
    }
  }

  componentDidUpdate () {
    if (this.state.apiLoaded && this.container) {
      if (this.SearchBtn) {
        const containerParent = this.container.parentElement
        this.SearchBtn.destroy()
        this.SearchBtn = null

        if (!this.container.parentElement && containerParent) {
          containerParent.appendChild(this.container)
        }

        this.container.innerHTML = ''
      }

      this.releasePopupEnabledWatchHandle()

      const mapView = this.props.jimuMapView.view

      this.SearchBtn = new this.Search({
        container: this.container,
        view: mapView,
        portal: new this.Portal({
          url: getAppStore().getState().portalUrl
        })
      })

      this.updateSearchPopupEnabled()

      if (mapView) {
        this.popupEnabledWatchHandle = mapView.watch('popupEnabled', () => {
          // console.log('view.popupEnabled changed, call this.updateSearchPopupEnabled()')
          this.updateSearchPopupEnabled()
        })
      }

      this.props.jimuMapView.deleteJimuMapTool('Search')
      this.props.jimuMapView.addJimuMapTool({
        name: 'Search',
        instance: this.SearchBtn
      })

      this.SearchBtn.on('select-result', (event) => {
        if (!event.result.feature.layer) {
          const geometry = event.result.feature.geometry.toJSON()
          MessageManager.getInstance().publishMessage(new LocationChangeMessage(this.props.mapWidgetId, geometry))
        } else {
          const geometry = event.result.feature.geometry
          if (geometry.type === 'point') {
            MessageManager.getInstance().publishMessage(new LocationChangeMessage(this.props.mapWidgetId, geometry.toJSON()))
          } else {
            const point = geometry.extent.center
            MessageManager.getInstance().publishMessage(new LocationChangeMessage(this.props.mapWidgetId, point.toJSON()))
          }
        }
      })
    }
  }

  componentWillUnmount () {
    if (this.SearchBtn) {
      this.SearchBtn.destroy()
      this.SearchBtn = null
      this.props.jimuMapView.deleteJimuMapTool('Search')
    }

    this.releasePopupEnabledWatchHandle()
  }

  render () {
    return (
      <div css={this.getStyle()} className='w-100 search-map-tool' ref={ref => { this.container = ref }}>
        {!this.state.apiLoaded && <div className='exbmap-basetool-loader' />}
      </div>
    )
  }

  updateSearchPopupEnabled = () => {
    if (this.SearchBtn) {
      const mapView = this.SearchBtn.view

      if (mapView) {
        // console.log(`update search.popupEnabled to ${this.SearchBtn.popupEnabled}`)
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
        this.SearchBtn.popupEnabled = mapView.popupEnabled !== false
      }
    }
  }

  releasePopupEnabledWatchHandle () {
    if (this.popupEnabledWatchHandle) {
      this.popupEnabledWatchHandle.remove()
      this.popupEnabledWatchHandle = null
    }
  }
}
