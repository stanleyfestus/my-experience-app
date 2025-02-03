/** @jsx jsx */
import {
  React,
  jsx,
  css,
  type AllWidgetProps,
  DataSourceManager,
  type DataSource,
  type IMState,
  getAppStore,
  WidgetState
} from 'jimu-core'
import { type IMConfig, OperationType } from '../config'
import defaultMessages from './translations/default'
import {
  defaultMessages as jimuUIDefaultMessages,
  WidgetPlaceholder
} from 'jimu-ui'
import iconSBR from './../../icon.svg'
import { type JimuMapView, JimuMapViewComponent } from 'jimu-arcgis'
import { AddSingleLineEvent } from './components/add-single-line-event'
import { AddMultipleLineEvents } from './components/add-multiple-line-events'
import GraphicsLayer from 'esri/layers/GraphicsLayer'
import { type RouteInfo, isDefined, isInWidgetController } from 'widgets/shared-code/lrs'

const widgetStyle = css`
  background-color: var(--ref-palette-white);
`

interface ExtraProps {
  selectedRouteInfo: RouteInfo
  selectedNetworkDataSource: DataSource
}

export interface State {
  hideTitle: boolean
  jimuMapView: JimuMapView
  operationType: OperationType
  hoverGraphic: GraphicsLayer
  pickedFromGraphic: GraphicsLayer
  pickedToGraphic: GraphicsLayer
  flashGraphic: GraphicsLayer
  routeInfoFromDataAction: RouteInfo
  networkDataSourceFromDataAction: DataSource
}

export default class Widget extends React.PureComponent<
AllWidgetProps<IMConfig> & ExtraProps, State> {
  static mapExtraStateProps = (state: IMState,
    props: AllWidgetProps<IMConfig>): ExtraProps => {
    return {
      selectedRouteInfo: props?.mutableStateProps?.selectedRouteInfo,
      selectedNetworkDataSource: props?.mutableStateProps?.selectedNetworkDataSource
    }
  }

  widgetOuterDivId: string

  constructor (props) {
    super(props)

    this.state = {
      hideTitle: false,
      jimuMapView: undefined,
      operationType: OperationType.single,
      hoverGraphic: null,
      pickedFromGraphic: null,
      pickedToGraphic: null,
      flashGraphic: null,
      routeInfoFromDataAction: null,
      networkDataSourceFromDataAction: null
    }
    this.widgetOuterDivId = 'widget-outer-div-' + this.props.id
  }

  componentDidMount = () => {
    if (this.props.mutableStatePropsVersion?.selectedDataSource) {
      this.setState({
        networkDataSourceFromDataAction: this.props.selectedNetworkDataSource
      })
    } else if (this.props.mutableStatePropsVersion?.selectedRouteInfo) {
      this.setState({
        routeInfoFromDataAction: this.props.selectedRouteInfo
      })
    }

    const isInWdigetController = isInWidgetController(this.widgetOuterDivId)
    this.setState({ hideTitle: isInWdigetController })
    this.setState({ operationType: this.props.config.defaultType })
  }

  componentWillUnmount (): void {
    this.removeGraphicLayers()
  }

  componentDidUpdate (
    prevProps: AllWidgetProps<IMConfig>,
    prevState: State
  ): void {
    if (prevState.jimuMapView !== this.state.jimuMapView && isDefined(this.state.jimuMapView)) {
      // Remove any exisiting graphic layers.
      this.removeGraphicLayers()

      // Add new graphic layers.
      this.createGraphicLayers()
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
      // if featureRecord found and prev selected record is not matching with the current then only load the RouteInfo for selected feature
      if (this.props?.selectedRouteInfo) {
        const rteInfo: any = this.props?.selectedRouteInfo
        if (rteInfo && (!prevProps || !prevProps.mutableStatePropsVersion || !prevProps.mutableStatePropsVersion.selectedRouteInfo ||
          prevProps?.mutableStatePropsVersion?.selectedRouteInfo !== this.props.mutableStatePropsVersion?.selectedRouteInfo)) {
          this.setState({
            routeInfoFromDataAction: this.props.selectedRouteInfo
          })
        }
      }
    }
  }

  removeGraphicLayers (): void {
    if (isDefined(this.state.hoverGraphic)) {
      this.state.hoverGraphic.removeAll()
      this.state.hoverGraphic.destroy()
      this.setState({ hoverGraphic: null })
    }
    if (isDefined(this.state.pickedFromGraphic)) {
      this.state.pickedFromGraphic.removeAll()
      this.state.pickedFromGraphic.destroy()
      this.setState({ pickedFromGraphic: null })
    }
    if (isDefined(this.state.pickedToGraphic)) {
      this.state.pickedToGraphic.removeAll()
      this.state.pickedToGraphic.destroy()
      this.setState({ pickedToGraphic: null })
    }
    if (isDefined(this.state.flashGraphic)) {
      this.state.flashGraphic.removeAll()
      this.state.flashGraphic.destroy()
      this.setState({ flashGraphic: null })
    }
  }

  createGraphicLayers (): void {
    if (isDefined(this.state.jimuMapView)) {
      this.removeGraphicLayers()
      const newHoverGraphicLayer = new GraphicsLayer({ listMode: 'hide' })
      const newPickedFromGraphicLayer = new GraphicsLayer({ listMode: 'hide' })
      const newPickedToGraphicLayer = new GraphicsLayer({ listMode: 'hide' })
      const newFlashGraphicLayer = new GraphicsLayer({ listMode: 'hide' })
      this.state.jimuMapView?.view?.map.addMany([
        newPickedFromGraphicLayer,
        newPickedToGraphicLayer,
        newFlashGraphicLayer,
        newHoverGraphicLayer
      ])
      this.setState({ hoverGraphic: newHoverGraphicLayer })
      this.setState({ pickedFromGraphic: newPickedFromGraphicLayer })
      this.setState({ pickedToGraphic: newPickedToGraphicLayer })
      this.setState({ flashGraphic: newFlashGraphicLayer })
    }
  }

  resetDataAction (): void {
    this.setState({ routeInfoFromDataAction: null })
    this.setState({ networkDataSourceFromDataAction: null })
  }

  clearGraphics (): void {
    if (this && this.state) {
      if (isDefined(this.state.hoverGraphic)) {
        this.state.hoverGraphic.removeAll()
      }
      if (isDefined(this.state.pickedFromGraphic)) {
        this.state.pickedFromGraphic.removeAll()
      }
      if (isDefined(this.state.pickedToGraphic)) {
        this.state.pickedToGraphic.removeAll()
      }
      if (isDefined(this.state.flashGraphic)) {
        this.state.flashGraphic.removeAll()
      }
    }
  }

  clearHoverGraphic (): void {
    if (this && this.state) {
      if (isDefined(this.state.hoverGraphic)) {
        this.state.hoverGraphic.removeAll()
      }
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

  waitForChildDataSourcesReady = async (
    jmv: JimuMapView
  ): Promise<DataSource> => {
    await jmv?.whenAllJimuLayerViewLoaded()
    const ds = DataSourceManager.getInstance().getDataSource(jmv?.dataSourceId)
    if (ds?.isDataSourceSet() && !ds.areChildDataSourcesCreated()) {
      return ds
        .childDataSourcesReady()
        .then(() => ds)
        .catch((err) => ds)
    }
    return Promise.resolve(ds)
  }

  handleOperationTypeChange = (value: OperationType) => {
    this.setState({ operationType: value })
    this.clearGraphics()
  }

  getI18nMessage = (id: string, values?: { [key: string]: any }) => {
    // Function for handling I18n
    const messages = Object.assign({}, defaultMessages, jimuUIDefaultMessages)
    return this.props.intl.formatMessage(
      { id: id, defaultMessage: messages[id] },
      values
    )
  }

  render () {
    const { config, id, intl } = this.props
    const {
      lrsLayers,
      networkLayers,
      lineEventLayers,
      intersectionLayers,
      defaultEvent,
      defaultNetwork,
      defaultFromMethod,
      defaultToMethod,
      attributeSets,
      defaultAttributeSet,
      hideType,
      hideMethod,
      hideEvent,
      hideNetwork,
      hideAttributeSet,
      hideMeasures,
      hideDates,
      useRouteStartEndDate,
      conflictPreventionEnabled
    } = config
    const { jimuMapView, operationType } = this.state

    if (!networkLayers?.length || !lineEventLayers?.length) {
      return (
        <WidgetPlaceholder
          icon={iconSBR}
          widgetId={id}
          message={this.getI18nMessage('_widgetLabel')}
        />
      )
    }

    return (
      <div
        id={this.widgetOuterDivId}
        className="jimu-widget runtime-add-line-event surface-1 border-0"
        css={widgetStyle}
      >
        <JimuMapViewComponent
          useMapWidgetId={this.props.useMapWidgetIds?.[0]}
          onActiveViewChange={this.onActiveViewChange}
        />
        {operationType === OperationType.single && (
          <AddSingleLineEvent
            intl={intl}
            widgetId={id}
            lrsLayers={lrsLayers}
            JimuMapView={jimuMapView}
            operationType={operationType}
            onOperationTypeChanged={this.handleOperationTypeChange}
            lineEventLayers={lineEventLayers}
            networkLayers={networkLayers}
            instersectionLayers={intersectionLayers}
            defaultEvent={defaultEvent}
            defaultFromMethod={defaultFromMethod}
            defaultToMethod={defaultToMethod}
            hoverGraphic={this.state.hoverGraphic}
            pickedFromGraphic={this.state.pickedFromGraphic}
            pickedToGraphic={this.state.pickedToGraphic}
            flashGraphic={this.state.flashGraphic}
            hideEvent={hideEvent}
            hideNetwork={hideNetwork}
            hideType={hideType}
            hideMethod={hideMethod}
            hideMeasures={hideMeasures}
            hideDates={hideDates}
            hideTitle={this.state.hideTitle}
            useRouteStartEndDate={useRouteStartEndDate}
            conflictPreventionEnabled={conflictPreventionEnabled}
            networkDataSourceFromDataAction={this.state.networkDataSourceFromDataAction}
            routeInfoFromDataAction={this.state.routeInfoFromDataAction}
            onResetDataAction={this.resetDataAction.bind(this)}
            onClearGraphics={this.clearGraphics.bind(this)}
            onClearHoverGraphic={this.clearHoverGraphic.bind(this)}
          />
        )}
        {operationType === OperationType.multiple && (
          <AddMultipleLineEvents
          intl={intl}
          widgetId={id}
          lrsLayers={lrsLayers}
          jimuMapView={jimuMapView}
          operationType={operationType}
          onOperationTypeChanged={this.handleOperationTypeChange}
          lineEventLayers={lineEventLayers}
          networkLayers={networkLayers}
          instersectionLayers={intersectionLayers}
          defaultEvent={defaultEvent}
          defaultNetwork={defaultNetwork}
          defaultFromMethod={defaultFromMethod}
          defaultToMethod={defaultToMethod}
          defaultAttributeSet={defaultAttributeSet}
          attributeSets={attributeSets}
          hoverGraphic={this.state.hoverGraphic}
          pickedFromGraphic={this.state.pickedFromGraphic}
          pickedToGraphic={this.state.pickedToGraphic}
          flashGraphic={this.state.flashGraphic}
          hideNetwork={hideNetwork}
          hideMethod={hideMethod}
          hideType={hideType}
          hideAttributeSet={hideAttributeSet}
          hideMeasures={hideMeasures}
          hideDates={hideDates}
          hideTitle={this.state.hideTitle}
          useRouteStartEndDate={useRouteStartEndDate}
          conflictPreventionEnabled={conflictPreventionEnabled}
          networkDataSourceFromDataAction={this.state.networkDataSourceFromDataAction}
          routeInfoFromDataAction={this.state.routeInfoFromDataAction}
          onResetDataAction={this.resetDataAction.bind(this)}
          onClearGraphics={this.clearGraphics.bind(this)}
          onClearHoverGraphic={this.clearHoverGraphic.bind(this)}
          />
        )}
      </div>
    )
  }
}
