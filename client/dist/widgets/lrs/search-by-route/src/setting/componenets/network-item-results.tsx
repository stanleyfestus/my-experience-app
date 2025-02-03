/** @jsx jsx */
import { React, jsx, type ImmutableObject, Immutable, type OrderByOption, hooks } from 'jimu-core'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { type NetworkItem } from '../../config'
import { Sort } from 'jimu-ui/advanced/sql-expression-builder'
import { Switch } from 'jimu-ui'
import defaultMessages from './../translations/default'

interface Props {
  networkItem?: ImmutableObject<NetworkItem>
  onPropertyChanged: (prop: string, value: any, dsUpdateRequired?: boolean) => void
  onQueryItemChanged: (queryItem: ImmutableObject<NetworkItem>, dsUpdateRequired?: boolean) => void
}

export function ResultsSetting (props: Props) {
  const { networkItem, onPropertyChanged, onQueryItemChanged } = props
  const getI18nMessage = hooks.useTranslation(defaultMessages)

  const onFieldChange = (sortData: OrderByOption[]) => {
    const { dataSourceId, mainDataSourceId, dataViewId, rootDataSourceId } = networkItem.useDataSource

    const nextUseDataSource = {
      dataSourceId,
      mainDataSourceId,
      dataViewId,
      rootDataSourceId,
      fields: networkItem.useDataSource.fields
    }
    let newItem = networkItem.set('sortOptions', sortData)
    newItem = newItem.set('useDataSource', nextUseDataSource)
    onQueryItemChanged(newItem, true)
  }

  return (
    <div >
      {networkItem?.sortOptions && (
        <SettingSection role='group' aria-label={getI18nMessage('results')} title={getI18nMessage('results')} >
          <SettingRow aria-label={getI18nMessage('sortResults')} flow='wrap' label={getI18nMessage('sortResults')}>
            <Sort
              onChange={onFieldChange}
              value={Immutable(networkItem.sortOptions)}
              useDataSource={networkItem.useDataSource}
            />
          </SettingRow>
            <SettingRow flow='no-wrap' label={getI18nMessage('expandByDefault')}>
              <Switch
                aria-label={getI18nMessage('expandByDefault')}
                checked={networkItem.expandByDefault}
                onChange={(e) => { onPropertyChanged('expandByDefault', e.target.checked, true) }}
              />
            </SettingRow>
        </SettingSection>
      )}
    </div>
  )
}
