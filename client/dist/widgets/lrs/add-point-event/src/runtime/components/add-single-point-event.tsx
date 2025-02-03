/** @jsx jsx */
import {
  React,
  jsx,
  hooks,
  type ImmutableArray,
  css,
  classNames,
  type ImmutableObject,
  Immutable,
  type DataSource,
  type IntlShape
} from 'jimu-core'
import {
  InlineEditableDropdown,
  type LrsLayer,
  LrsLayerType,
  type RouteInfo,
  SearchMethod,
  isDefined,
  type LrsLocksInfo,
  getIntialLocksInfo,
  LockManagerComponent,
  getInitialRouteInfoState,
  LockAction,
  type AcquireLockResponse
} from 'widgets/shared-code/lrs'
import defaultMessages from '../translations/default'
import { type FeatureLayerDataSource, type JimuMapView } from 'jimu-arcgis'
import { type OperationType, type DefaultInfo } from '../../config'
import { Button, FOCUSABLE_CONTAINER_CLASS, Label, Select } from 'jimu-ui'
import { AddPointEventFormHeader } from './add-point-event-form-header'
import type GraphicsLayer from 'esri/layers/GraphicsLayer'
import { AddPointEventAttributes } from './add-point-event-attributes'
import { DataSourceManager } from '../data-source/data-source-manager'
import { AddPointEventRouteSelectionForm } from './add-point-event-route-selection-form'
import { type FeatureLayerDataSourceImpl } from 'jimu-core/data-source'
import { AddPointEventOperationType } from './add-point-operation-type'

export interface AddSinglePointEventProps {
  intl: IntlShape
  widgetId: string
  lrsLayers: ImmutableArray<LrsLayer>
  eventLayers: ImmutableArray<string>
  networkLayers: ImmutableArray<string>
  instersectionLayers: ImmutableArray<string>
  defaultEvent: DefaultInfo
  defaultMethod: SearchMethod
  JimuMapView: JimuMapView
  operationType: OperationType
  hoverGraphic: GraphicsLayer
  pickedGraphic: GraphicsLayer
  flashGraphic: GraphicsLayer
  conflictPreventionEnabled: boolean
  hideMethod: boolean
  hideEvent: boolean
  hideNetwork: boolean
  hideType: boolean
  hideDates: boolean
  hideTitle: boolean
  useRouteStartEndDate: boolean
  networkDataSourceFromDataAction: DataSource
  routeInfoFromDataAction: RouteInfo
  onResetDataAction: () => void
  onClearGraphic: () => void
  onOperationTypeChanged: (type: OperationType) => void
}

const getFormStyle = () => {
  return css`
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;

    .add-single-point-event__content {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      flex: 1 1 auto;
      overflow: auto;
    }
    .add-point-footer {
      display: flex;
      height: auto;
      padding: 12px;
    }
  `
}

export function AddSinglePointEvent (props: AddSinglePointEventProps) {
  const getI18nMessage = hooks.useTranslation(defaultMessages)
  const {
    intl,
    widgetId,
    lrsLayers,
    eventLayers,
    networkLayers,
    defaultEvent,
    defaultMethod,
    JimuMapView,
    operationType,
    hoverGraphic,
    pickedGraphic,
    flashGraphic,
    conflictPreventionEnabled,
    hideEvent,
    hideNetwork,
    hideType,
    hideMethod,
    hideDates,
    hideTitle,
    useRouteStartEndDate,
    networkDataSourceFromDataAction,
    routeInfoFromDataAction,
    onResetDataAction,
    onClearGraphic,
    onOperationTypeChanged
  } = props
  const [section, setSection] = React.useState(0)
  const [networkDS, setNetworkDS] = React.useState<DataSource>(null)
  const [eventDS, setEventDS] = React.useState<DataSource>(null)
  const [selectedNetwork, setSelectedNetwork] = React.useState<ImmutableObject<LrsLayer>>(null)
  const [selectedEvent, setSelectedEvent] = React.useState<ImmutableObject<LrsLayer>>(null)
  const [isDSReady, setIsDSReady] = React.useState<boolean>(false)
  const [selectedMethod, setSelectedMethod] = React.useState(defaultMethod)
  const [reset, setReset] = React.useState<boolean>(false)
  const [routeInfo, setRouteInfo] = React.useState<RouteInfo>(getInitialRouteInfoState())
  const [lockInfo, setLockInfo] = React.useState<LrsLocksInfo>(getIntialLocksInfo())
  const [lockAquired, setLockAquired] = React.useState<boolean>(!conflictPreventionEnabled)
  const [revalidateRouteFromDataAction, setRevalidateRouteFromDataAction] = React.useState<boolean>(false)
  const containerWrapperRef = React.useRef<HTMLDivElement>(null)
  const [isValidInput, setIsValidInput] = React.useState<boolean>(true)
  const [resetSelectedField, setResetSelectedField] = React.useState<boolean>(false)
  const methodRef = React.useRef(null)

  // DS
  const handleNetworkDsCreated = React.useCallback((ds: DataSource) => {
    setNetworkDS(ds)
  }, [setNetworkDS])

  const handleEventDsCreated = React.useCallback((ds: DataSource) => {
    setEventDS(ds)
  }, [setEventDS])

  const handleDataSourcesReady = React.useCallback(() => {
    setIsDSReady(true)
  }, [setIsDSReady])

  React.useEffect(() => {
    containerWrapperRef.current?.focus()
  }, [])

  // Set defaults
  React.useEffect(() => {
    if (selectedEvent) {
      const networkLayer = lrsLayers.find(item => isDefined(item.networkInfo) && item.networkInfo.lrsNetworkId === selectedEvent.eventInfo.parentNetworkId)
      if (networkLayer && networkLayer.layerType === LrsLayerType.network) {
        setSelectedNetwork(Immutable(networkLayer))
      }
    } else {
      const defaultEventLayer = lrsLayers.find(item => item.name === defaultEvent.name)
      setSelectedEvent(Immutable(defaultEventLayer))
    }
  }, [defaultEvent, lrsLayers, selectedEvent])

  React.useEffect(() => {
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
        const eventLayer = lrsLayers.find((item) => item.eventInfo.parentNetworkId === lrsLayer?.networkInfo.lrsNetworkId)
        if (isDefined(eventLayer)) {
          handleEventChanged(eventLayer.name)
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkDataSourceFromDataAction])

  React.useEffect(() => {
    setRevalidateRouteFromDataAction(isDefined(routeInfoFromDataAction))
  }, [routeInfoFromDataAction])

  React.useEffect(() => {
    buildLockInfo(LockAction.None)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkDS, selectedEvent, selectedNetwork])

  const buildLockInfo = React.useCallback((action: LockAction = LockAction.None, routeInfo?: RouteInfo) => {
    if (conflictPreventionEnabled) {
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
  }, [conflictPreventionEnabled, lockInfo, selectedEvent, selectedNetwork])

  // Event changed
  const handleEventChanged = React.useCallback((value: string) => {
    const eventLayer = lrsLayers.find(item => item.name === value)
    if (eventLayer) {
      const networkLayer = lrsLayers.find(item => isDefined(item.networkInfo) && item.networkInfo.lrsNetworkId === eventLayer.eventInfo.parentNetworkId)
      if (networkLayer && networkLayer.layerType === LrsLayerType.network) {
        setSelectedNetwork(Immutable(networkLayer))
      }
      setResetSelectedField(true)
      setSelectedEvent(Immutable(eventLayer))
    }
  }, [lrsLayers])

  // Event picker changed
  const handleNetworkChanged = React.useCallback((value: string) => {
    const networkLayer = lrsLayers.find(layer => layer.name === value)
    if (isDefined(networkLayer)) {
      setSelectedNetwork(Immutable(networkLayer))
    }
  }, [lrsLayers])

  // Method picker changed
  const handleMethodChanged = React.useCallback((value: SearchMethod) => {
    setSelectedMethod(value)
  }, [])

  // Open attributes section
  const handleNext = React.useCallback((routeInfo) => {
    setRouteInfo(routeInfo)
    setResetSelectedField(false)
    setSection(1)
  }, [])

  const handleReset = React.useCallback(() => {
    const routeInfo = getInitialRouteInfoState()
    setRouteInfo(routeInfo)
    buildLockInfo(LockAction.Clear, routeInfo)
    setRevalidateRouteFromDataAction(false)
    setReset(true)
    setTimeout(() => {
      setReset(false)
    }, 800)
  }, [buildLockInfo])

  // Back to route selection.
  const handleNavBack = React.useCallback((reset: boolean) => {
    if (reset) {
      onClearGraphic()
      handleReset()
    }
    setSection(0)
    if (containerWrapperRef.current) {
      containerWrapperRef.current.focus()
    }
  }, [handleReset, onClearGraphic])

  const handleRouteInfoUpdate = React.useCallback((routeInfo: RouteInfo) => {
    setRouteInfo(routeInfo)
    buildLockInfo(LockAction.QueryAndAcquire, routeInfo)
  }, [buildLockInfo])

  const isReady = React.useMemo(() => {
    if (isDSReady && isDefined(JimuMapView?.view)) {
      return true
    }
    return false
  }, [JimuMapView?.view, isDSReady])

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

  const submitForm = React.useCallback(() => {
    methodRef.current?.handleNextClicked()
  }, [])

  const handleValidationChanged = React.useCallback((isValid: boolean) => {
    setIsValidInput(isValid)
  }, [])

  return (
    <div className="add-single-point-event h-100 d-flex" ref={containerWrapperRef} tabIndex={-1} css={getFormStyle()}>
      <DataSourceManager
        network={selectedNetwork}
        event={selectedEvent}
        dataSourcesReady={handleDataSourcesReady}
        onCreateNetworkDs={handleNetworkDsCreated }
        onCreateEventDs={handleEventDsCreated}
      />
      {!hideTitle && <AddPointEventFormHeader/>}
      <div className={classNames('add-single-point-event__content', {
        'd-none': section === 1,
        [FOCUSABLE_CONTAINER_CLASS]: section !== 1
      })}>
        {conflictPreventionEnabled && (
          <LockManagerComponent
            intl={intl}
            featureDS={networkDS as FeatureLayerDataSource}
            showAlert={true}
            lockInfo={lockInfo}
            networkName={selectedNetwork?.networkInfo?.datasetName}
            conflictPreventionEnabled={conflictPreventionEnabled}
            onQueryAndAcquireComplete={handleQueryLocksCompleted}
            onMessageClear={handleMessageClear}
          />
        )}
        {!hideType && (
          <AddPointEventOperationType
            operationType={operationType}
            onOperationTypeChanged={onOperationTypeChanged}
          />
        )}
        {!hideEvent && (
          <div>
            <Label size='sm' className='mb-0 pt-3 px-3 w-100' style={{ fontWeight: 500 }} >
              {getI18nMessage('eventLayerLabel')}
            </Label>
            <Select
              aria-label={getI18nMessage('eventLayerLabel')}
              className='w-100 px-3'
              size='sm'
              value={selectedEvent ? selectedEvent.name : ''}
              disabled={eventLayers.length === 1}
              onChange={evt => { handleEventChanged(evt.target.value) }}>
              {eventLayers.map((element, index) => {
                return (
                  <options key={index} value={element}>{element}</options>
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
            label={getI18nMessage('methodLabel')}
            isDisabled={true}
            defaultItem={selectedMethod}
            listItems={[SearchMethod.Measure]}
            altItemDescriptions={[getI18nMessage('routeAndMeasure')]}
            onSelectionChanged={handleMethodChanged}
          />
        )}
        <AddPointEventRouteSelectionForm
          ref={methodRef}
          intl={intl}
          widgetId={widgetId}
          network={selectedNetwork ? selectedNetwork.networkInfo : null}
          routeInfoFromDataAction={routeInfoFromDataAction}
          isReady={isReady}
          networkDS={networkDS}
          method={selectedMethod}
          reset={reset}
          jimuMapView={JimuMapView}
          hoverGraphic={hoverGraphic}
          pickedGraphic={pickedGraphic}
          flashGraphic={flashGraphic}
          lockAquired={lockAquired}
          hideDates={hideDates}
          useRouteStartEndDate={useRouteStartEndDate}
          revalidateRouteFromDataAction={revalidateRouteFromDataAction}
          onResetDataAction={onResetDataAction}
          onsubmit={handleNext}
          onRouteInfoUpdate={handleRouteInfoUpdate}
          onValidationChanged={handleValidationChanged}
        />
    </div>
    <div className={classNames('add-point-footer w-100', {
      'd-none': section === 1,
      [FOCUSABLE_CONTAINER_CLASS]: section !== 1
    })}>
      <Label
        size='sm'
        className=' mt-auto mr-auto'
        style={{ fontWeight: 500, marginBottom: 0, alignItems: 'center', textAlign: 'left', color: 'var(--sys-color-primary-main)' }}
        onClick={handleReset}
      >
        {getI18nMessage('resetForm')}
      </Label>
      <div className='mt-auto ml-auto'>
        <Button
          className='active'
          aria-label={getI18nMessage('nextLabel')}
          size='sm'
          disabled={!isValidInput}
          onClick={submitForm}
        >
            {getI18nMessage('nextLabel')}
        </Button>
      </div>
    </div>
    <div className={classNames('add-single-point-event__content', {
      'd-none': section !== 1,
      [FOCUSABLE_CONTAINER_CLASS]: section === 1
    })}>
        <AddPointEventAttributes
        intl={intl}
        widgetId={widgetId}
        networkDS={networkDS}
        network={selectedNetwork}
        eventDS={eventDS}
        eventLayer={selectedEvent}
        routeInfo={routeInfo}
        reset={reset || resetSelectedField}
        jimuMapView={JimuMapView}
        hoverGraphic={hoverGraphic}
        conflictPreventionEnabled={conflictPreventionEnabled}
        onNavBack={handleNavBack} />
      </div>
  </div>
  )
}
