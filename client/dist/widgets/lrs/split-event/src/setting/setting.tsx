/** @jsx jsx */
import {
  Immutable,
  type ImmutableArray,
  React,
  jsx
} from 'jimu-core'
import {
  type LrsLayer,
  LrsLayerType,
  type DefaultInfo,
  isDefined,
  isConflictPreventionEnabled,
  formatMessage
} from 'widgets/shared-code/lrs'
import { Select, Tooltip, defaultMessages as jimuUIDefaultMessages, Switch } from 'jimu-ui'
import { type SettingChangeFunction, type AllWidgetSettingProps } from 'jimu-for-builder'
import { type IMConfig } from '../config'
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
export default class Setting extends React.PureComponent<AllWidgetSettingProps<IMConfig>, WidgetSettingState> {
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
    const widgetJson = Object.assign({ id: this.props.id, ...changedWidgetJson })
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
    const intersections = []

    config.lrsLayers.forEach((layer) => {
      if (layer.layerType === LrsLayerType.network) {
        networks.push(layer.name)
      } else if (layer.layerType === LrsLayerType.event) {
        events.push(layer.name)
      } else if (layer.layerType === LrsLayerType.intersection) {
        intersections.push(layer.name)
      }
    })

    config = config.setIn(['networkLayers'], networks)
    config = config.setIn(['eventLayers'], events)
    config = config.setIn(['intersectionLayers'], intersections)

    if (config.lrsLayers.length === 0) {
      const resetDefaultEvent: DefaultInfo = {
        index: -1,
        name: ''
      }
      config = config.setIn(['defaultEvent'], resetDefaultEvent)
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
      this.updateWidgetJson(
        {
          config,
          useDataSources: Object.values(allDataSources.useDataSourceMap)
        }
      )
    } else {
      this.updateWidgetJson({ config })
    }
  }

  updateLrsList = () => {

  }

  getAllDataSources = (lrsLayer: LrsLayer[]) => {
    const dsMap = Immutable(lrsLayer)
      .asMutable({ deep: true })
      .reduce(
        (currentDsMap, lrsLayer) => {
          // original datasource.
          const useDs = lrsLayer.useDataSource
          const dsId = useDs.dataSourceId
          currentDsMap.useDataSourceMap[dsId] = currentDsMap.useDataSourceMap[dsId] || useDs
          currentDsMap.useDataSourceMap[dsId].fields = useDs.fields

          return currentDsMap
        },
        { useDataSourceMap: {} }
      )
    return dsMap
  }

  addLayers = (layers, dsUpdateRequired = true) => {
    let existingLayers: ImmutableArray<LrsLayer> = this.props.config.lrsLayers ?? Immutable([])
    let index = this.props.config.lrsLayers?.length ?? 0

    layers.forEach(item => {
      existingLayers = Immutable.set(existingLayers, index, item)
      index++
    })

    // Update widget json.
    this.updateConfigForOptions(['lrsLayers', existingLayers, { dsUpdateRequired }])
  }

  updateLayerItem = (index: number, updatedLayerItems, dsUpdateRequired = false) => {
    let layers: ImmutableArray<LrsLayer> = this.props.config.lrsLayers ?? Immutable([])
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
      { id: id, defaultMessage: messages[id] }, values
    )
  }

  getDefaultEvent (): string {
    const config = this.props.config
    if (config.defaultEvent && config.defaultEvent.index !== -1) {
      const index = config.defaultEvent.index
      const name = config.defaultEvent.name
      if (name === config.lrsLayers[index].name) {
        return name
      } else {
        this.handleDefaultEventChanged(config.lrsLayers[index].name)
        return config.lrsLayers[index].name
      }
    } else {
      const firstEventLayer = this.props.config.lrsLayers.find(layer => layer.layerType === LrsLayerType.event)
      this.handleDefaultEventChanged(firstEventLayer.name)
      return firstEventLayer.name
    }
  }

  handleDefaultEventChanged = (value: string) => {
    const index = this.props.config.lrsLayers.findIndex((layer) =>
      layer.name === value
    )
    const newDefault: DefaultInfo = {
      index: index,
      name: this.props.config.lrsLayers[index].name
    }
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('defaultEvent', newDefault)
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

  getHideDateConfig (): boolean {
    return this.props.config.hideDate
  }

  handleHideDateChange = (e: any, checked: boolean) => {
    if (!checked) {
      // If the hideDate is unchecked, then the useRouteStartDate should be unchecked as well.
      if (this.props.config.useRouteStartDate) {
        this.props.onSettingChange({
          id: this.props.id,
          config: this.props.config.set('useRouteStartDate', false)
        })
      }
    }

    // Let the previous update to finish before updating hideDate.
    setTimeout(() => {
      this.props.onSettingChange({
        id: this.props.id,
        config: this.props.config.set('hideDate', checked)
      })
    }, 200)
  }

  getUseRouteStartDatesConfig (): boolean {
    return this.props.config.useRouteStartDate
  }

  handleUseRouteStartDatesChange = (e: any, checked: boolean) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('useRouteStartDate', checked)
    })
  }

  setRunningQuery = (val) => {
    runningQuery = val
  }

  render () {
    const { config } = this.props
    return (
      <div className='setting-split-event h-100'>
        <div className="jimu-widget-setting setting-split-event__setting-content h-100">
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
          />

          {config.eventLayers && config.eventLayers.length !== 0 && (
            <div>
              <SettingSection
                role="group"
                title={this.getI18nMessage('defaultSettings')}
                aria-label={this.getI18nMessage('defaultSettings')}
              >
                <SettingRow flow="wrap" label={this.getI18nMessage('defaultEvent')}>
                  <Select
                    aria-label={this.getI18nMessage('defaultEvent')}
                    className='w-100'
                    size='sm'
                    value={this.getDefaultEvent()}
                    onChange={(e) => { this.handleDefaultEventChanged(e.target.value) }}>
                      {config.eventLayers.map((element, i) => {
                        return (
                          <option key={i} value={element}>{element}</option>
                        )
                      })}
                  </Select>
                </SettingRow>
              </SettingSection>
              <SettingSection role='group' aria-label={formatMessage(this.props.intl, 'displaySettings')} title={formatMessage(this.props.intl, 'displaySettings')}>
                <SettingRow flow="no-wrap" label={formatMessage(this.props.intl, 'hideEvent')}>
                  <Switch
                    aria-label={formatMessage(this.props.intl, 'hideEvent')}
                    checked={this.getHideEventConfig()}
                    onChange={this.handleHideEventChange}
                  />
                </SettingRow>

                <SettingRow flow="no-wrap" label={formatMessage(this.props.intl, 'hideNetwork')}>
                  <Switch
                    aria-label={formatMessage(this.props.intl, 'hideNetwork')}
                    checked={this.getHideNetworkConfig()}
                    onChange={this.handleHideNetworkChange}
                  />
                </SettingRow>
                <div style={{ display: 'none' }}>
                  <SettingRow label="Hide Date">
                    <Switch
                      aria-label="Hide Date"
                      checked={this.getHideDateConfig()}
                      onChange={this.handleHideDateChange}
                    />
                  </SettingRow>
                  {config.hideDate && (
                    <SettingRow label="Use Route Start Date">
                      <Tooltip title="Route start date will be used for new events. If disabled, the current date will be used.">
                        <Switch
                          aria-label="Use Route Start Date"
                          checked={this.getUseRouteStartDatesConfig()}
                          onChange={this.handleUseRouteStartDatesChange}
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
