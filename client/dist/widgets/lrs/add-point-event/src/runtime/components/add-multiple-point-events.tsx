/** @jsx jsx */
import {
  React,
  jsx,
  type ImmutableArray,
  classNames,
  css,
  type ImmutableObject,
  type DataSource,
  hooks,
  Immutable,
  type IntlShape
} from 'jimu-core'
import defaultMessages from '../translations/default'
import { type FeatureLayerDataSource, type JimuMapView } from 'jimu-arcgis'
import { type DefaultInfo, type OperationType } from '../../config'
import { AddPointEventFormHeader } from './add-point-event-form-header'
import { Button, FOCUSABLE_CONTAINER_CLASS, Label } from 'jimu-ui'
import { DataSourceManager } from '../data-source/data-source-manager'
import { AddPointEventRouteSelectionForm } from './add-point-event-route-selection-form'
import type GraphicsLayer from 'esri/layers/GraphicsLayer'
import { AddMultiplePointEventsAttributes } from './add-multiple-point-events-attributes'
import { AttributeSetDataSourceManager } from '../data-source/attribute-set-data-source-manager'
import { type AttributeSet, type AttributeSets, type LrsLayer, LrsLayerType, type RouteInfo, SearchMethod, InlineEditableDropdown, isDefined, type LrsLocksInfo, getIntialLocksInfo, LockAction, LockManagerComponent, getInitialRouteInfoState } from 'widgets/shared-code/lrs'
import { type FeatureLayerDataSourceImpl } from 'jimu-core/data-source'
import { AddPointEventOperationType } from './add-point-operation-type'

export interface AddMultiplePointEventsProps {
  intl: IntlShape
  widgetId: string
  lrsLayers: ImmutableArray<LrsLayer>
  jimuMapView: JimuMapView
  operationType: OperationType
  networkLayers: ImmutableArray<string>
  defaultNetwork: DefaultInfo
  defaultMethod: SearchMethod
  defaultAttributeSet: string
  attributeSets: ImmutableObject<AttributeSets>
  hoverGraphic: GraphicsLayer
  pickedGraphic: GraphicsLayer
  flashGraphic: GraphicsLayer
  conflictPreventionEnabled: boolean
  hideNetwork: boolean
  hideMethod: boolean
  hideType: boolean
  hideAttributeSet: boolean
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

    &.wrapped .add-multiple-point-event-form {
      height: 100%;
    }
    .add-multiple-point-event__content {
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

// Todo: implement in later user story.
export function AddMultiplePointEvents (props: AddMultiplePointEventsProps) {
  const getI18nMessage = hooks.useTranslation(defaultMessages)
  const {
    intl,
    widgetId,
    lrsLayers,
    jimuMapView,
    operationType,
    networkLayers,
    defaultNetwork,
    defaultMethod,
    defaultAttributeSet,
    attributeSets,
    hoverGraphic,
    pickedGraphic,
    flashGraphic,
    conflictPreventionEnabled,
    hideNetwork,
    hideMethod,
    hideType,
    hideAttributeSet,
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
  const [selectedNetwork, setSelectedNetwork] = React.useState<ImmutableObject<LrsLayer>>(null)
  const [selectedAttributeSetLayers, setSelectedAttributeSetLayers] = React.useState<ImmutableArray<LrsLayer>>(null)
  const [isNetworkDSReady, setNetworkIsDSReady] = React.useState<boolean>(false)
  const [isAttributeSetsDSReady, setAttributeSetsIsDSReady] = React.useState<boolean>(false)
  const [selectedMethod, setSelectedMethod] = React.useState(defaultMethod)
  const [selectedAttributeSetName, setSelectedAttributeSetName] = React.useState<string>(defaultAttributeSet)
  const [selectedAttributeSet, setSelectedAttributeSet] = React.useState<AttributeSet>(null)
  const [reset, setReset] = React.useState<boolean>(false)
  const [routeInfo, setRouteInfo] = React.useState<RouteInfo>(null)
  const [revalidateRouteFromDataAction, setRevalidateRouteFromDataAction] = React.useState<boolean>(false)
  const [lockInfo, setLockInfo] = React.useState<LrsLocksInfo>(getIntialLocksInfo())
  const containerWrapperRef = React.useRef<HTMLDivElement>(null)
  const [isValidInput, setIsValidInput] = React.useState<boolean>(true)
  const methodRef = React.useRef(null)

  // DS
  const handleNetworkDsCreated = React.useCallback((ds: DataSource) => {
    setNetworkDS(ds)
  }, [setNetworkDS])

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
  }, [lrsLayers])

  React.useEffect(() => {
    containerWrapperRef.current?.focus()
  }, [])

  React.useEffect(() => {
    setRevalidateRouteFromDataAction(isDefined(routeInfoFromDataAction))
  }, [routeInfoFromDataAction])

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
        const networkName = lrsLayer.name
        handleNetworkChanged(networkName)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkDataSourceFromDataAction])

  React.useEffect(() => {
    setRevalidateRouteFromDataAction(isDefined(routeInfoFromDataAction))
  }, [routeInfoFromDataAction])

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
    if (conflictPreventionEnabled) {
      buildLockInfo()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkDS, selectedAttributeSet, selectedNetwork])

  const buildLockInfo = React.useCallback((action: LockAction = LockAction.None, routeInfo?: RouteInfo) => {
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
  }, [selectedNetwork, selectedAttributeSet, lockInfo])

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

  const handleAttributeSetChanged = React.useCallback((value: string) => {
    const attributeSet = attributeSets.attributeSet.find(set => set.title === value)
    if (attributeSet) {
      setSelectedAttributeSet(attributeSet)
    }
    setSelectedAttributeSetName(value)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleMethodChanged = React.useCallback((value: SearchMethod) => {
    setSelectedMethod(value)
  }, [])

  const isReady = React.useMemo(() => {
    if (isNetworkDSReady && isAttributeSetsDSReady && isDefined(jimuMapView) && isDefined(jimuMapView?.view) && jimuMapView?.view.ready) {
      return true
    }
    return false
  }, [isNetworkDSReady, isAttributeSetsDSReady, jimuMapView])

  // Open attributes section
  const handleNext = React.useCallback((routeInfo) => {
    setRouteInfo(routeInfo)
    setSection(1)
  }, [])

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleReset = React.useCallback(() => {
    const routeInfo = getInitialRouteInfoState()
    setRouteInfo(routeInfo)
    buildLockInfo(LockAction.Clear, routeInfo)
    setReset(true)
    setTimeout(() => {
      setReset(false)
    }, 800)
  }, [buildLockInfo])

  const getAttributeItems = (): string[] => {
    const attributeItemNames: string[] = []
    attributeSets.attributeSet.forEach((item) => {
      attributeItemNames.push(item.title)
    })
    return attributeItemNames
  }

  const handleRouteInfoUpdate = React.useCallback((routeInfo: RouteInfo) => {
    setRouteInfo(routeInfo)
    buildLockInfo(LockAction.Release, routeInfo)
  }, [buildLockInfo])

  const handleQueryLocksCompleted = React.useCallback((lockInfo: LrsLocksInfo, success: boolean) => {
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
   <div className="add-multiple-point-event h-100 d-flex" ref={containerWrapperRef} tabIndex={-1} css={getFormStyle()}>
      <DataSourceManager
        network={selectedNetwork}
        dataSourcesReady={handleNetworkDataSourcesReady}
        onCreateNetworkDs={handleNetworkDsCreated }
      />
      <AttributeSetDataSourceManager
        events={selectedAttributeSetLayers}
        dataSourcesReady={handleAttributeSetDataSourcesReady}
      />
      {!hideTitle && <AddPointEventFormHeader/>}
      <div className={classNames('add-multiple-point-event__content', {
        'd-none': section === 1,
        [FOCUSABLE_CONTAINER_CLASS]: section !== 1
      })}>
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
          <AddPointEventOperationType
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
          jimuMapView={jimuMapView}
          hoverGraphic={hoverGraphic}
          pickedGraphic={pickedGraphic}
          flashGraphic={flashGraphic}
          lockAquired={true}
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
      <div className='add-point-footer__action w-100 d-flex'>
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
    </div>
    <div className={classNames('add-multiple-point-event__content', {
      'd-none': section !== 1,
      [FOCUSABLE_CONTAINER_CLASS]: section === 1
    })}>
        <AddMultiplePointEventsAttributes
        intl={intl}
        widgetId={widgetId}
        networkDS={networkDS}
        network={selectedNetwork}
        eventLayers={selectedAttributeSetLayers}
        attributeSet={selectedAttributeSet}
        routeInfo={routeInfo}
        reset={reset}
        isReady={isReady}
        jimuMapView={jimuMapView}
        hoverGraphic={hoverGraphic}
        conflictPreventionEnabled={conflictPreventionEnabled}
        onNavBack={handleNavBack} />
      </div>
  </div>
  )
}
