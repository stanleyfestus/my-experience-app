import { React, classNames, getAppStore, appActions } from 'jimu-core'
import { Icon, Nav, NavItem, NavLink, defaultMessages } from 'jimu-ui'
import { BaseTool, type BaseToolProps, type IconType } from '../layout/base/base-tool'
import { loadArcGISJSAPIModules, type JimuMapView } from 'jimu-arcgis'

type MeasureType = __esri.Measurement

interface States {
  activeTabIndex: number
  measureInstance: MeasureType
}

export default class Measure extends BaseTool<BaseToolProps, States> {
  activeTabRef: HTMLElement
  toolName = 'Measure'
  measureModules2D = [{
    name: 'Line',
    title: 'Line',
    activeTool: 'distance',
    src: require('../assets/icons/measure-distance.svg')
  }, {
    name: 'Polygon',
    title: 'Polygon',
    activeTool: 'area',
    src: require('../assets/icons/measure-area.svg')
  }]

  measureModules3D = [{
    name: 'Line',
    title: 'Line',
    activeTool: 'direct-line',
    src: require('../assets/icons/measure-distance.svg')
  }, {
    name: 'Polygon',
    title: 'Polygon',
    activeTool: 'area',
    src: require('../assets/icons/measure-area.svg')
  }]

  constructor (props) {
    super(props)

    this.state = {
      activeTabIndex: 0,
      measureInstance: null
    }
  }

  getTitle () {
    return this.props.intl.formatMessage({ id: 'MeasureLabel', defaultMessage: defaultMessages.MeasureLabel })
  }

  getIcon (): IconType {
    return {
      icon: require('../assets/icons/measure.svg')
    }
  }

  focusDefaultElement () {
    this.activeTabRef?.focus()
  }

  destroy = () => {
    if (this.state.measureInstance && !(this.state.measureInstance as any).destroyed) {
      (this.state.measureInstance as any).destroy()
      this.setState({
        measureInstance: null,
        activeTabIndex: 0
      })
    }
  }

  handleMeasurceInstanceCreated = (measureInstance: MeasureType) => {
    this.setState({
      measureInstance: measureInstance
    })
  }

  onTabClick = (index: number) => {
    if (this.state.activeTabIndex === index) {
      return
    }
    this.state.measureInstance.clear()
    this.setState({ activeTabIndex: index })
    if (index === 0) {
      this.state.measureInstance.activeTool = this.props.jimuMapView.view.type === '2d' ? 'distance' : 'direct-line'
    } else if (index === 1) {
      this.state.measureInstance.activeTool = 'area'
    }
  }

  handleKeyDown = (e: React.KeyboardEvent<any>, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      this.onTabClick(index)
    }
  }

  onRequestClosePanel = () => {
    if (this.props.activeToolInfo.activeToolName === this.toolName) {
      this.props.onActiveToolInfoChange(null)
    }
  }

  onClosePanel = () => {
    this.destroy()
  }

  onShowPanel = () => {
    if (this.state.measureInstance) {
      if (this.state.activeTabIndex === 0) {
        this.state.measureInstance.activeTool = this.props.jimuMapView.view.type === '2d' ? 'distance' : 'direct-line'
      } else if (this.state.activeTabIndex === 1) {
        this.state.measureInstance.activeTool = 'area'
      }
    }
  }

  getNavTab = () => {
    if (this.props.jimuMapView.view.type === '2d') {
      return (
        <Nav tabs>{
          this.measureModules2D.map((module, index) => {
            const tabTitle = index === 0 ? 'drawModeLine' : 'drawModePolygon'
            return (
              <NavItem key={index}>
                <NavLink active={this.state.activeTabIndex === index} ref={ref => { this.state.activeTabIndex === index && (this.activeTabRef = ref) }} onClick={() => { this.onTabClick(index) }}
                onKeyDown={e => { this.handleKeyDown(e, index) }}
                aria-label={this.props.intl.formatMessage({ id: `${tabTitle}`, defaultMessage: defaultMessages[tabTitle] })}
                >
                  <Icon width={16} height={16} className='m-0' icon={module.src} />
                </NavLink>
              </NavItem>
            )
          })
        }
        </Nav>
      )
    } else if (this.props.jimuMapView.view.type === '3d') {
      return (
        <Nav tabs>{
          this.measureModules3D.map((module, index) => {
            const tabTitle = index === 0 ? 'drawModeLine' : 'drawModePolygon'
            return (
              <NavItem key={index}>
                <NavLink active={this.state.activeTabIndex === index} ref={ref => { this.state.activeTabIndex === index && (this.activeTabRef = ref) }} onClick={() => { this.onTabClick(index) }}
                onKeyDown={e => { this.handleKeyDown(e, index) }}
                aria-label={this.props.intl.formatMessage({ id: `${tabTitle}`, defaultMessage: defaultMessages[tabTitle] })}
                >
                  <Icon width={16} height={16} className='m-0' icon={module.src} />
                </NavLink>
              </NavItem>
            )
          })
        }
        </Nav>
      )
    } else {
      return null
    }
  }

  getMeasureModule = () => {
    if (this.props.jimuMapView.view.type === '2d') {
      return this.measureModules2D[this.state.activeTabIndex]
    } else {
      return this.measureModules3D[this.state.activeTabIndex]
    }
  }

  getExpandPanel (): JSX.Element {
    return (
      <div
        style={{ width: this.props.isMobile ? '100%' : '250px', position: 'relative' }}
        className={classNames({ 'exbmap-ui-pc-expand-maxheight': !this.props.isMobile })}
      >
        {this.getNavTab()}
        <MeasureInner
          mapWidgetId={this.props.mapWidgetId}
          activeTabIndex={this.state.activeTabIndex} jimuMapView={this.props.jimuMapView}
          measureModule={this.getMeasureModule()}
          measureInstance={this.state.measureInstance}
          onMeasurceInstanceCreated={this.handleMeasurceInstanceCreated}
          autoControlWidgetId={this.props.autoControlWidgetId}
          onRequestClosePanel={this.onRequestClosePanel}
        />
      </div>
    )
  }
}

interface MeasureInnerProps {
  mapWidgetId: string
  jimuMapView: JimuMapView
  measureModule: { name: string, title: string, activeTool: string }
  measureInstance: MeasureType
  activeTabIndex: number
  onMeasurceInstanceCreated: (instance: MeasureType) => void
  autoControlWidgetId: string
  onRequestClosePanel: () => void
}

interface MeasureInnerState {
  apiLoaded: boolean
}

class MeasureInner extends React.PureComponent<MeasureInnerProps, MeasureInnerState> {
  MeasureClass: typeof __esri.DistanceMeasurement2D | typeof __esri.AreaMeasurement2D | typeof __esri.DirectLineMeasurement3D | typeof __esri.AreaMeasurement3D
  MeasureInstance: MeasureType = null

  parentContainer: HTMLElement
  container: HTMLElement
  toolName: string = 'measurement'
  id: string
  currentJimuMapView: JimuMapView
  originalClickHighlightEnabled: boolean

  constructor (props) {
    super(props)

    this.id = `${this.props.mapWidgetId}-measure-tool`

    this.state = {
      apiLoaded: false
    }
  }

  componentDidMount () {
    if (!this.state.apiLoaded) {
      loadArcGISJSAPIModules(['esri/widgets/Measurement']).then(modules => {
        [this.MeasureClass] = modules
        this.setState({
          apiLoaded: true
        })
      })
    }
  }

  componentDidUpdate (prevProps: MeasureInnerProps) {
    if (this.state.apiLoaded && this.parentContainer && this.container) {
      if (!this.props.measureInstance) {
        // crate measure isntance here
        const tempInstance: any = new this.MeasureClass({
          container: this.container,
          view: this.props.jimuMapView.view
        })
        tempInstance.activeTool = this.props.measureModule.activeTool

        this.setCurrentJimuMapView(this.props.jimuMapView)
        this.currentJimuMapView.deleteJimuMapTool(this.toolName)
        this.currentJimuMapView.addJimuMapTool({
          name: this.toolName,
          instance: tempInstance
        })

        this.props.onMeasurceInstanceCreated(tempInstance)
        const action = appActions.requestAutoControlMapWidget(this.props.mapWidgetId, this.id)
        getAppStore().dispatch(action)
      } else {
        const newJimuMapView = this.props.jimuMapView

        if (this.props.measureInstance.view !== newJimuMapView.view) {
          // map view changed by switch
          this.restoreClickHighlightEnabledForCurrentJimuMapView()
          this.setCurrentJimuMapView(newJimuMapView)

          this.props.measureInstance.clear()
          this.props.measureInstance.view = newJimuMapView.view

          // @ts-expect-error
          this.props.measureInstance.activeTool = this.props.measureModule.activeTool
        }
      }

      this.checkContainer()
    }

    // check if autoControlWidgetId changed
    const prevAutoControlWidgetId = prevProps?.autoControlWidgetId || ''
    if (prevAutoControlWidgetId === this.id && this.props.autoControlWidgetId !== this.id) {
      // measure is from active to inactive, destroy MeasureInner
      this.props.onRequestClosePanel()
    }
  }

  componentWillUnmount (): void {
    this.restoreClickHighlightEnabledForCurrentJimuMapView()

    if (this.props.autoControlWidgetId === this.id) {
      const action = appActions.releaseAutoControlMapWidget(this.props.mapWidgetId)
      getAppStore().dispatch(action)
    }
  }

  setCurrentJimuMapView (jimuMapView: JimuMapView): void {
    this.currentJimuMapView = jimuMapView
    this.originalClickHighlightEnabled = jimuMapView.isClickHighlightEnabled()
    // disable click highlight to avoid conflict with clicking-select
    this.currentJimuMapView.disableClickHighlight()
  }

  restoreClickHighlightEnabledForCurrentJimuMapView () {
    if (this.currentJimuMapView) {
      if (this.originalClickHighlightEnabled) {
        this.currentJimuMapView.enableClickHighlight()
      } else {
        this.currentJimuMapView.disableClickHighlight()
      }
    }
  }

  checkContainer = () => {
    if ((this.container as any).style.opacity === '0' || (this.container as any).style.opacity === 0) {
      (this.container as any).style.opacity = 1;
      (this.container as any).style.height = ''
    }
  }

  reload () {
    if (this.container.childNodes && this.container.childNodes[0]) {
      (this.container as any).style.opacity = 0;
      (this.container as any).style.height = '35px'
    }

    //this.setState({
    //  apiLoaded: false
    //}, () => {
    //  loadArcGISJSAPIModules(['esri/widgets/Measurement']).then(modules => {
    //    [this.MeasureClass] = modules
    //    this.setState({
    //      apiLoaded: true
    //    })
    //  })
    //})
  }

  render () {
    return (
      <div className='w-100' style={{ width: '250px', position: 'relative', minHeight: '32px' }} ref={ref => { this.parentContainer = ref }}>
        <div className='measure-container measure-map-tool' ref={ref => { this.container = ref }} />
        {!this.state.apiLoaded && <div className='exbmap-basetool-loader' />}
      </div>
    )
  }
}
