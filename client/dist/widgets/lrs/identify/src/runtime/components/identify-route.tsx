/** @jsx jsx */
import {
  React,
  jsx,
  type ImmutableArray,
  type DataSource,
  type IntlShape
} from 'jimu-core'
import { type JimuMapView } from 'jimu-arcgis'
import type GraphicsLayer from 'esri/layers/GraphicsLayer'
import { DataSourceManager } from '../data-source/data-source-manager'
import { type LrsLayer, type IMConfig, type NetworkInfo } from '../../config'
import { RoutePicker } from './route-picker'
import { colorGreen } from '../constants'
import { isDefined, type RouteInfo, getGeometryGraphic, getSimpleLineGraphic, getSimplePointGraphic } from 'widgets/shared-code/lrs'
import { RoutePickerPopup } from './route-picker-popup'
import { type NetworkItem } from 'widgets/lrs/search-by-route/src/config'
import { getDataRecord } from '../utils/service-utils'

export interface IdentifyRouteProps {
  intl: IntlShape
  widgetId: string
  lrsLayers: ImmutableArray<LrsLayer>
  JimuMapView: JimuMapView
  defaultShowPp: boolean
  hoverGraphic: GraphicsLayer
  config: IMConfig
  onClearFlashGraphics: () => void
  onClearPickedGraphics: () => void
  onUpdateGraphics: (graphic: __esri.Graphic) => void
  flashSelectedGeometry: (graphic: __esri.Graphic) => void
}

export function IdentifyRoute (props: IdentifyRouteProps) {
  const {
    widgetId,
    intl,
    lrsLayers,
    JimuMapView,
    defaultShowPp,
    hoverGraphic,
    config,
    onClearFlashGraphics,
    onClearPickedGraphics,
    onUpdateGraphics,
    flashSelectedGeometry
  } = props

  const [isDSReady, setIsDSReady] = React.useState<boolean>(false)
  const [isNetworkChange, setIsNetworkChange] = React.useState<boolean>(false)
  const [outputPointDS, setPointOutputDS] = React.useState(null)
  const [selectedNetwork, setSelectedNetwork] = React.useState<NetworkInfo>(null)
  const [defaultRouteDetails, setDefaultRouteDetails] = React.useState(null)
  const [allDataSources, setDataSources] = React.useState<DataSource[]>(null)
  const [routeDetails, setRouteDetals] = React.useState<any[]>(null)
  const [eventDetails, setEventDetails] = React.useState<any[]>(null)
  const [isRoutePickerActive, setIsRoutePickerActive] = React.useState<boolean>(false)
  const [results, setAllDataRecords] = React.useState<any[]>(null)
  const [showPp, setShowPp] = React.useState<boolean>(true)
  const [measuresOids, setMeasuresOids] = React.useState(null)
  const eventDataRecords = []

  const handleDataSourcesReady = React.useCallback((value: boolean) => {
    setIsDSReady(value)
  }, [setIsDSReady])

  const handleSetDataSources = React.useCallback((ds: DataSource[]) => {
    setDataSources(ds)
  }, [setDataSources])

  const handlePointDsCreated = (ds: DataSource) => {
    setPointOutputDS(ds)
  }

  const handleSelectedNetworkChange = (network: NetworkItem, isNetworkChange?: boolean) => {
    const networkItem = lrsLayers.find(layer => layer?.layerInfo?.serviceId === network?.id)
    const match = routeDetails.find(info => info.id === network?.id)

    setDefaultRouteDetails(match)
    setSelectedNetwork(networkItem?.networkInfo)
    setIsNetworkChange(isNetworkChange)
  }

  // Update routeInfo state changes.
  const handleRouteInfoUpdate = async (newRouteInfo: RouteInfo, flash: boolean = false) => {
    const routeColor = config.highlightStyle.routeColor
    const routeWidth = config.highlightStyle.width
    if (isDefined(newRouteInfo.selectedPolyline) && flash) {
      flashSelectedGeometry(await getGeometryGraphic(await getSimpleLineGraphic(newRouteInfo.selectedPolyline), routeColor, routeWidth))
    }
    if (isDefined(newRouteInfo.selectedPoint)) {
      onUpdateGraphics(await getGeometryGraphic(await getSimplePointGraphic(newRouteInfo.selectedPoint), colorGreen))
    } else {
      onClearPickedGraphics()
    }
    JimuMapView.clearSelectedFeatures()
  }

  const handleRoutePickerChange = () => {
    const isPickerActive = !isRoutePickerActive
    setIsRoutePickerActive(isPickerActive)
    if (isPickerActive) {
      if (JimuMapView?.view?.popupEnabled) JimuMapView.view.popupEnabled = false
      onClearFlashGraphics()
      onClearPickedGraphics()
    } else {
      JimuMapView.view.popupEnabled = defaultShowPp
    }
  }

  const getDefaultNetwork = (routeDetails) => {
    let defaultNetwork = routeDetails.find((route) => config?.defaultNetworkLayer === route?.id)
    if (!defaultNetwork) defaultNetwork = routeDetails[0]

    const networkItem = lrsLayers.find(layer => layer?.layerInfo?.serviceId === defaultNetwork?.id)
    setDefaultRouteDetails(defaultNetwork)
    setSelectedNetwork(networkItem?.networkInfo)
    setIsNetworkChange(false)
  }

  const updateRouteDetails = async (routeDetails) => {
    const promises = []
    const measureOids = {}

    routeDetails.forEach(async (routeDetail) => {
      const objectIds = []
      routeDetail?.routes?.forEach((route) => {
        route?.timeDependedInfo?.forEach((info) => {
          const id = info?.objectId
          objectIds.push(id)
          measureOids[id] = info?.selectedMeasures?.[0]
        })
      })
      promises.push(getDataRecord(objectIds, routeDetail?.routes?.[0]?.objectIdFieldName,
        routeDetail?.routes?.[0]?.featureDS))
    })
    const results = await Promise.all(promises)
    setMeasuresOids(measureOids)
    setAllDataRecords(results)
    // set the default network when clicked on new location in the map
    getDefaultNetwork(routeDetails)
    setRouteDetals(routeDetails)
  }

  const updateEventDetails = (eventDetails) => {
    setEventDetails(eventDetails)
  }

  const handleShowPp = (val) => {
    setShowPp(val)
  }

  return (
    <div>
      <DataSourceManager
        selectedNetwork={selectedNetwork}
        onCreatePointDs={handlePointDsCreated}
        lrsLayers={lrsLayers}
        dataSourcesReady={handleDataSourcesReady}
        handleSetDataSources={handleSetDataSources}
      />
      <RoutePicker
        intl={intl}
        isReady={isDSReady}
        active={isRoutePickerActive}
        allDataSources={allDataSources}
        lrsLayers={lrsLayers}
        jimuMapView={JimuMapView}
        symbolColor={null}
        hoverGraphic={hoverGraphic}
        onActiveChange={handleRoutePickerChange}
        onRouteInfoUpdated={handleRouteInfoUpdate}
        clearPickedGraphic={onClearPickedGraphics}
        clearFlashGraphic={onClearFlashGraphics}
        setRouteDetails={updateRouteDetails}
        setEventDetails={updateEventDetails}
        eventDataRecords={eventDataRecords}
        config={config}
        handleShowPp={handleShowPp}
        />
      { routeDetails && (routeDetails.length > 0) && (results.length > 0) && showPp && (<RoutePickerPopup
        intl={intl}
        allDataSources={allDataSources}
        eventDetails={eventDetails}
        jimuMapView={JimuMapView}
        onRouteInfoUpdated={handleRouteInfoUpdate}
        clearPickedGraphic={onClearPickedGraphics}
        config={config}
        isNetworkChange={isNetworkChange}
        widgetId={widgetId}
        outputDS={outputPointDS}
        dataRecords={results}
        measuresOids={measuresOids}
        selectedLocationInfo={defaultRouteDetails || routeDetails[0]}
        networkLayers={routeDetails}
        handleSelectedNetworkChange={handleSelectedNetworkChange}
      />)}
  </div>
  )
}
