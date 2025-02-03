/** @jsx jsx */
import { CalciteSelect, CalciteButton, CalciteOption, CalciteInputDatePicker } from 'calcite-components'
import defaultMessages from '../../translations/default'
import {
  React,
  jsx,
  hooks,
  type IntlShape,
  type CodedValue,
  type ImmutableArray,
  type FeatureLayerDataSource,
  type DataSource,
  type ImmutableObject
} from 'jimu-core'
import { Label, NumericInput, Select, TextInput, type ValidityResult } from 'jimu-ui'
import { formatMessage, isCodedDomain, isConflictPreventionEnabled, isDate, isDefined, isNumber, isRangeDomain, LockAcquireStatus, LockAction, type LrsLocksInfo, type NetworkInfo, validateField, validateRangeDomain, type LrsLayer } from 'widgets/shared-code/lrs'
import { type TableEdits, type AttributeSetParam, type MessageProp, type SubtypeLayers, type DynSegFieldInfo, type RouteInfoFromDataAction } from '../../../config'
import { useDynSegRuntimeState, useDynSegRuntimeDispatch } from '../../state'
import { getLineId, getWhereClause, handleCellEdit, preventConflict } from '../../utils/edit-utils'
import { getSubtypeFieldsToUpdate } from '../../utils/table-utils'
import { getSubtypeLayers } from '../../utils/feature-layer-utils'

export interface FieldCalculatorProps {
  handleFieldCalculator
  dynSegFeatureLayer: __esri.FeatureLayer
  lrsLayers: ImmutableArray<LrsLayer>
  attributeSet: AttributeSetParam[]
  intl: IntlShape
  networkDS: any
  routeId: string
  currentRouteInfo: RouteInfoFromDataAction
  networkInfo: ImmutableObject<NetworkInfo>
  handleLockToast: any
}

export function FieldCalcPopup (props: FieldCalculatorProps) {
  const { dynSegFeatureLayer, lrsLayers, attributeSet, intl, networkDS, routeId, currentRouteInfo, networkInfo, handleLockToast } = props
  const { fieldInfo, pendingEdits } = useDynSegRuntimeState()
  const [eventLayerId, setEventLayerId] = React.useState()
  const [field, setEventField] = React.useState()
  const [eventFieldInfo, setEventFieldInfos] = React.useState<DynSegFieldInfo[]>([])
  const [eventFieldsDict, setEventFieldsDict] = React.useState<any>()
  const [eventIds, setEventIds] = React.useState<string[]>([])
  const [subTypeInfo, setSubTypeInfo] = React.useState<SubtypeLayers[]>([])
  const [errorMsg, setErrorMsg] = React.useState<string>('')
  const [lineId, setLineId] = React.useState<string>()
  const [currentValue, setCurrentValue] = React.useState<string | number>()

  const dispatch = useDynSegRuntimeDispatch()
  const getI18nMessage = hooks.useTranslation(defaultMessages)

  React.useEffect(() => {
    createEventFields()
  }, [])

  React.useEffect(() => {
    getSubtypeLayers(lrsLayers, attributeSet)
      .then((subTypeLayers) => {
        setSubTypeInfo(subTypeLayers)
      })
  }, [attributeSet, lrsLayers])

  React.useEffect(() => {
    if (networkInfo?.supportsLines) {
      getLineId(networkInfo, routeId, networkDS)
        .then((lineId) => {
          if (lineId) setLineId(lineId)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [networkInfo])

  const getField = (fieldName) => {
    if (!eventFieldInfo) return null
    const info = eventFieldInfo.find(f => f.eventLayerId === eventLayerId && f.originalFieldName === fieldName)
    const field = dynSegFeatureLayer.fields.find(f => f.name === info.featureFieldName)
    if (field) {
      return field
    }
    return null
  }

  const getFieldType = (field, info) => {
    if (info.isSubtypeField) {
      return 'subtype'
    }
    if (isDefined(field.domain) && isCodedDomain(field.domain.type)) {
      return 'domain'
    }
    if (isDefined(field.domain) && isRangeDomain(field.domain.type)) {
      return 'range'
    }
    if (isDate(field.type)) {
      return 'date'
    }
    if (isNumber(field.type)) {
      return 'number'
    }
    return 'text'
  }

  const getSubtypeCodedValue = () => {
    const subtype = subTypeInfo.find(s => s.id === eventLayerId)
    if (isDefined(subtype) && isDefined(subtype.subtypes)) {
      const codedValues: CodedValue[] = subtype.subtypes.map((subtype) => {
        return {
          value: subtype.code,
          label: subtype.name
        }
      })
      if (codedValues) {
        return codedValues
      }
    }
    return []
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  const getDropDownLabel = (label: string, value?: string | number): string => {
    if (isDefined(value)) {
      return `${value} - ${label}`
    } else {
      return label
    }
  }

  const getDomainOptions = (domain) => {
    return domain?.codedValues?.map((element, i) => {
      let code = element.code
      if (code === null) code = '<null>'
      return (
      <option key={i} value={code}>
        {getDropDownLabel(element.name, element.code)}
      </option>
      )
    })
  }

  const updateCurrentValue = (value: string | number) => {
    setCurrentValue(value)
  }

  const validateValueChanged = async (value: string): Promise<ValidityResult> => {
    if (!field || !eventFieldInfo) return null
    const info = eventFieldInfo.find(f => f.eventLayerId === eventLayerId && f.originalFieldName === field)
    const fieldDetails = getField(field)
    const fieldType = getFieldType(fieldDetails, info)

    let incomingValue: string | number = value

    if (fieldType === 'number') {
      incomingValue = parseFloat(value)
    }

    const existingError = errorMsg.length > 0
    const result = validateField(value, info.featureFieldName, undefined, fieldDetails)
    if (result.hasError) {
      if (existingError) {
        return { valid: false, msg: result.message }
      }
      setErrorMsg(formatMessage(intl, result.message, defaultMessages))
      updateCurrentValue(incomingValue)
      return { valid: false, msg: formatMessage(intl, result.message, defaultMessages) }
    }

    setErrorMsg('')
    updateCurrentValue(incomingValue)
    return { valid: true }
  }

  const validateRangeChanged = (value: string | number): ValidityResult => {
    const fieldName = field
    const info = eventFieldInfo.find(f => f.eventLayerId === eventLayerId && f.originalFieldName === fieldName)
    const fieldDetails = getField(fieldName)

    const existingError = errorMsg.length > 0
    const result = validateRangeDomain(value, info.featureFieldName, undefined, fieldDetails)
    if (result.hasError) {
      if (existingError) {
        return { valid: false, msg: result.message }
      }
      setErrorMsg(formatMessage(intl, result.message, defaultMessages))
      updateCurrentValue(value)
      return { valid: false, msg: formatMessage(intl, result.message, defaultMessages) }
    }

    setErrorMsg('')
    updateCurrentValue(value)
    return { valid: true }
  }

  const validateDateChanged = (evt) => {
    const value = evt.target?.valueAsDate
    if (!value || isNaN(value.getTime())) {
      setCurrentValue(null)
      setErrorMsg('')
      return { valid: true }
    }

    const utcValue = value.valueOf()
    if (!utcValue) {
      setCurrentValue(null)
      setErrorMsg('')
      return { valid: true }
    }

    const fieldName = field
    const info = eventFieldInfo.find(f => f.eventLayerId === eventLayerId && f.originalFieldName === fieldName)
    const fieldDetails = getField(fieldName)

    const existingError = errorMsg.length > 0
    const result = validateField(value, info.featureFieldName, undefined, fieldDetails)
    if (result.hasError) {
      if (existingError) {
        return { valid: false, msg: result.message }
      }
      setErrorMsg(formatMessage(intl, result.message, defaultMessages))
      updateCurrentValue(utcValue)
      return { valid: false, msg: formatMessage(intl, result.message, defaultMessages) }
    }

    setErrorMsg('')
    updateCurrentValue(utcValue)
    return { valid: true }
  }

  const onNumericChange = (value: string | number) => {
    if (value !== currentValue) {
      updateCurrentValue(value)
    }
  }

  const onSelectChange = (e) => {
    updateCurrentValue(e.target.value)
  }

  const getFieldTypeEle = (fieldType, field) => {
    const subtypeCodedValue = getSubtypeCodedValue()
    if (fieldType === 'text') {
      return (
      <TextInput
        style={{ height: '32px' }}
        autoFocus
        type={'text'}
        value={currentValue}
        onChange={(e) => { updateCurrentValue(e.currentTarget.value) }}
        checkValidityOnAccept={validateValueChanged}
      />
      )
    } else if (fieldType === 'number') {
      return (
        <NumericInput
          style={{ height: '32px' }}
          autoFocus
          value={currentValue}
          showHandlers={false}
          onAcceptValue={ onNumericChange }
        />
      )
    } else if (fieldType === 'date') {
      return (
        <CalciteInputDatePicker
          scale="m"
          style={{ height: '32px' }}
          onCalciteInputDatePickerChange={validateDateChanged}
          placement='top'
          overlayPositioning='fixed'
          focusTrapDisabled
      />
      )
    } else if (fieldType === 'domain') {
      const options = getDomainOptions(field.domain)
      return (
        <Select
          value={currentValue}
          onChange={(value) => { onSelectChange(value) }}
        >
          {options}
        </Select>
      )
    } else if (fieldType === 'subtype') {
      return (
        <Select
          value={currentValue}
          onChange={(value) => { onSelectChange(value) }}
        >
          {subtypeCodedValue.map((element, i) => {
            return (
              <option key={i} value={element.value}>{getDropDownLabel(element.label, element.value)}</option>
            )
          })
          }
        </Select>
      )
    } else if (fieldType === 'range') {
      return (
        <TextInput
          style={{ height: '32px' }}
          autoFocus
          value={currentValue}
          onChange={(e) => { updateCurrentValue(e.currentTarget.value) }}
          checkValidityOnAccept={validateRangeChanged}
      />
      )
    }
  }

  const renderEventLayers = () => {
    const options = []
    if (!eventIds || eventIds.length === 0) return []
    eventIds.forEach((eventId) => {
      const info = eventFieldsDict[eventId]
      const eventName = info[0].eventName
      const eventLayerId = info[0].eventLayerId
      options.push(<CalciteOption value={eventLayerId}> {eventName || eventLayerId} </CalciteOption>)
    })
    return options
  }

  const renderEventLayerFields = () => {
    const id = eventLayerId
    if (!id) return []
    const options = []
    const fields = eventFieldsDict[id]
    if (!fields || fields.length === 0) return []
    fields.forEach((field, index) => {
      options.push(<CalciteOption value={field.originalFieldName}> {field.originalFieldName} </CalciteOption>)
    })
    return options
  }

  const renderFieldType = () => {
    if (!field || !eventFieldInfo) return null
    const info = eventFieldInfo.find(f => f.eventLayerId === eventLayerId && f.originalFieldName === field)
    const fieldDetails = getField(field)
    const fieldType = getFieldType(fieldDetails, info)
    return getFieldTypeEle(fieldType, fieldDetails)
  }

  const createEventFields = () => {
    const eventFieldsDict = {}
    const eventIds = []
    if (!fieldInfo || fieldInfo.length === 0 || !eventFieldsDict) return {}
    fieldInfo.forEach((info) => {
      const isEventIdField = info.isEventIdField
      const exclude = info.exclude
      const layerId = info.eventLayerId
      if (!layerId || isEventIdField || exclude) { /* empty */ } else {
        if (eventFieldsDict[info.eventLayerId]) {
          eventFieldsDict[info.eventLayerId].push(info)
        } else {
          eventFieldsDict[info.eventLayerId] = [info]
          eventIds.push(info.eventLayerId)
        }
      }
    })
    if (eventFieldsDict) setEventFieldsDict(eventFieldsDict)
    const fields = eventFieldsDict[eventIds[0]]
    setEventFieldInfos(fields)
    setEventIds(eventIds)
    setEventLayerId(eventIds[0])
    setEventField(fields[0].originalFieldName)
    return eventFieldsDict
  }

  const handleEventLayerChange = (event) => {
    setEventLayerId(event.target.value)
    const fields = eventFieldsDict[event.target.value]
    // on event layer change initialize the field dropdown
    setEventFieldInfos(fields)
    setEventField(fields[0].originalFieldName)
    setCurrentValue(null)
  }

  const handleFieldChange = (event) => {
    setCurrentValue(null)
    setEventField(event.target.value)
  }

  const createLockInfoFromParams = () => {
    const networkId = networkInfo.lrsNetworkId
    const routeOrLineId = []
    const isLine = []
    const eventServiceLayerIds = []
    const routeInfo = currentRouteInfo
    eventIds.forEach((id) => {
      const eventInfo = lrsLayers.find(lyr => lyr.serviceId.toString() === id.toString())
      if (eventInfo) {
        const parentNetworkId = eventInfo.eventInfo.parentNetworkId
        if (parentNetworkId === networkId) {
          eventServiceLayerIds.push(id)
        }
      }
    })

    eventServiceLayerIds.forEach((eventId) => {
      if (networkInfo.supportsLines && lineId) {
        routeOrLineId.push(lineId)
      } else {
        routeOrLineId.push(routeId)
      }
      isLine.push(networkInfo.supportsLines)
    })

    const info: LrsLocksInfo = {
      networkId: [networkId],
      routeOrLineId: routeOrLineId,
      eventServiceLayerIds: eventServiceLayerIds,
      isLine: isLine,
      status: LockAcquireStatus.EsriSuccess,
      details: [],
      //@ts-expect-error
      routeInfo: routeInfo,
      lockAction: LockAction.Query
    }
    return info
  }

  const getRecords = async (featureLayer: __esri.FeatureLayer, networkDS: DataSource): Promise<__esri.Graphic[]> => {
    const query = featureLayer.createQuery()
    query.outFields = ['*']
    query.returnGeometry = true
    query.where = getWhereClause(networkDS)

    return featureLayer.queryFeatures(query).then(async (results) => {
      return results.features
    }).catch((err) => {
      return []
    })
  }

  const handleUpdate = async () => {
    let val = currentValue
    if (val === '<null>') val = null
    const records = await getRecords(dynSegFeatureLayer, networkDS)
    const clonedRecords = []
    const info = eventFieldInfo.find(f => f.eventLayerId === eventLayerId && f.originalFieldName === field)
    records.forEach((record) => {
      const clonedRecord = record.clone()
      const type = clonedRecord.attributes.type
      const eventType = info.EventType
      if (type === eventType) {
        const fieldsToUpdate = getSubtypeFieldsToUpdate(val, info, clonedRecord, subTypeInfo)
        if (fieldsToUpdate.size > 0) {
          fieldsToUpdate.forEach((value, key) => {
            clonedRecord.attributes[key] = value
          })
        } else {
          clonedRecord.attributes[info.featureFieldName] = val
        }
        clonedRecords.push(clonedRecord)
      }
    })

    const edits = {
      updateFeatures: clonedRecords
    }

    await dynSegFeatureLayer.applyEdits(edits).then((editResult) => {
      if (editResult.updateFeatureResults.length > 0) {
        let updatedPendingEdit = new Map<string, TableEdits>(pendingEdits)
        clonedRecords.forEach((clonedRecord) => {
          const type = clonedRecord.attributes.type
          const eventType = info.EventType
          if (type === eventType) {
            updatedPendingEdit = handleCellEdit(info, clonedRecord, eventFieldInfo, updatedPendingEdit)
            dispatch({ type: 'SET_EDITS', value: updatedPendingEdit })
          }
        })
      }
    }).catch((error) => {
      setErrorMsg(error.message)
    })
  }

  const updateTable = async () => {
    const isConflictPrevEnabled = await isConflictPreventionEnabled(networkDS._url)
    let error
    if (isConflictPrevEnabled) {
      const params = createLockInfoFromParams()
      const featureDS = networkDS as FeatureLayerDataSource
      error = await preventConflict(params, featureDS, intl)
      if (error) {
        const messageProp: MessageProp = {
          title: error.toastMsg,
          body: '',
          type: error.toastMsgType
        }
        handleLockToast(messageProp)
        await handleUpdate()
      } else {
        const messageProp: MessageProp = {
          title: getI18nMessage('editFieldSuccess'),
          body: '',
          type: 'success'
        }
        handleLockToast(messageProp)
        await handleUpdate()
      }
    } else {
      await handleUpdate()
    }
  }

  return (
    <div style={{ margin: '1rem', display: 'flex', flexDirection: 'column' }}>
        <Label>
            {getI18nMessage('eventLayer')}
            <CalciteSelect label={getI18nMessage('eventLayer')} value={eventLayerId} onCalciteSelectChange={handleEventLayerChange}>
                {renderEventLayers()}
            </CalciteSelect>
        </Label>
        <Label style={{ marginTop: '0.3rem' }}>
            {getI18nMessage('updateField')}
            <CalciteSelect label={getI18nMessage('updateField')} value={field} onCalciteSelectChange={handleFieldChange}>
                {renderEventLayerFields()}
            </CalciteSelect>
        </Label>
        <Label style={{ marginTop: '0.3rem' }}>
            {getI18nMessage('fieldValue')}
            {renderFieldType()}
        </Label>
        <CalciteButton
          onClick={updateTable}
          disabled={errorMsg?.length > 0 ? true : undefined}
          style={{ alignSelf: 'flex-end', width: '50%', marginTop: '0.5rem' }}>
          {getI18nMessage('update')}
        </CalciteButton>
    </div>
  )
}
