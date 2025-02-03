/** @jsx jsx */
import { jsx, React, type IMThemeVariables, type IntlShape } from 'jimu-core'
import { Switch, NumericInput, Select } from 'jimu-ui'
import { SettingRow } from 'jimu-ui/advanced/setting-components'
import { type WatchLocationSettings, Types, DistanceUnits, TimeUnits } from '../../config'
// nls
import nls from '../translations/default'
interface Props {
  watchLocationSettings: WatchLocationSettings
  timeOut: number
  onTrackLocationSettingsChange?: (HighlightInfo) => void
  intl: IntlShape
  theme: IMThemeVariables
}

export const TrackLocation = React.memo((props: (Props)) => {
  const streamingTips = props.intl.formatMessage({ id: 'streamingTips', defaultMessage: nls.streamingTips })
  const manualPathTracingTips = props.intl.formatMessage({ id: 'manualPathTracingTips', defaultMessage: nls.manualPathTracingTips })
  const {
    manualPathTracing,
    streaming
  } = props.watchLocationSettings

  const handleInputChange = (value: number) => {
    if (value === null) {
      value = streaming.type === Types.Distance ? 15 : 5
    }
    props.onTrackLocationSettingsChange({ ...props.watchLocationSettings, streaming: { ...props.watchLocationSettings.streaming, interval: value } })
  }
  const handleTypeChange = (evt, item) => {
    const unit = item.props.value === Types.Distance ? DistanceUnits.ft : TimeUnits.sec
    const defaultInterval = item.props.value === Types.Distance ? 15 : 5
    props.onTrackLocationSettingsChange({ ...props.watchLocationSettings, streaming: { ...props.watchLocationSettings.streaming, type: item.props.value, interval: defaultInterval, unit: unit } })
  }
  const handleUnitChange = (evt, item) => {
    props.onTrackLocationSettingsChange({ ...props.watchLocationSettings, streaming: { ...props.watchLocationSettings.streaming, unit: item.props.value } })
  }

  const getUnitOptions = () => {
    if (streaming.type === Types.Distance) {
      return Object.keys(DistanceUnits).map((key) => {
        return <option key={key} value={DistanceUnits[key]}>{getTranslatedType(DistanceUnits[key])}</option>
      })
    } else {
      return Object.keys(TimeUnits).map((key) => {
        return <option key={key} value={TimeUnits[key]}>{getTranslatedType(TimeUnits[key])}</option>
      })
    }
  }
  const handleManualPathTracingChange = (bl) => {
    props.onTrackLocationSettingsChange({ ...props.watchLocationSettings, manualPathTracing: !manualPathTracing })
  }
  const getTranslatedType = (type): string => {
    if (type === Types.Distance) {
      return props.intl.formatMessage({ id: 'streamingDistance', defaultMessage: nls.streamingDistance })
    } else if (type === Types.Time) {
      return props.intl.formatMessage({ id: 'streamingTime', defaultMessage: nls.streamingTime })
    } else if (type === DistanceUnits.ft) {
      return props.intl.formatMessage({ id: 'distanceFeet', defaultMessage: nls.distanceFeet })
    } else if (type === DistanceUnits.m) {
      return props.intl.formatMessage({ id: 'distanceMeters', defaultMessage: nls.distanceMeters })
    } else if (type === TimeUnits.sec) {
      return props.intl.formatMessage({ id: 'timeSec', defaultMessage: nls.timeSec })
    }
  }
  return (
    <React.Fragment>
      <div className='highlight-info-section'>
        {/* Steaming */}
        <SettingRow label={streamingTips} className='bold-font-label' role='group' aria-label={streamingTips} ></SettingRow>
        <SettingRow className='streaming-section' >
          <Select size='sm' className='streaming-type-select' defaultValue={streaming.type === Types.Distance ? Types.Distance : Types.Time} value={streaming.type} onChange={handleTypeChange} >
            {Object.keys(Types).map((key) => {
              return <option key={key} value={Types[key]}>{getTranslatedType(Types[key])}</option>
            })}
          </Select>
          <NumericInput className={'streaming-input'} showHandlers={false} min={0} defaultValue={streaming.type === Types.Distance ? 15 : 5} value={streaming.interval} onAcceptValue={handleInputChange} />
          <Select size='sm' className='streaming-unit-select' value={streaming.unit} onChange={handleUnitChange} >
            {getUnitOptions()}
          </Select>
        </SettingRow>
        <SettingRow label={manualPathTracingTips} className='bold-font-label' role='group' aria-label={manualPathTracingTips} >
          <Switch checked={manualPathTracing} onChange={handleManualPathTracingChange}
            aria-label={manualPathTracingTips} />
        </SettingRow>
      </div>
    </React.Fragment>
  )
})
