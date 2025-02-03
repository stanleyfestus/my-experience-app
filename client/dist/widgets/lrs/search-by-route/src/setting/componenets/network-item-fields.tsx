/** @jsx jsx */
import { React, jsx, type ImmutableObject, hooks } from 'jimu-core'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { type NetworkItem } from '../../config'
import { Checkbox, Switch } from 'jimu-ui'
import { derivedFields, distanceField, measureFields, stationField, toRouteField } from '../../constants'
import defaultMessages from '../translations/default'

interface Props {
  networkItem?: ImmutableObject<NetworkItem>
  networkItems?: ImmutableObject<NetworkItem[]>
  onPropertyChanged: (prop: string, value: any, dsUpdateRequired?: boolean) => void
  onPropertiesChanged: (prop: string[], value: any[], dsUpdateRequired?: boolean) => void
}

let fieldValueDict = []
let checkedFieldsLrs = []
let checkedFieldsNonLrs = []

export function NetworkItemFields (props: Props) {
  const { networkItem, networkItems, onPropertyChanged, onPropertiesChanged } = props
  const getI18nMessage = hooks.useTranslation(defaultMessages)
  const [propertyValue, setPropertyChange] = React.useState<any>()
  const [isShowFields, setShowFields] = React.useState<boolean>(false)
  const [hasDerivedNetwork, setDerivedNetwork] = React.useState<boolean>()

  React.useEffect(() => {
    const lrsNetworkId = networkItem.lrsNetworkId
    const derivedNetInfo = networkItems.find(item => (lrsNetworkId === item.derivedFromNetworkId) && item.isDerived)
    if (derivedNetInfo?.isDerived) setDerivedNetwork(true)
    else setDerivedNetwork(false)
    fieldValueDict = []
    checkedFieldsLrs = []
    checkedFieldsNonLrs = []

    const savedLrsFields = networkItem.lrsFields
    const savedNonLrsFields = networkItem.additionalFields
    if (savedLrsFields) {
      savedLrsFields.forEach((field) => {
        fieldValueDict[field] = true
        checkedFieldsLrs.push(field)
      })
    } else {
      const defaultChecked = networkItem.defaultChecked
      if (!defaultChecked) return
      defaultChecked.forEach((field) => {
        fieldValueDict[field] = true
        checkedFieldsLrs.push(field)
      })
    }

    if (savedNonLrsFields) {
      savedNonLrsFields.forEach((field) => {
        fieldValueDict[field] = true
        checkedFieldsNonLrs.push(field)
      })
    } else {
      const defaultChecked = getAdditionalFields()
      if (!defaultChecked) return
      defaultChecked.forEach((field) => {
        fieldValueDict[field.value] = true
        checkedFieldsNonLrs.push(field.value)
      })
    }

    setPropertyChange(fieldValueDict)
    setShowFields(networkItem.showAdditionalFields)
    const props = ['lrsFields', 'additionalFields']
    const values = [checkedFieldsLrs, checkedFieldsNonLrs]
    onPropertiesChanged(props, values, true)
  }, [networkItem.name])

  const setPropValLrs = (fieldName, value) => {
    if (fieldName) {
      if (value && !checkedFieldsLrs.includes(fieldName)) {
        checkedFieldsLrs.push(fieldName)
      } else if (!value && checkedFieldsLrs.includes(fieldName)) {
        const index = checkedFieldsLrs.indexOf(fieldName)
        if (index !== -1) {
          checkedFieldsLrs.splice(index, 1)
        }
      }
    }
    fieldValueDict[fieldName] = value
    setPropertyChange(fieldValueDict)
    onPropertyChanged('lrsFields', checkedFieldsLrs, true)
  }

  const setPropValNonLrs = (fieldName, value) => {
    if (fieldName) {
      if (value && !checkedFieldsNonLrs.includes(fieldName)) {
        checkedFieldsNonLrs.push(fieldName)
      } else if (!value && checkedFieldsNonLrs.includes(fieldName)) {
        const index = checkedFieldsNonLrs.indexOf(fieldName)
        if (index !== -1) {
          checkedFieldsNonLrs.splice(index, 1)
        }
      }
    }
    fieldValueDict[fieldName] = value
    setPropertyChange(fieldValueDict)
    onPropertyChanged('additionalFields', checkedFieldsNonLrs, true)
  }

  const renderNetworkFields = () => {
    const fields = networkItem.layerFields
    if (!fields) return
    const results = []
    fields.forEach((field) => {
      results.push(
        <div>
          <Checkbox
            checked={propertyValue?.[field.jimuName]}
            onClick={(e) => {
              setPropValLrs(field.jimuName, e.currentTarget.checked)
            }}
          />
          <span style={{ paddingLeft: '0.5rem' }}>{field.alias}</span>
        </div>
      )
    })
    return results
  }

  const getAdditionalFields = () => {
    const fields = []
    fields.push({
      label: measureFields.at(0).label,
      value: measureFields.at(0).value
    })
    fields.push({
      label: measureFields.at(1).label,
      value: measureFields.at(1).value
    })
    if (hasDerivedNetwork) {
      fields.push({
        label: derivedFields.at(0).label,
        value: derivedFields.at(0).value
      })
      fields.push({
        label: derivedFields.at(1).label,
        value: derivedFields.at(1).value
      })
      fields.push({
        label: derivedFields.at(2).label,
        value: derivedFields.at(2).value
      })
      fields.push({
        label: derivedFields.at(3).label,
        value: derivedFields.at(3).value
      })
    }
    fields.push({
      label: distanceField.label,
      value: distanceField.value
    })
    fields.push({
      label: stationField.at(0).label,
      value: stationField.at(0).value
    })
    fields.push({
      label: stationField.at(1).label,
      value: stationField.at(1).value
    })
    fields.push({
      label: stationField.at(2).label,
      value: stationField.at(2).value
    })

    if (networkItem?.supportsLines) {
      fields.push({
        label: toRouteField.at(0).label,
        value: toRouteField.at(0).value
      })
      fields.push({
        label: toRouteField.at(1).label,
        value: toRouteField.at(1).value
      })
      fields.push({
        label: toRouteField.at(2).label,
        value: toRouteField.at(2).value
      })
      fields.push({
        label: toRouteField.at(3).label,
        value: toRouteField.at(3).value
      })
      fields.push({
        label: toRouteField.at(4).label,
        value: toRouteField.at(4).value
      })
    }
    return fields
  }

  const renderAdditionalFields = () => {
    const results = []
    const fields = getAdditionalFields()
    fields.forEach((field) => {
      results.push(
        <div>
          <Checkbox
            checked={propertyValue?.[field.value]}
            onClick={(e) => {
              setPropValNonLrs(field.value, e.currentTarget.checked)
            }}
          />
          <span style={{ paddingLeft: '0.5rem' }}>{field.label}</span>
        </div>
      )
    })
    return results
  }

  const onToggleAdditionalFields = (e) => {
    onPropertyChanged('showAdditionalFields', e.target.checked, true)
    setShowFields(e.target.checked)
  }

  const networkFields = renderNetworkFields()
  const additionalFields = renderAdditionalFields()
  return (
    <SettingSection role='group'>
        <SettingRow aria-label={getI18nMessage('advancedFieldDisplay')} flow='no-wrap' label={getI18nMessage('advancedFieldDisplay')}>
          <Switch
            checked={isShowFields}
            onChange={onToggleAdditionalFields}
          />
        </SettingRow>
        {isShowFields && (
          <div style={{ paddingTop: '1rem' }}>
            <SettingRow aria-label={getI18nMessage('networkFields')} flow='wrap'
            label={getI18nMessage('networkFields')}>
              <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '0.7rem' }}>{networkFields}</div>
            </SettingRow>
            <SettingRow aria-label={getI18nMessage('additionalFields')} flow='wrap'
              label={getI18nMessage('additionalFields')}>
                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '0.7rem' }}>{additionalFields}</div>
            </SettingRow>
          </div>
        )}
    </SettingSection>
  )
}
