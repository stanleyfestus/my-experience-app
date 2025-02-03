/** @jsx jsx */
import { React, jsx, hooks, type ImmutableArray, css, classNames, type ImmutableObject, Immutable, type DataSource, type IntlShape } from 'jimu-core'
import defaultMessages from '../translations/default'
import { type FeatureLayerDataSource, type JimuMapView } from 'jimu-arcgis'
import { type OperationType, type DefaultInfo } from '../../config'
import {
  type AttributeSet,
  type AttributeSets,
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
  type LrsLocksInfo,
  getIntialLocksInfo,
  LockAction,
  LockManagerComponent
} from 'widgets/shared-code/lrs'
import { Checkbox, FOCUSABLE_CONTAINER_CLASS, Label, Button } from 'jimu-ui'
import { AddLineEventFormHeader } from './add-line-event-form-header'
import type GraphicsLayer from 'esri/layers/GraphicsLayer'
import { AddMultipleLineEventsAttributes } from './add-multiple-line-events-attributes'
import { DataSourceManager } from '../data-source/data-source-manager'
import { AddLineEventRouteSelectionForm } from './add-line-event-route-selection-form'
import { AddLineEventDateForm } from './add-line-event-date-form'
import { AttributeSetDataSourceManager } from '../data-source/attribute-set-data-source-manager'
import { colorCyan, colorGreen, colorRed } from '../constants'
import { MergeRetireForm } from './merge-retire-form'
import { round } from 'lodash-es'
import { type FeatureLayerDataSourceImpl } from 'jimu-core/data-source'
import { AddLineEventOperationType } from './add-line-event-operation-type'

export interface AddMultipleLineEventsProps {
  intl: IntlShape
  widgetId: string
  lrsLayers: ImmutableArray<LrsLayer>
  jimuMapView: JimuMapView
  operationType: OperationType
  lineEventLayers: ImmutableArray<string>
  networkLayers: ImmutableArray<string>
  instersectionLayers: ImmutableArray<string>
  defaultEvent: DefaultInfo
  defaultNetwork: DefaultInfo
  defaultFromMethod: SearchMethod
  defaultToMethod: SearchMethod
  defaultAttributeSet: string
  attributeSets: ImmutableObject<AttributeSets>
  hoverGraphic: GraphicsLayer
  pickedFromGraphic: GraphicsLayer
  pickedToGraphic: GraphicsLayer
  flashGraphic: GraphicsLayer
  hideNetwork: boolean
  hideMethod: boolean
  hideType: boolean
  hideAttributeSet: boolean
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

    &.wrapped .add-multiple-line-event-form {
      height: 100%;
    }
    .add-multiple-line-event__content {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      flex: 1 1 auto;
      overflow: auto;
    }
    .add-line-footer {
      display: flex;
      height: auto;
      padding: 12px;
    }
  `
}

export function AddMultipleLineEvents (props: AddMultipleLineEventsProps) {
  const getI18nMessage = hooks.useTranslation(defaultMessages)
  const {
    intl,
    widgetId,
    lrsLayers,
    jimuMapView,
    operationType,
    networkLayers,
    defaultNetwork,
    defaultFromMethod,
    defaultToMethod,
    defaultAttributeSet,
    attributeSets,
    hoverGraphic,
    pickedFromGraphic,
    pickedToGraphic,
    flashGraphic,
    hideMethod,
    hideNetwork,
    hideType,
    hideAttributeSet,
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
  const [selectedNetwork, setSelectedNetwork] = React.useState<ImmutableObject<LrsLayer>>(null)
  const [selectedAttributeSetLayers, setSelectedAttributeSetLayers] = React.useState<ImmutableArray<LrsLayer>>(null)
  const [isNetworkDSReady, setNetworkIsDSReady] = React.useState<boolean>(false)
  const [isAttributeSetsDSReady, setAttributeSetsIsDSReady] = React.useState<boolean>(false)
  const [selectedFromMethod, setSelectedFromMethod] = React.useState(defaultFromMethod)
  const [selectedToMethod, setSelectedToMethod] = React.useState(defaultToMethod)
  const [selectedAttributeSetName, setSelectedAttributeSetName] = React.useState<string>(defaultAttributeSet)
  const [selectedAttributeSet, setSelectedAttributeSet] = React.useState<AttributeSet>(null)
  const [reset, setReset] = React.useState<boolean>(false)
  const [routeInfo, setRouteInfo] = React.useState<RouteInfo>(getInitialRouteInfoState())
  const [revalidateRouteFromDataAction, setRevalidateRouteFromDataAction] = React.useState<boolean>(false)
  const [lockInfo, setLockInfo] = React.useState<LrsLocksInfo>(getIntialLocksInfo())
  const [useStartMeasure, setUseStartMeasure] = React.useState<boolean>(false)
  const [useEndMeasure, setUseEndMeasure] = React.useState<boolean>(false)
  const containerWrapperRef = React.useRef<HTMLDivElement>(null)

  // DS
  const handleNetworkDsCreated = React.useCallback(
    (ds: DataSource) => {
      setNetworkDS(ds)
    },
    [setNetworkDS]
  )

  const handleNetworkDataSourcesReady = React.useCallback(() => {
    setNetworkIsDSReady(true)
  }, [setNetworkIsDSReady])

  const handleAttributeSetDataSourcesReady = React.useCallback(() => {
    setAttributeSetsIsDSReady(true)
  }, [setAttributeSetsIsDSReady])

  const handleNetworkChanged = React.useCallback((value: string) => {
    const networkLayer = lrsLayers.find(layer => layer.name === value)
    if (isDefined(networkLayer)) {
      setSelectedNetwork(Immutable(networkLayer))
    }
    if (!hideMeasures) {
      setUseStartMeasure(false)
      setUseEndMeasure(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lrsLayers])

  React.useEffect(() => {
    containerWrapperRef.current?.focus()
  }, [])

  React.useEffect(() => {
    if (!isDefined(selectedNetwork)) {
      if (isDefined(defaultNetwork)) {
        const networkLayer = lrsLayers.find(
          (item) => item.name === defaultNetwork.name
        )
        setSelectedNetwork(Immutable(networkLayer))
      } else {
        const networkLayer = lrsLayers.find(layer => layer.layerType === LrsLayerType.network)
        if (networkLayer) {
          setSelectedNetwork(Immutable(networkLayer))
        }
      }
    }
    if (!isDefined(selectedAttributeSet)) {
      const attributeSet = attributeSets.attributeSet.find(set => set.title === selectedAttributeSetName)
      if (attributeSet) {
        setSelectedAttributeSet(attributeSet)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lrsLayers, defaultNetwork])

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
            const networkName = lrsLayer.name
            handleNetworkChanged(networkName)
          }
        }
        if (isDefined(routeInfoFromDataAction)) {
          // Two records were selected for dataAction but event is non-spanning so change toRoute to be fromRoute
          if (!eventInfo.canSpanRoutes && routeInfoFromDataAction.routeId !== routeInfoFromDataAction.toRouteId) {
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
  }, [networkDS, selectedAttributeSet, selectedNetwork])

  const buildLockInfo = (action: LockAction = LockAction.None, routeInfo?: RouteInfo) => {
    const updatedLockInfo = { ...lockInfo }
    if (isDefined(selectedNetwork)) {
      updatedLockInfo.networkId = [selectedNetwork.networkInfo.lrsNetworkId]
    }
    if (isDefined(selectedAttributeSet)) {
      const eventIds = selectedAttributeSet.layers.map(layer => layer.layerId)
      updatedLockInfo.eventServiceLayerIds = eventIds
    }
    if (isDefined(routeInfo)) {
      updatedLockInfo.routeInfo = routeInfo
    }
    updatedLockInfo.lockAction = action
    setLockInfo(updatedLockInfo)
  }

  React.useEffect(() => {
    if (isDefined(selectedAttributeSet) && isDefined(selectedNetwork)) {
      const events: LrsLayer[] = []
      selectedAttributeSet.layers.forEach((layer) => {
        const lrsEvent = lrsLayers.find(item => item.serviceId === layer.layerId)
        if (lrsEvent && selectedNetwork.networkInfo.lrsNetworkId === lrsEvent.eventInfo.parentNetworkId) {
          events.push(lrsEvent)
        }
      })
      setSelectedAttributeSetLayers(Immutable(events))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAttributeSet, selectedNetwork])

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

  const handleAttributeSetChanged = React.useCallback((value: string) => {
    const attributeSet = attributeSets.attributeSet.find(set => set.title === value)
    if (attributeSet) {
      setSelectedAttributeSet(attributeSet)
    }
    setSelectedAttributeSetName(value)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // From Method picker changed
  const handleFromMethodChanged = React.useCallback((value: SearchMethod) => {
    setSelectedFromMethod(value)
  }, [])

  // To Method picker changed
  const handleToMethodChanged = React.useCallback((value: SearchMethod) => {
    setSelectedToMethod(value)
  }, [])

  const isReady = React.useMemo(() => {
    if (isNetworkDSReady && isAttributeSetsDSReady && isDefined(jimuMapView) && isDefined(jimuMapView?.view) && jimuMapView?.view.ready) {
      return true
    }
    return false
  }, [isNetworkDSReady, isAttributeSetsDSReady, jimuMapView])

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

  // Reset form to initial configuration
  const handleReset = () => {
    let canSpanRoutes = false
    if (isDefined(selectedNetwork) && isDefined(selectedNetwork.networkInfo) && isDefined(selectedNetwork.networkInfo.lineIdFieldSchema)) {
      canSpanRoutes = true
    }

    onClearGraphics()
    const updateRouteInfo = getInitialRouteInfoState()
    handleRouteInfoUpdate(updateRouteInfo, false, true)
    const updateEventInfo = getInitialEventInfoState()
    updateEventInfo.canSpanRoutes = canSpanRoutes
    handleEventInfoUpdate(updateEventInfo)
    const newRouteMeasurePickerInfo = getInitialRouteMeasurePickerInfoState()
    handleRouteMeasurePickerInfoUpdate(newRouteMeasurePickerInfo)
    if (!hideMeasures) {
      setUseStartMeasure(false)
      setUseEndMeasure(false)
    }
    onClearHoverGraphic()

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

  const getAttributeItems = (): string[] => {
    const attributeItemNames: string[] = []
    attributeSets.attributeSet.forEach((item) => {
      attributeItemNames.push(item.title)
    })
    return attributeItemNames
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
      const action = reset ? LockAction.Clear : LockAction.Release
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
    if (isDefined(selectedNetwork)) {
      setRouteInfo(getInitialRouteInfoState())
      const updatedEventInfo = getInitialEventInfoState()

      if (isDefined(selectedNetwork.networkInfo) && isDefined(selectedNetwork.networkInfo.lineIdFieldSchema)) {
        updatedEventInfo.canSpanRoutes = true
      }
      handleEventInfoUpdate(updatedEventInfo)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNetwork, reset])

  const handleNextClicked = () => {
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

    if (isDefined(jimuMapView)) {
      jimuMapView.clearSelectedFeatures()
    }
  }

  // Returns if the current input data is valid.
  const isValidRouteSelection = React.useCallback(() => {
    let isValid = true
    isValid = isValid && routeInfo.routeId?.length > 0
    isValid = isValid && routeInfo.toRouteId?.length > 0

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

    if (!eventInfo.canSpanRoutes) {
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

    return isValid
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeInfo])

  const handleQueryLocksCompleted = React.useCallback((lockInfo: LrsLocksInfo, success: boolean) => {
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
    <div className="add-multiple-line-event h-100 d-flex" ref={containerWrapperRef} tabIndex={-1} css={getFormStyle()}>
      <DataSourceManager
        network={selectedNetwork}
        dataSourcesReady={handleNetworkDataSourcesReady}
        onCreateNetworkDs={handleNetworkDsCreated}
      />
      <AttributeSetDataSourceManager
        events={selectedAttributeSetLayers}
        dataSourcesReady={handleAttributeSetDataSourcesReady}
      />
      {!hideTitle && <AddLineEventFormHeader/>}
      <div
        className={classNames('add-multiple-line-event__content', {
          'd-none': section === 1,
          [FOCUSABLE_CONTAINER_CLASS]: section !== 1
        })}
      >
        {conflictPreventionEnabled && (
          <LockManagerComponent
            intl={intl}
            showAlert={false}
            featureDS={networkDS as FeatureLayerDataSource}
            lockInfo={lockInfo}
            networkName={selectedNetwork?.networkInfo?.datasetName}
            conflictPreventionEnabled={conflictPreventionEnabled}
            onQueryAndReleaseComplete={handleQueryLocksCompleted}
            onMessageClear={handleMessageClear}
          />
        )}
        {!hideType && (
          <AddLineEventOperationType
            operationType={operationType}
            onOperationTypeChanged={onOperationTypeChanged}
          />
        )}
        {!hideNetwork && (
          <InlineEditableDropdown
            label={getI18nMessage('networkLabel')}
            isDisabled={networkLayers.length === 1}
            defaultItem={isDefined(selectedNetwork) ? selectedNetwork.name : ''}
            listItems={networkLayers}
            onSelectionChanged={handleNetworkChanged}
          />
        )}
        {!hideAttributeSet && (
          <InlineEditableDropdown
            label={getI18nMessage('attributeSetLabel')}
            isDisabled={attributeSets.attributeSet.length === 1}
            defaultItem={selectedAttributeSetName}
            listItems={getAttributeItems()}
            onSelectionChanged={handleAttributeSetChanged}
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
          dsReady={isReady}
          networkDS={networkDS}
          method={selectedFromMethod}
          jimuMapView={jimuMapView}
          hoverGraphic={hoverGraphic}
          pickedGraphic={pickedFromGraphic}
          isFrom={true}
          routeInfo={routeInfo}
          routeMeasurePickerInfo={routeMeasurePickerInfo}
          reset={reset}
          hideMeasures={hideMeasures}
          revalidateRouteFromDataAction={revalidateRouteFromDataAction}
          onResetDataAction={resetDataAction}
          canSpanRoutes={selectedNetwork ? isDefined(selectedNetwork.networkInfo.lineIdFieldSchema) : false}
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
          dsReady={isReady}
          networkDS={networkDS}
          method={selectedToMethod}
          jimuMapView={jimuMapView}
          hoverGraphic={hoverGraphic}
          pickedGraphic={pickedToGraphic}
          isFrom={false}
          routeInfo={routeInfo}
          routeMeasurePickerInfo={routeMeasurePickerInfo}
          reset={reset}
          hideMeasures={hideMeasures}
          revalidateRouteFromDataAction={revalidateRouteFromDataAction}
          onResetDataAction={resetDataAction}
          canSpanRoutes={selectedNetwork ? isDefined(selectedNetwork.networkInfo.lineIdFieldSchema) : false}
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
              disabled={!isValidRouteSelection() && isReady}
              onClick={handleNextClicked}
            >
              {getI18nMessage('nextLabel')}
            </Button>
          </div>
        </div>
      <div
        className={classNames('add-multiple-line-event__content', {
          'd-none': section !== 1,
          [FOCUSABLE_CONTAINER_CLASS]: section === 1
        })}>
        <AddMultipleLineEventsAttributes
          intl={intl}
          widgetId={widgetId}
          networkDS={networkDS}
          network={selectedNetwork ? selectedNetwork.networkInfo : null}
          eventLayers={selectedAttributeSetLayers}
          attributeSet={selectedAttributeSet}
          routeInfo={routeInfo}
          eventInfo={eventInfo}
          reset={reset}
          isReady={isReady}
          jimuMapView={jimuMapView}
          hoverGraphic={hoverGraphic}
          conflictPreventionEnabled={conflictPreventionEnabled}
          onNavBack={handleNavBack}
        />
      </div>
    </div>
  )
}
