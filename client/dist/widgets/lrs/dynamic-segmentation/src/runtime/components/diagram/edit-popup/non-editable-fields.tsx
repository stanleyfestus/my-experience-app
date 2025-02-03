/** @jsx jsx */
import { hooks, jsx } from 'jimu-core'
import defaultMessages from '../../../translations/default'
import { Label } from 'jimu-ui'
import { type SubtypeLayers } from 'widgets/lrs/dynamic-segmentation/src/config'
import { CalciteTable, CalciteTableCell, CalciteTableHeader, CalciteTableRow } from 'calcite-components'
import { getCalciteBasicTheme, getExistingFieldNames, isDefined, type EventInfo } from 'widgets/shared-code/lrs'
import { convertFieldValueToType } from '../../../utils/diagram-utils'
import { getTheme } from 'jimu-theme'

export interface NonEditableFieldsProps {
  eventInfo: EventInfo
  eventFields: __esri.Field[]
  subtypeLayers: SubtypeLayers[]
  featureLayer: __esri.FeatureLayer
  currentRecord: __esri.Graphic
}

export function NonEditableFields (props: NonEditableFieldsProps) {
  const { eventInfo, eventFields, subtypeLayers, featureLayer, currentRecord } = props
  const getI18nMessage = hooks.useTranslation(defaultMessages)
  const theme = getTheme()

  const getLrsFields = (): __esri.Field[] => {
    if (!isDefined(currentRecord)) {
      return []
    }

    const lrsFieldNames = eventInfo.lrsFields.map((lrsField) => lrsField.alias)
    const lengthFieldNames = getExistingFieldNames()

    // filter out system fields
    let lrsFields = eventFields.filter((field) => lrsFieldNames.includes(field.alias))
    // filter out length fields
    lrsFields = lrsFields.filter((field) => !lengthFieldNames.includes(field.name.toUpperCase()))
    return lrsFields
  }

  const getFieldValue = (field: __esri.Field): string => {
    if (isDefined(currentRecord)) {
      const value = currentRecord.attributes[field.name]
      return convertFieldValueToType(field, featureLayer, value, subtypeLayers)
    }
  }

  return (
  <div
    className="non-editable-fields d-flex w-100 h-100"
    style={{
      flexDirection: 'column',
      paddingTop: '15px'
    }}>
    <div
      style={{
        background: theme.sys.color.surface.paper,
        padding: '0px 15px 15px 15px'
      }}
      css={getCalciteBasicTheme()}>
      <Label
        size='lg'
        centric
        style={{
          fontWeight: 600,
          margin: '0px'
        }}>
        {getI18nMessage('nonEditableFields')}
      </Label>
      <CalciteTable
        caption={getI18nMessage('nonEditableFields')}
        bordered className='table-container'
        scale='m'
        layout='fixed'>
        <CalciteTableRow slot='table-header'>
          <CalciteTableHeader heading={getI18nMessage('attribute')}/>
          <CalciteTableHeader heading={getI18nMessage('value')}/>
        </CalciteTableRow>
        {getLrsFields().map((field, index) => {
          return (
            <CalciteTableRow key={index}>
              <CalciteTableCell alignment='center'>
                <div className='w-100 d-flex'>
                  <Label
                    title={field.alias}
                    className='text-truncate'
                    style={{
                      textOverflow: 'ellipsis',
                      marginBottom: 0,
                      alignItems: 'center',
                      textAlign: 'left'
                    }} >
                    {field.alias}
                  </Label>
                </div>
              </CalciteTableCell>
              <CalciteTableCell alignment='center'>
                <div className='w-100 d-flex'>
                  <Label
                    title={getFieldValue(field)}
                    className='text-truncate'
                    style={{
                      textOverflow: 'ellipsis',
                      marginBottom: 0,
                      alignItems: 'center',
                      textAlign: 'left'
                    }} >
                    {getFieldValue(field)}
                  </Label>
                </div>
              </CalciteTableCell>
            </CalciteTableRow>
          )
        })}
      </CalciteTable>
    </div>
  </div>
  )
}
