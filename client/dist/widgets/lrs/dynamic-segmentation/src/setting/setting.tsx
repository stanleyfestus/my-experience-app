/** @jsx jsx */
import {
  type DataSourceJson,
  type DataSourceSchema,
  DataSourceTypes,
  Immutable,
  type ImmutableArray,
  React,
  jsx
} from 'jimu-core'
import { NumericInput, Select, Switch, defaultMessages as jimuUIDefaultMessages } from 'jimu-ui'
import { type SettingChangeFunction, type AllWidgetSettingProps } from 'jimu-for-builder'
import { AttributeInputType, DisplayType, type IMConfig } from '../config'
import defaultMessages from './translations/default'
import { ObjectIdSchema, SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components'
import { LrsLayerList } from './layer-list'
import { type LrsLayer, LrsLayerType, type AttributeSets, isDefined, isConflictPreventionEnabled, highlightColor } from 'widgets/shared-code/lrs'
import { ColorPicker } from 'jimu-ui/basic/color-picker'
import { type GeometryType } from '@esri/arcgis-rest-request'

export type ValueManSetByKeyType = [string, any, { [optionKey: string]: any }?] // represents: [key, value, options]

let runningQuery
export default class Setting extends React.PureComponent<AllWidgetSettingProps<IMConfig>> {
  constructor (props) {
    super(props)
    this.state = { }
  }

  componentDidMount (): void {
    runningQuery = false
  }

  //#region widget config
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

    // Check if conflict prevention is enabled.
    const network = config.lrsLayers.find(layer => layer.layerType === LrsLayerType.network)
    if (isDefined(network)) {
      const conflictPreventionEnabled = await isConflictPreventionEnabled(network.lrsUrl)
      config = config.setIn(['conflictPreventionEnabled'], conflictPreventionEnabled)
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

  getAllDataSources = (lrsLayer: LrsLayer[]) => {
    const dsMap = Immutable(lrsLayer)
      .asMutable({ deep: true })
      .reduce(
        (currentDsMap, lrsLayer) => {
          // original data source.
          const useDs = lrsLayer.useDataSource
          const dsId = useDs.dataSourceId
          currentDsMap.useDataSourceMap[dsId] = currentDsMap.useDataSourceMap[dsId] || useDs
          currentDsMap.useDataSourceMap[dsId].fields = useDs.fields

          const pointOutId = this.props.id + '_point_output'
          const lineOutId = this.props.id + '_line_output'
          const pointLabel = this.getI18nMessage('pointOutputLabel')
          const lineLabel = this.getI18nMessage('lineOutputLabel')

          // Bare bones output data sources. When creating outputs via data actions, we will populate the
          // schema from the original data source. This way, the widget only needs 2 output data sources
          // rather than 1 for each event.
          if (currentDsMap.outputDataSources.length === 0) {
            const pointOutputDataSource = this.createInitOutputDataSource(pointOutId, pointLabel, 'esriGeometryPoint')
            const lineOutputDataSource = this.createInitOutputDataSource(lineOutId, lineLabel, 'esriGeometryPolyline')
            currentDsMap.outputDataSources.push(pointOutputDataSource)
            currentDsMap.outputDataSources.push(lineOutputDataSource)
          }

          return currentDsMap
        },
        { useDataSourceMap: {}, outputDataSources: [] }
      )
    return dsMap
  }

  createInitOutputDataSource = (id: string, label: string, geometryType: GeometryType) => {
    const schema = this.getInitSchema(label)
    const layerId = id + '__layer'
    const outputDsJson: DataSourceJson = {
      id,
      type: DataSourceTypes.FeatureLayer,
      label,
      originDataSources: [],
      isOutputFromWidget: true,
      isDataInDataSourceInstance: false,
      schema,
      geometryType,
      layerId
    }

    return outputDsJson
  }

  getInitSchema = (label: string = ''): DataSourceSchema => {
    return {
      label,
      idField: ObjectIdSchema.jimuName,
      fields: {
        [ObjectIdSchema.jimuName]: ObjectIdSchema
      }
    } as DataSourceSchema
  }
  //#endregion

  //#region Layer functions
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
  //#endregion

  //#region settings getters and setters
  setDisplayType = (value: DisplayType) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('defaultDisplayType', value)
    })
  }

  getDisplayType (): DisplayType {
    return this.props.config.defaultDisplayType
  }

  setAttributeInputType = (value: AttributeInputType) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('attributeInputType', value)
    })
  }

  getAttributeInputType (): AttributeInputType {
    return this.props.config.attributeInputType
  }

  updateAttributeSets = (attributeSets: AttributeSets) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('attributeSets', attributeSets)
    })
  }

  setDefaultAttributeSet = (value: string, isPoint: boolean) => {
    if (isPoint) {
      this.props.onSettingChange({
        id: this.props.id,
        config: this.props.config.set('defaultPointAttributeSet', value)
      })
    } else {
      this.props.onSettingChange({
        id: this.props.id,
        config: this.props.config.set('defaultLineAttributeSet', value)
      })
    }
  }

  getDefaultAttributeSet (isPoint: boolean): string {
    if (isPoint) {
      if (this.props.config.defaultPointAttributeSet) {
        return this.props.config.defaultPointAttributeSet
      } else if (this.props.config.attributeSets?.attributeSet?.length > 0) {
        const firstPointAttributeSet = this.props.config.attributeSets?.attributeSet?.find((element) => element.isPoint)
        this.setDefaultAttributeSet(firstPointAttributeSet.title, true)
        return firstPointAttributeSet?.title
      } else {
        return ''
      }
    } else {
      if (this.props.config.defaultLineAttributeSet) {
        return this.props.config.defaultLineAttributeSet
      } else if (this.props.config.attributeSets?.attributeSet?.length > 0) {
        const firstLineAttributeSet = this.props.config.attributeSets?.attributeSet?.find((element) => !element.isPoint)
        this.setDefaultAttributeSet(firstLineAttributeSet.title, false)
        return firstLineAttributeSet?.title
      } else {
        return ''
      }
    }
  }

  setTableHighlight = (value: string) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('tableHighlightColor', value)
    })
  }

  setAllowMerge = (e) => {
    const value = e.target.checked
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('allowMerge', value)
    })
  }

  getTableHighlightColor (): string {
    // Returns the current highlight configuration.
    if (this.props.config.tableHighlightColor) {
      return this.props.config.tableHighlightColor
    } else {
      const defaultHighlightStyle = highlightColor
      this.props.onSettingChange({
        id: this.props.id,
        config: this.props.config.set('tableHighlightColor', defaultHighlightStyle)
      })
      return defaultHighlightStyle
    }
  }

  setMapHighlightColor = (value: string) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('mapHighlightColor', value)
    })
  }

  getMapHighlightColor (): string {
    // Returns the current highlight configuration.
    if (this.props.config.mapHighlightColor) {
      return this.props.config.mapHighlightColor
    } else {
      const defaultHighlightStyle = highlightColor
      this.props.onSettingChange({
        id: this.props.id,
        config: this.props.config.set('mapHighlightColor', defaultHighlightStyle)
      })
      return defaultHighlightStyle
    }
  }

  setDefaultScale = (value: number) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('defaultDiagramScale', value)
    })
  }

  getDefaultScale (): number {
    if (this.props.config.defaultDiagramScale) {
      return this.props.config.defaultDiagramScale
    } else {
      const networkUnits = this.props.config.lrsLayers.find(layer => layer.layerType === LrsLayerType.network)?.networkInfo?.unitsOfMeasure
      const defaultScale = this.getNetworkDefaultScale(networkUnits)
      this.props.onSettingChange({
        id: this.props.id,
        config: this.props.config.set('defaultDiagramScale', defaultScale)
      })
      return defaultScale
    }
  }

  getShowStatistics (): boolean {
    if (this.props.config.showEventStatistics) {
      return this.props.config.showEventStatistics
    } else {
      this.setShowStatistics(false)
      return false
    }
  }

  setShowStatistics = (value: boolean) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('showEventStatistics', value)
    })
  }

  //#endregion

  //#region Utility functions
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

  getNetworkDefaultScale = (defaultUnit: string): number => {
    // Returns roughly 3 miles in the networks units of measure.
    // Does not need to be exact.
    switch (defaultUnit) {
      case 'esriInches': { return 190080 }
      case 'esriFeet': { return 15840 }
      case 'esriYards': { return 5280 }
      case 'esriMiles': { return 3 }
      case 'esriNauticalMiles': { return 2.60 }
      case 'esriMillimeters': { return 4828000 }
      case 'esriCentimeters': { return 482800 }
      case 'esriDecimeters': { return 48280 }
      case 'esriMeters': { return 4828 }
      case 'esriKilometers': { return 4.828 }
      case 'esriDecimalDegrees': { return 3 }
      case 'esriIntFeet': { return 15840 }
      default: { return 3 }
    }
  }
  //#endregion

  setRunningQuery = (val) => {
    runningQuery = val
  }

  render () {
    const { config } = this.props
    const lineAttributes = this.props.config.attributeSets?.attributeSet?.filter((element) => !element.isPoint)
    const pointAttributes = this.props.config.attributeSets?.attributeSet?.filter((element) => element.isPoint)

    return (
      <div className='setting-dyn-seg h-100'>
        <div className="jimu-widget-setting setting-dyn-seg__setting-content h-100">
          <LrsLayerList
            runningQuery={runningQuery}
            setRunningQuery={this.setRunningQuery}
            intl={this.props.intl}
            widgetId={this.props.id}
            layers={this.props.config.lrsLayers}
            mapWidgetIds={this.props.useMapWidgetIds}
            portalUrl={this.props.portalUrl}
            attributeSets={this.props.config.attributeSets}
            lineAttributeSet={this.getDefaultAttributeSet(false)}
            pointAttributeSet={this.getDefaultAttributeSet(true)}
            theme={this.props.theme}
            onLayersAdded={this.addLayers}
            onClearAll={this.removeAllLayers}
            onLayerRemoved={this.removeLayer}
            onLayerChanged={this.updateLayerItem}
            onLayerOrderChanged={this.reOrderLayers}
            onMapWidgetedChanged={this.mapWidgetIdUpdated}
            onAttributeSetsChanged={this.updateAttributeSets}
          />

          {config.lrsLayers && config.lrsLayers.length !== 0 && (
            <SettingSection
              role="group"
              title={this.getI18nMessage('defaultSettings')}
              aria-label={this.getI18nMessage('defaultSettings')}
            >
              <SettingRow flow="wrap" label={this.getI18nMessage('defaultDynSegResult')}>
                <Select
                  aria-label={this.getI18nMessage('defaultDynSegResult')}
                  className='w-100'
                  size='sm'
                  value={this.getDisplayType()}
                  onChange={(e) => { this.setDisplayType(e.target.value) }}>
                    <options value={DisplayType.Table}>{this.getI18nMessage('tableLabel')}</options>
                    <options value={DisplayType.Diagram}>{this.getI18nMessage('diagramLabel')}</options>
                </Select>
              </SettingRow>

              <SettingRow flow="wrap" label={this.getI18nMessage('defaultAttributeSetType')}>
                <Select
                  aria-label={this.getI18nMessage('defaultAttributeSetType')}
                  className='w-100'
                  size='sm'
                  value={this.getAttributeInputType()}
                  onChange={(e) => { this.setAttributeInputType(e.target.value) }}>
                    <options value={AttributeInputType.LineOnly}>{this.getI18nMessage('lineOnlyLabel')}</options>
                    <options value={AttributeInputType.LineAndPoint}>{this.getI18nMessage('lineAndPointLabel')}</options>
                </Select>
              </SettingRow>

              {isDefined(lineAttributes) && lineAttributes.length > 0 && (
                <SettingRow flow="wrap" label={this.getI18nMessage('lineAttributeSet')}>
                  <Select
                    aria-label={this.getI18nMessage('lineAttributeSet')}
                    className='w-100'
                    size='sm'
                    value={this.getDefaultAttributeSet(false)}
                    onChange={(e) => { this.setDefaultAttributeSet(e.target.value, false) }}>
                      {lineAttributes.map((element, index) => {
                        return (
                          <options key={index} value={element.title}>{element.title}</options>
                        )
                      })}
                  </Select>
                </SettingRow>
              )}
              {config.attributeInputType === AttributeInputType.LineAndPoint &&
               isDefined(pointAttributes) && pointAttributes.length > 0 && (
                <SettingRow flow="wrap" label={this.getI18nMessage('pointAttributeSet')}>
                  <Select
                    aria-label={this.getI18nMessage('pointAttributeSet')}
                    className='w-100'
                    size='sm'
                    value={this.getDefaultAttributeSet(true)}
                    onChange={(e) => { this.setDefaultAttributeSet(e.target.value, true) }}>
                      {pointAttributes.map((element, index) => {
                        return (
                          <options key={index} value={element.title}>{element.title}</options>
                        )
                      })}
                  </Select>
                </SettingRow>
              )}
              {isDefined(lineAttributes) && lineAttributes.length > 0 && (
                <SettingRow label={this.getI18nMessage('mergeEvents')}>
                  <Switch checked={this.props.config.allowMerge}
                    onChange={this.setAllowMerge}
                    title={this.getI18nMessage('mergeEvents')} aria-label={this.getI18nMessage('mergeEvents')} />
                </SettingRow>
              )}
              <SettingRow label={this.getI18nMessage('tableHighlightColor')}>
                <ColorPicker
                  color={this.props.config.tableHighlightColor ? this.props.config.tableHighlightColor : highlightColor}
                  value={
                    this.getTableHighlightColor() ||
                    this.props.theme2.sys.color.surface.paper ||
                    ''
                  }
                  onChange={this.setTableHighlight}
                  aria-label={this.getI18nMessage('tableHighlightColor')}
                />
              </SettingRow>

              <SettingRow label={this.getI18nMessage('mapHighlightColor')}>
                <ColorPicker
                  color={this.props.config.mapHighlightColor ? this.props.config.mapHighlightColor : highlightColor}
                  value={
                    this.getMapHighlightColor() ||
                    this.props.theme2.sys.color.surface.paper ||
                    ''
                  }
                  onChange={this.setMapHighlightColor}
                  aria-label={this.getI18nMessage('mapHighlightColor')}
                />
              </SettingRow>

              <SettingRow flow="wrap" label={this.getI18nMessage('diagramScale')}>
                <NumericInput
                  className='w-100'
                  value={this.getDefaultScale()}
                  onChange={this.setDefaultScale}
                  aria-label={this.getI18nMessage('diagramScale')}
                />
              </SettingRow>
              <SettingRow flow="no-wrap" label={this.getI18nMessage('showStatistics')}>
                <Switch
                  aria-label={this.getI18nMessage('showStatistics')}
                  checked={this.getShowStatistics()}
                  onChange={(e) => { this.setShowStatistics(e.target.checked) }}
                />
              </SettingRow>
            </SettingSection>
          )}
        </div>
      </div>
    )
  }
}
