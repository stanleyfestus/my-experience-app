/** @jsx jsx */
import { React, jsx, css, hooks, type IntlShape } from 'jimu-core'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { type ImmutableArray, type ImmutableObject } from 'seamless-immutable'
import { TextInput } from 'jimu-ui'
import defaultMessages from './../translations/default'
import { NetworkItemMethod } from './network-item-method'
import { NetworkItemIdentifier } from './network-item-indentifier'
import { useDataSourceExists } from '../../runtime/data-source/use-data-source-exist'
import { type NetworkItem } from '../../config'
import { ResultsSetting } from './network-item-results'
import { NetworkItemSearchMeasures } from './network-item-search-measures'
import { NetworkItemSpatialReference } from './network-item-spatial-reference'
import { NetworkItemSearchRadius } from './network-item-search-radius'
import { NetworkItemFields } from './network-item-fields'

interface Props {
  intl: IntlShape
  widgetId: string
  total: number
  index: number
  networkItem?: ImmutableObject<NetworkItem>
  networkItems?: ImmutableArray<NetworkItem> | any
  onNetworkItemChanged: (index: number, item: ImmutableObject<NetworkItem>, dsUpdateRequired?: boolean) => void
}

export function NetworkItemConfig (props: Props) {
  const { intl, widgetId, index, networkItem, networkItems, onNetworkItemChanged } = props
  const getI18nMessage = hooks.useTranslation(defaultMessages)
  const [itemLabel, setItemLabel] = React.useState(networkItem?.name)
  const dsExist: boolean = useDataSourceExists({ widgetId, useDataSourceId: networkItem?.useDataSource?.dataSourceId })

  React.useEffect(() => {
    // Update if label has changed.
    if (networkItem?.name && itemLabel !== networkItem?.name) {
      setItemLabel(networkItem?.name)
    }
    // eslint-disable-next-line
  }, [networkItem?.name])

  const updateProperty = React.useCallback((prop: string, value: any, dsUpdateRequired = false) => {
    // Updates a single property on the current network.
    let newItem
    if (value == null) {
      newItem = networkItem.without(prop as any)
    } else {
      newItem = networkItem.set(prop, value)
    }
    onNetworkItemChanged(index, newItem, dsUpdateRequired)
  }, [onNetworkItemChanged, index, networkItem])

  const updateProperties = React.useCallback((props: string[], values: any[], dsUpdateRequired = false) => {
    // Updates multiple properties on the current network.
    if (props.length !== values.length) {
      return
    }

    let newItem
    props.forEach((prop, index) => {
      if (values[index] == null) {
        if (newItem == null) {
          newItem = networkItem.without(prop as any)
        } else {
          newItem = newItem.without(prop as any)
        }
      } else {
        if (newItem == null) {
          newItem = networkItem.set(prop, values[index])
        } else {
          newItem = newItem.set(prop, values[index])
        }
      }
    })

    onNetworkItemChanged(index, newItem, dsUpdateRequired)
  }, [onNetworkItemChanged, index, networkItem])

  const handleLabelChange = React.useCallback((e) => {
    setItemLabel(e.target.value)
  }, [])

  const handleLabelAccept = React.useCallback((value) => {
    if (value.trim().length > 0) {
      updateProperty('name', value, true)
    } else {
      setItemLabel(networkItem?.name)
    }
  }, [networkItem?.name, updateProperty])

  const updateItem = (newItem: ImmutableObject<NetworkItem>, dsUpdateRequired = false) => {
    onNetworkItemChanged(index, newItem, dsUpdateRequired)
  }

  return (
    <div className='h-100'>
      <div css={css`height: 100%; overflow:auto;`}>
        {networkItem && dsExist && (
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
            <NetworkItemMethod
              widgetId={widgetId}
              networkItem={networkItem}
              onPropertyChanged={updateProperty}
              onPropertiesChanged={updateProperties}
            />
            {(networkItem.useMeasure || networkItem.useLineAndMeasure) && (
              <NetworkItemSearchMeasures
                networkItem={networkItem}
                onPropertyChanged={updateProperty}
              />
            )}
            <NetworkItemIdentifier
              widgetId={widgetId}
              networkItem={networkItem}
              onPropertyChanged={updateProperty}
            />
            {networkItem.useCoordinate && (
            <NetworkItemSpatialReference
              networkItem={networkItem}
              onPropertyChanged={updateProperty}
            />
            )}
            {networkItem.useCoordinate && (
            <NetworkItemSearchRadius
              intl={intl}
              networkItem={networkItem}
              onPropertyChanged={updateProperty}
            />
            )}
            <ResultsSetting
              networkItem={networkItem}
              onPropertyChanged={updateProperty}
              onQueryItemChanged={updateItem}
            />
            <NetworkItemFields
              networkItem={networkItem}
              networkItems={networkItems}
              onPropertyChanged={updateProperty}
              onPropertiesChanged={updateProperties}/>
          </React.Fragment>
        )}
      </div>
    </div>
  )
}
