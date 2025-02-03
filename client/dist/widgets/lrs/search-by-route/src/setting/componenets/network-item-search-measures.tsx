/** @jsx jsx */
import { React, jsx, type ImmutableObject, hooks } from 'jimu-core'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { Switch } from 'jimu-ui'
import { type NetworkItem } from '../../config'
import defaultMessages from './../translations/default'

interface Props {
  networkItem: ImmutableObject<NetworkItem>
  onPropertyChanged: (prop: string, value: any, dsUpdateRequired?: boolean) => void
}

export function NetworkItemSearchMeasures (props: Props) {
  const { networkItem, onPropertyChanged } = props
  const getI18nMessage = hooks.useTranslation(defaultMessages)
  const currentNetwork = Object.assign({}, {}, networkItem)

  const handleSwitchChange = (e, name: string) => {
    if (!e.target) return
    onPropertyChanged(name, e.target.checked, true)
  }

  const GetActiveMethods = (): number => {
    // Returns how many methods are enabled.
    let count = 0
    if (currentNetwork.searchSingle) { count++ }
    if (currentNetwork.searchMultiple) { count++ }
    if (currentNetwork.searchRange) { count++ }
    return count
  }

  return (
    <SettingSection
      role='group'
      aria-label={getI18nMessage('searchMeasures')}
      title={getI18nMessage('searchMeasures')}
    >
      <SettingRow label={getI18nMessage('singleLabel')}>
        <Switch
          aria-label={getI18nMessage('singleLabel')}
          checked={currentNetwork.searchSingle}
          disabled={GetActiveMethods() === 1 && currentNetwork.searchSingle}
          onChange={(e) => { handleSwitchChange(e, 'searchSingle') }}
        />
      </SettingRow>
      <SettingRow label={getI18nMessage('multipleLabel')}>
        <Switch
          aria-label={getI18nMessage('multipleLabel')}
          checked={currentNetwork.searchMultiple}
          disabled={GetActiveMethods() === 1 && currentNetwork.searchMultiple}
          onChange={(e) => { handleSwitchChange(e, 'searchMultiple') }}
        />
      </SettingRow>
      <SettingRow label={getI18nMessage('rangeLabel')}>
        <Switch
          aria-label={getI18nMessage('rangeLabel')}
          checked={currentNetwork.searchRange}
          disabled={GetActiveMethods() === 1 && currentNetwork.searchRange}
          onChange={(e) => { handleSwitchChange(e, 'searchRange') }}
        />
      </SettingRow>
    </SettingSection>
  )
}
