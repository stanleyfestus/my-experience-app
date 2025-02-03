/** @jsx jsx */
import { React, jsx, type ImmutableArray, hooks, type ImmutableObject, Immutable } from 'jimu-core'
import { Label, Select } from 'jimu-ui'
import { type NetworkItem, type IMConfig } from '../../config'
import defaultMessages from '../translations/default'
import { InlineEditableDropdown, SearchMethod, isDefined } from 'widgets/shared-code/lrs'

export interface SearchMethodProps {
  networkConfig: ImmutableArray<NetworkItem>
  config: IMConfig
  defaultReferent
  onMethodChanged?: (SearchMethod: SearchMethod) => void
  onNetworkChanged?: (selectedNetwork: ImmutableObject<NetworkItem>) => void
  onReferentChanged?: (selectedReferent: any) => void
}

export function SearchMethodForm (props: SearchMethodProps) {
  const getI18nMessage = hooks.useTranslation(defaultMessages)
  const { config, defaultReferent, networkConfig, onMethodChanged, onNetworkChanged, onReferentChanged } = props
  const [selectedNetwork, setSelectedNetwork] = React.useState(networkConfig[0])
  const [selectedPointLayer, setSelectedPointLayer] = React.useState(config?.resultConfig?.defaultReferentLayer)
  const [selectedMethod, setSelectedMethod] = React.useState(selectedNetwork.defaultMethod)
  const [networkNames, setNetworkNames] = React.useState<string[]>([])

  React.useEffect(() => {
    setSelectedPointLayer(defaultReferent)
  }, [defaultReferent])

  React.useEffect(() => {
    for (let i = 0; i < networkConfig.length; i++) {
      const item = networkConfig.find(prop => prop.name === config.defaultNetwork)
      if (isDefined(item) && !item?.referent) {
        setSelectedNetwork(Immutable(item))
        setSelectedMethod(item.defaultMethod)
        break
      }
    }
  }, [config.defaultNetwork, networkConfig])

  const networkChanged = (value: string, type: string) => {
    // Update both method and selected network.
    const index = networkConfig.findIndex(prop => prop.name === value)
    if (type === 'network') {
      setSelectedNetwork(networkConfig[index])
      onNetworkChanged(networkConfig[index])
    } else {
      setSelectedPointLayer(networkConfig[index])
      onReferentChanged(networkConfig[index])
    }
    setSelectedMethod(networkConfig[index].defaultMethod)
    onMethodChanged(networkConfig[index].defaultMethod)
  }

  const methodChanged = (value: string) => {
    let method = SearchMethod.Measure
    if (value === SearchMethod.Coordinate) {
      method = SearchMethod.Coordinate
    } else if (value === SearchMethod.Referent) {
      method = SearchMethod.Referent
    } else if (value === SearchMethod.LineAndMeasure) {
      method = SearchMethod.LineAndMeasure
    }
    setSelectedMethod(method)
    onMethodChanged(method)
  }

  React.useEffect(() => {
    const names = networkConfig.filter(item => !item.referent).map(network => network.name).asMutable()
    setNetworkNames(names)
  }, [networkConfig])

  const activeMethods = React.useMemo(() => {
    let count = 0
    if (selectedNetwork.useMeasure) { count++ }
    if (selectedNetwork.useCoordinate) { count++ }
    if (selectedNetwork.useReferent) { count++ }
    if (selectedNetwork.useLineAndMeasure) { count++ }
    return count
  }, [selectedNetwork])

  const getMethodItems = (): string[] => {
    const methodList: string[] = []
    if (selectedNetwork.useMeasure) { methodList.push(SearchMethod.Measure) }
    if (selectedNetwork.useCoordinate) { methodList.push(SearchMethod.Coordinate) }
    if (selectedNetwork.useReferent) { methodList.push(SearchMethod.Referent) }
    if (selectedNetwork.useLineAndMeasure) { methodList.push(SearchMethod.LineAndMeasure) }
    return methodList
  }

  const getAltMethodDescriptions = (): string[] => {
    const methodList: string[] = []
    if (selectedNetwork.useMeasure) { methodList.push(getI18nMessage('measure')) }
    if (selectedNetwork.useCoordinate) { methodList.push(getI18nMessage('coordinate')) }
    if (selectedNetwork.useReferent) { methodList.push(getI18nMessage('referent')) }
    if (selectedNetwork.useLineAndMeasure) { methodList.push(getI18nMessage('lineAndMeasure')) }
    return methodList
  }

  return (
    <div className='search-method-form'>
      {!config.hideMethod && (
        <InlineEditableDropdown
          label={getI18nMessage('method')}
          isDisabled={activeMethods === 1}
          defaultItem={selectedMethod}
          altItemDescriptions={getAltMethodDescriptions()}
          listItems={getMethodItems()}
          onSelectionChanged={methodChanged}
        />
      )}
        {!config.hideNetwork && (
          <InlineEditableDropdown
            label={getI18nMessage('network')}
            isDisabled={networkConfig.length === 1}
            defaultItem={isDefined(selectedNetwork) ? selectedNetwork.name : ''}
            listItems={networkNames}
            onSelectionChanged={(e) => { networkChanged(e, 'network') }}
          />
        )}
        {selectedMethod === SearchMethod.Referent && (
          <div className="search-method-form__network-label px-3" style={{ paddingTop: '12px' }}>
            <Label size="default" className='mb-1' style={{ width: 100, alignItems: 'center', fontWeight: '500' }} >
              {getI18nMessage('referentRequired')}
            </Label>
            <Select
              aria-label={getI18nMessage('referent')}
              className='w-100'
              size='sm'
              disabled={networkConfig.length === 1}
              value={selectedPointLayer.name}
              onChange={(e) => { networkChanged(e.target.value, 'point') }}
            >
            {
              networkConfig.map((config, index) => {
                const referent = config?.referent
                if (referent) {
                  return (
                    <option key={index} value={config.name}>{config.name}</option>
                  )
                } else {
                  return null
                }
              })
            }
            </Select>
          </div>
        )}
    </div>
  )
}
