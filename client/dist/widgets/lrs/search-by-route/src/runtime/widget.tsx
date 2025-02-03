/** @jsx jsx */
import { React, jsx, css, type AllWidgetProps, DataSourceManager, type DataSource } from 'jimu-core'
import {
  isInWidgetController,
  isDefined
} from 'widgets/shared-code/lrs'
import { type IMConfig } from '../config'
import defaultMessages from './translations/default'
import { WidgetPlaceholder } from 'jimu-ui'
import iconSBR from './../../icon.svg'
import { type JimuMapView, JimuMapViewComponent } from 'jimu-arcgis'
import { SearchByRouteTask } from './components/search-by-route-task'
import GraphicsLayer from 'esri/layers/GraphicsLayer'

const widgetStyle = css`
  background-color: var(--ref-palette-white);
`

export interface State {
  coordinateGraphic: GraphicsLayer
  jimuMapView: JimuMapView
  hideTitle: boolean
}

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig>, State> {
  widgetOuterDivId: string
  constructor (props) {
    super(props)

    this.state = {
      coordinateGraphic: null,
      jimuMapView: undefined,
      hideTitle: false
    }
    this.widgetOuterDivId = 'widget-outer-div-' + this.props.id
  }

  componentDidMount (): void {
    const isInWdigetController = isInWidgetController(this.widgetOuterDivId)
    this.setState({ hideTitle: isInWdigetController })
  }

  componentWillUnmount (): void {
    this.removeGraphicLayers()
  }

  componentDidUpdate (prevProps: AllWidgetProps<IMConfig>, prevState: State): void {
    if (prevState.jimuMapView !== this.state.jimuMapView && isDefined(this.state.jimuMapView)) {
      // Remove any existing graphic layers.
      this.removeGraphicLayers()

      // Add new graphic layers.
      this.createGraphicLayers()
    }
  }

  removeGraphicLayers (): void {
    if (isDefined(this.state.coordinateGraphic)) {
      this.state.coordinateGraphic.removeAll()
      this.state.coordinateGraphic.destroy()
      this.setState({ coordinateGraphic: null })
    }
  }

  createGraphicLayers (): void {
    if (isDefined(this.state.jimuMapView)) {
      this.removeGraphicLayers()
      const newCoordinateGraphicLayer = new GraphicsLayer({ listMode: 'hide' })
      this.state.jimuMapView?.view?.map.addMany([newCoordinateGraphicLayer])
      this.setState({ coordinateGraphic: newCoordinateGraphicLayer })
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

  render () {
    const { config, id, intl } = this.props
    const widgetLabel = this.props.intl.formatMessage({
      id: '_widgetLabel',
      defaultMessage: defaultMessages._widgetLabel
    })

    if (!config.networkItems?.filter(item => !item.referent).length) {
      return <WidgetPlaceholder icon={iconSBR} widgetId={id} message={widgetLabel} />
    }

    return (
      <div
        id={this.widgetOuterDivId}
        className='jimu-widget runtime-search-by-route surface-1 border-0'
        css={widgetStyle}
      >
        <JimuMapViewComponent useMapWidgetId={this.props.useMapWidgetIds?.[0]} onActiveViewChange={this.onActiveViewChange}></JimuMapViewComponent>
        <SearchByRouteTask
          widgetId={id}
          jimuMapView={this.state.jimuMapView}
          config={config}
          intl={intl}
          hideTitle={this.state.hideTitle}
          coordinateGraphic={this.state.coordinateGraphic}
        />
      </div>
    )
  }
}
