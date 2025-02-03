/** @jsx jsx */
import {
  React, jsx, css, Immutable, DataSourceManager, dataSourceUtils, AllDataSourceTypes, TimezoneConfig, ReactRedux, type IMState, classNames,
  type DataSource, type SubtypeGroupLayerDataSource, type MapServiceDataSource
} from 'jimu-core'
import { type AllWidgetSettingProps, getAppConfigAction } from 'jimu-for-builder'
import { SettingSection, SettingRow, SidePopper, MapWidgetSelector } from 'jimu-ui/advanced/setting-components'
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector'
import { type JimuMapView, JimuMapViewComponent, type WebMapDataSource, type FeatureLayerDataSource } from 'jimu-arcgis'
import { Label, Radio, Button, Icon, Tooltip, Switch, defaultMessages as jimuUIMessages, Checkbox, Alert, Select, Option } from 'jimu-ui'

import { type IMConfig, TimeStyle } from '../config'
import defaultMessages from './translations/default'
import { getStyleForWidget } from './style'
import TimePanel from './time-panel'
import { ClickOutlined } from 'jimu-icons/outlined/application/click'
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker'
import { DISPLAY_ACCURACY, getCalculatedTimeSettings, getTimeSettingsFromHonoredWebMap, isSingleLayer } from '../utils/utils'
import TimelineDataSource from './timeline-ds'
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info'

const allDefaultMessages = Object.assign({}, defaultMessages, jimuUIMessages)

interface ExtraProps {
  isTimeZoneData?: boolean
}

interface State {
  isTimePanelOpen: boolean
  activeJimuMapViewId: string
  dataSources: { [dsId: string]: DataSource }
  noSupportedLayersInMapWidget: boolean
}

const SUPPORTED_TYPES = Immutable([
  AllDataSourceTypes.WebMap,
  AllDataSourceTypes.MapService,
  AllDataSourceTypes.FeatureLayer,
  AllDataSourceTypes.ImageryLayer,
  AllDataSourceTypes.ImageryTileLayer,
  AllDataSourceTypes.SubtypeGroupLayer
])

class _Setting extends React.PureComponent<AllWidgetSettingProps<IMConfig> & ExtraProps, State> {
  dsManager: DataSourceManager
  timeSettingsRef: any

  constructor (props) {
    super(props)
    this.dsManager = DataSourceManager.getInstance()
    this.state = {
      isTimePanelOpen: false,
      activeJimuMapViewId: '',
      dataSources: {},
      noSupportedLayersInMapWidget: false
    }
  }

  componentDidUpdate (prevProps: AllWidgetSettingProps<IMConfig>, prevState: State) {
    if (this.props.config.honorTimeSettings !== prevProps.config.honorTimeSettings && this.props.config.honorTimeSettings) {
      this.setState({ isTimePanelOpen: false })
    }
  }

  i18nMessage = (id: string, values?: any) => {
    return this.props.intl.formatMessage({ id: id, defaultMessage: allDefaultMessages[id] }, values)
  }

  updateConfigForOptions = (prop: string, value: any) => {
    const config = {
      id: this.props.id,
      config: this.props.config.set(prop, value)
    }
    this.props.onSettingChange(config)
  }

  dataSourceChange = async ds => {
    let newDs = ds
    let newDsState = this.state.dataSources
    let config = this.props.config.set('timeSettings', null)
    let dsType = config.dataSourceType

    // Remove one selected ds
    if (ds.length < this.props.useDataSources?.length) {
      delete newDsState[this.props.useDataSources[this.props.useDataSources.length - 1].dataSourceId]
      this.setState({
        dataSources: newDsState
      })
      if (newDs.length === 0) { // no ds left now
        config = config.set('honorTimeSettings', true)
      }
    } else { // Add new ds with current type, or another type
      const currentDs = ds[ds.length - 1]
      const currentDsObj = await this.dsManager.createDataSourceByUseDataSource(Immutable(currentDs))
      let honorTimeSettings = currentDsObj.type === AllDataSourceTypes.WebMap ? config.honorTimeSettings : false

      // ds type is changed, or replaced to another webMap
      if (currentDsObj.type !== config.dataSourceType || currentDsObj.type === AllDataSourceTypes.WebMap) {
        newDs = [currentDs]
        dsType = currentDsObj.type as any
        newDsState = {}
        // ds type is changed to webMap from layers.
        if (currentDsObj.type !== config.dataSourceType && currentDsObj.type === AllDataSourceTypes.WebMap) {
          honorTimeSettings = true
        }
      }
      newDsState[currentDs.dataSourceId] = currentDsObj

      this.setState({
        dataSources: newDsState
      })
      config = config.set('honorTimeSettings', honorTimeSettings).set('dataSourceType', dsType)
    }

    this.props.onSettingChange({
      id: this.props.id,
      config: config,
      useDataSources: newDs
    })
  }

  getTimeSettings = () => {
    return getCalculatedTimeSettings(this.props.config.timeSettings, this.state.dataSources)
  }

  setHonorTimeSettings = () => {
    const { id, config, onSettingChange } = this.props
    if (config.honorTimeSettings) {
      const settings = getTimeSettingsFromHonoredWebMap(this.state.dataSources)
      onSettingChange({
        id: id,
        config: config
          .set('honorTimeSettings', false)
          .set('timeSettings', settings)
      })
    } else {
      onSettingChange({
        id: id,
        config: config
          .set('honorTimeSettings', true)
          .set('timeSettings', null)
      })
    }
  }

  enablePlayControl = (e, enable: boolean) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config
        .set('enablePlayControl', enable)
        .set('autoPlay', false)
    })
  }

  enableApplyFilteringByDefault = (e, enable: boolean) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('applyFilteringByDefault', enable)
    })
  }

  enableDisplayAccuracy = (e, enable: boolean) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config
        .set('enableDisplayAccuracy', enable)
        .set('displayAccuracy', 'second')
    })
  }

  onTimeSettingPanel = () => {
    this.setState({ isTimePanelOpen: !this.state.isTimePanelOpen })
  }

  onCreateDataSourceCreatedOrFailed = (dataSourceId: string, dataSource: DataSource) => {
    this.setState((state: State) => {
      const newDataSources = Object.assign({}, state.dataSources)
      newDataSources[dataSourceId] = dataSource
      return {
        dataSources: newDataSources
      }
    })
  }

  isTimeExtentValid = () => {
    let isDisabled = false
    Object.keys(this.state.dataSources).some(dsId => {
      const ds = this.state.dataSources[dsId]
      if (ds?.type === AllDataSourceTypes.FeatureLayer) { // ds could be null when ds is error.
        const extent = (ds as any).getTimeInfo()?.timeExtent
        if (extent?.[0] && extent?.[1] && extent[0] === extent[1]) {
          isDisabled = true
          return true
        }
      }
      return false
    })
    return isDisabled
  }

  hideDs = (dsJson) => {
    let hide = false
    const ds = this.dsManager?.getDataSource(dsJson.id)
    if (isSingleLayer(ds.type)) {
      hide = !(ds as FeatureLayerDataSource | SubtypeGroupLayerDataSource).supportTime() || dataSourceUtils.findMapServiceDataSource(ds as FeatureLayerDataSource) !== null
    } else if (ds.type === AllDataSourceTypes.WebMap) { // check all layers inside.
      const layers = ds.isDataSourceSet() && ds.getAllChildDataSources()
        .filter(childDs => (isSingleLayer(childDs.type) || childDs.type === AllDataSourceTypes.MapService) && (childDs as any).supportTime())
      hide = layers.length === 0
    } else { // TODO: hide it when no featureLayers inside.
      hide = !(ds as MapServiceDataSource).supportTime()
    }
    return hide
  }

  /**
   * Change to map widget mode: clear all previous settings and dss.
   * Change to data source mode: keep previous useMapWidgetIds whether it has selected map or not.
   */
  setSourceMode = (addSourceByData) => {
    const { id, config, onSettingChange } = this.props
    onSettingChange({
      id: id,
      useDataSources: [],
      config: config
        .set('addSourceByData', addSourceByData)
        .set('honorTimeSettings', true)
        .set('dataSourceType', AllDataSourceTypes.WebMap)
        .set('timeSettings', null)
    })
  }

  onMapWidgetSelected = async (useMapWidgetIds: string[]) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('addSourceByData', false), // need to set default value for express mode when dragging a new widget.
      useMapWidgetIds: useMapWidgetIds
    })
  }

  getSourceContent = (addSourceByData, showPlaceholder: boolean, useDataSources) => {
    return <SettingSection
      role='group'
      className={showPlaceholder ? 'border-0' : ''}
      aria-label={this.i18nMessage('source')}
      title={
        <div className='d-flex justify-content-between'>
          <div>{this.i18nMessage('source')}</div>
          <Tooltip showArrow={true} placement='right'
            title={<div css={css`
              width: 340px;
              margin: 0.75rem;
              font-size: 12px;
              line-height: 150%;
              font-style: normal;
            `}>
            {this.i18nMessage('selectDataSourceLabel1')}
            <div className='mt-2'>{this.i18nMessage('selectDataSourceLabel2')}</div>
          </div>}
          >
            <Button icon type='tertiary' size='sm' className='ml-2 p-0 jimu-outline-inside' disableHoverEffect={true} disableRipple={true}>
              <InfoOutlined />
            </Button>
          </Tooltip>
        </div>
      }
    >
      <SettingRow>
        <Label className='source-label' check>
          <Radio
            name='time-setting-radio'
            style={{ cursor: 'pointer' }}
            className='mr-2 align-text-bottom'
            checked={addSourceByData}
            onChange={evt => { this.setSourceMode(true) }}
          />
          {this.i18nMessage('addSourceByData')}
        </Label>
      </SettingRow>
      <SettingRow className='mt-2'>
        <Label className='source-label' check>
          <Radio
            name='time-setting-radio'
            style={{ cursor: 'pointer' }}
            className='mr-2 align-text-bottom'
            checked={!addSourceByData}
            onChange={evt => { this.setSourceMode(false) }}
          />
          {this.i18nMessage('addSourceByMapWidget')}
        </Label>
      </SettingRow>

      <SettingRow>
        {
          addSourceByData
            ? <DataSourceSelector
              hideAllOptionOfTypeDropdown
              isMultiple
              aria-describedby='timeline-ds-label timeline-blank-msg'
              types={SUPPORTED_TYPES}
              useDataSources={useDataSources || Immutable([])}
              mustUseDataSource
              disableDataView
              hideDataView
              hideDs={this.hideDs}
              closeDataSourceListOnChange={false}
              onChange={this.dataSourceChange}
            />
            : <MapWidgetSelector
              onSelect={this.onMapWidgetSelected}
              useMapWidgetIds={this.props.useMapWidgetIds}
            />
        }
      </SettingRow>
      {
        this.props.useMapWidgetIds?.length > 0 && <SettingRow className='mt-0'>
          <JimuMapViewComponent
            useMapWidgetId={this.props.useMapWidgetIds?.[0]}
            onViewsCreate={this.onJimuViewsCreate}
          />
          {
            !addSourceByData && this.state.noSupportedLayersInMapWidget && <Alert
              closable={false}
              className='w-100 mt-4'
              form='basic'
              text={this.i18nMessage('noSupportedLayersInMapWidgetTip')}
              type='warning'
              withIcon={false}
            />
          }
        </SettingRow>
      }
    </SettingSection>
  }

  /**
   * show alert for three cases from map widget:
   * 1. no webmap ds (jimuMapView.dataSourceId is '')
   * 2. empty layer in webmap ds
   * 3. no time-aware layers in wemap ds
   */
  onJimuViewsCreate = async (viewsObjects: { [jimuMapViewIds: string]: JimuMapView }) => {
    const allJimuMapViews = Object.values(viewsObjects)
    const validLayers = []
    for (let i = 0; i < allJimuMapViews.length; i++) {
      const jimuMapView = allJimuMapViews[i]
      if (!jimuMapView.dataSourceId || validLayers.length) {
        continue
      }
      const useDs = { dataSourceId: jimuMapView.dataSourceId, mainDataSourceId: jimuMapView.dataSourceId }
      const webMapDs = await this.dsManager.createDataSourceByUseDataSource(Immutable(useDs))
      const layers = (webMapDs as WebMapDataSource).getAllChildDataSources()
        .filter(childDs => (isSingleLayer(childDs.type) || childDs.type === AllDataSourceTypes.MapService) && (childDs as any).supportTime())
      validLayers.push(...layers)
    }
    this.setState({
      noSupportedLayersInMapWidget: validLayers.length === 0
    })
  }

  getPlaceholderContent = (addSourceByData) => {
    const { useDataSources, useMapWidgetIds } = this.props
    let label = ''
    if (addSourceByData) {
      label = useDataSources?.length > 0 ? '' : 'selectDataPlaceholder'
    } else {
      label = useMapWidgetIds?.length > 0 ? '' : 'selectMapHint'
    }
    if (!label) {
      return null
    }
    return <div className='empty-placeholder w-100 flex-grow-1 text-center'>
        <div className='empty-placeholder-inner'>
          <div className='empty-placeholder-icon'><ClickOutlined size={48} /></div>
          <div className='empty-placeholder-text' id='timeline-blank-msg'>
            {this.i18nMessage(label)}
          </div>
      </div>
    </div>
  }

  getTimeSettingsContent = (addSourceByData) => {
    const { honorTimeSettings, dataSourceType } = this.props.config
    if (!addSourceByData) {
      return null
    }
    return <SettingSection
      role='group'
      title={this.i18nMessage('timeSetting')}
      aria-label={this.i18nMessage('timeSetting')}
    >
      {
        dataSourceType === AllDataSourceTypes.WebMap
          ? <React.Fragment>
            <SettingRow>
              <Label className='honor-label' check>
                <Radio
                  name='time-setting-radio'
                  style={{ cursor: 'pointer' }}
                  className='mr-2 align-text-bottom'
                  checked={honorTimeSettings}
                  onChange={this.setHonorTimeSettings}
                />
                {this.i18nMessage('honorTimeSettings')}
              </Label>
            </SettingRow>
            <SettingRow className='mt-2'>
              <Label className='honor-label' check>
                <Radio
                  name='time-setting-radio'
                  style={{ cursor: 'pointer' }}
                  className='mr-2 align-text-bottom'
                  checked={!honorTimeSettings}
                  onChange={this.setHonorTimeSettings}
                />
                {this.i18nMessage('customTimeSettings')}
              </Label>
            </SettingRow>
          </React.Fragment>
          : <SettingRow className='mt-2'>
            <Label className='honor-label' check>
              {this.i18nMessage('customTimeSettings')}
            </Label>
          </SettingRow>
      }
      {
        !honorTimeSettings && <React.Fragment>
          <SettingRow className='mt-4' >
            <Button
              className='w-100'
              ref={ref => { this.timeSettingsRef = ref }}
              onClick={this.onTimeSettingPanel}
              disabled={Object.keys(this.state.dataSources).length === 0 || this.isTimeExtentValid()}
            >
              <div className='w-100 px-2 text-truncate'>
                {this.i18nMessage('configureTime')}
              </div>
            </Button>
          </SettingRow>
          <SettingRow>
            {
              this.isTimeExtentValid() && <Alert
                open
                type='warning'
                tabIndex={0}
                className={'w-100'}
                text={'The time extent is not ready. Cannot configure time settings at this time.'}
              />
            }
          </SettingRow>
        </React.Fragment>
      }
    </SettingSection>
  }

  updateStyle = (tStyle: TimeStyle) => {
    this.updateConfigForOptions('timeStyle', tStyle)
    // update to offpanel for both styles
    if (!this.props.offPanel) {
      getAppConfigAction().editWidgetProperty(this.props.id, 'offPanel', true).exec()
    }
  }

  getStylesContent = () => {
    const { timeStyle } = this.props.config
    return (
      <SettingSection role='group' title={this.i18nMessage('style')} aria-label={this.i18nMessage('style')}>
        <SettingRow className='style-container'>
          {
            [TimeStyle.Classic, TimeStyle.Modern].map((tStyle, index) => {
              const style = tStyle.toLowerCase()
              return (
                <Tooltip key={index} title={this.i18nMessage(`${style}Style`)} placement='bottom'>
                  <Button
                    icon size='sm' type='tertiary'
                    active={tStyle === timeStyle}
                    aria-pressed={tStyle === timeStyle}
                    onClick={() => { this.updateStyle(tStyle) }}
                  >
                    <Icon width={104} height={70} icon={require(`./assets/style_${style}.svg`)} />
                  </Button>
                </Tooltip>
              )
            })
          }
        </SettingRow>
      </SettingSection>
    )
  }

  getAppearanceContent = () => {
    const { theme2, config } = this.props
    const appearanceLabel = this.i18nMessage('appearance')
    const foregroundColorLabel = this.i18nMessage('foregroundColor')
    const backgroundColorLabel = this.i18nMessage('backgroundColor')
    const sliderColorLabel = this.i18nMessage('sliderColor')
    return (
      <SettingSection role='group' title={appearanceLabel} aria-label={appearanceLabel} >
        <SettingRow label={foregroundColorLabel}>
          <ThemeColorPicker
            aria-label={foregroundColorLabel} specificTheme={theme2} value={config.foregroundColor}
            onChange={color => { this.updateConfigForOptions('foregroundColor', color) }} />
        </SettingRow>
        <SettingRow label={backgroundColorLabel}>
          <ThemeColorPicker
            aria-label={backgroundColorLabel} specificTheme={theme2} value={config.backgroundColor}
            onChange={color => { this.updateConfigForOptions('backgroundColor', color) }} />
        </SettingRow>
        <SettingRow label={sliderColorLabel}>
          <ThemeColorPicker
            aria-label={sliderColorLabel} specificTheme={theme2} value={config.sliderColor}
            onChange={color => { this.updateConfigForOptions('sliderColor', color) }} />
        </SettingRow>
      </SettingSection>
    )
  }

  getOptionsContent = () => {
    const { enablePlayControl, autoPlay, enableDisplayAccuracy = false, displayAccuracy = 'second', applyFilteringByDefault = true } = this.props.config
    const optionsLabel = this.i18nMessage('options')
    const enablePlayControlLabel = this.i18nMessage('enablePlayControl')
    const applyFilteringByDefaultLabel = this.i18nMessage('applyFilteringByDefault')
    const displayAccuracyLabel = this.i18nMessage('displayAccuracy')
    return (
      <SettingSection role='group' title={optionsLabel} aria-label={optionsLabel}>
        <SettingRow label={enablePlayControlLabel}>
          <Switch
            checked={enablePlayControl}
            onChange={this.enablePlayControl}
            aria-label={enablePlayControlLabel}
          />
        </SettingRow>
        {
          enablePlayControl &&
          <SettingRow>
            <Label className='w-100 d-flex'>
              <Checkbox
                style={{ cursor: 'pointer', marginTop: '2px' }}
                checked={autoPlay}
                onChange={() => { this.updateConfigForOptions('autoPlay', !autoPlay) }}
              />
              <div className='m-0 ml-2 flex-grow-1 autoplay-label'>
                {this.i18nMessage('autoPlay')}
              </div>
            </Label>
          </SettingRow>
        }
        <SettingRow label={applyFilteringByDefaultLabel}>
          <Switch
            checked={applyFilteringByDefault}
            onChange={this.enableApplyFilteringByDefault}
            aria-label={applyFilteringByDefaultLabel}
          />
        </SettingRow>
        <SettingRow label={displayAccuracyLabel}>
          <Switch
            checked={enableDisplayAccuracy}
            onChange={this.enableDisplayAccuracy}
            aria-label={displayAccuracyLabel}
          />
        </SettingRow>
        {
          enableDisplayAccuracy &&
          <SettingRow>
            <Select
              size='sm' aria-label={displayAccuracyLabel} value={displayAccuracy}
              onChange={e => { this.updateConfigForOptions('displayAccuracy', e.target.value) }}
            >
              {
                DISPLAY_ACCURACY.map(unit => {
                  return <Option key={unit} value={unit} active={unit === displayAccuracy}>{this.i18nMessage(unit)}</Option>
                })
              }
            </Select>
          </SettingRow>
        }
      </SettingSection>
    )
  }

  render () {
    const { theme, config, useDataSources, intl, isTimeZoneData } = this.props
    const {
      honorTimeSettings, dataSourceType, addSourceByData = !window.isExpressBuilder
    } = config

    const Placeholder = this.getPlaceholderContent(addSourceByData)
    const showPlaceholder = Placeholder !== null

    return (
      <div className={classNames('jimu-widget-setting widget-setting-timeline d-flex flex-column', { 'show-disabled-mask': isTimeZoneData })} css={getStyleForWidget(theme)}>
        {
          useDataSources?.map((useDs, index) => {
            return (
              <TimelineDataSource
                key={index}
                useDataSource={useDs}
                onCreateDataSourceCreatedOrFailed={this.onCreateDataSourceCreatedOrFailed}
              />
            )
          })
        }
        {this.getSourceContent(addSourceByData, showPlaceholder, useDataSources)}
        {
          showPlaceholder
            ? Placeholder
            : <React.Fragment>
              {this.getTimeSettingsContent(addSourceByData)}
              {this.getStylesContent()}
              {this.getAppearanceContent()}
              {this.getOptionsContent()}
              {
                !honorTimeSettings && <SidePopper
                  position='right'
                  title={this.i18nMessage('configureTime')}
                  isOpen={this.state.isTimePanelOpen}
                  trigger={this.timeSettingsRef}
                  toggle={this.onTimeSettingPanel}
                >
                  {
                    Object.keys(this.state.dataSources).length === useDataSources.length && <TimePanel
                      intl={intl}
                      theme={theme}
                      i18nMessage={this.i18nMessage}
                      dataSources={this.state.dataSources}
                      dataSourceType={dataSourceType}
                      {...this.getTimeSettings()}
                      onChange={settings => { this.updateConfigForOptions('timeSettings', settings) }}
                    />
                  }
                </SidePopper>
              }
            </React.Fragment>
        }
        {
          isTimeZoneData && <div className='disabled-mask w-100 h-100'>
            <div className='mask-bg' />
            <Alert form='basic' type='warning' className='alert-container'>
              {this.i18nMessage('timezoneWarning')}
            </Alert>
          </div>
        }
      </div>
    )
  }
}

export default ReactRedux.connect<ExtraProps, unknown>(
  (state: IMState, props: any) => {
    const isTimeZoneData = state.appStateInBuilder.appConfig.attributes?.timezone?.type === TimezoneConfig.Data
    return { isTimeZoneData }
  }
)(_Setting)
