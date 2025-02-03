/** @jsx jsx */
import { Immutable, type ImmutableArray, React, jsx } from 'jimu-core'
import { Select, Switch, Tooltip, defaultMessages as jimuUIDefaultMessages } from 'jimu-ui'
import { type SettingChangeFunction, type AllWidgetSettingProps } from 'jimu-for-builder'
import { type AttributeSets, type LrsLayer, SearchMethod, LrsLayerType, isDefined, isConflictPreventionEnabled, formatMessage } from 'widgets/shared-code/lrs'
import { type IMConfig, OperationType, type DefaultInfo } from '../config'
import defaultMessages from './translations/default'
import { SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components'
import { LrsLayerList } from './layer-list'

export type ValueManSetByKeyType = [string, any, { [optionKey: string]: any }?] // represents: [key, value, options]

export interface WidgetSettingState {
  showLayerPanel: boolean
  noLrsLayers: boolean
  noLrsEvents: boolean
  dsToRemove: string
}

let runningQuery
export default class Setting extends React.PureComponent<
AllWidgetSettingProps<IMConfig>,
WidgetSettingState
> {
  constructor (props) {
    super(props)
    this.state = {
      showLayerPanel: false,
      noLrsLayers: false,
      noLrsEvents: false,
      dsToRemove: null
    }
  }

  componentDidMount (): void {
    runningQuery = false
  }

  updateWidgetJson: SettingChangeFunction = (...args) => {
    const [changedWidgetJson, ...restArgs] = args
    const widgetJson = Object.assign({
      id: this.props.id,
      ...changedWidgetJson
    })
    this.props.onSettingChange(widgetJson, ...restArgs)
  }

  updateConfigForOptions = async (...setByKeyPairs: ValueManSetByKeyType[]) => {
    let allDataSources = null
    // Update in datasources.
    let config = setByKeyPairs.reduce((config, [key, value, options]) => {
      if (key === 'lrsLayers' && options?.dsUpdateRequired) {
        allDataSources = this.getAllDataSources(value)
      }
      return config.set(key, value)
    }, this.props.config)

    const networks = []
    const events = []
    const lineEvents = []
    const intersections = []

    config.lrsLayers.forEach((layer) => {
      if (layer.layerType === LrsLayerType.network) {
        networks.push(layer.name)
      } else if (layer.layerType === LrsLayerType.event) {
        events.push(layer.name)
        if (!layer.eventInfo.isPointEvent) {
          lineEvents.push(layer.name)
        }
      } else if (layer.layerType === LrsLayerType.intersection) {
        intersections.push(layer.name)
      }
    })

    config = config.setIn(['networkLayers'], networks)
    config = config.setIn(['eventLayers'], events)
    config = config.setIn(['lineEventLayers'], lineEvents)
    config = config.setIn(['intersectionLayers'], intersections)

    if (config.lrsLayers.length === 0) {
      const newDefault: DefaultInfo = {
        index: -1,
        name: ''
      }
      config = config.setIn(['defaultEvent'], newDefault)
      config = config.setIn(['defaultNetwork'], newDefault)
    }

    if (networks.length > 0) {
      const network = config.lrsLayers.find(layer => layer.layerType === LrsLayerType.network)
      if (isDefined(network)) {
        const conflictPreventionEnabled = await isConflictPreventionEnabled(network.lrsUrl)
        config = config.setIn(['conflictPreventionEnabled'], conflictPreventionEnabled)
      }
    }

    // Save updated config/datasourse to widget json.
    if (allDataSources) {
      this.updateWidgetJson({
        config,
        useDataSources: Object.values(allDataSources.useDataSourceMap)
      })
    } else {
      this.updateWidgetJson({ config })
    }
  }

  updateLrsList = () => {}

  getAllDataSources = (lrsLayer: LrsLayer[]) => {
    const dsMap = Immutable(lrsLayer)
      .asMutable({ deep: true })
      .reduce(
        (currentDsMap, lrsLayer) => {
          // original datasource.
          const useDs = lrsLayer.useDataSource
          const dsId = useDs.dataSourceId
          currentDsMap.useDataSourceMap[dsId] =
            currentDsMap.useDataSourceMap[dsId] || useDs
          currentDsMap.useDataSourceMap[dsId].fields = useDs.fields

          return currentDsMap
        },
        { useDataSourceMap: {} }
      )
    return dsMap
  }

  addLayers = (layers, dsUpdateRequired = true) => {
    let existingLayers: ImmutableArray<LrsLayer> =
      this.props.config.lrsLayers ?? Immutable([])
    let index = this.props.config.lrsLayers?.length ?? 0

    layers.forEach((item) => {
      existingLayers = Immutable.set(existingLayers, index, item)
      index++
    })

    // Update widget json.
    this.updateConfigForOptions([
      'lrsLayers',
      existingLayers,
      { dsUpdateRequired }
    ])
  }

  updateLayerItem = (
    index: number,
    updatedLayerItems,
    dsUpdateRequired = false
  ) => {
    let layers: ImmutableArray<LrsLayer> =
      this.props.config.lrsLayers ?? Immutable([])
    layers = Immutable.set(layers, index, updatedLayerItems)

    // Update widget json
    this.updateConfigForOptions(['lrsLayers', layers, { dsUpdateRequired }])
  }

  reOrderLayers = (layers) => {
    this.updateConfigForOptions(['lrsLayers', layers])
  }

  removeAllLayers = (dsUpdateRequired = false) => {
    this.setRunningQuery(false)
    const configOptions = { dsUpdateRequired }
    this.updateConfigForOptions(['lrsLayers', [], configOptions])
  }

  removeLayer = (index: number, dsUpdateRequired = false) => {
    const configOptions = { dsUpdateRequired }
    const layers = this.props.config.lrsLayers.asMutable({ deep: true })
    layers.splice(index, 1)

    this.updateConfigForOptions(['lrsLayers', layers, configOptions])
  }

  mapWidgetIdUpdated = (values: string[]) => {
    // Set the map widget id.
    this.props.onSettingChange({
      id: this.props.id,
      useMapWidgetIds: values
    })
    this.removeAllLayers()
  }

  getI18nMessage = (id: string, values?: { [key: string]: any }) => {
    // Function for handling I18n
    const messages = Object.assign({}, defaultMessages, jimuUIDefaultMessages)
    return this.props.intl.formatMessage(
      { id: id, defaultMessage: messages[id] },
      values
    )
  }

  getDefaultEvent (): string {
    const config = this.props.config
    if (config.defaultEvent.index >= config.lrsLayers.length) {
      return ''
    }
    if (config.defaultEvent && config.defaultEvent.index >= 0) {
      const index = config.defaultEvent.index
      const name = config.defaultEvent.name
      if (name === config.lrsLayers[index].name) {
        return name
      } else {
        this.handleDefaultEventChanged(config.lrsLayers[index].name)
        return config.lrsLayers[index].name
      }
    } else {
      const firstLineLayer = this.props.config.lrsLayers.find(
        (layer) =>
          layer.layerType === LrsLayerType.event &&
          !layer.eventInfo.isPointEvent
      )
      this.handleDefaultEventChanged(firstLineLayer.name)
      return firstLineLayer.name
    }
  }

  getDefaultNetworkConfig (): string {
    const config = this.props.config
    if (config.defaultNetwork.index >= config.lrsLayers.length) {
      return ''
    }
    if (config.defaultNetwork && config.defaultNetwork.index !== -1) {
      const index = config.defaultNetwork.index
      const name = config.defaultNetwork.name
      if (name === config.lrsLayers[index].name) {
        return name
      } else {
        this.handleDefaultNetworkChanged(config.lrsLayers[index].name)
        return config.lrsLayers[index].name
      }
    } else {
      const firstNetworkLayer = this.props.config.lrsLayers.find(layer => layer.layerType === LrsLayerType.network)
      this.handleDefaultNetworkChanged(firstNetworkLayer.name)
      return firstNetworkLayer.name
    }
  }

  updateAttributeSets = (attributeSets: AttributeSets) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('attributeSets', attributeSets)
    })
  }

  handleDefaultEventChanged = (value: string) => {
    let index = -1
    if (value.length > 0 && this.props.config.lrsLayers.length > 0) {
      index = this.props.config.lrsLayers.findIndex(
        (layer) => layer.name === value
      )
    }

    const newDefault: DefaultInfo = {
      index: index,
      name: index >= 0 ? this.props.config.lrsLayers[index].name : ''
    }
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('defaultEvent', newDefault)
    })
  }

  handleDefaultNetworkChanged = (value: string) => {
    let index = -1
    if (value.length > 0 && this.props.config.lrsLayers.length > 0) {
      index = this.props.config.lrsLayers.findIndex(
        (layer) => layer.name === value
      )
    }

    const newDefault: DefaultInfo = {
      index: index,
      name: this.props.config.lrsLayers[index].name
    }
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('defaultNetwork', newDefault)
    })
  }

  getDefaultFromMethod (): SearchMethod {
    if (this.props.config.defaultFromMethod) {
      return this.props.config.defaultFromMethod
    } else {
      this.handleDefaultFromMethodChanged(this.props.config.defaultFromMethod)
      return this.props.config.defaultFromMethod
    }
  }

  handleDefaultFromMethodChanged = (value: SearchMethod) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('defaultFromMethod', value)
    })
  }

  getDefaultToMethod (): SearchMethod {
    if (this.props.config.defaultToMethod) {
      return this.props.config.defaultToMethod
    } else {
      this.handleDefaultToMethodChanged(this.props.config.defaultToMethod)
      return this.props.config.defaultToMethod
    }
  }

  handleDefaultToMethodChanged = (value: SearchMethod) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('defaultToMethod', value)
    })
  }

  getDefaultType (): OperationType {
    if (this.props.config.defaultType) {
      return this.props.config.defaultType
    } else {
      this.handleDefaultTypeChanged(this.props.config.defaultType)
      return this.props.config.defaultType
    }
  }

  handleDefaultTypeChanged = (value: string) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('defaultType', value)
    })
  }

  getDefaultAttributeSet (): string {
    if (this.props.config.defaultAttributeSet) {
      return this.props.config.defaultAttributeSet
    } else {
      this.handleDefaultAttributeSetChanged(this.props.config.attributeSets.attributeSet[0].title)
      return this.props.config.attributeSets.attributeSet[0].title
    }
  }

  handleDefaultAttributeSetChanged = (value: string) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('defaultAttributeSet', value)
    })
  }

  getHideMethodConfig (): boolean {
    return this.props.config.hideMethod
  }

  handleHideMethodChange = (e: any, checked: boolean) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('hideMethod', checked)
    })
  }

  getHideEventConfig (): boolean {
    return this.props.config.hideEvent
  }

  handleHideEventChange = (e: any, checked: boolean) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('hideEvent', checked)
    })
  }

  getHideNetworkConfig (): boolean {
    return this.props.config.hideNetwork
  }

  handleHideNetworkChange = (e: any, checked: boolean) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('hideNetwork', checked)
    })
  }

  getHideTypeConfig (): boolean {
    return this.props.config.hideType
  }

  handleHideTypeChange = (e: any, checked: boolean) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('hideType', checked)
    })
  }

  getHideAttributeSetConfig (): boolean {
    return this.props.config.hideAttributeSet
  }

  handleHideAttributeSetChange = (e: any, checked: boolean) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('hideAttributeSet', checked)
    })
  }

  getHideMeasuresConfig (): boolean {
    return this.props.config.hideMeasures
  }

  handleHideMeasuresChange = (e: any, checked: boolean) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('hideMeasures', checked)
    })
  }

  getHideDatesConfig (): boolean {
    return this.props.config.hideDates
  }

  handleHideDatesChange = (e: any, checked: boolean) => {
    if (!checked) {
      // If the hideDates is unchecked, then the useRouteStartEndDate should be unchecked as well.
      if (this.props.config.useRouteStartEndDate) {
        this.props.onSettingChange({
          id: this.props.id,
          config: this.props.config.set('useRouteStartEndDate', false)
        })
      }
    }

    // Let the previous update to finish before updating hideDates.
    setTimeout(() => {
      this.props.onSettingChange({
        id: this.props.id,
        config: this.props.config.set('hideDates', checked)
      })
    }, 200)
  }

  getUseRouteStartEndDatesConfig (): boolean {
    return this.props.config.useRouteStartEndDate
  }

  handleUseRouteStartEndDatesChange = (e: any, checked: boolean) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('useRouteStartEndDate', checked)
    })
  }

  setRunningQuery = (val) => {
    runningQuery = val
  }

  render () {
    const { config } = this.props
    return (
      <div className="setting-add-line-event h-100">
        <div className="jimu-widget-setting setting-add-line-event__setting-content h-100">
          <LrsLayerList
            runningQuery={runningQuery}
            setRunningQuery={this.setRunningQuery}
            intl={this.props.intl}
            widgetId={this.props.id}
            layers={this.props.config.lrsLayers}
            mapWidgetIds={this.props.useMapWidgetIds}
            portalUrl={this.props.portalUrl}
            theme={this.props.theme}
            onLayersAdded={this.addLayers}
            onLayerChanged={this.updateLayerItem}
            onClearAll={this.removeAllLayers}
            onLayerRemoved={this.removeLayer}
            onLayerOrderChanged={this.reOrderLayers}
            onMapWidgetedChanged={this.mapWidgetIdUpdated}
            onAttributeSetsChanged={this.updateAttributeSets}
          />

          {config.eventLayers && config.eventLayers.length !== 0 && (
            <div>
              <SettingSection
                role="group"
                title={this.getI18nMessage('defaultSettings')}
                aria-label={this.getI18nMessage('defaultSettings')}
              >
                <SettingRow
                  flow="wrap"
                  label={this.getI18nMessage('defaultEventSingle')}
                >
                  <Select
                    aria-label={this.getI18nMessage('defaultEventSingle')}
                    className="w-100"
                    size="sm"
                    value={this.getDefaultEvent()}
                    onChange={(e) => {
                      this.handleDefaultEventChanged(e.target.value)
                    }}
                  >
                    {config.lineEventLayers.map((element, i) => {
                      return (
                        <option key={i} value={element}>
                          {element}
                        </option>
                      )
                    })}
                  </Select>
                </SettingRow>
                <SettingRow flow='wrap' label={this.getI18nMessage('defaultNetworkMultiple')}>
                  <Select
                    aria-label={this.getI18nMessage('defaultNetworkMultiple')}
                    className='w-100'
                    size='sm'
                    value={this.getDefaultNetworkConfig()}
                    onChange={(e) => { this.handleDefaultNetworkChanged(e.target.value) }}
                  >
                    {config.networkLayers.map((element, i) => {
                      return (
                        <option key={i} value={element}>{element}</option>
                      )
                    })}
                  </Select>
                </SettingRow>
                <SettingRow
                  flow="wrap"
                  label={this.getI18nMessage('defaultFromMethod')}
                >
                  <Select
                    aria-label={this.getI18nMessage('defaultFromMethod')}
                    className="w-100"
                    size="sm"
                    value={this.getDefaultFromMethod()}
                    onChange={(e) => {
                      this.handleDefaultFromMethodChanged(e.target.value)
                    }}
                  >
                    {
                      <option value={SearchMethod.Measure}>
                        {this.getI18nMessage('methodMeasure')}
                      </option>
                    }
                    {/* {
                      <option value={SearchMethod.Coordinate}>
                        {this.getI18nMessage('methodCoordinate')}
                      </option>
                    }
                    {
                      <option value={SearchMethod.LocationOffset}>
                        {this.getI18nMessage('methodLocationOffset')}
                      </option>
                    } */}
                  </Select>
                </SettingRow>
                <SettingRow
                  flow="wrap"
                  label={this.getI18nMessage('defaultToMethod')}
                >
                  <Select
                    aria-label={this.getI18nMessage('defaultToMethod')}
                    className="w-100"
                    size="sm"
                    value={this.getDefaultToMethod()}
                    onChange={(e) => {
                      this.handleDefaultToMethodChanged(e.target.value)
                    }}
                  >
                    {
                      <option value={SearchMethod.Measure}>
                        {this.getI18nMessage('methodMeasure')}
                      </option>
                    }
                    {/* {
                      <option value={SearchMethod.Coordinate}>
                        {this.getI18nMessage('methodCoordinate')}
                      </option>
                    }
                    {
                      <option value={SearchMethod.LocationOffset}>
                        {this.getI18nMessage('methodLocationOffset')}
                      </option>
                    } */}
                  </Select>
                </SettingRow>
                <SettingRow flow="wrap" label={this.getI18nMessage('defaultType')}>
                  <Select
                    aria-label={this.getI18nMessage('defaultType')}
                    className='w-100'
                    size='sm'
                    value={this.getDefaultType()}
                    onChange={(e) => { this.handleDefaultTypeChanged(e.target.value) }}>
                      {<option value={OperationType.single}>{this.getI18nMessage('operationTypeSingle')}</option>}
                      {<option value={OperationType.multiple}>{this.getI18nMessage('operationTypeMultiple')}</option>}
                  </Select>
                </SettingRow>
                {isDefined(config.attributeSets) && isDefined(config.attributeSets.attributeSet) && (
                  <SettingRow flow="wrap" label={this.getI18nMessage('defaultAttributeSet')}>
                    <Select
                      aria-label={this.getI18nMessage('defaultAttributeSet')}
                      className='w-100'
                      size='sm'
                      value={this.getDefaultAttributeSet()}
                      onChange={(e) => { this.handleDefaultAttributeSetChanged(e.target.value) }}>
                        {config.attributeSets.attributeSet.map((element, index) => {
                          return (
                            <options key={index} value={element.title}>{element.title}</options>
                          )
                        })}
                    </Select>
                  </SettingRow>
                )}
              </SettingSection>
              <SettingSection
                role="group"
                title={formatMessage(this.props.intl, 'displaySettings')}
                aria-label={formatMessage(this.props.intl, 'displaySettings')}
              >
                <SettingRow label={formatMessage(this.props.intl, 'hideType')}>
                  <Switch
                    aria-label={formatMessage(this.props.intl, 'hideType')}
                    checked={this.getHideTypeConfig()}
                    onChange={this.handleHideTypeChange}
                  />
                </SettingRow>
                <SettingRow label={formatMessage(this.props.intl, 'hideEvent')}>
                  <Switch
                    aria-label={formatMessage(this.props.intl, 'hideEvent')}
                    checked={this.getHideEventConfig()}
                    onChange={this.handleHideEventChange}
                  />
                </SettingRow>
                <SettingRow label={formatMessage(this.props.intl, 'hideNetwork')}>
                  <Switch
                    aria-label={formatMessage(this.props.intl, 'hideNetwork')}
                    checked={this.getHideNetworkConfig()}
                    onChange={this.handleHideNetworkChange}
                  />
                </SettingRow>
                <SettingRow label={formatMessage(this.props.intl, 'hideMethod')}>
                  <Switch
                    aria-label={formatMessage(this.props.intl, 'hideMethod')}
                    checked={this.getHideMethodConfig()}
                    onChange={this.handleHideMethodChange}
                  />
                </SettingRow>
                <SettingRow label={formatMessage(this.props.intl, 'hideAttributeSet')}>
                  <Switch
                    aria-label={formatMessage(this.props.intl, 'hideAttributeSet')}
                    checked={this.getHideAttributeSetConfig()}
                    onChange={this.handleHideAttributeSetChange}
                  />
                </SettingRow>
                <SettingRow label={formatMessage(this.props.intl, 'hideMeasures')}>
                  <Tooltip title={this.getI18nMessage('hideMeasureTooltip')}>
                    <Switch
                      aria-label={formatMessage(this.props.intl, 'hideMeasures')}
                      checked={this.getHideMeasuresConfig()}
                      onChange={this.handleHideMeasuresChange}
                    />
                  </Tooltip>
                </SettingRow>
                <div style={{ display: 'none' }}>
                  <SettingRow label={formatMessage(this.props.intl, 'hideDates')}>
                    <Switch
                      aria-label={formatMessage(this.props.intl, 'hideDates')}
                      checked={this.getHideDatesConfig()}
                      onChange={this.handleHideDatesChange}
                    />
                  </SettingRow>
                  {config.hideDates && (
                    <SettingRow label={formatMessage(this.props.intl, 'useRoutesStartEndDates')}>
                      <Tooltip title={formatMessage(this.props.intl, 'useRoutesStartEndDatesTooltip')}>
                        <Switch
                          aria-label={formatMessage(this.props.intl, 'useRoutesStartEndDates')}
                          checked={this.getUseRouteStartEndDatesConfig()}
                          onChange={this.handleUseRouteStartEndDatesChange}
                        />
                      </Tooltip>
                    </SettingRow>
                  )}
                </div>
              </SettingSection>
            </div>
          )}
        </div>
      </div>
    )
  }
}
