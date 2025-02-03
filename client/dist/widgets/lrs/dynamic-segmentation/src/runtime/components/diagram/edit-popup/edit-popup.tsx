/** @jsx jsx */
import {
  DataActionManager,
  DataLevel,
  type DataRecord,
  type DataRecordSet,
  type DataSource,
  DataSourceManager,
  DataSourceStatus,
  DataSourceTypes,
  type FeatureLayerDataSource,
  type FieldSchema,
  type IMDataSourceSchema,
  Immutable,
  type ImmutableArray,
  type ImmutableObject,
  JimuFieldType,
  React,
  hooks,
  jsx,
  polished
} from 'jimu-core'
import defaultMessages from '../../../translations/default'
import { EditableFields } from './editable-fields'
import { NonEditableFields } from './non-editable-fields'
import { Button, Modal, ModalBody, ModalHeader, Tooltip } from 'jimu-ui'
import { type SubtypeLayers, type DynSegFieldInfo, type Track, type TrackRecord } from '../../../../config'
import { type EventInfo, getCalciteNoticeTheme, getLayer, isDefined, type LrsLayer, type NetworkInfo } from 'widgets/shared-code/lrs'
import { DynSegFields } from '../../../../constants'
import { getAttributesByDiagram, getEventIdField } from '../../../utils/diagram-utils'
import { ExportOutlined } from 'jimu-icons/outlined/editor/export'
import { getTheme } from 'jimu-theme'
import { useDynSegRuntimeDispatch, useDynSegRuntimeState } from '../../../state'
import FeatureLayer from 'esri/layers/FeatureLayer'
import Graphic from 'esri/Graphic'
import { Statistics } from './statistics'
import { CalciteAction, CalciteNotice } from 'calcite-components'

export interface EditPopupProps {
  widgetId: string
  track: Track
  trackRecord: TrackRecord
  trackFieldInfos: DynSegFieldInfo[]
  lrsLayers: ImmutableArray<LrsLayer>
  subtypeLayers: SubtypeLayers[]
  networkInfo: ImmutableObject<NetworkInfo>
  showEventStatistics: boolean
  onApply: (track: Track) => void
  onClose: () => void
}

export function EditPopup (props: EditPopupProps) {
  const { widgetId, track, trackRecord, trackFieldInfos, lrsLayers, subtypeLayers, networkInfo, showEventStatistics, onApply, onClose } = props
  const [showPopup, setShowPopup] = React.useState(false)
  const [showEditNotice, setShowEditNotice] = React.useState(false)
  const [showSuccessNotice, setShowSuccessNotice] = React.useState(false)
  const [refreshStats, setRefreshStats] = React.useState(false)

  const [eventInfo, setEventInfo] = React.useState<EventInfo>(null)
  const [eventRecords, setEventRecords] = React.useState<__esri.Graphic[]>([])
  const [eventFeatureLayer, setEventFeatureLayer] = React.useState<__esri.FeatureLayer>(null)
  const [eventFields, setEventFields] = React.useState<__esri.Field[]>([])
  const [eventDataSource, setEventDataSource] = React.useState<DataSource>(null)

  const [currentRecord, setCurrentRecord] = React.useState<__esri.Graphic>(null)
  const [outputPointDsId, setOutputPointDsId] = React.useState<string>(null)
  const [outputLineDsId, setOutputLineDsId] = React.useState<string>(null)

  const statRef = React.useRef(null)
  const editRef = React.useRef(null)
  const { pendingEdits, selectedSldId, outputDataSources } = useDynSegRuntimeState()
  const dispatch = useDynSegRuntimeDispatch()
  const getI18nMessage = hooks.useTranslation(defaultMessages)
  const theme = getTheme()

  // #region Effects
  React.useEffect(() => {
    if (!isDefined(track) || !isDefined(trackRecord)) {
      setShowPopup(false)
    } else {
      setShowPopup(true)
      findEventRecords()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track, trackRecord])

  React.useEffect(() => {
    if (isDefined(outputDataSources) && outputDataSources.length === 2) {
      setOutputPointDsId(outputDataSources[0])
      setOutputLineDsId(outputDataSources[1])
    }
  }, [outputDataSources])
  // #endregion

  React.useEffect(() => {
    if (showSuccessNotice) {
      setTimeout(() => {
        setShowSuccessNotice(false)
      }, 10000)
    }
  }, [showSuccessNotice])

  // #region Event Query
  const findEventRecords = async () => {
    // find the event layer
    const lrsLayer = lrsLayers.find(lrsLayer => lrsLayer.serviceId.toString() === track.layerId)
    if (isDefined(lrsLayer) && isDefined(lrsLayer.eventInfo)) {
      setEventInfo(lrsLayer.eventInfo)
      const dataSource = DataSourceManager.getInstance().getDataSource(lrsLayer.useDataSource.dataSourceId)
      if (isDefined(dataSource)) {
        let gdbVersion = (dataSource as FeatureLayerDataSource).getGDBVersion()
        if (!gdbVersion) {
          gdbVersion = ''
        }

        const eventLayer = await getLayer(lrsLayer.useDataSource)
        const query = eventLayer.createQuery()
        const routeId = trackRecord.attributes.get(DynSegFields.routeIdName)
        query.outFields = ['*']
        query.where = `LOWER(${lrsLayer.eventInfo.routeIdFieldName}) = LOWER('${routeId}')`
        query.gdbVersion = gdbVersion
        await eventLayer.queryFeatures(query).then((res) => {
          setEventDataSource(dataSource)
          setEventFields(eventLayer.fields)
          setEventFeatureLayer(eventLayer)
          setEventRecords(res.features)
          findCurrentRecord(res.features, dataSource, lrsLayer.eventInfo)
        })
      }
    }
  }

  const findCurrentRecord = (records: __esri.Graphic[], dataSource: DataSource, eventInfo: EventInfo) => {
    if (records.length === 0) {
      setCurrentRecord(null)
    } else if (eventRecords.length === 1) {
      setCurrentRecord(getRecordWithTrackInfo(eventRecords[0], trackRecord, eventInfo))
    } else {
      records.forEach(record => {
        const e1 = record.attributes[eventInfo.eventIdFieldName]
        const e2 = trackRecord.attributes.get(getEventIdField(trackFieldInfos, trackRecord).originalFieldName)
        if (e1 === e2) {
          setCurrentRecord(getRecordWithTrackInfo(record, trackRecord, eventInfo))
        }
      })
    }
  }

  const getRecordWithTrackInfo = (record: __esri.Graphic, trackRecord: TrackRecord, eventInfo: EventInfo): __esri.Graphic => {
    // Sync the current record with the track record
    const values = record.attributes
    const keys = Object.keys(values)
    keys.forEach((key) => {
      if (trackRecord.attributes.has(key)) {
        values[key] = trackRecord.attributes.get(key)
      }
    })
    record.attributes = values
    return record
  }
  // #endregion

  // #region Export to CSV
  const handleExport = async () => {
    if (isDefined(eventDataSource) && isDefined(currentRecord)) {
      // Build the output data record
      const dataRecord = getDataRecord(eventDataSource, currentRecord)
      if (!isDefined(dataRecord)) {
        return
      }

      // build the output data source
      const results = await buildOutputDsResults(eventDataSource, [dataRecord])
      if (!isDefined(results)) {
        return
      }

      // export the data source to csv
      const dsId = results[0]
      if (dsId) {
        const dataSetRecords = results[1]
        const dsManager = DataSourceManager.getInstance()
        const outDS = dsManager?.getDataSource(dsId)
        dsManager.createDataSource(Immutable({
          id: eventDataSource.id + '_export',
          type: DataSourceTypes.FeatureLayer,
          isDataInDataSourceInstance: true,
          schema: outDS.getSchema(),
          disableExport: false
        })).then(ds => {
          ds.setSourceRecords([dataRecord])

          const actionsPromise = DataActionManager.getInstance().getSupportedActions(widgetId, dataSetRecords, DataLevel.Records)
          actionsPromise.then(async actions => {
            const action = actions.export
            if (action?.length > 0) {
              const exportToCsvAction = action.filter((action) => {
                return action.id === 'export-csv'
              })
              await DataActionManager.getInstance().executeDataAction(exportToCsvAction[0], dataSetRecords, DataLevel.Records, widgetId)
            }
          }).catch(err => {
            console.error(err)
          })
        })
      }
    }
  }

  const buildOutputDsResults = async (dataSource: DataSource, featureRecords: DataRecord[]): Promise<[string, DataRecordSet[]]> => {
    // get the output data source
    const outputDsId = eventInfo.isPointEvent ? outputPointDsId : outputLineDsId
    let outputDS = DataSourceManager.getInstance().getDataSource(outputDsId)
    if (!outputDS) {
      outputDS = await DataSourceManager.getInstance().createDataSource(outputDsId) as FeatureLayerDataSource
    }
    if (!outputDS) {
      return
    }

    // set the schema for the output data source using the input data source.
    // we will tack on statistic fields if applicable.
    const newSchema = getOutputSchema(dataSource)
    outputDS.setSchema(newSchema)
    const fieldsToExport = getFieldsToExport()
    const dsJson = Object.assign(outputDS.getDataSourceJson())
    const label = dataSource.getLabel() + '_export'
    DataSourceManager.getInstance().updateDataSourceByDataSourceJson(outputDS, Immutable({ ...dsJson, label: label, disableExport: false }))

    const sourceFeatures: Graphic[] = []
    featureRecords?.forEach((record: any, index) => {
      //create source feature values by pushing the graphic attributes
      const featureValue: any = {}
      const tempFeature = record.getFeature()
      if (tempFeature.attributes) {
        for (const key in tempFeature.attributes) {
          const attributeValue = tempFeature.attributes[key]
          //add values for new feature
          if (attributeValue !== undefined && attributeValue !== null) {
            featureValue[key] = attributeValue
          }
        }
      }
      const newGraphic = new Graphic({
        attributes: featureValue,
        geometry: record.geometry
      })
      sourceFeatures.push(newGraphic)
    })

    //create field infos for layer and popupTemplate
    const fieldsInPopupTemplate: any[] = []
    const layerFields: any[] = []
    const featureFields = Object.keys(newSchema?.fields)
      .filter(key => fieldsToExport.includes(key))
      .reduce((obj, key) => {
        obj[key] = newSchema?.fields[key]
        return obj
      }, {})
    for (const key in featureFields) {
      let fieldType = ''
      if (featureFields[key].type === JimuFieldType.Number) {
        fieldType = 'double'
      } else if (featureFields[key].type === JimuFieldType.Date) {
        fieldType = 'date'
      } else {
        fieldType = 'string'
      }
      const fieldInfo = {
        alias: featureFields[key].alias,
        name: featureFields[key].name,
        type: fieldType
      }
      const popupFieldItem = {
        fieldName: featureFields[key].name,
        label: featureFields[key].alias
      }
      layerFields.push(fieldInfo)
      fieldsInPopupTemplate.push(popupFieldItem)
    }

    // create temp feature layer
    const layer = new FeatureLayer({
      id: outputDsId + '_layer',
      title: outputDsId,
      fields: layerFields,
      geometryType: eventInfo.isPointEvent ? 'point' : 'polyline',
      source: sourceFeatures,
      objectIdField: outputDS.getSchema().idField,
      popupTemplate: {
        title: outputDS.getLabel(),
        fieldInfos: fieldsInPopupTemplate,
        content: [{
          type: 'fields',
          fieldInfos: fieldsInPopupTemplate
        }]
      },
      visible: false,
      listMode: 'hide'
    })

    // assign feature layer to the data source
    const featureLayerDs = DataSourceManager.getInstance().getDataSource(outputDsId) as FeatureLayerDataSource
    if (layer && featureLayerDs) {
      featureLayerDs.layer = layer
    }

    // create the data set array
    const dataSetArr: DataRecordSet[] = []
    dataSetArr.push({
      records: featureRecords,
      dataSource: outputDS,
      name: outputDS.getLabel(),
      fields: fieldsToExport
    })

    //update the data source status
    DataSourceManager.getInstance().getDataSource(outputDsId)?.setStatus(DataSourceStatus.Unloaded)
    DataSourceManager.getInstance().getDataSource(outputDsId)?.setCountStatus(DataSourceStatus.Unloaded)
    DataSourceManager.getInstance().getDataSource(outputDsId)?.addSourceVersion()

    return [outputDsId, dataSetArr]
  }

  const getOutputSchema = (dataSource: DataSource): IMDataSourceSchema => {
    const fields = {}
    const featureDS = dataSource as FeatureLayerDataSource
    const originSchema = featureDS?.getSchema().fields.asMutable({ deep: true })
    const lrsFields = getLrsFields()
    const attributes = getAttributeSetFields()
    const statFields = getStatFields()
    const outputFields: FieldSchema[] = []

    // Only include fields that are in the UI.
    Object.keys(originSchema).forEach((value) => {
      if (lrsFields.includes(value)) {
        outputFields.push(originSchema[value])
      }
      if (attributes.includes(value)) {
        outputFields.push(originSchema[value])
      }
    })

    // Include the statistic fields
    statFields.forEach((field) => {
      outputFields.push({
        alias: field[0],
        type: JimuFieldType.Number,
        jimuName: field[0],
        name: field[0]
      })
    })

    // Gather each schema field.
    outputFields?.forEach((fieldSchema) => {
      fields[fieldSchema?.jimuName] = fieldSchema
    })
    const label = dataSource.getLabel() + '_export'

    // return schema object.
    return {
      label,
      idField: 'OBJECTID',
      fields: fields
    } as IMDataSourceSchema
  }

  const getFieldsToExport = (): string[] => {
    const lrsFields = eventInfo.lrsFields.map((lrsField) => lrsField.name)
    const statFields = getStatFields().map((field) => field[0])
    const dynSegFieldValues = Object.values(DynSegFields)
    const trackFieldKeys = [...trackRecord.attributes.keys()]
    const objectIdFields = trackFieldInfos.filter((field) => field.isOidField).map((field) => field.featureFieldName)
    const trackFields = trackFieldKeys.filter((key) => !dynSegFieldValues.includes(key) && key !== eventInfo.eventIdFieldName && !objectIdFields.includes(key))
    return [...lrsFields, ...statFields, ...trackFields]
  }

  const getLrsFields = (): string[] => {
    return eventInfo.lrsFields.map((lrsField) => lrsField.name)
  }

  const getAttributeSetFields = (): string[] => {
    const attributeFields = []
    const keys = Object.keys(currentRecord.attributes)
    keys.forEach((key) => {
      if (trackRecord.attributes.has(key)) {
        attributeFields.push(key)
      }
    })
    return attributeFields
  }

  const getStatFields = (): Array<[string, string]> => {
    if (!statRef.current) {
      return []
    }
    return statRef.current.getStats()
  }

  const getDataRecord = (dataSource: DataSource, currentRecord: __esri.Graphic): DataRecord => {
    const attributesToInclude: { [key: string]: any } = {}
    const lrsFields = getLrsFields()
    const statFields = getStatFields()

    const keys = Object.keys(currentRecord.attributes)
    keys.forEach((key) => {
      if (lrsFields.includes(key)) {
        attributesToInclude[key] = currentRecord.attributes[key]
      }
      if (trackRecord.attributes.has(key)) {
        attributesToInclude[key] = trackRecord.attributes.get(key)
      }
    })

    statFields.forEach((field) => {
      attributesToInclude[field[0]] = field[1]
    })

    return dataSource.buildRecord({ attributes: attributesToInclude, geometry: currentRecord.geometry })
  }

  // #endregion

  // #region Event Handlers
  const handleClose = (discard?: boolean) => {
    if (editRef.current && editRef.current.isEditPending() && !discard) {
      setShowEditNotice(true)
    } else {
      setShowEditNotice(false)
      setShowSuccessNotice(false)
      setShowPopup(false)
      setEventInfo(null)
      setEventRecords([])
      setEventFeatureLayer(null)
      setEventFields([])
      setCurrentRecord(null)
      dispatch({ type: 'SET_SELECTED_SLD_ID', value: '' })
      onClose()
    }
  }

  const handleSave = () => {
    editRef.current?.applyEdit()
    setTimeout(() => {
      if (!editRef.current.isEditPending()) {
        setShowEditNotice(false)
        handleClose()
      }
    }, 200)
  }

  const handleApply = React.useCallback((record: TrackRecord) => {
    // Update the pending edits
    const updatedPendingEdits = new Map(pendingEdits)
    const DynSegEdits = {
      layerId: track.layerId,
      attributes: getAttributesByDiagram(trackFieldInfos, record, eventInfo?.datasetName, false)
    }
    updatedPendingEdits.set(selectedSldId, DynSegEdits)
    dispatch({ type: 'SET_EDITS', value: updatedPendingEdits })

    // Update the track for the UI
    const index = track.records.findIndex((record) => record.index === trackRecord.index)
    if (index > -1) {
      track.records[index] = record
      setShowSuccessNotice(true)
      onApply(track)
      refresh()
    }
  }, [dispatch, eventInfo, onApply, pendingEdits, selectedSldId, track, trackFieldInfos, trackRecord])

  const refresh = () => {
    setRefreshStats(true)
    setTimeout(() => {
      setRefreshStats(false)
    }, 200)
  }
  // #endregion

  // #region Render
  return (
    <Modal
      size='sm'
      isOpen={showPopup}
      centered
      scrollable
      toggle={() => { handleClose() }}
      backdrop='static'
    >
      <ModalHeader
        title={track?.layerName}
        toggle={() => { handleClose() }}>
        <div className='d-flex w-100'>
          {track?.layerName}
          <Tooltip title={getI18nMessage('dataAction_ExportCSV')}>
            <Button
              style={{
                marginLeft: 'auto',
                border: 'none'
              }}
              icon
              size='sm'
              onClick={handleExport}>
              <ExportOutlined/>
            </Button>
          </Tooltip>
        </div>
      </ModalHeader>
      <ModalBody
        style={{
          maxHeight: '70vh',
          overflow: 'auto',
          background: theme.sys.color.surface.background
        }}>
          <CalciteNotice
          css={getCalciteNoticeTheme(theme)}
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            marginBottom: showSuccessNotice ? '15px' : '0px',
            borderTop: showSuccessNotice ? `1px solid ${polished.rgba(theme.sys.color.surface.overlayHint, 0.5)}` : 'none',
            borderRight: showSuccessNotice ? `1px solid ${polished.rgba(theme.sys.color.surface.overlayHint, 0.5)}` : 'none',
            borderBottom: showSuccessNotice ? `1px solid ${polished.rgba(theme.sys.color.surface.overlayHint, 0.5)}` : 'none',
            borderLeft: 0
          }}
            open={showSuccessNotice ? true : undefined}
            icon='check-circle'
            kind='success'
            scale='s'
            width='auto'
            closable={true}
            onCalciteNoticeClose={(e) => { setShowSuccessNotice(false) }}>
            <div slot='title'>{getI18nMessage('sldEditSuccessful')}</div>
          </CalciteNotice>
          <CalciteNotice
          css={getCalciteNoticeTheme(theme)}
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            marginBottom: showEditNotice ? '15px' : '0px',
            borderTop: showEditNotice ? `1px solid ${polished.rgba(theme.sys.color.surface.overlayHint, 0.5)}` : 'none',
            borderRight: showEditNotice ? `1px solid ${polished.rgba(theme.sys.color.surface.overlayHint, 0.5)}` : 'none',
            borderBottom: showEditNotice ? `1px solid ${polished.rgba(theme.sys.color.surface.overlayHint, 0.5)}` : 'none',
            borderLeft: 0
          }}
            open={showEditNotice ? true : undefined}
            icon='exclamation-mark-triangle'
            kind='warning'
            scale='s'
            width='auto'
          >
            <div slot='title'>{getI18nMessage('applyEditTitle')}</div>
            <div slot='message'>{getI18nMessage('applyEditMessage')}</div>
            <div slot='actions-end'>
              <div className='d-flex' style={{ flexDirection: 'column', backgroundColor: theme.sys.color.primary.main }}>
                <CalciteAction
                  scale='m'
                  icon="read-only-non-editable"
                  text="Discard"
                  text-enabled
                  appearance='transparent'
                  onClick={() => { handleClose(true) }}
                  style={{ border: `2px solid ${theme.sys.color.surface.paper}` }}/>
                <CalciteAction
                  scale='m'
                  icon="save"
                  text="Apply"
                  text-enabled
                  appearance='transparent'
                  onClick={() => { handleSave() }}
                  style={{ border: `2px solid ${theme.sys.color.surface.paper}`, borderTop: 0 }}/>
              </div>
            </div>

          </CalciteNotice>
          <EditableFields
            ref={editRef}
            trackRecord={trackRecord}
            eventInfo={eventInfo}
            eventRecords={eventRecords}
            eventFields={eventFields}
            featureLayer={eventFeatureLayer}
            currentRecord={currentRecord}
            onApply={handleApply}/>
          <NonEditableFields
            eventInfo={eventInfo}
            eventFields={eventFields}
            subtypeLayers={subtypeLayers}
            featureLayer={eventFeatureLayer}
            currentRecord={currentRecord}/>
          {showEventStatistics && (
            <Statistics
              ref={statRef}
              track={track}
              trackRecord={trackRecord}
              eventEsriFields={eventFields}
              eventInfo={eventInfo}
              currentRecord={currentRecord}
              allRecords={eventRecords}
              networkInfo={networkInfo}
              featureLayer={eventFeatureLayer}
              refresh={refreshStats}/>
          )}

      </ModalBody>
    </Modal>
  )
}
// #endregion
