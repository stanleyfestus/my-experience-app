import { React, getAppStore } from 'jimu-core'
import { BaseTool, type BaseToolProps, type IconType } from '../layout/base/base-tool'
import { loadArcGISJSAPIModules, type JimuMapView } from 'jimu-arcgis'
import { type ToolShellProps } from '../layout/base/base-tool-shell'

export default class ScaleBar extends BaseTool<BaseToolProps, unknown> {
  toolName = 'ScaleBar'

  getTitle () {
    return 'ScaleBar'
  }

  getIcon (): IconType {
    return null
  }

  getExpandPanel (): JSX.Element {
    return <ScaleBarInner jimuMapView={this.props.jimuMapView} />
  }

  /**
   * ScaleBar only supports map view, so ScaleBarTool.isAvailable() will return false if the map is scene view.
   */
  static isAvailable (toolShellProps: ToolShellProps): boolean {
    return toolShellProps.jimuMapView?.view?.type === '2d'
  }
}

interface ScaleBarInnerProps {
  jimuMapView: JimuMapView
}

interface ScaleBarInnerState {
  apiLoaded: boolean
}

class ScaleBarInner extends React.PureComponent<ScaleBarInnerProps, ScaleBarInnerState> {
  ScaleBar: typeof __esri.ScaleBar = null
  ScaleBarBtn: __esri.ScaleBar
  container: HTMLElement

  constructor (props) {
    super(props)

    this.state = {
      apiLoaded: false
    }
  }

  componentDidMount () {
    if (!this.state.apiLoaded) {
      loadArcGISJSAPIModules(['esri/widgets/ScaleBar']).then(modules => {
        [this.ScaleBar] = modules
        this.setState({
          apiLoaded: true
        })
      })
    }
  }

  componentDidUpdate () {
    if (this.state.apiLoaded && this.container) {
      if (this.ScaleBarBtn) {
        this.container.innerHTML = ''
      }

      let rawUnit = ''

      const appState = getAppStore().getState()

      if (appState) {
        if (appState.user && appState.user.units) {
          rawUnit = appState.user.units
        } else if (appState.portalSelf && appState.portalSelf.units) {
          rawUnit = appState.portalSelf.units
        }
      }

      let scaleBarUnit: 'metric' | 'imperial' | 'dual' = null

      // metric => metric
      // english => imperial
      // '' => dual
      if (rawUnit === 'metric') {
        scaleBarUnit = 'metric'
      } else if (rawUnit === 'english') {
        scaleBarUnit = 'imperial'
      } else {
        scaleBarUnit = 'dual'
      }

      this.ScaleBarBtn = new this.ScaleBar({
        container: this.container,
        view: this.props.jimuMapView.view as __esri.MapView,
        unit: scaleBarUnit
      })

      this.props.jimuMapView.deleteJimuMapTool('ScaleBar')
      this.props.jimuMapView.addJimuMapTool({
        name: 'ScaleBar',
        instance: this.ScaleBarBtn
      })
    }
  }

  componentWillUnmount () {
    if (this.ScaleBarBtn) {
      this.ScaleBarBtn.destroy()
      this.ScaleBarBtn = null
      this.props.jimuMapView.deleteJimuMapTool('ScaleBar')
    }
  }

  render () {
    return <div className='scalebar-map-tool' ref={ref => { this.container = ref }} />
  }
}
