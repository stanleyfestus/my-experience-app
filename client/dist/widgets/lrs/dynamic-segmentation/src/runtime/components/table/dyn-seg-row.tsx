/** @jsx jsx */
import { type DataSource, type FeatureLayerDataSource, type ImmutableArray, type ImmutableObject, type IntlShape, React, jsx } from 'jimu-core'
import { CalciteTableCell, CalciteTableRow } from 'calcite-components'
import { DynSegCell } from './dyn-seg-cell'
import classNames from 'classnames'
import { type SubtypeLayers, type DynSegFieldInfo, type MessageProp, type RouteInfoFromDataAction } from '../../../config'
import { useDynSegRuntimeDispatch, useDynSegRuntimeState } from '../../state'
import { isDefined, type LrsLayer, type NetworkInfo, LockAcquireStatus, LockAction, type LrsLocksInfo } from 'widgets/shared-code/lrs'
import { Label } from 'jimu-ui'
import { getAttributesByTable, getPendingEditsKey } from '../../utils/table-utils'
import { getLineId, preventConflict } from '../../utils/edit-utils'

export interface RowProps {
  intl: IntlShape
  conflictPreventionEnabled: boolean
  rowIndex: number
  featureLayer: __esri.FeatureLayer
  record: __esri.Graphic
  rangeHeader: string
  fieldInfos: DynSegFieldInfo[]
  lastIndex: number
  subTypeInfo: SubtypeLayers[]
  layerMap: Map<string, __esri.Layer>
  fieldGroups: Map<string, any>
  contingentValues: Map<string, any>
  networkInfo: ImmutableObject<NetworkInfo>
  currentRouteInfo: RouteInfoFromDataAction
  lrsLayers: ImmutableArray<LrsLayer>
  routeId: string
  networkDS: DataSource
  handleLockToast
}

export function DynSegRow (props: RowProps) {
  const { networkDS, intl, conflictPreventionEnabled, routeId, lrsLayers, currentRouteInfo, networkInfo, rowIndex, handleLockToast, featureLayer, record, rangeHeader, fieldInfos, lastIndex, subTypeInfo, layerMap, fieldGroups, contingentValues } = props
  const [isRowSelected, setIsRowSelected] = React.useState<boolean>(false)
  const [currentRecord, setCurrentRecord] = React.useState<__esri.Graphic>(record)
  const [lineId, setLineId] = React.useState<string>()
  const { pendingEdits, selectedRecordIds, fieldInfo } = useDynSegRuntimeState()
  const dispatch = useDynSegRuntimeDispatch()

  React.useEffect(() => {
    if (pendingEdits.size > 0) {
      let update = false
      fieldInfos.forEach((fieldInfo) => {
        const key = getPendingEditsKey(record, fieldInfo.eventName)
        const existingEdit = pendingEdits.get(key)
        if (existingEdit) {
          update = true
        }
      })
      if (update) {
        const where = featureLayer.objectIdField + ' = ' + record.getObjectId()
        featureLayer.queryFeatures({ where: where }).then((result) => {
          setCurrentRecord(result.features[0])
        })
      }
    } else {
      setCurrentRecord(record)
    }
  }, [pendingEdits])

  React.useEffect(() => {
    if (selectedRecordIds.length > 0) {
      const isSelected = selectedRecordIds.find((r) => r === record.getObjectId())
      if ((isSelected && !isRowSelected) || (!isSelected && isRowSelected)) {
        setIsRowSelected(isDefined(isSelected))
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRecordIds])

  React.useEffect(() => {
    if (rowIndex === lastIndex) {
      // Disable loading after we are rendering the last row
      dispatch({ type: 'SET_IS_LOADING', value: false })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const handleSelectedRow = (e) => {
    let selected = [...selectedRecordIds]
    if (e.shiftKey) {
      const lastSelected = selected[selected.length - 1]
      const currentId = record.getObjectId()
      if (lastSelected < currentId) {
        const range = Array.from({ length: currentId - lastSelected + 1 }, (_, i) => i + lastSelected)
        range.forEach((r) => {
          const existingIndex = selected.findIndex((r) => r === record.getObjectId())
          if (existingIndex === -1) {
            selected.push(r)
          }
        })
      } else if (lastSelected > currentId) {
        const range = Array.from({ length: lastSelected - currentId + 1 }, (_, i) => i + currentId)
        range.forEach((r) => {
          const existingIndex = selected.findIndex((r) => r === record.getObjectId())
          if (existingIndex === -1) {
            selected.push(r)
          }
        })
      }
    } else if (e.ctrlKey) {
      const existingIndex = selected.findIndex((r) => r === record.getObjectId())
      if (existingIndex > -1) {
        selected.splice(existingIndex, 1)
      } else {
        selected.push(record.getObjectId())
      }
    } else {
      selected = [record.getObjectId()]
    }
    dispatch({ type: 'SET_SELECTED_RECORD_IDS', value: selected })
  }

  const handleCellEdit = (fieldInfo: DynSegFieldInfo, incomingRecord: __esri.Graphic) => {
    const key = getPendingEditsKey(incomingRecord, fieldInfo.eventName)
    const existingEdits = pendingEdits.get(key)
    const attributes = getAttributesByTable(fieldInfos, incomingRecord, fieldInfo.eventName, false)

    const updatedPendingEdits = new Map(pendingEdits)
    if (isDefined(existingEdits)) {
      existingEdits.attributes = attributes
      updatedPendingEdits.set(key, existingEdits)
    } else {
      const DynSegEdits = {
        layerId: fieldInfo.eventLayerId,
        attributes: attributes
      }
      updatedPendingEdits.set(key, DynSegEdits)
    }
    dispatch({ type: 'SET_EDITS', value: updatedPendingEdits })
  }

  const createLockInfoFromParams = () => {
    const networkId = networkInfo.lrsNetworkId
    const routeOrLineId = []
    const isLine = []
    const eventServiceLayerIds = []
    const routeInfo = currentRouteInfo
    fieldInfo.forEach((info) => {
      const id = info.eventLayerId
      const eventInfo = lrsLayers.find(lyr => lyr.serviceId.toString() === id.toString())
      if (eventInfo) {
        const parentNetworkId = eventInfo.eventInfo.parentNetworkId
        if (parentNetworkId === networkId) {
          eventServiceLayerIds.push(id)
          if (networkInfo.supportsLines && lineId) {
            routeOrLineId.push(lineId)
          } else {
            routeOrLineId.push(routeId)
          }
          isLine.push(networkInfo.supportsLines)
        }
      }
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

  const handleUpdateRecord = async (record: __esri.Graphic, fieldInfo: DynSegFieldInfo) => {
    let error
    if (conflictPreventionEnabled) {
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
        handleCellEdit(fieldInfo, record)
        setCurrentRecord(record)
      } else {
        const messageProp: MessageProp = {
          title: 'Field updated successfully',
          body: '',
          type: 'success'
        }
        handleLockToast(messageProp)
        handleCellEdit(fieldInfo, record)
        setCurrentRecord(record)
      }
    } else {
      handleCellEdit(fieldInfo, record)
      setCurrentRecord(record)
    }
  }

  return (
    <CalciteTableRow
      className='dyn-seg-row'
      onClick={handleSelectedRow}
    >
      <CalciteTableCell className={classNames('dyn-seg-row-header', isRowSelected ? 'selected' : '')}>
        <div className='h-100 d-flex'>
          <Label size="sm" className='w-100' centric style={{ minWidth: '100px', textWrap: 'nowrap', marginBottom: 0, textAlign: 'left', whiteSpace: 'pre' }} >
            {rangeHeader}
          </Label>
        </div>
      </CalciteTableCell>

      {fieldInfos.map((field, index) => {
        return field.visible && !field.exclude
          ? <DynSegCell
              intl={intl}
              key={index}
              rowIndex={index}
              fieldInfo={field}
              featureLayer={featureLayer}
              record={currentRecord}
              subTypeInfo={subTypeInfo}
              layerMap={layerMap}
              fieldGroups={fieldGroups}
              contingentValues={contingentValues}
              updateRecord={handleUpdateRecord}
              />

          : null
      })}
    </CalciteTableRow>
  )
}
