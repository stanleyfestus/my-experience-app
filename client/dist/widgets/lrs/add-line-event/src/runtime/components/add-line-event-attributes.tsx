/** @jsx jsx */
import {
  React,
  jsx,
  hooks,
  css,
  type ImmutableObject,
  type FeatureLayerDataSource,
  type DataSource,
  utils as coreUtils,
  RecordSetChangeType,
  DataRecordSetChangeMessage,
  MessageManager,
  loadArcGISJSAPIModules,
  type IntlShape,
  type QueryParams
} from 'jimu-core'
import defaultMessages from '../translations/default'
import {
  type FieldInfo,
  type LrsLayer,
  type RouteInfo,
  type EventInfo,
  type AddEventRequest,
  type LrsApplyEditsAddsParam,
  type LrsApplyEditsEditsParam,
  type CopiedAttributes,
  LrsApplyEdits,
  AttributeTable,
  CopyAttributeTool,
  isDefined,
  getDateToUTC,
  isDate,
  isNumber,
  validateField,
  validateRangeDomain,
  getDateWithoutTZOffset,
  LockManagerComponent,
  tryReleaseLockOnDefault,
  type LrsLocksInfo,
  LockAction,
  type AcquireLockResponse,
  getIntialLocksInfo
} from 'widgets/shared-code/lrs'
import { Alert, Button } from 'jimu-ui'
import { cloneDeep } from 'lodash-es'
import { type AlertType } from 'jimu-ui/lib/components/alert/type'
import { type IFieldInfo } from '@esri/arcgis-rest-feature-service'
import type GraphicsLayer from 'esri/layers/GraphicsLayer'
import { type JimuMapView } from 'jimu-arcgis'
import { validateContingencyConstraints } from '../../../../../shared-code/lib/lrs/utilities/contingent-values-utils'

export interface AddLineEventAttributesProps {
  intl: IntlShape
  widgetId: string
  networkDS: DataSource
  network: ImmutableObject<LrsLayer>
  eventDS: DataSource
  eventLayer: ImmutableObject<LrsLayer>
  routeInfo: RouteInfo
  eventInfo: EventInfo
  jimuMapView: JimuMapView
  hoverGraphic: GraphicsLayer
  reset: boolean
  conflictPreventionEnabled: boolean
  onNavBack: (reset: boolean) => void
}

const getFormStyle = () => {
  return css`
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;

    .add-line-event-edit-attributes__content {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      flex: 1 1 auto;
      overflow: auto;
    }
    .add-line-event-edit-attributes__toast-container {
      position: absolute;
      background-color: rgba(255, 255, 255, 0.7);
      height: 100%;
    }
    .add-line-event-edit-attributes__toast {
      position: relative;
      top: 4%;
    }
    .add-line=event-edit-attributes__action {
      height: auto;
    }
    .add-line-attributes-footer {
      display: flex;
      height: auto;
      padding: 12px;
    }
  `
}

let fieldGroups = []
export function AddLineEventAttributes (props: AddLineEventAttributesProps) {
  const getI18nMessage = hooks.useTranslation(defaultMessages)
  const {
    intl,
    widgetId,
    networkDS,
    network,
    eventDS,
    eventLayer,
    routeInfo,
    eventInfo,
    reset,
    jimuMapView,
    hoverGraphic,
    conflictPreventionEnabled,
    onNavBack
  } = props
  const [fieldInfos, setFieldInfos] = React.useState<FieldInfo[]>()
  const [toastOpen, setToastOpen] = React.useState<boolean>(false)
  const [toastMsgType, setToastMsgType] = React.useState<AlertType>()
  const [toastMsg, setToastMsg] = React.useState<string>('')
  const [lockInfo, setLockInfo] = React.useState<LrsLocksInfo>(getIntialLocksInfo())
  const [hasErrors, setHasErrors] = React.useState<boolean>(false)
  const [hasContingentErrors, setHasContingentErrors] = React.useState<boolean>(false)

  React.useEffect(() => {
    setFieldInfos(getInitialAttributeValues())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventDS, eventLayer])

  React.useEffect(() => {
    if (reset) {
      setFieldInfos(getInitialAttributeValues())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset])

  // Set lock info
  React.useEffect(() => {
    if (conflictPreventionEnabled) {
      const updatedLockInfo = { ...lockInfo }
      if (isDefined(network)) {
        updatedLockInfo.networkId = [network.networkInfo.lrsNetworkId]
      }
      if (isDefined(eventLayer)) {
        updatedLockInfo.eventServiceLayerIds = [eventLayer.serviceId]
      }
      if (isDefined(routeInfo)) {
        updatedLockInfo.routeInfo = routeInfo
      }
      setLockInfo(updatedLockInfo)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkDS, network, eventLayer, routeInfo])

  const getInitialAttributeValues = (): FieldInfo[] => {
    const fieldInfos: FieldInfo[] = []
    if (isDefined(eventLayer) && isDefined(eventDS) && isDefined(eventLayer.eventInfo) && isDefined(eventLayer.eventInfo.attributeFields)) {
      // Get basic field info for non lrs fields and set default values.
      const featureLayerDS = eventDS as FeatureLayerDataSource
      const layer = featureLayerDS?.layer
      const fields = layer.fields
      eventLayer.eventInfo.attributeFields.forEach((fieldInfo) => {
        if (fieldInfo.enabled) {
          const field = fields.find(l => l.name === fieldInfo.field.name)
          if (field) {
            let defaultValue
            if (isDate(field.type)) {
              defaultValue = isDefined(field.defaultValue) ? new Date(field.defaultValue) : null
            } else {
              defaultValue = field.defaultValue
            }
            const info: FieldInfo = {
              index: fieldInfos.length,
              name: field.name,
              alias: field.alias,
              type: field.type,
              hasDomain: isDefined(field.domain),
              value: defaultValue,
              error: '',
              nullable: field.nullable,
              default: typeof defaultValue === 'number' ? Number(defaultValue).toString() : defaultValue,
              length: field.length,
              editable: fieldInfo.editable
            }
            fieldInfos.push(info)
          }
        }
      })
    }
    return fieldInfos
  }

  const errorsPresent = (values: FieldInfo[]): boolean => {
    return values.findIndex(value => value.error.length > 0) > -1
  }

  const handleUpdateItem = (value: any, error: string, index: number) => {
    const newFieldInfos = cloneDeep(fieldInfos)
    newFieldInfos[index].value = value
    newFieldInfos[index].error = error
    setFieldInfos(newFieldInfos)
    setHasErrors(errorsPresent(newFieldInfos))
  }

  const handleUpdateAll = (values: FieldInfo[]) => {
    const newFieldInfos = cloneDeep(values)
    setFieldInfos(newFieldInfos)
    setHasErrors(errorsPresent(newFieldInfos))
  }

  const handleFieldGrpUpdated = (values: any, tableIndex: number) => {
    fieldGroups = values
    if (!fieldGroups || (fieldGroups?.length === 0)) {
      setHasContingentErrors(false)
    }
  }

  const handleAttributesCopied = (values: CopiedAttributes[]) => {
    const newFieldInfos = cloneDeep(fieldInfos)
    values.forEach((layer) => {
      if (layer.layerId === eventLayer.serviceId.toString()) {
        layer.fieldValuePair.forEach((field) => {
          const fieldInfoIndex = newFieldInfos.findIndex(info => info.name === field.name)
          if (fieldInfoIndex > -1) {
            let value = field.value
            if (isDate(newFieldInfos[fieldInfoIndex].type)) {
              value = new Date(field.value)
            }
            newFieldInfos[fieldInfoIndex].value = value
          }
        })
      }
    })
    setFieldInfos(newFieldInfos)
  }

  const navBack = (reset: boolean) => {
    onNavBack(reset)
  }

  const areNonLrsFieldsValid = (): boolean => {
    const fieldInfoCopy = cloneDeep(fieldInfos)
    let hasErrors = false

    // Check all fields for errors. We will display the last error message we encounter.
    fieldInfoCopy.forEach((field, fieldIndex) => {
      let result
      if (field.hasDomain) {
        result = validateRangeDomain(field.value, field.name, eventDS)
      } else {
        result = validateField(field.value, field.name, eventDS)
      }
      if (isDefined(fieldGroups)) {
        let fieldGroupFields = []
        const invalidFieldGroups = validateContingencyConstraints(field.value, '', fieldIndex, fieldInfoCopy, fieldGroups)
        if (invalidFieldGroups?.length > 0) {
          invalidFieldGroups.forEach((group) => {
            const fields = group?.fieldGroup?.fields
            fieldGroupFields.push(fields)
          })
          fieldGroupFields = fieldGroupFields.flat()
          if (fieldGroupFields.includes(field.name)) {
            setHasContingentErrors(true)
            result = {
              hasError: true,
              message: 'contingentValueError'
            }
          }
        }
      }
      if (result.hasError) {
        let toastErrorMsg
        if (result.message === 'contingentValueError') {
          const fieldGroupNames = []
          fieldGroups.forEach((group) => {
            fieldGroupNames.push(group.name)
          })
          let alertMsg = getI18nMessage('invalidContingentValues')
          alertMsg = alertMsg.replace('{groupNames}', fieldGroupNames.join(','))
          toastErrorMsg = alertMsg
        } else {
          const fieldName = eventLayer.useFieldAlias ? field.alias : field.name
          toastErrorMsg = getI18nMessage('attributeError', { fieldValue: fieldName, message: getI18nMessage(result.message) })
        }
        setToastMsgType('error')
        setToastMsg(toastErrorMsg)
        setToastOpen(true)
        setTimeout(() => {
          setToastOpen(false)
        }, 5000)
        hasErrors = true
        field.error = getI18nMessage(result.message)
      }
    })

    // Update state so we can show all errors
    if (hasErrors) {
      handleUpdateAll(fieldInfoCopy)
    }

    return hasErrors
  }

  const resetFieldInfos = () => {
    const fieldInfos: FieldInfo[] = []
    if (isDefined(eventLayer) && isDefined(eventDS)) {
      // Get basic field info for non lrs fields and set default values.
      const featureLayerDS = eventDS as FeatureLayerDataSource
      const layer = featureLayerDS?.layer
      const fields = layer.fields
      eventLayer.eventInfo.attributeFields.forEach((fieldInfo) => {
        const layer = fields.find(l => l.name === fieldInfo.field.name)
        if (layer) {
          let defaultValue
          if (layer.type === 'date' && isDefined(layer.defaultValue)) {
            const inputDate = new Date(layer.defaultValue)
            if (isDefined(inputDate)) {
              defaultValue = inputDate.toISOString().substring(0, 10)
            }
          } else {
            defaultValue = layer.defaultValue
          }
          const info: FieldInfo = {
            index: fieldInfos.length,
            name: layer.name,
            alias: layer.alias,
            type: layer.type,
            hasDomain: isDefined(layer.domain),
            value: defaultValue,
            error: '',
            nullable: layer.nullable,
            default: typeof defaultValue === 'number' ? Number(defaultValue).toString() : defaultValue,
            length: layer.length,
            editable: fieldInfo.editable
          }
          fieldInfos.push(info)
        }
      })

      setFieldInfos(fieldInfos)
    }
  }

  const submitForm = async (locks?: LrsLocksInfo) => {
    const request: AddEventRequest = {
      edits: []
    }

    // Validate attributes before submitting
    if (areNonLrsFieldsValid()) {
      return
    }

    const eventFeatureLayer = eventDS as FeatureLayerDataSource
    let gdbVersion = eventFeatureLayer.getGDBVersion()
    if (!gdbVersion) {
      gdbVersion = ''
    }

    if (isDefined(eventLayer)) {
      const indexedLrsAttrs: { [key: string]: string | number | Date } = {}

      let reverseRoutes = false
      let reverseMeasures = false
      if (eventLayer.eventInfo.canSpanRoutes) {
        if (routeInfo.routeLineOrder > routeInfo.toRouteLineOrder) {
          reverseRoutes = true
        } else if (routeInfo.routeId === routeInfo.toRouteId && routeInfo.selectedMeasure > routeInfo.selectedToMeasure) {
          reverseMeasures = true
        }
      } else {
        if (routeInfo.selectedMeasure > routeInfo.selectedToMeasure) {
          reverseMeasures = true
        }
      }

      // EventId
      const eventIdKey = eventLayer.eventInfo.eventIdFieldName
      indexedLrsAttrs[eventIdKey] = '{' + coreUtils.getUUID() + '}'

      // RouteId
      const routeIdKey = eventLayer.eventInfo.routeIdFieldName
      indexedLrsAttrs[routeIdKey] = routeInfo.routeId

      // FromMeasure
      const fromMeasureKey = eventLayer.eventInfo.fromMeasureFieldName
      indexedLrsAttrs[fromMeasureKey] = routeInfo.selectedMeasure

      // FromDate
      const fromDateKey = eventLayer.eventInfo.fromDateFieldName
      if (routeInfo.selectedFromDate) {
        // Remove timezone offset from date values, then get time in UTC.
        const date = isDefined(routeInfo.selectedFromDate) ? getDateWithoutTZOffset(routeInfo.selectedFromDate.valueOf(), networkDS) : null
        indexedLrsAttrs[fromDateKey] = getDateToUTC(date)
      } else {
        indexedLrsAttrs[fromDateKey] = routeInfo.selectedFromDate
      }

      // ToDate
      const toDateKey = eventLayer.eventInfo.toDateFieldName
      if (routeInfo.selectedToDate) {
        // Remove timezone offset from date values, then get time in UTC.
        const date = isDefined(routeInfo.selectedToDate) ? getDateWithoutTZOffset(routeInfo.selectedToDate.valueOf(), networkDS) : null
        indexedLrsAttrs[toDateKey] = getDateToUTC(date)
      } else {
        indexedLrsAttrs[toDateKey] = routeInfo.selectedToDate
      }

      // RouteName
      if (eventLayer.eventInfo.routeNameFieldName && eventLayer.eventInfo.routeNameFieldName.length > 0) {
        const routeNameKey = eventLayer.eventInfo.routeNameFieldName
        indexedLrsAttrs[routeNameKey] = routeInfo.routeName
      }

      // ToRouteId
      if (eventLayer.eventInfo.toRouteIdFieldName && eventLayer.eventInfo.toRouteIdFieldName.length > 0) {
        const toRouteIdKey = eventLayer.eventInfo.toRouteIdFieldName
        indexedLrsAttrs[toRouteIdKey] = routeInfo.toRouteId
        // Reverse route Ids if necessary
        if (reverseRoutes) {
          indexedLrsAttrs[routeIdKey] = routeInfo.toRouteId
          indexedLrsAttrs[toRouteIdKey] = routeInfo.routeId
        }
      }

      // ToRouteName
      if (eventLayer.eventInfo.toRouteNameFieldName && eventLayer.eventInfo.toRouteNameFieldName.length > 0) {
        const toRouteNameKey = eventLayer.eventInfo.toRouteNameFieldName
        indexedLrsAttrs[toRouteNameKey] = routeInfo.toRouteName
        // Reverse route names if necessary
        if (reverseRoutes) {
          const routeNameKey = eventLayer.eventInfo.routeNameFieldName
          indexedLrsAttrs[routeNameKey] = routeInfo.toRouteName
          indexedLrsAttrs[toRouteNameKey] = routeInfo.routeName
        }
      }

      // ToMeasure
      if (eventLayer.eventInfo.toMeasureFieldName && eventLayer.eventInfo.toMeasureFieldName.length > 0) {
        const toMeasureKey = eventLayer.eventInfo.toMeasureFieldName
        indexedLrsAttrs[toMeasureKey] = routeInfo.selectedToMeasure
        // Reverse route measures if necessary
        if (reverseRoutes || reverseMeasures) {
          indexedLrsAttrs[fromMeasureKey] = routeInfo.selectedToMeasure
          indexedLrsAttrs[toMeasureKey] = routeInfo.selectedMeasure
        }
      }

      // Non lrs attributes
      fieldInfos.forEach((item) => {
        const key = item.name
        if (isDefined(item.value) && isDate(item.type)) {
          // Remove timezone offset from date values, then get time in UTC.
          const date = getDateWithoutTZOffset(item.value.valueOf(), networkDS)
          indexedLrsAttrs[key] = getDateToUTC(date)
        } else if (isNumber(item.type)) {
          // Convert any string values to number.
          if (!isDefined(item.value) || item.value === '' || isNaN(Number(item.value))) {
            indexedLrsAttrs[key] = null
          } else {
            indexedLrsAttrs[key] = Number(item.value)
          }
        } else {
          // Everything else: strings and null values.
          indexedLrsAttrs[key] = item.value
        }
      })

      const adds: LrsApplyEditsAddsParam[] = []
      const add: LrsApplyEditsAddsParam = {
        attributes: indexedLrsAttrs,
        geometry: routeInfo.selectedPolyline
      }
      adds.push(add)

      const edits: LrsApplyEditsEditsParam = {
        id: eventLayer.serviceId,
        adds: adds,
        allowMerge: eventInfo.mergeCoincident,
        retireMeasureOverlap: eventInfo.retireOverlapping,
        retireByEventId: false
      }

      request.edits.push(edits)
    }
    await LrsApplyEdits(eventLayer.lrsUrl, request, gdbVersion)
      .then(async (result) => {
        if (result.success) {
          setToastMsgType('success')
          setToastMsg(getI18nMessage('eventCreated'))
          setToastOpen(true)
          publishMessage(request)
          setTimeout(async () => {
            setToastOpen(false)
            if (conflictPreventionEnabled && isDefined(locks)) {
              await tryReleaseLockOnDefault(networkDS as FeatureLayerDataSource, locks)
              const updateLockInfo = { ...lockInfo, lockAction: LockAction.Clear }
              setLockInfo(updateLockInfo)
            } else {
              navBack(true)
              resetFieldInfos()
            }
          }, 5000)
        } else {
          setToastMsgType('error')
          setToastMsg(`${result.message} \n ${result.details}`)
          setToastOpen(true)
          setTimeout(() => {
            setToastOpen(false)
          }, 5000)
        }
      })
  }

  const publishMessage = async (request: AddEventRequest) => {
    const featureDS = eventDS as FeatureLayerDataSource
    const popupInfo = featureDS.getPopupInfo()
    const layerDefinition = featureDS.getLayerDefinition()
    const getDefaultFieldInfos = () =>
      [
        { fieldName: layerDefinition?.objectIdField ?? 'objectid', label: 'OBJECTID', tooltip: '', visible: true }
      ] as IFieldInfo[]
    const fieldInfos = ((fieldInfos) => (fieldInfos.length ? fieldInfos : getDefaultFieldInfos()))(
      (popupInfo?.fieldInfos || []).filter((i) => i.visible)
    )

    let Graphic: typeof __esri.Graphic = null
    await loadArcGISJSAPIModules(['esri/Graphic']).then(modules => {
      [Graphic] = modules
    }).then(() => {
      const feature = new Graphic({
        geometry: request.edits[0].adds[0].geometry,
        attributes: request.edits[0].adds[0].attributes
      })

      const record = featureDS.buildRecord(feature)
      featureDS.afterAddRecord(record)
    })

    featureDS.updateQueryParams({ returnGeometry: true } as QueryParams, widgetId)

    // publish new records to other widgets
    const dataRecordSetChangeMessage = new DataRecordSetChangeMessage(widgetId, RecordSetChangeType.CreateUpdate, [{
      records: featureDS.getRecords(),
      fields: fieldInfos.map((fieldInfo) => fieldInfo.fieldName),
      dataSource: featureDS,
      name: featureDS.id
    }])
    MessageManager.getInstance().publishMessage(dataRecordSetChangeMessage)
  }

  const onSubmitClicked = () => {
    if (conflictPreventionEnabled) {
      const updatedLockInfos = { ...lockInfo, lockAction: LockAction.QueryAndAcquire }
      setLockInfo(updatedLockInfos)
    } else {
      submitForm()
    }
  }

  const handleQueryLocksCompleted = (lockInfo: LrsLocksInfo, acquiredInfo: AcquireLockResponse, success: boolean) => {
    setLockInfo(lockInfo)
    if (success) {
      submitForm(lockInfo)
    }
  }

  const handleMessageClear = () => {
    const updatedLockInfos = { ...lockInfo, lockAction: LockAction.None }
    setLockInfo(updatedLockInfos)
    navBack(true)
    resetFieldInfos()
  }

  return (
    <div className='h-100' css={getFormStyle()}>
      <div className="add-line-event-edit-attributes__content">
        {conflictPreventionEnabled && (
          <LockManagerComponent
              intl={intl}
              featureDS={networkDS as FeatureLayerDataSource}
              lockInfo={lockInfo}
              showAlert={true}
              networkName={network?.networkInfo?.datasetName}
              conflictPreventionEnabled={conflictPreventionEnabled}
              onQueryAndAcquireComplete={handleQueryLocksCompleted}
              onMessageClear={handleMessageClear}
            />
        )}
        <div className='attribute-picker d-flex w-100 px-3'>
          <div className='ml-auto'>
            <CopyAttributeTool
              disabled={false}
              networkDs={networkDS}
              eventDataSources={[eventDS]}
              jimuMapView={jimuMapView}
              hoverGraphic={hoverGraphic}
              onAttributesCopied={handleAttributesCopied}
            />
          </div>
        </div>
        <div className='h-100'>
        {hasContingentErrors &&
            <Alert tabIndex={0} className={'w-100 userInfo'}
            onClose={function noRefCheck () { setHasContingentErrors(false) }}
            open={hasContingentErrors}
            text={toastMsg}
            type={'warning'}
            closable
            withIcon
            />
          }
          <AttributeTable
            tableIndex={0}
            eventDS={eventDS}
            eventLayer={eventLayer}
            fieldInfos={fieldInfos}
            collapable={false}
            useAlias={isDefined(eventLayer) ? eventLayer.useFieldAlias : true}
            onUpdateItem={handleUpdateItem}
            onUpdateAll={handleUpdateAll}
            onFieldGrpUpdated={handleFieldGrpUpdated}
            isReset={reset}/>
        </div>

        {toastOpen && (
          <div className='add-line-event-edit-attributes__toast-container w-100 p-3'>
            <Alert
              className='add-line-event-edit-attributes__toast w-100'
              type={toastMsgType}
              text={toastMsg}
              closable={true}
              withIcon={true}
              open={toastOpen}
              onClose={() => { setToastOpen(false) }}
            />
          </div>
        )}

      </div>
      <div className='add-line-attributes-footer w-100'>
        <div className="add-line=event-edit-attributes__action w-100 d-flex">
          <div className="mt-auto mr-auto">
            <Button
              aria-label={getI18nMessage('backLabel')}
              size="sm"
              type='secondary'
              onClick={() => { navBack(false) }}
            >
              {getI18nMessage('backLabel')}
            </Button>
          </div>
          <div className="mt-auto ml-auto">
            <Button
              className="active"
              aria-label={getI18nMessage('saveLabel')}
              size="sm"
              disabled={hasContingentErrors || hasErrors}
              onClick={onSubmitClicked}
            >
              {getI18nMessage('saveLabel')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
