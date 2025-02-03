/** @jsx jsx */
import {
  React, Immutable, type ImmutableObject, type DataSourceJson, type IMState, FormattedMessage,
  css, jsx, DataSourceManager, getAppStore, polished, classNames, type UseDataSource, AllDataSourceTypes, type ImmutableArray
} from 'jimu-core'
// import { loadArcGISJSAPIModules, type JimuMapView, JimuMapViewComponent } from 'jimu-arcgis'
import { Alert, Switch, ImageWithParam, Radio, defaultMessages as jimuUIDefaultMessages, Select, Checkbox, Label, Tooltip, CollapsablePanel } from 'jimu-ui'
import { type IMJimuMapConfig, MapStatesEditor } from 'jimu-ui/advanced/map'
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector'
import { ColorPicker } from 'jimu-ui/basic/color-picker'
import { type AllWidgetSettingProps, builderAppSync, helpUtils } from 'jimu-for-builder'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { type IMConfig, SceneQualityMode } from '../config'
import defaultMessages from './translations/default'
import MapThumb from '../../src/runtime/components/map-thumb'
import ToolModules from '../../src/runtime/layout/tool-modules-config'
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info'
import { type PopupDockPosition, type CustomPopupDockPosition, getValidPopupDockPosition } from '../utils'
import { PopupPositionSetting } from './components/popup-position-setting'

interface ExtraProps {
  dsJsons: ImmutableObject<{ [dsId: string]: DataSourceJson }>
}

interface State {
  showSelectThirdMapAlert: boolean
  clientQueryHelpHref: string
}

interface AppClientQueryDataSourceWidgetInfo {
  // key is dataSourceId, value is widgetIds that enable client query for this dataSourceId
  [dataSourceId: string]: string[]
}

interface DataSourceClientQueryInfo {
  dataSourceId: string
  dsLabel: string
  clientQueryEnabled: boolean
  switchEnabled: boolean
}

export default class Setting extends React.PureComponent<AllWidgetSettingProps<IMConfig> & ExtraProps, State> {
  unmount = false
  dsManager = DataSourceManager.getInstance()
  integratedDataSourceSetting = {} as any
  supportedDsTypes = Immutable([AllDataSourceTypes.WebMap, AllDataSourceTypes.WebScene])
  closeThirdMapAlertTimer
  alertRef = React.createRef<HTMLDivElement>()
  // activeJimuMapView: JimuMapView
  // scaleRangeSliderContainer: HTMLDivElement
  // ScaleRangeSlider: typeof __esri.ScaleRangeSlider
  // scaleRangeSlider: __esri.ScaleRangeSlider
  // minScaleHandleOfScaleRangeSlider: __esri.Handle
  // maxScaleHandleOfScaleRangeSlider: __esri.Handle
  // scaleHandleOfMapView: __esri.Handle
  // minScale: number
  // maxScale: number
  // debounceHandleMinMaxScaleChange = () => {}

  presetColors = [
    { label: '#00FFFF', value: '#00FFFF', color: '#00FFFF' },
    { label: '#FF9F0A', value: '#FF9F0A', color: '#FF9F0A' },
    { label: '#089BDC', value: '#089BDC', color: '#089BDC' },
    { label: '#FFD159', value: '#FFD159', color: '#FFD159' },
    { label: '#74B566', value: '#74B566', color: '#74B566' },
    { label: '#FF453A', value: '#FF453A', color: '#FF453A' },
    { label: '#9868ED', value: '#9868ED', color: '#9868ED' },
    { label: '#43ABEB', value: '#43ABEB', color: '#43ABEB' }
  ]

  static mapExtraStateProps = (state: IMState): ExtraProps => {
    return {
      dsJsons: state.appStateInBuilder.appConfig.dataSources
    }
  }

  constructor (props) {
    super(props)

    // this.debounceHandleMinMaxScaleChange = lodash.debounce(() => {
    //   this.handleMinMaxScaleChange()
    // }, 1000)

    // const initScaleRange = this.props?.config?.scaleRange

    // if (initScaleRange) {
    //   this.minScale = initScaleRange.minScale
    //   this.maxScale = initScaleRange.maxScale
    // }

    this.state = {
      showSelectThirdMapAlert: false,
      clientQueryHelpHref: '#'
    }

    this.initDataSourceSettingOption()
  }

  getStyle () {
    return css`
      .widget-setting-map {
        color: ${this.props.theme.ref.palette.neutral[1000]};

        .setting-row-text-level-1 {
          color: ${this.props.theme.ref.palette.neutral[1100]} !important;
        }

        .source-description {
          color: ${this.props.theme.ref.palette.neutral[1000]};
        }

        .webmap-thumbnail{
          cursor: pointer;
          width: 100%;
          height: 120px;
          overflow: hidden;
          padding: 1px;
          border: ${polished.rem(2)} solid initial;
          img, div{
            width: 100%;
            height: 100%;
          }
        }

        .selected-item{
          border: ${polished.rem(2)} solid ${this.props.theme.sys.color.primary.light} !important;
        }

        .webmap-thumbnail-multi{
          cursor: pointer;
          width: 48%;
          height: 100px;
          overflow: hidden;
          padding: 1px;
          border: ${polished.rem(2)} solid initial;
          img, div{
            width: 100%;
            height: 100%;
          }
        }

        .placeholder-container {
          background-color: ${this.props.theme.sys.color.secondary.main};
          width: 100%;
          height: 120px;
          position: relative;
        }

        .placeholder-icon {
          top: 40%;
          left: 46%;
          position: absolute;
          fill: ${this.props.theme.ref.palette.neutral[900]};
        }

        .choose-btn{
          width: 100%;
        }

        .webmap-tools{
          .webmap-tools-item{
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
        }

        .uploadInput {
          position: absolute;
          opacity: 0;
          left: 0;
          top: 0;
          cursor: pointer;
        }

        .uploadInput-container {
          position: relative;
        }

        .setting-map-button{
          cursor: 'pointer';
        }

        .select-third-map-alert {
          position: fixed;
          right: 0;
          top: 139px;
          width: 260px;
          height: auto;
          z-index: 1;
        }
      }

      .item-selector-popup {
        width: 850px;
        .modal-body {
          max-height: 70vh;
          overflow: auto;
        }
      }

      .dock-popup-label {
        display: inline;
      }

      .dock-popup-custom-position-label {
        justify-content: start;
        line-height: 26px;
        text-wrap: wrap;
        word-break: break-all;

        &.use-custom-dock-popup-position {
          width: calc(100% - 46px);
        }
      }

      .enable-client-query-header >.jimu-widget-setting--row-label {
        margin-bottom: 0;
      }

      .esri-scale-range-slider {
        min-width: auto;
        width: 100%;

        .esri-scale-range-slider__segment-active {
          background-color: var(--sys-color-action-selected, #007F94);
        }

        .esri-slider__thumb {
          border-color: var(--sys-color-action-selected, #007F94);
        }

        --calcite-color-brand: var(--sys-color-primary-light, #00D8ED);
        --calcite-color-brand-hover: var(--sys-color-primary-light, #00D8ED);

        .esri-scale-range-slider__scale-menu-container {
          > calcite-dropdown {
            max-width: 50%;

            .esri-scale-range-slider__scale-menu-toggle {
              max-width: 100%;
              --calcite-offset-invert-focus: 1;
            }
          }
        }

        calcite-dropdown-group {
          border-radius: 4px;
          border: 1px solid var(--sys-color-divider-secondary, #585858);
          background: var(--sys-color-surface-overlay, #282828);
          box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.20);
          --calcite-color-text-3: var(--sys-color-surface-overlay-hint, #DCDCDC);
        }
      }
    `
  }

  componentDidMount () {
    this.unmount = false
    document.body.addEventListener('click', this.onClickBody, false)
    this.updateClientQueryHelpHref()
    // this.loadApiScaleRangeSlider()
  }

  async updateClientQueryHelpHref () {
    try {
      const widgetName = this.props.manifest?.name

      if (widgetName) {
        let href = await helpUtils.getWidgetHelpLink(widgetName)

        if (!href) {
          href = '#'
        }

        if (!this.unmount) {
          this.setState({
            clientQueryHelpHref: href
          })
        }
      }
    } catch (e) {
      console.error('can not get help link of map', e)
    }
  }

  componentWillUnmount () {
    this.unmount = true
    document.body.removeEventListener('click', this.onClickBody, false)
    this.cancelCloseSelectThirdMapAlertTimer()
    // this.releaseScaleHandleOfMapView()
    // this.removeScaleRangeSlider()
  }

  // onActiveJimuViewChange = (activeJimuMapView: JimuMapView) => {
  //   this.releaseScaleHandleOfMapView()
  //   this.activeJimuMapView = activeJimuMapView
  //   this.updateScaleRangeSlider()
  // }

  // loadApiScaleRangeSlider () {
  //   loadArcGISJSAPIModules(['esri/widgets/ScaleRangeSlider']).then(modules => {
  //     this.ScaleRangeSlider = modules[0] as typeof __esri.ScaleRangeSlider
  //     // console.log('API ScaleRangeSlider loaded')
  //     this.updateScaleRangeSlider()
  //   })
  // }

  // releaseScaleHandleOfMapView () {
  //   if (this.scaleHandleOfMapView) {
  //     this.scaleHandleOfMapView.remove()
  //     this.scaleHandleOfMapView = null
  //   }
  // }

  // onScaleRangeSliderContainerChange = (container) => {
  //   this.scaleRangeSliderContainer = container
  //   // console.log('onScaleRangeSliderContainerChange', this.scaleRangeSliderContainer)
  //   this.updateScaleRangeSlider()
  // }

  // updateScaleRangeSlider () {
  //   if (this.unmount) {
  //     return
  //   }

  //   this.releaseScaleHandleOfMapView()
  //   this.removeScaleRangeSlider()

  //   const apiMapView = this.activeJimuMapView?.view

  //   if (this.ScaleRangeSlider && apiMapView && this.scaleRangeSliderContainer) {
  //     // console.log('scaleRangeSlider created', this.activeJimuMapView.id)
  //     // Don't use this.scaleRangeSliderContainer as the container of ScaleRangeSlider directly, instead we should create a new div as the container.
  //     const container = document.createElement('div')
  //     this.scaleRangeSliderContainer.appendChild(container)

  //     const scaleRangeSliderProperties: __esri.ScaleRangeSliderProperties = {
  //       container,
  //       view: apiMapView
  //     }

  //     if (typeof this.minScale === 'number') {
  //       scaleRangeSliderProperties.minScale = this.minScale
  //     }

  //     if (typeof this.maxScale === 'number') {
  //       scaleRangeSliderProperties.maxScale = this.maxScale
  //     }

  //     const appState = getAppStore().getState()
  //     const locale = appState?.appContext?.locale

  //     if (locale) {
  //       // e.g. en-us
  //       const splits = locale.split('-')

  //       if (splits?.length > 0) {
  //         const lastSplit = splits[splits.length - 1]

  //         if (lastSplit) {
  //           const region = lastSplit.toUpperCase()

  //           const validRegions: string[] = [
  //             'AE', 'AR', 'AT', 'AU', 'BE', 'BG', 'BO', 'BR', 'CA', 'CH', 'CI', 'CL', 'CN', 'CO', 'CR', 'CZ', 'DE',
  //             'DK', 'EE', 'EG', 'ES', 'FI', 'FR', 'GB', 'GL', 'GR', 'GT', 'HK', 'ID', 'IE', 'IL', 'IN', 'IQ', 'IS', 'IT',
  //             'JP', 'KE', 'KR', 'KW', 'LI', 'LT', 'LU', 'LV', 'MA', 'MG', 'ML', 'MO', 'MX', 'MY', 'NI', 'NL', 'NO', 'NZ',
  //             'PE', 'PL', 'PR', 'PT', 'RO', 'RU', 'RW', 'SE', 'SG', 'SK', 'SR', 'SV', 'TH', 'TN', 'TW', 'US', 'VE', 'VI', 'ZA'
  //           ]

  //           if (validRegions.includes(region)) {
  //             scaleRangeSliderProperties.region = region as any
  //           }
  //         }
  //       }
  //     }

  //     this.scaleRangeSlider = new this.ScaleRangeSlider(scaleRangeSliderProperties)
  //     this.watchHandlesOfScaleRangeSlider()

  //     this.scaleHandleOfMapView = apiMapView.watch('scale', () => {
  //       if (this.scaleRangeSlider) {
  //         // change this.scaleRangeSlider.view to force the this.scaleRangeSlider update the current scale indicator by apiMapView.scale
  //         this.scaleRangeSlider.view = null
  //         this.scaleRangeSlider.view = apiMapView
  //       }
  //     })
  //   }
  // }

  // watchHandlesOfScaleRangeSlider () {
  //   this.releaseHandlesOfScaleRangeSlider()

  //   if (this.scaleRangeSlider) {
  //     this.minScaleHandleOfScaleRangeSlider = this.scaleRangeSlider.watch('minScale', (newMinScale: number) => {
  //       this.minScale = newMinScale
  //       // console.log('minScale change', newMinScale)
  //       this.debounceHandleMinMaxScaleChange()
  //     })

  //     this.maxScaleHandleOfScaleRangeSlider = this.scaleRangeSlider.watch('maxScale', (newMaxScale: number) => {
  //       this.maxScale = newMaxScale
  //       // console.log('maxScale change', newMaxScale)
  //       this.debounceHandleMinMaxScaleChange()
  //     })
  //   }
  // }

  // releaseHandlesOfScaleRangeSlider () {
  //   if (this.minScaleHandleOfScaleRangeSlider) {
  //     this.minScaleHandleOfScaleRangeSlider.remove()
  //     this.minScaleHandleOfScaleRangeSlider = null
  //   }

  //   if (this.maxScaleHandleOfScaleRangeSlider) {
  //     this.maxScaleHandleOfScaleRangeSlider.remove()
  //     this.maxScaleHandleOfScaleRangeSlider = null
  //   }
  // }

  // removeScaleRangeSlider () {
  //   this.releaseScaleHandleOfMapView()
  //   this.releaseHandlesOfScaleRangeSlider()

  //   if (this.scaleRangeSlider) {
  //     const container = this.scaleRangeSlider.container as HTMLElement
  //     // console.log('scaleRangeSlider destroyed')
  //     this.scaleRangeSlider.destroy()
  //     this.scaleRangeSlider = null

  //     if (container) {
  //       if (container.parentElement) {
  //         container.parentElement.removeChild(container)
  //       }
  //     }
  //   }
  // }

  // handleMinMaxScaleChange () {
  //   if (this.unmount) {
  //     return
  //   }

  //   this.updateScaleRangeConfig(this.minScale, this.maxScale)
  // }

  // updateScaleRangeConfig (minScale: number, maxScale: number) {
  //   let scaleRange: ScaleRange = {}

  //   // If minScale is 0, means there is no limit for minScale.
  //   if (typeof minScale === 'number' && minScale > 0) {
  //     scaleRange.minScale = minScale
  //   }

  //   // If maxScale is 0, means there is no limit for maxScale.
  //   if (typeof maxScale === 'number' && maxScale > 0) {
  //     scaleRange.maxScale = maxScale
  //   }

  //   if (Object.keys(scaleRange).length === 0) {
  //     scaleRange = null
  //   }

  //   // console.log('map setting scaleRange changed', scaleRange)

  //   const newConfig = this.props.config.set('scaleRange', scaleRange)

  //   this.props.onSettingChange({
  //     id: this.props.id,
  //     config: newConfig
  //   })
  // }

  // resetMinScaleAndMaxScale () {
  //   this.minScale = null
  //   this.maxScale = null

  //   if (this.scaleRangeSlider) {
  //     // We don't want the flowing code emit minScale/maxScale change event.
  //     this.releaseHandlesOfScaleRangeSlider()
  //     this.scaleRangeSlider.minScale = 0
  //     this.scaleRangeSlider.maxScale = 0
  //     this.watchHandlesOfScaleRangeSlider()
  //   }
  // }

  getPortUrl = (): string => {
    const portUrl = getAppStore().getState().portalUrl
    return portUrl
  }

  hasWebSceneDataSource = (): boolean => {
    return this.props.useDataSources?.some(useDataSource => this.props.dsJsons[useDataSource.dataSourceId]?.type === 'WEB_SCENE')
  }

  hasWebMapDataSource (): boolean {
    const useDataSources = this.props.useDataSources

    if (useDataSources && useDataSources.length > 0) {
      return useDataSources.some(useDataSource => {
        return this.props.dsJsons[useDataSource.dataSourceId]?.type === 'WEB_MAP'
      })
    }

    return true
  }

  // This method is triggered when select new webmap/webscene data source or remove webmap/webscene data source.
  onDataSourceChange = (useDataSources: UseDataSource[]) => {
    if (!useDataSources) {
      return
    }

    // Use propsUseDataSources instead of this.props.useDataSources because this.props.useDataSources maybe undefined.
    let propsUseDataSources: Immutable.ImmutableArray<UseDataSource> = this.props.useDataSources

    if (!propsUseDataSources) {
      // There is no data source by default, so this.props.useDataSources is undefined by default.
      // So it means user doesn't select any webmap/webscene data source if propsUseDataSources is empty.
      propsUseDataSources = Immutable([])
    }

    if (useDataSources.length > propsUseDataSources.length) {
      // select new webmap/webscene data source
      const newSelectedDs = useDataSources.find(ds => !propsUseDataSources.some(uDs => uDs.dataSourceId === ds.dataSourceId))
      this.onDataSourceSelected(newSelectedDs, propsUseDataSources)
    } else if (useDataSources.length < propsUseDataSources.length) {
      // unselect webmap/webscene data source
      const currentRemovedDs = propsUseDataSources.find(uDs => !useDataSources.some(ds => uDs.dataSourceId === ds.dataSourceId))
      this.onDataSourceRemoved(currentRemovedDs)
    }
  }

  onDataSourceSelected = (newSelectedDs: UseDataSource, propsUseDataSources: Immutable.ImmutableArray<UseDataSource>) => {
    // newSelectedDs is the new selected data source from DataSourceSelector
    // Use propsUseDataSources instead of this.props.useDataSources because this.props.useDataSources maybe undefined.
    if (!newSelectedDs) {
      return
    }

    let tempUseDataSources = []
    tempUseDataSources = Object.assign(tempUseDataSources, propsUseDataSources)
    tempUseDataSources.push(newSelectedDs)

    this.integratedDataSourceSetting = {
      id: this.props.id,
      useDataSources: Immutable(tempUseDataSources)
    }

    // console.log('onDataSourceSelected')

    // if (this.activeJimuMapView && !this.activeJimuMapView.dataSourceId) {
    //   // this.activeJimuMapView is default webmap, it will be destroyed soon, so we need to destroy the ScaleRangeSlider
    //   this.removeScaleRangeSlider()
    // }

    // this.resetMinScaleAndMaxScale()

    const settingOption = Object.assign({}, this.integratedDataSourceSetting)
    const newIMConfig = this.props.config
      .set('initialMapDataSourceID', newSelectedDs.dataSourceId)
      .set('isUseCustomMapState', false)
      .set('initialMapState', null)
      .set('scaleRange', null)

    // Don't enable client query by default.
    // const canNewSelectedDataSourceEnableClientQuery = this.canNewSelectedDataSourceEnableClientQuery(newSelectedDs)
    // if (canNewSelectedDataSourceEnableClientQuery) {
    //   newIMConfig = this.getNewConfigByEnableDataSourceClientQuery(newIMConfig, newSelectedDs.dataSourceId)
    // }

    // eslint-disable-next-line
    settingOption.config = newIMConfig
    this.props.onSettingChange(settingOption)
  }

  onDataSourceRemoved = (currentRemovedDs: UseDataSource): void => {
    if (!currentRemovedDs) {
      return
    }

    const removedDataSourceId = currentRemovedDs.dataSourceId

    // remove related useDataSource
    let tempUseDataSources = []
    tempUseDataSources = Object.assign(tempUseDataSources, this.props.useDataSources)
    for (let i = 0; i < tempUseDataSources.length; i++) {
      if (tempUseDataSources[i].dataSourceId === removedDataSourceId) {
        tempUseDataSources.splice(i, 1)
        break
      }
    }

    const settingChange = {
      id: this.props.id,
      useDataSources: Immutable(tempUseDataSources)
    } as any

    let settingOption = {} as any

    this.integratedDataSourceSetting = settingChange
    settingOption = Object.assign({}, this.integratedDataSourceSetting)
    let newConfig: IMConfig = null

    // console.log('onDataSourceRemoved')
    // if (this.activeJimuMapView && removedDataSourceId && this.activeJimuMapView.dataSourceId === removedDataSourceId) {
    //   // this.activeJimuMapView will be destroyed soon, so we need to destroy the ScaleRangeSlider
    //   this.removeScaleRangeSlider()
    // }

    // this.resetMinScaleAndMaxScale()

    let initialMapDataSourceID = null

    if (tempUseDataSources.length > 0) {
      initialMapDataSourceID = tempUseDataSources[0] && tempUseDataSources[0].dataSourceId
    } else {
      initialMapDataSourceID = null
    }

    newConfig = this.props.config
      .set('initialMapDataSourceID', initialMapDataSourceID)
      .set('isUseCustomMapState', false)
      .set('initialMapState', null)
      .set('scaleRange', null)

    // try to remove removedDataSourceId from clientQueryDataSourceIds
    newConfig = this.getNewConfigByDisableDataSourceClientQuery(newConfig, removedDataSourceId)

    settingOption.config = newConfig

    this.props.onSettingChange(Object.assign({}, settingOption))
  }

  onMapToolsChanged = (checked, name): void => {
    if (name === 'canSelect') {
      this.props.onSettingChange({
        id: this.props.id,
        config: this.props.config.setIn(['toolConfig', 'canSelect'], checked).setIn(['toolConfig', 'canSelectState'], checked)
      })
    } else {
      this.props.onSettingChange({
        id: this.props.id,
        config: this.props.config.setIn(['toolConfig', name], checked)
      })
    }
  }

  onMapOptionsChanged = (checked, name): void => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set(name, checked)
    })
  }

  onSceneQualityModeChanged = (value, name): void => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set(name, value)
    })
  }

  onDisableSelection = (useDataSources: UseDataSource[]): boolean => {
    if (useDataSources.length > 1) {
      return true
    } else {
      return false
    }
  }

  onClickDisabledDsItem = () => {
    if (this.props.useDataSources && this.props.useDataSources.length >= 2) {
      setTimeout(() => {
        this.showSelectThirdMapAlert()
      }, 0)
    }
  }

  showSelectThirdMapAlert (): void {
    if (!this.unmount) {
      this.setState({
        showSelectThirdMapAlert: true
      }, () => {
        // make sure Alert dom is rendered and we can get the this.alertRef.current
        if (!this.unmount) {
          this.forceUpdate()
        }
      })

      this.startCloseSelectThirdMapAlertTimer()
    }
  }

  hideSelectThirdMapAlert (): void {
    this.cancelCloseSelectThirdMapAlertTimer()

    if (!this.unmount) {
      this.setState({
        showSelectThirdMapAlert: false
      })
    }
  }

  cancelCloseSelectThirdMapAlertTimer (): void {
    if (this.closeThirdMapAlertTimer) {
      clearTimeout(this.closeThirdMapAlertTimer)
      this.closeThirdMapAlertTimer = null
    }
  }

  startCloseSelectThirdMapAlertTimer (): void {
    this.cancelCloseSelectThirdMapAlertTimer()
    this.closeThirdMapAlertTimer = setTimeout(() => {
      if (!this.unmount) {
        this.setState({
          showSelectThirdMapAlert: false
        })
      }
    }, 5000)
  }

  onClickBody = () => {
    if (!this.unmount) {
      this.hideSelectThirdMapAlert()
    }
  }

  onSelectThirdMapAlertClose = () => {
    this.hideSelectThirdMapAlert()
  }

  // use for dataSourceSetting cache
  initDataSourceSettingOption = () => {
    let tempUseDataSources = []
    tempUseDataSources = Object.assign(tempUseDataSources, this.props.useDataSources)

    const dataSourceSettingOption = {
      widgetId: this.props.id,
      useDataSources: Immutable(tempUseDataSources)
    }
    this.integratedDataSourceSetting = dataSourceSettingOption
  }

  setInitialMap = (dataSourceId: string) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('initialMapDataSourceID', dataSourceId)
    })

    // mapWidget.props.stateProps.initialMapDataSourceID is a temporary variable to let map setting and map runtime communicate with each other.
    // If we change the initialMapDataSourceID by clicking ds thumbnail in map setting,
    // then map setting will call builderAppSync.publishChangeWidgetStatePropToApp() to update mapWidget.props.stateProps.initialMapDataSourceID.
    // Once we check mapWidget.props.stateProps.initialMapDataSourceID is not empty in MultiSourceMap, means we changed the initialMapDataSourceID,
    // then we make sure the initialMapbase go to the initial extent.
    // At last, MultiSourceMap will reset mapWidget.props.stateProps.initialMapDataSourceID to empty.
    builderAppSync.publishChangeWidgetStatePropToApp({ widgetId: this.props.id, propKey: 'initialMapDataSourceID', value: dataSourceId })
  }

  changeToolLayout = (index: number) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('layoutIndex', index)
    })
  }

  handleMapInitStateChanged = (config: IMJimuMapConfig) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('initialMapDataSourceID', config.initialMapDataSourceID).set('initialMapState', config.initialMapState)
    })
  }

  handleIsUseCustomMapState = (isUseCustomMapState: boolean) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('isUseCustomMapState', isUseCustomMapState).set('initialMapState', null)
    })
  }

  updateSelectionHighlightColor = (color: string) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('selectionHighlightColor', color)
    })
  }

  updateSelectionHighlightHaloColor = (color: string) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('selectionHighlightHaloColor', color)
    })
  }

  onEnablePopupSwitchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const disableMapPopup = !evt.target.checked

    let newConfig: IMConfig = this.props.config.set('disablePopUp', disableMapPopup)

    if (disableMapPopup) {
      newConfig = newConfig.set('showPopupUponSelection', false).set('popupDockPosition', '')
    }

    this.props.onSettingChange({
      id: this.props.id,
      config: newConfig
    })
  }

  onShowPopupUponSelectionCheckboxChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.onMapOptionsChanged(evt.target.checked, 'showPopupUponSelection')
  }

  onDockPopupCheckboxChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const config = this.props.config
    let newConfig: IMConfig = config

    if (evt.target.checked) {
      newConfig = config.set('popupDockPosition', 'auto')
    } else {
      newConfig = config.set('popupDockPosition', '')
    }

    this.props.onSettingChange({
      id: this.props.id,
      config: newConfig
    })
  }

  // this method is triggered if 'Default' radio is checked
  onAutoDockPopupPositionRadioChange = () => {
    const config = this.props.config
    const newConfig = config.set('popupDockPosition', 'auto')
    this.props.onSettingChange({
      id: this.props.id,
      config: newConfig
    })
  }

  // this method is triggered if 'Custom' radio is checked
  onCustomDockPopupPositionRadioChange = () => {
    const config = this.props.config
    const newConfig = config.set('popupDockPosition', 'top-right')
    this.props.onSettingChange({
      id: this.props.id,
      config: newConfig
    })
  }

  onPopupDockPositionChange = (newPosition: PopupDockPosition) => {
    const config = this.props.config

    if (config.popupDockPosition === newPosition) {
      return
    }

    const newConfig = config.set('popupDockPosition', newPosition)

    this.props.onSettingChange({
      id: this.props.id,
      config: newConfig
    })
  }

  handleMapThumbKeyDown = (e: React.KeyboardEvent<any>, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      this.setInitialMap(this.props.useDataSources[index].dataSourceId)
      e?.preventDefault()
    }
  }

  handleLayoutThumbKeyDown = (e: React.KeyboardEvent<any>, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      this.changeToolLayout(index)
      e?.preventDefault()
    }
  }

  getAppClientQueryDataSourceWidgetInfo = (): AppClientQueryDataSourceWidgetInfo => {
    const result: AppClientQueryDataSourceWidgetInfo = {} // { dataSourceId: mapWidgetIds }
    const widgetsJson = getAppStore().getState()?.appStateInBuilder?.appConfig?.widgets

    if (widgetsJson) {
      const widgetJsonArray = Object.values(widgetsJson)

      for (const widgetJson of widgetJsonArray) {
        if (widgetJson.uri === 'widgets/arcgis/arcgis-map/') {
          const mapWidgetId = widgetJson.id
          const useDataSources = widgetJson.useDataSources
          const mapWidgetConfig = widgetJson.config as IMConfig

          const useDataSourceIds: string[] = []

          if (useDataSources && useDataSources.length > 0) {
            useDataSources.forEach(useDataSource => {
              const dataSourceId = useDataSource?.dataSourceId

              if (dataSourceId) {
                useDataSourceIds.push(dataSourceId)
              }
            })
          }

          // The dataSourceId in mapWidgetConfig.clientQueryDataSourceIds maybe not exist in widgetJson.useDataSources (see #17570 for more details),
          // so we need to validate mapWidgetConfig.clientQueryDataSourceIds by widgetJson.useDataSources.
          const validClientQueryDataSourceIds: string[] = []

          if (mapWidgetConfig?.clientQueryDataSourceIds?.length > 0) {
            // This is just a workaround for #17570, need further fix once #12995 fixed.
            mapWidgetConfig?.clientQueryDataSourceIds?.forEach(dataSourceId => {
              if (useDataSourceIds.includes(dataSourceId)) {
                validClientQueryDataSourceIds.push(dataSourceId)
              }
            })
          }

          if (validClientQueryDataSourceIds?.length > 0) {
            validClientQueryDataSourceIds?.forEach(dataSourceId => {
              if (!result[dataSourceId]) {
                result[dataSourceId] = []
              }

              if (!result[dataSourceId].includes(mapWidgetId)) {
                result[dataSourceId].push(mapWidgetId)
              }
            })
          }
        }
      }
    }

    return result
  }

  // Return true if the new selected data source can enable client query by default, otherwise return false.
  // newSelectedDs is just selected from DataSourceSelector, it is not in this.props.useDataSources yet.
  canNewSelectedDataSourceEnableClientQuery = (newSelectedDs: UseDataSource): boolean => {
    let result: boolean = false

    const dataSourceId = newSelectedDs.dataSourceId
    const allDsJsons = this.props.dsJsons
    const dsJson = allDsJsons && allDsJsons[dataSourceId]

    if (dsJson && dsJson.type === 'WEB_MAP') {
      const appClientQueryDataSourceWidgetInfo = this.getAppClientQueryDataSourceWidgetInfo()
      // widgetIds is the widget ids that enable client query for the newSelectedDs data source.
      const widgetIds = appClientQueryDataSourceWidgetInfo[dataSourceId] || []
      result = widgetIds.length === 0
    }

    return result
  }

  getDsClientQueryInfos = (): DataSourceClientQueryInfo[] => {
    const result: DataSourceClientQueryInfo[] = []
    const appClientQueryDataSourceWidgetInfo = this.getAppClientQueryDataSourceWidgetInfo()
    const currMapWidgetId = this.props.id
    const allDsJsons = this.props.dsJsons

    if (allDsJsons && this.props.useDataSources?.length > 0) {
      this.props.useDataSources?.forEach(useDataSource => {
        const dataSourceId = useDataSource.dataSourceId

        if (dataSourceId) {
          const dsJson = allDsJsons[dataSourceId]

          if (dsJson && dsJson.type === 'WEB_MAP') {
            const dsLabel = dsJson.label || dsJson.sourceLabel || ''
            const enableClientQueryWidgetIds = appClientQueryDataSourceWidgetInfo[dataSourceId] || []
            const clientQueryEnabled = enableClientQueryWidgetIds.includes(currMapWidgetId)

            let switchEnabled = false

            if (clientQueryEnabled) {
              switchEnabled = true
            } else {
              switchEnabled = enableClientQueryWidgetIds.length === 0
            }

            result.push({
              dataSourceId,
              dsLabel,
              clientQueryEnabled,
              switchEnabled
            })
          }
        }
      })
    }

    return result
  }

  // enable client query for dataSourceId, dataSourceId is the old config, this method will return a new config with client query enabled
  getNewConfigByEnableDataSourceClientQuery = (oldConfig: IMConfig, dataSourceId: string): IMConfig => {
    let newConfig: IMConfig = oldConfig

    const oldClientQueryDataSourceIds = oldConfig.clientQueryDataSourceIds
    let newClientQueryDataSourceIds: ImmutableArray<string> = null

    if (oldClientQueryDataSourceIds) {
      if (oldClientQueryDataSourceIds.includes(dataSourceId)) {
        newClientQueryDataSourceIds = oldClientQueryDataSourceIds
      } else {
        newClientQueryDataSourceIds = Immutable(oldClientQueryDataSourceIds.asMutable().concat(dataSourceId))
      }
    } else {
      newClientQueryDataSourceIds = Immutable([dataSourceId])
    }

    if (oldClientQueryDataSourceIds !== newClientQueryDataSourceIds) {
      newConfig = oldConfig.set('clientQueryDataSourceIds', newClientQueryDataSourceIds)
    }

    return newConfig
  }

  // disable client query for dataSourceId, dataSourceId is the old config, this method will return a new config with client query disabled
  getNewConfigByDisableDataSourceClientQuery = (oldConfig: IMConfig, dataSourceId: string): IMConfig => {
    let newConfig: IMConfig = oldConfig

    if (oldConfig.clientQueryDataSourceIds?.includes(dataSourceId)) {
      const newClientQueryDataSourceIds = oldConfig.clientQueryDataSourceIds.filter(item => item !== dataSourceId)
      newConfig = newConfig.set('clientQueryDataSourceIds', newClientQueryDataSourceIds)
    }

    return newConfig
  }

  onClientQueryChanged = (dataSourceId: string, checked: boolean) => {
    const currentWidgetId = this.props.id
    const oldConfig = this.props.config
    let newConfig = oldConfig

    if (checked) {
      // enable client query
      // need to check if other map already enable client query for safety
      const appClientQueryDataSourceWidgetInfo = this.getAppClientQueryDataSourceWidgetInfo()
      const widgetIds = appClientQueryDataSourceWidgetInfo[dataSourceId] || []
      const otherWidgetIds = widgetIds.filter(widgetId => widgetId !== currentWidgetId)

      if (otherWidgetIds.length > 0) {
        console.warn(`the data source ${dataSourceId} is enabled client query in another map widget, ${otherWidgetIds}`)
        return
      }

      newConfig = this.getNewConfigByEnableDataSourceClientQuery(oldConfig, dataSourceId)
    } else {
      // disable client query
      newConfig = this.getNewConfigByDisableDataSourceClientQuery(oldConfig, dataSourceId)
    }

    this.props.onSettingChange({
      id: currentWidgetId,
      config: newConfig
    })
  }

  render () {
    // const mapWidgetId = this.props?.widgetId
    const portalUrl = this.getPortUrl()
    // const hasWebMapDataSource = this.hasWebMapDataSource()

    let sceneQualityModeContent = null
    if (this.hasWebSceneDataSource()) {
      const sceneQualityModeLabel = this.props.intl.formatMessage({ id: 'sceneQualityMode', defaultMessage: defaultMessages.sceneQualityMode })
      sceneQualityModeContent = (
        <SettingRow flow='wrap' label={sceneQualityModeLabel}>
          <Select
            size='sm' value={(this.props.config && this.props.config.sceneQualityMode) || SceneQualityMode.low}
            onChange={evt => { this.onSceneQualityModeChanged(evt.target.value, 'sceneQualityMode') }} className=''
          >
            {/* <option key={1} value='auto'><FormattedMessage id='auto' defaultMessage='Auto' /></option> */}
            <option key={2} value='low'><FormattedMessage id='low' defaultMessage='Low' /></option>
            <option key={3} value='medium'><FormattedMessage id='medium' defaultMessage='Medium' /></option>
            <option key={4} value='high'><FormattedMessage id='high' defaultMessage='High' /></option>
          </Select>
        </SettingRow>
      )
    }

    const alertText = this.props.intl.formatMessage({ id: 'selectThirdMapHint', defaultMessage: defaultMessages.selectThirdMapHint })
    const showPopupUponSelectionTooltip = this.props.intl.formatMessage({ id: 'showPopupUponSelectionTooltip', defaultMessage: defaultMessages.showPopupUponSelectionTooltip })

    let sidePopperTrigger: HTMLElement = null

    if (this.alertRef && this.alertRef.current) {
      sidePopperTrigger = this.alertRef.current as HTMLElement
    }

    const enablePopUp = !!(this.props.config && !this.props.config.disablePopUp)
    const showPopupUponSelection = enablePopUp && !!(this.props.config && this.props.config.showPopupUponSelection)
    const popupDockPosition: PopupDockPosition = enablePopUp ? getValidPopupDockPosition(this.props.config) : null
    const dockPopup = !!popupDockPosition
    const useAutoDockPopupPosition = popupDockPosition === 'auto'
    const useCustomDockPopupPosition = popupDockPosition && popupDockPosition !== 'auto'

    const dsClientQueryInfos = this.getDsClientQueryInfos()

    const moreInformation = this.props.intl.formatMessage({ id: 'moreInformation', defaultMessage: defaultMessages.moreInformation })
    let clientQueryHelpTip: any = ''

    clientQueryHelpTip = this.props.intl.formatMessage({
      id: 'clientQueryHelpTip',
      defaultMessage: defaultMessages.clientQueryHelpTip
    }, {
      link: <a href={this.state.clientQueryHelpHref} target="_blank" rel="noopener noreferrer">{moreInformation}</a>
    })

    const clientQueryHelpTipCss = css`
      width: 360px;
      font-size: 12px;
    `

    const toolTipTitleOfClientQueryHelpTip = (<div className='p-2' css={clientQueryHelpTipCss}>
      <div>{clientQueryHelpTip}</div>
    </div>)

    const clientQueryDisabledTip = this.props.intl.formatMessage({ id: 'clientQueryDisabledTip', defaultMessage: defaultMessages.clientQueryDisabledTip })
    const defaultLabel = this.props.intl.formatMessage({ id: 'default', defaultMessage: jimuUIDefaultMessages.default })
    const customLabel = this.props.intl.formatMessage({ id: 'custom', defaultMessage: jimuUIDefaultMessages.custom })

    return (
      <div css={this.getStyle()}>
      <div className='widget-setting-map'>
        <Alert
          closable
          className='select-third-map-alert'
          form='basic'
          onClose={this.onSelectThirdMapAlertClose}
          open={this.state.showSelectThirdMapAlert}
          text={alertText}
          type='warning'
          withIcon
          ref={this.alertRef}
        />

        {/* <JimuMapViewComponent
          useMapWidgetId={mapWidgetId}
          onActiveViewChange={this.onActiveJimuViewChange}
        /> */}

        {/* Source */}
        <SettingSection className='section-title' title={this.props.intl.formatMessage({ id: 'sourceLabel', defaultMessage: defaultMessages.sourceLabel })}>
          <SettingRow flow='wrap'>
            <div className='source-description text-break'>{this.props.intl.formatMessage({ id: 'sourceDescript', defaultMessage: defaultMessages.sourceDescript })}</div>
          </SettingRow>

          <SettingRow>
            <DataSourceSelector
              isMultiple types={this.supportedDsTypes}
              buttonLabel={this.props.intl.formatMessage({ id: 'selectMap', defaultMessage: defaultMessages.selectMap })}
              onChange={this.onDataSourceChange} useDataSources={this.props.useDataSources}
              disableSelection={this.onDisableSelection} mustUseDataSource widgetId={this.props.id}
              onClickDisabledDsItem={this.onClickDisabledDsItem} sidePopperTrigger={sidePopperTrigger}
            />
          </SettingRow>

          {
            portalUrl && this.props.dsJsons && this.props.useDataSources && this.props.useDataSources.length === 1 &&
            <SettingRow>
              <div className='w-100'>
                <div
                  className='webmap-thumbnail selected-item' title={this.props.dsJsons[this.props.useDataSources[0].dataSourceId]?.sourceLabel}
                  onClick={() => { this.setInitialMap(this.props.useDataSources[0].dataSourceId) }}
                >
                  <MapThumb
                    mapItemId={this.props.dsJsons[this.props.useDataSources[0].dataSourceId]
                      ? this.props.dsJsons[this.props.useDataSources[0].dataSourceId].itemId
                      : null}
                    portUrl={this.props.dsJsons[this.props.useDataSources[0].dataSourceId]
                      ? this.props.dsJsons[this.props.useDataSources[0].dataSourceId].portalUrl
                      : null}
                    theme={this.props.theme}
                  />
                </div>
              </div>
            </SettingRow>
          }

          {
            portalUrl && this.props.dsJsons && this.props.useDataSources && this.props.useDataSources.length === 2 &&
              <SettingRow>
                <div className='w-100 d-flex justify-content-between'>
                  <div
                    onClick={() => { this.setInitialMap(this.props.useDataSources[0].dataSourceId) }}
                    title={this.props.dsJsons[this.props.useDataSources[0].dataSourceId]?.sourceLabel}
                    className={classNames('webmap-thumbnail-multi', { 'selected-item': this.props.config.initialMapDataSourceID === this.props.useDataSources[0].dataSourceId })}
                    tabIndex={0} role='button' onKeyDown={e => { this.handleMapThumbKeyDown(e, 0) }}
                  >
                    <MapThumb
                      mapItemId={this.props.dsJsons[this.props.useDataSources[0].dataSourceId]
                        ? this.props.dsJsons[this.props.useDataSources[0].dataSourceId].itemId
                        : null}
                      portUrl={this.props.dsJsons[this.props.useDataSources[0].dataSourceId]
                        ? this.props.dsJsons[this.props.useDataSources[0].dataSourceId].portalUrl
                        : null}
                      theme={this.props.theme}
                    />
                  </div>
                  <div
                    onClick={() => { this.setInitialMap(this.props.useDataSources[1].dataSourceId) }}
                    title={this.props.dsJsons[this.props.useDataSources[1].dataSourceId].sourceLabel}
                    className={classNames('webmap-thumbnail-multi', { 'selected-item': this.props.config.initialMapDataSourceID === this.props.useDataSources[1].dataSourceId })}
                    tabIndex={0} role='button' onKeyDown={e => { this.handleMapThumbKeyDown(e, 1) }}
                  >
                    <MapThumb
                      mapItemId={this.props.dsJsons[this.props.useDataSources[1].dataSourceId]
                        ? this.props.dsJsons[this.props.useDataSources[1].dataSourceId].itemId
                        : null}
                      portUrl={this.props.dsJsons[this.props.useDataSources[1].dataSourceId]
                        ? this.props.dsJsons[this.props.useDataSources[1].dataSourceId].portalUrl
                        : null}
                      theme={this.props.theme}
                    />
                  </div>
                </div>
              </SettingRow>
          }
        </SettingSection>

        {/* Initial view */}
        <SettingSection aria-label={this.props.intl.formatMessage({ id: 'initialMapView', defaultMessage: defaultMessages.initialMapView })}>
          <CollapsablePanel
            label={this.props.intl.formatMessage({ id: 'initialMapView', defaultMessage: defaultMessages.initialMapView })}
            level={1}
            type='default'
            wrapperClassName='mt-4'
          >
            <SettingRow>
              <div className='d-flex justify-content-between w-100 align-items-center'>
                <Label title={this.props.intl.formatMessage({ id: 'defaultViewTip', defaultMessage: defaultMessages.defaultViewTip })}>
                  <Radio
                    className='mr-2'
                    style={{ cursor: 'pointer' }}
                    onChange={() => { this.handleIsUseCustomMapState(false) }}
                    checked={!this.props.config.isUseCustomMapState}
                  />
                  {this.props.intl.formatMessage({ id: 'defaultView', defaultMessage: defaultMessages.defaultView })}
                </Label>
              </div>
            </SettingRow>

            <SettingRow>
              <div className='d-flex justify-content-between w-100 align-items-center'>
                <Label title={this.props.intl.formatMessage({ id: 'customViewTip', defaultMessage: defaultMessages.customViewTip })}>
                  <Radio
                    className='mr-2'
                    style={{ cursor: 'pointer' }}
                    onChange={() => { this.handleIsUseCustomMapState(true) }}
                    checked={this.props.config.isUseCustomMapState}
                  />
                  {this.props.intl.formatMessage({ id: 'customView', defaultMessage: defaultMessages.customView })}
                </Label>
              </div>
            </SettingRow>

            {
              this.props.config.isUseCustomMapState &&
              <SettingRow>
                <div className='ml-5'>
                  <MapStatesEditor
                    title={this.props.intl.formatMessage({ id: 'setMapView', defaultMessage: defaultMessages.setMapView })}
                    buttonLabel={this.props.intl.formatMessage({ id: 'customViewSet', defaultMessage: defaultMessages.customViewSet })}
                    useDataSources={this.props.useDataSources}
                    jimuMapConfig={this.props.config as IMJimuMapConfig} id={this.props.id}
                    onConfigChanged={this.handleMapInitStateChanged} isUseWidgetSize
                  />
                </div>
              </SettingRow>
            }
          </CollapsablePanel>
        </SettingSection>

        {/* Scale range */}
        {/* <SettingSection aria-label={this.props.intl.formatMessage({ id: 'scaleRange', defaultMessage: defaultMessages.scaleRange })}>
          <CollapsablePanel
            label={this.props.intl.formatMessage({ id: 'scaleRange', defaultMessage: defaultMessages.scaleRange })}
            level={1}
            type='default'
            wrapperClassName='mt-4'
          >
            <SettingRow label={this.props.intl.formatMessage({ id: 'scaleRangeTip', defaultMessage: defaultMessages.scaleRangeTip })}>
            </SettingRow>

            {
              !hasWebMapDataSource &&
              <SettingRow>
                <Alert
                  closable={false}
                  form='basic'
                  text={this.props.intl.formatMessage({ id: 'noScaleRangeSliderTip', defaultMessage: defaultMessages.noScaleRangeSliderTip })}
                  type='warning'
                  withIcon
                />
              </SettingRow>
            }

            {
              hasWebMapDataSource &&
              <SettingRow>
                <div className='exb-scale-range-slider-container w-100' ref={this.onScaleRangeSliderContainerChange}></div>
              </SettingRow>
            }
          </CollapsablePanel>
        </SettingSection> */}

        {/* Tools */}
        <SettingSection aria-label={this.props.intl.formatMessage({ id: 'toolLabel', defaultMessage: defaultMessages.toolLabel })}>
          <CollapsablePanel
            label={this.props.intl.formatMessage({ id: 'toolLabel', defaultMessage: defaultMessages.toolLabel })}
            level={1}
            type='default'
            wrapperClassName='mt-4'
          >
            <SettingRow>
              <div className='w-100 webmap-tools'>
                {Object.keys(ToolModules).map((key, index) => {
                  if (ToolModules[key].isNeedSetting) {
                    return (
                      <div className='webmap-tools-item' key={index}>
                        <span className='text-break' style={{ width: '80%' }}>{this.props.intl.formatMessage({ id: key + 'Label', defaultMessage: jimuUIDefaultMessages[key + 'Label'] })}</span>
                        <Switch
                          className='can-x-switch' checked={(this.props.config.toolConfig && this.props.config.toolConfig[`can${key}`]) || false}
                          onChange={evt => { this.onMapToolsChanged(evt.target.checked, `can${key}`) }}
                          aria-label={this.props.intl.formatMessage({ id: key + 'Label', defaultMessage: jimuUIDefaultMessages[key + 'Label'] })}
                        />
                      </div>
                    )
                  } else {
                    return null
                  }
                })}
              </div>
            </SettingRow>
          </CollapsablePanel>
        </SettingSection>

        {/* Tools layout */}
        <SettingSection aria-label={this.props.intl.formatMessage({ id: 'mapLayout', defaultMessage: defaultMessages.mapLayout })}>
          <CollapsablePanel
            label={this.props.intl.formatMessage({ id: 'mapLayout', defaultMessage: defaultMessages.mapLayout })}
            level={1}
            type='default'
            wrapperClassName='mt-4'
          >
            <SettingRow>
              <div className='source-description' id='largeAndMediumLayout'>
                {this.props.intl.formatMessage({ id: 'mapLayout_LargeAndMedium', defaultMessage: defaultMessages.mapLayout_LargeAndMedium })}
              </div>
            </SettingRow>
            <SettingRow>
              <div className='w-100 d-flex justify-content-between'>
                <div
                  onClick={() => { this.changeToolLayout(0) }} className={classNames('webmap-thumbnail-multi border d-flex justify-content-center align-items-center', {
                    'selected-item': !this.props.config.layoutIndex
                  })}
                  aria-labelledby='largeAndMediumLayout'
                  tabIndex={0} role='button' onKeyDown={e => { this.handleLayoutThumbKeyDown(e, 0) }}
                >
                  <ImageWithParam imageParam={{ url: require('./assets/pc-layout-0.svg') }} />
                </div>
                <div
                  onClick={() => { this.changeToolLayout(1) }} className={classNames('webmap-thumbnail-multi border d-flex justify-content-center align-items-center', {
                    'selected-item': this.props.config.layoutIndex === 1
                  })}
                  aria-labelledby='largeAndMediumLayout'
                  tabIndex={0} role='button' onKeyDown={e => { this.handleLayoutThumbKeyDown(e, 1) }}
                >
                  <ImageWithParam imageParam={{ url: require('./assets/pc-layout-1.svg') }} />
                </div>
              </div>
            </SettingRow>
          </CollapsablePanel>
        </SettingSection>

        {/* Options */}
        <SettingSection aria-label={this.props.intl.formatMessage({ id: 'options', defaultMessage: jimuUIDefaultMessages.options })}>
          <CollapsablePanel
            label={this.props.intl.formatMessage({ id: 'options', defaultMessage: jimuUIDefaultMessages.options })}
            level={1}
            type='default'
            wrapperClassName='mt-4'
          >
            <SettingRow>
              <div className='w-100 webmap-tools'>
                <div className='webmap-tools-item'>
                  <label>
                    <FormattedMessage id='featureSelectionColor' defaultMessage={defaultMessages.featureSelectionColor} />
                  </label>
                </div>
                <div className='d-flex justify-content-between' style={{ marginBottom: '8px', color: `${this.props.theme.ref.palette.neutral[900]}` }}>
                  <label id='highlightFill'>
                    <FormattedMessage id='featureHighlightFill' defaultMessage={defaultMessages.featureHighlightFill} />
                  </label>
                  <div>
                    <ColorPicker
                      style={{ padding: '4' }} width={30} height={26}
                      color={this.props.config.selectionHighlightColor ? this.props.config.selectionHighlightColor : '#00FFFF'}
                      onChange={this.updateSelectionHighlightColor} presetColors={this.presetColors}
                      aria-label={this.props.intl.formatMessage({ id: 'featureHighlightFill', defaultMessage: defaultMessages.featureHighlightFill })}
                    />
                  </div>
                </div>
                <div className='d-flex justify-content-between' style={{ color: `${this.props.theme.ref.palette.neutral[900]}` }}>
                  <label>
                    <FormattedMessage id='featureHighlightOutline' defaultMessage={defaultMessages.featureHighlightOutline} />
                  </label>
                  <div>
                    <ColorPicker
                      style={{ padding: '4' }} width={30} height={26}
                      color={this.props.config.selectionHighlightHaloColor ? this.props.config.selectionHighlightHaloColor : '#00FFFF'}
                      onChange={this.updateSelectionHighlightHaloColor} presetColors={this.presetColors}
                      aria-label={this.props.intl.formatMessage({ id: 'featureHighlightOutline', defaultMessage: defaultMessages.featureHighlightOutline })}
                    />
                  </div>
                </div>
              </div>
            </SettingRow>

            <SettingRow className='justify-content-between'>
              <label id='enableScrollZoomTool'>
                <FormattedMessage id='enableScrollZoom' defaultMessage={defaultMessages.enableScrollZoom} />
              </label>
              <Switch
                className='can-x-switch' checked={(this.props.config && this.props.config.disableScroll !== true) /* eslint-disable-line */}
                data-key='disableScroll' onChange={evt => { this.onMapOptionsChanged(!evt.target.checked, 'disableScroll') }}
                aria-labelledby='enableScrollZoomTool'
              />
            </SettingRow>

            <SettingRow className='justify-content-between'>
              <label id='enablePopupTool' className='text-break'>
                <FormattedMessage id='enablePopUp' defaultMessage={defaultMessages.enablePopUp} />
              </label>
              <Switch
                className='can-x-switch' checked={enablePopUp}
                data-key='disablePopUp' onChange={this.onEnablePopupSwitchChange}
                aria-labelledby='enablePopupTool'
              />
            </SettingRow>

            {
              enablePopUp && (
                <SettingRow>
                  <Label>
                    <Checkbox
                      checked={showPopupUponSelection}
                      className='mr-1'
                      onChange={this.onShowPopupUponSelectionCheckboxChange}
                    />
                    <FormattedMessage id='showPopupUponSelection' defaultMessage={defaultMessages.showPopupUponSelection} />
                  </Label>
                  <Tooltip title={showPopupUponSelectionTooltip} showArrow placement='left'>
                    <span>
                      <InfoOutlined />
                    </span>
                  </Tooltip>
                </SettingRow>
              )
            }

            {
              enablePopUp && (
                <React.Fragment>
                  <SettingRow>
                    <Label>
                      <Checkbox
                        checked={dockPopup}
                        className='mr-1'
                        onChange={this.onDockPopupCheckboxChange}
                      />
                      <FormattedMessage id='dockPopup' defaultMessage={defaultMessages.dockPopup} />
                    </Label>
                  </SettingRow>

                  {
                    dockPopup && (
                      <React.Fragment>
                        <SettingRow>
                          <div className='dock-popup-section d-flex w-100 align-items-center'>
                            <label className='dock-popup-label w-100'>
                              <FormattedMessage id='position' defaultMessage={jimuUIDefaultMessages.position} />
                            </label>
                          </div>
                        </SettingRow>

                        <SettingRow>
                          <Label title={defaultLabel}>
                            <Radio
                              className='mr-2'
                              style={{ cursor: 'pointer' }}
                              checked={useAutoDockPopupPosition}
                              onChange={this.onAutoDockPopupPositionRadioChange}
                            />
                            {defaultLabel}
                          </Label>
                        </SettingRow>

                        <SettingRow>
                          <Label title={customLabel} className={classNames('dock-popup-custom-position-label', { 'use-custom-dock-popup-position': useCustomDockPopupPosition, 'pr-1': useCustomDockPopupPosition })} style={{ }}>
                            <Radio
                              className='mr-2'
                              style={{ cursor: 'pointer' }}
                              checked={useCustomDockPopupPosition}
                              onChange={this.onCustomDockPopupPositionRadioChange}
                            />
                            {customLabel}
                          </Label>

                          {
                            useCustomDockPopupPosition &&
                            <PopupPositionSetting
                              value={popupDockPosition as CustomPopupDockPosition}
                              onChange={this.onPopupDockPositionChange}
                            />
                          }
                        </SettingRow>

                      </React.Fragment>
                    )
                  }
                </React.Fragment>
              )
            }

            {sceneQualityModeContent}

            {
              dsClientQueryInfos.length > 0 &&
              <React.Fragment>
                <SettingRow
                  bottomLine={true}
                >
                </SettingRow>

                <SettingRow
                  level={2}
                  label={this.props.intl.formatMessage({ id: 'enableClientSideQuery', defaultMessage: defaultMessages.enableClientSideQuery })}
                  flow='no-wrap'
                  className='enable-client-query-header'
                >
                  <Tooltip title={toolTipTitleOfClientQueryHelpTip} showArrow placement='left' interactive={true} leaveDelay={1000}>
                    <span>
                      <InfoOutlined />
                    </span>
                  </Tooltip>
                </SettingRow>

                {
                  dsClientQueryInfos.map(clientQueryInfo => {
                    const {
                      dataSourceId,
                      dsLabel,
                      clientQueryEnabled,
                      switchEnabled
                    } = clientQueryInfo

                    const isSwitchDisabled = !switchEnabled

                    return (
                      <SettingRow
                        key={dataSourceId}
                        level={3}
                        label={dsLabel}
                        flow='no-wrap'
                        className='w-100'
                      >
                        {
                          isSwitchDisabled &&
                          <Tooltip title={clientQueryDisabledTip} showArrow placement='left'>
                            <span className='mr-2'>
                              <InfoOutlined />
                            </span>
                          </Tooltip>
                        }

                        <Switch
                          className='can-x-switch'
                          disabled={isSwitchDisabled}
                          checked={clientQueryEnabled}
                          onChange={evt => { this.onClientQueryChanged(dataSourceId, evt.target.checked) }}
                        />
                      </SettingRow>
                    )
                  })
                }
              </React.Fragment>
            }
          </CollapsablePanel>
        </SettingSection>

      </div>
      </div>
    )
  }
}
