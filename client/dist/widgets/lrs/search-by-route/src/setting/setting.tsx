/** @jsx jsx */
import {
  React,
  Immutable,
  jsx,
  DataSourceManager,
  type FeatureLayerDataSource,
  type ImmutableArray,
  type DataSourceJson,
  type FieldSchema,
  JimuFieldType,
  type DataSourceSchema
} from 'jimu-core'
import { defaultMessages as jimuUIDefaultMessages, NumericInput, Select, Switch } from 'jimu-ui'
import { SettingSection, SettingRow, getOutputJsonOriginDs } from 'jimu-ui/advanced/setting-components'
import { type AllWidgetSettingProps, type SettingChangeFunction, getAppConfigAction } from 'jimu-for-builder'
import { type IMConfig, type Style, type NetworkItem, type ResultConfig } from '../config'
import defaultMessages from './translations/default'
import { ColorPicker } from 'jimu-ui/basic/color-picker'
import { NetworkItemList } from './componenets/network-item-list'
import { DataSourceRemoveWaringReason, DataSourceRemoveWarningPopup, dataComponentsUtils } from 'jimu-ui/advanced/data-source-selector'
import { measureFields, distanceField, stationField, networkObjectIdField, toRouteField, derivedFields } from '../constants'
import { GetEsriUnits, messages, isDefined, highlightColor, colorBlack, formatMessage } from 'widgets/shared-code/lrs'
import { Fragment } from 'react'

export type ValueManSetByKeyType = [string, any, { [optionKey: string]: any }?] // represents: [key, value, options]

export interface WidgetSettingState {
  showLayerPanel: boolean
  noLrsLayers: boolean
  showRemoveNetworkItemWarning: boolean
  indexOfNetworkItemToRemove: number
  dsToRemove: string
}
let runningQuery
export default class Setting extends React.PureComponent<AllWidgetSettingProps<IMConfig>, WidgetSettingState> {
  constructor (props) {
    super(props)
    this.state = {
      showLayerPanel: false,
      noLrsLayers: false,
      showRemoveNetworkItemWarning: false,
      indexOfNetworkItemToRemove: -1,
      dsToRemove: null
    }
  }

  componentDidMount (): void {
    runningQuery = false
  }

  getUnits (): string[] {
    return [this.getI18nMessage('inches'),
      this.getI18nMessage('points'),
      this.getI18nMessage('feet'),
      this.getI18nMessage('yards'),
      this.getI18nMessage('miles'),
      this.getI18nMessage('nauticalMiles'),
      this.getI18nMessage('millimeters'),
      this.getI18nMessage('centimeters'),
      this.getI18nMessage('meters'),
      this.getI18nMessage('kilometers'),
      this.getI18nMessage('decimalDegrees'),
      this.getI18nMessage('decimeters'),
      this.getI18nMessage('intFeet')]
  }

  getUnit (unit?: string) {
    const units = this.getUnits()
    if (unit) {
      return GetEsriUnits(units[unit], this.props.intl)
    }

    return GetEsriUnits(units[0], this.props.intl)
  }

  updateWidgetJson: SettingChangeFunction = (...args) => {
    const [changedWidgetJson, ...restArgs] = args
    const widgetJson = Object.assign({ id: this.props.id, ...changedWidgetJson })
    this.props.onSettingChange(widgetJson, ...restArgs)
  }

  updateConfigForOptions = (...setByKeyPairs: ValueManSetByKeyType[]) => {
    let allDataSources = null
    // Update in/out datasources.
    const config = setByKeyPairs.reduce((config, [key, value, options]) => {
      if (key === 'networkItems' && options?.dsUpdateRequired) {
        allDataSources = this.getAllDataSources(value)
      }
      return config.set(key, value)
    }, this.props.config)
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

  tryRemoveNetworkItem = (index: number) => {
    // Check if data source is being used with ontoher widget.
    const networkItems = this.props.config.networkItems
    const currentNetworkItem = networkItems[index]
    const appConfig = getAppConfigAction().appConfig
    const relatedWidgets = dataComponentsUtils.getWidgetsUsingDsOrItsDescendantDss(
      currentNetworkItem.outputLineDsId,
      appConfig.widgets
    )

    if (relatedWidgets.length === 0) {
      // Not used anywhere else, remove.
      this.doRemoveNetworkItem(index, true)
    } else {
      // Provide message if they still want to remove it.
      this.setState({
        showRemoveNetworkItemWarning: true,
        indexOfNetworkItemToRemove: index,
        dsToRemove: currentNetworkItem.outputLineDsId
      })
    }
  }

  beforeRemovingDataSource = () => {
    this.doRemoveNetworkItem(this.state.indexOfNetworkItemToRemove)
  }

  doRemoveNetworkItem = (index: number, dsUpdateRequired = false) => {
    // Remove network and update widget json.
    const configOptions = { dsUpdateRequired }
    const networkItems = this.props.config.networkItems.asMutable({ deep: true })
    networkItems.splice(index, 1)

    this.updateConfigForOptions(['networkItems', networkItems, configOptions])
  }

  afterRemovingDataSource = () => {
    // Reset after showing message.
    this.setState({
      showRemoveNetworkItemWarning: false,
      indexOfNetworkItemToRemove: -1,
      dsToRemove: null
    })
  }

  addNetworkItems = (networkItems, dsUpdateRequired = true) => {
    // Insert new networks at the end of the network list.
    let existingNetworks: ImmutableArray<NetworkItem> = this.props.config.networkItems ?? Immutable([])
    let index = this.props.config.networkItems?.length ?? 0

    networkItems.forEach(item => {
      existingNetworks = Immutable.set(existingNetworks, index, item)
      index++
    })

    // Update widget json.
    this.updateConfigForOptions(['networkItems', existingNetworks, { dsUpdateRequired }])
  }

  updateNetworkItem = (index: number, updatedNetworkItems, dsUpdateRequired = false) => {
    // Get existing or new network items.
    let networkItems: ImmutableArray<NetworkItem> = this.props.config.networkItems ?? Immutable([])
    networkItems = Immutable.set(networkItems, index, updatedNetworkItems)

    // Update widget json
    this.updateConfigForOptions(['networkItems', networkItems, { dsUpdateRequired }])
  }

  reOrderNetworkItems = (networkItems) => {
    this.updateConfigForOptions(['networkItems', networkItems])
  }

  getAllDataSources = (networkItems: NetworkItem[]) => {
    const dsMap = Immutable(networkItems)
      .asMutable({ deep: true })
      .reduce(
        (currentDsMap, networkItem) => {
          // original datasource.
          const useDs = networkItem.useDataSource
          const dsId = useDs.dataSourceId
          currentDsMap.useDataSourceMap[dsId] = currentDsMap.useDataSourceMap[dsId] || useDs
          currentDsMap.useDataSourceMap[dsId].fields = useDs.fields

          if (!networkItem.referent) {
          // Configure output datasources. One for point and line geometries.
            const originDs = DataSourceManager.getInstance().getDataSource(networkItem.useDataSource?.dataSourceId) as FeatureLayerDataSource
            if (originDs) {
              const originDataSourceJson = getOutputJsonOriginDs(originDs)?.getDataSourceJson()
              const pointDataSourceJson = this.getInitOutDataSource(this.props.widgetId, originDataSourceJson, networkItem, true)
              const lineDataSourceJson = this.getInitOutDataSource(this.props.widgetId, originDataSourceJson, networkItem, false)
              currentDsMap.outputDataSources.push(pointDataSourceJson)
              currentDsMap.outputDataSources.push(lineDataSourceJson)
            }
          }
          return currentDsMap
        },
        { useDataSourceMap: {}, outputDataSources: [] }
      )
    return dsMap
  }

  getInitOutDataSource = (widgetIt: string, originDataSourceJson: any, networkItem: NetworkItem, isPoint: boolean) => {
    const dsLabel = isPoint
      ? this.getI18nMessage('outputDsLabelPoint', { label: `${networkItem.name}` })
      : this.getI18nMessage('outputDsLabelLine', { label: `${networkItem.name}` })
    const dsId = isPoint ? networkItem.outputPointDsId : networkItem.outputLineDsId
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

  getInitSchema = (label: string = '', networkItem: NetworkItem) => {
    const fields = {}
    const featureDS = DataSourceManager.getInstance().getDataSource(networkItem.useDataSource.dataSourceId) as FeatureLayerDataSource
    const originSchema = featureDS?.getSchema().fields.asMutable({ deep: true })
    const networkFields: FieldSchema[] = []

    // Use network default fields.
    Object.keys(originSchema).forEach((value) => {
      networkFields.push(originSchema[value])
    })

    // Include measure fields.
    measureFields.forEach((field) => {
      networkFields.push({
        alias: field.value,
        type: JimuFieldType.Number,
        jimuName: field.value,
        name: field.value
      })
    })

    networkFields.push({
      alias: distanceField.value,
      type: JimuFieldType.String,
      jimuName: distanceField.value,
      name: distanceField.value
    })

    stationField.forEach((field) => {
      networkFields.push({
        alias: field.value,
        type: JimuFieldType.String,
        jimuName: field.value,
        name: field.value
      })
    })

    derivedFields.forEach((field) => {
      networkFields.push({
        alias: field.value,
        type: JimuFieldType.String,
        jimuName: field.value,
        name: field.value
      })
    })

    networkFields.push({
      alias: toRouteField.at(0).value,
      type: JimuFieldType.String,
      jimuName: toRouteField.at(0).value,
      name: toRouteField.at(0).value
    })

    networkFields.push({
      alias: toRouteField.at(1).value,
      type: JimuFieldType.String,
      jimuName: toRouteField.at(1).value,
      name: toRouteField.at(1).value
    })

    networkFields.push({
      alias: toRouteField.at(2).value,
      type: JimuFieldType.String,
      jimuName: toRouteField.at(2).value,
      name: toRouteField.at(2).value
    })

    networkFields.push({
      alias: toRouteField.at(3).value,
      type: JimuFieldType.Date,
      jimuName: toRouteField.at(3).value,
      name: toRouteField.at(3).value
    })

    networkFields.push({
      alias: toRouteField.at(4).value,
      type: JimuFieldType.Date,
      jimuName: toRouteField.at(4).value,
      name: toRouteField.at(4).value
    })

    networkFields.push({
      alias: networkObjectIdField.value,
      type: JimuFieldType.String,
      jimuName: networkObjectIdField.value,
      name: networkObjectIdField.value
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

  hideRemovePopup = () => {
    this.setState({ showRemoveNetworkItemWarning: false })
  }

  getI18nMessage = (id: string, values?: { [key: string]: any }) => {
    // Function for handling I18n
    const messagesArray = Object.assign({}, defaultMessages, jimuUIDefaultMessages, messages)
    return this.props.intl.formatMessage(
      { id: id, defaultMessage: messagesArray[id] }, values
    )
  }

  handleHighlishStyleChange = (prop: string | number) => {
    // Updates either highlight color or highlight width.
    const newStyle = this.props.config.highlightStyle.asMutable({ deep: true })
    if (typeof prop === 'string') {
      newStyle.color = prop
    }
    if (typeof prop === 'number') {
      newStyle.size = prop
    }
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('highlightStyle', newStyle)
    })
  }

  getHighlightStyleConfig (): Style {
    // Returns the current highlight configuration.
    if (this.props.config.highlightStyle) {
      return this.props.config.highlightStyle
    } else {
      const defaultHighlightStyle = this.getDefaultHighlightStyleConfig()
      this.props.onSettingChange({
        id: this.props.id,
        config: this.props.config.set('highlightStyle', defaultHighlightStyle)
      })
      return defaultHighlightStyle
    }
  }

  getDefaultHighlightStyleConfig (): Style {
    // defaults to cyan
    return {
      color: highlightColor,
      size: 3
    }
  }

  handleLabelStyleChange = (prop: string | number) => {
    const newStyle = this.props.config.labelStyle.asMutable({ deep: true })
    if (typeof prop === 'string') {
      newStyle.color = prop
    }
    if (typeof prop === 'number') {
      newStyle.size = prop
    }
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('labelStyle', newStyle)
    })
  }

  getLabelStyleConfig (): Style {
    // Returns the current label configuration.
    if (this.props.config.labelStyle) {
      return this.props.config.labelStyle
    } else {
      const defaultLabelStyle = this.getDefaultLabelStyleConfig()
      this.props.onSettingChange({
        id: this.props.id,
        config: this.props.config.set('labelStyle', defaultLabelStyle)
      })
      return defaultLabelStyle
    }
  }

  getDefaultLabelStyleConfig (): Style {
    return {
      color: colorBlack,
      size: 12
    }
  }

  getResultConfig (): ResultConfig {
    // Gets config for results page.
    if (this.props.config.resultConfig) {
      return this.props.config.resultConfig
    } else {
      const defaultResults = this.getDefaultResultsConfig()
      this.props.onSettingChange({
        id: this.props.id,
        config: this.props.config.set('resultConfig', defaultResults)
      })
      return defaultResults
    }
  }

  getDefaultResultsConfig (): ResultConfig {
    // default result settings.
    return {
      pageSize: 25
    }
  }

  handleDefaultOffsetUnitChange = (event) => {
    const offsetUnit = event?.target?.value
    const newResults = this.props.config.resultConfig.asMutable({ deep: true })
    newResults.defaultOffsetUnit = offsetUnit
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('resultConfig', newResults)
    })
  }

  getDefaultOffsetUnitsConfig (): string {
    let newResultConfig = this.props.config.resultConfig.asMutable({ deep: true })
    if (!isDefined(newResultConfig)) {
      newResultConfig = this.getDefaultResultsConfig()
    }
    if (!isDefined(newResultConfig.defaultOffsetUnit) || newResultConfig.defaultOffsetUnit === '') {
      newResultConfig.defaultOffsetUnit = this.getUnit()
      if (!isDefined(newResultConfig.defaultReferentLayer)) {
        newResultConfig.defaultReferentLayer = Immutable(this.props.config.networkItems.find((item) => item.referent))
      }
      this.props.onSettingChange({
        id: this.props.id,
        config: this.props.config.set('resultConfig', newResultConfig)
      })
      return newResultConfig.defaultOffsetUnit
    }
    return newResultConfig.defaultOffsetUnit
  }

  handleDefaultReferentChange = (event) => {
    const referentItemLayerId = event?.target?.value
    const referentItem = this.props.config.networkItems.find((item) => item.layerId === referentItemLayerId)
    const newResults = this.props.config.resultConfig.asMutable({ deep: true })
    newResults.defaultReferentLayer = Immutable(referentItem)
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('resultConfig', newResults)
    })
  }

  getDefaultReferentConfig (): string {
    const config = this.props.config
    let newResultConfig = this.props.config.resultConfig.asMutable({ deep: true })
    if (!isDefined(newResultConfig)) {
      newResultConfig = this.getDefaultResultsConfig()
    }
    if (newResultConfig && isDefined(newResultConfig.defaultReferentLayer) &&
        config.networkItems.findIndex(item => item.layerId === newResultConfig.defaultReferentLayer.layerId) > -1) {
      return newResultConfig.defaultReferentLayer.layerId
    } else {
      newResultConfig.defaultReferentLayer = Immutable(this.props.config.networkItems.find((item) => item.referent))
      if (newResultConfig.defaultOffsetUnit === '') {
        newResultConfig.defaultOffsetUnit = this.getUnit()
      }
      // If a layer was removed, let the config finish updating before setting the default referent.
      setTimeout(() => {
        this.props.onSettingChange({
          id: this.props.id,
          config: this.props.config.set('resultConfig', newResultConfig)
        })
      }, 200)
      return newResultConfig.defaultReferentLayer.layerId
    }
  }

  handlePageSizeChange = (value: number) => {
    // Updates the page size for search results.
    const newResults = this.props.config.resultConfig.asMutable({ deep: true })
    newResults.pageSize = value
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('resultConfig', newResults)
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

  getHideNetworkConfig (): boolean {
    return this.props.config.hideNetwork
  }

  handleHideNetworkChange = (e: any, checked: boolean) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('hideNetwork', checked)
    })
  }

  getHideRouteSearchByLineConfig (): boolean {
    return this.props.config.hideRoute
  }

  handleHideRouteSearchByLine = (e: any, checked: boolean) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('hideRoute', checked)
    })
  }

  getDefaultNetworkConfig (): string {
    const config = this.props.config
    if (this.props.config.defaultNetwork && config.defaultNetwork !== '' &&
        this.props.config.networkItems.findIndex(item => item.name === config.defaultNetwork) > -1) {
      return this.props.config.defaultNetwork
    } else if (this.props.config.networkItems.filter(item => !item.referent).length > 0) {
      const firstNetworkLayer = this.props.config.networkItems.find((item) => !item.referent).name

      // If the default network was removed, let the config finish updating before setting the default network.
      setTimeout(() => {
        this.props.onSettingChange({
          id: this.props.id,
          config: this.props.config.set('defaultNetwork', firstNetworkLayer)
        })
      }, 200)
      return firstNetworkLayer
    }
  }

  handleDefaultNetworkChange = (value: string) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('defaultNetwork', value)
    })
  }

  removeAllLayers = (dsUpdateRequired: boolean = false) => {
    this.setRunningQuery(false)
    const configOptions = { dsUpdateRequired }
    this.updateConfigForOptions(['networkItems', [], configOptions])
  }

  mapWidgetIdUpdated = (values: string[]) => {
    // Set the map widget id.
    this.props.onSettingChange({
      id: this.props.id,
      useMapWidgetIds: values
    })
    this.removeAllLayers()
  }

  networkSupportsLine = (networkName: string) => {
    const { config } = this.props
    if (!config.networkItems || config.networkItems.length === 0) return
    const networkInfo = config.networkItems.find((item) => item.name === networkName)
    return networkInfo?.supportsLines
  }

  setRunningQuery = (val) => {
    runningQuery = val
  }

  render () {
    const { config } = this.props
    const supportsLines = this.networkSupportsLine(this.getDefaultNetworkConfig())
    return (
      <div className='setting-search-by-route h-100'>
        <div className="jimu-widget-setting setting-search-by-route__setting-content h-100">
          <NetworkItemList
            runningQuery={runningQuery}
            setRunningQuery={this.setRunningQuery}
            intl={this.props.intl}
            widgetId={this.props.id}
            networkItems={this.props.config.networkItems}
            mapWidgetIds={this.props.useMapWidgetIds}
            portalUrl={this.props.portalUrl}
            theme={this.props.theme}
            onNewNetworkItemsAdded={this.addNetworkItems}
            onNetworkItemChanged={this.updateNetworkItem}
            onClearAll={this.removeAllLayers}
            onNetworkItemRemoved={this.tryRemoveNetworkItem}
            onNetworkOrderChanged={this.reOrderNetworkItems}
            onMapWidgetChanged={this.mapWidgetIdUpdated}
          />

          {config.networkItems.length !== 0 && (
            <div>
              <SettingSection
                role="group"
                title={this.getI18nMessage('selectionSettings')}
                aria-label={this.getI18nMessage('selectionSettings')}
              >
                <SettingRow label={this.getI18nMessage('selectionHighlight')}>
                  <ColorPicker
                    color={this.props.config.highlightStyle.color ? this.props.config.highlightStyle.color : highlightColor}
                    value={
                      this.getHighlightStyleConfig().color ||
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
                    value={this.getHighlightStyleConfig().size || 3}
                    precision={1}
                    min={0}
                    max={15}
                    step={0.1}
                    onChange={this.handleHighlishStyleChange}
                    aria-label={this.getI18nMessage('graphicWidth')}
                    className="w-100"
                  />
                </SettingRow>
                <SettingRow label={this.getI18nMessage('labelColor')}>
                  <ColorPicker
                    color={this.props.config.labelStyle.color ? this.props.config.labelStyle.color : colorBlack}
                    value={
                      this.getLabelStyleConfig().color ||
                      this.props.theme2.sys.color.surface.paper ||
                      ''
                    }
                    onChange={this.handleLabelStyleChange}
                    aria-label={this.getI18nMessage('labelColor')}
                  />
                </SettingRow>
                <SettingRow flow="wrap" label={this.getI18nMessage('labelSize')}>
                  <NumericInput
                    size="sm"
                    value={this.getLabelStyleConfig().size}
                    precision={1}
                    min={0}
                    max={30}
                    step={0.1}
                    onChange={this.handleLabelStyleChange}
                    aria-label={this.getI18nMessage('labelSize')}
                    className="w-100"
                  />
                </SettingRow>
              </SettingSection>
              <SettingSection
                role="group"
                title={this.getI18nMessage('resultSettings')}
                aria-label={this.getI18nMessage('resultSettings')}
              >
                <SettingRow flow="wrap" label={this.getI18nMessage('resultsPageSize')}>
                  <NumericInput
                    size="sm"
                    value={this.getResultConfig().pageSize}
                    precision={0}
                    min={5}
                    max={500}
                    onChange={this.handlePageSizeChange}
                    aria-label={this.getI18nMessage('resultsPageSize')}
                    className="w-100"
                  />
                </SettingRow>
              </SettingSection>
              <SettingSection
                role="group"
                title={formatMessage(this.props.intl, 'displaySettings')}
                aria-label={formatMessage(this.props.intl, 'displaySettings')}
              >
                <SettingRow label={formatMessage(this.props.intl, 'hideMethod')}>
                  <Switch
                    aria-label={formatMessage(this.props.intl, 'hideMethod')}
                    checked={this.getHideMethodConfig()}
                    onChange={this.handleHideMethodChange}
                  />
                </SettingRow>
                <SettingRow label={formatMessage(this.props.intl, 'hideNetwork')}>
                  <Switch
                    aria-label={formatMessage(this.props.intl, 'hideNetwork')}
                    checked={this.getHideNetworkConfig()}
                    onChange={this.handleHideNetworkChange}
                  />
                </SettingRow>
                {supportsLines && (
                  <SettingRow label={formatMessage(this.props.intl, 'hideRoute')}>
                    <Switch
                      aria-label={formatMessage(this.props.intl, 'hideRoute')}
                      checked={this.getHideRouteSearchByLineConfig()}
                      onChange={this.handleHideRouteSearchByLine}
                    />
                  </SettingRow>)}
                <SettingRow flow='wrap' label={this.getI18nMessage('defaultNetwork')}>
                  <Select
                    aria-label={this.getI18nMessage('defaultNetwork')}
                    className='w-100'
                    size='sm'
                    value={this.getDefaultNetworkConfig()}
                    disabled={config.networkItems.length === 1}
                    onChange={(e) => { this.handleDefaultNetworkChange(e.target.value) }}
                  >
                    {config.networkItems.filter(item => !item.referent).map((element, i) => {
                      return (
                        <option key={i} value={element.name}>{element.name}</option>
                      )
                    })}
                  </Select>
                </SettingRow>
                {this.props.config.networkItems && this.props.config.networkItems.filter(item => item.referent)?.length > 0 && (
                  <Fragment>
                    <SettingRow flow="wrap" label={this.getI18nMessage('defaultReferent')}>
                      <Select
                          aria-label={this.getI18nMessage('defaultReferent')}
                          value={this.getDefaultReferentConfig()}
                          onChange={this.handleDefaultReferentChange}
                        >
                          {this.props.config.networkItems.filter(item => item.referent)?.map((item, i) => {
                            return <option key={i} value={item.layerId}>{item.name}</option>
                          })}
                      </Select>
                  </SettingRow>
                    <SettingRow flow="wrap" label={this.getI18nMessage('defaultOffsetUnit')}>
                      <Select
                          aria-label={this.getI18nMessage('defaultOffsetUnit')}
                          value={this.getDefaultOffsetUnitsConfig()}
                          onChange={this.handleDefaultOffsetUnitChange}
                        >
                        {this.getUnits().map((unit, i) => {
                          return <option key={i} value={GetEsriUnits(unit, this.props.intl)}>{unit}</option>
                        })}
                      </Select>
                    </SettingRow>
                  </Fragment>
                )}
              </SettingSection>
            </div>
          )}
          <DataSourceRemoveWarningPopup
            dataSourceId={this.state.dsToRemove}
            isOpen={this.state.showRemoveNetworkItemWarning}
            toggle={this.hideRemovePopup}
            reason={DataSourceRemoveWaringReason.DataSourceRemoved}
            afterRemove={this.afterRemovingDataSource}
            beforeRemove={this.beforeRemovingDataSource}
          />
        </div>
      </div>
    )
  }
}
