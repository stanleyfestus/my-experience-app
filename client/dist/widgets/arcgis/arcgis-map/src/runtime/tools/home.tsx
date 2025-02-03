/** @jsx jsx */
import { React, css, jsx } from 'jimu-core'
import { BaseTool, type BaseToolProps, type IconType } from '../layout/base/base-tool'
import { loadArcGISJSAPIModules, type JimuMapView } from 'jimu-arcgis'
import { defaultMessages } from 'jimu-ui'
import { type InitialMapState } from 'jimu-ui/advanced/map'
import { MultiSourceMapContext } from '../components/multisourcemap-context'

export default class Home extends BaseTool<BaseToolProps, unknown> {
  toolName = 'Home'

  getTitle () {
    return this.props.intl.formatMessage({ id: 'HomeLabel', defaultMessage: defaultMessages.HomeLabel })
  }

  getIcon (): IconType {
    return null
  }

  getHomeContent = (initialMapState: InitialMapState) => {
    return <HomeInner jimuMapView={this.props.jimuMapView} initialMapState={initialMapState} />
  }

  getExpandPanel (): JSX.Element {
    // return <HomeInner jimuMapView={this.props.jimuMapView}></HomeInner>;
    return (
      <MultiSourceMapContext.Consumer>
        {({ initialMapState }) => (
          this.getHomeContent(initialMapState)
        )}
      </MultiSourceMapContext.Consumer>
    )
  }
}

interface HomeInnerProps {
  jimuMapView: JimuMapView
  initialMapState: InitialMapState
}

interface HomeInnerState {
  apiLoaded: boolean
}

class HomeInner extends React.PureComponent<HomeInnerProps, HomeInnerState> {
  Home: typeof __esri.Home = null
  Extent: typeof __esri.geometry.Extent
  Viewpoint: typeof __esri.Viewpoint

  homeBtn: __esri.Home
  container: HTMLElement

  constructor (props) {
    super(props)

    this.state = {
      apiLoaded: false
    }
  }

  componentDidMount () {
    if (!this.state.apiLoaded) {
      loadArcGISJSAPIModules(['esri/widgets/Home',
        'esri/geometry/Extent',
        'esri/Viewpoint']).then(modules => {
        [this.Home, this.Extent, this.Viewpoint] = modules
        this.setState({
          apiLoaded: true
        })
      })
    }
  }

  componentDidUpdate (prevProps: HomeInnerProps) {
    if (!this.state.apiLoaded || !this.container) {
      return
    }

    const currView = this.props.jimuMapView?.view || null
    // check initialMapState change or not
    // sometimes prevProps.initialMapState is undefined and props.initialMapState is null, so we need to convert undefined to null
    const preInitialMapState = prevProps?.initialMapState || null
    const currInitialMapState = this.props.initialMapState || null
    const isInitialMapStateChanged = preInitialMapState !== currInitialMapState

    // destroy current view when view changed or initialMapState changed
    if (this.homeBtn && (this.homeBtn.view !== currView || isInitialMapStateChanged)) {
      this.destroyHomeBtn()
    }

    // create new home btn if this.homeBtn is empty and currView is not empty
    if (!this.homeBtn && currView) {
      let initViewpoint = this.props.initialMapState
        ? this.generateViewPointFromInitialMapState(this.props.initialMapState)
        : (this.props.jimuMapView.view.map as __esri.WebMap | __esri.WebScene).initialViewProperties.viewpoint

      if (initViewpoint) {
        initViewpoint = initViewpoint.clone()
      }

      const homeBtnContainer = document.createElement('div')
      this.container.appendChild(homeBtnContainer)

      this.homeBtn = new this.Home({
        container: homeBtnContainer,
        view: this.props.jimuMapView.view,
        viewpoint: initViewpoint,
        goToOverride: this.homeBtnGoToOverride
      })

      this.props.jimuMapView.deleteJimuMapTool('Home')
      this.props.jimuMapView.addJimuMapTool({
        name: 'Home',
        instance: this.homeBtn
      })
    }

    if (isInitialMapStateChanged) {
      // initialMapState change

      if (currView && this.homeBtn) {
        // const cloneViewpoint = this.homeBtn.viewpoint.clone()
        // set currView.viewpoint to cloneViewpoint directly not work with error 'invalid scale value of 0' if the init homeBtan.viewpoint.scale is 0, so use view.goTo() instead
        // currView.viewpoint = cloneViewpoint
        // currView.goTo(cloneViewpoint, {
        //   animate: false
        // })
        this.homeBtn.go()
      }
    }
  }

  generateViewPointFromInitialMapState = (initialMapState: InitialMapState): __esri.Viewpoint => {
    if (initialMapState.viewType === '2d') {
      return new this.Viewpoint(
        {
          targetGeometry: this.Extent.fromJSON(initialMapState.extent),
          rotation: initialMapState.rotation
        }
      )
    } else {
      return this.Viewpoint.fromJSON(initialMapState.viewPoint)
    }
  }

  homeBtnGoToOverride = async (view: __esri.MapView | __esri.SceneView, goToParams: __esri.GoToTarget2D & __esri.GoToOptions2D) => {
    const is2DView = view.type === '2d'

    // snapToZoom: true means integer zoom, false means float zoom
    // We need to make sure goTo the integer zoom when click home btn.
    let needToRestoreSnapToZoomToFalse = false
    if (is2DView && view.constraints && !view.constraints.snapToZoom) {
      view.constraints.snapToZoom = true
      needToRestoreSnapToZoomToFalse = true
    }

    try {
      await view.goTo(goToParams.target, goToParams.options)
    } catch (e) {
      console.error('home btn goto error', e)
    }

    // When goTo is done, we need to reset to float zoom to get the best synchronization between two map widgets.
    if (is2DView && view.constraints && needToRestoreSnapToZoomToFalse) {
      view.constraints.snapToZoom = false
    }
  }

  destroyHomeBtn () {
    if (this.homeBtn) {
      // this.homeBtn.destroy() will remove this.homeBtn.container from dom tree and let this.homeBtn.container.parentNode be null
      this.homeBtn.destroy()
      this.homeBtn = null
      this.props.jimuMapView.deleteJimuMapTool('Home')
    }

    if (this.container) {
      this.container.innerHTML = ''
    }
  }

  componentWillUnmount () {
    this.destroyHomeBtn()
  }

  getStyle () {
    return css`
      .esri-widget--button {
        appearance: none !important;
      }
    `
  }

  render () {
    return <div className='home-map-tool' css={this.getStyle()} ref={ref => { if (!this.container) { this.container = ref } }} />
  }
}
