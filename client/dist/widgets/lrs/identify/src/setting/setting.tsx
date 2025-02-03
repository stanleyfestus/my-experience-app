/** @jsx jsx */
import {
  Immutable,
  type ImmutableArray,
  React,
  DataSourceManager,
  jsx,
  type FeatureLayerDataSource,
  type DataSourceJson,
  type DataSourceSchema,
  type FieldSchema,
  JimuFieldType
} from 'jimu-core'
import { NumericInput, Select, Switch, defaultMessages as jimuUIDefaultMessages } from 'jimu-ui'
import { type SettingChangeFunction, type AllWidgetSettingProps } from 'jimu-for-builder'
import { type LrsLayer, type IMConfig, LrsLayerType, type DefaultInfo, type HighlightStyle } from '../config'
import defaultMessages from './translations/default'
import { SettingRow, SettingSection, getOutputJsonOriginDs } from 'jimu-ui/advanced/setting-components'
import { LayerItemList } from './componenets/layer-item-list'
import { ColorPicker } from 'jimu-ui/basic/color-picker'
import { highlightColor, measureFields } from '../constants'
import {
  isDefined
} from 'widgets/shared-code/lrs'
export type ValueManSetByKeyType = [string, any, { [optionKey: string]: any }?] // represents: [key, value, options]

export interface WidgetSettingState {
  showLayerPanel: boolean
  dsToRemove: string
  defaultNetworkLayer?: number
}

let runningQuery

export default class Setting extends React.PureComponent<AllWidgetSettingProps<IMConfig>, WidgetSettingState> {
  constructor (props) {
    super(props)
    this.state = {
      showLayerPanel: false,
      dsToRemove: null,
      defaultNetworkLayer: null
    }
  }

  componentDidMount = () => {
    runningQuery = false
    const lrsLayers = this.props.config.lrsLayers
    const networkLayers = this.getNetworkLayers(lrsLayers)
    this.setState({
      defaultNetworkLayer: this.getDefaultNetwork(networkLayers)
    })
  }

  componentDidUpdate (prevProps: Readonly<AllWidgetSettingProps<IMConfig>>, prevState: Readonly<WidgetSettingState>, snapshot?: any): void {
    if (!this.state.defaultNetworkLayer) {
      const lrsLayers = this.props.config.lrsLayers
      const networkLayers = this.getNetworkLayers(lrsLayers)
      this.setState({
        defaultNetworkLayer: this.getDefaultNetwork(networkLayers)
      })
    }
  }

  getInitSchema = (label: string = '', networkItem) => {
    const fields = {}
    const featureDS = DataSourceManager.getInstance().getDataSource(networkItem.useDataSource.dataSourceId) as FeatureLayerDataSource
    const originSchema = featureDS?.getSchema().fields.asMutable({ deep: true })
    const networkFields: FieldSchema[] = []

    // Use network default fields.
    Object.keys(originSchema).forEach((value) => {
      networkFields.push(originSchema[value])
    })

    // Include measure field
    networkFields.push({
      alias: measureFields[0].value,
      type: JimuFieldType.Number,
      jimuName: measureFields[0].value,
      name: measureFields[0].value
    })

    // Gather each schema field.
    networkFields?.forEach((fieldSchema) => {
      fields[fieldSchema?.jimuName] = fieldSchema
    })

    // return schema object.
    return {
      label,
      idField: 'OBJECTID',
      fields: fields
    } as DataSourceSchema
  }

  getInitOutDataSource = (widgetIt: string, originDataSourceJson: any, networkItem, isPoint: boolean) => {
    const dsLabel = this.getI18nMessage('outputDsLabelPoint', { label: `${networkItem.name}` })
    const dsId = networkItem?.networkInfo?.outputPointDsId
    const schema = this.getInitSchema(dsLabel, networkItem)

    // Using defaults from original except schema and geometry type. We will add fields to
    // the schema to include in the output results
    const outputDsJson: DataSourceJson = {
      id: dsId,
      type: originDataSourceJson?.type,
      label: dsLabel,
      originDataSources: [networkItem.useDataSource],
      url: originDataSourceJson?.url,
      itemId: originDataSourceJson?.itemId,
      portalUrl: originDataSourceJson?.portalUrl,
      layerId: originDataSourceJson?.layerId,
      layers: originDataSourceJson?.layers,
      isOutputFromWidget: true,
      isDataInDataSourceInstance: true,
      schema,
      geometryType: isPoint ? 'esriGeometryPoint' : 'esriGeometryPolyline'
    }
    return outputDsJson
  }

  getDefaultNetwork = (networkLayers, idExists?: boolean) => {
    let layer = networkLayers[0]?.serviceId
    if (this.props.config.defaultNetworkLayer && idExists) layer = this.props.config.defaultNetworkLayer
    setTimeout(() => {
      this.props.onSettingChange({
        id: this.props.id,
        config: this.props.config.set('defaultNetworkLayer', layer)
      })
    }, 2000)
    return layer
  }

  updateWidgetJson: SettingChangeFunction = (...args) => {
    const [changedWidgetJson, ...restArgs] = args
    const widgetJson = Object.assign({ id: this.props.id, ...changedWidgetJson })
    this.props.onSettingChange(widgetJson, ...restArgs)
  }

  updateConfigForOptions = (...setByKeyPairs: ValueManSetByKeyType[]) => {
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

    config.lrsLayers.forEach((layer) => {
      if (layer.layerType === LrsLayerType.network) {
        networks.push(layer.name)
      } else if (layer.layerType === LrsLayerType.event) {
        events.push(layer.name)
      }
    })

    config = config.setIn(['networkLayers'], networks)
    config = config.setIn(['eventLayers'], events)

    if (config.lrsLayers.length === 0) {
      const resetDefaultEvent: DefaultInfo = {
        index: -1,
        name: ''
      }
      config = config.setIn(['defaultEvent'], resetDefaultEvent)
    }

    // Save updated config/datasourse to widget json.
    if (allDataSources) {
      this.updateWidgetJson(
        {
          config,
          useDataSources: Object.values(allDataSources.useDataSourceMap)
        },
        allDataSources.outputDataSources
      )
    } else {
      this.updateWidgetJson({ config })
    }
  }

  updateAttributeSets = (attributeSets) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('attributeSets', attributeSets)
    })
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

          if (lrsLayer?.layerType?.toLocaleLowerCase() === 'network') {
            // Configure point output datasources for network layers
            const originDs = DataSourceManager.getInstance().getDataSource(lrsLayer.useDataSource?.dataSourceId) as FeatureLayerDataSource
            if (originDs) {
              const originDataSourceJson = getOutputJsonOriginDs(originDs)?.getDataSourceJson()
              const pointDataSourceJson = this.getInitOutDataSource(this.props.widgetId, originDataSourceJson, lrsLayer, true)
              currentDsMap.outputDataSources.push(pointDataSourceJson)
            }
          }

          return currentDsMap
        },
        { useDataSourceMap: {}, outputDataSources: [] }
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
    const match = layers.find(layer => layer?.serviceId === this.state.defaultNetworkLayer)
    let defNet = null
    const networkLayers = this.getNetworkLayers(layers)
    if (!match) defNet = this.getDefaultNetwork(networkLayers, false)
    else defNet = this.getDefaultNetwork(networkLayers)

    if (!match) {
      this.setState({
        defaultNetworkLayer: defNet
      })
    }
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

  getHighlightStyleConfig (): HighlightStyle {
    // Returns the current highlight configuration.
    if (this.props.config.highlightStyle) {
      return this.props.config.highlightStyle
    } else {
      const defaultHighlightStyle = this.getDefaultStyleConfig()
      this.props.onSettingChange({
        id: this.props.id,
        config: this.props.config.set('highlightStyle', defaultHighlightStyle)
      })
      return defaultHighlightStyle
    }
  }

  getDefaultStyleConfig (): HighlightStyle {
    // defaults to cyan
    return {
      routeColor: highlightColor,
      width: 3
    }
  }

  handleHighlishStyleChange = (prop: string | number) => {
    // Updates either highlight color or highlight width.
    const newStyle = this.props.config.highlightStyle.asMutable({ deep: true })
    if (typeof prop === 'string') {
      newStyle.routeColor = prop
    }
    if (typeof prop === 'number') {
      newStyle.width = prop
    }
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('highlightStyle', newStyle)
    })
  }

  handleLineEventToggleChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('lineEventToggle', checked)
    })
  }

  handlePointEventToggleChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('pointEventToggle', checked)
    })
  }

  handleDefaultAttributeSetChanged = (value: string) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('defaultAttributeSet', value)
    })
  }

  handleDefaultNetworkChange = (value: number) => {
    this.setState({
      defaultNetworkLayer: value
    })
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('defaultNetworkLayer', value)
    })
  }

  handleDefaultLineAttributeSetChanged = (value: string) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('defaultLineAttrbuteSet', value)
    })
  }

  handleDefaultPointAttributeSetChanged = (value: string) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('defaultPointAttributeSet', value)
    })
  }

  getDefaultLineAttributeSet = () => {
    if (this.props.config.defaultLineAttrbuteSet) {
      return this.props.config.defaultLineAttrbuteSet
    } else {
      const lineAttributeSets = this.getLineAttributeSet()
      this.handleDefaultLineAttributeSetChanged(lineAttributeSets?.[0].title)
      return lineAttributeSets?.[0].title
    }
  }

  getDefaultPointAttributeSet = () => {
    if (this.props.config.defaultPointAttributeSet) {
      return this.props.config.defaultPointAttributeSet
    } else {
      const pointAttributeSets = this.getPointAttributeSet()
      this.handleDefaultPointAttributeSetChanged(pointAttributeSets?.[0].title)
      return pointAttributeSets?.[0].title
    }
  }

  getNetworkLayers = (lrsLayers) => {
    const networkLayers = []
    lrsLayers.forEach((layer) => {
      if (layer?.networkInfo && layer?.networkInfo?.networkUrl) {
        networkLayers.push(layer)
      }
    })
    return networkLayers
  }

  getLineAttributeSet = () => {
    //@ts-expect-error
    const attributeSets = this.props.config.attributeSets.attributeSet
    const lineAttributeSet = []
    attributeSets?.forEach((set) => {
      if (!set.isPoint) lineAttributeSet.push(set)
    })
    return lineAttributeSet
  }

  getPointAttributeSet = () => {
    //@ts-expect-error
    const attributeSets = this.props.config.attributeSets.attributeSet
    const pointAttributeSet = []
    attributeSets?.forEach((set) => {
      if (set.isPoint) pointAttributeSet.push(set)
    })
    return pointAttributeSet
  }

  setRunningQuery = (val) => {
    runningQuery = val
  }

  render () {
    const { config } = this.props
    const lrsLayers = this.props.config.lrsLayers
    const networkLayers = this.getNetworkLayers(lrsLayers)
    const lineAttrSet = this.getLineAttributeSet()
    const pointAttrSet = this.getPointAttributeSet()

    return (
      <div className='setting-add-point-event h-100'>
        <div className="jimu-widget-setting setting-add-point-event__setting-content h-100">
          <LayerItemList
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
            updateAttributeSets={this.updateAttributeSets}
          />
          {networkLayers?.length > 0 && (
            <SettingSection
              role="group"
              title={this.getI18nMessage('defaultNetwork')}
              aria-label={this.getI18nMessage('defaultNetwork')}
            >
              <Select
                defaultValue={this.state.defaultNetworkLayer}
                value={this.state.defaultNetworkLayer }
                onChange={(e) => { this.handleDefaultNetworkChange(e.target.value) }}
                aria-label={this.getI18nMessage('defaultNetwork')}>
                  {networkLayers?.map((item) => {
                    return <option value={item.serviceId}>{item.name}</option>
                  })}
              </Select>
          </SettingSection>
          )}
          {(config?.lrsLayers?.length > 0) && (
            <div>
              <SettingSection
                role="group"
                title={this.getI18nMessage('selectionSettings')}
                aria-label={this.getI18nMessage('selectionSettings')}
              >
                <SettingRow label={this.getI18nMessage('selectionHighlight')}>
                  <ColorPicker
                    color={this.props.config?.highlightStyle?.routeColor ? this.props.config.highlightStyle.routeColor : highlightColor}
                    value={
                      this.getHighlightStyleConfig().routeColor ||
                      this.props.theme2.sys.color.surface.paper ||
                      ''
                    }
                    onChange={this.handleHighlishStyleChange}
                    aria-label={this.getI18nMessage('selectionHighlight')}
                  />
                </SettingRow>
                <SettingRow flow="wrap" label={this.getI18nMessage('graphicWidth')}>
                  <NumericInput
                    size="sm"
                    value={this.getHighlightStyleConfig().width || 3}
                    precision={1}
                    min={0}
                    max={15}
                    step={0.1}
                    onChange={this.handleHighlishStyleChange}
                    aria-label={this.getI18nMessage('graphicWidth')}
                    className="w-100"
                  />
                </SettingRow>
              </SettingSection>
              {config?.eventLayers && (config?.eventLayers?.length > 0) && (
                <SettingSection>
                  <SettingRow flow="no-wrap" label={this.getI18nMessage('lineAttributeToggle')}>
                    <Switch
                      aria-label={this.getI18nMessage('lineAttributeToggle')}
                      checked={this.props.config.lineEventToggle}
                      onChange={this.handleLineEventToggleChange}
                      />
                  </SettingRow>
                  {this.props.config.lineEventToggle && isDefined(lineAttrSet) && (
                    <SettingRow flow="wrap" label={this.getI18nMessage('lineAttributeSet')}>
                      <Select
                        aria-label={this.getI18nMessage('lineAttributeSet')}
                        size='sm'
                        value={this.getDefaultLineAttributeSet()}
                        onChange={(e) => { this.handleDefaultLineAttributeSetChanged(e.target.value) }}
                      >
                        {lineAttrSet?.map((element, index) => {
                          return (
                            <option key={index} value={element.title}>{element.title}</option>
                          )
                        })}
                      </Select>
                    </SettingRow>
                  )}
                  <SettingRow flow="no-wrap" label={this.getI18nMessage('pointAttributeToggle')}>
                    <Switch
                      aria-label={this.getI18nMessage('pointAttributeToggle')}
                      checked={this.props.config.pointEventToggle}
                      onChange={this.handlePointEventToggleChange}
                      />
                  </SettingRow>
                  {this.props.config.pointEventToggle && isDefined(pointAttrSet) && (
                    <SettingRow flow="wrap" label={this.getI18nMessage('pointAttributeSet')}>
                      <Select
                        aria-label={this.getI18nMessage('pointAttributeSet')}
                        size='sm'
                        value={this.getDefaultPointAttributeSet()}
                        onChange={(e) => { this.handleDefaultPointAttributeSetChanged(e.target.value) }}
                      >
                        {pointAttrSet?.map((element, index) => {
                          return (
                            <option key={index} value={element.title}>{element.title}</option>
                          )
                        })}
                      </Select>
                    </SettingRow>
                  )}
                </SettingSection>
              )}
        </div>)}
      </div>
      </div>
    )
  }
}
