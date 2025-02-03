/** @jsx jsx */
import { jsx, type ImmutableObject, hooks, type IntlShape } from 'jimu-core'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { NumericInput } from 'jimu-ui'
import { type NetworkItem } from '../../config'
import defaultMessages from '../translations/default'
import { GetUnits } from 'widgets/shared-code/lrs'
interface Props {
  intl: IntlShape
  networkItem?: ImmutableObject<NetworkItem>
  onPropertyChanged: (prop: string, value: any, dsUpdateRequired?: boolean) => void
}

export function NetworkItemSearchRadius (props: Props) {
  const { networkItem, intl, onPropertyChanged } = props
  const getI18nMessage = hooks.useTranslation(defaultMessages)
  const currentNetwork = Object.assign({}, {}, networkItem)

  const handleRadiusAccept = (value: number) => {
    // Updates the page size for search results.
    onPropertyChanged('searchRadius', value, true)
  }
  return (
    <SettingSection title={getI18nMessage('search')}>
      <SettingRow flow='wrap' label={getI18nMessage('radiusWithUnits', { units: GetUnits(currentNetwork.unitsOfMeasure, intl) })}>
        <NumericInput
          size="sm"
          value={currentNetwork.searchRadius}
          precision={3}
          onAcceptValue={handleRadiusAccept}
          aria-label={getI18nMessage('radius')}
          className="w-100"
        />
      </SettingRow>
    </SettingSection>
  )
}
