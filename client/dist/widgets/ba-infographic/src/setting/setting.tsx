/** @jsx jsx */
import { React, jsx, css, getAppStore, Immutable, lodash, type ImmutableArray, proxyUtils, SupportedUtilityType, type UseUtility, SessionManager } from 'jimu-core'
import { type AllWidgetSettingProps, getAppConfigAction, helpUtils } from 'jimu-for-builder'
import { SettingSection, SettingRow, MapWidgetSelector, SidePopper, SettingCollapse } from 'jimu-ui/advanced/setting-components'
import { Radio, TextArea, Select, Switch, Label, Button, Icon, Checkbox, Popper, NumericInput, Tabs, Tab } from 'jimu-ui'
import defaultMessages from './translations/default'
import { getStyle } from './lib/style'
import { ArcgisBaSearch, ArcgisReportList } from '../../node_modules/@arcgis/business-analyst-components/dist/components'

import { ColorPicker } from 'jimu-ui/basic/color-picker'
import { Mode, ViewMode } from '../config'
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info'
import ChartColumnOutlined from 'jimu-icons/svg/outlined/data/chart-column.svg'
import PinEsriOutlined from 'jimu-icons/svg/outlined/gis/pin-esri.svg'
import PolygonOutlined from 'jimu-icons/svg/outlined/gis/polygon.svg'
import SearchOutlined from 'jimu-icons/svg/outlined/editor/search.svg'
import RingsIcon from './assets/rings32.svg'
import DriveIcon from './assets/drivetime32.svg'
import WalkIcon from './assets/walktime32.svg'
import { UtilitySelector } from 'jimu-ui/advanced/utility-selector'
import CloseOutlined from 'jimu-icons/svg/outlined/editor/close.svg'
import { ACLUtils } from '../../node_modules/@arcgis/business-analyst-components/dist/stencil-components/dist/collection/ACLUtils'
import { getCountries, getValidHierarchies } from '../countries'

enum InfoBufferType { ring = 'ring', drivetime = 'drivetime', walktime = 'walktime' }
enum BaSearchType { all = '0', locations = '1', boundaries = '2' }
// TM
export enum TravelDirection { away = 'Away From Facility', toward = 'Towards Facility' }
export enum DrivingMode { driving = 'Driving', rural = 'RuralDriving', trucking = 'Trucking' }
export enum TrafficType { live = 'live', typical = 'typical' }

// TM
export interface TravelModeOptions {
  mode: DrivingMode | undefined
  direction: TravelDirection
  useTrafficEnabled: boolean
  useTrafficChecked: boolean
  trafficType: TrafficType
  offsetTime: number
  offsetDay: string
  offsetHr: string
}

const popperStyles = () => {
  const primaryButtonVars = {
    default: {
      color: '#fff',
      bg: '#fffffff',
      shadow: '0 2px 12px 0 rgba(95,95,255,0.40)'
    }
  }
  return css`
      width: 240px;
      padding: 10px;

      h1, h2, h3, h4, h5, h6 {
        color: var(--ref-palette-neutral-1000);
      }

      .btn-primary {
        min-width: 100px;
        color: ${primaryButtonVars.default.color};
        background-color: ${primaryButtonVars.default.bg};
        border: 1px solid transparent;
      }
    `
}

enum MaxBuffers {
  Rings = 1000,
  DriveMinutes = 300,
  DriveMile = 300,
  DriveKm = 482.8,
  WalkMinutes = 300,
  WalkMile = 27,
  WalkKm = 43.45
}

const supportedUtilityTypes = [SupportedUtilityType.GeoEnrichment]

const defaultFillSymbol = {
  type: 'esriSFS',
  color: [245, 172, 70, 102],
  outline: {
    type: 'esriSLS',
    color: [204, 50, 2, 179],
    width: 1,
    style: 'esriSLSSolid'
  },
  style: 'esriSFSSolid'
}

export default class Setting extends React.PureComponent<AllWidgetSettingProps<any>, any> {
// export default class Setting extends React.Component<AllWidgetSettingProps<any>, any> {
  static SettingRegistry: any = {}

  sidePopperTrigger = React.createRef<HTMLDivElement>()
  _mapWidgetId
  modeInfoRef: React.RefObject<unknown>
  linkInfographicRef: React.RefObject<unknown>
  allowSearchInfoRef: React.RefObject<unknown>
  userBufferInfoRef: React.RefObject<unknown>
  allowChoiceInfoRef: React.RefObject<unknown>
  _checkedItemsList
  _ignoreNextDefaultClick: boolean = false
  sessionToken: string = null
  _hasSetDefaults: boolean = false
  // TM
  travelModeDefaults: TravelModeOptions = {
    mode: DrivingMode.driving,
    direction: TravelDirection.away,
    useTrafficEnabled: true,
    useTrafficChecked: false,
    trafficType: TrafficType.live,
    offsetTime: 0, // Now
    offsetDay: '', // localized Monday
    offsetHr: '' // localized 12 PM
  }

  constructor (props) {
    super(props)
    Setting.SettingRegistry[this.props.id] = this

    this.modeInfoRef = React.createRef()
    this.linkInfographicRef = React.createRef()
    this.allowSearchInfoRef = React.createRef()
    this.userBufferInfoRef = React.createRef()
    this.allowChoiceInfoRef = React.createRef()
    this._hasSetDefaults = false
    const isAll = props.config.baSearchType === BaSearchType.all
    const geogEnabled = isAll || props.config.baSearchType === BaSearchType.boundaries
    const ptsEnabled = isAll || props.config.baSearchType === BaSearchType.locations

    this.state = {
      countries: null,
      error: null,
      modePopperOpen: false,
      allowSearchInfoIconOpen: false,
      allowBufferInfoIconOpen: false,
      allowInfographicChoiceIconOpen: false,
      settingsOpen: false,
      availableHierarchies: null,
      selectedHierarchyObj: null,
      selectedCountry: props.config.sourceCountry, // Setting.tsx local country state value init from shared prop
      availableGeographyLevels: props.config.availableGeographyLevels,
      activeGeographyLevels: props.config.selectedGeographyLevels,
      baSearchType: props.config.baSearchType,
      geographiesChecked: geogEnabled,
      pointsOfInterestChecked: ptsEnabled,
      presetShowSearchInput: false,
      presetSearchSidePopper: false,
      presetBufferSidePopper: false,
      presetInfographicSidePopper: false,
      workflowSearchSidePopper: false,
      workflowBufferSidePopper: false,
      workflowInfographicSidePopper: false,
      workflowShowSearchInput: false,
      presetBuffersQueued: false,
      stPresetBuffer: null,
      stPresetRingsBuffer1: null,
      stPresetRingsBuffer2: null,
      stPresetRingsBuffer3: null,
      stPresetRingsBufferUnit: null,
      stPresetDrivetimeBuffer1: null,
      stPresetDrivetimeBuffer2: null,
      stPresetDrivetimeBuffer3: null,
      stPresetDrivetimeBufferUnit: null,
      stPresetWalktimeBuffer1: null,
      stPresetWalktimeBuffer2: null,
      stPresetWalktimeBuffer3: null,
      stPresetWalktimeBufferUnit: null,
      stViewMode: ViewMode.Auto,
      // default is minutes
      maxDriveBuffer: MaxBuffers.DriveMinutes,
      maxWalkBuffer: MaxBuffers.WalkMinutes,
      portalUrl: props.portalUrl,
      geocodeUrl: props.portalSelf.helperServices && props.portalSelf.helperServices.geocode && props.portalSelf.helperServices.geocode[0].url,
      geoenrichmentServiceUrl: props.portalSelf.helperServices && props.portalSelf.helperServices.geoenrichment && props.portalSelf.helperServices.geoenrichment.url,
      searchbarEnabled: props.config.searchbarEnabled,
      drawPointEnabled: props.config.drawPointEnabled,
      drawPolygonEnabled: props.config.drawPointEnabled,
      portalHelpUrl: '',
      stUseTrafficChecked: false,
      stDrivingMode: DrivingMode.driving,
      stTravelDirection: TravelDirection.away,
      stTrafficType: TrafficType.live,
      stOffsetTime: 0,
      stOffsetDay: 'Monday',
      stOffsetHr: '12:00 PM'
    }
    // console.log('%c SETTING constructor setting syncBufferSettings= false', 'color:pink;font-size:13pt')
    this.onPropertyChange('syncBufferSettings', false)
    // Need to set proxy referrer if proxy is already configured from creating a copy of existing app
    if (props.config.geoenrichmentConfig?.useUtility?.utilityId) {
      this.setProxyReferrer()
    }
  }

  getToken () {
    if (!this.sessionToken) {
      if (SessionManager) {
        this.sessionToken = SessionManager.getInstance()?.getMainSession()?.token
      }
    }
    return this.sessionToken
  }

  presetColors = [
    { label: '#151515', value: '#151515', color: '#151515' },
    { label: '#525659', value: '#525659', color: '#525659' },
    { label: '#0079C1', value: '#0079C1', color: '#0079C1' },
    { label: '#FFFFFF', value: '#FFFFFF', color: '#FFFFFF' }
  ]

  preloadData = () => {
    this.setDefaults()
  }

  missingBuffers = (bufferType) => {
    const {
      widgetMode,
      workflowEnableUserConfigBuffers,
      presetBuffer,
      presetRingsBuffer1,
      presetRingsBuffer2,
      presetRingsBuffer3,
      presetDrivetimeBuffer1,
      presetDrivetimeBuffer2,
      presetDrivetimeBuffer3,
      presetWalktimeBuffer1,
      presetWalktimeBuffer2,
      presetWalktimeBuffer3,
      workflowBuffer,
      workflowRingsBuffer1,
      workflowRingsBuffer2,
      workflowRingsBuffer3,
      workflowDrivetimeBuffer1,
      workflowDrivetimeBuffer2,
      workflowDrivetimeBuffer3,
      workflowWalktimeBuffer1,
      workflowWalktimeBuffer2,
      workflowWalktimeBuffer3
    } = this.props.config

    if (widgetMode === Mode.Preset) {
      switch (bufferType) {
        case InfoBufferType.ring:
          if (presetBuffer === InfoBufferType.ring && ACLUtils.notDef(presetRingsBuffer1) && ACLUtils.notDef(presetRingsBuffer2) && ACLUtils.notDef(presetRingsBuffer3)) {
            return true
          }
        case InfoBufferType.drivetime:
          if (presetBuffer === InfoBufferType.drivetime && ACLUtils.notDef(presetDrivetimeBuffer1) && ACLUtils.notDef(presetDrivetimeBuffer2) && ACLUtils.notDef(presetDrivetimeBuffer3)) {
            return true
          }
        case InfoBufferType.walktime:
          if (presetBuffer === InfoBufferType.walktime && ACLUtils.notDef(presetWalktimeBuffer1) && ACLUtils.notDef(presetWalktimeBuffer2) && ACLUtils.notDef(presetWalktimeBuffer3)) {
            return true
          }
        default:
          return false
      }
    } else {
      if (ACLUtils.notDef(workflowEnableUserConfigBuffers)) {
        return true
      } else if (!workflowEnableUserConfigBuffers) {
        switch (bufferType) {
          case InfoBufferType.ring:
            if (workflowBuffer === InfoBufferType.ring && ACLUtils.notDef(workflowRingsBuffer1) && ACLUtils.notDef(workflowRingsBuffer2) && ACLUtils.notDef(workflowRingsBuffer3)) {
              return true
            }
          case InfoBufferType.drivetime:
            if (workflowBuffer === InfoBufferType.drivetime && ACLUtils.notDef(workflowDrivetimeBuffer1) && ACLUtils.notDef(workflowDrivetimeBuffer2) && ACLUtils.notDef(workflowDrivetimeBuffer3)) {
              return true
            }
          case InfoBufferType.walktime:
            if (workflowBuffer === InfoBufferType.walktime && ACLUtils.notDef(workflowWalktimeBuffer1) && ACLUtils.notDef(workflowWalktimeBuffer2) && ACLUtils.notDef(workflowWalktimeBuffer3)) {
              return true
            }
          default:
            return false
        }
      }
    }
  }

  _presetChangedTimer = null
  _cancelPresetTimer () {
    if (this._presetChangedTimer) { clearInterval(this._presetChangedTimer); this._presetChangedTimer = null }
  }

  _setPresetBuffersChanged () {
    const self = this
    self._cancelPresetTimer()
    requestAnimationFrame(() => {
      self.onPropertyChange('presetBuffersHaveChanged', true)
      self._presetChangedTimer = setTimeout(() => {
        self._cancelPresetTimer()
        self.onPropertyChange('presetBuffersHaveChanged', false)
      }, 0)
    })
  }

  // NOTE: When changing default values, also verify they are updated in the widget constructor as that is
  // called prior to this for new Experience Builder app creation
  setDefaults () {
    const changeArr = []
    if (ACLUtils.notDef(this.props.config.widgetMode)) {
      changeArr.push({ name: 'widgetMode', value: Mode.Workflow })
    }
    if (ACLUtils.notDef(this.props.config.viewMode)) {
      changeArr.push({ name: 'viewMode', value: ViewMode.Auto })
    }
    if (ACLUtils.notDef(this.props.config.sourceCountry)) {
      changeArr.push({ name: 'sourceCountry', value: 'US' })
    }
    if (ACLUtils.notDef(this.props.config.widgetPlaceholderText)) {
      changeArr.push({ name: 'widgetPlaceholderText', value: this.localeString('widgetPlaceholderText') })
    }
    if (ACLUtils.notDef(this.props.config.widgetPlaceholderTextToggle)) {
      changeArr.push({ name: 'widgetPlaceholderTextToggle', value: true })
    }
    if (ACLUtils.notDef(this.props.config.workflowIntroText) || this.props.config.workflowIntroText === defaultMessages.introTextWithDraw) {
      changeArr.push({ name: 'workflowIntroText', value: this.localeString('introTextWithDraw') })
    }
    if (ACLUtils.notDef(this.props.config.workflowIntroTextReports) || this.props.config.workflowIntroTextReports === defaultMessages.infographicDesc) {
      changeArr.push({ name: 'workflowIntroTextReports', value: this.localeString('infographicDesc') })
    }
    if (ACLUtils.notDef(this.props.config.workflowIntroTextBuffers) || this.props.config.workflowIntroTextBuffers === defaultMessages.bufferExtentDesc) {
      changeArr.push({ name: 'workflowIntroTextBuffers', value: this.localeString('bufferExtentDesc') })
    }
    if (ACLUtils.notDef(this.props.config.langCode)) {
      changeArr.push({ name: 'langCode', value: 'en-us' })
    }
    if (ACLUtils.notDef(this.props.config.igBackgroundColor)) {
      changeArr.push({ name: 'igBackgroundColor', value: '#525659' })
    }
    if (ACLUtils.notDef(this.props.config.runReportOnClick)) {
      changeArr.push({ name: 'runReportOnClick', value: false })
    }
    if (ACLUtils.notDef(this.props.config.displayHeader)) {
      changeArr.push({ name: 'displayHeader', value: true })
    }
    if (ACLUtils.notDef(this.props.config.headerColor)) {
      changeArr.push({ name: 'headerColor', value: '#151515' })
    }
    if (ACLUtils.notDef(this.props.config.headerTextColor)) {
      changeArr.push({ name: 'headerTextColor', value: '#FFFFFF' })
    }
    if (ACLUtils.notDef(this.props.config.imageExport)) {
      changeArr.push({ name: 'imageExport', value: true })
    }
    if (ACLUtils.notDef(this.props.config.pdf)) {
      changeArr.push({ name: 'pdf', value: true })
    }
    if (ACLUtils.notDef(this.props.config.dynamicHtml)) {
      changeArr.push({ name: 'dynamicHtml', value: true })
    }
    if (ACLUtils.notDef(this.props.config.excel)) {
      changeArr.push({ name: 'excel', value: true })
    }
    if (ACLUtils.notDef(this.props.config.fullscreen)) {
      changeArr.push({ name: 'fullscreen', value: true })
    }
    if (ACLUtils.notDef(this.props.config.zoomLevel)) {
      changeArr.push({ name: 'zoomLevel', value: true })
    }
    if (ACLUtils.notDef(this.props.config.workflowEnableSearch)) {
      changeArr.push({ name: 'workflowEnableSearch', value: true })
    }
    if (ACLUtils.notDef(this.props.config.workflowDisplayIntroText)) {
      changeArr.push({ name: 'workflowDisplayIntroText', value: true })
    }
    if (ACLUtils.notDef(this.props.config.restrictSearch)) {
      changeArr.push({ name: 'restrictSearch', value: true })
    }
    if (ACLUtils.notDef(this.props.config.workflowEnableUserConfigBuffers)) {
      changeArr.push({ name: 'workflowEnableUserConfigBuffers', value: true })
    }
    if (ACLUtils.notDef(this.props.config.baSearchType)) {
      changeArr.push({ name: 'baSearchType', value: BaSearchType.all })
    }
    if (ACLUtils.notDef(this.props.config.workflowAvailableBufferRings)) {
      changeArr.push({ name: 'workflowAvailableBufferRings', value: true })
    }
    if (ACLUtils.notDef(this.props.config.workflowAvailableBufferDrivetime)) {
      changeArr.push({ name: 'workflowAvailableBufferDrivetime', value: true })
    }
    if (ACLUtils.notDef(this.props.config.workflowAvailableBufferWalktime)) {
      changeArr.push({ name: 'workflowAvailableBufferWalktime', value: true })
    }
    if (ACLUtils.notDef(this.props.config.presetSearchSelectedObject)) {
      changeArr.push({ name: 'presetSearchSelectedObject', value: null })
    }
    if (ACLUtils.notDef(this.props.config.presetSelectedReport)) {
      changeArr.push({ name: 'presetSelectedReport', value: null })
    }
    if (ACLUtils.notDef(this.props.config.presetSelectedReportName)) {
      changeArr.push({ name: 'presetSelectedReportName', value: null })
    }
    if (ACLUtils.notDef(this.props.config.workflowSearchSelectedObject)) {
      changeArr.push({ name: 'workflowSearchSelectedObject', value: null })
    }
    if (ACLUtils.notDef(this.props.config.workflowIntroTextReportCheckbox)) {
      changeArr.push({ name: 'workflowIntroTextReportCheckbox', value: true })
    }
    if (ACLUtils.notDef(this.props.config.workflowIntroTextBuffersCheckbox)) {
      changeArr.push({ name: 'workflowIntroTextBuffersCheckbox', value: true })
    }
    if (ACLUtils.notDef(this.props.config.workflowEnableInfographicChoice)) {
      changeArr.push({ name: 'workflowEnableInfographicChoice', value: true })
    }
    if (ACLUtils.notDef(this.props.config.defaultReport)) {
      changeArr.push({ name: 'defaultReport', value: undefined })
    }
    if (ACLUtils.notDef(this.props.config.reportList)) {
      changeArr.push({ name: 'reportList', value: {} })
    }

    if (ACLUtils.notDef(this.props.config.workflowBuffer)) {
      changeArr.push({ name: 'workflowBuffer', value: InfoBufferType.ring })
    }
    if (this.missingBuffers(InfoBufferType.ring)) {
      changeArr.push({ name: 'workflowRingsBuffer1', value: 1 })
    }
    if (this.missingBuffers(InfoBufferType.ring)) {
      changeArr.push({ name: 'workflowRingsBuffer2', value: 3 })
    }
    if (this.missingBuffers(InfoBufferType.ring)) {
      changeArr.push({ name: 'workflowRingsBuffer3', value: 5 })
    }
    if (ACLUtils.notDef(this.props.config.workflowRingsBufferUnit)) {
      changeArr.push({ name: 'workflowRingsBufferUnit', value: 'miles' })
    }
    if (this.missingBuffers(InfoBufferType.drivetime)) {
      changeArr.push({ name: 'workflowDrivetimeBuffer1', value: 5 })
    }
    if (this.missingBuffers(InfoBufferType.drivetime)) {
      changeArr.push({ name: 'workflowDrivetimeBuffer2', value: 10 })
    }
    if (this.missingBuffers(InfoBufferType.drivetime)) {
      changeArr.push({ name: 'workflowDrivetimeBuffer3', value: 15 })
    }
    if (ACLUtils.notDef(this.props.config.workflowDrivetimeBufferUnit)) {
      changeArr.push({ name: 'workflowDrivetimeBufferUnit', value: 'minutes' })
    }
    if (this.missingBuffers(InfoBufferType.walktime)) {
      changeArr.push({ name: 'workflowWalktimeBuffer1', value: 5 })
    }
    if (this.missingBuffers(InfoBufferType.walktime)) {
      changeArr.push({ name: 'workflowWalktimeBuffer2', value: 10 })
    }
    if (this.missingBuffers(InfoBufferType.walktime)) {
      changeArr.push({ name: 'workflowWalktimeBuffer3', value: 15 })
    }
    if (ACLUtils.notDef(this.props.config.workflowWalktimeBufferUnit)) {
      changeArr.push({ name: 'workflowWalktimeBufferUnit', value: 'minutes' })
    }

    if (!this._hasSetDefaults) {
      this._hasSetDefaults = true

      changeArr.push({ name: 'presetBuffersHaveChanged', value: false })

      if (ACLUtils.notDef(this.props.config.presetBuffer) && ACLUtils.notDef(this.state.stPresetBuffer)) {
        this.updateState('stPresetBuffer', InfoBufferType.ring)
        //changeArr.push({ name: 'presetBuffer', value: InfoBufferType.ring })
      } else if (ACLUtils.notDef(this.props.config.presetBuffer) && ACLUtils.isDef(this.state.stPresetBuffer)) {
        changeArr.push({ name: 'presetBuffer', value: this.state.stPresetBuffer })
      } else {
        this.updateState('stPresetBuffer', this.props.config.presetBuffer)
      }
      if (this.missingBuffers(InfoBufferType.ring)) {
        this.updateState('stPresetRingsBuffer1', 1)
        //changeArr.push({ name: 'presetRingsBuffer1', value: 1 })
      } else if (ACLUtils.notDef(this.props.config.presetRingsBuffer1) && ACLUtils.isDef(this.state.stPresetRingsBuffer1)) {
        changeArr.push({ name: 'presetRingsBuffer1', value: this.state.stPresetRingsBuffer1 })
      } else {
        this.updateState('stPresetRingsBuffer1', this.props.config.presetRingsBuffer1)
      }
      if (this.missingBuffers(InfoBufferType.ring)) {
        this.updateState('stPresetRingsBuffer2', 3)
        //changeArr.push({ name: 'presetRingsBuffer2', value: 3 })
      } else if (ACLUtils.notDef(this.props.config.presetRingsBuffer2) && ACLUtils.isDef(this.state.stPresetRingsBuffer2)) {
        changeArr.push({ name: 'presetRingsBuffer2', value: this.state.stPresetRingsBuffer2 })
      } else {
        this.updateState('stPresetRingsBuffer2', this.props.config.presetRingsBuffer2)
      }
      if (this.missingBuffers(InfoBufferType.ring)) {
        this.updateState('stPresetRingsBuffer3', 5)
        //changeArr.push({ name: 'presetRingsBuffer3', value: 5 })
      } else if (ACLUtils.notDef(this.props.config.presetRingsBuffer3) && ACLUtils.isDef(this.state.stPresetRingsBuffer3)) {
        changeArr.push({ name: 'presetRingsBuffer3', value: this.state.stPresetRingsBuffer3 })
      } else {
        this.updateState('stPresetRingsBuffer3', this.props.config.presetRingsBuffer3)
      }
      if (ACLUtils.notDef(this.props.config.presetRingsBufferUnit) && ACLUtils.notDef(this.state.stPresetRingsBufferUnit)) {
        this.updateState('stPresetRingsBufferUnit', 'miles')
      } else if (ACLUtils.notDef(this.props.config.presetRingsBufferUnit) && ACLUtils.isDef(this.state.stPresetRingsBufferUnit)) {
        changeArr.push({ name: 'presetRingsBufferUnit', value: this.state.stPresetRingsBufferUnit })
      } else {
        this.updateState('stPresetRingsBufferUnit', this.props.config.presetRingsBufferUnit)
      }
      if (this.missingBuffers(InfoBufferType.drivetime)) {
        this.updateState('stPresetDrivetimeBuffer1', 5)
      } else if (ACLUtils.notDef(this.props.config.presetDrivetimeBuffer1) && ACLUtils.isDef(this.state.stPresetDrivetimeBuffer1)) {
        changeArr.push({ name: 'presetDrivetimeBuffer1', value: this.state.stPresetDrivetimeBuffer1 })
      } else {
        this.updateState('stPresetDrivetimeBuffer1', this.props.config.presetDrivetimeBuffer1)
      }
      if (this.missingBuffers(InfoBufferType.drivetime)) {
        this.updateState('stPresetDrivetimeBuffer2', 10)
      } else if (ACLUtils.notDef(this.props.config.presetDrivetimeBuffer2) && ACLUtils.isDef(this.state.stPresetDrivetimeBuffer2)) {
        changeArr.push({ name: 'presetDrivetimeBuffer2', value: this.state.stPresetDrivetimeBuffer2 })
      } else {
        this.updateState('stPresetDrivetimeBuffer2', this.props.config.presetDrivetimeBuffer2)
      }
      if (this.missingBuffers(InfoBufferType.drivetime)) {
        this.updateState('stPresetDrivetimeBuffer3', 15)
      } else if (ACLUtils.notDef(this.props.config.presetDrivetimeBuffer3) && ACLUtils.isDef(this.state.stPresetDrivetimeBuffer3)) {
        changeArr.push({ name: 'presetDrivetimeBuffer3', value: this.state.stPresetDrivetimeBuffer3 })
      } else {
        this.updateState('stPresetDrivetimeBuffer3', this.props.config.presetDrivetimeBuffer3)
      }
      if (ACLUtils.notDef(this.props.config.presetDrivetimeBufferUnit) && ACLUtils.notDef(this.state.stPresetDrivetimeBufferUnit)) {
        this.updateState('stPresetDrivetimeBufferUnit', 'minutes')
      } else if (ACLUtils.notDef(this.props.config.presetDrivetimeBufferUnit) && ACLUtils.isDef(this.state.stPresetDrivetimeBufferUnit)) {
        changeArr.push({ name: 'presetDrivetimeBufferUnit', value: this.state.stPresetDrivetimeBufferUnit })
      } else {
        this.updateState('stPresetDrivetimeBufferUnit', this.props.config.presetDrivetimeBufferUnit)
      }
      if (this.missingBuffers(InfoBufferType.walktime)) {
        this.updateState('stPresetWalktimeBuffer1', 5)
      } else if (ACLUtils.notDef(this.props.config.presetWalktimeBuffer1) && ACLUtils.isDef(this.state.stPresetWalktimeBuffer1)) {
        changeArr.push({ name: 'presetWalktimeBuffer1', value: this.state.stPresetWalktimeBuffer1 })
      } else {
        this.updateState('stPresetWalktimeBuffer1', this.props.config.presetWalktimeBuffer1)
      }
      if (this.missingBuffers(InfoBufferType.walktime)) {
        this.updateState('stPresetWalktimeBuffer2', 10)
      } else if (ACLUtils.notDef(this.props.config.presetWalktimeBuffer2) && ACLUtils.isDef(this.state.stPresetWalktimeBuffer2)) {
        changeArr.push({ name: 'presetWalktimeBuffer2', value: this.state.stPresetWalktimeBuffer2 })
      } else {
        this.updateState('stPresetWalktimeBuffer2', this.props.config.presetWalktimeBuffer2)
      }
      if (this.missingBuffers(InfoBufferType.walktime)) {
        this.updateState('stPresetWalktimeBuffer3', 15)
      } else if (ACLUtils.notDef(this.props.config.presetWalktimeBuffer3) && ACLUtils.isDef(this.state.stPresetWalktimeBuffer3)) {
        changeArr.push({ name: 'presetWalktimeBuffer3', value: this.state.stPresetWalktimeBuffer3 })
      } else {
        this.updateState('stPresetWalktimeBuffer3', this.props.config.presetWalktimeBuffer3)
      }
      if (ACLUtils.notDef(this.props.config.presetWalktimeBufferUnit) && ACLUtils.notDef(this.state.stPresetWalktimeBufferUnit)) {
        this.updateState('stPresetWalktimeBufferUnit', 'minutes')
      } else if (ACLUtils.notDef(this.props.config.presetWalktimeBufferUnit) && ACLUtils.isDef(this.state.stPresetWalktimeBufferUnit)) {
        changeArr.push({ name: 'presetWalktimeBufferUnit', value: this.state.stPresetWalktimeBufferUnit })
      } else {
        this.updateState('stPresetWalktimeBufferUnit', this.props.config.presetWalktimeBufferUnit)
      }
    }
    if (ACLUtils.notDef(this.props.config.searchbarEnabled)) {
      changeArr.push({ name: 'searchbarEnabled', value: true })
    }
    if (ACLUtils.notDef(this.props.config.drawPointEnabled)) {
      changeArr.push({ name: 'drawPointEnabled', value: true })
    }
    if (ACLUtils.notDef(this.props.config.drawPolygonEnabled)) {
      changeArr.push({ name: 'drawPolygonEnabled', value: true })
    }
    this.onMultiplePropertyChange(changeArr)
  }

  // Max values based on limitations of GE
  // Drive time (minutes): 300
  // Drive time (miles): 300
  // Drive time (km): 482.8
  // Walk time (minutes): 540
  // Walk time (miles): 27
  // Walk time (km): 43.45

  setMaxBuffers (bufferType, bufferUnit = null) {
    const { widgetMode, workflowDrivetimeBufferUnit, workflowWalktimeBufferUnit } = this.props.config
    const { stPresetDrivetimeBufferUnit, stPresetWalktimeBufferUnit } = this.state
    let useUnit
    if (ACLUtils.isDef(bufferUnit)) {
      useUnit = bufferUnit
    } else {
      if (widgetMode === Mode.Preset) {
        useUnit = bufferType === InfoBufferType.drivetime ? stPresetDrivetimeBufferUnit : stPresetWalktimeBufferUnit
      } else {
        useUnit = bufferType === InfoBufferType.drivetime ? workflowDrivetimeBufferUnit : workflowWalktimeBufferUnit
      }
    }

    if ((bufferType === InfoBufferType.drivetime) && ACLUtils.isDef(useUnit)) {
      if (useUnit === 'minutes') {
        this.updateState('maxDriveBuffer', MaxBuffers.DriveMinutes)
        this.enforceMax(InfoBufferType.drivetime, MaxBuffers.DriveMinutes)
      } else if (useUnit === 'miles') {
        this.updateState('maxDriveBuffer', MaxBuffers.DriveMile)
        this.enforceMax(InfoBufferType.drivetime, MaxBuffers.DriveMile)
      } else if (useUnit === 'kilometers') {
        this.updateState('maxDriveBuffer', MaxBuffers.DriveKm)
        this.enforceMax(InfoBufferType.drivetime, MaxBuffers.DriveKm)
      }
    }
    if ((bufferType === InfoBufferType.walktime) && ACLUtils.isDef(useUnit)) {
      if (useUnit === 'minutes') {
        this.updateState('maxWalkBuffer', MaxBuffers.WalkMinutes)
        this.enforceMax(InfoBufferType.walktime, MaxBuffers.WalkMinutes)
      } else if (useUnit === 'miles') {
        this.updateState('maxWalkBuffer', MaxBuffers.WalkMile)
        this.enforceMax(InfoBufferType.walktime, MaxBuffers.WalkMile)
      } else if (useUnit === 'kilometers') {
        this.updateState('maxWalkBuffer', MaxBuffers.WalkKm)
        this.enforceMax(InfoBufferType.walktime, MaxBuffers.WalkKm)
      }
    }
  }

  enforceMax (bufferType, max) {
    const { widgetMode } = this.props.config
    const { workflowDrivetimeBuffer1, workflowDrivetimeBuffer2, workflowDrivetimeBuffer3, workflowWalktimeBuffer1, workflowWalktimeBuffer2, workflowWalktimeBuffer3 } = this.props.config
    const { stPresetDrivetimeBuffer1, stPresetDrivetimeBuffer2, stPresetDrivetimeBuffer3, stPresetWalktimeBuffer1, stPresetWalktimeBuffer2, stPresetWalktimeBuffer3 } = this.state

    if (widgetMode === Mode.Preset) {
      if (bufferType === InfoBufferType.drivetime) {
        if (stPresetDrivetimeBuffer1 > max) this.updateBufferValue('stPresetDrivetimeBuffer1', max)
        if (stPresetDrivetimeBuffer2 > max) this.updateBufferValue('stPresetDrivetimeBuffer2', max)
        if (stPresetDrivetimeBuffer3 > max) this.updateBufferValue('stPresetDrivetimeBuffer3', max)
      } else if (bufferType === InfoBufferType.walktime) {
        if (stPresetWalktimeBuffer1 > max) this.updateBufferValue('stPresetWalktimeBuffer1', max)
        if (stPresetWalktimeBuffer2 > max) this.updateBufferValue('stPresetWalktimeBuffer2', max)
        if (stPresetWalktimeBuffer3 > max) this.updateBufferValue('stPresetWalktimeBuffer3', max)
      }
    } else {
      if (bufferType === InfoBufferType.drivetime) {
        if (workflowDrivetimeBuffer1 > max) this.updateBufferValue('workflowDrivetimeBuffer1', max)
        if (workflowDrivetimeBuffer2 > max) this.updateBufferValue('workflowDrivetimeBuffer2', max)
        if (workflowDrivetimeBuffer3 > max) this.updateBufferValue('workflowDrivetimeBuffer3', max)
      } else if (bufferType === InfoBufferType.walktime) {
        if (workflowWalktimeBuffer1 > max) this.updateBufferValue('workflowWalktimeBuffer1', max)
        if (workflowWalktimeBuffer2 > max) this.updateBufferValue('workflowWalktimeBuffer2', max)
        if (workflowWalktimeBuffer3 > max) this.updateBufferValue('workflowWalktimeBuffer3', max)
      }
    }
  }

  /** updateBufferValue
   * This updates either the state or prop according to context, and
   * for Preset Mode it also shows the Apply button
   *
   *  name = either state name for Preset Mode, or prop name for Workflow
   *  value = new value
   */
  updateBufferValue (name: string, value: any) {
    const self = this
    // console.log('%c SETTING updateBufferValue =', 'color:yellow;font-size:13pt;', name, value, this.props.config.widgetMode) // @@@@@@@@@@@@@@@@@@@@@@@@@
    const { widgetMode } = this.props.config
    if (widgetMode === Mode.Workflow) {
      this.onPropertyChange(name, value)
    } else {
      this.updateState(name, value)
      requestAnimationFrame(() => {
        self._showApplyButton()
      })
    }
  }

  handleBufferChange (name: string, value: any, bufferType: any) {
    const self = this
    this.updateBufferValue(name, value)

    requestAnimationFrame(() => {
      if (name === 'workflowDrivetimeBufferUnit' || name === 'workflowWalktimeBufferUnit' || name === 'stPresetDrivetimeBufferUnit' || name === 'stPresetWalktimeBufferUnit') {
        self.setMaxBuffers(bufferType, value)
      } else {
        self.setMaxBuffers(bufferType)
      }
    })
  }

  handleIgSettingChange (name: string, value: any) {
    // console.log(data)
    this.onPropertyChange(name, value)
  }

  // handleDtoChange (stateName: string, propName: string, value: any) {
  //   const self = this
  //   this.updateBufferValue(stateName, value)

  //   // requestAnimationFrame(() => {

  //   // })
  // }

  _toPropName (s): string {
    const sEnd = s.trim().substr(3)
    const sPre: string = (s.substr(2, 1) as string).toLowerCase()
    return ACLUtils.hasText(sEnd) && ACLUtils.hasText(sPre) ? sPre + sEnd : null
  }

  applyPresetDto () {
    const changeArr = []
    const states = [
      'stDrivingMode',
      'stTravelDirection',
      'stUseTrafficChecked',
      'stTrafficType',
      'stOffsetTime',
      'stOffsetDay',
      'stOffsetHr'
    ]
    let changed = false
    for (let ii = 0; ii < states.length; ii++) {
      const stName = states[ii]
      const pName = this._toPropName(stName)
      const stVal = this.state[stName]
      if (this.props.config[pName] !== stVal) {
        changeArr.push({ name: pName, value: stVal })
        changed = true
      }
    }
    this.onMultiplePropertyChange(changeArr)

    if (changed) {
      this._setPresetBuffersChanged()
    }
  }

  applyPresetBuffers () {
    const changeArr = []
    const {
      presetBuffer, presetRingsBuffer1, presetRingsBuffer2, presetRingsBuffer3, presetRingsBufferUnit, presetDrivetimeBuffer1,
      presetDrivetimeBuffer2, presetDrivetimeBuffer3, presetDrivetimeBufferUnit, presetWalktimeBuffer1, presetWalktimeBuffer2,
      presetWalktimeBuffer3, presetWalktimeBufferUnit
    } = this.props.config
    const {
      stPresetBuffer, stPresetRingsBuffer1, stPresetRingsBuffer2, stPresetRingsBuffer3, stPresetRingsBufferUnit, stPresetDrivetimeBuffer1,
      stPresetDrivetimeBuffer2, stPresetDrivetimeBuffer3, stPresetDrivetimeBufferUnit, stPresetWalktimeBuffer1, stPresetWalktimeBuffer2,
      stPresetWalktimeBuffer3, stPresetWalktimeBufferUnit
    } = this.state

    if (presetBuffer !== stPresetBuffer) {
      changeArr.push({ name: 'presetBuffer', value: stPresetBuffer })
    }
    if (presetRingsBuffer1 !== stPresetRingsBuffer1) {
      changeArr.push({ name: 'presetRingsBuffer1', value: isNaN(parseFloat(stPresetRingsBuffer1)) ? null : parseFloat(stPresetRingsBuffer1) })
    }
    if (presetRingsBuffer2 !== stPresetRingsBuffer2) {
      changeArr.push({ name: 'presetRingsBuffer2', value: isNaN(parseFloat(stPresetRingsBuffer2)) ? null : parseFloat(stPresetRingsBuffer2) })
    }
    if (presetRingsBuffer3 !== stPresetRingsBuffer3) {
      changeArr.push({ name: 'presetRingsBuffer3', value: isNaN(parseFloat(stPresetRingsBuffer3)) ? null : parseFloat(stPresetRingsBuffer3) })
    }
    if (presetRingsBufferUnit !== stPresetRingsBufferUnit) {
      changeArr.push({ name: 'presetRingsBufferUnit', value: stPresetRingsBufferUnit })
    }
    if (presetDrivetimeBuffer1 !== stPresetDrivetimeBuffer1) {
      changeArr.push({ name: 'presetDrivetimeBuffer1', value: isNaN(parseFloat(stPresetDrivetimeBuffer1)) ? null : parseFloat(stPresetDrivetimeBuffer1) })
    }
    if (presetDrivetimeBuffer2 !== stPresetDrivetimeBuffer2) {
      changeArr.push({ name: 'presetDrivetimeBuffer2', value: isNaN(parseFloat(stPresetDrivetimeBuffer2)) ? null : parseFloat(stPresetDrivetimeBuffer2) })
    }
    if (presetDrivetimeBuffer3 !== stPresetDrivetimeBuffer3) {
      changeArr.push({ name: 'presetDrivetimeBuffer3', value: isNaN(parseFloat(stPresetDrivetimeBuffer3)) ? null : parseFloat(stPresetDrivetimeBuffer3) })
    }
    if (presetDrivetimeBufferUnit !== stPresetDrivetimeBufferUnit) {
      changeArr.push({ name: 'presetDrivetimeBufferUnit', value: stPresetDrivetimeBufferUnit })
    }
    if (presetWalktimeBuffer1 !== stPresetWalktimeBuffer1) {
      changeArr.push({ name: 'presetWalktimeBuffer1', value: isNaN(parseFloat(stPresetWalktimeBuffer1)) ? null : parseFloat(stPresetWalktimeBuffer1) })
    }
    if (presetWalktimeBuffer2 !== stPresetWalktimeBuffer2) {
      changeArr.push({ name: 'presetWalktimeBuffer2', value: isNaN(parseFloat(stPresetWalktimeBuffer2)) ? null : parseFloat(stPresetWalktimeBuffer2) })
    }
    if (presetWalktimeBuffer3 !== stPresetWalktimeBuffer3) {
      changeArr.push({ name: 'presetWalktimeBuffer3', value: isNaN(parseFloat(stPresetWalktimeBuffer3)) ? null : parseFloat(stPresetWalktimeBuffer3) })
    }
    if (presetWalktimeBufferUnit !== stPresetWalktimeBufferUnit) {
      changeArr.push({ name: 'presetWalktimeBufferUnit', value: stPresetWalktimeBufferUnit })
    }
    if (changeArr.length > 0) {
      this.onMultiplePropertyChange(changeArr)
      this._setPresetBuffersChanged()
    }
  }

  reportSelectedHandler (ev: any) {
    const self = this
    const { widgetMode } = this.props.config
    const changeArr = []
    this.closeDefaultReportPanel()

    if (widgetMode === Mode.Preset) {
      changeArr.push({ name: 'presetSelectedReport', value: ev.detail.id })
      changeArr.push({ name: 'presetSelectedReportName', value: ev.detail.name })
    } else {
      changeArr.push({ name: 'workflowSelectedReport', value: ev.detail.id })
      changeArr.push({ name: 'workflowSelectedReportName', value: ev.detail.name })
    }
    this.onMultiplePropertyChange(changeArr)

    requestAnimationFrame(() => {
      self.applyPresetDto()
      self.applyPresetBuffers()

      self._hideApplyButton()
    })
  }

  accordionInitHandler (data: any) {
    this.onPropertyChange('reportList', data.detail)
  }

  baSearchResultsHandler (ev: any) {
    this.onSiteObjectChanged({ origin: 'basearch', data: ev })
  }

  _findReportInList (reportId: string, list: any) {
    let result
    if (reportId && list && list.length > 0) {
      for (let ii = 0; ii < list.length; ii++) {
        const rep = list[ii]
        if (rep?.id === reportId) {
          result = rep
          break
        }
      }
    }
    return result
  }

  /* Find a report in any of our standard lists */
  _getReportItem (reportId: string, list: any): boolean {
    let item, rep
    if (list) {
      rep = this._findReportInList(reportId, list.user)
      if (!rep) {
        rep = this._findReportInList(reportId, list.shared)
      }
      if (!rep) {
        rep = this._findReportInList(reportId, list.public)
      }
      if (!rep) {
        rep = this._findReportInList(reportId, list.gallery)
      }
      if (rep) {
        item = rep
      }
    }
    return item
  }

  _listHasDefaultReport (list: any): boolean {
    let found: boolean = false
    const report = this.getDefaultReport()
    if (report && report.id) {
      const rep: any = this._getReportItem(report.id, list)
      if (rep && rep.id && rep.isChecked) {
        found = true
      }
    }
    return found
  }

  reportCheckedHandler (ev: any) {
    this.closeDefaultReportPanel()

    const reportList = this.props.config.reportList
    const incomingReports = ev.detail.reports
    let newPublicList = []; let newUserList = []; let newSharedList = []; let newGalleryList = []
    //const report = ev.detail.detail.report

    if (reportList.public && reportList.public.length > 0) {
      newPublicList = reportList.public.map(item => {
        const matchingReport = incomingReports.find(r => r.id === item.id)
        if (matchingReport) {
          return { ...item, isChecked: matchingReport.isChecked }
        }
        return item
      })
    }

    if (reportList.user && reportList.user.length > 0) {
      newUserList = reportList.user.map(item => {
        const matchingReport = incomingReports.find(r => r.id === item.id)
        if (matchingReport) {
          return { ...item, isChecked: matchingReport.isChecked }
        }
        return item
      })
    }

    if (reportList.shared && reportList.shared.length > 0) {
      newSharedList = reportList.shared.map(item => {
        const matchingReport = incomingReports.find(r => r.id === item.id)
        if (matchingReport) {
          return { ...item, isChecked: matchingReport.isChecked }
        }
        return item
      })
    }

    if (reportList.gallery && reportList.gallery.length > 0) {
      newGalleryList = reportList.gallery.map(item => {
        const matchingReport = incomingReports.find(r => r.id === item.id)
        if (matchingReport) {
          return { ...item, isChecked: matchingReport.isChecked }
        }
        return item
      })
    }
    const list = {
      public: newPublicList,
      shared: newSharedList,
      user: newUserList,
      gallery: newGalleryList
    }
    this.onPropertyChange('reportList', list)

    // reset the default if it is no longer checked/available
    if (!this._listHasDefaultReport(list)) {
      this.resetDefaultReport()
    }
  }

  // onSiteObjectChanged()
  //
  // When we change the location or boundary being used for reports
  // the notification goes through here.  One source is the 'searchResults'
  // event listener [just above].  The other souce is a direct call by
  // the map-actions handler when the user clicks on a linked map, or when
  // the user selects a search result from the embedded map-search control.
  //
  // In either case, we take the search result and set the state variables,
  // which then triggers another render in the widget.  At the same time,
  // we notify the MapActions that we need to update the buffers or geometry
  // showing on the linked map.
  //
  onSiteObjectChanged (searchResult) {
    if (!searchResult) return

    if (searchResult.origin === 'basearch') {
      // data is coming from arcgis-ba-search result
      const e = searchResult.data
      let result: any = {}
      if (e.detail.type === 'location') {
        result = {
          type: 'location',
          name: e.detail.name,
          address: e.detail.address,
          lat: e.detail.location.lat,
          lon: e.detail.location.lon
        }
      } else if (e.detail.type === 'geography') {
        //setup geometry compatible with infographic component
        const geom: any = {
          type: 'polygon',
          rings: e.detail.geometry,
          spatial: { wkid: 102100 },
          latitude: 34.055561, // placeholder
          longitude: -117.182602
        }
        result = {
          type: 'geography',
          name: e.detail.title,
          areaId: e.detail.areaId,
          geography: {
            sourceCountry: e.detail.attributes.CountryAbbr,
            levelId: e.detail.attributes.DataLayerID,
            hierarchy: e.detail.attributes.Hierarchy,
            id: e.detail.areaId,
            attributes: e.detail.attributes,
            symbol: defaultFillSymbol
          },
          geometry: geom
        }
      }
      // updating these props will tell the widget the search object has changed
      // Also, it will tell the widget that a linked map may need updating
      if (e.detail.mode && e.detail.mode === Mode.Preset) {
        this.onPropertyChange('presetSearchSelectedObject', JSON.stringify(result))
        this.updateState('presetShowSearchInput', false)
      } else {
        this.onPropertyChange('workflowSearchSelectedObject', JSON.stringify(result))
        this.updateState('workflowShowSearchInput', false)
      }
    }
  }

  // TM
  /**
   * time24ToLocale
   * @param langCode Language code like 'en-US'
   * @param time24 Time to localize in the format 'hh:mm'
   * @returns localized time string
   */
  time24ToLocale (langCode: string, time24: string) {
    if (langCode && time24) {
      const d = new Date(Date.parse('01 Jan 2024 ' + time24 + ' UTC'))
      const tm = d.toLocaleTimeString(langCode, { timeZone: 'UTC', hour: 'numeric', minute: 'numeric' })
      return tm
    } else {
      throw new Error('time24ToLocale: invalid args')
    }
  }

  // TM
  // If 'drivingMode is null or undefined, we set all the travel mode props to their defaults
  //
  checkTravelModeDefaults () {
    const { drivingMode } = this.props.config

    if (!drivingMode) {
      // Set defaults
      const defs = this.travelModeDefaults
      const offTime = defs.offsetTime
      const langCode = getAppStore()?.getState()?.appContext?.locale || 'en-US'
      const offDay = this.localeString('mon')
      const offHr = this.time24ToLocale(langCode, '12:00')

      const changeArr = [
        { name: 'drivingMode', value: defs.mode },
        { name: 'travelDirection', value: defs.direction },
        { name: 'useTrafficEnabled', value: defs.useTrafficEnabled },
        { name: 'useTrafficChecked', value: defs.useTrafficChecked },
        { name: 'trafficType', value: defs.trafficType },
        { name: 'offsetTime', value: offTime },
        { name: 'offsetDay', value: offDay },
        { name: 'offsetHr', value: offHr },
        { name: '' }
      ]
      // console.log('%c checkTravelModeDefaults   defaults=', 'color:pink;font-size:13pt', changeArr)

      this.onMultiplePropertyChange(changeArr)
    }
  }

  // called just before Render
  static getDerivedStateFromProps (props, state) {
    // Get the Setting instance for the active settings
    const inst = Setting.SettingRegistry[props.id]
    // const tmp: any = inst.props?.config
    // console.log('%c SETTING: getDerivedStateFromProps=', 'color:yellow;font-size:13pt', props, tmp?.useTrafficEnabled)

    const token = SessionManager?.getInstance()?.getMainSession()?.token

    if (inst) {
      const { viewMode } = inst.props.config

      // sync viewMode
      if (inst.state.stViewMode !== viewMode) {
        const vm = (typeof viewMode !== 'undefined' && viewMode === ViewMode.Auto) ? undefined : viewMode
        inst.updateState('stViewMode', vm)
      }

      if (inst.state.selectedHierarchyObj === null || inst.state.countries === null) {
        const langCode = getAppStore().getState().appContext.locale || 'en'
        const geUrl = inst.state.geoenrichmentServiceUrl ? inst.state.geoenrichmentServiceUrl : 'https://geoenrich.arcgis.com/arcgis/rest/services/World/GeoEnrichmentServer'

        if (langCode && geUrl && token && (!inst.state.countries || inst.state.countries.length <= 0)) {
          getCountries(langCode, geUrl, token).then((countries) => {
            if (countries) {
              // Get the hierarchies for the selected country
              const hierarchies = getValidHierarchies(inst.props.config.sourceCountry, countries)
              inst.updateState('availableHierarchies', hierarchies)

              if (!inst.props.config.selectedHierarchy) {
                // update new widget selectedHierarchy to the default
                const def = hierarchies.find(o => o.default)
                if (def) {
                  inst.updateState('selectedHierarchyObj', def)
                  inst.onPropertyChange('selectedHierarchy', def.ID)
                  inst._syncGeographyLevels(def)
                }
              } else {
                const h = hierarchies.find(o => o.ID === inst.props.config.selectedHierarchy)
                inst.updateState('selectedHierarchyObj', h)
                inst._syncGeographyLevels(h)
              }
              // Now update the state with the modified data.countries
              inst.updateState('countries', countries)
              // TM
              inst.checkTravelModeDefaults()
            }
          })
        }
      } else {
        const countries = inst.state.countries
        // Get the hierarchies for the selected country
        const hierarchies = getValidHierarchies(inst.props.config.sourceCountry, countries)
        inst.updateState('availableHierarchies', hierarchies)

        if (!inst.props.config.selectedHierarchy) {
          // update new widget selectedHierarchy to the default
          const def = hierarchies.find(o => o.default)
          if (def) {
            inst.updateState('selectedHierarchyObj', def)
            inst.onPropertyChange('selectedHierarchy', def.ID)
            inst._syncGeographyLevels(def)
          }
        } else {
          const h = hierarchies.find(o => o.ID === inst.props.config.selectedHierarchy)
          inst.updateState('selectedHierarchyObj', h)
          inst._syncGeographyLevels(h)
        }
        // TM
        inst.checkTravelModeDefaults()
      }
    }
    // if (props.name !== state.name) {
    //   //Change in props
    //   return {
    //     name: props.name
    //   }
    // }
    return null // No change to state
  }

  componentDidMount () {
    this.preloadData()
    const self = this

    helpUtils.getWidgetHelpLink('ba-infographic').then(url => {
      self.setState({ portalHelpUrl: url })
    })
  }

  _syncGeographyLevels = (hierarchy) => {
    if (hierarchy && hierarchy.geographyLevels && hierarchy.geographyLevels.length > 0) {
      // update selected states for updated geography levels without losing previous selected states
      const newLevels = hierarchy.geographyLevels
      const active = this.props.config.selectedGeographyLevels
      const avail = this.props.config.availableGeographyLevels
      const newlySelected = []
      // update selected levels list
      if (active && active.length > 0) {
        for (let ii = 0; ii < newLevels.length; ii++) {
          const l = newLevels[ii]
          const existing = avail.includes(l)
          // if the same level was purposely not selected before this, then deselect it
          if (!existing || (existing && active.includes(l))) {
            newlySelected.push(l)
          }
        }
      }
      this.onPropertyChange('availableGeographyLevels', newLevels)
      this.onPropertyChange('selectedGeographyLevels', newlySelected)
      this.updateState('availableGeographyLevels', newLevels)
      this.updateState('activeGeographyLevels', newlySelected)
    }
  }

  onPropertyChange = (name, value) => {
    const { config, id } = this.props
    if (value === config[name]) {
      return
    }
    const newConfig = config.set(name, value)
    const alterProps = {
      id,
      config: newConfig
    }
    this.props.onSettingChange(alterProps)
  }

  onMultiplePropertyChange = (changeArr) => {
    const { config, id } = this.props
    let newConfig = config
    changeArr.forEach(item => {
      if (item.value === config[item.name]) return
      newConfig = newConfig.set(item.name, item.value)
    })
    const alterProps = {
      id,
      config: newConfig
    }
    this.props.onSettingChange(alterProps)
  }

  setProxyReferrer () {
    // Set geoenrichment proxy referrer
    let baProxyReferrer = ''
    switch (window.jimuConfig.hostEnv) {
      case 'prod':
        baProxyReferrer = 'https://bao.arcgis.com/'
        break
      case 'qa':
        baProxyReferrer = 'https://baoqa.arcgis.com/'
        break
      case 'dev':
        baProxyReferrer = 'https://baodev.arcgis.com/'
        break
    }

    proxyUtils.registerProxyReferrer(baProxyReferrer)
  }

  onGeoenrichmentUtilityChange = (utilities: ImmutableArray<UseUtility>) => {
    this.setProxyReferrer()

    if (utilities?.[0]?.utilityId !== this.props.config.geoenrichmentConfig?.useUtility?.utilityId) {
      const newConfig = { useUtility: utilities?.[0] }
      this.onPropertyChange('geoenrichmentConfig', newConfig)

      const { id } = this.props

      this.props.onSettingChange({
        id,
        config: this.props.config.setIn(['geoenrichmentConfig', 'useUtility'], utilities?.[0]),
        useUtilities: this.getUsedUtilities(utilities?.[0])
      })
    }
  }

  getUsedUtilities (geoenrichmentUtility: UseUtility): UseUtility[] {
    return [geoenrichmentUtility]
  }

  // updateState changes the state to the new value, unless the
  // old and new values are the same, then it does nothing
  updateState (name: string, value: any, callback?: any) {
    let isSame: boolean = false

    const before = this.state[name]
    const after = value
    if (typeof this.state[name] === 'object') {
      isSame = lodash.isDeepEqual(before, after)
    } else {
      isSame = before === after
    }
    if (!isSame) {
      this.setState((prevState) => ({
        ...prevState,
        [name]: value
      }), callback)
    }
  }

  getKeys (obj: any) {
    let k; const keys = []
    for (k in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(k)) {
        keys.push(k)
      }
    }
    return keys
  }

  shallowObjectComparisonAreEqual (obj1, obj2) {
    if (!obj1 && !obj2) return true
    if ((!obj1 && obj2) || (!obj2 && obj1)) return false
    const keys1 = this.getKeys(obj1)
    const keys2 = this.getKeys(obj2)

    return keys1.length === keys2.length &&
      keys1.every((key) => {
        const hasProp = Object.prototype.hasOwnProperty.call(obj2, key)
        if (!hasProp) return false
        // object props compare true if they are both objects (shallow)
        if (typeof obj1[key] === 'object') {
          return (obj2[key] && typeof obj2[key] === 'object')
        } else {
          return (hasProp && obj1[key] === obj2[key])
        }
      })
  }

  isObject (object) {
    return object != null && typeof object === 'object'
  }

  _onDataSourceChanged = (country?, selectedHierarchyId?) => {
    const self = this
    // console.log('%c SETTING - _onDataSourceChanged', 'color:orange;font-size:12pt', country) // DEBUG ONLY @@@@@@@@@@@@@@@@@@@@@@@
    const { countries, selectedCountry } = self.state
    const { widgetMode } = self.props.config
    let countryObj = null
    if (country) {
      countryObj = countries.find(o => o.id === country)
    } else if (selectedCountry) {
      countryObj = countries.find(o => o.id === selectedCountry)
    }
    if (!countryObj) {
      // console.log('%c BA Widget Setting: missing country', 'color:red;font-size:10pt')
      return
    }
    // update default hierarchy
    const filteredHierarchies = []
    for (let ii = 0; ii < countryObj.hierarchies.length; ii++) {
      const h = countryObj.hierarchies[ii]
      if (h.ID !== 'landscape') {
        filteredHierarchies.push(h)
      }
    }
    let hier
    if (selectedHierarchyId) {
      // validate the hierarchy arg
      hier = filteredHierarchies.find(h => h.ID === selectedHierarchyId)
    }
    if (!hier) {
      const defHier = filteredHierarchies.find(h => h.default)
      hier = defHier || filteredHierarchies[0]
      selectedHierarchyId = hier.ID
    }
    // Update our 'countries' data defaults to match our new selected hierarchy
    for (let ii = 0; ii < filteredHierarchies.length; ii++) {
      const h = filteredHierarchies[ii]
      if (h.ID === selectedHierarchyId) {
        filteredHierarchies[ii].default = true
      } else {
        filteredHierarchies[ii].default = false
      }
    }
    // updating default hierarchy Geography Levels
    let availableLevels
    if (filteredHierarchies) {
      for (let ii = 0; ii < filteredHierarchies.length; ii++) {
        const h = filteredHierarchies[ii]
        if (h && h.ID === selectedHierarchyId) {
          availableLevels = h.levelsInfo?.geographyLevels
          break
        }
      }
    }

    // update related states
    self.updateState('presetSearchSidePopper', false)
    self.updateState('presetBufferSidePopper', false)
    self.updateState('presetInfographicSidePopper', false)
    self.updateState('workflowSidePopper', false)
    self.updateState('workflowBufferSidePopper', false)
    self.updateState('workflowInfographicSidePopper', false)
    self.updateState('availableHierarchies', filteredHierarchies)
    self.updateState('selectedHierarchyObj', hier)

    if (widgetMode === Mode.Preset) {
      self.updateState('presetShowSearchInput', true)
    } else {
      self.updateState('workflowShowSearchInput', true)
    }
    self.onPropertyChange('presetBuffersAccepted', false)

    // Allow this country selection UI handler to complete before
    // setting props & state
    requestAnimationFrame(() => {
      // update the shared props between Setting and Widget
      const changeArr = [
        { name: 'selectedGeographyLevels', value: availableLevels },
        { name: 'availableGeographyLevels', value: availableLevels },
        {
          name: 'selectedHierarchy',
          value: hier.ID
        },
        { name: 'langCode', value: getAppStore().getState().appContext.locale || 'en' },
        { name: 'sourceCountry', value: country },
        { name: 'reportList', value: {} },
        { name: 'defaultReport', value: undefined },
        { name: 'presetSelectedReport', value: null },
        { name: 'presetSelectedReportName', value: null },
        { name: 'presetSearchSelectedObject', value: null },
        { name: 'workflowSearchSelectedObject', value: null },
        { name: '' }
      ]

      self.onMultiplePropertyChange(changeArr)
      self.updateState('availableGeographyLevels', availableLevels)
      self.updateState('activeGeographyLevels', availableLevels)
    })
  }

  updateSelectedCountry = (country) => {
    this._onDataSourceChanged(country)
  }

  onDataSourceChange = (e) => {
    const selectedHierarchyId = e.target?.value
    this._onDataSourceChanged(this.state.selectedCountry, selectedHierarchyId)
  }

  isGeographyLevelSelected = (level) => {
    let isFound = false
    if (level && level.length > 0) {
      const l = this.props.config.selectedGeographyLevels.find(o => o === level)
      if (l) { isFound = true }
    }
    return isFound
  }

  updateGeographyLevels = (level, checked) => {
    const geoLevels = this.props.config.selectedGeographyLevels
    let selectedLevels: any[]
    let isGeographiesSelected = false
    if (!checked) {
      const removeLevel = geoLevels.indexOf(level.level)
      selectedLevels = [
        ...geoLevels.slice(0, removeLevel),
        ...geoLevels.slice(removeLevel + 1)
      ]
      isGeographiesSelected = selectedLevels.length > 0
    } else {
      if (!this.isGeographyLevelSelected(level)) {
        selectedLevels = [
          ...geoLevels,
          level.level
        ]
      }
      isGeographiesSelected = true
    }
    this.onPropertyChange('selectedGeographyLevels', selectedLevels)

    // changing levels may effect the Geographies checkbox state
    if (this.state.geographiesChecked !== isGeographiesSelected) {
      this.onSearchTypeChanged('geographies', isGeographiesSelected)
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const { id, sourceCountry, selectedGeographyLevels, baSearchType, viewMode } = this.props.config
    const { selectedCountry, activeGeographyLevels, geographiesChecked, pointsOfInterestChecked } = this.state

    if (this.state.stViewMode !== viewMode) {
      const vm = (typeof viewMode !== 'undefined' && viewMode === ViewMode.Auto) ? undefined : viewMode
      this.updateState('stViewMode', vm)
    }

    // sync Setting UI's country local state with the value
    // shared between Settings & Widget
    if (selectedCountry !== sourceCountry) {
      this.updateState('selectedCountry', sourceCountry)
    }
    // if (this.state.availableGeographyLevels !== availableGeographyLevels) {
    //   this.updateState('availableGeographyLevels', availableGeographyLevels)
    // }
    if (activeGeographyLevels !== selectedGeographyLevels) {
      this.updateState('activeGeographyLevels', selectedGeographyLevels)
    }

    // baSearchType and related
    //  -undefined searchType not allowed
    if (typeof baSearchType === 'undefined') {
      this.onPropertyChange('baSearchType', BaSearchType.all)
    } else if (this.state.baSearchType !== baSearchType) {
      this.updateState('baSearchType', baSearchType)
    }
    const isAll = baSearchType === BaSearchType.all
    const geogEnabled = isAll || baSearchType === BaSearchType.boundaries
    const ptsEnabled = isAll || baSearchType === BaSearchType.locations
    if (geographiesChecked !== geogEnabled) {
      this.updateState('geographiesChecked', geogEnabled)
    }
    if (pointsOfInterestChecked !== ptsEnabled) {
      this.updateState('pointsOfInterestChecked', ptsEnabled)
    }
    // ---
    if (this.props.config !== prevProps.config) {
      this.preloadData()
    }
    const elem: any = document.getElementById(id + '_' + 'reports')
    if (elem) {
      elem.setMultipleChoice(false)
    }
    const wfElem: any = document.getElementById(id + '_' + 'wf-reports')
    if (wfElem) {
      elem.setMultipleChoice(true)
    }
  }

  onDefaultInfographicChanged (info) {
    const self = this
    if (info) {
      this.onPropertyChange('defaultReport', info)

      requestAnimationFrame(() => {
        self.initializeReportComponents(true)
      })
    }
  }

  async initializeReportComponents (mergeWithLatest?: boolean) {
    const self = this
    const token = this.getToken()

    /** IMPORTANT: Makes sure the UI is updated */
    requestAnimationFrame(() => {
      const { user } = self.props
      const { sourceCountry, selectedHierarchy, reportList } = self.props.config
      const { workflowEnableInfographicChoice } = self.props.config
      const langCode = getAppStore().getState().appContext.locale || 'en'

      const presetReports: any = document.getElementById(self.props.id + '_' + 'reports')
      if (presetReports) {
        presetReports.initialize(user.username, token, sourceCountry, selectedHierarchy, langCode, false, {})

        presetReports.style.width = '100%'
        presetReports.style.padding = '3px !important'
      }
      const wfReports: any = document.getElementById(self.props.id + '_' + 'wf-reports')
      if (wfReports) {
        const def = self.getDefaultReport()
        const defReport = (def) ? JSON.stringify(def) : undefined
        if (workflowEnableInfographicChoice) {
          const rList = (reportList && (reportList.public || reportList.user || reportList.shared || reportList.gallery)) ? reportList : {}
          wfReports.initialize(user.username, token, sourceCountry, selectedHierarchy, langCode, true, rList, defReport, mergeWithLatest)
          wfReports.style.width = '100%'
          wfReports.style.padding = '3px !important'
          wfReports.setAttribute('showCheckboxes', true)
        } else {
          wfReports.initialize(user.username, token, sourceCountry, selectedHierarchy, langCode, false, {}, defReport)
          wfReports.style.width = '100%'
          wfReports.style.padding = '3px !important'
          wfReports.setAttribute('showCheckboxes', false)
        }
      }
    })
  }

  showInfographicsLoading () {
    // display the busy spinner
    const busy = document.getElementById(this.props.id + '_loading-infos')
    if (busy) {
      busy.style.display = 'block'
    }
  }

  hideInfographicsLoading () {
    // hide the busy spinner
    const busy = document.getElementById(this.props.id + '_loading-infos')
    if (busy) {
      busy.style.display = 'hidden'
    }
  }

  async refreshInfographicReports () {
    this.showInfographicsLoading()
    await this.initializeReportComponents()
    this.hideInfographicsLoading()
  }

  toggleSidePopper = (name: string) => {
    // ensure other poppers are closed
    this.updateState('presetSearchSidePopper', false)
    this.updateState('presetBufferSidePopper', false)
    this.updateState('presetInfographicSidePopper', false)
    this.updateState('workflowSidePopper', false)
    this.updateState('workflowBufferSidePopper', false)
    this.updateState('workflowInfographicSidePopper', false)

    // open popper
    const isOpening: boolean = !this.state[name]
    this.updateState(name, !this.state[name])
    if (isOpening) {
      const refreshListAndMergeWithLatest = true
      setTimeout(() => { this.initializeReportComponents(refreshListAndMergeWithLatest) }, 0)
    }
    // TODO: update geography list
  }

  setSearchResultLabel = (str) => {
    const { id } = this.props
    const elem = document.getElementById(id + '_searchResult')
    if (elem) elem.innerText = str
  }

  onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    const self = this
    self._mapWidgetId = useMapWidgetIds[0]
    self.props.onSettingChange({
      id: self.props.id,
      useMapWidgetIds
    })
    if (useMapWidgetIds.length) {
      const mapWidget = useMapWidgetIds.toString()
      const appConfigActions = getAppConfigAction()
      const appConfig = appConfigActions.appConfig
      const widgetConfig = appConfig.widgets[useMapWidgetIds[0]].config
      self.props.onSettingChange({
        id: mapWidget,
        config: {
          ...widgetConfig,
          toolConfig: {
            ...widgetConfig.toolConfig,
            canSearch: false
          }
        }
      })
    }
  }

  localeString = (string) => {
    return this.props.intl.formatMessage({ id: string, defaultMessage: defaultMessages[string] })
  }

  getThemeObject = () => {
    return {
      brand: '#007F94',
      brandHover: '#00aabb',
      brandPress: '#00aabb',
      foreground1: '#181818ff',
      foreground2: '#4a4a4aff',
      text1: '#fafafaff',
      text2: '#a8a8a8ff',
      text3: '#ffffffff',
      border: '#a8a8a8',
      border2: '#929292ff',
      border3: '#181818',
      accordionBackground: '#4a4a4aff',
      accordionForeground: '#a8a8a8ff'
    }
  }

  onToggleInfograhicChoice (val: boolean) {
    const self = this
    this.onPropertyChange('workflowEnableInfographicChoice', val)

    requestAnimationFrame(() => {
      self.initializeReportComponents()
    })
  }

  stringifyTheme = () => {
    // Theme colors should match ExB
    const themeString = this.getThemeObject()
    return JSON.stringify(themeString)
  }

  onToggleEnableMapSearch = (checked) => {
    if (checked !== this.props.config.searchbarEnabled) {
      this.onPropertyChange('searchbarEnabled', checked)
    }
  }

  onSearchTypeChanged = (searchType, checked) => {
    const { baSearchType } = this.state
    switch (searchType) {
      case ('pointsOfInterest'): {
        let isChecked = checked
        const geogEnabled = baSearchType === BaSearchType.all || baSearchType === BaSearchType.boundaries
        if (!geogEnabled && !checked) {
          // force check on points (not able to have both un-checked)
          isChecked = true
        }
        this.updateState('pointsOfInterestChecked', isChecked)
        const searchType = isChecked ? geogEnabled ? BaSearchType.all : BaSearchType.locations : BaSearchType.boundaries
        const delay = () => {
          this.onPropertyChange('baSearchType', searchType)
          requestAnimationFrame(() => {
            this.renderBufferBtn()
          })
        }
        setTimeout(delay, 0)
        break
      }
      case ('geographies'): {
        let isChecked = checked
        const locsEnabled = baSearchType === BaSearchType.all || baSearchType === BaSearchType.locations
        if (!locsEnabled && !checked) {
          // force check on points (not able to have both un-checked)
          isChecked = true
        }
        this.updateState('geographiesChecked', isChecked)
        const searchType = isChecked ? locsEnabled ? BaSearchType.all : BaSearchType.boundaries : BaSearchType.locations
        const delay = () => { this.onPropertyChange('baSearchType', searchType) }
        setTimeout(delay, 0)
        break
      }
    }
  }

  toggleAllGeographyLevels = (checked) => {
    // turn all levels on/off
    if (!checked) {
      this.onPropertyChange('selectedGeographyLevels', [])
      this.updateState('activeGeographyLevels', [])
    } else {
      this.onPropertyChange('selectedGeographyLevels', this.props.config.availableGeographyLevels)
      this.updateState('activeGeographyLevels', this.state.availableGeographyLevels)
    }
  }

  renderBufferBtn = () => {
    const { stPresetBuffer, presetBuffersQueued } = this.state
    const { widgetMode } = this.props.config
    let disableBuffers = false

    if (widgetMode === Mode.Preset) {
      if (!presetBuffersQueued) {
        // if the location selected is a Boundary - we disable the Buffers button
        disableBuffers = false
        if (this.props.config.presetSearchSelectedObject) {
          const obj = JSON.parse(this.props.config.presetSearchSelectedObject)
          if (obj && (obj.type === 'geography' || !this.state.pointsOfInterestChecked)) {
            disableBuffers = true
          }
        }

        switch (stPresetBuffer) {
          case 'ring':
            return (
              <Button className='w-100 d-flex selectedStateButton' disabled={disableBuffers} style={{ flex: '1 1 auto', alignItems: 'stretch' }} onClick={() => { this.toggleSidePopper('presetBufferSidePopper') }}>
                <div className='d-flex' style={{ flex: '0 1 auto', alignItems: 'center' }}>
                  <Icon size='l' icon={RingsIcon} style={{ marginRight: '4px' }} />
                </div>
                <div className='d-flex' style={{ flex: '1 1 auto', textAlign: 'left', justifyContent: 'end', flexDirection: 'column' }}>
                  {this.localeString('rings')}
                </div>
              </Button>
            )
          case 'drivetime':
            return (
              <Button className='w-100 d-flex selectedStateButton' disabled={disableBuffers} style={{ flex: '1 1 auto', alignItems: 'stretch' }} onClick={() => { this.toggleSidePopper('presetBufferSidePopper') }}>
                <div className='d-flex' style={{ flex: '0 1 auto', alignItems: 'center' }}>
                  <Icon size='l' icon={DriveIcon} style={{ marginRight: '3px' }} />
                </div>
                <div className='d-flex' style={{ flex: '1 1 auto', textAlign: 'left', justifyContent: 'end', flexDirection: 'column' }}>
                  {this.localeString(InfoBufferType.drivetime)}
                </div>
              </Button>
            )
          case 'walktime':
            return (
              <Button className='w-100 d-flex selectedStateButton' disabled={disableBuffers} style={{ flex: '1 1 auto', alignItems: 'stretch' }} onClick={() => { this.toggleSidePopper('presetBufferSidePopper') }}>
                <div className='d-flex' style={{ flex: '0 1 auto', alignItems: 'center' }}>
                  <Icon size='l' icon={WalkIcon} style={{ marginRight: '2px' }} />
                </div>
                <div className='d-flex' style={{ flex: '1 1 auto', textAlign: 'left', justifyContent: 'end', flexDirection: 'column' }}>
                  {this.localeString(InfoBufferType.walktime)}
                </div>
              </Button>
            )
          default:
            break
        }
      } else {
        return (
          <Button type='tertiary' className='unselectedStateButtonDashed' onClick={() => { this.toggleSidePopper('presetBufferSidePopper'); this.onPropertyChange('presetBuffersAccepted', true) }} style={{ width: '100%' }}>
            {this.localeString('setBuffers')}
          </Button>
        )
      }
    }
  }

  clearSearchObj = () => {
    const { widgetMode } = this.props.config
    if (widgetMode === Mode.Preset) {
      this.onPropertyChange('presetSearchSelectedObject', null)
      this.updateState('presetShowSearchInput', true)
    } else {
      this.onPropertyChange('workflowSearchSelectedObject', null)
      this.updateState('workflowShowSearchInput', true)
    }
  }

  openDefaultInfographicPanel = () => {
    const { reportList, sourceCountry, selectedHierarchy } = this.props.config
    const { user } = this.props
    //populate list of selected infographics
    const elemId = this.props.id + '_' + 'def-selected-reports'
    const selectedList = { user: [], shared: [], public: [], gallery: [] }
    const self = this
    const langCode = getAppStore().getState().appContext.locale || 'en'
    const token = this.getToken()

    const _extract = (name, items?) => {
      if (reportList[name]) {
        const list = (items) || reportList[name]
        if (list && list.length > 0) {
          for (let ii = 0; ii < reportList[name].length; ii++) {
            const item = reportList[name][ii]
            if (item && item.isChecked) {
              selectedList[name].push(item)
            }
          }
        }
      }
    }
    ['user', 'shared', 'public'].forEach(o => { _extract(o) })
    if (reportList.gallery) { _extract('gallery', reportList.gallery.data) }

    const panel = this.getDefaultReportPanel()
    if (panel) {
      panel.style.display = 'block'
    }

    this._checkedItemsList = selectedList
    // Note: the report list may not exist when first opening the collapsablePanel
    // We need to let it instantiate before initialization
    function _delay () {
      // init report list to match our results
      const reports: any = document.getElementById(elemId)
      if (reports) {
        let def = self.getDefaultReport()
        if (def) { def = JSON.stringify(def) }
        reports.initialize(user.username, token, sourceCountry, selectedHierarchy, langCode, false, selectedList, def)
      }
    }
    setTimeout(_delay, 0)
  }

  closeDefaultReportPanel = () => {
    const self = this
    requestAnimationFrame(() => {
      const panel = self.getDefaultReportPanel()
      if (panel) {
        panel.style.display = 'none'
      }
    })
  }

  // setTravelModeDefaults = () => {
  //   // console.log('%c onChangeDrivetimeToggle', 'color:pink;font-size:13pt')
  // }

  onChangeDrivetimeToggle = (value: any) => {
    // console.log('%c onChangeDrivetimeToggle', 'color:pink;font-size:13pt')
    const checked: boolean = value === true
    this.onPropertyChange('displayDrivetimeOptions', checked)
    // TM
    // if (checked && !this.state.drivetimeHasBeenUsed) {
    //   this.setTravelModeDefaults()
    //   this.updateState('drivetimeHasBeenUsed', true)
    // }
  }

  onSettingsDefaultReportSelected = (ev) => {
    // user chose report as default
    const id = ev.detail?.id
    const name = ev.detail?.name

    if (id && name) {
      this.onDefaultInfographicChanged({ id, name })
    }
    this.closeDefaultReportPanel()
  }

  resetDefaultReport = () => {
    const self = this
    function _delay () {
      self.onDefaultInfographicChanged({ id: undefined, name: undefined })
      self.closeDefaultReportPanel()
    }
    setTimeout(_delay, 0)
  }

  getDefaultReportPanel = () => {
    const { id } = this.props
    const elemId = id + '_' + 'def-selected-reports'
    const panel: any = document.getElementById(elemId)
    return panel
  }

  _defaultReportIsValid = (report) => {
    return (report && report.id && report.id.length > 0 && report.name && report.name.length > 0)
  }

  getDefaultReport = () => {
    let result
    const { defaultReport } = this.props.config

    if (this._defaultReportIsValid(defaultReport)) {
      result = {
        id: defaultReport.id,
        name: defaultReport.name
      }
    }
    return result
  }

  getDefaultReportLabel = () => {
    let name
    const { defaultReport } = this.props.config

    if (defaultReport && this._defaultReportIsValid(defaultReport)) {
      name = defaultReport.name
    } else { name = this.localeString('selectDefaultInfographic') }
    return name
  }

  render () {
    const {
      selectedCountry, activeGeographyLevels, geographiesChecked, pointsOfInterestChecked, presetBuffersQueued,
      maxDriveBuffer, maxWalkBuffer, stViewMode, portalHelpUrl, availableHierarchies, selectedHierarchyObj
    } = this.state

    const {
      reportList, drawPointEnabled, searchbarEnabled, drawPolygonEnabled, showIncrementButtons, displayDrivetimeOptions,
      drivingMode, travelDirection, useTrafficChecked, trafficType, offsetTime, offsetDay, offsetHr,
      workflowEnableUserConfigBuffers, workflowAvailableBufferRings, workflowBuffer, workflowRingsBuffer1,
      workflowRingsBuffer2, workflowRingsBuffer3, workflowRingsBufferUnit, workflowAvailableBufferDrivetime,
      workflowDrivetimeBuffer1, workflowDrivetimeBuffer2, workflowDrivetimeBuffer3, workflowDrivetimeBufferUnit,
      workflowAvailableBufferWalktime, workflowEnableInfographicChoice, workflowIntroTextReportCheckbox,
      workflowIntroTextReports, workflowWalktimeBuffer1, workflowWalktimeBuffer2, workflowWalktimeBuffer3,
      workflowWalktimeBufferUnit, workflowIntroTextBuffersCheckbox, workflowIntroTextBuffers, workflowEnableSearch,
      workflowDisplayIntroText, workflowIntroText, widgetMode, igBackgroundColor, runReportOnClick, imageExport,
      dynamicHtml, excel, pdf, fullscreen, zoomLevel, displayHeader, headerColor, headerTextColor, sourceCountry,
      widgetPlaceholderText, widgetPlaceholderTextToggle, workflowSearchSelectedObject, presetSearchSelectedObject,
      presetSelectedReport, presetSelectedReportName, workflowSelectedReport
    } = this.props.config

    const {
      stPresetBuffer, stPresetRingsBuffer1, stPresetRingsBuffer2, stPresetRingsBuffer3, stPresetRingsBufferUnit,
      stPresetDrivetimeBuffer1, stPresetDrivetimeBuffer2, stPresetDrivetimeBuffer3, stPresetDrivetimeBufferUnit,
      stPresetWalktimeBuffer1, stPresetWalktimeBuffer2, stPresetWalktimeBuffer3, stPresetWalktimeBufferUnit,
      countries, modePopperOpen, settingsOpen, presetSearchSidePopper, allowInfographicChoiceIconOpen,
      workflowInfographicSidePopper, presetInfographicSidePopper, presetBufferSidePopper, workflowBufferSidePopper,
      allowBufferInfoIconOpen, presetShowSearchInput, workflowSearchSidePopper, allowSearchInfoIconOpen,
      stDrivingMode, stTravelDirection, stTrafficType, stOffsetTime, stOffsetDay, stOffsetHr,
      workflowShowSearchInput, stUseTrafficChecked
    } = this.state

    const { theme, useMapWidgetIds, user, id } = this.props

    // TM
    // const travelModeDefaults: TravelModeOptions = {
    //   mode: DrivingMode.driving,
    //   direction: TravelDirection.toward
    // }
    const _useTrafficEnabled = true
    const langCode = getAppStore().getState().appContext.locale || 'en'
    const token = this.getToken()
    const presetSearchObj = presetSearchSelectedObject ? JSON.parse(presetSearchSelectedObject) : ''
    const workflowSearchObj = workflowSearchSelectedObject ? JSON.parse(workflowSearchSelectedObject) : ''

    const validSelectedHierarchyID = (selectedHierarchyObj && availableHierarchies && availableHierarchies.find((h) => h.ID === selectedHierarchyObj.ID)) ? selectedHierarchyObj.ID : undefined

    // console.log('%c SETTING RENDER...', 'color:orange;font-size:14pt')
    const style = css`
          .widget-setting-get-map-coordinates {
            .checkbox-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
          }

          .bufferInput {
            width: 20% !important;
          }

          .bufferUnits {
            width: 40% !important;
          }
        `
    const self = this
    const isUsingBuffers = () => {
      return true
    }

    const onAllowWorkflowSearch = (flag) => {
      const self = this
      const originalState = flag
      requestAnimationFrame(() => {
        if (originalState) {
          self.updateState('baSearchType', self.props.config.baSearchType || BaSearchType.all)
        } else {
          self.onPropertyChange('baSearchType', BaSearchType.all)
        }
        const changeArr = [
          { name: 'workflowSearchSelectedObject', value: null },
          { name: 'workflowEnableSearch', value: originalState },
          { name: '' }
        ]
        self.onMultiplePropertyChange(changeArr)
        if (originalState) {
          self.updateState('workflowShowSearchInput', true)
        }
      })
    }
    const onClickSelectDefaultReport = (ev) => {
      if (!this._ignoreNextDefaultClick) {
        this.openDefaultInfographicPanel()
      }
      this._ignoreNextDefaultClick = false
    }
    const onClickClearDefaultReport = (ev) => {
      this.resetDefaultReport()
      this._ignoreNextDefaultClick = true
    }
    const learnMoreUrl = window.jimuConfig.isInPortal ? portalHelpUrl : 'https://links.esri.com/ba-exb/modes'

    const modeLabel = (
      <div className='w-100 d-flex'>
        <div className='text-truncate p-1'>
          {this.localeString('mode')}
        </div>
        <React.Fragment>
          <Button
            type='tertiary'
            className='widget-help-btn' icon size='sm'
            onClick={() => { this.updateState('modePopperOpen', !modePopperOpen) }}
            onMouseEnter={() => { this.updateState('modePopperOpen', true) }}
            ref={this.modeInfoRef as React.RefObject<HTMLButtonElement>}
          >
            <InfoOutlined />
            {/* <span className='sr-only'>{this.localeString('modeInfo')}</span> */}
            <Popper
              showArrow
              css={popperStyles}
              open={modePopperOpen}
              placement='right'
              offset={[0, 10]}
              reference={this.modeInfoRef}
              toggle={() => { this.updateState('modePopperOpen', false) }}
            >
              <h5>{this.localeString('mode')}</h5>
              <p>{this.localeString('modeInfoLine1')}</p>
              <p>{this.localeString('modeInfoLine2')}</p>
              <Button className='float-right' type='primary' size='sm' href={learnMoreUrl} target='_blank'>
                {this.localeString('learnMore')}
              </Button>
            </Popper>
          </Button>
        </React.Fragment>
      </div>
    )

    const popperOuterStyle: React.CSSProperties = {
      padding: '12px !important'
    }
    const viewModeValue: string = (stViewMode != null && stViewMode !== 'auto') ? stViewMode : ViewMode.Auto

    const pinIcon = PinEsriOutlined
    const polygonIcon = PolygonOutlined
    const searchIcon = SearchOutlined

    const infographicsLoadingSpinner: React.CSSProperties = {
      position: 'relative',
      top: '0px',
      left: 'calc(50% - 16px)',
      transform: 'scale(0.8)',
      width: '24px',
      height: '24px',
      display: 'hidden',
      marginBottom: '20px'
    }

    const timeOffsets = [
      { value: 0, label: this.localeString('now') },
      ...Array.from({ length: 48 }, (_, index) => {
        const minutes = (index + 1) * 15
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return {
          value: minutes,
          label: hours > 0
            ? `+${hours} ${this.localeString('offsetHr')} ${mins > 0 ? mins + ' ' + this.localeString('min') : ''}`
            : `+${mins} ${this.localeString('min')}`
        }
      })
    ]

    // Days of the week
    const daysOfWeek = [
      this.localeString('mon'),
      this.localeString('tues'),
      this.localeString('wed'),
      this.localeString('thurs'),
      this.localeString('fri'),
      this.localeString('sat'),
      this.localeString('sun')
    ]

    // Generate time options in 15-minute increments up to 24 hours
    const timeOptions = Array.from({ length: 96 }, (_, index) => {
      const totalMinutes = index * 15
      const hours24 = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60
      const hours12 = hours24 % 12 || 12 // Convert to 12-hour format, treating 0 as 12
      const period = hours24 < 12 ? 'AM' : 'PM' // Determine AM/PM
      const formattedTime = `${hours12}:${minutes < 10 ? '0' : ''}${minutes} ${period}`

      return {
        value: formattedTime,
        label: formattedTime
      }
    })

    // console.log('%c SETTING RENDER stPresetBuffer=','color:yellow;font-size:13pt;', stPresetBuffer)

    return (
      <div css={getStyle(theme)}>
        <div className='widget-setting-bao' style={{ display: 'relative' }}>
          {/* Select Mode */}
          <SettingSection className='map-selector-section' title={modeLabel}>
            <div className='mode-group w-100 mt-1'>
              <div className='d-flex justify-content-between w-100'>
                <Button onClick={(e: any) => { this.onPropertyChange('widgetMode', e.currentTarget.value) }} name='mode' value={Mode.Workflow} type='tertiary' vertical={true} title={this.localeString('workflowIcon')}>
                  <Icon autoFlip className={`mode-img mode-img-h ${widgetMode === Mode.Workflow && 'active'}`} icon={require('./assets/Workflow108x80.svg')} />
                  {this.localeString('workflow')}
                </Button>
                <Button onClick={(e: any) => { this.onPropertyChange('widgetMode', e.currentTarget.value) }} name='mode' value={Mode.Preset} type='tertiary' vertical={true} title={this.localeString('presetIcon')} >
                  <Icon autoFlip className={`mode-img mode-img-h ${widgetMode === Mode.Preset && 'active'}`} icon={require('./assets/InfographicPreset108x80.svg')} />
                  {this.localeString('preset')}
                </Button>
              </div>
            </div>
          </SettingSection>

          {/* Default Setting */}

          {widgetMode === Mode.Preset &&
            <SettingSection>
              <SettingRow>
                <Checkbox style={{ cursor: 'pointer' }} className='mr-2' checked={widgetPlaceholderTextToggle} onChange={e => { this.onPropertyChange('widgetPlaceholderTextToggle', e.target.checked) }} />
                {this.localeString('introTextCheckbox')}
              </SettingRow>
              <TextArea className='w-100 mt-2' spellCheck={true} height={80} value={widgetPlaceholderText} onChange={e => { this.onPropertyChange('widgetPlaceholderText', e.target.value) }} />
            </SettingSection>
          }
          {/* Link Map Widget */}
          <SettingSection className='map-selector-section' title={this.localeString('selectMapWidget')}>
            <React.Fragment>
              <div css={style}>
                <div className='widget-setting-get-map-coordinates'>
                  <SettingRow>
                    <MapWidgetSelector onSelect={this.onMapWidgetSelected} useMapWidgetIds={useMapWidgetIds} />
                  </SettingRow>
                  {useMapWidgetIds && useMapWidgetIds.length > 0 && (widgetMode === Mode.Workflow || widgetMode === Mode.Preset) && (
                    <div className='drawnGraphicContainer'>
                      <div className='d-flex mt-4' >
                        <Icon size='m' icon={searchIcon} style={{ marginLeft: '3px' }} ></Icon>
                        <label className='ml-2'>
                          {this.localeString('showSearchButton')}
                        </label>
                        <Switch
                          aria-label={this.localeString('showSearchButton')}
                          className='ml-auto'
                          checked={searchbarEnabled}
                          onChange={(e) => { this.onToggleEnableMapSearch(e.target.checked) }}
                        />
                      </div>
                    </div>
                  )}

                  {useMapWidgetIds && useMapWidgetIds.length > 0 && widgetMode === Mode.Workflow && (
                    <div className='drawnGraphicContainer'>
                      <SettingRow role='group' aria-label={this.localeString('drawingToolsTips')} flow='wrap' className='d-block' label={this.localeString('drawingToolsTips')}>
                      </SettingRow>
                      <div className='d-flex mt-2'>
                        <Icon size='l' icon={pinIcon}></Icon>
                        <label className='ml-2'>
                          {this.localeString('drawModePoint')}
                        </label>
                        <Switch
                          aria-label={this.localeString('drawModePoint')}
                          className='ml-auto'
                          checked={drawPointEnabled}
                          onChange={e => { this.onPropertyChange('drawPointEnabled', e.target.checked) }}
                        />
                      </div>
                      <div className='d-flex mt-2'>
                        <Icon size='l' icon={polygonIcon}></Icon>
                        <label className='ml-2'>
                          {this.localeString('drawModePolygon')}
                        </label>
                        <Switch
                          aria-label={this.localeString('drawModePolygon')}
                          className='ml-auto'
                          checked={drawPolygonEnabled}
                          onChange={e => { this.onPropertyChange('drawPolygonEnabled', e.target.checked) }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </React.Fragment>
          </SettingSection>

          {/* Location Settings */}
          <SettingSection title={<div className='w-100 d-flex' style={{ height: '23px', flexFlow: 'column wrap', alignContent: 'space-between' }}>
            <div className='text-truncate py-1'>
              {this.localeString('locationSettings')}
            </div>
          </div>}>
            <SettingRow flow='wrap' label={this.localeString('selectCountry')}>
              <Select name='sourceCountry' size='sm' value={selectedCountry} onChange={e => { this.updateSelectedCountry(e.target.value) }}>
                {countries && countries.map((country) => {
                  return (
                    <option key={country.id} value={country.id}>{country.name}</option>
                  )
                })}
              </Select>
            </SettingRow>
            {availableHierarchies && availableHierarchies.length > 1 &&
            <SettingRow flow='wrap' label={this.localeString('data-source')}>
              <Select name='selectedHierarchy' size='sm' value={validSelectedHierarchyID} onChange={this.onDataSourceChange}>
                {availableHierarchies && availableHierarchies.map((h) => {
                  return (
                    <option key={h.ID} value={h.ID}>{h.alias}</option>
                  )
                })}
              </Select>
            </SettingRow>
            }
            {widgetMode === Mode.Preset
              ? <React.Fragment>
                <SettingRow>
                  {presetSearchObj && (presetSearchObj.name || presetSearchObj.address)
                    ? <Button className='w-100 d-flex selectedStateButton' style={{ flex: '1 1 auto', alignItems: 'stretch' }} onClick={() => { this.toggleSidePopper('presetSearchSidePopper') }}>
                      <div className='d-flex' style={{ flex: '0 1 auto', alignItems: 'center' }}>
                        <Icon size='l' icon={presetSearchObj.type === 'location' ? PinEsriOutlined : PolygonOutlined} />
                      </div>
                      <div className='d-flex' style={{ flex: '1 1 auto', textAlign: 'left', justifyContent: 'end', flexDirection: 'column' }}>
                        {presetSearchObj.type === 'location' ? presetSearchObj.address : presetSearchObj.name}
                      </div>
                    </Button>
                    : <Button type='tertiary' className='unselectedStateButtonDashed' onClick={() => { this.toggleSidePopper('presetSearchSidePopper') }}>
                      {this.localeString('setLocation')}
                    </Button>
                  }
                </SettingRow>
                {presetSearchSidePopper && (
                  <SidePopper isOpen title={this.localeString('setLocation')} position='right' toggle={() => { this.toggleSidePopper('presetSearchSidePopper') }} trigger={this.sidePopperTrigger?.current}>
                    <div className='p-4'>
                      <SettingRow className='mt-4' label={this.localeString('presetLocationLabel')} />
                      <SettingRow>
                        {presetSearchObj && !presetShowSearchInput
                          ? <Button className='w-100 d-flex selectedStateButton' style={{ flex: '1 1 auto', alignItems: 'stretch' }} onClick={() => { this.clearSearchObj() }} >
                            <div className='d-flex' style={{ flex: '0 1 auto', alignItems: 'center' }}>
                              <Icon size='l' icon={presetSearchObj.type === 'location' ? PinEsriOutlined : PolygonOutlined} />
                            </div>
                            <div className='d-flex' style={{ flex: '1 1 auto', textAlign: 'left', justifyContent: 'end', flexDirection: 'column' }}>
                              {presetSearchObj.type === 'location' ? presetSearchObj.address : presetSearchObj.name}
                            </div>
                            <span className='d-flex justify-content-center' style={{ margin: 'auto 0', alignItems: 'right' }} title={this.localeString('clearSearch')}>
                              <Icon size='s' icon={CloseOutlined} />
                            </span>
                          </Button>
                          : <ArcgisBaSearch
                            id={id + '_' + 'preset_search'}
                            className='w-100'
                            style={{ position: 'relative', width: '100%' }}
                            username={user.username}
                            mode={widgetMode}
                            searchtype={BaSearchType.all}
                            env={window.jimuConfig.hostEnv}
                            geoenrichmentUrl={this.state.geoenrichmentServiceUrl ? this.state.geoenrichmentServiceUrl : null}
                            geocodeUrl={this.state.geocodeUrl ? this.state.geocodeUrl : null}
                            token={token}
                            sourceCountry={selectedCountry}
                            selectedHierarchy={selectedHierarchyObj.ID}
                            langCode={langCode}
                            activeLevels={JSON.stringify(this.state.activeGeographyLevels)}
                            colors={this.stringifyTheme()}
                            theme={2}
                            onSearchResults={ev => { this.baSearchResultsHandler(ev) }} />
                        }
                      </SettingRow>
                    </div>
                  </SidePopper>
                )}
              </React.Fragment>
              : <React.Fragment>
                <SettingRow>
                  {workflowSearchObj && (workflowSearchObj.name || workflowSearchObj.address)
                    ? <Button className='w-100 d-flex selectedStateButton' style={{ flex: '1 1 auto', alignItems: 'stretch' }} onClick={() => { this.toggleSidePopper('workflowSearchSidePopper') }}>
                      <div className='d-flex' style={{ flex: '0 1 auto', alignItems: 'center' }}>
                        <Icon size='l' icon={workflowSearchObj.type === 'location' ? PinEsriOutlined : PolygonOutlined} />
                      </div>
                      <div className='d-flex' style={{ flex: '1 1 auto', textAlign: 'left', justifyContent: 'end', flexDirection: 'column' }}>
                        {workflowSearchObj.type === 'location' ? workflowSearchObj.address : workflowSearchObj.name}
                      </div>
                    </Button>
                    : <Button type='tertiary' className='unselectedStateButtonDashed' onClick={() => { this.toggleSidePopper('workflowSearchSidePopper') }}>
                      {this.localeString('customizeSearch')}
                    </Button>
                  }

                </SettingRow>
                {workflowSearchSidePopper && (
                  <SidePopper isOpen title={this.localeString('customizeSearchBtn')} position='right' toggle={() => { this.toggleSidePopper('workflowSearchSidePopper') }} trigger={this.sidePopperTrigger?.current}>
                    <div className='p-4'>
                      <SettingRow label={
                        <React.Fragment>
                          {this.localeString('allowRuntimeSearch')}
                          <Button type='tertiary' className='widget-help-btn' icon size='sm' onClick={() => { this.updateState('allowSearchInfoIconOpen', !allowSearchInfoIconOpen) }} onMouseEnter={() => { this.updateState('allowSearchInfoIconOpen', true) }} onMouseLeave={() => { this.updateState('allowSearchInfoIconOpen', false) }} ref={this.allowSearchInfoRef as React.RefObject<HTMLButtonElement>} >
                            <InfoOutlined />
                            <span className='sr-only'>
                              {this.localeString('introTextWithDraw')}
                            </span>
                            <Popper showArrow css={popperStyles} open={allowSearchInfoIconOpen} placement='right' offset={[0, 10]} reference={this.allowSearchInfoRef} toggle={() => { this.updateState('allowSearchInfoIconOpen', false) }}>
                              <h5>{this.localeString('allowRuntimeSearch')}</h5>
                              <p>{this.localeString('allowRuntimeSearchInfo')}</p>
                            </Popper>
                          </Button>
                        </React.Fragment>
                      }>
                        <Switch className='can-x-switch' data-key='workflowEnableSearch' checked={workflowEnableSearch} onChange={e => { onAllowWorkflowSearch(e.target.checked) }} />
                      </SettingRow>
                      {workflowEnableSearch
                        ? <React.Fragment>
                          {this.localeString('userConfigLocationDesc')}
                          <SettingRow>
                            <Checkbox style={{ cursor: 'pointer' }} className='mr-2' checked={workflowDisplayIntroText} onChange={e => { this.onPropertyChange('workflowDisplayIntroText', e.target.checked) }} />
                            {this.localeString('introTextCheckbox')}
                          </SettingRow>
                          <TextArea className='w-100 mt-2' spellCheck={true} height={80} value={workflowIntroText} onChange={e => { this.onPropertyChange('workflowIntroText', e.target.value) }} />
                        </React.Fragment>
                        : this.localeString('userConfigLocationDescOff')
                      }
                      {!workflowEnableSearch && (
                        <React.Fragment>
                          <SettingRow className='mt-4' label={this.localeString('customExtentBoundary')} />
                          <SettingRow>

                            {workflowSearchObj && !workflowShowSearchInput
                              ? <Button className='w-100 d-flex selectedStateButton' style={{ flex: '1 1 auto', alignItems: 'stretch' }} onClick={() => { this.clearSearchObj() }} >
                                <div className='d-flex' style={{ flex: '0 1 auto', alignItems: 'center' }}>
                                  <Icon size='l' icon={workflowSearchObj.type === 'location' ? PinEsriOutlined : PolygonOutlined} />
                                </div>
                                <div className='d-flex' style={{ flex: '1 1 auto', textAlign: 'left', justifyContent: 'end', flexDirection: 'column' }}>
                                  {workflowSearchObj.type === 'location' ? workflowSearchObj.address : workflowSearchObj.name}
                                </div>
                                <span className='d-flex justify-content-center' style={{ margin: 'auto 0', alignItems: 'right' }} title={this.localeString('clearSearch')}>
                                  <Icon size='s' icon={CloseOutlined} />
                                </span>
                              </Button>
                              : <ArcgisBaSearch
                                id={id + '_workflow_search'}
                                className='w-100'
                                style={{ position: 'relative', width: '100%' }}
                                username={user.username}
                                mode={widgetMode}
                                env={window.jimuConfig.hostEnv}
                                geoenrichmentUrl={this.state.geoenrichmentServiceUrl ? this.state.geoenrichmentServiceUrl : null}
                                geocodeUrl={this.state.geocodeUrl ? this.state.geocodeUrl : null}
                                token={token}
                                searchtype={BaSearchType.all}
                                sourceCountry={selectedCountry}
                                selectedHierarchy={selectedHierarchyObj?.ID}
                                langCode={langCode}
                                activeLevels={JSON.stringify(this.state.activeGeographyLevels)}
                                colors={this.stringifyTheme()}
                                theme={2}
                                onSearchResults={ev => { this.baSearchResultsHandler(ev) }} />
                            }
                          </SettingRow>
                        </React.Fragment>
                      )}

                      {workflowEnableSearch && widgetMode === Mode.Workflow && (
                        <React.Fragment>
                          <SettingRow className="pt-4" label={this.localeString('searchControl')} />
                          <SettingRow>
                            <Label check centric>
                              {/* Points of Interest checkbox */}
                              <Checkbox style={{ cursor: 'pointer' }} className='mr-2'
                                checked={pointsOfInterestChecked} onChange={e => { this.onSearchTypeChanged('pointsOfInterest', e.target.checked) }} />
                              {this.localeString('pointsOfInterest')}

                            </Label>
                          </SettingRow>
                          <SettingRow>
                            {/* Geographies checkbox */}
                            <Label check centric>
                              <Checkbox style={{ cursor: 'pointer' }} className='mr-2'
                                checked={geographiesChecked} onChange={e => {
                                  this.toggleAllGeographyLevels(e.target.checked)
                                  this.onSearchTypeChanged('geographies', e.target.checked)
                                }} />
                              {this.localeString('geographies')}
                            </Label>
                          </SettingRow>

                          {/* GEOGRAPHY LEVELS */}
                          {this.state.availableGeographyLevels &&
                            this.state.availableGeographyLevels.map(level => {
                              const isSelected = activeGeographyLevels.find(o => o === level)
                              return (
                                <SettingRow>
                                  <Label check centric>
                                    <Checkbox style={{ cursor: 'pointer' }} checked={isSelected}
                                      onChange={e => {
                                        const level = e.target.labels[0].innerText
                                        this.updateGeographyLevels({ level }, !this.isGeographyLevelSelected(level))
                                      }} className='ml-4 mr-2' />
                                    {level}
                                  </Label>
                                </SettingRow>
                              )
                            })}
                        </React.Fragment>
                      )}
                    </div>
                  </SidePopper>
                )}
              </React.Fragment>
            }
          </SettingSection>

          {/* Customize Buffers  */}
          {(isUsingBuffers() && widgetMode === Mode.Preset)
            ? <SettingSection title={<div className='w-100 d-flex' style={{ height: '23px', flexFlow: 'column wrap', alignContent: 'space-between' }}>
              <div className='text-truncate py-1'>
                {this.localeString('buffersLabel')}
              </div>
            </div>}>
              <SettingRow flow='wrap'>
                {this.renderBufferBtn()}
              </SettingRow>

              {presetBufferSidePopper && (
                <SidePopper isOpen title={this.localeString('setBuffers')} position='right' toggle={() => { this.toggleSidePopper('presetBufferSidePopper') }} trigger={this.sidePopperTrigger?.current}>
                  <div className="p-4" style={popperOuterStyle}>
                    <SettingRow>
                      <Label centric>
                        {this.localeString('selectPresetBuffer')}
                      </Label>
                    </SettingRow>
                    <SettingRow>
                      <Label check centric>
                        <Radio name='stPresetBuffer' style={{ cursor: 'pointer' }} value={InfoBufferType.ring} className='mr-2' checked={stPresetBuffer === InfoBufferType.ring} onChange={(e) => { this.handleBufferChange(e.currentTarget.name, e.currentTarget.value, InfoBufferType.ring) }} />
                        {this.localeString('rings')}
                      </Label>
                    </SettingRow>
                    <div css={style} className='m-2'>
                      <SettingRow flow='no-wrap' className='w-100 d-flex'>
                        <NumericInput min='0.1' max={MaxBuffers.Rings} showHandlers={false} name='stPresetRingsBuffer1' data-key='stPresetRingsBuffer1' className='bufferInput' size='sm' value={stPresetRingsBuffer1} onChange={(buffer) => { this.handleBufferChange('stPresetRingsBuffer1', buffer, InfoBufferType.ring) }} />
                        <NumericInput min='0.1' max={MaxBuffers.Rings} showHandlers={false} name='stPresetRingsBuffer2' data-key='stPresetRingsBuffer2' className='bufferInput mx-1' size='sm' value={stPresetRingsBuffer2} onChange={(buffer) => { this.handleBufferChange('stPresetRingsBuffer2', buffer, InfoBufferType.ring) }} />
                        <NumericInput min='0.1' max={MaxBuffers.Rings} showHandlers={false} name='stPresetRingsBuffer3' data-key='stPresetRingsBuffer3' className='bufferInput' size='sm' value={stPresetRingsBuffer3} onChange={(buffer) => { this.handleBufferChange('stPresetRingsBuffer3', buffer, InfoBufferType.ring) }} />
                        <Select name='stPresetRingsBufferUnit' className='bufferUnits ml-1' size='sm' value={stPresetRingsBufferUnit} onChange={(e) => { this.handleBufferChange('stPresetRingsBufferUnit', e.currentTarget.value, InfoBufferType.ring) }}>
                          <option value='miles'>{this.localeString('milesLow')}</option>
                          <option value='kilometers'>{this.localeString('kilometerLow')}</option>
                        </Select>
                      </SettingRow>
                    </div>
                    <SettingRow>
                      <Label check centric>
                        <Radio name='stPresetBuffer' style={{ cursor: 'pointer' }} value={InfoBufferType.drivetime} className='mr-2' checked={stPresetBuffer === InfoBufferType.drivetime} onChange={e => { this.handleBufferChange(e.currentTarget.name, e.currentTarget.value, InfoBufferType.drivetime) }} />
                        {this.localeString(InfoBufferType.drivetime)}
                      </Label>
                    </SettingRow>
                    <div css={style} className='m-2'>
                      <SettingRow flow='no-wrap' className='w-100 d-flex'>
                        <NumericInput min='1' max={maxDriveBuffer} showHandlers={false} name='stPresetDrivetimeBuffer1' data-key='stPresetDrivetimeBuffer1' className='bufferInput' size='sm' value={stPresetDrivetimeBuffer1} onChange={(buffer) => { this.handleBufferChange('stPresetDrivetimeBuffer1', buffer, InfoBufferType.drivetime) }} />
                        <NumericInput min='1' max={maxDriveBuffer} showHandlers={false} name='stPresetDrivetimeBuffer2' data-key='stPresetDrivetimeBuffer2' className='bufferInput mx-1' size='sm' value={stPresetDrivetimeBuffer2} onChange={(buffer) => { this.handleBufferChange('stPresetDrivetimeBuffer2', buffer, InfoBufferType.drivetime) }} />
                        <NumericInput min='1' max={maxDriveBuffer} showHandlers={false} name='stPresetDrivetimeBuffer3' data-key='stPresetDrivetimeBuffer3' className='bufferInput' size='sm' value={stPresetDrivetimeBuffer3} onChange={(buffer) => { this.handleBufferChange('stPresetDrivetimeBuffer3', buffer, InfoBufferType.drivetime) }} />
                        <Select name='stPresetDrivetimeBufferUnit' className='bufferUnits ml-1' size='sm' value={stPresetDrivetimeBufferUnit} onChange={(e) => { this.handleBufferChange('stPresetDrivetimeBufferUnit', e.currentTarget.value, InfoBufferType.drivetime) }}>
                          <option value='minutes'>{this.localeString('minuteLow')}</option>
                          <option value='miles'>{this.localeString('milesLow')}</option>
                          <option value='kilometers'>{this.localeString('kilometerLow')}</option>
                        </Select>
                      </SettingRow>
                    </div>
                    <SettingRow>
                      <Label check centric>
                        <Radio name='stPresetBuffer' style={{ cursor: 'pointer' }} value={InfoBufferType.walktime} className='mr-2' checked={stPresetBuffer === InfoBufferType.walktime} onChange={e => { this.handleBufferChange(e.currentTarget.name, e.currentTarget.value, InfoBufferType.walktime) }} />
                        {this.localeString(InfoBufferType.walktime)}
                      </Label>
                    </SettingRow>
                    <div css={style} className='m-2'>
                      <SettingRow flow='no-wrap' className='w-100 d-flex mt-2'>
                        <NumericInput min='1' max={maxWalkBuffer} showHandlers={false} name='stPresetWalktimeBuffer1' data-key='stPresetWalktimeBuffer1' className='bufferInput' size='sm' value={stPresetWalktimeBuffer1} onChange={(buffer) => { this.handleBufferChange('stPresetWalktimeBuffer1', buffer, InfoBufferType.walktime) }} />
                        <NumericInput min='1' max={maxWalkBuffer} showHandlers={false} name='stPresetWalktimeBuffer2' data-key='stPresetWalktimeBuffer2' className='bufferInput mx-1' size='sm' value={stPresetWalktimeBuffer2} onChange={(buffer) => { this.handleBufferChange('stPresetWalktimeBuffer2', buffer, InfoBufferType.walktime) }} />
                        <NumericInput min='1' max={maxWalkBuffer} showHandlers={false} name='stPresetWalktimeBuffer3' data-key='stPresetWalktimeBuffer3' className='bufferInput' size='sm' value={stPresetWalktimeBuffer3} onChange={(buffer) => { this.handleBufferChange('stPresetWalktimeBuffer3', buffer, InfoBufferType.walktime) }} />
                        <Select name='stPresetWalktimeBufferUnit' className='bufferUnits ml-1' size='sm' value={stPresetWalktimeBufferUnit} onChange={(e) => { this.handleBufferChange('stPresetWalktimeBufferUnit', e.currentTarget.value, InfoBufferType.walktime) }}>
                          <option value='minutes'>{this.localeString('minuteLow')}</option>
                          <option value='miles'>{this.localeString('milesLow')}</option>
                          <option value='kilometers'>{this.localeString('kilometerLow')}</option>
                        </Select>
                      </SettingRow>
                    </div>

                    {/* Preset Drivetime Options - - - - - - - - - - - - - - - - - - - - */}
                    {stPresetBuffer === InfoBufferType.drivetime && (
                      <div className='pt-2'>
                        {this.localeString('mode')}
                        <div className='pt-1'>
                          {/* Driving Mode */}
                          <Select
                            name='drivingMode'
                            size='sm'
                            value={stDrivingMode}
                            onChange={(e) => { this.updateBufferValue('stDrivingMode', e.currentTarget.value) }}
                          >
                            <option value={DrivingMode.driving}>{this.localeString('drivingTime')}</option>
                            <option value={DrivingMode.rural}>{this.localeString('ruralDrivingTime')}</option>
                            <option value={DrivingMode.trucking}>{this.localeString('truckingTime')}</option>
                          </Select>
                        </div>
                        {/* Travel Direction - Away */}
                        <div style={{ color: '#fff' }} className='ml-3 pt-2'>
                          <Label check centric>
                            <Radio
                              name='travelDirection'
                              style={{ cursor: 'pointer' }}
                              value={TravelDirection.away}
                              className='mr-2'
                              checked={stTravelDirection === TravelDirection.away}
                              onChange={(e) => { this.updateBufferValue('stTravelDirection', e.currentTarget.value) }}
                            />
                            {this.localeString('awayFacility')}
                          </Label>
                        </div>
                        {/* Travel Direction - Toward */}
                        <div style={{ color: '#fff' }} className='ml-3 pt-1'>
                          <Label check centric>
                            <Radio
                              name='travelDirection'
                              style={{ cursor: 'pointer' }}
                              value={TravelDirection.toward}
                              className='mr-2'
                              checked={stTravelDirection === TravelDirection.toward}
                              onChange={(e) => { this.updateBufferValue('stTravelDirection', e.currentTarget.value) }}
                            />
                            {this.localeString('towardFacility')}
                          </Label>
                        </div>
                        {/* Use Traffic Checkbox */}
                        <div className='pt-3'>
                          <Label check centric>
                            <Checkbox
                              style={{ cursor: 'pointer' }}
                              className='mr-2'
                              checked={stUseTrafficChecked === true}
                              onChange={e => {
                                this.updateBufferValue('stUseTrafficChecked', e.target.checked)
                              }}
                            />
                            {this.localeString('useTraffic')}
                          </Label>
                        </div>
                        {/* Traffic Options */}
                        {_useTrafficEnabled && (
                          <Tabs
                            className='h-100 pt-2'
                            type='pills'
                            fill
                            defaultValue={TrafficType.live}
                            value={stTrafficType}
                            onChange={tt => {
                              this.updateBufferValue('stTrafficType', tt)
                            }}
                          >
                            {/* Traffic Type LIVE */}
                            <Tab id={TrafficType.live} title={this.localeString('liveTraffic')}>
                              <div className='traffic-container h-100 pt-2'>
                                {this.localeString('timeOffset')}
                                <Select
                                  className='pt-1'
                                  name='offsetTime'
                                  size='sm'
                                  value={stOffsetTime}
                                  onChange={e => {
                                    const n = parseInt(e.currentTarget.value)
                                    this.updateBufferValue('stOffsetTime', n)
                                  }}
                                >
                                  {timeOffsets.map(offset => (
                                    <option key={offset.value} value={offset.value}>
                                      {offset.label}
                                    </option>
                                  ))}
                                </Select>
                              </div>
                            </Tab>
                            {/* Traffic Type TYPICAL */}
                            <Tab id={TrafficType.typical} title={this.localeString('typicalTraffic')}>
                              <div className='pt-2'>
                                {/* Traffic Typical OffsetDay */}
                                {this.localeString('day')}
                                <Select
                                  className='pt-1'
                                  name='offsetDay'
                                  size='sm'
                                  value={stOffsetDay}
                                  onChange={e => {
                                    this.updateBufferValue('stOffsetDay', e.currentTarget.value)
                                  }}
                                >
                                  {daysOfWeek.map(day => (
                                    <option key={day} value={day}>
                                      {day}
                                    </option>
                                  ))}
                                </Select>
                              </div>

                              <div className='pt-2'>
                                {/* Traffic Typical OffsetHr */}
                                {this.localeString('time')}
                                <Select
                                  className='pt-1'
                                  name='offsetHr'
                                  size='sm'
                                  value={stOffsetHr}
                                  onChange={e => {
                                    this.updateBufferValue('stOffsetHr', e.currentTarget.value)
                                  }}
                                >
                                  {timeOptions.map(time => (
                                    <option key={time.value} value={time.value}>
                                      {time.label}
                                    </option>
                                  ))}
                                </Select>
                              </div>
                            </Tab>
                          </Tabs>
                        )}
                      </div>
                    )}

                    {presetBuffersQueued && (
                      <div css={style} className='mx-2 mt-4'>
                        <SettingRow flow='wrap'>
                          <div className='w-100' ref={this.sidePopperTrigger}>
                            <Button type='primary' onClick={() => { this.onApplyButtonClicked() }} style={{ width: '100%' }}>{this.localeString('applyBtn')}</Button>
                          </div>
                        </SettingRow>
                      </div>
                    )}
                  </div>
                </SidePopper>
              )}
            </SettingSection>
            : <SettingSection title={<div className='w-100 d-flex' style={{ height: '23px', flexFlow: 'column wrap', alignContent: 'space-between' }}>
              {/* Workflow Mode */}
              <div className='text-truncate py-1'>
                {this.localeString('buffersLabel')}
              </div>
            </div>
            }>
              <SettingRow flow='wrap'>
                <div className='w-100' ref={this.sidePopperTrigger}>
                  <Button type='primary' disabled={!this.state.pointsOfInterestChecked} onClick={() => { this.toggleSidePopper('workflowBufferSidePopper') }} style={{ width: '100%' }}>{this.localeString('customizeBuffersBtn')}</Button>
                </div>
              </SettingRow>

              {/* Workflow Customize Buffers - - - - - - - - - - - - - - - - - - - - - */}

              {workflowBufferSidePopper && (
                <SidePopper isOpen title={this.localeString('customizeBuffersBtn')} position='right' toggle={() => { this.toggleSidePopper('workflowBufferSidePopper') }} trigger={this.sidePopperTrigger?.current}>
                  <div className="p-4" style={popperOuterStyle}>
                    {widgetMode === Mode.Workflow && (
                      <React.Fragment>
                        <SettingRow label={
                          <React.Fragment>
                            {this.localeString('userConfigBuffers')}
                            <Button type='tertiary' className='widget-help-btn' icon size='sm' onClick={() => { this.updateState('allowBufferInfoIconOpen', !allowBufferInfoIconOpen) }} onMouseEnter={() => { this.updateState('allowBufferInfoIconOpen', true) }} onMouseLeave={() => { this.updateState('allowBufferInfoIconOpen', false) }} ref={this.userBufferInfoRef as React.RefObject<HTMLButtonElement>} >
                              <InfoOutlined />
                              <span className='sr-only'>
                                {this.localeString('userConfigLocationInfo')}
                              </span>
                              <Popper showArrow css={popperStyles} open={allowBufferInfoIconOpen} placement='right' offset={[0, 10]} reference={this.userBufferInfoRef} toggle={() => { this.updateState('allowBufferInfoIconOpen', false) }} >
                                <h5>{this.localeString('userConfigBuffers')}</h5>
                                <p>{this.localeString('userConfigLocationInfo')}</p>
                              </Popper>
                            </Button>
                          </React.Fragment>
                        }>
                          <Switch className='can-x-switch' data-key='workflowEnableUserConfigBuffers' checked={workflowEnableUserConfigBuffers} onChange={e => { this.onPropertyChange('workflowEnableUserConfigBuffers', e.target.checked) }} />
                        </SettingRow>
                        {workflowEnableUserConfigBuffers ? this.localeString('uesrConfigBuffersDesc') : this.localeString('userConfigBuffersDescOff')}
                        {workflowEnableUserConfigBuffers &&
                          <React.Fragment>
                            <SettingRow>
                              <Checkbox style={{ cursor: 'pointer' }} className='mr-2' checked={workflowIntroTextBuffersCheckbox} onChange={e => { this.onPropertyChange('workflowIntroTextBuffersCheckbox', e.target.checked) }} />
                              {this.localeString('introTextCheckbox')}
                            </SettingRow>
                            <TextArea className='w-100 mt-2' spellCheck={true} height={80} value={workflowIntroTextBuffers} onChange={e => { this.onPropertyChange('workflowIntroTextBuffers', e.target.value) }} />
                          </React.Fragment>
                        }
                        {workflowEnableUserConfigBuffers && (
                          <SettingRow className='mt-6' label={this.localeString('defaultSettings')} />
                        )}
                      </React.Fragment>
                    )}
                    <SettingRow>
                      <Label check centric>
                        {workflowEnableUserConfigBuffers
                          ? <Checkbox style={{ cursor: 'pointer' }} className='mr-2' checked={workflowAvailableBufferRings === true} onChange={e => { this.handleBufferChange('workflowAvailableBufferRings', e.target.checked, InfoBufferType.ring) }} />
                          : <Radio name='workflowBuffer' style={{ cursor: 'pointer' }} className='mr-2' checked={workflowBuffer === InfoBufferType.ring} onChange={e => { this.handleBufferChange('workflowBuffer', InfoBufferType.ring, InfoBufferType.ring) }} />
                        }
                        {this.localeString('rings')}
                      </Label>
                    </SettingRow>
                    <div css={style} className='m-2'>
                      <SettingRow flow='no-wrap' className='w-100 d-flex'>
                        <NumericInput min='0.1' max={MaxBuffers.Rings} showHandlers={false} name='workflowRingsBuffer1' data-key='workflowRingsBuffer1' className='bufferInput' size='sm' value={workflowRingsBuffer1} onChange={(buffer) => { this.handleBufferChange('workflowRingsBuffer1', buffer, 'rings') }} />
                        <NumericInput min='0.1' max={MaxBuffers.Rings} showHandlers={false} name='workflowRingsBuffer2' data-key='workflowRingsBuffer2' className='bufferInput mx-1' size='sm' value={workflowRingsBuffer2} onChange={(buffer) => { this.handleBufferChange('workflowRingsBuffer2', buffer, 'rings') }} />
                        <NumericInput min='0.1' max={MaxBuffers.Rings} showHandlers={false} name='workflowRingsBuffer3' data-key='workflowRingsBuffer3' className='bufferInput' size='sm' value={workflowRingsBuffer3} onChange={(buffer) => { this.handleBufferChange('workflowRingsBuffer3', buffer, 'rings') }} />
                        <Select name='workflowRingsBufferUnit' className='bufferUnits ml-1' size='sm' value={workflowRingsBufferUnit} onChange={(e) => { this.handleBufferChange('workflowRingsBufferUnit', e.currentTarget.value, 'rings') }}>
                          <option value='miles'>{this.localeString('milesLow')}</option>
                          <option value='kilometers'>{this.localeString('kilometerLow')}</option>
                        </Select>
                      </SettingRow>
                    </div>
                    <SettingRow>
                      <Label check centric>
                        {workflowEnableUserConfigBuffers
                          ? <Checkbox style={{ cursor: 'pointer' }} className='mr-2' checked={workflowAvailableBufferWalktime === true} onChange={e => { this.handleBufferChange('workflowAvailableBufferWalktime', e.target.checked, InfoBufferType.walktime) }} />
                          : <Radio name='workflowBuffer' style={{ cursor: 'pointer' }} className='mr-2' checked={workflowBuffer === InfoBufferType.walktime} onChange={e => { this.handleBufferChange('workflowBuffer', InfoBufferType.walktime, InfoBufferType.walktime) }} />
                        }
                        {this.localeString(InfoBufferType.walktime)}
                      </Label>
                    </SettingRow>
                    <div css={style} className='m-2'>
                      <SettingRow flow='no-wrap' className='w-100 d-flex mt-2'>
                        <NumericInput min='1' max={maxWalkBuffer} showHandlers={false} name='workflowWalktimeBuffer1' data-key='workflowWalktimeBuffer1' className='bufferInput' size='sm' value={workflowWalktimeBuffer1} onChange={(buffer) => { this.handleBufferChange('workflowWalktimeBuffer1', buffer, InfoBufferType.walktime) }} />
                        <NumericInput min='1' max={maxWalkBuffer} showHandlers={false} name='workflowWalktimeBuffer2' data-key='workflowWalktimeBuffer2' className='bufferInput mx-1' size='sm' value={workflowWalktimeBuffer2} onChange={(buffer) => { this.handleBufferChange('workflowWalktimeBuffer2', buffer, InfoBufferType.walktime) }} />
                        <NumericInput min='1' max={maxWalkBuffer} showHandlers={false} name='workflowWalktimeBuffer3' data-key='workflowWalktimeBuffer3' className='bufferInput' size='sm' value={workflowWalktimeBuffer3} onChange={(buffer) => { this.handleBufferChange('workflowWalktimeBuffer3', buffer, InfoBufferType.walktime) }} />
                        <Select name='workflowWalktimeBufferUnit' className='bufferUnits ml-1' size='sm' value={workflowWalktimeBufferUnit} onChange={(e) => { this.handleBufferChange('workflowWalktimeBufferUnit', e.currentTarget.value, InfoBufferType.walktime) }}>
                          <option value='minutes'>{this.localeString('minuteLow')}</option>
                          <option value='miles'>{this.localeString('milesLow')}</option>
                          <option value='kilometers'>{this.localeString('kilometerLow')}</option>
                        </Select>
                      </SettingRow>
                    </div>
                    <SettingRow>
                      <Label check centric>
                        {workflowEnableUserConfigBuffers
                          ? <Checkbox style={{ cursor: 'pointer' }} className='mr-2' checked={workflowAvailableBufferDrivetime === true} onChange={e => { this.handleBufferChange('workflowAvailableBufferDrivetime', e.target.checked, InfoBufferType.drivetime) }} />
                          : <Radio name='workflowBuffer' style={{ cursor: 'pointer' }} className='mr-2' checked={workflowBuffer === InfoBufferType.drivetime} onChange={e => { this.handleBufferChange('workflowBuffer', InfoBufferType.drivetime, InfoBufferType.drivetime) }} />
                        }
                        {this.localeString(InfoBufferType.drivetime)}
                      </Label>
                    </SettingRow>
                    <div css={style} className='m-2'>
                      <SettingRow flow='no-wrap' className='w-100 d-flex'>
                        <NumericInput min='1' max={maxDriveBuffer} showHandlers={false} name='workflowDrivetimeBuffer1' data-key='workflowDrivetimeBuffer1' className='bufferInput' size='sm' value={workflowDrivetimeBuffer1} onChange={(buffer) => { this.handleBufferChange('workflowDrivetimeBuffer1', buffer, InfoBufferType.drivetime) }} />
                        <NumericInput min='1' max={maxDriveBuffer} showHandlers={false} name='workflowDrivetimeBuffer2' data-key='workflowDrivetimeBuffer2' className='bufferInput mx-1' size='sm' value={workflowDrivetimeBuffer2} onChange={(buffer) => { this.handleBufferChange('workflowDrivetimeBuffer2', buffer, InfoBufferType.drivetime) }} />
                        <NumericInput min='1' max={maxDriveBuffer} showHandlers={false} name='workflowDrivetimeBuffer3' data-key='workflowDrivetimeBuffer3' className='bufferInput' size='sm' value={workflowDrivetimeBuffer3} onChange={(buffer) => { this.handleBufferChange('workflowDrivetimeBuffer3', buffer, InfoBufferType.drivetime) }} />
                        <Select name='workflowDrivetimeBufferUnit' className='bufferUnits ml-1' size='sm' value={workflowDrivetimeBufferUnit} onChange={(e) => { this.handleBufferChange('workflowDrivetimeBufferUnit', e.currentTarget.value, InfoBufferType.drivetime) }}>
                          <option value='minutes'>{this.localeString('minuteLow')}</option>
                          <option value='miles'>{this.localeString('milesLow')}</option>
                          <option value='kilometers'>{this.localeString('kilometerLow')}</option>
                        </Select>
                      </SettingRow>
                    </div>
                    <div className='pt-3'>
                      <SettingRow>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                          <span>{this.localeString('incrementButtonsLabel')}</span>
                          <Switch
                            className='can-x-switch'
                            style={{ alignSelf: 'flex-end' }}
                            data-key='dynamicHtml'
                            checked={showIncrementButtons}
                            onChange={e => { this.onPropertyChange('showIncrementButtons', e.target.checked) }}
                          />
                        </div>
                      </SettingRow>
                      {/* Workflow DTO toggle - - - - - - - - - - - - - - - - - - - - - */}
                      {(workflowEnableUserConfigBuffers && workflowAvailableBufferDrivetime) ||
                        (!workflowEnableUserConfigBuffers && workflowBuffer === InfoBufferType.drivetime)
                        ? (
                          <SettingRow >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                              <span>{this.localeString('driveTimeOptions')}</span>
                              <Switch
                                className='can-x-switch'
                                style={{ alignSelf: 'flex-end' }}
                                data-key='dynamicHtml'
                                checked={displayDrivetimeOptions}
                                onChange={e => { this.onChangeDrivetimeToggle(e.target.checked) }}
                              />
                            </div>
                          </SettingRow>
                          )
                        : null}
                    </div>
                    {/* Workflow Drivetime Options - - - - - - - - - - - - - - - - - - - - - */}
                    {displayDrivetimeOptions && (
                      (workflowEnableUserConfigBuffers && workflowAvailableBufferDrivetime) ||
                      (!workflowEnableUserConfigBuffers && workflowBuffer === InfoBufferType.drivetime)
                    ) && (
                        <div className='pt-2'>
                          {this.localeString('mode')}
                          <div className='pt-1'>
                            <Select
                              name='drivingMode'
                              size='sm'
                              value={drivingMode}
                              onChange={(e) => { this.updateBufferValue('drivingMode', e.currentTarget.value) }}
                            >
                              <option value={DrivingMode.driving}>{this.localeString('drivingTime')}</option>
                              <option value={DrivingMode.rural}>{this.localeString('ruralDrivingTime')}</option>
                              <option value={DrivingMode.trucking}>{this.localeString('truckingTime')}</option>
                            </Select>
                          </div>
                          <div style={{ color: '#fff' }} className='ml-3 pt-2'>
                            <Label check centric>
                              <Radio
                                name='travelDirection'
                                style={{ cursor: 'pointer' }}
                                value={TravelDirection.away}
                                className='mr-2'
                                checked={travelDirection === TravelDirection.away}
                                onChange={(e) => { this.updateBufferValue('travelDirection', e.currentTarget.value) }}
                              />
                              {this.localeString('awayFacility')}
                            </Label>
                          </div>
                          <div style={{ color: '#fff' }} className='ml-3 pt-1'>
                            <Label check centric>
                              <Radio
                                name='travelDirection'
                                style={{ cursor: 'pointer' }}
                                value={TravelDirection.toward}
                                className='mr-2'
                                checked={travelDirection === TravelDirection.toward}
                                onChange={(e) => { this.updateBufferValue('travelDirection', e.currentTarget.value) }}
                              />
                              {this.localeString('towardFacility')}
                            </Label>
                          </div>
                          <div className='pt-3'>
                            <Label check centric>
                              <Checkbox
                                style={{ cursor: 'pointer' }}
                                className='mr-2'
                                checked={useTrafficChecked === true}
                                onChange={e => {
                                  this.updateBufferValue('useTrafficChecked', e.target.checked)
                                }}
                              />
                              {this.localeString('useTraffic')}
                            </Label>
                          </div>
                          {_useTrafficEnabled && (
                            <Tabs
                              className='h-100 pt-2'
                              type='pills'
                              fill
                              defaultValue={TrafficType.live}
                              value={trafficType}
                              onChange={selection => {
                                this.updateBufferValue('trafficType', selection)
                              }}
                            >
                              <Tab id={TrafficType.live} title={this.localeString('liveTraffic')}>
                                <div className='traffic-container h-100 pt-2'>
                                  {this.localeString('timeOffset')}
                                  <Select
                                    className='pt-1'
                                    name='offsetTime'
                                    size='sm'
                                    value={offsetTime}
                                    onChange={e => {
                                      const n = parseInt(e.currentTarget.value)
                                      this.updateBufferValue('offsetTime', n)
                                    }}
                                  >
                                    {timeOffsets.map(offset => (
                                      <option key={offset.value} value={offset.value}>
                                        {offset.label}
                                      </option>
                                    ))}
                                  </Select>
                                </div>
                              </Tab>
                              <Tab id={TrafficType.typical} title={this.localeString('typicalTraffic')}>
                                <div className='pt-2'>
                                  {this.localeString('day')}
                                  <Select
                                    className='pt-1'
                                    name='offsetDay'
                                    size='sm'
                                    value={offsetDay}
                                    onChange={e => {
                                      this.updateBufferValue('offsetDay', e.currentTarget.value)
                                    }}
                                  >
                                    {daysOfWeek.map(day => (
                                      <option key={day} value={day}>
                                        {day}
                                      </option>
                                    ))}
                                  </Select>
                                </div>
                                <div className='pt-2'>
                                  {this.localeString('time')}
                                  <Select
                                    className='pt-1'
                                    name='offsetHr'
                                    size='sm'
                                    value={offsetHr}
                                    onChange={e => {
                                      this.updateBufferValue('offsetHr', e.currentTarget.value)
                                    }}
                                  >
                                    {timeOptions.map(time => (
                                      <option key={time.value} value={time.value}>
                                        {time.label}
                                      </option>
                                    ))}
                                  </Select>
                                </div>
                              </Tab>
                            </Tabs>
                          )}
                        </div>
                    )}

                  </div>
                </SidePopper>
              )}
            </SettingSection>
          }

          {/* Customize Infographics - - - - - - - - - - - - - - - - - - - - - */}
          {widgetMode === Mode.Preset
            ? <SettingSection title={<div className='w-100 d-flex' style={{ height: '23px', flexFlow: 'column wrap', alignContent: 'space-between' }}>
              <div className='text-truncate py-1'>
                {this.localeString('infographics')}
              </div>
            </div>}>
              <SettingRow>
                {presetSelectedReportName
                  ? <Button className='w-100 d-flex selectedStateButton' style={{ flex: '1 1 auto', alignItems: 'stretch' }} onClick={() => { this.toggleSidePopper('presetInfographicSidePopper') }} >
                    <div className='d-flex' style={{ flex: '0 1 auto', alignItems: 'center' }}>
                      <Icon size='l' icon={ChartColumnOutlined} />
                    </div>
                    <div className='d-flex' style={{ flex: '1 1 auto', textAlign: 'left', justifyContent: 'end', flexDirection: 'column' }}>
                      {presetSelectedReportName}
                    </div>
                  </Button>
                  : <Button type='tertiary' className='unselectedStateButtonDashed' onClick={() => { this.toggleSidePopper('presetInfographicSidePopper') }} >
                    {this.localeString('selectAnInfographic')}
                  </Button>
                }
              </SettingRow>
              {!window.jimuConfig.isInPortal &&
                <div className='pt-2 text-sm-right'>
                  <a href='https://links.esri.com/ba-exb/credits' target='_blank'>{this.localeString('creditUsage')}</a>
                </div>
              }
              {presetInfographicSidePopper &&
                <SidePopper isOpen title={this.localeString('selectAnInfographic')} position='right' toggle={() => { this.toggleSidePopper('presetInfographicSidePopper') }} trigger={this.sidePopperTrigger?.current}>
                  {/* --------------------REPORT LIST SIDE POPPER CONTENT*/}
                  <div className='p-4' style={popperOuterStyle}>
                    <img id={id + '_' + 'loading-infos'} src={require('../runtime/assets/largeBusy.gif')} style={infographicsLoadingSpinner}></img>

                    <ArcgisReportList
                      id={id + '_' + 'reports'}
                      mode={widgetMode}
                      env={window.jimuConfig.hostEnv}
                      listInstanceId={id}
                      username={user.username}
                      token={token}
                      geoenrichmentUrl={this.state.geoenrichmentServiceUrl ? this.state.geoenrichmentServiceUrl : null}
                      portalUrl={this.state.portalUrl ? this.state.portalUrl : null}
                      colors={this.stringifyTheme()}
                      selectedReportId={presetSelectedReport}
                      showCheckboxes={false}
                      sourceCountry={sourceCountry}
                      hierarchy={selectedHierarchyObj?.ID}
                      langCode={langCode}
                      style={{ width: '100%', marginTop: '-42px' }}
                      onReportSelected={ev => { this.reportSelectedHandler(ev) }}
                      onReportChecked={ev => { this.reportCheckedHandler(ev) }}
                    />
                  </div>
                </SidePopper>
              }
            </SettingSection>
            : <SettingSection title={<div className='w-100 d-flex' style={{ height: '23px', flexFlow: 'column wrap', alignContent: 'space-between' }}>
              <div className='text-truncate py-1'>
                {this.localeString('infographics')}
              </div>
            </div>}>
              <SettingRow>
                <Button type='primary' onClick={() => { this.toggleSidePopper('workflowInfographicSidePopper') }} style={{ width: '100%' }}>
                  {this.localeString('customizeInfographicsBtn')}
                </Button>
              </SettingRow>
              {!window.jimuConfig.isInPortal &&
                <div className='pt-2 text-sm-right'>
                  <a href='https://links.esri.com/ba-exb/credits' target='_blank'>{this.localeString('creditUsage')}</a>
                </div>
              }
              {workflowInfographicSidePopper && (
                <SidePopper isOpen title={widgetMode === Mode.Workflow ? this.localeString('customizeInfographicsBtn') : this.localeString('selectAnInfographic')} position='right' toggle={() => { this.toggleSidePopper('workflowInfographicSidePopper') }} trigger={this.sidePopperTrigger?.current}>
                  <div css={getStyle(theme)}>
                    {/* --------------------REPORT LIST SIDE POPPER CONTENT*/}
                    <div className='p-4' style={popperOuterStyle}>
                      <SettingRow label={
                        <React.Fragment>
                          {this.localeString('allowInfographicChoice')}
                          <Button type='tertiary' className='widget-help-btn' icon size='sm' onClick={() => { this.updateState('allowInfographicChoiceIconOpen', !allowInfographicChoiceIconOpen) }} onMouseEnter={() => { this.updateState('allowInfographicChoiceIconOpen', true) }} onMouseLeave={() => { this.updateState('allowInfographicChoiceIconOpen', false) }} ref={this.allowSearchInfoRef as React.RefObject<HTMLButtonElement>} >
                            <InfoOutlined />
                            <span className='sr-only'>
                              {this.localeString('allowRuntimeReportInfo')}
                            </span>
                            <Popper showArrow css={popperStyles} open={allowInfographicChoiceIconOpen} placement='right' offset={[0, 10]} reference={this.allowSearchInfoRef} toggle={() => { this.updateState('allowInfographicChoiceIconOpen', false) }} >
                              <h5>{this.localeString('allowInfographicChoice')}</h5>
                              <p>{this.localeString('allowInfographicInfo')}</p>
                            </Popper>
                          </Button>
                        </React.Fragment>
                      }>
                        <Switch className='can-x-switch' data-key='workflowEnableInfographicChoice' checked={workflowEnableInfographicChoice} onChange={e => { this.onToggleInfograhicChoice(e.target.checked) }} />
                      </SettingRow>
                      {/*TODO: change to report list string*/}
                      {workflowEnableInfographicChoice ? this.localeString('allowInfographicChoiceDesc') : this.localeString('selectAnInfographic')}
                      {workflowEnableInfographicChoice &&
                        <React.Fragment>
                          <SettingRow>
                            <Checkbox style={{ cursor: 'pointer' }} className='mr-2' checked={workflowIntroTextReportCheckbox} onChange={e => { this.onPropertyChange('workflowIntroTextReportCheckbox', e.target.checked) }} />
                            {this.localeString('introTextCheckbox')}
                          </SettingRow>
                          <TextArea className='w-100 mt-2' spellCheck={true} height={80} value={workflowIntroTextReports} onChange={e => { this.onPropertyChange('workflowIntroTextReports', e.target.value) }} />
                        </React.Fragment>
                      }
                      <SettingRow className='mt-6 pb-2' label={this.localeString('selectInfographics')} />

                      <img id={id + '_' + 'loading-infos'} src={require('../runtime/assets/largeBusy.gif')} style={infographicsLoadingSpinner}></img>

                      {workflowEnableInfographicChoice
                        ? (
                          <ArcgisReportList
                            id={id + '_' + 'wf-reports'}
                            mode={widgetMode}
                            env={window.jimuConfig.hostEnv}
                            geoenrichmentUrl={this.state.geoenrichmentServiceUrl ? this.state.geoenrichmentServiceUrl : null}
                            portalUrl={this.state.portalUrl ? this.state.portalUrl : null}
                            listInstanceId={id}
                            username={user.username}
                            token={token}
                            colors={this.stringifyTheme()}
                            sourceCountry={sourceCountry}
                            hierarchy={selectedHierarchyObj?.ID}
                            langCode={langCode}
                            showCheckboxes={true}
                            showDefault="true"
                            selectedReportId={workflowSelectedReport}
                            reportList={JSON.stringify(reportList)}
                            style={{ width: '100%', marginTop: '-42px' }}
                            onReportSelected={ev => { this.reportSelectedHandler(ev) }}
                            onReportChecked={ev => { this.reportCheckedHandler(ev) }}
                            onAccordionInit={ev => { this.accordionInitHandler(ev) }} />
                          )
                        : (
                          <ArcgisReportList
                            id={id + '_' + 'wf-reports'}
                            mode={widgetMode}
                            env={window.jimuConfig.hostEnv}
                            listInstanceId={id}
                            username={user.username}
                            token={token}
                            geoenrichmentUrl={this.state.geoenrichmentServiceUrl ? this.state.geoenrichmentServiceUrl : null}
                            portalUrl={this.state.portalUrl ? this.state.portalUrl : null}
                            colors={this.stringifyTheme()}
                            selectedReportId={presetSelectedReport}
                            showCheckboxes={false}
                            sourceCountry={sourceCountry}
                            hierarchy={selectedHierarchyObj?.ID}
                            langCode={langCode}
                            style={{ width: '100%', marginTop: '-42px' }}
                            onReportSelected={ev => { this.reportSelectedHandler(ev) }}
                            onReportChecked={ev => { this.reportCheckedHandler(ev) }}
                          />
                          )}

                      {/* Choose Default Infographic */}

                      {workflowEnableInfographicChoice
                        ? (
                          <div>
                            <SettingRow className='mt-6 pb-2' label={this.localeString('defaultInfographic')} />

                            {this.getDefaultReport() !== undefined
                              ? (
                                <Button className='w-100 d-flex selectedStateButton' style={{ flex: '1 1 auto', alignItems: 'stretch' }} onClick={(e) => { onClickSelectDefaultReport(e) }}>
                                  <div className='d-flex' style={{ flex: '1 1 auto', textAlign: 'center', justifyContent: 'end', flexDirection: 'column' }}>
                                    {self.getDefaultReportLabel()}
                                  </div>
                                  <span className='d-flex justify-content-center' style={{ margin: 'auto 0', alignItems: 'right' }} onClick={(e) => { onClickClearDefaultReport(e) }} title={this.localeString('clearDefaultInfographic')}>
                                    <Icon size='s' icon={CloseOutlined} />
                                  </span>
                                </Button>
                                )
                              : (
                                <Button type='tertiary' className='unselectedStateButtonDashed' onClick={(e) => { onClickSelectDefaultReport(e) }}>
                                  {self.getDefaultReportLabel()}
                                </Button>
                                )
                            }
                            <ArcgisReportList
                              id={id + '_' + 'def-selected-reports'}
                              mode={widgetMode}
                              env={window.jimuConfig.hostEnv}
                              listInstanceId={id}
                              username={user.username}
                              token={token}
                              expandOne={true}
                              geoenrichmentUrl={this.state.geoenrichmentServiceUrl ? this.state.geoenrichmentServiceUrl : null}
                              portalUrl={this.state.portalUrl ? this.state.portalUrl : null}
                              colors={this.stringifyTheme()}
                              showCheckboxes={false}
                              showDefault="true"
                              selectedReportId={workflowSelectedReport}
                              reportList={JSON.stringify(this._checkedItemsList)}
                              sourceCountry={sourceCountry}
                              langCode={langCode}
                              onReportSelected={ev => { self.onSettingsDefaultReportSelected(ev) }}
                              style={{ width: '100%', display: 'none', minHeight: '100px', marginTop: '-32px' }}
                            />
                          </div>)
                        : ('')
                      }
                    </div>
                  </div>
                </SidePopper>
              )}
            </SettingSection>
          }

          {/* Settings */}
          <SettingSection>
          <SettingCollapse
            label={this.localeString('infographicSettings')}
            isOpen={settingsOpen}
            onRequestOpen={() => {
              this.updateState('settingsOpen', true)
            }}
            onRequestClose={() => {
              this.updateState('settingsOpen', false)
            }}
          >
            <SettingRow flow='no-wrap' className='mt-4' label={this.localeString('viewMode')}>
              <Select className='w-50' name='viewMode' size='sm' value={viewModeValue} onChange={e => { this.handleIgSettingChange('viewMode', e.target.value) }}>
                <option key={ViewMode.Auto} value={ViewMode.Auto}>{this.localeString('autoLayout')}</option>
                <option key={ViewMode.Full} value={ViewMode.Full}>{this.localeString('fullPages')}</option>
                <option key={ViewMode.Stack} value={ViewMode.Stack}>{this.localeString('panelsInStack')}</option>
                <option key={ViewMode.Slides} value={ViewMode.Slides}>{this.localeString('panelsInSlides')}</option>
                <option key={ViewMode.StackAll} value={ViewMode.StackAll}>{this.localeString('panelsInStackAll')}</option>
              </Select>
            </SettingRow>
            <SettingRow label={this.localeString('backgroundColor')}>
              <ColorPicker
                style={{ padding: '0' }} width={26} height={14}
                color={igBackgroundColor}
                onChange={value => {
                  this.handleIgSettingChange('igBackgroundColor', value)
                }}
                presetColors={this.presetColors}
              />
            </SettingRow>

              {this.props.config.widgetMode === Mode.Preset &&
                <SettingRow label={this.localeString('runReportOnClick')}>
                  <Switch className='can-x-switch' data-key='runReportOnClick'
                    checked={runReportOnClick} onChange={e => {
                      this.handleIgSettingChange('runReportOnClick', e.target.checked)
                    }} />
                </SettingRow>
              }

              <SettingRow label={this.localeString('displayHeader')}>
                <Switch className='can-x-switch' data-key='displayHeader' checked={displayHeader}
                  onChange={e => {
                    this.handleIgSettingChange('displayHeader', e.target.checked)
                  }} />
              </SettingRow>
              {displayHeader && (
                <React.Fragment>
                  <SettingRow label={this.localeString('headerColor')}>
                    <ColorPicker
                      style={{ padding: '0' }} width={26} height={14} disableAlpha
                      color={headerColor}
                      onChange={value => {
                        this.handleIgSettingChange('headerColor', value)
                      }}
                      presetColors={this.presetColors}
                    />
                  </SettingRow>
                  <SettingRow label={this.localeString('headerTextColor')}>
                    <ColorPicker
                      style={{ padding: '0' }} width={26} height={14} disableAlpha
                      color={headerTextColor}
                      onChange={value => {
                        this.handleIgSettingChange('headerTextColor', value)
                      }}
                      presetColors={this.presetColors}
                    />
                  </SettingRow>
                  <SettingRow label={this.localeString('imageExport')}>
                    <Switch className='can-x-switch' data-key='imageExport'
                      checked={imageExport} onChange={e => {
                        this.handleIgSettingChange('imageExport', e.target.checked)
                      }} />
                  </SettingRow>
                  <SettingRow label={this.localeString('dynamicHtml')}>
                    <Switch className='can-x-switch' data-key='dynamicHtml'
                      checked={dynamicHtml} onChange={e => {
                        this.handleIgSettingChange('dynamicHtml', e.target.checked)
                      }} />
                  </SettingRow>
                  <SettingRow label={this.localeString('excel')}>
                    <Switch className='can-x-switch' data-key='excel' checked={excel}
                      onChange={e => {
                        this.handleIgSettingChange('excel', e.target.checked)
                      }} />
                  </SettingRow>
                  <SettingRow label={this.localeString('pdf')}>
                    <Switch className='can-x-switch' data-key='pdf' checked={pdf}
                      onChange={e => {
                        this.handleIgSettingChange('pdf', e.target.checked)
                      }} />
                  </SettingRow>
                  {widgetMode === Mode.Preset && (
                    <SettingRow label={this.localeString('fullscreen')}>
                      <Switch className='can-x-switch' data-key='fullscreen' checked={fullscreen} onChange={e => { this.handleIgSettingChange('fullscreen', e.target.checked) }} />
                    </SettingRow>
                  )}
                  {this.props.config.viewMode && this.props.config.viewMode !== 'slides' && (
                    <SettingRow label={this.localeString('zoomLevel')}>
                      <Switch className='can-x-switch' data-key='zoomLevel' checked={zoomLevel} onChange={e => { this.handleIgSettingChange('zoomLevel', e.target.checked) }} />
                    </SettingRow>
                  )}
              </React.Fragment>
              )}
          </SettingCollapse>
          </SettingSection>
          <SettingSection title={<div className='w-100 d-flex' style={{ height: '23px', flexFlow: 'column wrap', alignContent: 'space-between' }}>
            <div className='text-truncate py-1'>
              {this.localeString('geoEnrichment')}
            </div>
          </div>}>
            <UtilitySelector
              useUtilities={Immutable(this.props.config.geoenrichmentConfig?.useUtility ? [this.props.config.geoenrichmentConfig.useUtility] : [])}
              onChange={this.onGeoenrichmentUtilityChange}
              showRemove={false}
              closePopupOnSelect
              types={supportedUtilityTypes}
            />
          </SettingSection>
        </div>
      </div>
    )
  }

  _showApplyButton () {
    this.updateState('presetBuffersQueued', true)
  }

  _hideApplyButton () {
    this.updateState('presetBuffersQueued', false)
  }

  onApplyButtonClicked () {
    const self = this
    // console.log('%c SETTING apply button clicked - syncBufferSettings= true', 'color:pink;font-size:13pt')
    requestAnimationFrame(() => {
      self.onPropertyChange('syncBufferSettings', true)
      self.applyPresetDto()
      self.applyPresetBuffers()
      self._hideApplyButton()
    })
  }
}
