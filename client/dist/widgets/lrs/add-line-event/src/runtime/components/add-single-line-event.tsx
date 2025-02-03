/** @jsx jsx */
import { React, jsx, hooks, type ImmutableArray, css, classNames, type ImmutableObject, Immutable, type DataSource, type IntlShape } from 'jimu-core'
import defaultMessages from '../translations/default'
import { type FeatureLayerDataSource, type JimuMapView } from 'jimu-arcgis'
import { type OperationType, type DefaultInfo } from '../../config'
import {
  type EventInfo,
  type LrsLayer,
  type RouteInfo,
  type RouteMeasurePickerInfo,
  InlineEditableDropdown,
  LrsLayerType,
  SearchMethod,
  getGeometryGraphic,
  getInitialEventInfoState,
  getInitialRouteInfoState,
  getInitialRouteMeasurePickerInfoState,
  getSimpleLineGraphic,
  getSimplePointGraphic,
  isDefined,
  LockManagerComponent,
  LockAction,
  type LrsLocksInfo,
  type AcquireLockResponse,
  getIntialLocksInfo
} from 'widgets/shared-code/lrs'
import { Checkbox, FOCUSABLE_CONTAINER_CLASS, Label, Select, Button } from 'jimu-ui'
import { AddLineEventFormHeader } from './add-line-event-form-header'
import type GraphicsLayer from 'esri/layers/GraphicsLayer'
import { AddLineEventAttributes } from './add-line-event-attributes'
import { DataSourceManager } from '../data-source/data-source-manager'
import { AddLineEventRouteSelectionForm } from './add-line-event-route-selection-form'
import { AddLineEventDateForm } from './add-line-event-date-form'
import { colorCyan, colorGreen, colorRed } from '../constants'
import { MergeRetireForm } from './merge-retire-form'
import { round } from 'lodash-es'
import { type FeatureLayerDataSourceImpl } from 'jimu-core/data-source'
import { AddLineEventOperationType } from './add-line-event-operation-type'

export interface AddSingleLineEventProps {
  intl: IntlShape
  widgetId: string
  lrsLayers: ImmutableArray<LrsLayer>
  lineEventLayers: ImmutableArray<string>
  networkLayers: ImmutableArray<string>
  instersectionLayers: ImmutableArray<string>
  defaultEvent: DefaultInfo
  defaultFromMethod: SearchMethod
  defaultToMethod: SearchMethod
  JimuMapView: JimuMapView
  operationType: OperationType
  hoverGraphic: GraphicsLayer
  pickedFromGraphic: GraphicsLayer
  pickedToGraphic: GraphicsLayer
  flashGraphic: GraphicsLayer
  hideMethod: boolean
  hideEvent: boolean
  hideNetwork: boolean
  hideType: boolean
  hideMeasures: boolean
  hideDates: boolean
  hideTitle: boolean
  useRouteStartEndDate: boolean
  conflictPreventionEnabled: boolean
  networkDataSourceFromDataAction: DataSource
  routeInfoFromDataAction: RouteInfo
  onResetDataAction: () => void
  onClearGraphics: () => void
  onClearHoverGraphic: () => void
  onOperationTypeChanged: (type: OperationType) => void
}

const getFormStyle = () => {
  return css`
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;

    &.wrapped .add-single-line-event-form {
      height: 100%;
    }
    .add-single-line-event__content {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      flex: 1 1 auto;
      overflow: auto;
    }
    .add-single-line-event__actions {
      height: 100%;
    }
    .add-line-footer {
      display: flex;
      height: auto;
      padding: 12px;
    }
  `
}

export function AddSingleLineEvent (props: AddSingleLineEventProps) {
  const getI18nMessage = hooks.useTranslation(defaultMessages)
  const {
    intl,
    widgetId,
    lrsLayers,
    lineEventLayers,
    networkLayers,
    defaultEvent,
    defaultFromMethod,
    defaultToMethod,
    JimuMapView,
    operationType,
    hoverGraphic,
    pickedFromGraphic,
    pickedToGraphic,
    flashGraphic,
    hideEvent,
    hideNetwork,
    hideType,
    hideMethod,
    hideMeasures,
    hideDates,
    hideTitle,
    useRouteStartEndDate,
    conflictPreventionEnabled,
    networkDataSourceFromDataAction,
    routeInfoFromDataAction,
    onResetDataAction,
    onClearGraphics,
    onClearHoverGraphic,
    onOperationTypeChanged
  } = props
  const [section, setSection] = React.useState(0)
  const [networkDS, setNetworkDS] = React.useState<DataSource>(null)
  const [eventDS, setEventDS] = React.useState<DataSource>(null)
  const [selectedNetwork, setSelectedNetwork] = React.useState<ImmutableObject<LrsLayer>>(null)
  const [selectedEvent, setSelectedEvent] = React.useState<ImmutableObject<LrsLayer>>(null)
  const [isDSReady, setIsDSReady] = React.useState<boolean>(false)
  const [selectedFromMethod, setSelectedFromMethod] = React.useState(defaultFromMethod)
  const [selectedToMethod, setSelectedToMethod] = React.useState(defaultToMethod)
  const [reset, setReset] = React.useState<boolean>(false)
  const [routeInfo, setRouteInfo] = React.useState<RouteInfo>(getInitialRouteInfoState())
  const [revalidateRouteFromDataAction, setRevalidateRouteFromDataAction] = React.useState<boolean>(false)
  const [useStartMeasure, setUseStartMeasure] = React.useState<boolean>(false)
  const [useEndMeasure, setUseEndMeasure] = React.useState<boolean>(false)
  const [lockInfo, setLockInfo] = React.useState<LrsLocksInfo>(getIntialLocksInfo())
  const [lockAquired, setLockAquired] = React.useState<boolean>(!conflictPreventionEnabled)
  const containerWrapperRef = React.useRef<HTMLDivElement>(null)
  const [resetSelectedField, setResetSelectedField] = React.useState<boolean>(false)

  // DS
  const handleNetworkDsCreated = React.useCallback(
    (ds: DataSource) => {
      setNetworkDS(ds)
    },
    [setNetworkDS]
  )

  const handleEventDsCreated = React.useCallback(
    (ds: DataSource) => {
      setEventDS(ds)
    },
    [setEventDS]
  )

  const handleDataSourcesReady = React.useCallback(() => {
    setIsDSReady(true)
  }, [setIsDSReady])

  React.useEffect(() => {
    containerWrapperRef.current?.focus()
  }, [])

  // Set defaults
  React.useEffect(() => {
    if (selectedEvent) {
      const networkLayer = lrsLayers.find(
        (item) => isDefined(item.networkInfo) && item.networkInfo.lrsNetworkId === selectedEvent.eventInfo.parentNetworkId
      )
      if (networkLayer && networkLayer.layerType === LrsLayerType.network) {
        setSelectedNetwork(Immutable(networkLayer))
      }
    } else {
      const defaultEventLayer = lrsLayers.find(
        (item) => item.name === defaultEvent.name
      )
      setSelectedEvent(Immutable(defaultEventLayer))
    }
  }, [defaultEvent, lrsLayers, selectedEvent])

  React.useEffect(() => {
    const newDataAction = isDefined(networkDataSourceFromDataAction) || isDefined(routeInfoFromDataAction)
    if (newDataAction) {
      handleReset()
    }

    if (newDataAction) {
      setTimeout(() => {
        if (isDefined(networkDataSourceFromDataAction)) {
          if (networkDataSourceFromDataAction.id !== selectedNetwork?.id) {
            setNetworkDS(networkDataSourceFromDataAction)
            let nds = networkDataSourceFromDataAction
            if (networkDataSourceFromDataAction.id.includes('output_point') || networkDataSourceFromDataAction.id.includes('output_line')) {
              nds = networkDataSourceFromDataAction.getOriginDataSources()[0] as FeatureLayerDataSourceImpl
            }

            let lrsLayer: ImmutableObject<LrsLayer>
            lrsLayers.forEach((layer) => {
              if (layer.id === nds.id && isDefined(layer.networkInfo)) {
                lrsLayer = layer
              }
            })
            const eventLayer = lrsLayers.find((item) => item.eventInfo.parentNetworkId === lrsLayer.networkInfo.lrsNetworkId && !item.eventInfo.isPointEvent)
            if (isDefined(eventLayer)) {
              handleEventChanged(eventLayer.name)
            }
          }
        }
        if (isDefined(routeInfoFromDataAction)) {
          // Two records were selected for dataAction but event is non-spanning so change toRoute to be fromRoute
          if (!selectedEvent.eventInfo.canSpanRoutes && routeInfoFromDataAction.routeId !== routeInfoFromDataAction.toRouteId) {
            routeInfoFromDataAction.toRouteId = routeInfoFromDataAction.routeId
            routeInfoFromDataAction.toRouteName = routeInfoFromDataAction.routeName
            routeInfoFromDataAction.toRouteFromMeasure = routeInfoFromDataAction.fromMeasure
            routeInfoFromDataAction.toRouteToMeasure = routeInfoFromDataAction.toMeasure
            routeInfoFromDataAction.selectedToPolyline = routeInfoFromDataAction.selectedPolyline
            routeInfoFromDataAction.toRouteFromDate = routeInfoFromDataAction.fromDate
            routeInfoFromDataAction.toRouteToDate = routeInfoFromDataAction.toDate
          }
          handleRouteInfoUpdate(routeInfoFromDataAction)
          setRevalidateRouteFromDataAction(true)
        }
      }, 2000)
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkDataSourceFromDataAction, routeInfoFromDataAction])

  // Set lock info
  React.useEffect(() => {
    if (conflictPreventionEnabled) {
      buildLockInfo()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEvent, selectedNetwork])

  const buildLockInfo = (action: LockAction = LockAction.None, routeInfo?: RouteInfo) => {
    const updatedLockInfo = { ...lockInfo }
    if (isDefined(selectedNetwork)) {
      updatedLockInfo.networkId = [selectedNetwork.networkInfo.lrsNetworkId]
    }
    if (isDefined(selectedEvent)) {
      updatedLockInfo.eventServiceLayerIds = [selectedEvent.serviceId]
    }
    if (isDefined(routeInfo)) {
      updatedLockInfo.routeInfo = routeInfo
    }
    updatedLockInfo.lockAction = action
    setLockInfo(updatedLockInfo)
  }

  // Event changed
  const handleEventChanged = React.useCallback(
    (value: string) => {
      const eventLayer = lrsLayers.find((item) => item.name === value)
      if (eventLayer) {
        const networkLayer = lrsLayers.find(
          (item) => isDefined(item.networkInfo) && item.networkInfo.lrsNetworkId === eventLayer.eventInfo.parentNetworkId
        )
        // reset the pickers to default state
        const newRouteMeasurePickerInfo = getInitialRouteMeasurePickerInfoState()
        handleRouteMeasurePickerInfoUpdate(newRouteMeasurePickerInfo)
        if (networkLayer && networkLayer.layerType === LrsLayerType.network) {
          if (selectedEvent && (selectedEvent.eventInfo.parentNetworkId !== eventLayer.eventInfo.parentNetworkId || eventLayer.eventInfo.canSpanRoutes ||
            (selectedEvent.eventInfo.canSpanRoutes && !eventLayer.eventInfo.canSpanRoutes))) {
            setSelectedNetwork(Immutable(networkLayer))

            if (!isDefined(routeInfoFromDataAction)) {
              const updateRouteInfo = getInitialRouteInfoState()
              handleRouteInfoUpdate(updateRouteInfo)
            }

            // reset the state of useStartMeasure and useEndMeasure
            if (!hideMeasures) {
              setUseStartMeasure(false)
              setUseEndMeasure(false)
            }
          }
        }
        setResetSelectedField(true)
        setSelectedEvent(Immutable(eventLayer))
        onClearHoverGraphic()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lrsLayers, selectedEvent, selectedNetwork, routeInfoFromDataAction]
  )

  // Network changed
  const handleNetworkChanged = React.useCallback(
    (value: string) => {
      const networkLayer = lrsLayers.find((layer) => layer.name === value)
      if (isDefined(networkLayer)) {
        setSelectedNetwork(Immutable(networkLayer))
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lrsLayers]
  )

  // From Method picker changed
  const handleFromMethodChanged = React.useCallback((value: SearchMethod) => {
    setSelectedFromMethod(value)
  }, [])

  // To Method picker changed
  const handleToMethodChanged = React.useCallback((value: SearchMethod) => {
    setSelectedToMethod(value)
  }, [])

  // Back to route selection.
  const handleNavBack = React.useCallback((reset: boolean) => {
    if (reset) {
      handleReset()
    }
    setSection(0)
    if (containerWrapperRef.current) {
      containerWrapperRef.current.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    setUseStartMeasure(hideMeasures)
    setUseEndMeasure(hideMeasures)
  }, [hideMeasures])

  React.useEffect(() => {
    if (hideMeasures) {
      setUseStartMeasure(hideMeasures)
      setUseEndMeasure(hideMeasures)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reset form to initial configuration
  const handleReset = () => {
    onClearGraphics()
    const updateRouteInfo = getInitialRouteInfoState()
    handleRouteInfoUpdate(updateRouteInfo, false, true)
    const updateEventInfo = getInitialEventInfoState()
    handleEventInfoUpdate(updateEventInfo)
    const newRouteMeasurePickerInfo = getInitialRouteMeasurePickerInfoState()
    handleRouteMeasurePickerInfoUpdate(newRouteMeasurePickerInfo)
    if (!hideMeasures) {
      setUseStartMeasure(false)
      setUseEndMeasure(false)
    }

    setReset(true)
    setTimeout(() => {
      setReset(false)
    }, 800)
  }

  // Update data action reset
  const resetDataAction = () => {
    setRevalidateRouteFromDataAction(false)
    onResetDataAction()
  }

  // Update routeInfo state changes.
  const handleRouteInfoUpdate = (
    newRouteInfo: RouteInfo,
    flash: boolean = false,
    reset: boolean = false
  ) => {
    setRouteInfo(newRouteInfo)
    updateGraphics(newRouteInfo, flash)
    if (conflictPreventionEnabled) {
      const action = reset ? LockAction.Clear : LockAction.QueryAndAcquire
      buildLockInfo(action, newRouteInfo)
    }
  }

  const [eventInfo, setEventInfo] = React.useState<EventInfo>(
    getInitialEventInfoState()
  )

  // Update eventInfo state changes.
  const handleEventInfoUpdate = (
    newEventInfo: EventInfo
  ) => {
    setEventInfo(newEventInfo)
  }

  // Set initial state of RouteMeasurePickerInfo
  const [routeMeasurePickerInfo, setRouteMeasurePickerInfo] = React.useState<RouteMeasurePickerInfo>(
    getInitialRouteMeasurePickerInfoState()
  )

  // Update RouteMeasurePickerInfo state changes
  const handleRouteMeasurePickerInfoUpdate = (
    newRouteMeasurePickerInfo: RouteMeasurePickerInfo
  ) => {
    setRouteMeasurePickerInfo(newRouteMeasurePickerInfo)
  }

  // Reset routeInfo when network changes.
  React.useEffect(() => {
    if (isDefined(selectedNetwork) && !isDefined(networkDataSourceFromDataAction)) {
      setRouteInfo(getInitialRouteInfoState())
      setEventInfo(getInitialEventInfoState())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNetwork])

  const handleNextClicked = () => {
    setResetSelectedField(false)
    setSection(1)
  }

  // Graphics
  const clearFromPickedGraphic = (): void => {
    if (isDefined(pickedFromGraphic)) {
      pickedFromGraphic.removeAll()
    }
  }

  const clearToPickedGraphic = (): void => {
    if (isDefined(pickedToGraphic)) {
      pickedToGraphic.removeAll()
    }
  }

  const updateFromPickedGraphic = (graphic: __esri.Graphic) => {
    if (!isDefined(graphic)) {
      clearFromPickedGraphic()
    } else {
      pickedFromGraphic.removeAll()
      pickedFromGraphic.add(graphic)
    }
  }

  const updateToPickedGraphic = (graphic: __esri.Graphic) => {
    if (!isDefined(graphic)) {
      clearToPickedGraphic()
    } else {
      pickedToGraphic.removeAll()
      pickedToGraphic.add(graphic)
    }
  }

  const flashSelectedGeometry = (graphic: __esri.Graphic) => {
    // Flash 3x
    if (isDefined(graphic)) {
      flashGraphic.add(graphic)
      setTimeout(() => {
        flashGraphic.removeAll()
        setTimeout(() => {
          flashGraphic.add(graphic)
          setTimeout(() => {
            flashGraphic.removeAll()
            setTimeout(() => {
              flashGraphic.add(graphic)
              setTimeout(() => {
                flashGraphic.removeAll()
              }, 800)
            }, 800)
          }, 800)
        }, 800)
      }, 800)
    }
  }

  const updateGraphics = async (routeInfo: RouteInfo, flash: boolean) => {
    if (isDefined(routeInfo.selectedPolyline) && flash) {
      flashSelectedGeometry(
        await getGeometryGraphic(
          await getSimpleLineGraphic(routeInfo.selectedPolyline),
          colorCyan
        )
      )
    }
    // From point
    if (isDefined(routeInfo.selectedPoint)) {
      updateFromPickedGraphic(
        await getGeometryGraphic(
          await getSimplePointGraphic(routeInfo.selectedPoint),
          colorGreen
        )
      )
    } else {
      clearFromPickedGraphic()
    }
    // To point
    if (isDefined(routeInfo.selectedToPoint)) {
      updateToPickedGraphic(
        await getGeometryGraphic(
          await getSimplePointGraphic(routeInfo.selectedToPoint),
          colorRed
        )
      )
    } else {
      clearToPickedGraphic()
    }

    if (isDefined(JimuMapView)) {
      JimuMapView.clearSelectedFeatures()
    }
  }

  // Returns if the current input data is valid.
  const isValidRouteSelection = React.useCallback(() => {
    let isValid = true
    isValid = isValid && routeInfo.routeId?.length > 0
    isValid = isValid && routeInfo.toRouteId?.length > 0

    if (!lockAquired) {
      return false
    }

    if (!isDefined(selectedNetwork) || !isDefined(selectedNetwork.networkInfo)) {
      return false
    }
    const fromMeasure = round(routeInfo.fromMeasure, selectedNetwork.networkInfo.measurePrecision)
    const toMeasure = round(routeInfo.toMeasure, selectedNetwork.networkInfo.measurePrecision)
    const selectedFromMeasure = round(routeInfo.selectedMeasure, selectedNetwork.networkInfo.measurePrecision)
    const selectedToMeasure = round(routeInfo.selectedToMeasure, selectedNetwork.networkInfo.measurePrecision)

    if (!isNaN(fromMeasure) && !isNaN(selectedFromMeasure)) {
      isValid = isValid && selectedFromMeasure >= fromMeasure
    } else {
      // No route selected or no measure on selected route.
      return false
    }

    if (!selectedEvent.eventInfo?.canSpanRoutes) {
      if (!isNaN(toMeasure) && !isNaN(selectedToMeasure)) {
        isValid = isValid && selectedToMeasure <= toMeasure
      } else {
        // No route selected or no measure on selected route.
        return false
      }
    } else {
      const toRouteFromMeasure = round(routeInfo.toRouteFromMeasure, selectedNetwork.networkInfo.measurePrecision)
      const toRouteToMeasure = round(routeInfo.toRouteToMeasure, selectedNetwork.networkInfo.measurePrecision)
      if (!isNaN(toRouteFromMeasure) && !isNaN(selectedToMeasure)) {
        isValid = isValid && selectedToMeasure >= toRouteFromMeasure
      } else {
        // No route selected or no measure on selected route.
        return false
      }
      if (!isNaN(toRouteToMeasure) && !isNaN(selectedToMeasure)) {
        isValid = isValid && selectedToMeasure <= toRouteToMeasure
      } else {
        // No route selected or no measure on selected route.
        return false
      }
    }

    // dates
    if (
      isDefined(routeInfo.selectedFromDate) &&
      !isDefined(routeInfo.selectedToDate)
    ) {
      // Only from date provided.
      if (isDefined(routeInfo.fromDate)) {
        isValid = isValid && routeInfo.selectedFromDate >= routeInfo.fromDate
      }
      if (isDefined(routeInfo.toDate)) {
        isValid = isValid && routeInfo.selectedFromDate < routeInfo.toDate
      }
    }
    if (
      !isDefined(routeInfo.selectedFromDate) &&
      isDefined(routeInfo.selectedToDate)
    ) {
      // Only to date provided.
      if (isDefined(routeInfo.fromDate)) {
        isValid = isValid && routeInfo.selectedToDate >= routeInfo.fromDate
      }
      if (isDefined(routeInfo.toDate)) {
        isValid = isValid && routeInfo.selectedToDate < routeInfo.toDate
      }
    }
    if (
      isDefined(routeInfo.selectedFromDate) &&
      isDefined(routeInfo.selectedToDate)
    ) {
      // Both from and to date provided.
      isValid = isValid && routeInfo.selectedFromDate < routeInfo.selectedToDate
      if (isDefined(routeInfo.fromDate)) {
        isValid = isValid && routeInfo.selectedFromDate >= routeInfo.fromDate
      }
      if (isDefined(routeInfo.toDate)) {
        isValid = isValid && routeInfo.selectedToDate <= routeInfo.toDate
      }
    }
    if (
      !isDefined(routeInfo.selectedFromDate) &&
      !isDefined(routeInfo.selectedToDate)
    ) {
      // No date selected.
      return false
    }
    // verify that both routes are within the selected date range
    if (routeInfo.routeId !== routeInfo.toRouteId) {
      if (isDefined(routeInfo.fromDate) && isDefined(routeInfo.toRouteFromDate)) {
        if (routeInfo.selectedFromDate < routeInfo.fromDate || (isDefined(routeInfo.toDate) && routeInfo.selectedFromDate > routeInfo.toDate) ||
          routeInfo.selectedFromDate < routeInfo.toRouteFromDate || (isDefined(routeInfo.toRouteToDate) && routeInfo.selectedFromDate > routeInfo.toRouteToDate)) {
          return false
        }
      }
    }

    return isValid
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeInfo, lockAquired])

  const handleQueryLocksCompleted = React.useCallback((lockInfo: LrsLocksInfo, acquiredInfo: AcquireLockResponse, success: boolean) => {
    if (success) {
      setLockAquired(true)
    } else {
      setLockAquired(false)
    }
    setLockInfo(lockInfo)
  }, [])

  const handleMessageClear = () => {
    buildLockInfo(LockAction.None)
  }

  const handleUseStartMeasure = (e, checked: boolean) => {
    if (checked) {
      const updateRouteInfo = routeInfo
      updateRouteInfo.selectedMeasure = updateRouteInfo.fromMeasure
      updateRouteInfo.selectedPoint = null
      handleRouteInfoUpdate(updateRouteInfo)
    }

    setUseStartMeasure(checked)
  }

  const handleUseEndMeasure = (e, checked: boolean) => {
    if (checked) {
      const updateRouteInfo = routeInfo
      updateRouteInfo.selectedToMeasure = updateRouteInfo.toRouteToMeasure
      updateRouteInfo.selectedToPoint = null
      handleRouteInfoUpdate(updateRouteInfo)
    }

    setUseEndMeasure(checked)
  }

  return (
    <div className="add-single-line-event h-100 d-flex" ref={containerWrapperRef} tabIndex={-1} css={getFormStyle()}>
      <DataSourceManager
        network={selectedNetwork}
        event={selectedEvent}
        dataSourcesReady={handleDataSourcesReady}
        onCreateNetworkDs={handleNetworkDsCreated}
        onCreateEventDs={handleEventDsCreated}
      />
      {!hideTitle && <AddLineEventFormHeader />}
      <div
        className={classNames('add-single-line-event__content', {
          'd-none': section === 1,
          [FOCUSABLE_CONTAINER_CLASS]: section !== 1
        })}
      >
        {conflictPreventionEnabled && (
          <LockManagerComponent
            intl={intl}
            showAlert={true}
            featureDS={networkDS as FeatureLayerDataSource}
            lockInfo={lockInfo}
            networkName={selectedNetwork?.networkInfo?.datasetName}
            conflictPreventionEnabled={conflictPreventionEnabled}
            onQueryAndAcquireComplete={handleQueryLocksCompleted}
            onMessageClear={handleMessageClear}
          />
        )}
        {!hideType && (
          <AddLineEventOperationType
            operationType={operationType}
            onOperationTypeChanged={onOperationTypeChanged}
          />
        )}
        {!hideEvent && (
          <div>
            <Label size="sm" className="pt-2 mb-0 px-3 w-100" style={{ fontWeight: 500 }}>
              {getI18nMessage('eventLayerLabel')}
            </Label>
            <Select
              aria-label={getI18nMessage('eventLayerLabel')}
              className="w-100 px-3"
              size="sm"
              value={selectedEvent ? selectedEvent.name : ''}
              disabled={lineEventLayers.length === 1}
              onChange={(evt) => {
                handleEventChanged(evt.target.value)
              }}
            >
              {lineEventLayers.map((element, index) => {
                return (
                  <options key={index} value={element}>
                    {element}
                  </options>
                )
              })}
            </Select>
          </div>
        )}
        {!hideNetwork && (
          <InlineEditableDropdown
            label={getI18nMessage('networkLabel')}
            isDisabled={true}
            defaultItem={isDefined(selectedNetwork) ? selectedNetwork.name : ''}
            listItems={networkLayers}
            onSelectionChanged={handleNetworkChanged}
          />
        )}
        {!hideMethod && (
          <InlineEditableDropdown
            label={getI18nMessage('fromMethodLabel')}
            defaultItem={selectedFromMethod}
            isDisabled={true}
            listItems={[SearchMethod.Measure]}
            altItemDescriptions={[
              getI18nMessage('routeAndMeasure')
            ]}
            onSelectionChanged={handleFromMethodChanged}
          />
        )}
        <AddLineEventRouteSelectionForm
          intl={intl}
          widgetId={widgetId}
          network={selectedNetwork ? selectedNetwork.networkInfo : null}
          event={selectedEvent}
          dsReady={!isDSReady}
          networkDS={networkDS}
          method={selectedFromMethod}
          jimuMapView={JimuMapView}
          hoverGraphic={hoverGraphic}
          pickedGraphic={pickedFromGraphic}
          isFrom={true}
          routeInfo={routeInfo}
          routeMeasurePickerInfo={routeMeasurePickerInfo}
          reset={reset}
          hideMeasures={hideMeasures}
          revalidateRouteFromDataAction={revalidateRouteFromDataAction}
          onResetDataAction={resetDataAction}
          canSpanRoutes={isDefined(selectedEvent) && isDefined(selectedEvent.eventInfo) ? selectedEvent.eventInfo.canSpanRoutes : false}
          onUpdateRouteInfo={handleRouteInfoUpdate}
          onUpdateRouteMeasurePickerInfo={handleRouteMeasurePickerInfoUpdate}
          useStartMeasure={useStartMeasure}
          useEndMeasure={useEndMeasure}
        />
        {!hideMeasures && (
          <Label size="sm" className="pt-2 mb-0 px-3 w-100" centric check>
            <Checkbox
              checked={useStartMeasure}
              className="mr-2"
              disabled={!isDefined(routeInfo) || isNaN(routeInfo.fromMeasure)}
              onChange={handleUseStartMeasure}
            />
            {getI18nMessage('useStartMeasureLabel')}
          </Label>
        )}
        {!hideMethod && (
          <InlineEditableDropdown
            label={getI18nMessage('toMethodLabel')}
            defaultItem={selectedToMethod}
            isDisabled={true}
            listItems={[SearchMethod.Measure]}
            altItemDescriptions={[
              getI18nMessage('routeAndMeasure')
            ]}
            onSelectionChanged={handleToMethodChanged}
          />
        )}
        <AddLineEventRouteSelectionForm
          intl={intl}
          widgetId={widgetId}
          network={selectedNetwork ? selectedNetwork.networkInfo : null}
          event={selectedEvent}
          dsReady={!isDSReady}
          networkDS={networkDS}
          method={selectedToMethod}
          jimuMapView={JimuMapView}
          hoverGraphic={hoverGraphic}
          pickedGraphic={pickedToGraphic}
          isFrom={false}
          routeInfo={routeInfo}
          routeMeasurePickerInfo={routeMeasurePickerInfo}
          reset={reset}
          hideMeasures={hideMeasures}
          revalidateRouteFromDataAction={revalidateRouteFromDataAction}
          onResetDataAction={resetDataAction}
          canSpanRoutes={isDefined(selectedEvent) && isDefined(selectedEvent.eventInfo) ? selectedEvent.eventInfo.canSpanRoutes : false}
          onUpdateRouteInfo={handleRouteInfoUpdate}
          onUpdateRouteMeasurePickerInfo={handleRouteMeasurePickerInfoUpdate}
          useStartMeasure={useStartMeasure}
          useEndMeasure={useEndMeasure}
        />
        {!hideMeasures && (
          <Label size="sm" className="pt-2 mb-0 px-3 w-100" centric check>
            <Checkbox
              checked={useEndMeasure}
              className="mr-2"
              disabled={!isDefined(routeInfo?.toRouteToMeasure) || isNaN(routeInfo.toRouteToMeasure)}
              onChange={handleUseEndMeasure}
            />
            {getI18nMessage('useEndMeasureLabel')}
          </Label>
        )}
        <AddLineEventDateForm
          hideDates={hideDates}
          useRouteStartEndDate={useRouteStartEndDate}
          routeInfo={routeInfo}
          eventInfo={selectedEvent ? selectedEvent.eventInfo : null}
          network={selectedNetwork ? selectedNetwork.networkInfo : null}
          revalidateRouteFromDataAction={revalidateRouteFromDataAction}
          onUpdateRouteInfo={handleRouteInfoUpdate}
        />
        <MergeRetireForm
          eventInfo={eventInfo}
          onUpdateEventInfo={handleEventInfoUpdate}
        />
      </div>
      <div className={classNames('add-line-footer w-100', {
        'd-none': section === 1,
        [FOCUSABLE_CONTAINER_CLASS]: section !== 1
      })}>
        <Label
          size='sm'
          className='mt-auto mr-auto'
          style={{ fontWeight: 500, width: 100, marginBottom: 0, alignItems: 'center', textAlign: 'left', color: 'var(--primary-500' }}
          onClick={handleReset}
        >
          {getI18nMessage('resetForm')}
        </Label>
          <div className="mt-auto ml-auto">
            <Button
              className="active"
              aria-label={getI18nMessage('nextLabel')}
              size="sm"
              disabled={!isValidRouteSelection() && isDSReady}
              onClick={handleNextClicked}
            >
              {getI18nMessage('nextLabel')}
            </Button>
          </div>
      </div>
      <div
        className={classNames('add-single-line-event__content', {
          'd-none': section !== 1,
          [FOCUSABLE_CONTAINER_CLASS]: section === 1
        })}>
        <AddLineEventAttributes
          intl={intl}
          widgetId={widgetId}
          networkDS={networkDS}
          network={selectedNetwork}
          eventDS={eventDS}
          eventLayer={selectedEvent}
          routeInfo={routeInfo}
          eventInfo={eventInfo}
          reset={reset || resetSelectedField}
          jimuMapView={JimuMapView}
          hoverGraphic={hoverGraphic}
          conflictPreventionEnabled={conflictPreventionEnabled}
          onNavBack={handleNavBack}
        />
      </div>
    </div>
  )
}
