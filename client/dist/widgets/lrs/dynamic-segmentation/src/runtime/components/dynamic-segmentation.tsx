/** @jsx jsx */
import {
  type DataSource,
  React,
  jsx,
  type ImmutableArray,
  type ImmutableObject,
  hooks,
  type IntlShape
} from 'jimu-core'
import {
  AttributeInputType,
  type MessageProp,
  type AttributeSetParam,
  type RouteInfoFromDataAction,
  DisplayType,
  type MeasureRange
} from '../../config'
import { type LrsLayer, isDefined, type AttributeSets, type NetworkInfo, GetUnits } from 'widgets/shared-code/lrs'
import { useDynSegRuntimeDispatch, useDynSegRuntimeState } from '../state'
import { Loader } from './loader'
import { createDynSegFeatureLayer, populateFeatureLayer } from '../utils/feature-layer-utils'
import { getAttributeSetParam, queryAttributeSets } from '../utils/service-utils'
import defaultMessages from '../translations/default'
import { MapViewManager, type JimuMapView } from 'jimu-arcgis'
import { CalcitePanel, CalcitePopover } from 'calcite-components'
import { Label } from 'jimu-ui'
import { Actions } from './actions/actions'
import { Toast } from './toast'
import { DynSegTableTask } from './table/dyn-seg-table-task'
import { DynSegDiagramTask } from './diagram/dyn-seg-diagram-task'
import { FieldCalcPopup } from './actions/fieldCalcPopup'
import { getOperationDate, getWhereClause } from '../utils/edit-utils'
import { DynSegFields } from '../../constants'

export interface DynamicSegmentationProps {
  widgetId: string
  allowMerge: boolean
  conflictPreventionEnabled: boolean
  intl: IntlShape
  networkDS: DataSource
  routeInfo: RouteInfoFromDataAction
  lrsLayers: ImmutableArray<LrsLayer>
  attributeSets: ImmutableObject<AttributeSets>
  defaultPointAttributeSet: string
  defaultLineAttributeSet: string
  attributeInputType: AttributeInputType
  mapHighlightColor: string
  graphicsLayer: __esri.GraphicsLayer
  defaultDisplayType: DisplayType
  defaultDiagramScale: number
  jimuMapView: JimuMapView
  outputDataSources: ImmutableArray<string>
  showEventStatistics: boolean
  useMapWidgetIds?: ImmutableArray<string>
  onResetDataAction: () => void
}

export function DynamicSegmentation (props: DynamicSegmentationProps) {
  const {
    widgetId,
    allowMerge,
    conflictPreventionEnabled,
    intl,
    networkDS,
    routeInfo,
    lrsLayers,
    attributeSets,
    defaultPointAttributeSet,
    defaultLineAttributeSet,
    attributeInputType,
    mapHighlightColor,
    graphicsLayer,
    defaultDisplayType,
    defaultDiagramScale,
    jimuMapView,
    outputDataSources,
    showEventStatistics,
    useMapWidgetIds,
    onResetDataAction
  } = props
  const getI18nMessage = hooks.useTranslation(defaultMessages)
  const [currentNetworkDS, setCurrentNetworkDS] = React.useState<DataSource>(null)
  const [currentRouteInfo, setCurrentRouteInfo] = React.useState<RouteInfoFromDataAction>(null)
  const [dynSegFeatureLayer, setDynSegFeatureLayer] = React.useState<__esri.FeatureLayer>(null)
  const [attributeSet, setAttributeSet] = React.useState<AttributeSetParam[]>([])
  const [measureRange, setMeasureRange] = React.useState<MeasureRange>(null)
  const [alertOpen, setAlertOpen] = React.useState<boolean>(false)
  const [popoverEle, setPopoverEle] = React.useState<any>()
  const [alertMessage, setAlertMessage] = React.useState<MessageProp>({ title: '', body: '', type: 'brand' })
  const { isLoading, pendingEdits, records, display } = useDynSegRuntimeState()
  const dispatch = useDynSegRuntimeDispatch()

  // Notify user of pending edits before leaving/refreshing page
  React.useEffect(() => {
    const unloadCallback = (event) => {
      if (pendingEdits.size > 0) {
        const e = event
        e.preventDefault()
        if (e) {
          e.returnValue = ''
        }
        return ''
      }
    }

    window.addEventListener('beforeunload', unloadCallback)
    return () => {
      window.removeEventListener('beforeunload', unloadCallback)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    dispatch({ type: 'SET_DISPLAY', value: defaultDisplayType })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultDisplayType])

  React.useEffect(() => {
    dispatch({ type: 'SET_OUTPUT_DATA_SOURCES', value: outputDataSources })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outputDataSources])

  React.useEffect(() => {
    if (isDefined(networkDS) && isDefined(routeInfo)) {
      dispatch({ type: 'RESET_STATE', action: '' })
      queryAttributeSet(networkDS, routeInfo)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeInfo])

  React.useEffect(() => {
    if (isDefined(jimuMapView)) {
      dispatch({ type: 'SET_JIMU_MAP_VIEW', value: jimuMapView })
    }
  }, [dispatch, jimuMapView])

  React.useEffect(() => {
    if (isDefined(graphicsLayer)) {
      dispatch({ type: 'SET_HIGHLIGHT_LAYER', value: graphicsLayer })
    }
    if (isDefined(mapHighlightColor)) {
      dispatch({ type: 'SET_HIGHLIGHT_COLOR', value: mapHighlightColor })
    }
  }, [dispatch, graphicsLayer, mapHighlightColor])

  const getActiveMap = (): JimuMapView => {
    let returnVal = null
    if (useMapWidgetIds?.length > 0) {
      const mvManager: MapViewManager = MapViewManager.getInstance()
      const mapViewGroups = mvManager.getJimuMapViewGroup(useMapWidgetIds?.[0])
      if (mapViewGroups && mapViewGroups.jimuMapViews) {
        for (const id in mapViewGroups.jimuMapViews) {
          if (mapViewGroups.jimuMapViews[id].dataSourceId) {
            if (
              mapViewGroups.jimuMapViews[id].isActive ||
                mapViewGroups.jimuMapViews[id].isActive === undefined
            ) {
              returnVal = mapViewGroups.jimuMapViews[id]
            }
          }
        }
      }
    }
    return returnVal
  }

  const queryAttributeSet = async (networkDS: DataSource, routeInfo: RouteInfoFromDataAction): Promise<void> => {
    const date = getOperationDate(networkDS)
    const attributeSet = getAttributeSet(routeInfo)

    let mapView = jimuMapView
    if (!isDefined(mapView)) {
      mapView = getActiveMap()
    }

    if (!isDefined(mapView)) {
      // TODO: display error message in UI
      dispatch({ type: 'SET_IS_LOADING', value: false })
    }

    await queryAttributeSets(networkDS, routeInfo, date, attributeSet).then(async (results) => {
      const featureLayer = await createDynSegFeatureLayer(routeInfo.networkInfo, lrsLayers, attributeSet, mapView)
      await populateFeatureLayer(results, featureLayer, routeInfo.networkInfo).then(async () => {
        setDynSegFeatureLayer(featureLayer) //pass feature layer
        setAttributeSet(attributeSet)
        setCurrentNetworkDS(networkDS)
        setCurrentRouteInfo(routeInfo)
        setMeasureRange({ from: routeInfo.fromMeasure, to: routeInfo.toMeasure })
        onResetDataAction()
        loadRecords(featureLayer, networkDS)
      })
    }).catch((err) => {
      setDynSegFeatureLayer(null)
      setAttributeSet([])
      setCurrentNetworkDS(null)
      setCurrentRouteInfo(null)
      dispatch({ type: 'SET_IS_LOADING', value: false })
    })
  }

  const loadRecords = async (featureLayer: __esri.FeatureLayer, networkDS: DataSource) => {
    if (!isDefined(featureLayer)) return
    const query = featureLayer.createQuery()
    query.outFields = ['*']
    query.returnGeometry = true
    query.where = getWhereClause(networkDS)
    query.orderByFields = [DynSegFields.fromMeasureName]

    featureLayer.queryFeatures(query).then(async (results) => {
      dispatch({ type: 'SET_RECORDS', value: results.features })
      dispatch({ type: 'SET_ORIGINAL_RECORDS', value: results.features })
      if (results.features.length === 0) {
        dispatch({ type: 'SET_IS_LOADING', value: false })
      }
    }).catch((err) => {
      dispatch({ type: 'SET_RECORDS', value: [] })
      dispatch({ type: 'SET_ORIGINAL_RECORDS', value: [] })
      dispatch({ type: 'SET_IS_LOADING', value: false })
    })
  }

  const reloadRecords = async () => {
    if (isDefined(dynSegFeatureLayer)) {
      dispatch({ type: 'SET_RECORDS', value: [] })
      dispatch({ type: 'SET_ORIGINAL_RECORDS', value: [] })
      setTimeout(() => {
        loadRecords(dynSegFeatureLayer, currentNetworkDS)
      }, 100)
    }
  }

  const getAttributeSet = (routeInfo: RouteInfoFromDataAction): AttributeSetParam[] => {
    const pointAttributeSet = attributeSets.attributeSet.find((attributeSet) => attributeSet.title === defaultPointAttributeSet)
    const lineAttributeSet = attributeSets.attributeSet.find((attributeSet) => attributeSet.title === defaultLineAttributeSet)
    let pointAttributeSetParam = []
    if (attributeInputType === AttributeInputType.LineAndPoint) {
      pointAttributeSetParam = getAttributeSetParam(routeInfo, lrsLayers, pointAttributeSet)
    }
    const lineAttributeSetParam = getAttributeSetParam(routeInfo, lrsLayers, lineAttributeSet)
    return pointAttributeSetParam.concat(lineAttributeSetParam)
  }

  const getDateRangeLabel = () => {
    const date = isDefined(currentNetworkDS) ? getOperationDate(currentNetworkDS) : null
    const dateString = isDefined(date) ? date.toLocaleDateString() : ''
    return getI18nMessage('dateLabel', { date: dateString })
  }

  const getMeasureRange = () => {
    const fromM = isDefined(currentRouteInfo) ? currentRouteInfo.fromMeasure : NaN
    const toM = isDefined(currentRouteInfo) ? currentRouteInfo.toMeasure : NaN
    if (isNaN(fromM) || isNaN(toM)) {
      return getI18nMessage('measureRangeNoValue')
    }
    const units = GetUnits(currentRouteInfo.networkInfo.unitsOfMeasure, intl)
    return getI18nMessage('measureRangeValue', { fromM: fromM, toM: toM, units: units })
  }

  const getRouteLabel = () => {
    const routeId = isDefined(currentRouteInfo) ? currentRouteInfo.routeId : ''
    const routeName = isDefined(currentRouteInfo) ? currentRouteInfo.routeName : ''
    if (isDefined(currentRouteInfo) && currentRouteInfo.networkInfo.useRouteName) {
      return getI18nMessage('routeNameLabel', { routeName: routeName })
    } else {
      return getI18nMessage('routeIdLabel', { routeId: routeId })
    }
  }

  const getNetworkInfo = (): ImmutableObject<NetworkInfo> => {
    if (isDefined(currentRouteInfo)) {
      return currentRouteInfo.networkInfo
    }
    return null
  }

  const handleSave = (messagePros: MessageProp) => {
    setAlertMessage(messagePros)
    setAlertOpen(true)
  }

  const handleToastClose = () => {
    setAlertOpen(false)
    if (alertMessage.type === 'success') {
      setAlertMessage({ title: '', body: '', type: 'brand' })
      reloadRecords()
    }
  }

  const handleFieldCalculator = (info) => {
    if (info) setPopoverEle(info)
  }

  const handleLockToast = (messageProp) => {
    if (messageProp.type === 'success') { /* empty */ } else {
      messageProp.time = 60000
    }
    setAlertMessage(messageProp)
    setAlertOpen(true)
  }

  return (
    <CalcitePanel>
      <div slot='header-content' className='d-flex' style={{ flexDirection: 'column', height: '40px' }}>
        <Label size='sm' centric style={{ fontWeight: '600', marginBottom: '0px' }}>{getRouteLabel()}</Label>
        <div className='d-flex' style={{ flexDirection: 'row' }}>
          <Label size='sm' centric style={{ marginBottom: '0px' }}>{getDateRangeLabel()}</Label>
          <Label size='sm' centric style={{ paddingLeft: '10px', marginBottom: '0px' }}>{getMeasureRange()}</Label>
        </div>
      </div>
      {popoverEle && (<CalcitePopover
          autoClose={undefined}
          closable={true}
          overlayPositioning='absolute'
          scale='m'
          label={popoverEle.heading}
          heading={popoverEle.heading}
          style={{ width: '300px' }}
          referenceElement={popoverEle.id}>
            {popoverEle.id === 'field-calculator' && (
              <FieldCalcPopup
                dynSegFeatureLayer={dynSegFeatureLayer}
                handleFieldCalculator={handleFieldCalculator}
                intl={intl}
                lrsLayers={lrsLayers}
                attributeSet={attributeSet}
                networkDS={currentNetworkDS}
                networkInfo={getNetworkInfo()}
                currentRouteInfo={currentRouteInfo}
                routeId={isDefined(currentRouteInfo) ? currentRouteInfo.routeId : ''}
                handleLockToast={handleLockToast}
              />
            )}
        </CalcitePopover>)}
      <Actions
        attributeSet={attributeSet}
        widgetId={widgetId}
        highlightLayer={graphicsLayer}
        highlightColor={mapHighlightColor}
        onSave={handleSave}
        lrsLayers={lrsLayers}
        networkDS={currentNetworkDS}
        networkInfo={getNetworkInfo()}
        jimuMapView={jimuMapView}
        dynSegFeatureLayer={dynSegFeatureLayer}
        handleFieldCalculator={handleFieldCalculator}
        intl={intl}
        allowMerge={allowMerge}
        routeId={isDefined(currentRouteInfo) ? currentRouteInfo.routeId : ''}
      />
      <div className='h-100'>
        <Loader
          isLoading={isLoading}
        />
        {alertOpen && (
          <Toast
            open={alertOpen}
            messageProp={alertMessage}
            onClose={handleToastClose}
          />
        )}
        {isDefined(dynSegFeatureLayer) && isDefined(currentRouteInfo) && records.length > 0 && (
          display === DisplayType.Table
            ? <DynSegTableTask
              intl={intl}
              featureLayer={dynSegFeatureLayer}
              records={records}
              lrsLayers={lrsLayers}
              attributeSet={attributeSet}
              networkInfo={currentRouteInfo.networkInfo}
              networkDS={networkDS}
              conflictPreventionEnabled={conflictPreventionEnabled}
              currentRouteInfo={currentRouteInfo}
              routeId={isDefined(currentRouteInfo) ? currentRouteInfo.routeId : ''}
              handleLockToast={handleLockToast}
            />
            : <DynSegDiagramTask
              intl={intl}
              widgetId={widgetId}
              featureLayer={dynSegFeatureLayer}
              records={records}
              lrsLayers={lrsLayers}
              attributeSet={attributeSet}
              measureRange={measureRange}
              defaultRange={defaultDiagramScale}
              networkInfo={currentRouteInfo.networkInfo}
              showEventStatistics={showEventStatistics}
            />
        )}
      </div>
    </CalcitePanel>
  )
}
