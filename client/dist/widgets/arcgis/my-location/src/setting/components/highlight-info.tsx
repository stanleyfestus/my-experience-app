/** @jsx jsx */
import { jsx, React, type IMThemeVariables, type IntlShape } from 'jimu-core'
import { Switch } from 'jimu-ui'
import { SettingRow } from 'jimu-ui/advanced/setting-components'
import { type HighlightInfo } from '../../config'
import { ColorPicker } from './color-picker'
// nls
import nls from '../translations/default'
interface Props {
  highlightInfo: HighlightInfo
  onHighlightInfoChange?: (HighlightInfo) => void
  intl: IntlShape
  theme: IMThemeVariables
}

export const HighlightInfoSettings = React.memo((props: (Props)) => {
  const symbolColorTips = props.intl.formatMessage({ id: 'symbolColorTips', defaultMessage: nls.symbolColorTips })
  const compassOrientationTips = props.intl.formatMessage({ id: 'compassOrientationTips', defaultMessage: nls.compassOrientationTips })
  const locationAccuracyTips = props.intl.formatMessage({ id: 'locationAccuracyTips', defaultMessage: nls.locationAccuracyTips })

  const {
    symbolColor,
    showCompassOrientation,
    showLocationAccuracy
  } = props.highlightInfo

  const handleSymbolColorChange = (color) => {
    props.onHighlightInfoChange({ ...props.highlightInfo, symbolColor: color })
  }
  const handleCompassOrientationChange = () => {
    props.onHighlightInfoChange({ ...props.highlightInfo, showCompassOrientation: !showCompassOrientation })
  }
  const handleLocationAccuracyChange = (bl) => {
    props.onHighlightInfoChange({ ...props.highlightInfo, showLocationAccuracy: !showLocationAccuracy })
  }
  return (
    <React.Fragment>
      <div className='highlight-info-section'>
        {/* Symbol Color */}
        <SettingRow label={symbolColorTips} className='bold-font-label' role='group' aria-label={symbolColorTips} >
            <ColorPicker
            className=''
            color={symbolColor}
          // disabled={disabled}
            onChange={handleSymbolColorChange}
          />
        </SettingRow>
        {/* Compass  Orientation */}
        <SettingRow label={compassOrientationTips} className='bold-font-label' role='group' aria-label={compassOrientationTips} >
           <Switch checked={showCompassOrientation} onChange={handleCompassOrientationChange}
                      aria-label={compassOrientationTips} />
        </SettingRow>
        <SettingRow label={locationAccuracyTips} className='bold-font-label' role='group' aria-label={locationAccuracyTips} >
           <Switch checked={showLocationAccuracy} onChange={handleLocationAccuracyChange}
                      aria-label={locationAccuracyTips} />
        </SettingRow>
        </div>
    </React.Fragment>
  )
})
