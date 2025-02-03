/** @jsx jsx */
import {
  classNames,
  Immutable,
  type DataSource,
  type IMState,
  React,
  type IMAppConfig,
  type IMThemeVariables,
  type SerializedStyles,
  css,
  jsx,
  polished,
  AppMode,
  BrowserSizeMode,
  type UseDataSource,
  DataSourceComponent,
  getAppStore,
  type ImmutableArray,
  JimuFieldType,
  type OrderByOption,
  type IMSqlExpression,
  type SqlExpression,
  expressionUtils,
  appActions,
  type QueriableDataSource,
  type IMDataSourceInfo,
  type LayoutInfo,
  LayoutType,
  type Size,
  lodash,
  utils as jimuUtils,
  AllDataSourceTypes,
  type IMFieldSchema
} from 'jimu-core'
import {
  type AllWidgetSettingProps,
  getAppConfigAction,
  builderAppSync,
  templateUtils,
  widgetService,
  type AppConfigAction,
  builderActions
} from 'jimu-for-builder'
import {
  searchUtils,
  LayoutItemSizeModes,
  defaultMessages as jimuLayoutsDefaultMessages
} from 'jimu-layouts/layout-runtime'
import {
  SettingSection,
  SettingRow,
  SortSetting,
  type SortSettingOption,
  LinkSelector,
  type IMLinkParam,
  CardLayoutSetting,
  type SwitchCardLayoutOption,
  setLayoutAuto
} from 'jimu-ui/advanced/setting-components'
import {
  BackgroundSetting,
  BorderSetting,
  BorderRadiusSetting,
  SizeEditor,
  InputRatio,
  TextAlignment,
  type BorderSide
} from 'jimu-ui/advanced/style-setting-components'
import {
  Slider,
  Select,
  Switch,
  Checkbox,
  Icon,
  Button,
  type MultiSelectItem,
  defaultMessages as jimuUIDefaultMessages,
  Tooltip,
  TextInput,
  DistanceUnits,
  type LinearUnit,
  TextAlignValue,
  CollapsablePanel,
  utils as uiUtils,
  type BorderStyle
} from 'jimu-ui'
import { DataSourceSelector, FieldSelectorWithFullTextIndex } from 'jimu-ui/advanced/data-source-selector'
import {
  type IMConfig,
  PageStyle,
  ItemStyle,
  DirectionType,
  SelectionModeType,
  Status,
  type CardSize,
  LIST_CARD_MIN_SIZE,
  ListLayout,
  SettingCollapseType,
  ListLayoutType,
  DEFAULT_CARD_SIZE,
  DEFAULT_SPACE,
  type ElementSizeUnit,
  type ElementSize,
  SCROLL_BAR_WIDTH,
  MAX_PAGE_SIZE,
  MAX_ITEMS_PER_PAGE
} from '../config'
import defaultMessages from './translations/default'
import { Fragment } from 'react'
import { SqlExpressionBuilderPopup } from 'jimu-ui/advanced/sql-expression-builder'
import { handleResizeCard } from '../common-builder-support'
import { getJimuFieldNamesBySqlExpression } from 'jimu-ui/basic/sql-expression-runtime'
import { MyNumericInput } from './components/my-input'
import { type Template } from 'jimu-for-builder/templates'
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info'
import { DesktopOutlined } from 'jimu-icons/outlined/application/desktop'
import { TabletOutlined } from 'jimu-icons/outlined/application/tablet'
import { MobileOutlined } from 'jimu-icons/outlined/application/mobile'
import { RightOutlined } from 'jimu-icons/outlined/directional/right'
import { ClickOutlined } from 'jimu-icons/outlined/application/click'
import { ArrowLeftOutlined } from 'jimu-icons/outlined/directional/arrow-left'
import { LockOutlined } from 'jimu-icons/outlined/editor/lock'
import { UnlockOutlined } from 'jimu-icons/outlined/editor/unlock'
const prefix = 'jimu-widget-'

const originAllStyles: { [key: string]: Template } = {
  STYLE0: require('./template/card-style0.json'),
  STYLE1: require('./template/card-style1.json'),
  STYLE2: require('./template/card-style2.json'),
  STYLE3: require('./template/card-style3.json'),
  STYLE4: require('./template/card-style4.json'),
  STYLE5: require('./template/card-style5.json'),
  STYLE6: require('./template/card-style6.json'),
  STYLE7: require('./template/card-style7.json'),
  STYLE8: require('./template/card-style8.json'),
  STYLE9: require('./template/card-style9.json')
}

const defaultCardSize: { [key: string]: CardSize } = {
  STYLE0: {
    width: 200,
    height: 275
  },
  STYLE1: {
    width: 200,
    height: 275
  },
  STYLE2: {
    width: 200,
    height: 275
  },
  STYLE3: {
    width: 200,
    height: 275
  },
  STYLE4: {
    width: 360.52,
    height: 110
  },
  STYLE5: {
    width: 320,
    height: 88
  },
  STYLE6: {
    width: 360,
    height: 32
  },
  STYLE7: {
    width: 360.52,
    height: 110
  },
  STYLE8: {
    width: '50%',
    height: 160
  },
  STYLE9: {
    width: '33%',
    height: 160
  }
}

const defaultCardLayout: { [key: string]: ListLayoutType } = {
  STYLE0: ListLayoutType.Column,
  STYLE1: ListLayoutType.Column,
  STYLE2: ListLayoutType.Column,
  STYLE3: ListLayoutType.Column,
  STYLE4: ListLayoutType.Row,
  STYLE5: ListLayoutType.Row,
  STYLE6: ListLayoutType.Row,
  STYLE7: ListLayoutType.Row,
  STYLE8: ListLayoutType.GRID,
  STYLE9: ListLayoutType.GRID
}

let AllStyles: { [key: string]: Template }
const MESSAGES = Object.assign(
  {},
  defaultMessages,
  jimuUIDefaultMessages,
  jimuLayoutsDefaultMessages
)

function initStyles (widgetId: string) {
  if (AllStyles) {
    return AllStyles
  }
  AllStyles = {}
  Object.keys(originAllStyles).forEach(style => {
    AllStyles[style] = templateUtils.processForTemplate(
      originAllStyles[style],
      widgetId,
      MESSAGES
    )
  })
}

interface State {
  datasource: DataSource
  isTextExpPopupOpen: boolean
  currentTextInput: string
  isTipExpPopupOpen: boolean
  isSqlExprShow: boolean
  isTemplateContainScroll: boolean
  templateConWidth: number
  settingCollapse: SettingCollapseType
  aspectRatio: string
}

interface ExtraProps {
  appConfig: IMAppConfig
  appMode: AppMode
  browserSizeMode: BrowserSizeMode
  showCardSetting: Status
  selectionIsInSelf: boolean
  settingPanelChange: string
  layoutInfo: LayoutInfo
  widgetRect: ElementSize
  parentSize: ElementSize
  viewportSize?: Size
}

interface CustomProps {
  theme: IMThemeVariables
}

const DSSelectorTypes = Immutable([
  AllDataSourceTypes.FeatureLayer,
  AllDataSourceTypes.SceneLayer,
  AllDataSourceTypes.BuildingComponentSubLayer,
  AllDataSourceTypes.OrientedImageryLayer,
  AllDataSourceTypes.ImageryLayer,
  AllDataSourceTypes.SubtypeGroupLayer,
  AllDataSourceTypes.SubtypeSublayer
])

export default class Setting extends React.PureComponent<
AllWidgetSettingProps<IMConfig> & ExtraProps & CustomProps,
State
> {
  needUpdateFields: boolean
  listUseTipRef: any
  templatesContain: HTMLElement
  toHoverSettingButtonRef: HTMLButtonElement
  toSelectedSettingButtonRef: HTMLButtonElement
  updatePositionTimeout: any
  isPreDataSourceRefreshOpen: boolean
  aspectRatioRef: string
  resettingTheTemplateButtonRef: HTMLButtonElement
  debounceGridItemSizeRatioChange: (value: string) => void
  lastHoverLayout = {
    layout: [],
    widgets: {}
  }

  lastSelectedLayout = {
    layout: [],
    widgets: {}
  }

  static mapExtraStateProps = (
    state: IMState,
    props: AllWidgetSettingProps<IMConfig>
  ) => {
    const { id } = props
    return {
      appConfig:
        state && state.appStateInBuilder && state.appStateInBuilder.appConfig,
      appMode:
        state &&
        state.appStateInBuilder &&
        state.appStateInBuilder.appRuntimeInfo &&
        state.appStateInBuilder.appRuntimeInfo.appMode,
      browserSizeMode:
        state &&
        state.appStateInBuilder &&
        state.appStateInBuilder.browserSizeMode,
      showCardSetting:
        (state &&
          state.appStateInBuilder &&
          state.appStateInBuilder.widgetsState &&
          state.appStateInBuilder.widgetsState[id] &&
          state.appStateInBuilder.widgetsState[id].showCardSetting) ||
        Status.Default,
      selectionIsInSelf:
        state?.appStateInBuilder?.widgetsState[id]?.selectionIsInSelf,
      settingPanelChange: state?.widgetsState?.[props.id]?.settingPanelChange,
      layoutInfo: state?.appStateInBuilder?.widgetsState[id]?.layoutInfo,
      widgetRect: state?.appStateInBuilder?.widgetsState[id]?.widgetRect,
      parentSize: state?.appStateInBuilder?.widgetsState[id]?.parentSize,
      viewportSize: jimuUtils.findViewportSize(state?.appStateInBuilder?.appConfig, state?.appStateInBuilder?.browserSizeMode)
    }
  }

  constructor (props) {
    super(props)
    initStyles(props.id)
    this.state = {
      datasource: null,
      isTextExpPopupOpen: false,
      currentTextInput: '',
      isTipExpPopupOpen: false,
      isSqlExprShow: false,
      isTemplateContainScroll: false,
      templateConWidth: 0,
      settingCollapse: SettingCollapseType.None,
      aspectRatio: null
    }
    this.listUseTipRef = React.createRef()
    this.debounceGridItemSizeRatioChange = lodash.debounce(
      (value) => { this.handleGridItemSizeRatioChange(value) },
      200
    )
  }

  componentDidMount () {
    const { config, id, useDataSourcesEnabled } = this.props
    let { appConfig } = this.props
    if (!config.isInitialed) {
      if (!useDataSourcesEnabled) {
        appConfig = getAppConfigAction().editWidget(
          appConfig.widgets[id].set('useDataSourcesEnabled', true) as any
        ).appConfig
      }
      this.onItemStyleChanged(config.itemStyle, config?.isCheckEmptyTemplate, appConfig)
    }
    this.toggleMessageActionSettingOpenStateInExpressMode()
    window.addEventListener('resize', this.updateStartButtonPosition)
  }

  componentWillUnmount () {
    const { dispatch, id } = this.props
    dispatch(
      appActions.widgetStatePropChange(id, 'settingPanelChange', null)
    )
    clearTimeout(this.updatePositionTimeout)
  }

  onPropertyChange = (name, value) => {
    const { config } = this.props

    if (value === config[name]) {
      return
    }
    if (name === 'sorts' || name === 'filter' || name === 'searchFields') {
      this.needUpdateFields = true
    }
    const newConfig = config.set(name, value)
    this.onConfigChange(newConfig)
  }

  changeUsedFields = () => {
    const { useDataSources } = this.props
    if (useDataSources && useDataSources[0]) {
      const useDS = useDataSources[0].asMutable({ deep: true })
      useDS.fields = this.getAllFields()
      const alterProps = {
        id: this.props.id,
        useDataSources: [useDS]
      }
      this.props.onSettingChange(alterProps)
    }
  }

  onConfigChange = newConfig => {
    const alterProps = {
      id: this.props.id,
      config: newConfig
    }
    this.props.onSettingChange(alterProps)
  }

  onBackgroundStyleChange = (status: Status, key, value) => {
    let { config } = this.props
    config = config.setIn(
      ['cardConfigs', status, 'backgroundStyle', key],
      value
    )
    this.onConfigChange(config)
  }

  onSelectionModeChange = evt => {
    const value = evt.target.value
    this.changeSelectionMode(value)
  }

  private readonly changeSelectionMode = (value: SelectionModeType) => {
    const { id, layouts, browserSizeMode, appConfig } = this.props
    let { config } = this.props
    const selectionMode = config.cardConfigs[Status.Selected].selectionMode
    const listLayout = config.cardConfigs[Status.Selected].listLayout || ListLayout.CUSTOM
    if (selectionMode === value) {
      return
    }
    let action = getAppConfigAction()
    config = config.setIn(['cardConfigs', Status.Selected, 'selectionMode'], value)
    if (selectionMode !== SelectionModeType.None && value === SelectionModeType.None) {
      if (listLayout === ListLayout.CUSTOM) {
        // remove selected layout
        const desLayoutId = searchUtils.findLayoutId(
          layouts[Status.Selected],
          browserSizeMode,
          appConfig.mainSizeMode
        )
        action = action.clearLayoutContent(desLayoutId)
      }
      action.editWidgetConfig(id, config).exec()
      this.changeBuilderStatus(Status.Default)
    } else if (selectionMode === SelectionModeType.None && value !== SelectionModeType.None) {
      this.setLayoutAuto(Status.Selected, config)
      this.changeBuilderStatus(Status.Selected)
    } else if (selectionMode !== SelectionModeType.None && value !== SelectionModeType.None) {
      action.editWidgetConfig(id, config).exec()
    }
  }

  onSelectionSwitch = evt => {
    const selected = evt.target.checked
    if (selected) {
      this.changeSelectionMode(SelectionModeType.Single)
    } else {
      this.changeSelectionMode(SelectionModeType.None)
    }
  }

  onHoverLayoutOpenChange = evt => {
    const { config, id, layouts, browserSizeMode, appConfig } = this.props
    const listLayout = config?.cardConfigs?.[Status.Hover]?.listLayout || ListLayout.CUSTOM
    const value = evt.target.checked
    if (config.cardConfigs[Status.Hover].enable === value) return
    let action = getAppConfigAction()
    let newConfig = config.setIn(['cardConfigs', Status.Hover, 'enable'], value)
    newConfig = newConfig.setIn(['cardConfigs', Status.Hover, 'listLayout'], ListLayout.AUTO)
    if (config.cardConfigs[Status.Hover].enable && !value) {
      if (listLayout === ListLayout.CUSTOM) {
        // remove hover layout
        const desLayoutId = searchUtils.findLayoutId(
          layouts[Status.Hover],
          browserSizeMode,
          appConfig.mainSizeMode
        )
        action = action.clearLayoutContent(desLayoutId)
      }
      this.changeBuilderStatus(Status.Default)
      action.editWidgetConfig(id, newConfig).exec()
    } else if (!config.cardConfigs[Status.Hover].enable && value) {
      this.setLayoutAuto(Status.Hover, newConfig)
      this.changeBuilderStatus(Status.Hover)
    }
  }

  setLayoutAuto = (status: Status, newConfig: IMConfig) => {
    const { layouts, appConfig, id } = this.props
    const option: SwitchCardLayoutOption = {
      layout: ListLayout.AUTO as any,
      config: newConfig,
      widgetId: id,
      appConfig: appConfig,
      status: status,
      layouts: layouts?.asMutable({ deep: true }),
      mainSizeMode: appConfig.mainSizeMode
    }
    setLayoutAuto(option)
  }

  onOpenCardSetting = evt => {
    const status = evt.currentTarget.dataset.value
    this.changeCardSettingAndBuilderStatus(status)
  }

  // Export list template, use it in a single fullscreen page
  onExportClick = evt => {
    const { appConfig, layouts, id, browserSizeMode } = this.props
    const currentPageId = getAppStore().getState().appStateInBuilder
      .appRuntimeInfo.currentPageId
    const pageJson =
      appConfig.pages[currentPageId === 'default' ? 'home' : currentPageId]
    const widgets = Immutable(appConfig.widgets.without(id)).set('widget_x', appConfig.widgets[id])
    const pageTemplates = [
      {
        widgetId: id,
        config: {
          layouts: appConfig.layouts.without(
            pageJson.layout[browserSizeMode],
            layouts[Status.Selected][browserSizeMode],
            layouts[Status.Hover][browserSizeMode]
          ),
          widgets: widgets,
          views: appConfig.views,
          sections: appConfig.sections
        }
      }
    ]

    const template0 = pageTemplates[0]
    template0.config.layouts &&
      Object.keys(template0.config.layouts).forEach(layoutId => {
        let layoutJson = template0.config.layouts[layoutId].without('id')
        layoutJson.content &&
          Object.keys(layoutJson.content).forEach(lEId => {
            const lEJson = (layoutJson.content[lEId] as any)
              .without('id', 'parentId', 'layoutId')
              .setIn(['setting', 'lockParent'], true)
            layoutJson = layoutJson.setIn(['content', lEId], lEJson)
          })
        template0.config.layouts = template0.config.layouts.set(
          layoutId,
          layoutJson
        )
      })

    template0.config.widgets &&
      Object.keys(template0.config.widgets).forEach((wId, index) => {
        const wJson = template0.config.widgets[wId]
        template0.config.widgets = template0.config.widgets.set(
          wId,
          wJson.without(
            'context',
            'icon',
            'label',
            'manifest',
            '_originManifest',
            'version',
            'id',
            'useDataSourcesEnabled',
            'useDataSources'
          )
        )
      })

    template0.config.sections &&
      Object.keys(template0.config.sections).forEach((sId, index) => {
        const sJson = template0.config.sections[sId]
        template0.config.sections = template0.config.sections.set(
          sId,
          sJson.without('id', 'label')
        )
      })

    template0.config.views &&
      Object.keys(template0.config.views).forEach((vId, index) => {
        const vJson = template0.config.views[vId]
        template0.config.views = template0.config.views.set(
          vId,
          vJson.without('id', 'label')
        )
      })
    console.log(JSON.stringify(pageTemplates[0]))

    // const wJson = appConfig.widgets[this.props.id];
    // let embedLayoutJson = appConfig.layouts[wJson.layouts[Status.Default].LARGE]

    // const template = {
    //   cardSize: config.cardSize,
    //   cardSpace: config.space,
    //   layout: [],
    //   widgets: {}
    // }
    // Object.keys(embedLayoutJson).forEach((key) => {
    //   if(key === 'id' || key === 'ROOT_ID')return;
    //   let layoutEle = embedLayoutJson[key];
    //   if (layoutEle.type === LayoutItemType.Widget && layoutEle.widgetId){
    //     template.widgets[layoutEle.widgetId] = appConfig.widgets[layoutEle.widgetId].without('context', 'icon', 'label', 'manifest', '_originManifest', 'version', 'useDataSources');
    //     template.layout.push(layoutEle);
    //   }
    // });
    // console.log(JSON.stringify(template));
  }

  onCardSettingReturnBackClick = evt => {
    const { showCardSetting } = this.props
    this.changeCardSettingAndBuilderStatus(Status.Default)
    setTimeout(() => {
      if (showCardSetting === Status.Hover) {
        this.toHoverSettingButtonRef.focus()
      }
      if (showCardSetting === Status.Selected) {
        this.toSelectedSettingButtonRef?.focus()
      }
    }, 100)
  }

  showSqlExprPopup = () => {
    this.setState({ isSqlExprShow: true })
  }

  toggleSqlExprPopup = () => {
    const { isSqlExprShow } = this.state
    this.setState({ isSqlExprShow: !isSqlExprShow })
  }

  onSqlExprBuilderChange = (sqlExprObj: IMSqlExpression) => {
    this.onPropertyChange('filter', sqlExprObj)
  }

  private readonly changeCardSettingAndBuilderStatus = (status: Status) => {
    const { id, config } = this.props
    builderAppSync.publishChangeWidgetStatePropToApp({
      widgetId: id,
      propKey: 'showCardSetting',
      value: status
    })
    if (
      status === Status.Default ||
      (status === Status.Hover && config.cardConfigs[Status.Hover].enable) ||
      (status === Status.Selected &&
        config.cardConfigs[Status.Selected].selectionMode !==
          SelectionModeType.None)
    ) {
      this.changeBuilderStatus(status)
    }
  }

  private readonly switchLoading = (show: boolean) => {
    const { id } = this.props
    builderAppSync.publishChangeWidgetStatePropToApp({
      widgetId: id,
      propKey: 'showLoading',
      value: show
    })
  }

  private readonly changeBuilderStatus = (status: Status) => {
    const { id } = this.props
    builderAppSync.publishChangeWidgetStatePropToApp({
      widgetId: id,
      propKey: 'builderStatus',
      value: status
    })
  }

  onItemStyleChanged = (style: ItemStyle, isCheckEmptyTemplate = false, updatedAppConfig = undefined) => {
    // if(this.props.appMode === AppMode.Run) return;
    this.switchLoading(true)
    const { id, browserSizeMode } = this.props
    let { appConfig } = this.props
    if (updatedAppConfig) {
      appConfig = updatedAppConfig
    }
    let styleTemp = AllStyles[style]
    if (isCheckEmptyTemplate) {
      styleTemp = this.getEmptyTemplate(style)
    }
    widgetService.updateWidgetByTemplate(
      appConfig,
      styleTemp,
      id,
      styleTemp.widgetId,
      [browserSizeMode],
      {}
    ).then(newAppConfig => {
      this._onItemStyleChange(newAppConfig, style, isCheckEmptyTemplate)
      this.switchLoading(false)
    })
  }

  getEmptyTemplate = (style: ItemStyle) => {
    const styleTemp = AllStyles[style]
    const layouts = styleTemp?.config?.layouts || {}
    const widgets = styleTemp?.config?.widgets || {}
    let newStyle = Immutable(AllStyles[style])
    let newLayouts = Immutable(layouts)
    for (const layoutId in layouts) {
      newLayouts = newLayouts.setIn([layoutId, 'content'], {})
      newLayouts = newLayouts.setIn([layoutId, 'order'], [])
    }
    newStyle = newStyle.setIn(['config', 'layouts'], newLayouts)
    newStyle = newStyle.setIn(['config', 'widgets'], {
      widget_x: widgets?.widget_x
    })
    return newStyle?.asMutable({ deep: true })
  }

  private readonly getCardSizeUnit = (props): ElementSizeUnit => {
    props = props || this.props
    const { config, builderStatus, browserSizeMode } = props
    let cardConfigs = config.cardConfigs[builderStatus]
    if (!cardConfigs || !cardConfigs.cardSize) {
      cardConfigs = config.cardConfigs[Status.Default]
    }
    let cardSize = cardConfigs.cardSize[browserSizeMode]
    if (!cardSize) {
      cardSize = cardConfigs.cardSize[Object.keys(cardConfigs.cardSize)[0]]
    }
    return {
      width: uiUtils.toLinearUnit(cardSize.width),
      height: uiUtils.toLinearUnit(cardSize.height)
    }
  }

  handleFormChange = evt => {
    const target = evt.currentTarget
    if (!target) return
    const field = target.dataset.field
    const type = target.type
    let value
    switch (type) {
      case 'checkbox':
        value = target.checked
        break
      case 'select':
        value = target.value
        break
      case 'range':
        value = parseFloat(target.value)
        break
      case 'number':
        const numbertype = target.dataset.numbertype
        const parseNumber = numbertype === 'float' ? parseFloat : parseInt
        const minValue = !!target.min && parseNumber(target.min)
        const maxValue = !!target.max && parseNumber(target.max)
        value = evt.target.value
        if (!value || value === '') return
        value = parseNumber(evt.target.value)
        if (!!minValue && value < minValue) {
          value = minValue
        }
        if (!!maxValue && value > maxValue) {
          value = maxValue
        }
        break
      default:
        value = target.value
        break
    }
    this.onPropertyChange(field, value)
  }

  handleCheckboxChange = (dataField: string) => {
    if (!dataField) return false
    const currentCheckboxValue = this.props.config?.[dataField]
    this.onPropertyChange(dataField, !currentCheckboxValue)
  }

  handleItemsPerPageChange = value => {
    if (!value || value === '') {
      value = '1'
    }
    let valueInt = parseInt(value)
    if (valueInt < 0) valueInt = 1
    this.onPropertyChange('itemsPerPage', valueInt)
  }

  handleScrollStepChange = (valueInt: number) => {
    if (valueInt < 0) valueInt = 1
    this.onPropertyChange('scrollStep', valueInt)
  }

  handleSpaceChange = (valueFloat: number) => {
    if (!valueFloat && valueFloat !== 0) {
      this.onPropertyChange('space', 0)
    }
    this.onPropertyChange('space', valueFloat)
  }

  handleHorizontalSpaceChange = (valueFloat: number) => {
    if (!valueFloat && valueFloat !== 0) {
      this.onPropertyChange('horizontalSpace', 0)
    }
    this.onPropertyChange('horizontalSpace', valueFloat)
  }

  handleVerticalSpaceChange = (valueFloat: number) => {
    if (!valueFloat && valueFloat !== 0) {
      this.onPropertyChange('verticalSpace', 0)
    }
    this.onPropertyChange('verticalSpace', valueFloat)
  }

  handleItemSizeChange = (valueInt: number) => {
    const { config } = this.props
    const isHorizon = config?.layoutType === ListLayoutType.Column || config.direction === DirectionType.Horizon
    const oldCardSize = this.getCardSizeUnit(this.props)
    const ratio = oldCardSize.width.distance / oldCardSize.height.distance
    const newCardSize = this.getCardSize()
    valueInt = valueInt < LIST_CARD_MIN_SIZE ? LIST_CARD_MIN_SIZE : valueInt
    if (isHorizon) {
      newCardSize.width = `${valueInt}px`
      if (config.lockItemRatio) {
        newCardSize.height = `${valueInt / ratio}px`
      }
    } else {
      newCardSize.height = `${valueInt}px`
      if (config.lockItemRatio) {
        newCardSize.width = `${valueInt * ratio}px`
      }
    }
    handleResizeCard(this.props, newCardSize, config).exec()
  }

  getCardSize = (): CardSize => {
    const oldCardSize = this.getCardSizeUnit(this.props)
    return {
      width: uiUtils.stringOfLinearUnit(oldCardSize.width),
      height: uiUtils.stringOfLinearUnit(oldCardSize.height)
    }
  }

  componentDidUpdate (
    preProps: AllWidgetSettingProps<IMConfig> & ExtraProps & CustomProps
  ) {
    const { useDataSources, config, settingPanelChange } = this.props
    // if fields will change in componentDidUpdate
    let fieldsWillChange = false
    this.toggleMessageActionSettingOpenStateInExpressMode()
    if (useDataSources !== preProps.useDataSources) {
      const old = preProps.useDataSources?.[0]
      const now = this.props.useDataSources?.[0]
      if (!now || !old || old?.dataSourceId !== now?.dataSourceId) {
        this.onConfigChange(
          config
            .set('sorts', undefined)
            .set('searchFields', undefined)
            .set('filter', undefined)
        )
        fieldsWillChange = true
        if (!this.needUpdateFields) {
          this.needUpdateFields = true
        }
        if (old && !now) {
          // remove from ds manager
          this.setDatasource(undefined)
        }
      }
      if (
        !useDataSources ||
        useDataSources.length < 1 ||
        !preProps.useDataSources ||
        preProps.useDataSources.length < 1 ||
        preProps.useDataSources[0].dataSourceId !==
          useDataSources[0].dataSourceId
      ) {
        this.onConfigChange(
          config
            .set('sorts', undefined)
            .set('searchFields', undefined)
            .set('filter', undefined)
        )
        fieldsWillChange = true
        if (!this.needUpdateFields) {
          this.needUpdateFields = true
        }
      }
    }

    if (this.needUpdateFields && !fieldsWillChange) {
      this.needUpdateFields = false
      this.changeUsedFields()
    }

    if (preProps.settingPanelChange !== 'content' && settingPanelChange === 'content') {
      this.updateStartButtonPosition()
    }
  }

  toggleMessageActionSettingOpenStateInExpressMode = () => {
    const { appMode, config, showCardSetting } = this.props
    const { datasource } = this.state
    if (appMode !== AppMode.Express) return
    const isStatusDefault = showCardSetting === Status.Default || !showCardSetting
    const open = !!datasource && !!config?.isItemStyleConfirm && isStatusDefault
    this.toggleMessageActionSetting(open)
  }

  toggleMessageActionSetting = (open: boolean) => {
    const { appMode, dispatch, id } = this.props
    if (appMode !== AppMode.Express) return
    dispatch(builderActions.changeMessageActionSettingOpenState(id, open))
  }

  onSettingSortChange = (sortData: SortSettingOption[], index?: number) => {
    this.onPropertyChange('sorts', sortData)
  }

  private readonly _onItemStyleChange = (appConfig: IMAppConfig, style, isCheckEmptyTemplate = false) => {
    const { id, config: oldConfig } = this.props
    const appConfigAction = getAppConfigAction(appConfig)
    const wJson = appConfig.widgets[id]
    const template: Template = AllStyles[style]
    const templateWidgetJson = template.config.widgets[template.widgetId]
    wJson.layouts &&
      Object.keys(wJson.layouts).forEach(name => {
        wJson.layouts[name] &&
          Object.keys(wJson.layouts[name]).forEach(device => {
            if (
              templateWidgetJson?.layouts?.[name]?.[device] ||
              !templateWidgetJson?.layouts
            ) {
              return
            }

            // Judge if layout is empty
            let sizeLayouts = templateWidgetJson.layouts[name]
            if (!sizeLayouts) {
              const layoutKeys = Object.keys(templateWidgetJson.layouts)
              sizeLayouts = wJson.layouts[layoutKeys[layoutKeys.length - 1]]
            } else {
              sizeLayouts = wJson.layouts[name]
            }
            const length = Object.keys(sizeLayouts).length
            let embedLayoutJson
            for (const key in sizeLayouts) {
              if (key === BrowserSizeMode.Large) {
                embedLayoutJson = appConfig.layouts[sizeLayouts[key]]
              }
            }

            if (!embedLayoutJson) {
              embedLayoutJson =
              appConfig.layouts[
                sizeLayouts[Object.keys(sizeLayouts)[length - 1]]
              ]
            }
          })
      })

    // process inherit properties
    if (wJson.useDataSources && wJson.useDataSources.length > 0) {
      appConfigAction.copyUseDataSourceToAllChildWidgets(
        wJson.set('useDataSources', null),
        wJson
      )
    }

    this.editListLayoutSize(appConfigAction, style)
    const config = wJson.config
      .set('itemStyle', style)
      .set('isItemStyleConfirm', false)
      .set('isInitialed', true)
      .set('isCheckEmptyTemplate', isCheckEmptyTemplate)
    appConfigAction
      .editWidgetProperty(wJson.id, 'config', config)
      .editWidgetProperty(wJson.id, 'layouts', wJson.layouts)
      .exec(!oldConfig.isInitialed)
    // selectSelf(this.props);
  }

  editListLayoutSize = (appConfigAction: AppConfigAction, style: ItemStyle) => {
    const { layoutInfo, appConfig } = this.props
    const templateSize = this.getTemplateSize()
    const listSize = templateSize[style]
    const layoutType = this.getLayoutType()
    if (layoutType === LayoutType.FixedLayout) {
      const { layoutId, layoutItemId } = layoutInfo
      const layout = appConfig.layouts[layoutId]
      const layoutItem = layout?.content?.[layoutItemId]
      const bbox = layoutItem.bbox.set('width', `${listSize.width}%`).set('height', `${listSize.height}%`)
      appConfigAction
        .editLayoutItemProperty(layoutInfo, 'bbox', bbox)
        .exec()
    }
  }

  getTemplateSize = () => {
    const { parentSize } = this.props
    const columnRowTemplateWidth = 620
    const columnRowTemplateHeight = 275
    const parentWidth = parentSize?.width || 1280
    const parentHeight = parentSize?.height || 800
    const templateWidth = this.checkTemplateDefaultSize((columnRowTemplateWidth * 100) / parentWidth)
    const templateHeight = this.checkTemplateDefaultSize((columnRowTemplateHeight * 100) / parentHeight)
    const templateSize = {
      STYLE0: { width: templateWidth, height: templateHeight },
      STYLE1: { width: templateWidth, height: templateHeight },
      STYLE2: { width: templateWidth, height: templateHeight },
      STYLE3: { width: templateWidth, height: templateHeight },
      STYLE4: { width: templateWidth, height: templateHeight },
      STYLE5: { width: templateWidth, height: templateHeight },
      STYLE6: { width: templateWidth, height: templateHeight },
      STYLE7: { width: templateWidth, height: templateHeight },
      STYLE8: { width: this.checkTemplateDefaultSize(65400 / parentWidth), height: this.checkTemplateDefaultSize(33500 / parentHeight) },
      STYLE9: { width: this.checkTemplateDefaultSize(50000 / parentWidth), height: this.checkTemplateDefaultSize(50000 / parentHeight) }
    }
    return templateSize
  }

  checkTemplateDefaultSize = (size) => {
    if (size > 100) {
      return 100
    } else {
      return size
    }
  }

  getLayoutType = (): LayoutType => {
    const { layoutInfo, appConfig } = this.props
    const layoutId = layoutInfo?.layoutId
    const layoutType = appConfig?.layouts?.[layoutId]?.type
    return layoutType
  }

  setDatasource = (ds: DataSource) => {
    this.setState({
      datasource: ds
    }, () => {
      const isShowAutoRefresh = this.checkIsDsAutoRefreshSettingOpen(ds)
      this.isPreDataSourceRefreshOpen = isShowAutoRefresh
      this.initIsShowAutoRefresh(ds)
    })
  }

  initIsShowAutoRefresh = (ds) => {
    const { config } = this.props
    if (typeof (config?.isShowAutoRefresh) !== 'boolean') {
      const isShowAutoRefresh = this.checkIsDsAutoRefreshSettingOpen(ds)
      const newConfig = config.set('isShowAutoRefresh', isShowAutoRefresh)
      this.onConfigChange(newConfig)
    }
  }

  getIndexForPickerData (value, data) {
    let index = -1
    data.some((d, i) => {
      if (value === d.value) {
        index = i
        return true
      } else {
        return false
      }
    })
    return index
  }

  getSelectModeOptions = (): JSX.Element[] => {
    return [
      <option key={SelectionModeType.Single} value={SelectionModeType.Single}>
        {this.formatMessage('single')}
      </option>,
      <option
        key={SelectionModeType.Multiple}
        value={SelectionModeType.Multiple}
      >
        {this.formatMessage('multiple')}
      </option>
    ]
  }

  getSearchingFields = (isSearch: boolean): MultiSelectItem[] => {
    const { datasource } = this.state
    if (datasource) {
      const scheme = datasource.getSchema()
      if (scheme && scheme.fields) {
        const res = []
        Object.keys(scheme.fields).forEach(fieldKey => {
          const field = scheme.fields[fieldKey]
          if (isSearch) {
            if (field.type === JimuFieldType.String) {
              res.push({
                value: fieldKey,
                label:
                  scheme.fields[fieldKey].alias || scheme.fields[fieldKey].name
              })
            }
          } else {
            res.push({
              value: fieldKey,
              label:
                scheme.fields[fieldKey].alias || scheme.fields[fieldKey].name
            })
          }
        })
        return res
      }
    }
    return []
  }

  getPageStyleOptions = (): JSX.Element[] => {
    return [
      <option key={PageStyle.Scroll} value={PageStyle.Scroll}>
        {this.formatMessage('scroll')}
      </option>,
      <option key={PageStyle.MultiPage} value={PageStyle.MultiPage}>
        {this.formatMessage('multiPage')}
      </option>
    ]
  }

  onDsCreate = ds => {
    this.setDatasource(ds)
  }

  onDataSourceInfoChange = (info: IMDataSourceInfo) => {
    if (!info || !this.state.datasource) {
      return
    }
    const { config } = this.props
    const isDsAutoRefreshSettingOpen = this.checkIsDsAutoRefreshSettingOpen(this.state.datasource)
    if (isDsAutoRefreshSettingOpen && !this.isPreDataSourceRefreshOpen) {
      const newConfig = config.set('isShowAutoRefresh', isDsAutoRefreshSettingOpen)
      this.onConfigChange(newConfig)
    }
    this.isPreDataSourceRefreshOpen = isDsAutoRefreshSettingOpen
  }

  getStyle = (theme: IMThemeVariables): SerializedStyles => {
    return css`
      &.jimu-widget-list-setting {
        .no-bottom-border {
          border-bottom: 0;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .list-layout-select-con {
          box-sizing: border-box;
          button, button:hover, button.active {
            background: ${theme?.ref.palette.neutral[300]};
          }
          button {
            flex: 1;
            padding: ${polished.rem(4)};
            border-width: ${polished.rem(2)};
            border-color: transparent;
          }
        }
        .style-setting--base-unit-input {
          .dropdown-button {
            border: none;
          }
        }
        .clear-padding {
          padding-left: 0;
          padding-right: 0;
        }
        .card-setting-con {
          padding-top: 0;
        }
        .clear-border {
          border: none;
        }
        .clear-padding-bottom {
          padding-bottom: 0;
        }
        .sort-container {
          margin-top: 12px;
          .sort-multi-select {
            width: 100%;
          }
        }
        .lock-item-ratio-label {
          margin-left: ${polished.rem(8)};
        }
        .search-container {
          margin-top: 12px;
          .search-multi-select {
            width: 100%;
          }
        }
        .lock-item-ratio {
          margin-top: ${polished.rem(3)};
        }

        .resetting-template {
          cursor: pointer;
          color: ${theme.sys.color.primary.light};
          vertical-align: middle;
          padding: 0;
          margin: 0;
          font-size: ${polished.rem(13)};
        }
        .resetting-template:hover {
          cursor: pointer;
          color: ${polished.rgba(theme.sys.color.primary.light, 0.8)};
        }
        .setting-next {
          width: auto;
          max-width: 50%;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          text-align: end;
          font-size: ${polished.rem(13)};
          padding: 0;
          &:focus {
            outline: ${polished.rem(2)} solid ${theme.sys.color.primary.light};
            outline-offset: ${polished.rem(2)};
          }
          svg {
            margin: 0;
          }
        }
        .card-setting-return {
          cursor: pointer;
          font-size: ${polished.rem(14)};
          padding: 0;
        }

        .search-placeholder {
          & {
            background: ${theme.ref.palette.neutral[300]};
            color: ${theme.ref.palette.black};
            border: none;
            outline: none;
            box-sizing: border-box;
            border-radius: 2px;
            font-size: ${polished.rem(14)};
          }
          &:focus {
            border: 1px solid ${theme.sys.color.primary.dark};
          }
        }
        .style-group {
          button {
            padding: 0;
          }
          .template-icon-margin-r {
            margin-right: ${polished.rem(10)};
          }
          .style-img {
            cursor: pointer;
            width: 100%;
            height: 70px;
            border: 1px solid ${theme.ref.palette.neutral[500]};
            background-color: ${theme.ref.palette.white};
            margin-right: 0;
            &.active {
              border: 2px solid ${theme.sys.color.primary.main};
            }
            &.style-img-h {
              width: 109px;
              height: 109px;
            }
            &.low {
              height: 48px;
            }
            &.empty {
              height: 40px;
              line-height: 40px;
              color: ${theme.ref.palette.neutral[800]};
            }
          }
        }
        .vertical-space {
          height: 10px;
        }
        .list-size-edit {
          width: ${polished.rem(120)};
        }
        .datasource-placeholder {
          & {
            color: ${theme.ref.palette.neutral[800]};
          }
          p {
            color: ${theme.ref.palette.neutral[1000]};
            font-size: ${polished.rem(14)};
            margin: ${polished.rem(16)} auto 0;
            line-height: ${polished.rem(19)};
            width: ${polished.rem(228)};
          }
        }
      }
    `
  }

  getAllFields = (): string[] => {
    const { config, useDataSources } = this.props
    const useDS = useDataSources && useDataSources[0]
    if (!useDS) return []

    const usedFields = {}
    if (config.sortOpen && config.sorts) {
      config.sorts.forEach(sort => {
        sort.rule.forEach(sortData => {
          sortData.jimuFieldName && (usedFields[sortData.jimuFieldName] = 0)
        })
      })
    }
    // if (useDS.query && useDS.query.orderBy && useDS.query.orderBy.length > 0) {
    //   useDS.query.orderBy.forEach(sortData => {
    //     sortData.jimuFieldName && (usedFields[sortData.jimuFieldName] = 0);
    //   })
    // }

    // if (useDS.query && useDS.query.where) {
    //   (getJimuFieldNamesBySqlExpression(useDS.query.where) || []).forEach(field => usedFields[field] = 0)
    // }

    if (config.filter) {
      ;(getJimuFieldNamesBySqlExpression(config.filter) || []).forEach(
        field => (usedFields[field] = 0)
      )
    }

    if (config.searchOpen && config.searchFields) {
      ;(config.searchFields || []).forEach(
        fieldName => (usedFields[fieldName] = 0)
      )
    }

    if (config?.linkParam?.expression) {
      const linkSettingDss = expressionUtils.getUseDataSourceFromExpParts(
        config.linkParam.expression?.parts,
        this.props.useDataSources
      )
      linkSettingDss?.[0]?.fields?.forEach(field => (usedFields[field] = 0))
    }
    return (usedFields && Object.keys(usedFields)) || []
  }

  formatMessage = (id: string, values?: { [key: string]: any }): string => {
    return this.props.intl.formatMessage(
      { id: id, defaultMessage: MESSAGES[id] },
      values
    )
  }

  getWhetherDsInUseDataSources = (
    ds: UseDataSource,
    useDataSources: ImmutableArray<UseDataSource>
  ): boolean => {
    if (!ds || !useDataSources) {
      return false
    }
    return useDataSources.some(u => u.dataSourceId === ds.dataSourceId)
  }

  onFilterChange = (sqlExprObj: SqlExpression, dsId: string) => {
    const { useDataSources } = this.props
    if (
      !useDataSources ||
      !useDataSources[0] ||
      useDataSources[0].dataSourceId !== dsId
    ) {
      return
    }
    this.needUpdateFields = true
    this.props.onSettingChange({
      id: this.props.id,
      useDataSources: [
        useDataSources[0]
          .setIn(['query', 'where'], sqlExprObj)
          .asMutable({ deep: true })
      ]
    })
  }

  onSettingLinkConfirm = (linkResult: IMLinkParam) => {
    let { config } = this.props
    if (!linkResult) {
      return
    }
    config = config.set('linkParam', linkResult)

    if (linkResult.expression) {
      this.needUpdateFields = true
    }
    this.onConfigChange(config)
  }

  onDSSelectorSortChange = (sortData: OrderByOption[], dsId: string) => {
    const { useDataSources } = this.props
    if (
      !useDataSources ||
      !useDataSources[0] ||
      useDataSources[0].dataSourceId !== dsId
    ) {
      return
    }
    this.needUpdateFields = true
    this.props.onSettingChange({
      id: this.props.id,
      useDataSources: [
        useDataSources[0]
          .setIn(['query', 'orderBy'], sortData)
          .asMutable({ deep: true })
      ]
    })
  }

  onDataChange = (useDataSources: UseDataSource[]) => {
    if (useDataSources && useDataSources.length > 0) {
      this.onDataSelect(useDataSources[0])
    } else {
      this.onDataRemove(this.props.useDataSources[0].asMutable({ deep: true }))
    }
  }

  onDataSelect = (currentSelectedDs: UseDataSource) => {
    const widgets = this.props.appConfig && this.props.appConfig.widgets

    const widgetJson = widgets[this.props.id]
    const updateWidgetJson = { id: this.props.id } as any
    const appConfigAction = getAppConfigAction()
    let useDataSources: UseDataSource[]
    let singleUsedDs: UseDataSource
    if (
      this.getWhetherDsInUseDataSources(
        currentSelectedDs,
        widgetJson.useDataSources
      )
    ) {
      useDataSources = widgetJson.useDataSources.asMutable({ deep: true })
    } else {
      singleUsedDs = currentSelectedDs
      useDataSources = [singleUsedDs]
      updateWidgetJson.config = widgetJson.config
        .set('searchFields', null)
        .set('filters', null)
        .set('sorts', null)
    }
    // Instead of function onSettingChange, use action to change widget json, which can avoid conflict.
    // Because editing widget json in builder needs pub-sub and pub-sub is async.
    updateWidgetJson.useDataSources = useDataSources
    appConfigAction.editWidget(updateWidgetJson).exec()
    this.needUpdateFields = true
  }

  onDataRemove = (currentRemovedDs: UseDataSource) => {
    const widgets = this.props.appConfig && this.props.appConfig.widgets
    const widgetJson = widgets[this.props.id]
    const updateWidgetJson = { id: this.props.id } as any
    const appConfigAction = getAppConfigAction()
    const useDataSources: ImmutableArray<UseDataSource> = widgetJson.useDataSources.filter(
      usedDs => usedDs.dataSourceId !== currentRemovedDs.dataSourceId
    )

    // Instead of function onSettingChange, use action to change widget json, which can avoid conflict.
    // Because editing widget json in builder needs pub-sub and pub-sub is async.
    updateWidgetJson.config = widgetJson.config
      .set('sqlExprObj', null)
      .set('searchFields', null)
      .set('filters', null)
      .set('sortFields', null)
    updateWidgetJson.useDataSources = useDataSources
    appConfigAction.editWidget(updateWidgetJson, []).exec()
    this.needUpdateFields = true
  }

  onBorderStyleChange = (status: Status, value: BorderStyle) => {
    const { config } = this.props
    const borderStyle = {
      border: value
    }
    const newConfig = config.setIn(['cardConfigs', status, 'backgroundStyle', 'border'], borderStyle)
    const options = {
      id: this.props.id,
      config: newConfig
    }
    this.props.onSettingChange(options)
  }

  updateSideBorder = (side: BorderSide, border: BorderStyle, status: Status) => {
    const { config } = this.props
    let borderStyle = config.cardConfigs[status].backgroundStyle?.border || Immutable({})
    borderStyle = (borderStyle as any).set(lodash.camelCase(`border-${side}`), border).without('border').without('color').without('type').without('width')
    const newConfig = config.setIn(['cardConfigs', status, 'backgroundStyle', 'border'], borderStyle)
    const options = {
      id: this.props.id,
      config: newConfig
    }
    this.props.onSettingChange(options)
  }

  renderBgSetting (isClearBorder: boolean = true) {
    const { config, showCardSetting } = this.props
    const borderStyle = config.cardConfigs?.[showCardSetting].backgroundStyle?.border
    return (
      <Fragment>
        <SettingSection className={`clear-padding ${isClearBorder && 'clear-border clear-padding-bottom'}`}>
          <SettingRow label={this.formatMessage('background')} flow='wrap' role='group' aria-label={this.formatMessage('background')}>
            <BackgroundSetting
              background={
                config.cardConfigs[showCardSetting].backgroundStyle.background
              }
              onChange={value => { this.onBackgroundStyleChange(showCardSetting, 'background', value) }}
            />
          </SettingRow>
        </SettingSection>
        <SettingSection className={`clear-padding ${isClearBorder && 'clear-border'}`}>
          <SettingRow label={this.formatMessage('border')} flow='wrap' role='group' aria-label={this.formatMessage('border')}>
            <BorderSetting
              value={(borderStyle as any)?.width ? borderStyle as any : borderStyle?.border}
              top={borderStyle?.borderTop}
              left={borderStyle?.borderLeft}
              right={borderStyle?.borderRight}
              bottom={borderStyle?.borderBottom}
              applyDefaultValue
              onChange={value => { this.onBorderStyleChange(showCardSetting, value) }}
              onSideChange={(side, border) => { this.updateSideBorder(side, border, showCardSetting) }}
            />
          </SettingRow>
          <SettingRow label={this.formatMessage('borderRadius')} flow='wrap' role='group' aria-label={this.formatMessage('borderRadius')}>
            <BorderRadiusSetting
              value={
                config.cardConfigs[showCardSetting].backgroundStyle.borderRadius
              }
              onChange={value => {
                this.onBackgroundStyleChange(
                  showCardSetting,
                  'borderRadius',
                  value
                )
              }}
            />
          </SettingRow>
        </SettingSection>
        {/* <SettingRow label="Box shadow" flow="wrap">
          <BoxShadowSetting
            value={config.cardConfigs[showCardSetting].backgroundStyle.boxShadow}
            onChange={value => this.onBackgroundStyleChange(showCardSetting, 'boxShadow', value)} />
        </SettingRow> */}
      </Fragment>
    )
  }

  handleItemStyleConfirmClick = evt => {
    this.onPropertyChange('isItemStyleConfirm', true)
    setTimeout(() => { this.resettingTheTemplateButtonRef?.focus() }, 200)
  }

  handleResetItemStyleClick = evt => {
    this.onPropertyChange('isItemStyleConfirm', false)
    this.updateStartButtonPosition()
  }

  handleItemStyleImageClick = evt => {
    const style = evt.currentTarget.dataset.value
    const { config } = this.props
    if (config.itemStyle === style) return
    this.onItemStyleChanged(style, config?.isCheckEmptyTemplate)
  }

  handleCheckEmptyTemplateChange = () => {
    const { config, appConfig, id } = this.props
    const newIsCheckEmptyTemplate = !config?.isCheckEmptyTemplate
    const newConfig = config.set('isCheckEmptyTemplate', newIsCheckEmptyTemplate)
    const newAppConfig = appConfig.setIn(['widgets', id, 'config'], newConfig)
    this.onItemStyleChanged(config.itemStyle, newIsCheckEmptyTemplate, newAppConfig)
  }

  openSettingCollapse = (settingCollapse: SettingCollapseType) => {
    this.setState({
      settingCollapse: settingCollapse
    })
  }

  closeSettingCollapse = () => {
    this.setState({
      settingCollapse: SettingCollapseType.None
    })
  }

  handlePageStyleChange = evt => {
    const value = evt?.target?.value
    const { config } = this.props
    let newConfig = config.set('pageStyle', value)
    if (value === PageStyle.MultiPage) {
      newConfig = newConfig.set('hidePageTotal', false)
    }
    const options = {
      id: this.props.id,
      config: newConfig
    }
    this.props.onSettingChange(options)
  }

  handleChooseSearchingFieldsChange = (allSelectedFields: IMFieldSchema[]) => {
    // if (!allSelectedFields || allSelectedFields?.length === 0) return false
    this.onPropertyChange('searchFields', allSelectedFields.map(fieldSchema => fieldSchema.name))
  }

  displaySelectedFields = values => {
    return this.formatMessage('numSelected', {
      number: values.length
    })
  }

  onSearchPlaceholderChange = (e) => {
    const searchHint = e.target.value
    const preSearchHint = this.props?.config?.searchHint
    if (preSearchHint === searchHint) return
    this.onPropertyChange('searchHint', searchHint)
  }

  getIsScrollAndWidthOfTemplateCon = () => {
    const templateConHeight = this.templatesContain?.clientHeight || 0
    const templateConWidth = this.templatesContain?.clientWidth || 0
    const templateConParentHeight =
      this.templatesContain?.parentElement?.parentElement?.clientHeight || 0
    const isStartButtonAbsolute = templateConParentHeight < templateConHeight
    this.setState({
      isTemplateContainScroll: isStartButtonAbsolute,
      templateConWidth: templateConWidth
    })
  }

  updateStartButtonPosition = () => {
    clearTimeout(this.updatePositionTimeout)
    this.updatePositionTimeout = setTimeout(() => {
      this.getIsScrollAndWidthOfTemplateCon()
    }, 500)
  }

  setTemplatesContain = (ref) => {
    const preTemplatesContain = this.templatesContain
    if (ref) {
      this.templatesContain = ref
    }
    if (!preTemplatesContain) {
      this.getIsScrollAndWidthOfTemplateCon()
    }
  }

  checkIsDsAutoRefreshSettingOpen = (datasource): boolean => {
    if (!datasource) return false
    const interval = (datasource as QueriableDataSource)?.getAutoRefreshInterval() || 0
    return interval > 0
  }

  onNoDataMessageChange = (value) => {
    this.onPropertyChange('noDataMessage', value)
  }

  renderTemplate = () => {
    const { config, appMode } = this.props
    const { isTemplateContainScroll } = this.state
    const startButtonClass = isTemplateContainScroll
      ? 'position-absolute position-absolute-con'
      : 'position-relative-con'
    return (
      <div ref={ref => { this.setTemplatesContain(ref) }}>
        <SettingSection title={this.formatMessage('chooseTemplateTip')}>
          <SettingRow flow='wrap' role='group' aria-label={this.formatMessage('layoutRow')} label={this.formatMessage('layoutRow')}>
            <div className='style-group w-100'>
              <Button
                data-value={ItemStyle.Style5}
                onClick={this.handleItemStyleImageClick}
                type='tertiary'
                title={this.formatMessage('listRowTemplateTitle', {
                  index: 1
                })}
              >
                <Icon
                  autoFlip
                  className={`style-img ${config.itemStyle === ItemStyle.Style5 &&
                    'active'}`}
                  icon={require('./assets/style6.png')}
                />
              </Button>
              <div className='vertical-space' />

              <Button
                data-value={ItemStyle.Style4}
                onClick={this.handleItemStyleImageClick}
                type='tertiary'
                title={this.formatMessage('listRowTemplateTitle', {
                  index: 2
                })}
              >
                <Icon
                  autoFlip
                  className={`style-img ${config.itemStyle === ItemStyle.Style4 &&
                    'active'}`}
                  icon={require('./assets/style5.png')}
                />
              </Button>
              <div className='vertical-space' />

              <Button
                data-value={ItemStyle.Style6}
                onClick={this.handleItemStyleImageClick}
                type='tertiary'
                className='w-100'
                title={this.formatMessage('listRowTemplateTitle', {
                  index: 3
                })}
              >
                <Icon
                  autoFlip
                  className={`style-img low ${config.itemStyle ===
                    ItemStyle.Style6 && 'active'}`}
                  icon={require('./assets/style7.png')}
                />
              </Button>
            </div>
          </SettingRow>

          {/* Column template */}
          <SettingRow flow='wrap' role='group' aria-label={this.formatMessage('layoutColumn')} label={this.formatMessage('layoutColumn')}>
            <div className='style-group w-100 style-img d-flex justify-content-between w-100'>
              <Button
                data-value={ItemStyle.Style0}
                onClick={this.handleItemStyleImageClick}
                type='tertiary'
                className='template-icon-margin-r'
                title={this.formatMessage('listColumnTemplateTitle', {
                  index: 1
                })}
              >
                <Icon
                  className={`style-img style-img-h ${config.itemStyle ===
                    ItemStyle.Style0 && 'active'}`}
                  icon={require('./assets/style1.png')}
                />
              </Button>
              <Button
                data-value={ItemStyle.Style1}
                onClick={this.handleItemStyleImageClick}
                type='tertiary'
                title={this.formatMessage('listColumnTemplateTitle', {
                  index: 2
                })}
              >
                <Icon
                  className={`style-img style-img-h ${config.itemStyle ===
                    ItemStyle.Style1 && 'active'}`}
                  icon={require('./assets/style2.png')}
                />
              </Button>
            </div>
            <div className='vertical-space w-100' />
            <div className='style-group w-100 d-flex justify-content-between w-100'>
              <Button
                data-value={ItemStyle.Style2}
                onClick={this.handleItemStyleImageClick}
                type='tertiary'
                className='template-icon-margin-r'
                title={this.formatMessage('listColumnTemplateTitle', {
                  index: 3
                })}
              >
                <Icon
                  autoFlip
                  className={`style-img style-img-h ${config.itemStyle ===
                    ItemStyle.Style2 && 'active'}`}
                  icon={require('./assets/style3.png')}
                />
              </Button>
              <Button
                data-value={ItemStyle.Style3}
                onClick={this.handleItemStyleImageClick}
                type='tertiary'
                title={this.formatMessage('listColumnTemplateTitle', {
                  index: 4
                })}
              >
                <Icon
                  autoFlip
                  className={`style-img style-img-h ${config.itemStyle ===
                    ItemStyle.Style3 && 'active'}`}
                  icon={require('./assets/style4.png')}
                />
              </Button>
            </div>
          </SettingRow>

          <SettingRow flow='wrap' role='group' aria-label={this.formatMessage('layoutGrid')} label={this.formatMessage('layoutGrid')}>
            <div className='style-group w-100'>
              <Button
                data-value={ItemStyle.Style8}
                onClick={this.handleItemStyleImageClick}
                type='tertiary'
                className='w-100'
                title={this.formatMessage('listGridTemplateTitle', {
                  index: 1
                })}
              >
                <Icon
                  autoFlip
                  className={`style-img ${config.itemStyle === ItemStyle.Style8 &&
                    'active'}`}
                  icon={require('./assets/style8.png')}
                />
              </Button>
              <div className='vertical-space' />
            </div>
            <div className='vertical-space' />
            <div className='style-group w-100 d-flex justify-content-between w-100'>
              <Button
                data-value={ItemStyle.Style9}
                onClick={this.handleItemStyleImageClick}
                type='tertiary'
                className='template-icon-margin-r'
                title={this.formatMessage('listGridTemplateTitle', {
                  index: 2
                })}
              >
                <Icon
                  autoFlip
                  className={`style-img style-img-h ${config.itemStyle ===
                    ItemStyle.Style9 && 'active'}`}
                  icon={require('./assets/style9.png')}
                />
              </Button>
            </div>
          </SettingRow>

          {appMode !== AppMode.Express && <SettingRow>
            <div className='style-group w-100'>
              <div title={this.formatMessage('emptyTemplateCheckboxString')} aria-label={this.formatMessage('emptyTemplateCheckboxString')} className='d-flex w-100 cursor-pointer align-items-center' style={{ paddingLeft: 0, paddingRight: 0 }} onClick={() => { this.handleCheckEmptyTemplateChange() }}>
                <Checkbox
                  title={this.formatMessage('emptyTemplateCheckboxString')}
                  className='lock-item-ratio'
                  data-field='isCheckEmptyTemplate'
                  checked={config?.isCheckEmptyTemplate || false}
                  aria-label={this.formatMessage('emptyTemplateCheckboxString')}
                />
                <div className='lock-item-ratio-label text-left'>
                  {this.formatMessage('emptyTemplateCheckboxString')}
                </div>
              </div>
            </div>
          </SettingRow>}
          <SettingRow>
            <div className='start-con w-100' css={this.getStartButtonStyle()}>
              <div className={startButtonClass}>
                <Button
                  className="w-100"
                  type='primary'
                  onClick={this.handleItemStyleConfirmClick}
                >
                  {this.formatMessage('start')}
                </Button>
              </div>
            </div>
          </SettingRow>
        </SettingSection>
      </div>
    )
  }

  getStartButtonStyle = (): SerializedStyles => {
    const { theme } = this.props
    const { templateConWidth } = this.state
    return css`
      &.start-con {
        & {
          height: ${polished.rem(64)};
          margin-top: ${polished.rem(-16)};
        }
        .position-absolute-con, .position-relative-con {
          margin-left: ${polished.rem(-16)};
        }
        div{
          padding: ${polished.rem(16)};
          background: ${theme.ref.palette.neutral[400]};
          left: 1rem;
          bottom: 0;
          width: ${templateConWidth ? `${templateConWidth}px` : '100%'}
        }
      }
    `
  }

  renderDataSetting = () => {
    const { datasource } = this.state
    const { useDataSources, selectionIsInSelf, config } = this.props
    return (
      <SettingSection className={classNames(!this.state.datasource ? 'no-bottom-border' : '')}>
        {/* <SettingRow label={'export style'}>
          <Button type="primary" onClick={this.onExportClick} >Test</Button>
        </SettingRow> */}
        <SettingRow flow='wrap'>
          <div className='w-100 align-middle d-flex align-items-center'>
            <div className='flex-grow-1 w-100'>
              <Button
                type='tertiary'
                className='resetting-template align-middle'
                onClick={this.handleResetItemStyleClick}
                disableRipple={true}
                disableHoverEffect={true}
                title={this.formatMessage('resettingTheTemplate')}
                ref={ref => { this.resettingTheTemplateButtonRef = ref }}
              >
                {this.formatMessage('resettingTheTemplate')}
              </Button>

              <span className='align-middle'>{this.formatMessage('customListDesign')}</span>
            </div>
            <Tooltip
              title={this.formatMessage('listUseGuide')}
              showArrow
              placement='left'
            >
              <Button icon className='list-guide-tip-button' type='tertiary' aria-label={this.formatMessage('listUseGuide')}>
                <InfoOutlined />
              </Button>
            </Tooltip>
          </div>
        </SettingRow>
        <SettingRow flow='wrap' label={this.formatMessage('data')} aria-label={this.formatMessage('data')}>
          {!selectionIsInSelf && (
            <DataSourceSelector
              types={DSSelectorTypes}
              useDataSources={useDataSources}
              mustUseDataSource
              onChange={this.onDataChange}
              widgetId={this.props.id}
              aria-describedby='list-empty-tip'
              // filterEnabled={true} sortEnabled={true}
              // sortConfig={Immutable(sortConfig)}
              // filterConfig={Immutable(filterConfig)}
              // onFilterChange={this.onFilterChange}
              // onSortChange={this.onDSSelectorSortChange}
            />
          )}
        </SettingRow>
        {this.state?.datasource && <SettingRow flow='wrap' label={this.formatMessage('noDataMessage')} aria-label={this.formatMessage('noDataMessage')}>
          <TextInput
            size='sm'
            className='w-100'
            aria-label={this.formatMessage('noDataMessage')}
            placeholder={this.formatMessage('noData')}
            defaultValue={config?.noDataMessage || ''}
            onAcceptValue={this.onNoDataMessageChange}
          />
        </SettingRow>}
        {this.checkIsDsAutoRefreshSettingOpen(datasource) && <SettingRow label={this.formatMessage('lastUpdateText')} role='group' aria-label={this.formatMessage('lastUpdateText')}>
          <Switch
            checked={config.isShowAutoRefresh}
            data-field='isShowAutoRefresh'
            onChange={this.handleFormChange}
            title={this.formatMessage('lastUpdateText')}
          />
        </SettingRow>}
      </SettingSection>
    )
  }

  handleLayoutChange = (layoutType: ListLayoutType) => {
    const { config, browserSizeMode, widgetRect } = this.props
    let newConfig = config.set('layoutType', layoutType).set('horizontalSpace', DEFAULT_SPACE).set('verticalSpace', DEFAULT_SPACE)
    const cardSize = this.getCardSizeUnit(this.props)
    const itemStyle = defaultCardLayout[config.itemStyle]
    let newCardSize
    const direction = layoutType === ListLayoutType.Column ? DirectionType?.Horizon : DirectionType.Vertical
    if (itemStyle === layoutType) {
      newCardSize = defaultCardSize[config.itemStyle]
    } else {
      switch (layoutType) {
        case ListLayoutType.GRID:
          newCardSize = {
            width: '25%',
            height: `${DEFAULT_CARD_SIZE}px`
          }
          break
        case ListLayoutType.Column:
          newCardSize = {
            width: '320px',
            height: cardSize?.height?.unit === DistanceUnits.PERCENTAGE ? `${widgetRect.height * cardSize?.height?.distance / 100}px` : `${cardSize?.height?.distance}px`
          }
          break
        case ListLayoutType.Row:
          newCardSize = {
            width: cardSize?.width?.unit === DistanceUnits.PERCENTAGE ? `${widgetRect.width * cardSize?.width?.distance / 100}px` : `${cardSize?.width?.distance}px`,
            height: '200px'
          }
          break
        default:
          newCardSize = {
            width: cardSize?.width?.unit === DistanceUnits.PERCENTAGE ? `${widgetRect.width * cardSize?.width?.distance / 100}px` : `${cardSize?.width?.distance}px`,
            height: cardSize?.height?.unit === DistanceUnits.PERCENTAGE ? `${widgetRect.height * cardSize?.height?.distance / 100}px` : `${cardSize?.height?.distance}px`
          }
          break
      }
    }
    newConfig = newConfig.setIn(
      ['cardConfigs', Status.Default, 'cardSize', browserSizeMode],
      newCardSize
    ).setIn(
      ['cardConfigs', Status.Hover, 'cardSize', browserSizeMode],
      newCardSize
    ).setIn(
      ['cardConfigs', Status.Selected, 'cardSize', browserSizeMode],
      newCardSize
    ).setIn(['direction'], direction)
    this.onConfigChange(newConfig)
  }

  handleKeepAspectRatioChange = () => {
    const { config } = this.props
    const cardSize = this.getCardSizeUnit(this.props)
    const widthPx = this.getCardPxWidthFormCardSize()
    const gridItemSizeRatio = cardSize.height.distance / widthPx
    let newConfig = config.set('keepAspectRatio', !this.props?.config?.keepAspectRatio)
    this.setState({ aspectRatio: null })
    this.aspectRatioRef = null
    if (!this.props?.config?.keepAspectRatio) {
      newConfig = newConfig.set('gridItemSizeRatio', gridItemSizeRatio)
    }
    this.onConfigChange(newConfig)
  }

  handleGridItemSizeRatioChange = (value: string) => {
    const aspectRatios = value?.split(':')
    const aspectRatiosH = Number(aspectRatios?.[1])
    const aspectRatiosW = Number(aspectRatios?.[0])
    if (aspectRatiosH <= 0 || aspectRatiosW <= 0) {
      return false
    }
    const ratio = aspectRatiosH / aspectRatiosW
    if (!ratio) return false
    const { config } = this.props
    const oldCardSize = this.getCardSizeInGridByRatio(ratio)
    const newCardSize = {
      width: uiUtils.stringOfLinearUnit(oldCardSize.width),
      height: uiUtils.stringOfLinearUnit(oldCardSize.height)
    }
    this.setState({ aspectRatio: value })
    this.aspectRatioRef = value
    handleResizeCard(this.props, newCardSize, config.set('gridItemSizeRatio', ratio)).exec()
  }

  getCardSizeInGridByRatio = (ratio: number): ElementSizeUnit => {
    const oldCardSize = this.getCardSizeUnit(this.props)
    const pxWidth = this.getCardPxWidthFormCardSize()
    oldCardSize.height.distance = ratio * pxWidth
    return oldCardSize
  }

  getCardPxWidthFormCardSize = (): number => {
    const { config } = this.props
    const cardSize = this.getCardSizeUnit(this.props)
    if (cardSize.width.unit === DistanceUnits.PERCENTAGE) {
      const listContentWidth = this.getListActualContentPxWidth()
      //The space in the last column should be removed
      return cardSize.width.distance * listContentWidth / 100 - config?.horizontalSpace
    } else {
      return cardSize.width.distance
    }
  }

  handleGridItemSizeChange = (valueInt: LinearUnit, isHeight: boolean = false) => {
    const { config, widgetRect } = this.props
    const oldCardSizeUnit = this.getCardSizeUnit(this.props)
    const oldSize = isHeight ? oldCardSizeUnit?.height : oldCardSizeUnit?.width
    const listConSize = isHeight ? widgetRect?.height : this.getListActualContentPxWidth()
    const newCardSize = this.getCardSize()

    let minSize = LIST_CARD_MIN_SIZE
    if (valueInt?.unit === DistanceUnits.PERCENTAGE) {
      minSize = isHeight ? (LIST_CARD_MIN_SIZE * 100) / listConSize : ((LIST_CARD_MIN_SIZE + config?.horizontalSpace) * 100) / listConSize
    }

    const isDistanceUnitsChange = this.checkIsDistanceUnitsChange(valueInt, isHeight)
    if (isDistanceUnitsChange && !isHeight) {
      if (valueInt.unit === DistanceUnits.PIXEL) {
        valueInt.distance = oldSize.distance * listConSize / 100 - config?.horizontalSpace
      }
      if (valueInt.unit === DistanceUnits.PERCENTAGE) {
        valueInt.distance = ((oldSize.distance + config?.horizontalSpace) * 100) / listConSize
      }
    }

    const value = valueInt.distance < minSize ? minSize : valueInt.distance
    valueInt.distance = value

    if (isHeight) {
      newCardSize.height = uiUtils.stringOfLinearUnit(valueInt)
    } else {
      newCardSize.width = uiUtils.stringOfLinearUnit(valueInt)
      const widthPx = valueInt?.unit === DistanceUnits.PERCENTAGE ? (value * listConSize / 100) : value
      if (config?.keepAspectRatio) {
        const height = widthPx * config?.gridItemSizeRatio
        newCardSize.height = `${height}px`
      }
    }
    handleResizeCard(this.props, newCardSize, config).exec()
  }

  getListActualContentPxWidth = (): number => {
    const { config, widgetRect } = this.props
    return (widgetRect?.width + config?.horizontalSpace - SCROLL_BAR_WIDTH) || 0
  }

  checkIsDistanceUnitsChange = (valueInt: LinearUnit, isHeight: boolean): boolean => {
    const oldCardSizeUnit = this.getCardSizeUnit(this.props)
    const size = isHeight ? oldCardSizeUnit?.height : oldCardSizeUnit?.width
    if (valueInt.unit === size.unit) {
      return false
    } else if (!size.unit && valueInt.unit === DistanceUnits.PIXEL) {
      return false
    } else {
      return true
    }
  }

  handleHidePageTotalChange = () => {
    const { config } = this.props
    const newHidePageTotal = !config?.hidePageTotal
    this.onPropertyChange('hidePageTotal', newHidePageTotal)
  }

  renderArrangementSetting = () => {
    const { config } = this.props
    const { settingCollapse } = this.state

    return (
      <SettingSection>
        <CollapsablePanel
          label={this.formatMessage('arrangement')}
          isOpen={settingCollapse === SettingCollapseType.Arrangement}
          onRequestOpen={() => { this.openSettingCollapse(SettingCollapseType.Arrangement) }}
          onRequestClose={this.closeSettingCollapse}
          aria-label={this.formatMessage('arrangement')}
        >
          <SettingRow className="mt-2" flow='wrap' label={this.formatMessage('layout')} role='group' aria-label={this.formatMessage('layout')}>
            <div className='d-flex align-items-center w-100 list-layout-select-con'>
              <Button icon title={this.formatMessage('layoutRow')} aria-label={this.formatMessage('layoutRow')} active={config?.layoutType === ListLayoutType.Row} onClick={() => { this.handleLayoutChange(ListLayoutType.Row) }} className='flex-grow-1' size='lg'>
                <Icon className='style-img w-100 h-100' icon={require('./assets/row.png')}/>
              </Button>
              <Button icon title={this.formatMessage('layoutColumn')} aria-label={this.formatMessage('layoutColumn')} active={config?.layoutType === ListLayoutType.Column} onClick={() => { this.handleLayoutChange(ListLayoutType.Column) }} className='ml-2 flex-grow-1' size='lg'>
                <Icon className='style-img w-100 h-100' icon={require('./assets/column.png')}/>
              </Button>
              <Button icon title={this.formatMessage('layoutGrid')} aria-label={this.formatMessage('layoutGrid')} active={config?.layoutType === ListLayoutType.GRID} onClick={() => { this.handleLayoutChange(ListLayoutType.GRID) }} className='ml-2 flex-grow-1' size='lg'>
                <Icon className='style-img w-100 h-100' icon={require('./assets/grid.png')}/>
              </Button>
            </div>
          </SettingRow>
          {
            config?.layoutType !== ListLayoutType.GRID ? this.renderRowColumnLayoutSetting() : this.renderGridLayoutSetting()
          }
          <SettingRow label={this.formatMessage('pagingStyle')} flow='wrap' role='group' aria-label={this.formatMessage('pagingStyle')}>
            <Select
              style={{ width: '100%' }}
              value={config.pageStyle}
              onChange={this.handlePageStyleChange}
              size='sm'
            >
              {this.getPageStyleOptions()}
            </Select>
          </SettingRow>
          {config.pageStyle === PageStyle.MultiPage && <SettingRow>
            <div className='d-flex align-items-center' onClick={this.handleHidePageTotalChange}>
              <Checkbox checked={config?.hidePageTotal}/>
              <div className='flex-grow-1 text-truncate ml-2'>{this.formatMessage('hidePageTotal')}</div>
            </div>
          </SettingRow>}
          {config.pageStyle === PageStyle.Scroll && (
            <SettingRow label={this.formatMessage('scrollBar')} aria-label={this.formatMessage('scrollBar')}>
              <div className='d-flex'>
                <Switch
                  checked={config.scrollBarOpen}
                  data-field='scrollBarOpen'
                  onChange={this.handleFormChange}
                  title={this.formatMessage('scrollBar')}
                />
              </div>
            </SettingRow>
          )}
          {config.pageStyle === PageStyle.Scroll && (
            <SettingRow label={this.formatMessage('navigator')} aria-label={this.formatMessage('navigator')}>
              <div className='d-flex'>
                <Switch
                  checked={config.navigatorOpen}
                  data-field='navigatorOpen'
                  onChange={this.handleFormChange}
                  title={this.formatMessage('navigator')}
                />
              </div>
            </SettingRow>
          )}
          {config.pageStyle === PageStyle.Scroll && config.navigatorOpen && (
            <SettingRow label={this.formatMessage('listStep')} flow='wrap' role='group' aria-label={this.formatMessage('listStep')}>
              <MyNumericInput
                value={config.scrollStep}
                style={{ width: '100%' }}
                min={1}
                max={MAX_PAGE_SIZE}
                onChange={this.handleScrollStepChange}
              />
            </SettingRow>
          )}
          {config.pageStyle === PageStyle.MultiPage && (
            <SettingRow label={this.formatMessage('itemPerPage')} flow='wrap' role='group' aria-label={this.formatMessage('itemPerPage')}>
              <MyNumericInput
                value={config.itemsPerPage}
                style={{ width: '100%' }}
                min={1}
                max={MAX_ITEMS_PER_PAGE}
                onChange={this.handleItemsPerPageChange}
              />
            </SettingRow>
          )}
        </CollapsablePanel>
      </SettingSection>
    )
  }

  handleAlignmentChange = (alignment: TextAlignValue) => {
    this.onPropertyChange('gridAlignment', alignment)
  }

  renderGridLayoutSetting = () => {
    const { config } = this.props
    const { aspectRatio } = this.state
    const cardSize = this.getCardSizeUnit(this.props)
    const availableUnits = [DistanceUnits.PIXEL, DistanceUnits.PERCENTAGE]
    const heightAvailableUnits = [DistanceUnits.PIXEL]
    const inputStyle = { width: '7.5rem' }
    return (
      <div className='mt-4'>
        <SettingRow label={this.getItemSizeLabel()} flow='wrap'/>
        <SettingRow label={this.formatMessage('width')}>
          <div className='list-size-edit'>
            <SizeEditor
              disableModeSelect
              label='W'
              mode={LayoutItemSizeModes.Custom}
              value={cardSize?.width}
              availableUnits={availableUnits}
              onChange={value => { this.handleGridItemSizeChange(value) }}
            />
          </div>
        </SettingRow>
        <div
          className='ml-4 d-flex'
          css={css`
            .icon {
              cursor: pointer;
              width: 12px;
            }
          `}
        >
          <Tooltip title={this.formatMessage('listKeepAspectRatio')} placement='bottom'>
            <div className='icon' onClick={this.handleKeepAspectRatioChange}>
              {config?.keepAspectRatio ? <LockOutlined size='s' /> : <UnlockOutlined size='s' />}
            </div>
          </Tooltip>
        </div>
        <SettingRow label={this.formatMessage('height')}>
          <div className='list-size-edit'>
            <SizeEditor
              label='H'
              disableModeSelect
              mode={LayoutItemSizeModes.Custom}
              value={cardSize?.height}
              availableUnits={heightAvailableUnits}
              onChange={value => { this.handleGridItemSizeChange(value, true) }}
              disabled={config?.keepAspectRatio}
            />
          </div>
        </SettingRow>
        {config?.keepAspectRatio &&
          <SettingRow label={this.formatMessage('sizeAspectRatio')}>
            <InputRatio style={inputStyle} value={this.getAspectRatio(config.gridItemSizeRatio, aspectRatio)} onChange={this.debounceGridItemSizeRatioChange} />
          </SettingRow>}
        <SettingRow label={this.formatMessage('alignment')}>
          <TextAlignment
            textAlign={config?.gridAlignment || TextAlignValue.CENTER}
            onChange={this.handleAlignmentChange}
          />
        </SettingRow>
        <SettingRow
          flow='wrap'
          label={`${this.formatMessage('horizontalSpacing')} (px)`}
          role='group'
          aria-label={`${this.formatMessage('horizontalSpacing')} (px)`}
        >
          <div className='d-flex justify-content-between w-100 align-items-center'>
            <Slider
              style={{ width: '60%' }}
              data-field='horizontalSpace'
              onChange={this.handleFormChange}
              value={config?.horizontalSpace || 0}
              title='0-50'
              min={0}
              max={50}
            />
            <MyNumericInput
              style={{ width: '25%' }}
              value={config?.horizontalSpace || 0}
              min={0}
              max={50}
              title='0-50'
              onChange={this.handleHorizontalSpaceChange}
            />
          </div>
        </SettingRow>
        <SettingRow
          flow='wrap'
          label={`${this.formatMessage('verticalSpacing')} (px)`}
          role='group'
          aria-label={`${this.formatMessage('verticalSpacing')} (px)`}
        >
          <div className='d-flex justify-content-between w-100 align-items-center'>
            <Slider
              style={{ width: '60%' }}
              data-field='verticalSpace'
              onChange={this.handleFormChange}
              value={config?.verticalSpace || 0}
              title='0-50'
              min={0}
              max={50}
            />
            <MyNumericInput
              style={{ width: '25%' }}
              value={config.verticalSpace || 0}
              min={0}
              max={50}
              title='0-50'
              onChange={this.handleVerticalSpaceChange}
            />
          </div>
        </SettingRow>
      </div>
    )
  }

  getAspectRatio = (gridItemSizeRatio: number, aspectRatio: string): string => {
    if (!aspectRatio && !this.aspectRatioRef) {
      return `100:${gridItemSizeRatio * 100} `
    } else {
      return aspectRatio || this.aspectRatioRef
    }
  }

  renderRowColumnLayoutSetting = () => {
    const { config } = this.props
    const cardSize = this.getCardSizeUnit(this.props)
    const isVertical = config?.layoutType ? config?.layoutType === ListLayoutType.Row : config.direction === DirectionType.Vertical
    return (
      <div className='mt-4'>
        <SettingRow
          flow='wrap'
          label={this.getItemSizeLabel()}
          role='group'
          aria-label={(isVertical ? this.formatMessage('itemHeight') : this.formatMessage('itemWidth')) + ' (px)'}
        >
          <MyNumericInput
            style={{ width: '100%' }}
            value={parseFloat((isVertical ? cardSize.height.distance : cardSize.width.distance).toFixed(0))}
            min={LIST_CARD_MIN_SIZE}
            disabled={config.lockItemRatio}
            onChange={this.handleItemSizeChange}
          />
        </SettingRow>
        <SettingRow label=''>
          <div title={this.formatMessage('lockItemRatio')} className='d-flex w-100 align-items-center cursor-pointer' aria-label={this.formatMessage('lockItemRatio')} style={{ paddingLeft: 0, paddingRight: 0 }} onClick={() => { this.handleCheckboxChange('lockItemRatio') }}>
            <Checkbox
              className='lock-item-ratio test'
              data-field='lockItemRatio'
              checked={config.lockItemRatio || false}
              aria-label={this.formatMessage('lockItemRatio')}
            />
            <div className='lock-item-ratio-label text-left'>
              {this.formatMessage('lockItemRatio')}
            </div>
          </div>
        </SettingRow>
        <SettingRow
          flow='wrap'
          label={(isVertical ? this.formatMessage('verticalSpacing') : this.formatMessage('horizontalSpacing')) + ' (px)'}
          role='group'
          aria-label={(isVertical ? this.formatMessage('verticalSpacing') : this.formatMessage('horizontalSpacing')) + ' (px)'}
        >
          <div className='d-flex justify-content-between w-100 align-items-center'>
            <Slider
              style={{ width: '60%' }}
              data-field='space'
              onChange={this.handleFormChange}
              value={config.space || 0}
              title='0-50'
              min={0}
              max={50}
            />
            <MyNumericInput
              style={{ width: '25%' }}
              value={config.space || 0}
              min={0}
              max={50}
              title='0-50'
              onChange={this.handleSpaceChange}
            />
          </div>
        </SettingRow>
      </div>
    )
  }

  getItemSizeLabel = () => {
    const { config } = this.props
    const isVertical = config?.layoutType ? config?.layoutType === ListLayoutType.Row : config.direction === DirectionType.Vertical
    const isGrid = config?.layoutType === ListLayoutType.GRID
    let labelString
    if (isGrid) {
      labelString = this.formatMessage('gridItemSize')
    } else {
      labelString = isVertical ? `${this.formatMessage('itemHeight')} (px)` : `${this.formatMessage('itemWidth')} (px)`
    }
    return <div className='d-flex'>
      <div className='flex-grow-1'>
        {labelString}
      </div>
      {this.getBrowserIcons(12)}
    </div>
  }

  getBrowserIcons = (iconSize: number) => {
    const { showCardSetting, browserSizeMode, layouts } = this.props
    const currentLayout = layouts[showCardSetting]

    const autoMedium = !currentLayout[BrowserSizeMode.Medium]
    const autoMobile = !currentLayout[BrowserSizeMode.Small]

    const isDesktop = this.props.browserSizeMode === BrowserSizeMode.Large || !currentLayout[browserSizeMode]

    const isPad = (this.props.browserSizeMode === BrowserSizeMode.Large && autoMedium) ||
      this.props.browserSizeMode === BrowserSizeMode.Medium ||
      (this.props.browserSizeMode === BrowserSizeMode.Small && autoMedium && autoMobile)

    const isMobile = (this.props.browserSizeMode === BrowserSizeMode.Large && autoMobile) ||
      (this.props.browserSizeMode === BrowserSizeMode.Medium && autoMedium && autoMobile) ||
      this.props.browserSizeMode === BrowserSizeMode.Small

    const color = this.props.theme.ref.palette.neutral[800]

    const desktopLabel = this.formatMessage('applyToLargeScreen')
    const padLabel = this.formatMessage('applyToMediumScreen')
    const mobileLabel = this.formatMessage('applyToSmallScreen')
    return (
      <div className='d-flex justify-content-between align-items-center'>
        {isDesktop && <DesktopOutlined size={iconSize} color={color} title={desktopLabel} aria-label={desktopLabel}/>}
        {isPad && <TabletOutlined size={iconSize} color={color} className={isDesktop ? 'ml-1' : ''} title={padLabel} aria-label={padLabel} />}
        {isMobile && <MobileOutlined size={iconSize} color={color} className={isDesktop || isPad ? 'ml-1' : ''} title={mobileLabel} aria-label={mobileLabel} />}
      </div>
    )
  }

  renderStatsSetting = (): React.ReactNode => {
    const { config } = this.props
    const { settingCollapse } = this.state
    return (
      <SettingSection>
        <CollapsablePanel
          label={this.formatMessage('states')}
          isOpen={settingCollapse === SettingCollapseType.States}
          onRequestOpen={() => { this.openSettingCollapse(SettingCollapseType.States) }}
          onRequestClose={this.closeSettingCollapse}
          aria-label={this.formatMessage('states')}
        >
          <SettingRow className="mt-2">
            <LinkSelector
              onSettingConfirm={this.onSettingLinkConfirm}
              linkParam={config.linkParam}
              useDataSources={this.props.useDataSources}
              widgetId={this.props.id}
            />
          </SettingRow>
          {this.renderBgSetting()}
          <SettingRow label={this.formatMessage('hover')} role='group' aria-label={this.formatMessage('hover')}>
            <Button
              className='setting-next d-flex text-break'
              data-value={Status.Hover}
              onClick={this.onOpenCardSetting}
              type='tertiary'
              title={this.getToHoverSettingText()}
              size='sm'
              ref={ref => { this.toHoverSettingButtonRef = ref }}
            >
              <div>{this.getToHoverSettingText()}</div>
              <RightOutlined autoFlip style={{ flex: 'none' }} size={12}/>
            </Button>
          </SettingRow>
          <SettingRow label={this.formatMessage('selected')} role='group' aria-label={this.formatMessage('selected')}>
            <Button
              className='setting-next d-flex text-break'
              data-value={Status.Selected}
              onClick={this.onOpenCardSetting}
              type='tertiary'
              title={this.getToSelectedSettingText()}
              size='sm'
              ref={ref => { this.toSelectedSettingButtonRef = ref }}
            >
              <div>{this.getToSelectedSettingText()}</div>
              <RightOutlined autoFlip style={{ flex: 'none' }} size={12}/>
            </Button>
          </SettingRow>
        </CollapsablePanel>
      </SettingSection>
    )
  }

  getToHoverSettingText = () => {
    const { config } = this.props
    return config.cardConfigs[Status.Hover].enable ? this.formatMessage('on') : this.formatMessage('off')
  }

  getToSelectedSettingText = () => {
    const { config } = this.props
    return config.cardConfigs[Status.Selected].selectionMode !== SelectionModeType.None ? this.formatMessage('on') : this.formatMessage('off')
  }

  renderToolSetting = () => {
    const { config, useDataSources, id } = this.props
    const { settingCollapse } = this.state
    const searchHint = config?.searchHint
    return (
      <SettingSection>
        <CollapsablePanel
          label={this.formatMessage('tools')}
          isOpen={settingCollapse === SettingCollapseType.Tools}
          onRequestOpen={() => { this.openSettingCollapse(SettingCollapseType.Tools) }}
          onRequestClose={this.closeSettingCollapse}
        >
          <SettingRow className="mt-2" label={this.formatMessage('search')} aria-label={this.formatMessage('search')}>
            <div className='d-flex'>
              <Switch
                checked={config.searchOpen}
                data-field='searchOpen'
                onChange={this.handleFormChange}
                title={this.formatMessage('search')}
              />
            </div>
          </SettingRow>
          {config.searchOpen && (
            <SettingRow
              flow='wrap'
              label={this.formatMessage('chooseSearchingFields')}
              role='group'
              aria-label={this.formatMessage('chooseSearchingFields')}
            >
              <div
                className='w-100 search-container'
                style={{ zIndex: 3 }}
              >
                <FieldSelectorWithFullTextIndex
                  useDataSources={ useDataSources || Immutable([]) }
                  onChange={this.handleChooseSearchingFieldsChange}
                  selectedFields={config?.searchFields || Immutable([])}
                  isMultiple
                  isDataSourceDropDownHidden
                  useDropdown
                  useMultiDropdownBottomTools
                  widgetId={id}
                  types={Immutable([JimuFieldType.Number, JimuFieldType.String])}
                />
              </div>
              <div title={this.formatMessage('exactMatch')} aria-label={this.formatMessage('exactMatch')} className='d-flex align-items-center cursor-pointer' style={{ marginTop: '10px', paddingLeft: 0, paddingRight: 0 }} onClick={() => { this.handleCheckboxChange('searchExact') }}>
                <Checkbox
                  data-field='searchExact'
                  checked={config.searchExact || false}
                  aria-label={this.formatMessage('exactMatch')}
                />
                <div className='text-truncate lock-item-ratio-label'>
                  {this.formatMessage('exactMatch')}
                </div>
              </div>
            </SettingRow>
          )}
          {config.searchOpen && (
            <SettingRow flow='wrap' label={this.formatMessage('searchHint')} role='group' aria-label={this.formatMessage('searchHint')}>
              <TextInput
                size='sm'
                className='search-placeholder w-100'
                placeholder={this.formatMessage('search')}
                value={searchHint || ''}
                onChange={this.onSearchPlaceholderChange}
              />
            </SettingRow>
          )}
          <SettingRow label={this.formatMessage('sort')} aria-label={this.formatMessage('sort')}>
            <div className='d-flex'>
              <Switch
                checked={config.sortOpen}
                data-field='sortOpen'
                onChange={this.handleFormChange}
                title={this.formatMessage('sort')}
              />
            </div>
          </SettingRow>
          {config.sortOpen && (
            <SettingRow flow='wrap'>
              <SortSetting
                onChange={this.onSettingSortChange}
                useDataSource={useDataSources && useDataSources[0]}
                value={config.sorts || Immutable([])}
              />
            </SettingRow>
          )}
          <SettingRow label={this.formatMessage('filter')} aria-label={this.formatMessage('filter')}>
            <div className='d-flex'>
              <Switch
                checked={config.filterOpen}
                data-field='filterOpen'
                onChange={this.handleFormChange}
                title={this.formatMessage('filter')}
              />
            </div>
          </SettingRow>
          {config.filterOpen && (
            <Fragment>
              <SettingRow>
                <div className='d-flex justify-content-between w-100 align-items-center'>
                  <Button
                    className='w-100 text-default set-link-btn'
                    color={!this.state.datasource ? 'secondary' : 'primary'}
                    disabled={!this.state.datasource}
                    onClick={this.showSqlExprPopup}
                    title={this.formatMessage('setFilters')}
                  >
                    {this.formatMessage('setFilters')}
                  </Button>
                </div>
              </SettingRow>
              <SettingRow flow='wrap'>
                <SqlExpressionBuilderPopup
                  dataSource={this.state.datasource}
                  isOpen={this.state.isSqlExprShow}
                  toggle={this.toggleSqlExprPopup}
                  expression={config.filter}
                  onChange={this.onSqlExprBuilderChange}
                />
              </SettingRow>
            </Fragment>
          )}
          <SettingRow label={this.formatMessage('refresh')} aria-label={this.formatMessage('refresh')}>
            <Switch
              checked={config?.showRefresh}
              data-field='showRefresh'
              onChange={this.handleFormChange}
              title={this.formatMessage('refresh')}
            />
          </SettingRow>
          {config.cardConfigs[Status.Selected].selectionMode !==
            SelectionModeType.None && (
            <Fragment>
              <SettingRow label={this.formatMessage('showSelection')} aria-label={this.formatMessage('showSelection')}>
                <Switch
                  checked={config.showSelectedOnlyOpen}
                  data-field='showSelectedOnlyOpen'
                  onChange={this.handleFormChange}
                  title={this.formatMessage('showSelection')}
                />
              </SettingRow>
              <SettingRow label={this.formatMessage('clearSelection')} aria-label={this.formatMessage('clearSelection')}>
                <Switch
                  checked={config.showClearSelected}
                  data-field='showClearSelected'
                  onChange={this.handleFormChange}
                  title={this.formatMessage('clearSelection')}
                />
              </SettingRow>
            </Fragment>
          )}
          <SettingRow label={this.formatMessage('showRecordCount')} aria-label={this.formatMessage('showRecordCount')}>
            <Switch
              checked={config?.showRecordCount}
              data-field='showRecordCount'
              onChange={this.handleFormChange}
              title={this.formatMessage('showRecordCount')}
            />
          </SettingRow>
        </CollapsablePanel>
      </SettingSection>
    )
  }

  renderRegularSetting = () => {
    const { datasource } = this.state
    return (
      <div className='list-list-setting h-100 d-flex flex-column'>
        {this.renderDataSetting()}
        {this.renderDataSourcePlaceholder()}
        {datasource && (
          <Fragment>
            {this.renderArrangementSetting()}
            {this.renderStatsSetting()}
            {this.renderToolSetting()}
          </Fragment>
        )}
      </div>
    )
  }

  renderDataSourcePlaceholder = () => {
    const { datasource } = this.state
    const dsSelectString = this.formatMessage('setDataSource')
    return !datasource
      ? (
        <div className='w-100 text-center datasource-placeholder flex-grow-1 d-flex flex-column justify-content-center align-items-center'>
          <div className="w-100">
            <ClickOutlined size={48}/>
            <p className='text-Secondary' id='list-empty-tip'>
              {this.formatMessage('listBlankStatus', {
                ButtonString: dsSelectString
              })}
            </p>
          </div>
        </div>
        )
      : null
  }

  renderListCardSetting = () => {
    const statusIntl: { [key: string]: string } = {}
    statusIntl[Status.Hover] = this.formatMessage('hover')
    statusIntl[Status.Selected] = this.formatMessage('selected')
    statusIntl[Status.Default] = this.formatMessage('regular')
    const { showCardSetting, config, id, browserSizeMode, layouts, appConfig, appMode, onSettingChange } = this.props
    return (
      <div className='list-card-setting'>
        <SettingSection>
          <SettingRow
            label={
              <Button
                className='d-flex text-truncate align-items-center card-setting-return'
                onClick={this.onCardSettingReturnBackClick}
                type='tertiary'
                size='sm'
                title={this.formatMessage('back')}
              >
                <ArrowLeftOutlined className='mr-1' autoFlip/>
                {statusIntl[showCardSetting]}
              </Button>
            }
          />
          <SettingRow
            label={this.formatMessage('enableStatus', {
              status: statusIntl[showCardSetting].toLocaleLowerCase()
            })}
            aria-label={this.formatMessage('enableStatus', { status: statusIntl[showCardSetting].toLocaleLowerCase() })}
          >
            <Switch
              checked={
                showCardSetting === Status.Hover
                  ? config.cardConfigs[Status.Hover].enable
                  : config.cardConfigs[Status.Selected].selectionMode !==
                    SelectionModeType.None
              }
              onChange={
                showCardSetting === Status.Hover
                  ? this.onHoverLayoutOpenChange
                  : this.onSelectionSwitch
              }
              title={this.formatMessage('enableStatus', { status: statusIntl[showCardSetting].toLocaleLowerCase() })}
            />
          </SettingRow>
        </SettingSection>

        {((showCardSetting === Status.Selected &&
          config.cardConfigs[Status.Selected].selectionMode !==
            SelectionModeType.None) ||
          (showCardSetting === Status.Hover &&
            config.cardConfigs[Status.Hover].enable)) && (
          <SettingSection className='card-setting-con'>
            {showCardSetting === Status.Selected && (<SettingSection className='clear-padding'>
              <SettingRow
                flow='wrap'
                label={this.formatMessage('selectMode')}
                role='group'
                aria-label={this.formatMessage('selectMode')}
              >
                <Select
                  value={config.cardConfigs[Status.Selected].selectionMode}
                  onChange={this.onSelectionModeChange}
                >
                  {this.getSelectModeOptions()}
                </Select>
              </SettingRow>
            </SettingSection>)}
            {this.renderBgSetting(false)}
            {appMode !== AppMode.Express && <CardLayoutSetting
              id={id}
              onSettingChange={onSettingChange}
              cardLayout={config.cardConfigs[showCardSetting]?.listLayout as any}
              status={showCardSetting}
              browserSizeMode={browserSizeMode}
              mainSizeMode={appConfig.mainSizeMode}
              layouts={layouts}
              config={config}
              appConfig={appConfig}
            />}
          </SettingSection>
        )}
      </div>
    )
  }

  render () {
    const { config, showCardSetting, selectionIsInSelf } = this.props
    return (
      <div
        className={classNames(`${prefix}list-setting`, `${prefix}setting`)}
        css={this.getStyle(this.props.theme)}
      >
        {!selectionIsInSelf && <div className='h-100'>
          {!config.isItemStyleConfirm
            ? (
                this.renderTemplate()
              )
            : (
              <Fragment>
                {showCardSetting === Status.Default && this.renderRegularSetting()}
                {showCardSetting !== Status.Default && this.renderListCardSetting()}
              </Fragment>
              )}

          {this.props.useDataSources &&
            this.props.useDataSources[0] &&
            this.props.useDataSources[0] && (
            <div className='waiting-for-database'>
              <DataSourceComponent
                useDataSource={this.props.useDataSources[0]}
                onDataSourceCreated={this.onDsCreate}
                onDataSourceInfoChange={this.onDataSourceInfoChange}
              />
            </div>
          )}
        </div>}
      </div>
    )
  }
}
