/** @jsx jsx */
import { React, jsx, css, type ImmutableObject, hooks } from 'jimu-core'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { TextInput, Select } from 'jimu-ui'
import defaultMessages from '../translations/default'
import { useDataSourceExists } from '../../runtime/data-source/use-data-source-exist'
import { type NetworkItem } from '../../config'

interface Props {
  widgetId: string
  total: number
  index: number
  referentItem?: ImmutableObject<NetworkItem>
  onReferentItemChanged: (index: number, item: ImmutableObject<NetworkItem>, dsUpdateRequired?: boolean) => void
}

export function ReferentItemConfig (props: Props) {
  const { widgetId, index, referentItem, onReferentItemChanged } = props
  const getI18nMessage = hooks.useTranslation(defaultMessages)
  const [itemLabel, setItemLabel] = React.useState(referentItem?.name)
  const [selectedField, setSelectedField] = React.useState(referentItem?.layerFields[0]?.name)
  const dsExist: boolean = useDataSourceExists({ widgetId, useDataSourceId: referentItem?.useDataSource?.dataSourceId })
  React.useEffect(() => {
    // Update if label has changed.
    if (referentItem?.name && itemLabel !== referentItem?.name) {
      setItemLabel(referentItem?.name)
      setSelectedField(referentItem?.layerFields[0]?.name)
    }
    if (referentItem?.displayName) {
      setSelectedField(referentItem?.displayName)
    }
    // eslint-disable-next-line
  }, [referentItem?.name])

  const updateProperty = React.useCallback((prop: string, value: any, dsUpdateRequired = false) => {
    // Updates a single property on the current network.
    let newItem
    if (value == null) {
      newItem = referentItem.without(prop as any)
    } else {
      newItem = referentItem.set(prop, value)
    }
    onReferentItemChanged(index, newItem, dsUpdateRequired)
  }, [onReferentItemChanged, index, referentItem])

  const handleLabelChange = React.useCallback((e) => {
    setItemLabel(e.target.value)
  }, [])

  const handleLabelAccept = React.useCallback((value) => {
    if (value.trim().length > 0) {
      updateProperty('name', value, true)
    } else {
      setItemLabel(referentItem?.name)
    }
  }, [referentItem?.name, updateProperty])

  const renderFields: () => JSX.Element[] = () => {
    const layerFields = referentItem?.layerFields
    if (layerFields?.length === 0) return []
    const fieldsDiv = []
    layerFields.forEach((field, i) => {
      fieldsDiv.push(<option key={i} value={field.name}>{field.name}</option>)
    })
    return fieldsDiv
  }

  const onPropertyChanged = (value) => {
    setSelectedField(value)
    const newItem = referentItem.set('displayName', value)
    onReferentItemChanged(index, newItem, false)
  }

  return (
    <div className='h-100'>
      <div css={css`height: 100%; overflow:auto;`}>
        {referentItem && dsExist && (
          <React.Fragment>
            <SettingSection role='group' aria-label={getI18nMessage('networkLabel')} title={getI18nMessage('networkLabel')}>
              <SettingRow>
                <TextInput
                  size='sm'
                  type='text'
                  className='w-100'
                  value={itemLabel}
                  onChange={handleLabelChange}
                  onAcceptValue={handleLabelAccept}
                  aria-label={getI18nMessage('networkLabel')}
                  />
                </SettingRow>
              </SettingSection>
              <SettingSection role='group' aria-label={getI18nMessage('configureFields')}
                title={getI18nMessage('configureFields')}>
                <SettingRow flow='wrap' label={getI18nMessage('defaultStr')}>
                  <Select
                    aria-label={getI18nMessage('defaultStr')}
                    className='w-100'
                    size='sm'
                    value={selectedField}
                    onChange={e => { onPropertyChanged(e.target.value) }}
                  >
                  {renderFields()}
                </Select>
            </SettingRow>
            </SettingSection>
            </React.Fragment>
        )}
        </div>
    </div>
  )
}
