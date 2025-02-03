/** @jsx jsx */
import { React, jsx, type ImmutableObject, hooks } from 'jimu-core'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { Switch, Select } from 'jimu-ui'
import { type NetworkItem } from '../../config'
import defaultMessages from '../translations/default'
import { SearchMethod } from 'widgets/shared-code/lrs'

interface Props {
  widgetId: string
  networkItem?: ImmutableObject<NetworkItem>
  onPropertyChanged: (prop: string, value: any, dsUpdateRequired?: boolean) => void
  onPropertiesChanged: (prop: string[], value: any[], dsUpdateRequired?: boolean) => void
}

export function NetworkItemMethod (props: Props) {
  const { networkItem, onPropertyChanged, onPropertiesChanged } = props
  const getI18nMessage = hooks.useTranslation(defaultMessages)
  const currentNetwork = Object.assign({}, {}, networkItem)

  const handleSwitchChange = (e, name: string) => {
    if (!e.target) return
    if (checkIfMethodNeedsUpdate(name)) {
      // Need to update 2 properties, the default method and
      // the method that was disabled.
      const props: string[] = []
      const values: SearchMethod[] = []
      // update swtich value
      props.push(name)
      values.push(e.target.checked)
      // update default value
      props.push('defaultMethod')
      values.push(getNewActiveMethod(name))
      onPropertiesChanged(props, values, true)
    } else {
      // Only the disabled method needs updating.
      onPropertyChanged(name, e.target.checked, true)
    }
  }

  const checkIfMethodNeedsUpdate = (name: string): boolean => {
    // Checks if the disabled method was also the selected default method.
    let needsUpdate: boolean = false
    switch (name) {
      case 'useMeasure': {
        needsUpdate = currentNetwork.defaultMethod === SearchMethod.Measure
        break
      }
      case 'useCoordinate': {
        needsUpdate = currentNetwork.defaultMethod === SearchMethod.Coordinate
        break
      }
      case 'useReferent': {
        needsUpdate = currentNetwork.defaultMethod === SearchMethod.Referent
        break
      }
      case 'useLineAndMeasure': {
        needsUpdate = currentNetwork.defaultMethod === SearchMethod.LineAndMeasure
        break
      }
    }
    return needsUpdate
  }

  const getNewActiveMethod = (currentChange: string): SearchMethod => {
    // Returns the first available method if the selected method was disabled.
    if (currentChange !== 'useMeasure' && currentNetwork.useMeasure && currentNetwork.defaultMethod !== SearchMethod.Measure) {
      return SearchMethod.Measure
    } else if (currentChange !== 'useCoordinate' && currentNetwork.useCoordinate && currentNetwork.defaultMethod !== SearchMethod.Coordinate) {
      return SearchMethod.Coordinate
    } else if (currentChange !== 'useLineAndMeasure' && currentNetwork.useLineAndMeasure &&
                currentNetwork.defaultMethod !== SearchMethod.LineAndMeasure) {
      return SearchMethod.LineAndMeasure
    } else {
      return SearchMethod.Referent
    }
  }

  const GetActiveMethods = (): number => {
    // Returns how many methods are enabled.
    let count = 0
    if (currentNetwork.useMeasure) { count++ }
    if (currentNetwork.useCoordinate) { count++ }
    if (currentNetwork.useReferent) { count++ }
    if (currentNetwork.useLineAndMeasure) { count++ }
    return count
  }

  return (
    <SettingSection role='group' aria-label={getI18nMessage('searchMethod')} title={getI18nMessage('searchMethod')}>
      <SettingRow flow='wrap' label={getI18nMessage('defaultStr')}>
        <Select
          aria-label={getI18nMessage('defaultStr')}
          className='w-100'
          size='sm'
          value={currentNetwork.defaultMethod}
          disabled={GetActiveMethods() === 1}
          onChange={e => { onPropertyChanged('defaultMethod', e.target.value, true) }}
        >
          {currentNetwork.useMeasure && (
            <option value={SearchMethod.Measure}>{getI18nMessage('measure')}</option>
          )}
          {currentNetwork.useCoordinate && (
            <option value={SearchMethod.Coordinate}>{getI18nMessage('coordinate')}</option>
          )}
          {currentNetwork.useReferent && (
            <option value={SearchMethod.Referent}>{getI18nMessage('referent')}</option>
          )}
          {currentNetwork.useLineAndMeasure && (
            <option value={SearchMethod.LineAndMeasure}>{getI18nMessage('lineAndMeasure')}</option>
          )}
        </Select>
      </SettingRow>
      <SettingRow label={getI18nMessage('measure')}>
        <Switch
          aria-label={getI18nMessage('measure')}
          checked={currentNetwork.useMeasure}
          disabled={GetActiveMethods() === 1 && currentNetwork.useMeasure}
          onChange={(e) => { handleSwitchChange(e, 'useMeasure') }}
        />
      </SettingRow>
      <SettingRow label={getI18nMessage('coordinate')}>
        <Switch
          aria-label={getI18nMessage('coordinate')}
          checked={currentNetwork.useCoordinate}
          disabled={GetActiveMethods() === 1 && currentNetwork.useCoordinate}
          onChange={(e) => { handleSwitchChange(e, 'useCoordinate') }}
        />
      </SettingRow>
      <SettingRow label={getI18nMessage('referent')}>
        <Switch
          aria-label={getI18nMessage('referent')}
          checked={currentNetwork.useReferent}
          disabled={GetActiveMethods() === 1 && currentNetwork.useReferent}
          onChange={(e) => { handleSwitchChange(e, 'useReferent') }}
        />
      </SettingRow>
      {currentNetwork.showLineAndMeasure && (
        <SettingRow label={getI18nMessage('lineAndMeasure')}>
          <Switch
            aria-label={getI18nMessage('lineAndMeasure')}
            checked={currentNetwork.useLineAndMeasure}
            disabled={GetActiveMethods() === 1 && currentNetwork.useLineAndMeasure}
            onChange={(e) => { handleSwitchChange(e, 'useLineAndMeasure') }}
          />
        </SettingRow>
      )}
    </SettingSection>
  )
}
