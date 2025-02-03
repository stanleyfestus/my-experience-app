/** @jsx jsx */
import { React, jsx, classNames, polished } from 'jimu-core'
import { MapWidgetSelector, SettingSection, SettingRow, SettingCollapse } from 'jimu-ui/advanced/setting-components'
import { Button, Icon, Switch, Label, defaultMessages } from 'jimu-ui'
import { type JimuMapView, JimuMapViewComponent } from 'jimu-arcgis'
import { type AllWidgetSettingProps, getAppConfigAction } from 'jimu-for-builder'
import { type IMConfig, Arrangement, type DrawingTool, LayerListMode } from '../config'
import { type MeasurementsUnitsInfo, type DrawingElevationMode3D, type MDecimalPlaces } from 'jimu-ui/advanced/map'
// sub-comps
import { DrawToolsSelector } from './components/draw-tools-selector'
import { MeasurementsUnitsSelector } from './components/measurements-units-selector'
import { MeasurementsDecimalPlaces } from './components/measurements-decimal-places'
import { Effect3DSelector } from './components/effect-3d-selector'
//import { DrawModesSelector } from './components/wip-draw-modes-selector'
import { getStyle } from './style'
// nls
import nls from './translations/default'

import { ClickOutlined } from 'jimu-icons/outlined/application/click'

interface States {
  isSelectedMap: boolean
  isShowOptionsSetting
  isShowAdvancedSetting: boolean
  have3dViews: boolean
}

export default class Setting extends React.PureComponent<AllWidgetSettingProps<IMConfig>/* & ExtraProps*/, States> {
  constructor (props) {
    super(props)

    this.state = {
      isSelectedMap: !!(this.props.useMapWidgetIds?.[0]),
      isShowOptionsSetting: true,
      isShowAdvancedSetting: false,
      have3dViews: false
    }
  }

  //Maps
  handleMapWidgetChange = (useMapWidgetIds: string[]): void => {
    const _isSelectMap = !!(useMapWidgetIds?.[0])
    this.setState({ isSelectedMap: _isSelectMap })

    this.props.onSettingChange({
      id: this.props.id,
      useMapWidgetIds: useMapWidgetIds
    })
  }

  handleViewsCreate = (views: { [viewId: string]: JimuMapView }) => {
    let view3DIdx = 0
    view3DIdx = Object.keys(views).findIndex(viewId => {
      const jimuMapView = views[viewId]
      return (jimuMapView.view.type === '3d')
    })

    const have3dViewsFlag = (view3DIdx > -1)
    if (have3dViewsFlag !== this.state.have3dViews) {
      this.setState({ have3dViews: have3dViewsFlag })
    }
  }

  handleIsDisplayCanvasLayerChange = (): void => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('isDisplayCanvasLayer', !this.props.config.isDisplayCanvasLayer)
    })
  }

  // Arrangement
  handleArrangementChange = (arrangement: Arrangement): void => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('arrangement', arrangement)
    })

    if (arrangement === Arrangement.Toolbar) {
      getAppConfigAction().editWidgetProperty(this.props.id, 'offPanel', true).exec()
    } else {
      getAppConfigAction().editWidgetProperty(this.props.id, 'offPanel', false).exec()
    }
  }

  // Options
  handleShowOptionsSettingClick = () => {
    this.setState({
      isShowOptionsSetting: !this.state.isShowOptionsSetting
    })
  }

  handleShowAdvancedSettingClick = () => {
    this.setState({
      isShowAdvancedSetting: !this.state.isShowAdvancedSetting
    })
  }

  //DrawTools
  handleDrawToolsChange = (drawingTools: DrawingTool[]): void => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('drawingTools', drawingTools)
    })
  }

  //Measurements
  handleIsEnableMeasurementChange = (): void => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.setIn(['measurementsInfo', 'enableMeasurements'], !this.props.config.measurementsInfo.enableMeasurements)
    })
  }

  handleMeasurementUnitsInfoChange = (measurementsUnitsInfos: MeasurementsUnitsInfo[]): void => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('measurementsUnitsInfos', measurementsUnitsInfos)
    })
  }

  handleMDecimalChange = (mDecimalPlaces: MDecimalPlaces): void => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.setIn(['measurementsInfo', 'decimalPlaces'], mDecimalPlaces)
    })
  }

  //DrawingElevationMode3D
  handleDrawingElevationMode3DChange = (drawingElevationMode3D: DrawingElevationMode3D): void => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('drawingElevationMode3D', drawingElevationMode3D)
    })
  }

  // layer list mode for group layers
  handleIsLayerListModeChange = (evt): void => {
    const checked = evt.target.checked
    const modeStr = checked ? LayerListMode.Show : LayerListMode.Hide
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.setIn(['layerListMode'], modeStr)
    })
  }

  render () {
    const a11yDescriptionId = this.props.id + '-ui-mode-description'
    const a11yUIMode0Id = this.props.id + '-ui-mode-0'
    const a11yUIMode1Id = this.props.id + '-ui-mode-1'
    //Maps
    const selectMapWidgetTips = this.props.intl.formatMessage({ id: 'selectMapWidget', defaultMessage: defaultMessages.selectMapWidget })
    const selectMapHint = this.props.intl.formatMessage({ id: 'selectMapHint', defaultMessage: defaultMessages.selectMapHint })
    //Arrangement
    const arrangementTips = this.props.intl.formatMessage({ id: 'arrangementTips', defaultMessage: nls.arrangementTips })
    const panelTips = this.props.intl.formatMessage({ id: 'panelTips', defaultMessage: nls.panelTips })
    const toolbarTips = this.props.intl.formatMessage({ id: 'toolbarTips', defaultMessage: nls.toolbarTips })

    //Advanced setting
    const optionsTips = this.props.intl.formatMessage({ id: 'options', defaultMessage: defaultMessages.options })
    //Drawing tools
    const drawingToolsTips = this.props.intl.formatMessage({ id: 'drawingToolsTips', defaultMessage: nls.drawingToolsTips })
    //Other options
    const isEnableMeasurementsTips = this.props.intl.formatMessage({ id: 'isEnableMeasurementsTips', defaultMessage: nls.isEnableMeasurementsTips })
    //const isEnableAdvancedSettingTips = 'Enable advanced setting'
    const advancedTips = this.props.intl.formatMessage({ id: 'advance', defaultMessage: defaultMessages.advance })
    //layer list mode
    const displayDrawingsTips = this.props.intl.formatMessage({ id: 'displayDrawings', defaultMessage: nls.displayDrawings })

    return (
      <div css={getStyle(this.props.theme, polished)} className='widget-setting-menu jimu-widget-setting'>
        <SettingSection title={selectMapWidgetTips} className={classNames('map-selector-section', { 'border-0': !this.state.isSelectedMap })}>
          <SettingRow>
            <MapWidgetSelector onSelect={this.handleMapWidgetChange} useMapWidgetIds={this.props.useMapWidgetIds} />
          </SettingRow>
          <div className='jimu-map-view'>
            <JimuMapViewComponent useMapWidgetId={this.props.useMapWidgetIds?.[0]} onViewsCreate={this.handleViewsCreate} />
          </div>
        </SettingSection>

        {/* no map tips */}
        {!this.state.isSelectedMap && <div className='d-flex placeholder-container justify-content-center align-items-center'>
          <div className='d-flex text-center placeholder justify-content-center align-items-center '>
            <ClickOutlined size={48} className='d-flex icon mb-2' />
            <p className='hint'>{selectMapHint}</p>
          </div>
        </div>}

        {/* Settings related to map after map loaded */}
        {this.state.isSelectedMap && <React.Fragment>
          {/* 2. Arrangement */}
          <SettingSection title={arrangementTips}>
            <SettingRow role='group' aria-label={arrangementTips}>
              <div className='ui-mode-card-chooser'>
                { /* Panel */}
                <Label className='d-flex flex-column ui-mode-card-wrapper'>
                  <Button type='tertiary' icon className={classNames('ui-mode-card', { active: (this.props.config.arrangement === Arrangement.Panel) })}
                    onClick={() => { this.handleArrangementChange(Arrangement.Panel) }}
                    aria-labelledby={a11yUIMode0Id} aria-describedby={a11yDescriptionId}
                    disableHoverEffect={true} disableRipple={true}
                    title={panelTips}
                    >
                    <Icon width={100} height={72} icon={require('./assets/arrangements/style0.svg')} autoFlip />
                  </Button>
                  <div id={a11yUIMode0Id} className='mx-1 text-break ui-mode-label'>{panelTips}</div>
                </Label>

                <div className='ui-mode-card-separator' />

                { /* Toolbar */}
                <Label className='d-flex flex-column ui-mode-card-wrapper'>
                  <Button type='tertiary' icon className={classNames('ui-mode-card', { active: (this.props.config.arrangement === Arrangement.Toolbar) })}
                    onClick={() => { this.handleArrangementChange(Arrangement.Toolbar) }}
                    aria-labelledby={a11yUIMode1Id} aria-describedby={a11yDescriptionId}
                    disableHoverEffect={true} disableRipple={true}
                    title={toolbarTips}>
                    <Icon width={100} height={72} icon={require('./assets/arrangements/style1.svg')} autoFlip />
                  </Button>
                  <div id={a11yUIMode1Id} className='mx-1 text-break ui-mode-label'>{toolbarTips}</div>
                </Label>
              </div>
            </SettingRow>
          </SettingSection>

          {/* 3 Options setting */}
          <SettingSection>
            <SettingCollapse
              label={optionsTips}
              isOpen={this.state.isShowOptionsSetting}
              onRequestOpen={this.handleShowOptionsSettingClick}
              onRequestClose={this.handleShowOptionsSettingClick}>
              <React.Fragment>
                {/* 3.1 DrawTools */}
                <SettingSection title={drawingToolsTips} className='px-0 bold-font-label' role='group' aria-label={drawingToolsTips}>
                  <DrawToolsSelector
                    theme={this.props.theme} intl={this.props.intl} title={drawingToolsTips}
                    items={this.props.config.drawingTools.asMutable()}
                    onDrawingToolsChange={this.handleDrawToolsChange}
                  />
                </SettingSection>

                {/* 3.2 Measurements */}
                <SettingSection className='px-0 pb-0'>
                  {/* switch */}
                  <SettingRow label={isEnableMeasurementsTips} className='bold-font-label'>
                    <Switch checked={this.props.config.measurementsInfo.enableMeasurements} onChange={this.handleIsEnableMeasurementChange}
                      aria-label={isEnableMeasurementsTips} />
                  </SettingRow>
                  {/* Units selector */}
                  {this.props.config.measurementsInfo.enableMeasurements &&
                    <MeasurementsUnitsSelector
                      theme={this.props.theme} intl={this.props.intl}
                      measurementsUnitsInfos={this.props.config.measurementsUnitsInfos?.asMutable()}
                      onUnitsSettingChange={this.handleMeasurementUnitsInfoChange}
                    />
                  }
                  {/* Decimal places */}
                  {this.props.config.measurementsInfo.enableMeasurements &&
                    <MeasurementsDecimalPlaces
                      decimalPlaces={this.props.config.measurementsInfo.decimalPlaces}
                      onDecimalPlacesChange={this.handleMDecimalChange}
                    />
                  }
                </SettingSection>
              </React.Fragment>
            </SettingCollapse>
          </SettingSection>

          {/* 4 Advanced setting */}
          <SettingSection>
            <SettingCollapse
              label={advancedTips}
              isOpen={this.state.isShowAdvancedSetting}
              onRequestOpen={this.handleShowAdvancedSettingClick}
              onRequestClose={this.handleShowAdvancedSettingClick}>
              <React.Fragment>
                {/* 4.1 layer list mode */}
                <SettingSection className='px-0'>
                  {/* switch */}
                  <SettingRow label={displayDrawingsTips} className='bold-font-label'>
                    <Switch checked={(this.props.config.layerListMode ?? LayerListMode.Hide) === LayerListMode.Show}
                      onChange={this.handleIsLayerListModeChange}
                      aria-label={displayDrawingsTips} />
                  </SettingRow>
                </SettingSection>

                {/* 4.2 drawingElevationMode3D */}
                {this.state.have3dViews &&
                  <Effect3DSelector
                    drawingElevationMode3D={this.props.config.drawingElevationMode3D}
                    handleDrawingElevationMode3DChange={this.handleDrawingElevationMode3DChange}
                  ></Effect3DSelector>
                }
              </React.Fragment>
            </SettingCollapse>
          </SettingSection>
          {/* DrawModes
          <DrawModesSelector
            theme={this.props.theme} intl={this.props.intl}
          ></DrawModesSelector> */}
        </React.Fragment>}
      </div>
    )
  }
}
