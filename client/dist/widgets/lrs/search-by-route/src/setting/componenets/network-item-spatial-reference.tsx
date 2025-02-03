/** @jsx jsx */
import { jsx, type ImmutableObject, hooks } from 'jimu-core'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { Select } from 'jimu-ui'
import { type NetworkItem, SpatialReferenceFrom } from '../../config'
import defaultMessages from '../translations/default'

interface Props {
  networkItem?: ImmutableObject<NetworkItem>
  onPropertyChanged: (prop: string, value: any, dsUpdateRequired?: boolean) => void
}

export function NetworkItemSpatialReference (props: Props) {
  const { networkItem, onPropertyChanged } = props
  const getI18nMessage = hooks.useTranslation(defaultMessages)
  const currentNetwork = Object.assign({}, {}, networkItem)

  return (
    <SettingSection title={getI18nMessage('spatialReference')}>
      <SettingRow flow='wrap' label={getI18nMessage('Default')}>
          <Select
            aria-label={getI18nMessage('Default')}
            className='w-100'
            size='sm'
            value={currentNetwork.defaultSpatialReferenceFrom}
            onChange={(e) => { onPropertyChanged('defaultSpatialReferenceFrom', e.target.value, true) }}
          >
            <option value={SpatialReferenceFrom.Map}>{getI18nMessage('map')}</option>
            <option value={SpatialReferenceFrom.Lrs}>{getI18nMessage('lrs')}</option>
          </Select>
      </SettingRow>
    </SettingSection>
  )
}
