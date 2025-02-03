/** @jsx jsx */
import {
  React,
  jsx,
  hooks,
  css,
  type ImmutableObject,
  type DataSource,
  type FeatureLayerDataSource,
  utils as coreUtils,
  RecordSetChangeType,
  DataRecordSetChangeMessage,
  MessageManager,
  type IntlShape,
  loadArcGISJSAPIModules,
  type QueryParams
} from 'jimu-core'
import {
  type AddEventRequest,
  AttributeTable,
  type CopiedAttributes,
  CopyAttributeTool,
  type FieldInfo,
  LrsApplyEdits,
  type LrsApplyEditsAddsParam,
  type LrsApplyEditsEditsParam,
  type LrsLayer,
  type RouteInfo,
  getDateToUTC,
  isDate,
  isDefined,
  isNumber,
  validateField,
  validateRangeDomain,
  getDateWithoutTZOffset,
  type LrsLocksInfo,
  LockManagerComponent,
  LockAction,
  tryReleaseLockOnDefault,
  type AcquireLockResponse,
  validateContingencyConstraints
} from 'widgets/shared-code/lrs'

import defaultMessages from '../translations/default'
import { Alert, Button } from 'jimu-ui'
import { cloneDeep } from 'lodash-es'
import { type IFieldInfo } from '@esri/arcgis-rest-feature-service'
import { type AlertType } from 'jimu-ui/lib/components/alert/type'
import type GraphicsLayer from 'esri/layers/GraphicsLayer'
import { type JimuMapView } from 'jimu-arcgis'

export interface AddPointEventAttributesProps {
  intl: IntlShape
  widgetId: string
  networkDS: DataSource
  network: ImmutableObject<LrsLayer>
  eventDS: DataSource
  eventLayer: ImmutableObject<LrsLayer>
  routeInfo: RouteInfo
  reset: boolean
  jimuMapView: JimuMapView
  hoverGraphic: GraphicsLayer
  conflictPreventionEnabled: boolean
  onNavBack: (reset: boolean) => void
}

const getFormStyle = () => {
  return css`
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;

    .add-point-event-edit-attributes__content {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      flex: 1 1 auto;
      overflow: auto;
    }
    .add-point-event-edit-attributes__toast-container {
      position: absolute;
      background-color: rgba(255, 255, 255, 0.7);
      height: 100%;
    }
    .add-point-event-edit-attributes__toast {
      position: relative;
      top: 4%;
    }
    .add-point-event-edit-attributes__action {
      height: auto;
    }
    .add-point-attributes-footer {
      display: flex;
      height: auto;
      padding: 12px;
    }
  `
}

let fieldGroups = []

export function AddPointEventAttributes (props: AddPointEventAttributesProps) {
  const getI18nMessage = hooks.useTranslation(defaultMessages)
  const { intl, widgetId, networkDS, network, eventDS, eventLayer, routeInfo, reset, jimuMapView, hoverGraphic, conflictPreventionEnabled, onNavBack } = props
  const [fieldInfos, setFieldInfos] = React.useState<FieldInfo[]>()
  const [toastOpen, setToastOpen] = React.useState<boolean>(false)
  const [toastMsgType, setToastMsgType] = React.useState<AlertType>()
  const [toastMsg, setToastMsg] = React.useState<string>('')
  const [hasErrors, setHasErrors] = React.useState<boolean>(false)
  const [hasContingentErrors, setHasContingentErrors] = React.useState<boolean>(false)
  const [lockInfo, setLockInfo] = React.useState<LrsLocksInfo>()

  React.useEffect(() => {
    if (reset) {
      setFieldInfos(getInitialAttributeValues())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset])

  React.useEffect(() => {
    setFieldInfos(getInitialAttributeValues())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventDS, eventLayer])

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

  const handleUpdateItem = (value: any, error: string, fieldIndex: number, tableIndex: number) => {
    const newFieldInfos = cloneDeep(fieldInfos)
    newFieldInfos[fieldIndex].value = value
    newFieldInfos[fieldIndex].error = error
    setFieldInfos(newFieldInfos)
    setHasErrors(errorsPresent(newFieldInfos))
  }

  const handleUpdateAll = (values: FieldInfo[], tableIndex: number) => {
    const newFieldInfos = cloneDeep(values)
    setFieldInfos(newFieldInfos)
    setHasErrors(errorsPresent(newFieldInfos))
  }

  const handleFieldGrpUpdated = (values: any, tableIndex?: number) => {
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
              value = isDefined(field.value) ? new Date(field.value) : null
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
      } else if (isDate(field.type)) {
        result = validateField(field.value, field.name, eventDS)
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
      handleUpdateAll(fieldInfoCopy, 0)
    }

    return hasErrors
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
      if (isDefined(routeInfo.selectedFromDate)) {
        // Remove timezone offset from date values, then get time in UTC.
        const date = getDateWithoutTZOffset(routeInfo.selectedFromDate.valueOf(), networkDS)
        indexedLrsAttrs[fromDateKey] = getDateToUTC(date)
      } else {
        indexedLrsAttrs[fromDateKey] = routeInfo.selectedFromDate
      }

      // ToDate
      const toDateKey = eventLayer.eventInfo.toDateFieldName
      if (isDefined(routeInfo.selectedToDate)) {
        // Remove timezone offset from date values, then get time in UTC.
        const date = getDateWithoutTZOffset(routeInfo.selectedToDate.valueOf(), networkDS)
        indexedLrsAttrs[toDateKey] = getDateToUTC(date)
      } else {
        indexedLrsAttrs[toDateKey] = routeInfo.selectedToDate
      }

      // RouteName
      if (eventLayer.eventInfo.routeNameFieldName && eventLayer.eventInfo.routeNameFieldName.length > 0) {
        const routeNameKey = eventLayer.eventInfo.routeNameFieldName
        indexedLrsAttrs[routeNameKey] = routeInfo.routeName
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

      if (!isDefined(routeInfo.selectedPoint.spatialReference.wkid)) {
        routeInfo.selectedPoint.spatialReference.wkid = jimuMapView.view.spatialReference.wkid
      }

      const adds: LrsApplyEditsAddsParam[] = []
      const add: LrsApplyEditsAddsParam = {
        attributes: indexedLrsAttrs,
        geometry: routeInfo.selectedPoint
      }
      adds.push(add)

      const edits: LrsApplyEditsEditsParam = {
        id: eventLayer.serviceId,
        adds: adds,
        allowMerge: false,
        retireMeasureOverlap: false,
        retireByEventId: false
      }

      request.edits.push(edits)
    }
    await LrsApplyEdits(eventLayer.lrsUrl, request, gdbVersion)
      .then(async (result) => {
        if (result.success) {
          // Edit went through, show message and publish results to other widgets.
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
            }
          }, 5000)
        } else {
          // Failed on server, show error message.
          setToastMsgType('error')
          setToastMsg(`${result.message} \n ${result.details}`)
          setToastOpen(true)
          setTimeout(() => {
            setToastOpen(false)
          }, 5000)
        }
      })
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
  }

  return (
    <div className='h-100' css={getFormStyle()}>
      <div className='add-point-event-edit-attributes__content'>
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
            isReset={reset}
            onFieldGrpUpdated={handleFieldGrpUpdated}
          />
        </div>
        {toastOpen && (
          <div className='add-point-event-edit-attributes__toast-container px-3 w-100'>
            <Alert
                className='add-point-event-edit-attributes__toast w-100'
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
       <div className='add-point-attributes-footer w-100'>
          <div className='add-point-event-edit-attributes__action w-100 d-flex'>
            <div className='mt-auto mr-auto'>
              <Button
                aria-label={getI18nMessage('backLabel')}
                size='sm'
                type='secondary'
                onClick={() => { navBack(false) }}
              >
                  {getI18nMessage('backLabel')}
              </Button>
            </div>
            <div className='mt-auto ml-auto'>
              <Button
                className='active'
                aria-label={getI18nMessage('saveLabel')}
                size='sm'
                disabled={hasErrors || hasContingentErrors}
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
