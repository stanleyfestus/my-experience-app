/** @jsx jsx */
import { React, jsx, type AllWidgetProps, DataSourceManager, type DataSource, type IMState, getAppStore, WidgetState } from 'jimu-core'
import { type RouteInfoFromDataAction, type IMConfig } from '../config'
import defaultMessages from './translations/default'
import { defaultMessages as jimuUIDefaultMessages, WidgetPlaceholder } from 'jimu-ui'
import iconSBR from './../../icon.svg'
import { type JimuMapView, JimuMapViewComponent } from 'jimu-arcgis'
import GraphicsLayer from 'esri/layers/GraphicsLayer'
import { isDefined, isInWidgetController } from 'widgets/shared-code/lrs'
import { DynSegRuntimeStateProvider } from './state'
import { DynamicSegmentation } from './components/dynamic-segmentation'
import { getStyle } from './lib/style'

interface ExtraProps {
  routeLocationParams: RouteInfoFromDataAction
  selectedNetworkDataSource: DataSource
}

export interface State {
  hideTitle: boolean
  jimuMapView: JimuMapView
  highlightGraphicLayer: GraphicsLayer
  locationInfoFromDataAction: RouteInfoFromDataAction
  networkDataSourceFromDataAction: DataSource
}

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig> & ExtraProps, State> {
  static mapExtraStateProps = (state: IMState,
    props: AllWidgetProps<IMConfig>): ExtraProps => {
    return {
      routeLocationParams: props?.mutableStateProps?.routeLocationParams,
      selectedNetworkDataSource: props?.mutableStateProps?.selectedNetworkDataSource
    }
  }

  widgetOuterDivId: string

  constructor (props) {
    super(props)

    this.state = {
      hideTitle: false,
      jimuMapView: undefined,
      highlightGraphicLayer: null,
      locationInfoFromDataAction: null,
      networkDataSourceFromDataAction: null
    }
    this.widgetOuterDivId = 'widget-outer-div-' + this.props.id
  }

  //#region Lifecycle
  componentDidMount (): void {
    if (this.props.mutableStatePropsVersion?.selectedDataSource) {
      this.setState({
        networkDataSourceFromDataAction: this.props.selectedNetworkDataSource
      })
    } else if (this.props.mutableStatePropsVersion?.routeLocationParams) {
      this.setState({
        locationInfoFromDataAction: this.props.routeLocationParams
      })
    }

    const inWidgetController = isInWidgetController(this.widgetOuterDivId)
    this.setState({ hideTitle: inWidgetController })
  }

  componentDidUpdate (prevProps: AllWidgetProps<IMConfig>, prevState: State) {
    if (prevState.jimuMapView !== this.state.jimuMapView && this.state.jimuMapView) {
      this.removeGraphicLayer()
      this.createGraphicLayer()
    }

    const currentWidgetState = getAppStore()?.getState()?.widgetsRuntimeInfo[this.props.id]?.state
    if (currentWidgetState === WidgetState.Opened || !currentWidgetState) {
      if (this.props?.selectedNetworkDataSource) {
        if ((!prevProps || !prevProps.mutableStatePropsVersion || !prevProps.mutableStatePropsVersion.selectedNetworkDataSource ||
          prevProps?.mutableStatePropsVersion?.selectedNetworkDataSource !== this.props.mutableStatePropsVersion?.selectedNetworkDataSource)) {
          this.setState({
            networkDataSourceFromDataAction: this.props.selectedNetworkDataSource
          })
        }
      }
      if (this.props?.routeLocationParams) {
        const rteInfo: any = this.props?.routeLocationParams
        if (rteInfo && (!prevProps || !prevProps.mutableStatePropsVersion || !prevProps.mutableStatePropsVersion.routeLocationParams ||
          prevProps?.mutableStatePropsVersion?.routeLocationParams !== this.props.mutableStatePropsVersion?.routeLocationParams)) {
          this.setState({
            locationInfoFromDataAction: this.props.routeLocationParams
          })
        }
      }
    }
  }

  resetDataAction (): void {
    this.setState({ networkDataSourceFromDataAction: null })
    this.setState({ locationInfoFromDataAction: null })
  }

  componentWillUnmount (): void {
    this.removeGraphicLayer()
  }

  removeGraphicLayer (): void {
    if (isDefined(this.state.highlightGraphicLayer)) {
      this.state.highlightGraphicLayer.removeAll()
      this.state.highlightGraphicLayer.destroy()
      this.setState({ highlightGraphicLayer: null })
    }
  }

  createGraphicLayer (): void {
    if (isDefined(this.state.jimuMapView)) {
      this.removeGraphicLayer()
      const newGraphicLayer = new GraphicsLayer({ listMode: 'hide' })
      this.state.jimuMapView.view?.map.add(newGraphicLayer)
      this.setState({ highlightGraphicLayer: newGraphicLayer })
    }
  }

  onActiveViewChange = async (activeJimuMapView: JimuMapView) => {
    if (!(activeJimuMapView && activeJimuMapView.view)) {
      return
    }
    this.waitForChildDataSourcesReady(activeJimuMapView).finally(() => {
      this.setState({ jimuMapView: activeJimuMapView })
    })
  }

  waitForChildDataSourcesReady = async (jmv: JimuMapView): Promise<DataSource> => {
    await jmv?.whenAllJimuLayerViewLoaded()
    const ds = DataSourceManager.getInstance().getDataSource(jmv?.dataSourceId)
    if (ds?.isDataSourceSet() && !ds.areChildDataSourcesCreated()) {
      return ds.childDataSourcesReady().then(() => ds).catch(err => ds)
    }
    return Promise.resolve(ds)
  }

  getI18nMessage = (id: string, values?: { [key: string]: any }) => {
    const messages = Object.assign({}, defaultMessages, jimuUIDefaultMessages)
    return this.props.intl.formatMessage(
      { id: id, defaultMessage: messages[id] }, values
    )
  }

  render () {
    const { config, id, routeLocationParams, selectedNetworkDataSource, outputDataSources } = this.props
    const {
      lrsLayers,
      mapHighlightColor,
      attributeSets,
      defaultPointAttributeSet,
      defaultLineAttributeSet,
      attributeInputType,
      defaultDisplayType,
      defaultDiagramScale,
      allowMerge,
      conflictPreventionEnabled,
      showEventStatistics
    } = config
    const { highlightGraphicLayer, jimuMapView } = this.state
    const theme = this.props.theme

    if (!config.lrsLayers?.length) {
      return <WidgetPlaceholder icon={iconSBR} widgetId={id} message={this.getI18nMessage('_widgetLabel')} />
    }

    return (
      <DynSegRuntimeStateProvider>
        <div
        id={this.widgetOuterDivId}
        className='jimu-widget runtime-dynamic-segmentation surface-1 border-0 d-flex'
        css={getStyle(theme, config.tableHighlightColor)}
      >
        <div className='table-indent'>
          <JimuMapViewComponent
            useMapWidgetId={this.props.useMapWidgetIds?.[0]}
            onActiveViewChange={this.onActiveViewChange}
          />
          <DynamicSegmentation
            widgetId={id}
            allowMerge={allowMerge}
            conflictPreventionEnabled={conflictPreventionEnabled}
            intl={this.props.intl}
            networkDS={selectedNetworkDataSource}
            routeInfo={routeLocationParams}
            lrsLayers={lrsLayers}
            attributeSets={attributeSets}
            defaultPointAttributeSet={defaultPointAttributeSet}
            defaultLineAttributeSet={defaultLineAttributeSet}
            attributeInputType={attributeInputType}
            mapHighlightColor={mapHighlightColor}
            graphicsLayer={highlightGraphicLayer}
            defaultDisplayType={defaultDisplayType}
            defaultDiagramScale={defaultDiagramScale}
            jimuMapView={jimuMapView}
            outputDataSources={outputDataSources}
            showEventStatistics={showEventStatistics}
            useMapWidgetIds={this.props.useMapWidgetIds}
            onResetDataAction={this.resetDataAction.bind(this)}
          />
        </div>
      </div>
      </DynSegRuntimeStateProvider>
    )
  }
}
