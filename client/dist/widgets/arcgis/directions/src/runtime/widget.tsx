/** @jsx jsx */
import { React, jsx, css, type AllWidgetProps, DataSourceManager, DataSourceStatus, type FeatureLayerDataSource, type UseUtility, UtilityManager, getAppStore, hooks, MutableStoreManager, ReactRedux, type IMState, ServiceManager, type ResourceSessions } from 'jimu-core'
import { type JimuMapView, JimuMapViewComponent } from 'jimu-arcgis'
import { defaultMessages as jimuUIMessages, WidgetPlaceholder } from 'jimu-ui'
import Directions from 'esri/widgets/Directions'
import RouteLayer from 'esri/layers/RouteLayer'
import locator from 'esri/rest/locator'

import { type IMConfig, type IMSearchConfig } from '../config'
import { DefaultJSAPISearchProperties } from '../constants'
import { getDirectionPointOutputDsId, getDirectionLineOutputDsId, getRouteOutputDsId, getStopOutputDsId } from '../utils'
import defaultMessages from './translations/default'
import WidgetIcon from '../../icon.svg'
import UtilsAlert from './components/utils-alert'

const { useEffect, useState, useRef, useCallback, useMemo } = React

const Widget = (props: AllWidgetProps<IMConfig>) => {
  const { config, id } = props
  const { searchConfig, routeConfig } = config
  const isDarkTheme = props.theme?.sys.color.mode === 'dark'
  const useMapWidgetId = props.useMapWidgetIds?.[0]
  const [jimuMapView, setJimuMapView] = useState<JimuMapView>(null)
  const sessionsRef = useRef<ResourceSessions>(null)
  const [utilitiesChangedFlag, setUtilitiesChangedFlag] = useState(Math.random())
  const containerRef = useRef<HTMLDivElement>(null)
  const directionsRef = useRef<__esri.Directions>(null)
  const watchLastRouteRef = useRef<__esri.WatchHandle>(null)
  const translate = hooks.useTranslation(defaultMessages, jimuUIMessages)
  const defaultSearchHint = useMemo(() => translate('findAddressOrPlace'), [translate])
  const [isReadyToRender, setIsReadyToRender] = useState<boolean>(false)
  const resourceSessions = ReactRedux.useSelector((state: IMState) => {
    return state.resourceSessions
  })

  const onActiveMapViewChange = useCallback(activeView => {
    setJimuMapView(activeView)
  }, [])

  const getAddressFromSources = useCallback(async (point: __esri.Point) => {
    const sources = searchConfig.dataConfig.map(c => {
      return getUrlOfUseUtility(c.useUtility)
    }).asMutable()
    const DEFAULT_GEOCODING_URL = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer'

    const convertPromises = sources.map(async (source) => {
      return locator.locationToAddress(source, { location: point })
    })

    let res = null
    for (const promise of convertPromises) {
      try {
        const { address } = await promise
        if (address) {
          res = address
          break
        }
      } catch (err) {
        console.error(err)
      }
    }
    // No reverse result by custom locator, try the default one
    if (!res) {
      const { address } = await locator.locationToAddress(DEFAULT_GEOCODING_URL, { location: point })
      res = address
    }
    return res
  }, [searchConfig?.dataConfig])

  const updateFromDataAction = useCallback(async () => {
    if (isReadyToRender && directionsRef.current && props.mutableStateProps) {
      const { directionsFromPoint, directionsToPoint, routeStops } = props.mutableStateProps

      if (directionsFromPoint) {
        const address = await getAddressFromSources(directionsFromPoint)
        directionsRef.current.layer.stops.at(0).geometry = directionsFromPoint
        directionsRef.current.layer.stops.at(0).name = address
        // Clean up once used
        MutableStoreManager.getInstance().updateStateValue(props.widgetId, 'directionsFromPoint', null)
        return
      }

      if (directionsToPoint) {
        const address = await getAddressFromSources(directionsToPoint)
        const stopLength = directionsRef.current.layer.stops.length
        directionsRef.current.layer.stops.at(stopLength - 1).geometry = directionsToPoint
        directionsRef.current.layer.stops.at(stopLength - 1).name = address
        MutableStoreManager.getInstance().updateStateValue(props.widgetId, 'directionsToPoint', null)
        return
      }

      if (routeStops) {
        const localStops = routeStops
        const stops = await Promise.all(localStops.map(async stopPoint => {
          const addressName = await getAddressFromSources(stopPoint)
          return {
            geometry: stopPoint,
            name: addressName
          }
        }))
        directionsRef.current.layer.stops.removeAll()
        directionsRef.current.layer.stops.addMany(stops)
        MutableStoreManager.getInstance().updateStateValue(props.widgetId, 'routeStops', null)
        return
      }

      await directionsRef.current.viewModel.load()
      // If valid stops are greater than two
      if (directionsRef.current.viewModel.layer.stops.filter(point => point.geometry !== null).length >= 2) {
        await directionsRef.current.viewModel.getDirections()
      }
    }
  }, [getAddressFromSources, isReadyToRender, props.mutableStateProps, props.widgetId])

  useEffect(() => {
    function helper () {
      if (useMapWidgetId && routeConfig?.useUtility && searchConfig?.dataConfig?.length > 0) {
        const utilities = getAppStore().getState().appConfig?.utilities
        const isAnySearchUtilReady = searchConfig.dataConfig.some(searchDataConfig => {
          return utilities[searchDataConfig.useUtility.utilityId]
        })
        const isUtilReady = !!(utilities && utilities[routeConfig.useUtility.utilityId] && isAnySearchUtilReady)
        setIsReadyToRender(!!(routeConfig && isUtilReady))
      } else {
        setIsReadyToRender(false)
      }
    }
    helper()
  }, [useMapWidgetId, routeConfig?.useUtility, searchConfig?.dataConfig, routeConfig, props?.useUtilities])

  useEffect(() => {
    updateFromDataAction()
  })

  useEffect(() => {
    checkUtilityAccount()

    async function checkUtilityAccount () {
      if (sessionsRef.current === resourceSessions || !props?.useUtilities) {
        return
      }

      const prevResourceSessions = sessionsRef.current
      sessionsRef.current = resourceSessions

      const utilUrls = props?.useUtilities?.map(useUtility => {
        return UtilityManager.getInstance().getUtilityJson(useUtility.utilityId)?.url
      })
      const serverInfos = await Promise.all(utilUrls.map(utilUrl => {
        return ServiceManager.getInstance().fetchArcGISServerInfo(utilUrl)
      }))
      const urlSet = new Set<string>()
      for (let i = 0; i < utilUrls.length; i++) {
        urlSet.add(serverInfos[i].owningSystemUrl || utilUrls[i])
      }
      const urls = [...urlSet]
      const resourceSessionsKeys = Object.keys(resourceSessions || {})

      for (const url of urls) {
        // Owning system url exact match, `url` here is the owning system url
        if (resourceSessions[url] && resourceSessions[url] !== prevResourceSessions?.[url]) {
          setUtilitiesChangedFlag(Math.random())
          return
        }
        for (const resourceUrl of resourceSessionsKeys) {
          // The resource url is part of the full util url
          if (url.includes(resourceUrl) && resourceSessions[resourceUrl] !== prevResourceSessions?.[resourceUrl]) {
            setUtilitiesChangedFlag(Math.random())
            return
          }
        }
      }
    }
  }, [props?.useUtilities, resourceSessions])

  useEffect(() => {
    if (isReadyToRender && jimuMapView?.view && containerRef.current) {
      updateDirectionsWidget()
    } else {
      destroyDirectionsWidget()
    }

    async function updateDirectionsWidget () {
      destroyDirectionsWidget()
      const rawRouteServiceUrl = getUrlOfUseUtility(routeConfig?.useUtility)
      // const routeServiceUrl = proxyUtils.getWhetherUseProxy() ? proxyUtils.getProxyUrl(rawRouteServiceUrl) || rawRouteServiceUrl : rawRouteServiceUrl
      const routeServiceUrl = rawRouteServiceUrl
      const searchProperties = await convertSearchConfigToJSAPISearchProperties(searchConfig, defaultSearchHint)
      const c = document.createElement('div')
      c.className = 'directions-container'
      if (isDarkTheme) {
        c.className += ' dark-theme'
      }
      containerRef.current.innerHTML = ''
      containerRef.current.appendChild(c)

      const routeTitle = `${props.label} - ${translate('route')}`
      const newRouteLayer = new RouteLayer({ id, url: routeServiceUrl, title: routeTitle })
      if (typeof config.showRuntimeLayers === 'boolean' && !config.showRuntimeLayers) {
        newRouteLayer.listMode = 'hide'
      }

      jimuMapView?.view?.map?.add(newRouteLayer)

      directionsRef.current = new Directions({
        id,
        layer: newRouteLayer,
        container: c,
        view: jimuMapView?.view,
        searchProperties: searchProperties
      })

      // Set route parameters to get needed data from route service.
      directionsRef.current.viewModel.routeParameters.returnRoutes = true
      directionsRef.current.viewModel.routeParameters.returnDirections = true
      directionsRef.current.viewModel.routeParameters.returnStops = true

      // Get start/end point from the action for widget-controller scenario
      updateFromDataAction()

      setOutputDssNotReady(id)
      watchLastRoute()
    }

    function watchLastRoute () {
      watchLastRouteRef.current = directionsRef.current.watch('lastRoute', () => {
        if (props.autoHeight) {
          // Add max height to container for auto height style
          containerRef.current.style.maxHeight = '750px'
        }
        if (directionsRef.current.lastRoute) { // If there is route result, change status of output data sources to unloaded.
          setOutputDssUnloadedAndSetLayer(id, directionsRef.current.lastRoute)
        } else { // If there isn't route result, change status of output data sources to not_ready.
          setOutputDssNotReady(id)
        }
      })
    }

    function destroyDirectionsWidget () {
      // If do not have map, destroy will throw error.
      if (directionsRef.current?.view?.map) {
        const prevRouteLayer = directionsRef.current.view.map.findLayerById(id)
        if (prevRouteLayer) {
          jimuMapView.view.map.remove(prevRouteLayer)
        }
        directionsRef.current.destroy()
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
      try {
        // Remove save as popper.
        const saveAsPopper = document.querySelector('calcite-panel.esri-save-layer')?.parentElement
        if (saveAsPopper && saveAsPopper.tagName.toUpperCase() === 'CALCITE-POPOVER') {
          document.body.removeChild(saveAsPopper)
        }
      } catch (e) {}
    }

    return () => {
      watchLastRouteRef.current?.remove()
      destroyDirectionsWidget()
    }
  }, [id, jimuMapView?.view, searchConfig, routeConfig?.useUtility, defaultSearchHint, isReadyToRender, isDarkTheme, props.autoHeight, updateFromDataAction, utilitiesChangedFlag, props.label, translate, config?.showRuntimeLayers])

  return (
    <div className='widget-directions jimu-widget'>
      {
        isReadyToRender
          ? <JimuMapViewComponent useMapWidgetId={useMapWidgetId} onActiveViewChange={onActiveMapViewChange} />
          : <WidgetPlaceholder widgetId={id} icon={WidgetIcon} message={translate('_widgetLabel')} />
      }
      <div ref={containerRef} css={style}></div>
      <UtilsAlert useUtilities = {props.useUtilities} ></UtilsAlert>
    </div>
  )
}

export default Widget

const style = css`
  width: 100% !important;
  height: 100% !important;
  .directions-container{
    width: 100% !important;
    height: 100% !important;
    .esri-search{
      .esri-search__container{
        .esri-search__sources-button{
          z-index: 0;
          border-top: none;
          border-right: solid 1px var(--ref-palette-neutral-400);
          border-bottom: none;
          border-left: none;
          margin-right: 1px;
          margin-bottom: 2px;
        }
        .esri-search__input-container{
          margin: auto;
          .esri-search__clear-button{
            z-index: 0;
            right: 4px;
          }
        }
      }
      .esri-search--multiple-sources {
        .esri-search__sources-button {
          border-right: inherit;
        }
        .esri-search__input {
          border: 1px solid #959595;
        }
      }
    }
    .esri-directions__panel-content{
      padding: 0 0 20px 0;
      div[role='button'] {
        cursor: unset;
      }
    }
    .esri-directions__add-stop-button{
      --calcite-ui-text-1: var(--ref-palette-neutral-1200);
    }
    &.dark-theme img.esri-directions__maneuver-icon{
      filter: invert(100%);
    }
  }
`

async function convertSearchConfigToJSAPISearchProperties (searchConfig: IMSearchConfig, defaultHint: string): Promise< __esri.DirectionsSearchProperties & { locationEnabled?: boolean }> {
  const properties: __esri.DirectionsSearchProperties & { locationEnabled?: boolean } = { ...DefaultJSAPISearchProperties }

  const hint = searchConfig?.generalConfig?.hint || defaultHint
  if (hint) {
    properties.allPlaceholder = hint
  }
  if (typeof searchConfig?.suggestionConfig?.maxSuggestions === 'number') {
    properties.maxSuggestions = searchConfig.suggestionConfig.maxSuggestions
  }
  if (typeof searchConfig?.suggestionConfig?.isUseCurrentLoation === 'boolean') {
    properties.locationEnabled = searchConfig.suggestionConfig.isUseCurrentLoation
  }
  if (Array.isArray(searchConfig?.dataConfig)) {
    const sourcesPromise = searchConfig?.dataConfig.map(async c => {
      const rawGeocodeURL = getUrlOfUseUtility(c.useUtility)
      // const geocodeURL = proxyUtils.getWhetherUseProxy() ? proxyUtils.getProxyUrl(rawGeocodeURL) || rawGeocodeURL : rawGeocodeURL
      const geocodeURL = rawGeocodeURL
      const sources = {
        url: geocodeURL,
        name: c.label,
        placeholder: c.hint || defaultHint
      } as __esri.LocatorSearchSource
      return Promise.resolve(sources)
    })
    await Promise.all(sourcesPromise).then(sources => {
      properties.sources = sources as any
    })
  }

  return Promise.resolve(properties)
}

function getUrlOfUseUtility (useUtility: UseUtility): string {
  if (!useUtility) {
    return null
  }
  return UtilityManager.getInstance().getUtilityJson(useUtility.utilityId)?.url
}

async function setOutputDssNotReady (widgetId: string) {
  try {
    const stopOutputDs = await DataSourceManager.getInstance().createDataSource(getStopOutputDsId(widgetId)) as FeatureLayerDataSource
    const routeOutputDs = await DataSourceManager.getInstance().createDataSource(getRouteOutputDsId(widgetId)) as FeatureLayerDataSource
    const directionPointOutputDs = await DataSourceManager.getInstance().createDataSource(getDirectionPointOutputDsId(widgetId)) as FeatureLayerDataSource
    const directionLineOutputDs = await DataSourceManager.getInstance().createDataSource(getDirectionLineOutputDsId(widgetId)) as FeatureLayerDataSource

    setDsNotReady(stopOutputDs)
    setDsNotReady(routeOutputDs)
    setDsNotReady(directionPointOutputDs)
    setDsNotReady(directionLineOutputDs)
  } catch (e) {
    console.log('Failed to create directions output data sources. ', e)
  }
}

async function setOutputDssUnloadedAndSetLayer (widgetId: string, result: __esri.RouteLayerSolveResult) {
  try {
    const stopOutputDs = await DataSourceManager.getInstance().createDataSource(getStopOutputDsId(widgetId)) as FeatureLayerDataSource
    const routeOutputDs = await DataSourceManager.getInstance().createDataSource(getRouteOutputDsId(widgetId)) as FeatureLayerDataSource
    const directionPointOutputDs = await DataSourceManager.getInstance().createDataSource(getDirectionPointOutputDsId(widgetId)) as FeatureLayerDataSource
    const directionLineOutputDs = await DataSourceManager.getInstance().createDataSource(getDirectionLineOutputDsId(widgetId)) as FeatureLayerDataSource

    await createJSAPILayerForDs(stopOutputDs, 'point', convertToJSAPIGraphic(result.stops?.toArray()))
    await createJSAPILayerForDs(routeOutputDs, 'polyline', convertToJSAPIGraphic(result.routeInfo ? [result.routeInfo] : []))
    await createJSAPILayerForDs(directionPointOutputDs, 'point', convertToJSAPIGraphic(result.directionPoints?.toArray()))
    await createJSAPILayerForDs(directionLineOutputDs, 'polyline', convertToJSAPIGraphic(result.directionLines?.toArray()))

    setDsUnloaded(stopOutputDs)
    setDsUnloaded(routeOutputDs)
    setDsUnloaded(directionPointOutputDs)
    setDsUnloaded(directionLineOutputDs)
  } catch (e) {
    console.log('Failed to create directions output data sources. ', e)
  }
}

function setDsNotReady (ds: FeatureLayerDataSource) {
  if (ds) {
    ds.setStatus(DataSourceStatus.NotReady)
    ds.setCountStatus(DataSourceStatus.NotReady)
  }
}

function setDsUnloaded (ds: FeatureLayerDataSource) {
  if (ds) {
    ds.setStatus(DataSourceStatus.Unloaded)
    ds.setCountStatus(DataSourceStatus.Unloaded)
  }
}

async function createJSAPILayerForDs (ds: FeatureLayerDataSource, geoType: 'point' | 'polyline', source: __esri.Graphic[]) {
  if (!ds) {
    return
  }
  await ds.setSourceFeatures(source, {
    id: ds.id,
    geometryType: geoType
  })
}

function convertToJSAPIGraphic (res: __esri.Stop[] | __esri.RouteInfo[] | __esri.DirectionLine[] | __esri.DirectionPoint[]): __esri.Graphic[] {
  if (!res) {
    return []
  }
  return res.map((r: __esri.Stop | __esri.RouteInfo | __esri.DirectionLine | __esri.DirectionPoint) => r?.toGraphic()).filter(g => !!g)
}
