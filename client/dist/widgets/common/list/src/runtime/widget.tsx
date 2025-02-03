/** @jsx jsx */
import {
  type IMState,
  classNames,
  React,
  jsx,
  type AllWidgetProps,
  type DataRecord,
  DataSourceStatus,
  AppMode,
  type BrowserSizeMode,
  appActions,
  DataSourceComponent,
  MessageManager,
  DataRecordsSelectionChangeMessage,
  getAppStore,
  ReactResizeDetector,
  type IMSqlExpression,
  LayoutType,
  Immutable,
  type QueriableDataSource,
  type IMDataSourceInfo,
  type DataSource,
  type IMUrlParameters,
  lodash,
  LayoutItemType,
  appConfigUtils,
  utils,
  type BoundingBox,
  PageMode,
  CONSTANTS,
  DataSourceFilterChangeMessage,
  defaultMessages as jimuCoreDefaultMessage,
  type FeatureLayerDataSource
} from 'jimu-core'

import {
  WidgetPlaceholder,
  Button,
  Popper,
  DataActionListStyle,
  DataActionList,
  defaultMessages as jimuUIDefaultMessages,
  Alert,
  DistanceUnits,
  TextAlignValue,
  Tooltip
} from 'jimu-ui'

import {
  type IMConfig,
  SelectionModeType,
  Status,
  LIST_CARD_MIN_SIZE,
  PageStyle,
  type CardSize,
  type Suggestion,
  DS_TOOL_H,
  LIST_TOOL_MIN_SIZE_NO_DATA_ACTION,
  LIST_TOOL_MIN_SIZE_DATA_ACTION,
  type ListDivSize,
  ListLayoutType,
  type ElementSize,
  SCROLL_BAR_WIDTH,
  LIST_AUTO_REFRESH_INFO_SWITCH_SIZE
} from '../config'

import {
  LayoutEntry,
  searchUtils,
  LayoutItemSizeModes
} from 'jimu-layouts/layout-runtime'
import {
  getQueryOptions,
  fetchSuggestionRecords,
  compareQueryOptionsExceptPaging,
  getOrderByFields
} from './utils/list-service'

import {
  getToolsPopperStyle,
  getSearchToolStyle,
  getStyle,
  listStyle,
  getTopToolStyle
} from './styles/style'

import { LinkContainer } from 'jimu-ui/advanced/link-container'

import ListCardEditor from './components/list-card-editor'
import ListCardViewer from './components/list-card-viewer'
import defaultMessages from './translations/default'
import SearchBox from './components/search-box'
import { VariableSizeList as List, VariableSizeGrid as Grid } from 'react-window'
import { forwardRef } from 'react'
import SortSelect from './components/sort-select'
import FilterPicker from './components/filter-picker'
import { ListBottomTools } from './components/bottom-tools'
import { versionManager } from '../version-manager'
import * as listUtils from './utils/utils'
import { MenuOutlined } from 'jimu-icons/outlined/editor/menu'
import { SearchOutlined } from 'jimu-icons/outlined/editor/search'
import { ShowSelectionOutlined } from 'jimu-icons/outlined/editor/show-selection'
import { ClearSelectionGeneralOutlined } from 'jimu-icons/outlined/editor/clear-selection-general'
import { WarningOutlined } from 'jimu-icons/outlined/suggested/warning'
import widgetPrintOutlined from 'jimu-icons/svg/outlined/brand/widget-list.svg'
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info'
import { MoreHorizontalOutlined } from 'jimu-icons/outlined/application/more-horizontal'
import { RefreshOutlined } from 'jimu-icons/outlined/editor/refresh'

const defaultRecordsItem = { fake: true } as any
const MESSAGES = Object.assign({}, defaultMessages, jimuUIDefaultMessages, jimuCoreDefaultMessage)
const { SELECTION_DATA_VIEW_ID } = CONSTANTS
// const overSpeed = 1.5;

interface Props {
  selectionIsSelf: boolean
  selectionIsInSelf: boolean
  selectionStatus: Status
  appMode: AppMode
  browserSizeMode: BrowserSizeMode
  builderStatus: Status
  isRTL: boolean
  subLayoutType: LayoutType
  left: number | string
  top: number | string
  isWidthAuto: boolean
  isHeightAuto: boolean
  showLoading: boolean
  queryObject: IMUrlParameters
  boundingBox: BoundingBox
  heightLayoutItemSizeModes: LayoutItemSizeModes
  parentSize: ElementSize
  pageMode: PageMode
  activeSort: boolean
}
interface BodySize {
  scrollWidth: number
  scrollHeight: number
  clientWidth: number
  clientHeight: number
}

export type ListProps = AllWidgetProps<IMConfig> & Props

export interface ListStates {
  LayoutEntry: any
  page: number
  sortOptionName?: string
  searchText: string
  currentFilter: IMSqlExpression
  filterApplied: boolean
  currentCardSize: ElementSize
  forceShowMask: boolean
  showList: boolean
  showSelectionOnly: boolean
  widgetRect: {
    width: number
    height: number
  }
  hideCardTool: boolean
  scrollStatus: 'start' | 'end' | 'mid'
  datasource: DataSource
  hoverIndex: number
  isScrolling: boolean
  isScrollSpeedOver: boolean
  isResizingCard: boolean
  searchSuggestion: Suggestion[]
  isSearchBoxVisible: boolean
  isOpenTopToolsPopper: boolean
  latestUpdateTime: number
  autoRefreshLoadingString: string
  showLoading: boolean
  listDivSize: ListDivSize
  toolsDivWidth: number
  listDivBoundRect: DOMRect
  isScrollEnd: boolean
  isMount: boolean
  createDataSourceFailed: boolean
  showSortString: boolean
}

export class Widget extends React.PureComponent<ListProps, ListStates> {
  static versionManager = versionManager
  lastSelectedIndex: number
  isMySelected: boolean
  lastSelectedRecordIds: string[]
  listRef: any
  listOutDivRef: HTMLDivElement
  paginatorDiv: React.RefObject<HTMLDivElement>
  listTopRightToolsDiv: React.RefObject<HTMLDivElement>
  records: any[]
  queryStatus: DataSourceStatus
  totalCount: number
  lastQueryStart: number
  isSwitchPage: boolean
  needScroll: boolean
  lastPageSize: number
  needRefreshListOnListRendered: boolean
  listVisibleStartIndex: number
  listVisibleStopIndex: number
  innerElementType: React.ElementType
  lastSpace: number
  lastQuery: any
  suggestionsQueryTimeout: any
  reference: HTMLDivElement
  showPopperTimeOut: any
  isFirstLoad: boolean = true
  autoRefreshLoadingTime: any
  resetAutoRefreshTime: any
  setPageTimeout: any
  onItemsRenderedTimeout: any
  isHasScrolled: boolean = false /* Whether the List has scrolled */
  debounceOnResize: (width, height) => void
  debounceResetAfterIndices: () => void
  bodySize: BodySize
  isHasRenderList: boolean = false
  isHasPublishMessageAction: boolean = false
  pageSize: number
  maxPageForHidePageTotal: number = 1
  isSetLayout: boolean = false

  resetTimeout = null

  isHasInitCurrentCardSize: boolean = false

  needAutoScrollToSelectedItemWhenLoadPage: boolean = false
  autoScrollIndex: number = null

  isScrollToNextStep: boolean = false
  jumpOutNodeOfList: HTMLDivElement
  canClickLink: boolean = true
  isScrollEnd: boolean = false
  loadMoreDataTimeout = null
  queryOptions = null

  hasGetListSizeByResizeDetector = false
  isCurrentPageLastPage = false

  static mapExtraStateProps = (
    state: IMState,
    props: AllWidgetProps<IMConfig>
  ): Props => {
    const appConfig = state && state.appConfig
    const { layouts, layoutId, layoutItemId, builderSupportModules, id } = props
    const browserSizeMode = state && state.browserSizeMode
    const builderStatus =
      (state &&
        state.widgetsState &&
        state.widgetsState[props.id] &&
        state.widgetsState[props.id].builderStatus) ||
      Status.Default
    let subLayoutType
    if (appConfig) {
      const subLayout =
        appConfig &&
        state.appConfig.layouts &&
        state.appConfig.layouts[
          searchUtils.findLayoutId(
            Immutable(layouts[builderStatus]),
            browserSizeMode,
            appConfig.mainSizeMode
          )
        ]
      subLayoutType = subLayout && subLayout.type
    }

    const layout = appConfig.layouts?.[layoutId]
    const layoutSetting = layout?.content?.[layoutItemId]?.setting
    const isHeightAuto =
      layoutSetting?.autoProps?.height === LayoutItemSizeModes.Auto ||
      layoutSetting?.autoProps?.height === true
    const isWidthAuto =
      layoutSetting?.autoProps?.width === LayoutItemSizeModes.Auto ||
      layoutSetting?.autoProps?.width === true

    let widgetPosition
    if (window.jimuConfig.isInBuilder) {
      const bbox = appConfig.layouts?.[layoutId]?.content?.[layoutItemId]?.bbox
      widgetPosition = bbox && {
        left: bbox.left,
        top: bbox.top
      }
    }

    const selection =
      state && state.appRuntimeInfo && state.appRuntimeInfo.selection
    const selectionIsInSelf =
      selection &&
      builderSupportModules &&
      builderSupportModules.widgetModules &&
      builderSupportModules.widgetModules.selectionInList(
        selection,
        id,
        appConfig,
        false
      )
    let selectionStatus
    if (selectionIsInSelf) {
      selectionStatus = Object.keys(layouts).find(
        status =>
          searchUtils.findLayoutId(
            Immutable(layouts[status]),
            browserSizeMode,
            appConfig.mainSizeMode
          ) === selection.layoutId
      )
    }
    const selectionIsSelf = !!(
      selection &&
      selection.layoutId === layoutId &&
      selection.layoutItemId === layoutItemId
    )

    const currentPageId = state?.appRuntimeInfo?.currentPageId
    const pageMode = state?.appConfig?.pages?.[currentPageId]?.mode

    return {
      selectionIsSelf: selectionIsSelf,
      selectionIsInSelf: !!selectionIsInSelf,
      selectionStatus,
      appMode: state?.appRuntimeInfo?.appMode,
      browserSizeMode: state && state.browserSizeMode,
      builderStatus:
        (state &&
          state.widgetsState &&
          state.widgetsState[props.id] &&
          state.widgetsState[props.id].builderStatus) ||
        Status.Default,
      showLoading: state?.widgetsState?.[props.id]?.showLoading,
      activeSort: state?.widgetsState?.[props.id]?.activeSort,
      isRTL: state && state.appContext && state.appContext.isRTL,
      subLayoutType,
      left: widgetPosition && widgetPosition.left,
      top: widgetPosition && widgetPosition.top,
      isHeightAuto,
      isWidthAuto,
      queryObject: state.queryObject,
      boundingBox: layout?.content?.[layoutItemId]?.bbox,
      heightLayoutItemSizeModes: layoutSetting?.autoProps?.height,
      parentSize: state.widgetsState[props.id]?.parentSize || null,
      pageMode: pageMode
    }
  }

  constructor (props) {
    super(props)
    const { config } = props
    this.paginatorDiv = React.createRef<HTMLDivElement>()
    this.listTopRightToolsDiv = React.createRef<HTMLDivElement>()
    const stateObj: ListStates = {
      LayoutEntry: null,
      page: 1,
      sortOptionName:
        config.sorts && config.sorts[0] && config.sorts[0].ruleOptionName,
      currentCardSize: listUtils.getCardSizeNumberInConfig(props, listUtils.getDefaultMinListSize(props)),
      forceShowMask: false,
      widgetRect: listUtils.getDefaultMinListSize(props),
      showList: true,
      searchText: '',
      currentFilter: undefined,
      filterApplied: false,
      showSelectionOnly: false,
      hideCardTool: false,
      scrollStatus: 'start',
      datasource: undefined,
      hoverIndex: -1,
      isScrolling: false,
      isScrollSpeedOver: false,
      isResizingCard: false,
      searchSuggestion: [],
      isSearchBoxVisible: false,
      isOpenTopToolsPopper: false,
      latestUpdateTime: 0,
      showLoading: false,
      autoRefreshLoadingString: '',
      listDivSize: {
        clientWidth: null,
        clientHeight: null
      },
      toolsDivWidth: null,
      listDivBoundRect: null,
      isScrollEnd: false,
      isMount: false,
      createDataSourceFailed: false,
      showSortString: false
    }
    this.selectSelf = this.selectSelf.bind(this)
    this.handleResizeCard = this.handleResizeCard.bind(this)
    this.listRef = React.createRef()

    if (window.jimuConfig.isInBuilder) {
      stateObj.LayoutEntry = this.props.builderSupportModules.LayoutEntry
    } else {
      stateObj.LayoutEntry = LayoutEntry
    }
    this.state = stateObj

    this.onResize = this.onResize.bind(this)
    this.changeIsResizingCard = this.changeIsResizingCard.bind(this)
    this.setRefreshLoadingString = this.setRefreshLoadingString.bind(this)
    this.resetAutoRefreshTimes = this.resetAutoRefreshTimes.bind(this)
    this.debounceOnResize = lodash.debounce(
      (width, height) => { this.onResize(width, height) },
      100
    )
    this.debounceResetAfterIndices = lodash.debounce(
      () => { this.resetAfterIndices() },
      200
    )
  }

  componentDidMount () {
    const { dispatch, id } = this.props
    this.setState({
      isMount: true
    })
    this.getBodySize()
    window.addEventListener('resize', this.getBodySize)
    dispatch(appActions.widgetStatePropChange(id, 'listWidget', true))
  }

  componentWillUnmount () {
    clearTimeout(this.resizeTimeout)
    clearTimeout(this.updateCardToolTimeout)
    clearTimeout(this.mouseClickTimeout)
    clearTimeout(this.suggestionsQueryTimeout)
    clearTimeout(this.showPopperTimeOut)
    clearTimeout(this.resetAutoRefreshTime)
    clearTimeout(this.setPageTimeout)
    clearTimeout(this.onItemsRenderedTimeout)
    clearInterval(this.autoRefreshLoadingTime)
  }

  updateWidgetRectTimeout = undefined
  componentDidUpdate (preProps, preState) {
    const { config, appMode } = this.props
    const { datasource } = this.state
    if (!window.jimuConfig.isInBuilder || appMode !== AppMode.Design) {
      const isOpenSelectionMode = config.cardConfigs[Status.Selected].selectionMode !== SelectionModeType.None
      // Listen selected records change from outside
      if (datasource && isOpenSelectionMode) {
        this.scrollToSelectedItems(datasource)
      }
    }
    // update list in builder
    this.updateListInBuilder(preProps, preState)

    // listen appMode change
    this.appModeChange(preProps)

    if (preProps?.selectionIsInSelf !== this.props?.selectionIsInSelf) {
      this.setSelectionStatus()
    }

    this.setListLayoutInWidgetState()
    this.setListParentSizeInWidgetState()
    this.updatePageWhenPrePageSizeChange(preProps.config)
  }

  updatePageWhenPrePageSizeChange = (preConfig: IMConfig) => {
    if (!this.props.config?.itemsPerPage) {
      return false
    }
    if (preConfig?.itemsPerPage !== this.props.config?.itemsPerPage) {
      this.resetPage()
    }
  }

  checkIsRecordsChange = (records, preRecords) => {
    const recordsId = records?.map(record => record?.getId()) || []
    const preRecordsId = preRecords?.map(record => record?.getId()) || []
    if (recordsId?.length !== preRecordsId) {
      return true
    } else {
      return recordsId?.filter(id => !preRecordsId?.includes(id))?.length > 0
    }
  }

  resetAfterIndices = () => {
    this.listRef?.current?.resetAfterIndices && this.listRef?.current?.resetAfterIndices({
      columnIndex: 0,
      rowIndex: 0,
      shouldForceUpdate: false
    })
  }

  setListLayoutInWidgetState = () => {
    const { layoutId, layoutItemId, id, selectionIsSelf } = this.props
    if (layoutId && id && layoutItemId && !this.isSetLayout && selectionIsSelf) {
      this.props.dispatch(
        appActions.widgetStatePropChange(id, 'layoutInfo', {
          layoutId,
          layoutItemId
        })
      )
      this.isSetLayout = true
    }
  }

  setListParentSizeInWidgetState = () => {
    const { browserSizeMode, id, parentSize, layoutId } = this.props
    const appConfig = getAppStore().getState().appConfig
    const viewportSize = utils.findViewportSize(appConfig, browserSizeMode)

    const selector = `div.layout[data-layoutid=${layoutId}]`
    const parentElement = document.querySelector(selector)
    const newParentSize = {
      width: parentElement?.clientWidth || viewportSize.width,
      height: parentElement?.clientHeight || viewportSize.height
    }
    if (!parentSize || parentSize.height !== newParentSize.height || parentSize.width !== newParentSize.width) {
      this.props.dispatch(appActions.widgetStatePropChange(id, 'parentSize', newParentSize))
    }
  }

  getBodySize = () => {
    this.bodySize = {
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      clientWidth: document.documentElement.clientWidth,
      clientHeight: document.documentElement.clientHeight
    }
  }

  updateListInBuilder = (preProps, preState) => {
    const { config } = this.props
    if (!window.jimuConfig.isInBuilder) {
      return false
    }
    const currentCardSize = listUtils.getCardSizeNumberInConfig(this.props, this.state?.widgetRect)

    // listen layout properties change and then update list
    let hideCardTool = this.layoutPropertiesChange(preProps, preState)

    this.updateScrollContentSize(preProps.config)

    // listen paging type change
    this.pageTypeChange(preProps)

    // listen useDatasources change
    this.useDatasourcesChange(preProps)

    // listening listDiv size's change
    hideCardTool = this.listDivSizeChange(
      preProps,
      preState,
      currentCardSize,
      hideCardTool
    )

    if (hideCardTool) {
      this.updateCardToolPosition()
    }

    // listen sort change
    this.listSortChange(preProps)

    // listen filter change
    this.listFilterChange(preProps)

    const isSelectionModeChange =
      config.cardConfigs[Status.Selected].selectionMode !==
      preProps.config.cardConfigs[Status.Selected].selectionMode
    if (isSelectionModeChange) {
      this.selectRecords([])
    }
  }

  layoutPropertiesChange = (preProps, preState): boolean => {
    const { config, top, left } = this.props
    let hideCardTool = false
    if (!window.jimuConfig.isInBuilder) {
      return false
    }
    let refreshList: boolean = false
    // listen layout properties change and then update list
    const currentCardSize = listUtils.getCardSizeNumberInConfig(this.props, this.state.widgetRect)
    const oldCardSize = listUtils.getCardSizeNumberInConfig(preProps, preState?.widgetRect)

    this.updateScrollContentSize(preProps.config)

    const isWidgetPositionChange =
      top !== preProps.top || left !== preProps.left
    const isListLayoutChange = config?.layoutType !== preProps.config.layoutType
    const isEqualCardSizeByListLayout = !listUtils.isEqualCardSizeByListLayout(
      oldCardSize,
      currentCardSize,
      config.layoutType
    ) // for change template
    if (
      isListLayoutChange ||
      isEqualCardSizeByListLayout ||
      isWidgetPositionChange
    ) {
      hideCardTool = true
      if (isEqualCardSizeByListLayout) {
        const newState = {
          currentCardSize
        }
        refreshList = true
        this.setState(newState, () => {
          if (refreshList) this.refreshList()
        })
      } else if (isListLayoutChange) {
        this.handleResizeCard(
          this.state.currentCardSize,
          true,
          false,
          false,
          true
        )
      }
    }

    if (!refreshList) {
      const isSpaceNotChange = config?.layoutType === ListLayoutType.GRID
        ? listUtils.isEqualNumber(config?.horizontalSpace, preProps.config?.horizontalSpace) && listUtils.isEqualNumber(config?.verticalSpace, preProps.config?.verticalSpace)
        : listUtils.isEqualNumber(config.space, preProps.config.space)
      if (!isSpaceNotChange || config.layoutType !== preProps.config.layoutType) {
        refreshList = true
        this.refreshList()
      }
    }
    return hideCardTool
  }

  listDivSizeChange = (
    preProps,
    preState,
    currentCardSize: CardSize,
    hideCardTool: boolean
  ): boolean => {
    const { config, isHeightAuto } = this.props
    const { listDivSize, createDataSourceFailed, datasource } = this.state
    const showLoading = !this.isHasRenderList && !createDataSourceFailed
    if (showLoading || (datasource && !preState?.datasource)) {
      return hideCardTool
    }
    const showBT = listUtils.showBottomTools(this.props, this.state)
    const oldShowBT = listUtils.showBottomTools(preProps, preState)
    const showDS = listUtils.showTopTools(this.props)
    const oldShowDS = listUtils.showTopTools(preProps)
    if (showBT !== oldShowBT || showDS !== oldShowDS) {
      if (!isHeightAuto) {
        if (config.layoutType === ListLayoutType.Column) {
          let cardH = this.state.widgetRect?.height || listDivSize?.clientHeight
          cardH -=
            listUtils.getBottomToolH(this.paginatorDiv.current, showBT) +
            (showDS ? 1 : 0) * DS_TOOL_H
          if (cardH < LIST_CARD_MIN_SIZE) return
          const cardSize = {
            height: cardH,
            width: currentCardSize.width
          }
          this.handleResizeCard(cardSize, true, false, false, true)
        }
      } else {
        hideCardTool = true
      }
    }
    return hideCardTool
  }

  appModeChange = preProps => {
    const {
      appMode,
      selectionIsSelf,
      selectionStatus,
      builderStatus
    } = this.props
    if (preProps.appMode !== appMode) {
      if (appMode !== AppMode.Design) {
        this.editBuilderAndSettingStatus(Status.Default)
      } else {
        if (selectionStatus !== builderStatus) {
          // change status by toc
          if (!selectionStatus) {
            if (!selectionIsSelf) {
              this.editBuilderAndSettingStatus(Status.Default)
            }
          } else {
            this.editBuilderAndSettingStatus(selectionStatus)
          }
        }
        this.setState(
          {
            showSelectionOnly: false,
            searchText: undefined,
            filterApplied: false,
            hoverIndex: -1
          },
          () => {
            this.scrollToIndex(0)
          }
        )
      }
    }
  }

  pageTypeChange = preProps => {
    const { pageStyle } = this.props.config
    const oldPageStyle = preProps.config.pageStyle
    if (pageStyle !== oldPageStyle) {
      this.resetPage()
    }
  }

  resetPage = () => {
    this.setState({
      page: 1
    })
    this.maxPageForHidePageTotal = 1
  }

  useDatasourcesChange = preProps => {
    const { useDataSources } = this.props
    const oldUseDataSources = preProps.useDataSources
    if (useDataSources && useDataSources[0]) {
      const oldUseDataSource = oldUseDataSources && oldUseDataSources[0]
      if (
        !oldUseDataSource ||
        oldUseDataSource.dataSourceId !== useDataSources[0].dataSourceId
      ) {
        // reset queryStart
        this.resetPage()
      }
    } else {
      // remove ds maybe
      this.setState({
        datasource: undefined
      })
    }
  }

  listSortChange = preProps => {
    const { config } = this.props
    if (config.sortOpen) {
      const sorts = config.sorts
      const oldSorts = preProps.config.sorts
      if (sorts !== oldSorts) {
        this.setState({
          sortOptionName: undefined,
          showSortString: false
        })
      }
    }
  }

  listFilterChange = preProps => {
    const { config } = this.props
    if (config.filterOpen) {
      const filter = config.filter
      const oldFilter = preProps.config.filter
      if (filter !== oldFilter) {
        this.setState({
          currentFilter: undefined,
          filterApplied: false
        })
      }
    }
  }

  setSelectionStatus = () => {
    const { id, selectionIsInSelf } = this.props
    this.props.dispatch(
      appActions.widgetStatePropChange(
        id,
        'selectionIsInSelf',
        selectionIsInSelf
      )
    )
  }

  updateScrollContentSize = preConfig => {
    const { config } = this.props
    const isSpaceNotChange = config?.layoutType === ListLayoutType.GRID
      ? listUtils.isEqualNumber(config?.horizontalSpace, preConfig?.horizontalSpace) && listUtils.isEqualNumber(config?.verticalSpace, preConfig?.verticalSpace)
      : listUtils.isEqualNumber(config.space, preConfig.space)
    if (config.layoutType !== preConfig.layoutType || !isSpaceNotChange) {
      this.setScrollContentSize()
    }
  }

  scrollToSelectedItems = (datasource: DataSource) => {
    const selectedRecordIds = datasource.getSelectedRecordIds()
    const isSelectedRecordsChange = this.checkIsSelectRecordsChange(datasource)
    if (selectedRecordIds && selectedRecordIds.length > 0 && isSelectedRecordsChange) {
      if (isSelectedRecordsChange || this.needScroll) {
        const newAddedSelectedRecordsId = this.getNewAddedSelectedRecordsId(datasource)
        const newScrollToSelectedRecordsId = newAddedSelectedRecordsId?.length > 0 ? newAddedSelectedRecordsId : selectedRecordIds
        let index = -1
        this?.records?.find((record, i) => {
          if (!record?.getId) {
            return false
          }
          const recordId = record?.getId?.()
          if (newScrollToSelectedRecordsId?.includes(recordId)) {
            index = i
            return true
          } else {
            return false
          }
        })
        if (index === -1) {
          // Can't find it, need to search in all records again
          const records = datasource.getRecords()
          records &&
            records.find((record, i) => {
              if (record.getId?.() === selectedRecordIds[0]) {
                index = i
                return true
              } else {
                return false
              }
            })
          if (index > -1) {
            const newPage = Math.ceil((index + 1) / this.getPageSize())
            this.needScroll = true
            this.setState({
              page: newPage
            })
          }
        } else {
          this.scrollToIndex(index)
          this.needScroll = false
          //loadMore may be triggered during scrollToItem, and the scrollToIndex logic in handleScrollDown will be triggered at this time,
          //but this logic is not needed when automatically jumping to the currently selected records
          this.autoScrollIndex = index
          this.needAutoScrollToSelectedItemWhenLoadPage = true
          this.lastSelectedRecordIds = selectedRecordIds || []
        }
      }
    }
  }

  checkIsSelectRecordsChange = (datasource: DataSource) => {
    const selectedRecordIds = datasource?.getSelectedRecordIds() || []
    const lastSelectedRecordIds = this?.lastSelectedRecordIds || []
    if (selectedRecordIds?.length !== lastSelectedRecordIds?.length) {
      return true
    } else {
      return selectedRecordIds?.filter(id => !lastSelectedRecordIds?.includes(id))?.length > 0
    }
  }

  getNewAddedSelectedRecordsId = (datasource: DataSource) => {
    const lastSelectedRecordIds = this.lastSelectedRecordIds || []
    const selectedRecordIds = datasource.getSelectedRecordIds() || []
    const newAddedSelectedRecords = selectedRecordIds?.filter(id => {
      return !lastSelectedRecordIds?.includes(id)
    })
    return newAddedSelectedRecords
  }

  onDSCreated = (ds: DataSource) => {
    const { dispatch, id } = this.props
    this.setState({
      datasource: ds,
      createDataSourceFailed: false
    }, () => {
      dispatch(appActions.widgetStatePropChange(id, 'dsId', ds.id))
    })
  }

  resizeTimeout
  onResize = (width, height) => {
    const newWidgetRect = {
      width,
      height
    }
    this.hasGetListSizeByResizeDetector = true
    const { config } = this.props
    const { isResizingCard, currentCardSize, widgetRect } = this.state
    if (isResizingCard) {
      return
    }
    const showBottomTool = listUtils.showBottomTools(this.props, this.state)
    const bottomToolH = listUtils.getBottomToolH(
      this.paginatorDiv.current,
      showBottomTool
    )
    const showTopTool = listUtils.showTopTools(this.props)
    const listH = listUtils.getListHeight(
      newWidgetRect,
      bottomToolH,
      showTopTool
    )
    const oldCardSize = this.getOldCardSizeWhenResize(newWidgetRect)
    const newDefaultCardSize = config.layoutType === ListLayoutType.GRID ? listUtils.getCardSizeNumberInConfig(this.props, newWidgetRect) : currentCardSize
    const cardSize = {
      width: newDefaultCardSize.width,
      height: newDefaultCardSize.height
    }
    let needRefreshList: boolean = !listUtils.isEqualNumber(currentCardSize?.width, newDefaultCardSize?.width) || !listUtils.isEqualNumber(currentCardSize?.height, newDefaultCardSize?.height)
    if (config.lockItemRatio && config.layoutType !== ListLayoutType.GRID) {
      const ratio = cardSize.width / cardSize.height
      switch (config?.layoutType) {
        case ListLayoutType.Column:
          cardSize.height = listH
          cardSize.width = listH * ratio
          if (!listUtils.isEqualNumber(cardSize.width, oldCardSize.width)) {
            needRefreshList = true
          }
          break
        case ListLayoutType.Row:
          cardSize.height = width / ratio
          cardSize.width = width
          if (!listUtils.isEqualNumber(cardSize.height, oldCardSize.height)) {
            needRefreshList = true
          }
          break
      }
    } else {
      switch (config?.layoutType) {
        case ListLayoutType.Column:
          cardSize.height = listH
          break
        case ListLayoutType.Row:
          cardSize.width = width
          break
      }
    }
    const notResetCardSize = cardSize.width < LIST_CARD_MIN_SIZE || cardSize.height < LIST_CARD_MIN_SIZE
    const isWidgetSizeChange = (newWidgetRect.width !== widgetRect.width || newWidgetRect.height !== widgetRect.height) && newWidgetRect.width !== 0 && newWidgetRect.height !== 0
    if (notResetCardSize && !isWidgetSizeChange) {
      return
    }
    this.setState(
      {
        widgetRect: newWidgetRect,
        currentCardSize: cardSize
      },
      () => {
        this.isHasInitCurrentCardSize = true
        this.editListSizeInRunTime(newWidgetRect)
        if (needRefreshList) {
          this.refreshList()
        }
      }
    )
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout)
      this.resizeTimeout = undefined
    }
    if (config.lockItemRatio) {
      this.resizeTimeout = setTimeout(() => {
        this.handleResizeCard(cardSize, true, false, false, true)
      }, 500)
    }
    this.updateCardToolPosition()
    this.setListDivSize()
    if (!this.isCurrentPageLastPage && this.isScrollEnd) {
      this.loadNextPageWhenListSizeOrTotalCountChange()
    }
  }

  getOldCardSizeWhenResize = (newWidgetRect): ElementSize => {
    //When the width and height are percentages, the Onresize method will be automatically called once when the List is loaded. At this time, the current List size should be used to obtain the oldCardSize
    const { currentCardSize } = this.state
    if (!this.isHasInitCurrentCardSize) {
      return listUtils.getCardSizeNumberInConfig(this.props, newWidgetRect)
    } else {
      return currentCardSize
    }
  }

  updateCardToolTimeout
  private readonly updateCardToolPosition = () => {
    const { selectionIsSelf } = this.props
    const { hideCardTool } = this.state
    if (!selectionIsSelf || hideCardTool) return
    this.setState({
      hideCardTool: true
    })
    if (this.updateCardToolTimeout) {
      clearTimeout(this.updateCardToolTimeout)
      this.updateCardToolTimeout = undefined
    }
    this.updateCardToolTimeout = setTimeout(() => {
      this.setState({
        hideCardTool: false
      })
    }, 500)
  }

  private readonly refreshList = (shouldForceUpdate: boolean = true) => {
    if (this.listRef.current) {
      if (this.props.config?.layoutType === ListLayoutType.GRID) {
        //VariableSizeGrid caches offsets and measurements for each item for performance purposes.
        //This method clears that cached data for all items after (and including) the specified indices. It should be called whenever an items size changes.
        //https://react-window.vercel.app/#/api/VariableSizeGrid
        this.resetAfterIndices()
      } else {
        //VariableSizeList caches offsets and measurements for each index for performance purposes.
        //This method clears that cached data for all items after (and including) the specified index. It should be called whenever a item's size changes.
        this.listRef?.current?.resetAfterIndex && this.listRef?.current?.resetAfterIndex(0, shouldForceUpdate)
      }
    }
  }

  private readonly isDsConfigured = (): boolean => {
    const { useDataSources } = this.props
    return !!useDataSources && !!useDataSources[0]
  }

  private readonly selectRecords = (records: DataRecord[]) => {
    const { datasource } = this.state

    if (datasource) {
      MessageManager.getInstance().publishMessage(new DataRecordsSelectionChangeMessage(this.props.id, records, [datasource.id]))

      if (records) {
        this.isHasPublishMessageAction = true
        this.lastSelectedRecordIds = records?.map(record => record.getId()) || []
        datasource.selectRecordsByIds(records.map(record => record.getId()))
      } else {
        this.isHasPublishMessageAction = false
      }
    }
  }

  formatMessage = (id: string, values?: { [key: string]: any }) => {
    return this.props.intl.formatMessage(
      { id: id, defaultMessage: MESSAGES[id] },
      values
    )
  }

  // call exec manuly
  editStatus = (name, value) => {
    const { dispatch, id } = this.props
    dispatch(appActions.widgetStatePropChange(id, name, value))
  }

  editWidgetConfig = newConfig => {
    if (!window.jimuConfig.isInBuilder) return

    const appConfigAction = this.props.builderSupportModules.jimuForBuilderLib.getAppConfigAction()
    appConfigAction.editWidgetConfig(this.props.id, newConfig).exec()
  }

  scrollToIndex = (index: number, type: string = 'start') => {
    const { config } = this.props
    if (this.listRef.current) {
      if (config?.layoutType === ListLayoutType.GRID) {
        const columnCount = this.getItemColumnCount()
        const rowIndex = Math.floor(index / columnCount)
        this.listRef.current.scrollToItem({
          columnIndex: index - rowIndex * columnCount,
          rowIndex: rowIndex,
          align: type
        })
      } else {
        this.listRef.current.scrollToItem(index, type)
      }
    }
  }

  isEditing = (): boolean => {
    const { appMode, config, selectionIsSelf, selectionIsInSelf } = this.props
    if (!window.jimuConfig.isInBuilder) return false
    const notRunTimeMode = appMode === AppMode.Design
    const haveBeenSelection = selectionIsSelf || selectionIsInSelf
    return (haveBeenSelection && window.jimuConfig.isInBuilder && notRunTimeMode && config.isItemStyleConfirm)
  }

  private readonly handleItemChange = (itemRecord: DataRecord) => {
    const { config } = this.props
    const { datasource } = this.state
    if (!datasource || !itemRecord) return

    let selectedRecords = datasource.getSelectedRecords() || []
    if (
      config.cardConfigs[Status.Selected].selectionMode &&
      config.cardConfigs[Status.Selected].selectionMode !==
      SelectionModeType.None
    ) {
      const recordId = itemRecord?.getId()
      const record = selectedRecords.find(record => record.getId() === recordId)
      if (
        config.cardConfigs[Status.Selected].selectionMode ===
        SelectionModeType.Single
      ) {
        if (record) {
          this.canClickLink = false
          this.selectRecords([])
          this.setState({ showSelectionOnly: false })
        } else {
          this.canClickLink = true
          this.selectRecords([itemRecord])
        }
      } else {
        if (record) {
          this.canClickLink = false
          selectedRecords = selectedRecords.filter(
            record => record.getId() !== recordId
          )
        } else {
          this.canClickLink = true
          selectedRecords = selectedRecords.concat([itemRecord])
        }
        this.selectRecords(selectedRecords)
      }
    }
  }

  mouseClickTimeout

  handleListPointerDown = evt => {
    this.setState({
      forceShowMask: true
    })
    if (this.mouseClickTimeout) {
      clearTimeout(this.mouseClickTimeout)
      this.mouseClickTimeout = undefined
    }
    this.mouseClickTimeout = setTimeout(() => {
      this.setState({
        forceShowMask: false
      })
    }, 200)
  }

  handleScrollUp = e => {
    if (e) {
      this.isScrollToNextStep = true
    }
    const scrollStep = this.getScrollStep()
    const listVisibleStartIndex = this.getListVisibleStartIndex()
    let toIndex = listVisibleStartIndex - scrollStep
    if (toIndex < 0) {
      toIndex = 0
    }
    this.scrollToIndex(toIndex, 'start')
    this.isScrollToNextStep = false
  }

  handleScrollDown = e => {
    let listVisibleEndIndex = 0
    if (e) {
      //Click the Next Button to trigger, after clicking, jump according to the last visible line
      listVisibleEndIndex = this.getListVisibleEndIndex()
      this.isScrollToNextStep = true
    } else {
      //Execute after Record load, jump according to the first visible line
      listVisibleEndIndex = this.getListVisibleStartIndex()
    }
    const scrollStep = this.getScrollStep()
    const { listVisibleStopIndex } = this
    if (
      listVisibleStopIndex + scrollStep >= this.records.length - 1 &&
      !this.isCurrentPageLastPage
    ) {
      this.isSwitchPage = true
      this.setState({
        page: this.state.page + 1
      })
    } else {
      if (this.needAutoScrollToSelectedItemWhenLoadPage) {
        this.scrollToIndex(this.autoScrollIndex)
      } else {
        this.scrollToIndex(listVisibleEndIndex + scrollStep, 'start')
      }
    }
  }

  getScrollStep = () => {
    const { scrollStep, layoutType } = this.props.config
    const step = this.isScrollToNextStep ? scrollStep : 0
    const columnCount = this.getItemColumnCount()
    return layoutType === ListLayoutType.GRID ? step * columnCount : step
  }

  handleSwitchPage = (pageNum: number) => {
    const totalPages = this.getTotalPage()
    if (totalPages && (pageNum < 1 || pageNum > totalPages)) return
    if (pageNum !== this.state.page) {
      this.isSwitchPage = true
      this.lastQueryStart = this.state.page
      this.setState({
        page: pageNum
      })
    }
  }

  handleListMouseLeave = () => {
    if (this.isEditing()) return
    this.setState({
      hoverIndex: -1
    })
  }

  handleListMouseMove = (itemIndex: number) => {
    if (this.isEditing()) return
    if (itemIndex === this.state.hoverIndex) return
    this.setState({
      hoverIndex: itemIndex
    })
  }

  lastScrollOffset = 0
  timeStamp
  handleListScroll = ({
    scrollDirection,
    scrollOffset,
    scrollTop,
    scrollUpdateWasRequested
  }) => {
    const { appMode, config } = this.props
    const listDiv = this.listOutDivRef
    const { datasource, scrollStatus } = this.state
    this.lastScrollOffset = config?.layoutType === ListLayoutType.GRID ? scrollTop : scrollOffset
    if (!listDiv || (this.records?.length ?? 0) < 1) return
    if (
      config.pageStyle === PageStyle.Scroll &&
      this.queryStatus !== DataSourceStatus.Loading &&
      datasource &&
      (!window.jimuConfig.isInBuilder || appMode !== AppMode.Design)
    ) {
      this.isHasScrolled = true
      if (listUtils.isScrollStart(listDiv, this.lastScrollOffset)) {
        if (scrollStatus !== 'start') {
          this.setState({
            scrollStatus: 'start'
          })
        }
      } else {
        if (scrollStatus !== 'mid') {
          this.setState({
            scrollStatus: 'mid'
          })
        }
      }
    }
  }

  getTotalPage = () => {
    const { totalCount } = this
    const { config } = this.props
    const total = totalCount
    const totalPage = Math.floor(total / config.itemsPerPage)
    const mode = total % config.itemsPerPage
    return mode === 0 ? totalPage : totalPage + 1
  }

  getListVisibleStartIndex = () => {
    const { lastScrollOffset } = this
    const { config } = this.props
    const itemSize = this.itemSize(0)
    const base = (lastScrollOffset * 1.0) / itemSize
    let index = Math.floor(base)
    const mo = (base - index) * itemSize
    const space = config?.layoutType === ListLayoutType.GRID ? config?.verticalSpace : config?.space
    const columnCount = this.getItemColumnCount()
    index = config?.layoutType === ListLayoutType.GRID ? index * columnCount : index
    if (mo > itemSize - space) {
      index = config?.layoutType === ListLayoutType.GRID ? index + columnCount : index + 1
    }
    return index
  }

  getListVisibleEndIndex = () => {
    const { lastScrollOffset } = this
    const { config } = this.props
    const itemSize = this.itemSize(0)
    const isHorizon = config?.layoutType === ListLayoutType.Column
    const listItemContentSize = this.getListSize()
    const contentSize = isHorizon ? listItemContentSize.width : listItemContentSize.height
    const base = ((lastScrollOffset + contentSize) * 1.0) / itemSize
    let index = Math.floor(base)
    const mo = (base - index) * itemSize
    const space = config?.layoutType === ListLayoutType.GRID ? config?.verticalSpace : config?.space
    const columnCount = this.getItemColumnCount()
    index = config?.layoutType === ListLayoutType.GRID ? index * columnCount - 1 : index

    if (index < 0) {
      index = 0
    }

    if (mo > itemSize - space) {
      index = config?.layoutType === ListLayoutType.GRID ? index + columnCount : index + 1
    }
    return index
  }

  handleSortOptionChange = (label: string) => {
    this.setState(
      {
        sortOptionName: label,
        page: 1,
        showSortString: false,
        scrollStatus: 'start',
        isScrollEnd: false
      }, () => {
        this.resetPage()
        this.scrollToIndex(0)
      })
  }

  handleSearchTextChange = searchText => {
    if (searchText === '' || !searchText) {
      this.handleSearchSubmit(undefined)
    }
    this.setState({
      searchSuggestion: []
    })
    clearTimeout(this.suggestionsQueryTimeout)
    this.suggestionsQueryTimeout = setTimeout(() => {
      this.getSearchSuggestions(searchText)
    }, 200)
  }

  getSearchSuggestions = searchText => {
    const { config } = this.props
    const { datasource } = this.state
    if (searchText?.length < 3) {
      return false
    }
    fetchSuggestionRecords(searchText, config, datasource).then(
      searchSuggestion => {
        this.setState({
          searchSuggestion: searchSuggestion
        })
      }
    )
  }

  handleSearchSubmit = (searchText, isEnter = false) => {
    const { datasource } = this.state
    const oldSearchText = this.state.searchText
    if (oldSearchText === searchText && !isEnter) {
      return
    }
    this.setState(
      {
        searchText: searchText,
        page: 1
      },
      () => {
        this.resetPage()
        MessageManager.getInstance().publishMessage(new DataSourceFilterChangeMessage(this.props.id, [datasource.id]))
        // this.selectRecords([])
      }
    )
  }

  changeIsResizingCard = (isResizingCard: boolean) => {
    this.setState({
      isResizingCard: isResizingCard
    })
  }

  handleResizeCard = (
    newCardSize,
    resizeEnd: boolean = false,
    isTop?: boolean,
    isLeft?: boolean,
    isReplace: boolean = false
  ) => {
    if (resizeEnd) {
      const cardSize = this.initNewCardSize(newCardSize)
      window.jimuConfig.isInBuilder &&
        this.props.builderSupportModules.widgetModules.handleResizeCard(
          this.props,
          cardSize,
          isTop,
          isLeft,
          resizeEnd,
          isReplace
        )
    } else {
      this.setState(
        {
          currentCardSize: newCardSize
        },
        () => {
          this.refreshList(false)
        }
      )
    }
  }

  initNewCardSize = (newCardSize: ElementSize) => {
    const { config } = this.props
    //If the original width and height are percentages, px will be converted to percentages during resize, and then set to config
    const { widgetRect } = this.state
    let cardSize = Immutable(newCardSize)
    const cardSizeWidthUnit = listUtils.getCardSizeWidthUnitInConfig(this.props)
    if (cardSizeWidthUnit.width.unit === DistanceUnits.PERCENTAGE) {
      cardSize = cardSize.set('width', `${(newCardSize.width * 100) / (widgetRect.width + config?.horizontalSpace - SCROLL_BAR_WIDTH)}%`)
    }
    if (cardSizeWidthUnit.height.unit === DistanceUnits.PERCENTAGE) {
      cardSize = cardSize.set('height', `${newCardSize.height * 100 / widgetRect.height}%`)
    }
    return cardSize?.asMutable({ deep: true })
  }

  handleFilterChange = (sqlExprObj: IMSqlExpression) => {
    const { datasource } = this.state
    this.setState(
      {
        currentFilter: sqlExprObj,
        page: 1
      },
      () => {
        this.resetPage()
        MessageManager.getInstance().publishMessage(new DataSourceFilterChangeMessage(this.props.id, [datasource.id]))
      }
    )
  }

  handleFilterApplyChange = (applied: boolean) => {
    const { datasource } = this.state
    const alterState = {
      filterApplied: applied,
      queryStart: 0
    } as any

    if (!applied) {
      // alterState.currentFilter = undefined
    }
    this.setState(alterState, () => {
      MessageManager.getInstance().publishMessage(new DataSourceFilterChangeMessage(this.props.id, [datasource.id]))
    })
  }

  handleShowSelectionClick = evt => {
    const { showSelectionOnly } = this.state
    this.setState({ showSelectionOnly: !showSelectionOnly })
  }

  handleClearSelectionClick = () => {
    this.setState({ showSelectionOnly: false })
    this.selectRecords([])
  }

  resetShowSelectionStatus = () => {
    const { showSelectionOnly } = this.state
    if (showSelectionOnly) {
      this.setState({ showSelectionOnly: false })
    }
  }

  _getCurrentPage = () => {
    return this.state.page
  }

  getTotalCount = () => {
    const total = this.totalCount || 0
    return total
  }

  selectCard = () => {
    const { selectionIsInSelf } = this.props
    if (selectionIsInSelf) {
      this.selectSelf()
    }
  }

  selectSelf () {
    window.jimuConfig.isInBuilder &&
      this.props.builderSupportModules.widgetModules.selectSelf(this.props)
  }

  editBuilderAndSettingStatus = (status: Status) => {
    this.editStatus('showCardSetting', status)
    this.editStatus('builderStatus', status)
  }

  editListSizeInRunTime = (widgetRect: ElementSize) => {
    const { id, dispatch } = this.props
    dispatch(appActions.widgetStatePropChange(id, 'widgetRect', widgetRect))
  }

  renderListTopTools = (ds: DataSource, queryStatus?: DataSourceStatus, selectRecords?: DataRecord[], isShowListMask?: boolean) => {
    const { widgetRect, isSearchBoxVisible, isOpenTopToolsPopper } = this.state
    const listWidth = widgetRect?.width || 620
    const isShowDataAction = listUtils.checkIsShowDataAction(this.props)
    const isShowListToolsOnly = listUtils.checkIsShowListToolsOnly(this.props)
    const dataName = this.formatMessage('listDataActionLabel', { layer: ds?.getLabel() || '' })
    const LIST_TOOL_MIN_SIZE = isShowDataAction ? LIST_TOOL_MIN_SIZE_DATA_ACTION : LIST_TOOL_MIN_SIZE_NO_DATA_ACTION
    const useFields = this.getFieldsOfWidgetInList()
    return (
      <div className='datasource-tools w-100' css={getTopToolStyle(this.props, isShowListToolsOnly)}>
        <div className="d-flex align-items-center">
          <div className="flex-grow-1 tool-row overflow-hidden">
            {isShowListToolsOnly && <div>
              {listWidth >= LIST_TOOL_MIN_SIZE && (
                <div className='tool-row row1 d-flex align-items-center w-100 justify-content-between'>
                  {this.renderSearchTools(ds, queryStatus)}
                  {(!isSearchBoxVisible || listWidth >= 360) &&
                    this.renderTopRightTools(ds, queryStatus)}
                </div>
              )}
              {listWidth < LIST_TOOL_MIN_SIZE && (
                <div className='float-right' ref={ref => { this.reference = ref }}>
                  <Button
                    type='tertiary'
                    icon
                    size='sm'
                    className='tools-menu'
                    title={this.formatMessage('guideStep9Title')}
                    onClick={evt => {
                      this.setState({ isOpenTopToolsPopper: !isOpenTopToolsPopper })
                    }}
                  >
                    <MoreHorizontalOutlined size={16}/>
                  </Button>
                  {this.renderListTopToolsInPopper(ds, queryStatus)}
                </div>
              )}
            </div>}
          </div>
          {(ds && isShowDataAction) && <div className={classNames('list-data-action position-relative', { 'm-left': listWidth < LIST_TOOL_MIN_SIZE })} data-testid="data-action">
            <DataActionList
              widgetId={this.props.id}
              dataSets={[{ dataSource: ds, records: selectRecords, name: dataName, type: 'selected', fields: useFields }]}
              listStyle={DataActionListStyle.Dropdown}
              buttonType='tertiary'
              buttonSize='sm'
            />
          </div>}
        </div>
        {isShowListMask && (
          <div className='editing-mask-ds-tool' />
        )}

      </div>
    )
  }

  getFieldsOfWidgetInList = (): string[] => {
    const { browserSizeMode, id } = this.props
    const appConfig = getAppStore().getState()?.appConfig

    const allLayoutsOfCurrentWidget = appConfig?.widgets?.[id]?.layouts || {}
    let layoutIds = Object.keys(allLayoutsOfCurrentWidget).map(key => {
      return allLayoutsOfCurrentWidget[key][browserSizeMode]
    }) || []
    layoutIds = Array.from(new Set(layoutIds))

    let widgetList = []
    layoutIds.forEach(layoutId => {
      const widgets = searchUtils.getContentsInLayoutWithRecursiveLayouts(appConfig, layoutId, LayoutItemType.Widget, browserSizeMode) || []
      widgetList = widgetList.concat(widgets)
    })
    widgetList = Array.from(new Set(widgetList))

    let useFields = []
    widgetList.forEach(widgetId => {
      const fields = appConfig.widgets[widgetId]?.useDataSources?.[0]?.fields || []
      useFields = useFields.concat(fields)
    })

    return Array.from(new Set(useFields))
  }

  renderListTopToolsInPopper = (
    ds: DataSource,
    queryStatus?: DataSourceStatus
  ) => {
    const { widgetRect, isSearchBoxVisible, isOpenTopToolsPopper } = this.state
    const toolsDisabled = this.isEditing()
    const listWidth = widgetRect?.width || 620
    const LIST_TOOL_MIN_SIZE = listUtils.checkIsShowDataAction(this.props) ? LIST_TOOL_MIN_SIZE_DATA_ACTION : LIST_TOOL_MIN_SIZE_NO_DATA_ACTION
    const isOpen =
      listWidth < LIST_TOOL_MIN_SIZE && isOpenTopToolsPopper && !toolsDisabled
    return (
      <div>
        <Popper
          placement='bottom-start'
          reference={this.reference}
          offset={[-10, 0]}
          open={isOpen}
          showArrow
          toggle={e => {
            this.setState({ isOpenTopToolsPopper: !isOpen })
          }}
        >
          <div
            className='tool-row row1 d-flex align-items-center justify-content-between'
            css={getToolsPopperStyle(this.props)}
          >
            {this.renderSearchTools(ds, queryStatus)}
            {!isSearchBoxVisible && this.renderTopRightTools(ds, queryStatus)}
          </div>
        </Popper>
      </div>
    )
  }

  renderSearchTools = (ds: DataSource, queryStatus?: DataSourceStatus) => {
    const toolsDisabled =
      this.isEditing() || !ds || queryStatus !== DataSourceStatus.Loaded
    const {
      searchText,
      widgetRect,
      isSearchBoxVisible,
      showLoading
    } = this.state
    const listWidth = widgetRect?.width || 620
    const { theme, config, appMode } = this.props
    const toolLineClassName = listWidth < 360 ? 'ds-tools-line-blue' : ''
    const placeholder = config?.searchHint || this.formatMessage('search')
    const isShowBackButton = listWidth < 360 && isSearchBoxVisible
    return (
      <div
        className='list-search-div flex-grow-1'
        css={getSearchToolStyle(this.props)}
      >
        {listUtils.showSearch(this.props) && (
          <div className='d-flex search-box-content'>
            {(listWidth >= 360 || isSearchBoxVisible) && (
              <div className='flex-grow-1 w-100'>
                <SearchBox
                  theme={theme}
                  placeholder={placeholder}
                  searchText={searchText}
                  onSearchTextChange={this.handleSearchTextChange}
                  onSubmit={this.handleSearchSubmit}
                  disabled={toolsDisabled}
                  searchSuggestion={this.state.searchSuggestion}
                  suggestionWidth={listWidth}
                  showLoading={showLoading}
                  formatMessage={this.formatMessage}
                  isShowBackButton={isShowBackButton}
                  toggleSearchBoxVisible={this.toggleSearchBoxVisible}
                  className='list-search '
                  appMode={appMode}
                />
                <div
                  className={classNames('ds-tools-line', toolLineClassName)}
                />
              </div>
            )}
            {listWidth < 360 && !isSearchBoxVisible && (
              <Button
                type='tertiary'
                icon
                size='sm'
                onClick={evt => {
                  this.toggleSearchBoxVisible(true)
                }}
                className='list-search-icon'
                title={this.formatMessage('search')}
              >
                <SearchOutlined size={16} color={theme.ref.palette.neutral[700]}/>
              </Button>
            )}
          </div>
        )}
      </div>
    )
  }

  toggleSearchBoxVisible = (isVisible = false) => {
    const { widgetRect } = this.state
    this.setState({
      isSearchBoxVisible: isVisible
    })
    const LIST_TOOL_MIN_SIZE = listUtils.checkIsShowDataAction(this.props) ? LIST_TOOL_MIN_SIZE_DATA_ACTION : LIST_TOOL_MIN_SIZE_NO_DATA_ACTION
    const listWidth = widgetRect?.width || 620
    if (listWidth < LIST_TOOL_MIN_SIZE) {
      clearTimeout(this.showPopperTimeOut)
      this.showPopperTimeOut = setTimeout(() => {
        this.setState({
          isOpenTopToolsPopper: true
        })
      })
    }
  }

  getPageSize = () => {
    const { widgetRect } = this.state
    const { config } = this.props
    const showBottomTool = listUtils.showBottomTools(this.props, this.state)
    const bottomToolH = listUtils.getBottomToolH(
      this.paginatorDiv.current,
      showBottomTool
    )
    const showTopTools = listUtils.showTopTools(this.props)
    const listHeight =
      listUtils.getListHeight(widgetRect, bottomToolH, showTopTools) || 1
    const columnCount = config?.layoutType === ListLayoutType.GRID ? this.getItemColumnCount() : null
    const recordSizePerPage = Math.max(
      listUtils.getPageSize(widgetRect, listHeight, this.props, columnCount),
      1
    )
    return recordSizePerPage
  }

  handleRefreshList = (ds: FeatureLayerDataSource) => {
    const { id } = this.props
    ds.load(this.queryOptions, { widgetId: id, refresh: true })
  }

  getClassNameOfTopRightToolsCon = (): string => {
    const { widgetRect } = this.state
    const listWidth = (widgetRect && widgetRect.width) || LIST_CARD_MIN_SIZE
    if (listWidth > 580) {
      return 'top-right-tools-size-3'
    } else if (listWidth > 480) {
      return 'top-right-tools-size-2'
    } else if (listWidth > 355) {
      return 'top-right-tools-size-1'
    } else {
      return 'top-right-tools-size-0'
    }
  }

  renderTopRightTools = (ds: DataSource, queryStatus?: DataSourceStatus) => {
    const { showSelectionOnly, currentFilter, filterApplied, sortOptionName, showSortString } = this.state
    const { config, theme, id, appMode, dispatch } = this.props
    const selectedRecords = ds && ds.getSelectedRecords()
    const hasSelection = selectedRecords && selectedRecords.length > 0
    return (
      <div
        className={classNames('d-flex align-items-center mr-1', this.getClassNameOfTopRightToolsCon())}
        ref={this.listTopRightToolsDiv}
      >
        {listUtils.showSort(this.props) && (
          <SortSelect
            sortOptionName={sortOptionName}
            datasource={ds}
            sorts={config.sorts}
            handleSortOptionChange={this.handleSortOptionChange}
            dispatch={dispatch}
            id={id}
            showSortString={showSortString}
          />
        )}
        {listUtils.showFilter(this.props) && (
          <FilterPicker
            filter={currentFilter || config.filter}
            filterInConfig={config.filter}
            appMode={appMode}
            applied={filterApplied}
            title={this.formatMessage('filter')}
            selectedDs={this.state.datasource}
            handleFilterChange={this.handleFilterChange}
            handleFilterApplyChange={this.handleFilterApplyChange}
            formatMessage={this.formatMessage}
            theme={theme}
            widgetId={id}
          />
        )}
        {
          config?.showRefresh && <Button
            type='tertiary'
            title={this.formatMessage('refresh')}
            icon
            size='sm'
            onClick={() => { this.handleRefreshList(ds as FeatureLayerDataSource) }}
          >
            <RefreshOutlined size={16}/>
          </Button>
        }
        {listUtils.showDisplaySelectedOnly(this.props) && (
          <Button
            disabled={!hasSelection}
            type='tertiary'
            title={
              showSelectionOnly
                ? this.formatMessage('showAll')
                : this.formatMessage('showSelection')
            }
            icon
            size='sm'
            onClick={this.handleShowSelectionClick}
          >
            {showSelectionOnly ? <MenuOutlined size={16}/> : <ShowSelectionOutlined size={16}/>}
          </Button>
        )}
        {listUtils.showClearSelected(this.props) && (
          <Button
            disabled={!hasSelection}
            type='tertiary'
            title={this.formatMessage('clearSelection')}
            icon
            size='sm'
            onClick={this.handleClearSelectionClick}
          >
            <ClearSelectionGeneralOutlined size={16}/>
          </Button>
        )}
      </div>
    )
  }

  getListSize = () => {
    const { widgetRect } = this.state
    const showTopTools = listUtils.showTopTools(this.props)
    //get list tool`s show status
    const showBottomTool = listUtils.showBottomTools(this.props, this.state)
    //get list bottom tool`s height
    const bottomToolH = listUtils.getBottomToolH(this.paginatorDiv.current, showBottomTool)
    //get list size
    const listHeight = listUtils.getListHeight(widgetRect, bottomToolH, showTopTools) || 1
    const listWidth = (widgetRect && widgetRect.width) || LIST_CARD_MIN_SIZE
    return {
      width: listWidth,
      height: listHeight
    }
  }

  renderList = (ds?: QueriableDataSource, dsInfo?: IMDataSourceInfo) => {
    const { widgetRect, isMount, currentCardSize } = this.state
    const { config, isRTL } = this.props
    const queryStatus = dsInfo?.status
    this.queryStatus = queryStatus
    this.isHasRenderList = true

    if (!isMount || !this.hasGetListSizeByResizeDetector) {
      return false
    }

    //get total count
    if (queryStatus === DataSourceStatus.Unloaded) {
      ds = undefined
    }
    this.getDsTotalCount(ds, queryStatus)
    this.checkIsLastPageWithQueryStatus(ds, queryStatus)

    //get loading status
    const showLoading = this.getLoadingStatus(ds, queryStatus)

    const interval = ds?.getAutoRefreshInterval() || 0
    //toggle auto refresh loading status
    this.toggleAutoRefreshLoading(ds, showLoading)

    //get list tool`s show status
    const showBottomTool = listUtils.showBottomTools(this.props, this.state)
    const showTopTools = listUtils.showTopTools(this.props)

    //get list bottom tool`s height
    const bottomToolH = listUtils.getBottomToolH(this.paginatorDiv.current, showBottomTool)

    //get list size
    const listHeight = listUtils.getListHeight(widgetRect, bottomToolH, showTopTools) || 1
    const listWidth = (widgetRect && widgetRect.width) || LIST_CARD_MIN_SIZE

    const overscanCount = this.getOverscanCount(listHeight)

    // get new records
    const selectRecords = this.getDsSelectRecords(ds)
    const records = this.getDsRecords(ds, showLoading, listHeight)

    const isShowListMask = this.checkIsShowListMask(showLoading, records)

    this.isFirstLoad = false

    // when record.length == 0, should reset show selection button status in list top tools
    if (records.length === 0) {
      // this.scrollToIndex(0, 'start');
      this.resetShowSelectionStatus()
    }

    this.getListInnerElementType()

    const listStyles = this.getListStyle()
    return (
      <div
        data-testid='listContainer'
        className='list-container animation'
        css={listStyles}
        onKeyDown={this.handleListKeyDown}
      >
        {/* render top tool */}
        {showTopTools && this.renderListTopTools(ds, queryStatus, selectRecords, isShowListMask)}

        {/* render Grid list */}
        {(config?.layoutType === ListLayoutType.GRID) &&
          <Grid
            className={classNames('widget-list-list', { 'hide-list': !records || records?.length === 0 })}
            ref={this.listRef}
            useIsScrolling
            outerRef={this.setListOutDivRef}
            direction={isRTL ? 'rtl' : 'ltr'}
            itemCount={this.records.length}
            overscanCount={overscanCount}
            itemKey={this.gridItemIndex}
            columnCount={this.getItemColumnCount()}
            columnWidth={index => this.columnWidth(index, currentCardSize.width, config?.horizontalSpace)}
            rowCount={this.getItemRowCount()}
            rowHeight={index => this.rowHeight(index, currentCardSize.height, config?.verticalSpace)}
            width={listWidth}
            height={listHeight}
            onItemsRendered={this.onItemsRendered}
            itemData={this.getItemsByRecords(this.records)}
            innerElementType={this.innerElementType}
            onScroll={this.handleListScroll}
            role='listbox'
          >
            {this.itemRender}
          </Grid>}
          {/* render Row/column list */}
          {(config?.layoutType !== ListLayoutType.GRID) && <List
            className={classNames('widget-list-list', { 'hide-list': !records || records?.length === 0 })}
            ref={this.listRef}
            useIsScrolling
            outerRef={this.setListOutDivRef}
            direction={isRTL ? 'rtl' : 'ltr'}
            role='listbox'
            layout={
              config.layoutType === ListLayoutType.Column
                ? 'horizontal'
                : 'vertical'
            }
            itemCount={this.records.length}
            overscanCount={overscanCount}
            itemKey={this.itemKey}
            width={listWidth}
            height={listHeight}
            onItemsRendered={this.onItemsRendered}
            itemData={this.getItemsByRecords(this.records)}
            innerElementType={this.innerElementType}
            itemSize={this.itemSize}
            onScroll={this.handleListScroll}
          >
            {this.itemRender}
          </List>
        }

        {/* mask tip and loading */}
        {isShowListMask && (
          <div className='editing-mask-con'>
            <div className='editing-mask-list' />
            {config?.layoutType === ListLayoutType.GRID && <div className='editing-mask-list-grid' />}
          </div>
        )}

        {/* render bottom tools */}
        {showBottomTool && this.renderBottomTools(showLoading)}

        {this.renderEmptyElement(showLoading)}

        {/* render not ready tips */}
        {queryStatus === DataSourceStatus.NotReady && this.renderNotReadyTips(ds)}

        {/* render loading */}
        {(showLoading || interval > 0) && this.renderLoading(showLoading, interval)}

        {/* render data count */}
        {config.showRecordCount && this.renderDataCount(ds, queryStatus)}

        <div id='describeByMessage' className='sr-only'>{this.formatMessage('describeMessage')}</div>
        <div className='sr-only' tabIndex={0} ref={ref => { this.jumpOutNodeOfList = ref }}></div>
      </div>
    )
  }

  renderDataCount = (ds: QueriableDataSource, queryStatus: DataSourceStatus) => {
    const { widgetRect } = this.state
    const listWidth = widgetRect?.width || 620
    const isSizeSmall = listWidth < LIST_AUTO_REFRESH_INFO_SWITCH_SIZE
    const countMaxWidth = isSizeSmall ? listWidth - 36 : listWidth / 2
    const dataTotal = queryStatus === DataSourceStatus.NotReady ? 0 : ds?.count
    const selected = queryStatus === DataSourceStatus.NotReady ? 0 : ds?.getSelectedRecords()?.length
    return (
      <div ref='countContainer' className='position-absolute data-count d-flex align-items-center' style={{ maxWidth: countMaxWidth }}>
        <div className='flex-grow-1 total-count-text text-truncate' title={this.formatMessage('dataCount', { total: dataTotal, selected: selected })}>
          {this.formatMessage('dataCount', { total: dataTotal, selected: selected })}
        </div>
      </div>
    )
  }

  handleListKeyDown = (e) => {
    if (e.key === 'Escape') {
      this.jumpOutNodeOfList.focus()
    }
  }

  renderEmptyElement = (showLoading: boolean) => {
    const isNoData = !this.records || this.records.length < 1
    const noDataMessage = this.props.config?.noDataMessage || this.formatMessage('noData')
    // const isShowClearActionButton = isNoData && this.isHasPublishMessageAction
    return (!showLoading && isNoData) && (
      <div className='empty-con text-center'>
        <WarningOutlined size={16}/>
        <div className="discribtion">{noDataMessage}</div>
        {/* {isShowClearActionButton && <Button
          className="clear-message-action-button"
          size='sm'
          title={this.formatMessage('reset')}
          onClick={this.clearMessageAction}
        >
          {this.formatMessage('reset')}
        </Button>} */}
      </div>
    )
  }

  clearMessageAction = () => {
    const { datasource } = this.state
    this.handleClearSelectionClick()
    datasource && MessageManager.getInstance().publishMessage(new DataRecordsSelectionChangeMessage(this.props.id, [], [datasource.id]))
  }

  renderLoading = (showLoading: boolean, interval: number) => {
    const { autoRefreshLoadingString, widgetRect } = this.state
    const { config } = this.props
    let isShowAutoRefresh = config?.isShowAutoRefresh
    if (typeof (isShowAutoRefresh) !== 'boolean') {
      isShowAutoRefresh = true
    }

    const listWidth = widgetRect?.width || 620
    const isShowTooltip = listWidth < LIST_AUTO_REFRESH_INFO_SWITCH_SIZE

    return (
      <div
        className={classNames(
          'position-absolute refresh-loading-con d-flex align-items-center',
          this.getRefreshLoadingClass()
        )}
      >
        {showLoading && <div className='loading-con' />}
        {(interval > 0 && isShowAutoRefresh) && (
          <div className='flex-grow-1 auto-refresh-loading'>
            {isShowTooltip && <Tooltip title={autoRefreshLoadingString} placement='top'>
              <Button className='list-auto-refresh-button' type='tertiary' aria-label={autoRefreshLoadingString}>
                <InfoOutlined />
              </Button>
            </Tooltip>}
            {!isShowTooltip && <div className='auto-refresh-string-con'>{autoRefreshLoadingString}</div>}
          </div>
        )}
      </div>
    )
  }

  renderNotReadyTips = (ds?: QueriableDataSource) => {
    const dataSourceLabel = ds?.getLabel()
    const outputDsWidgetId = appConfigUtils?.getWidgetIdByOutputDataSource(this.props?.useDataSources?.[0])
    const appConfig = getAppStore().getState()?.appConfig
    const widgetLabel = appConfig?.widgets?.[outputDsWidgetId]?.label

    return (
      <div className='placeholder-alert-con'>
        <Alert
          form='tooltip'
          size='small'
          type='warning'
          text={this.formatMessage('outputDataIsNotGenerated', { outputDsLabel: dataSourceLabel, sourceWidgetName: widgetLabel })}
        />
      </div>
    )
  }

  checkAndResetPage = () => {
    const { datasource } = this.state
    if (this.maxPageForHidePageTotal < 2) return
    const isLastPage = this.checkIsLastPage(datasource as any, this.maxPageForHidePageTotal, this.pageSize)
    const preMaxPage = this.maxPageForHidePageTotal - 1
    const preMaxPageLastPage = this.checkIsLastPage(datasource as any, preMaxPage, this.pageSize)
    if (isLastPage && preMaxPageLastPage) {
      this.resetPage()
    }
  }

  renderBottomTools = (showLoading: boolean) => {
    const { scrollStatus, isScrollEnd, datasource } = this.state
    const { config, isRTL } = this.props
    this.checkAndResetPage()
    const currentPageIsLastPage = this.checkIsLastPage(datasource as any, this.maxPageForHidePageTotal, this.pageSize)
    const isLastPage = currentPageIsLastPage || this.checkIsLastPage(datasource as any, this.maxPageForHidePageTotal + 1, this.pageSize)

    let totalPage
    if (config?.hidePageTotal as any === false) {
      totalPage = this.getTotalPage()
    } else {
      totalPage = currentPageIsLastPage ? this.maxPageForHidePageTotal : this.maxPageForHidePageTotal + 1
    }

    return (
      <div ref={this.paginatorDiv}>
        <ListBottomTools
          isLastPage={isLastPage}
          isRTL={isRTL}
          totalPage={totalPage}
          currentPage={this._getCurrentPage()}
          isEditing={this.isEditing()}
          isScrollEnd={isScrollEnd}
          pageStyle={config.pageStyle}
          layoutType={config?.layoutType}
          scrollStatus={scrollStatus}
          handleScrollUp={this.handleScrollUp}
          handleScrollDown={this.handleScrollDown}
          handleSwitchPage={this.handleSwitchPage}
          formatMessage={this.formatMessage}
          showLoading={showLoading}
          hidePageTotal={config?.hidePageTotal}
        />
      </div>
    )
  }

  getDsTotalCount = (ds?: QueriableDataSource, queryStatus?: DataSourceStatus) => {
    const { config } = this.props
    const isQueryCount = this.checkIsQueryCount(config)
    if (!isQueryCount) return
    const count = ds?.count
    this.queryStatus = queryStatus

    // total count
    if (queryStatus === DataSourceStatus.Loaded && count !== null) {
      if (this.totalCount !== count) {
        this.setPageTimeout = setTimeout(() => {
          this.resetPage()
        }, 1)
      }
      const preCount = this.totalCount
      this.totalCount = count
      if (preCount !== this.totalCount) {
        this.loadNextPageWhenListSizeOrTotalCountChange()
      }
    }
  }

  checkIsLastPage = (ds: QueriableDataSource, page: number, pageSize: number) => {
    if (!page || !pageSize || !ds) return false
    const haveMorePages = ds?.haveMorePages(page, pageSize)
    const isLastPage = !haveMorePages
    let isCurrentPageLastPage = false
    if (haveMorePages === 'unknown') {
      const count = ds?.count
      isCurrentPageLastPage = this.records?.length >= count
    } else {
      isCurrentPageLastPage = isLastPage
    }
    return isCurrentPageLastPage
  }

  checkIsLastPageWithQueryStatus = (ds?: QueriableDataSource, queryStatus?: DataSourceStatus) => {
    if (queryStatus === DataSourceStatus.Loaded && queryStatus) {
      const { page } = this.state
      this.isCurrentPageLastPage = this.checkIsLastPage(ds, page, this.pageSize)
      if (page > this.maxPageForHidePageTotal) {
        this.maxPageForHidePageTotal = page
      }
    }
  }

  loadNextPageWhenListSizeOrTotalCountChange = () => {
    const { config } = this.props
    if (config.pageStyle === PageStyle.Scroll) {
      //When the list is initialized for the first time, this.totalCount cannot be obtained in the intersectionObserverCallback method,
      //so when the totalCount changes, you need to manually trigger the intersectionObserverCallback.
      //https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/17865
      clearTimeout(this.loadMoreDataTimeout)
      this.loadMoreDataTimeout = setTimeout(() => {
        if (this.isScrollEnd) {
          this.isHasScrolled = true
          this.intersectionObserverCallback(true)
        }
      }, 500)
    }
  }

  getLoadingStatus = (ds?: QueriableDataSource, queryStatus?: DataSourceStatus) => {
    const { LayoutEntry } = this.state
    const { showLoading: mustLoading } = this.props

    // loading
    let showLoading = false
    if (
      mustLoading ||
      (window.jimuConfig.isInBuilder && !LayoutEntry) ||
      (ds && queryStatus === DataSourceStatus.Loading)
    ) {
      showLoading = true
    }

    return showLoading
  }

  toggleAutoRefreshLoading = (ds: QueriableDataSource, showLoading: boolean) => {
    const interval = ds?.getAutoRefreshInterval() || 0
    this.resetAutoRefreshTimes(interval, showLoading)
    if (interval > 0) {
      this.setRefreshLoadingString(showLoading)
    }
  }

  setListOutDivRef = current => {
    if (!current) return
    const bottomBoundaryId = `bottomBoundary${this.props.id}`
    this.listOutDivRef = current
    this.setListDivSize()
    const bottomBoundary = document.createElement('div')
    bottomBoundary.id = bottomBoundaryId
    bottomBoundary.className = 'bottom-boundary'
    const listScrollContent = this.listOutDivRef.getElementsByTagName('div')[0]
    this.setScrollContentSize()

    listScrollContent.appendChild(bottomBoundary)
    listUtils.intersectionObserver(
      document.getElementById(bottomBoundaryId),
      this.listOutDivRef,
      this.intersectionObserverCallback
    )
  }

  getDsRecords = (ds: QueriableDataSource, showLoading: boolean, listHeight: number) => {
    const {
      showSelectionOnly,
      widgetRect
    } = this.state
    const {
      config,
      appMode
    } = this.props
    const columnCount = config?.layoutType === ListLayoutType.GRID ? this.getItemColumnCount() : null
    const recordSizePerPage = listUtils.getPageSize(
      widgetRect,
      listHeight,
      this.props,
      columnCount
    )
    const defaultRecords = this.getDefaultRecords(recordSizePerPage)
    // get new records
    let records = defaultRecords
    const selectRecords = this.getDsSelectRecords(ds)
    if (ds && config.isItemStyleConfirm) {
      const isSelectionView = ds?.dataViewId === SELECTION_DATA_VIEW_ID
      if (isSelectionView) {
        records =
          (ds &&
            (config.pageStyle === PageStyle.Scroll
              ? ds.getRecordsByPage(1, recordSizePerPage * this.state.page)
              : ds.getRecordsByPage(this.state.page, recordSizePerPage))) ||
          []
      } else {
        records =
          (ds &&
            (config.pageStyle === PageStyle.Scroll
              ? ds.getRecordsByPageWithSelection(1, recordSizePerPage * this.state.page)
              : ds.getRecordsByPageWithSelection(this.state.page, recordSizePerPage))) ||
          []
      }
      if (showSelectionOnly) {
        records = selectRecords
      }
    }
    if (
      window.jimuConfig.isInBuilder &&
      appMode === AppMode.Design &&
      !showLoading &&
      records.length < 1
    ) {
      records = defaultRecords
    }

    if (!showLoading || this.isFirstLoad) {
      // this.resetListAfterRecordChange(records)
      this.records = records
    }
    return records
  }

  resetGridListAfterRowIndex = (newRecords) => {
    if (this?.records && (this.records?.length !== newRecords?.length)) {
      let preRowNumber = this.getItemRowCount() - 1
      preRowNumber = preRowNumber > -1 ? preRowNumber : 0
      this.listRef?.current?.resetAfterIndices && this.listRef?.current?.resetAfterRowIndex(preRowNumber, true)
    }
  }

  resetListAfterRecordChange = (newRecords) => {
    //When loading again, the same records are not necessarily the same index.
    //For example, when the extent of the map changes, the record of the list changes. The original first record may
    //change to the fifth of the new records, so all can only be reset. A list guarantees an update to the list size
    if (this?.records && (this.records?.length !== newRecords?.length)) {
      if (this.listRef.current) {
        if (this.props.config?.layoutType === ListLayoutType.GRID) {
          //VariableSizeGrid caches offsets and measurements for each item for performance purposes.
          //This method clears that cached data for all items after (and including) the specified indices. It should be called whenever an items size changes.
          //https://react-window.vercel.app/#/api/VariableSizeGrid
          // this.resetGridListAfterRowIndex(newRecords)
          this.listRef?.current?.resetAfterIndices && this.listRef?.current?.resetAfterRowIndex(0, true)
        } else {
          //VariableSizeList caches offsets and measurements for each index for performance purposes.
          //This method clears that cached data for all items after (and including) the specified index. It should be called whenever a item's size changes.
          // let restStartIndex = newRecords?.length - 1
          // restStartIndex = restStartIndex < 0 ? 0 : restStartIndex
          //
          this.resetTimeout && clearTimeout(this.resetTimeout)
          this.resetTimeout = setTimeout(() => {
            this.listRef?.current?.resetAfterIndex && this.listRef?.current?.resetAfterIndex(0, false)
          }, 300)
        }
      }
    }
  }

  getDefaultRecords = (pageSize: number = 3): any[] => {
    pageSize = (pageSize && pageSize > 1) ? pageSize : 3
    const defaultRecords = []
    for (let i = 0; i < pageSize; i++) {
      defaultRecords.push(defaultRecordsItem)
    }
    return defaultRecords
  }

  getDsSelectRecords = (ds: QueriableDataSource) => {
    const {
      config
    } = this.props
    // get select records
    let selectRecords
    if (ds && config.isItemStyleConfirm) {
      selectRecords = ds.getSelectedRecords()
    }
    return selectRecords
  }

  getListInnerElementType = () => {
    const { config } = this.props
    const space = config?.layoutType === ListLayoutType.GRID ? config?.verticalSpace : config?.space
    if (this.lastSpace !== space) {
      this.lastSpace = space
      this.innerElementType = forwardRef(({ style, ...rest }, ref) => (
        <div
          ref={ref}
          style={{
            ...style,
            height: `${parseFloat(style.height) -
              (config.layoutType === ListLayoutType.Column
                ? 0
                : space)}px`,
            width: `${parseFloat(style.width) -
              (config.layoutType !== ListLayoutType.Column
                ? 0
                : space)}px`
          }}
          {...rest}
        />
      ))
    }
  }

  getListStyle = () => {
    const {
      toolsDivWidth,
      currentCardSize,
      widgetRect
    } = this.state
    const {
      config,
      appMode,
      theme,
      isHeightAuto,
      isWidthAuto
    } = this.props

    const showBottomTool = listUtils.showBottomTools(this.props, this.state)
    const bottomToolH = listUtils.getBottomToolH(
      this.paginatorDiv.current,
      showBottomTool
    )
    const showTopTools = listUtils.showTopTools(this.props)
    const listTemplateDefaultCardSize = listUtils.getCardSizeNumberInConfig(this.props, widgetRect)
    const listStyleOption = {
      pageStyle: config?.pageStyle,
      scrollBarOpen: config?.scrollBarOpen,
      direction: config?.direction,
      appMode: appMode,
      theme: theme,
      isHeightAuto: isHeightAuto,
      isWidthAuto: isWidthAuto,
      currentCardSize: currentCardSize,
      listTemplateDefaultCardSize: listTemplateDefaultCardSize,
      showTopTools: showTopTools,
      bottomToolH: bottomToolH,
      topRightToolW: toolsDivWidth,
      hasRecords: (this.records?.length ?? 0) > 0,
      mexSize: this.getListMaxSize(),
      layoutType: config?.layoutType,
      listLeftPadding: this.getListContentLeftPadding()
    }
    return listStyle(listStyleOption)
  }

  checkIsShowListMask = (showLoading: boolean, records: DataRecord[]) => {
    const { appMode } = this.props
    const { isInBuilder } = window.jimuConfig
    const isEditing = this.isEditing()
    const isNoData = !records || records.length < 1
    const isDataLoadedAndHasData = !(!showLoading && isNoData)
    return isInBuilder && isEditing && isDataLoadedAndHasData && appMode === AppMode.Design
  }

  getOverscanCount = (listHeight) => {
    const { widgetRect } = this.state
    const { appMode, config } = this.props
    const columnCount = config?.layoutType === ListLayoutType.GRID ? this.getItemColumnCount() : null
    const recordSizePerPage = listUtils.getPageSize(
      widgetRect,
      listHeight,
      this.props,
      columnCount
    )
    const overscanCount =
      window.jimuConfig.isInBuilder && appMode === AppMode.Design
        ? 0
        : recordSizePerPage
    return overscanCount
  }

  setScrollContentSize = () => {
    if (!this.listOutDivRef) return
    const { layoutType } = this.props?.config
    const listScrollContent = this.listOutDivRef.getElementsByTagName('div')[0]

    if (layoutType === ListLayoutType.Column) {
      listScrollContent.style.height = '100%'
    } else {
      listScrollContent.style.width = '100%'
    }
  }

  intersectionObserverCallback = (isScrollEnd: boolean) => {
    const { appMode, config } = this.props
    const listDiv = this.listOutDivRef
    const { datasource } = this.state
    this.setState({
      isScrollEnd: isScrollEnd
    })
    this.isScrollEnd = isScrollEnd
    if (!listDiv || (this.records?.length ?? 0) < 1) return
    if (
      config.pageStyle === PageStyle.Scroll &&
      this.queryStatus !== DataSourceStatus.Loading &&
      datasource &&
      (!window.jimuConfig.isInBuilder ||
        (appMode !== AppMode.Design && isScrollEnd)) &&
      this.isHasScrolled
    ) {
      if (!this.isCurrentPageLastPage) {
        this.setState({
          page: this.state.page + 1
        })
        this.isSwitchPage = true
      } else {
        if (isScrollEnd) {
          this.setState({
            scrollStatus: 'end'
          })
        }
      }
    }
  }

  setListDivSize = () => {
    const listDiv = this.listOutDivRef
    const clientWidth = listDiv?.clientWidth || null
    const clientHeight = listDiv?.clientHeight || null
    const toolsDivWidth = this.listTopRightToolsDiv.current?.clientWidth || 0
    const listDivBoundRect = listDiv?.getBoundingClientRect() || null
    const listDivSize = {
      clientWidth: clientWidth,
      clientHeight: clientHeight
    }
    this.setState({
      listDivSize: listDivSize,
      toolsDivWidth: toolsDivWidth,
      listDivBoundRect: listDivBoundRect
    })
  }

  getContentLayout = () => {
    const { layoutId, browserSizeMode } = this.props
    const appConfig = getAppStore().getState().appConfig
    const contentWidgetId = searchUtils.getWidgetIdThatUseTheLayoutId(
      appConfig,
      layoutId
    )
    const contentLayoutsInfo = searchUtils.getContentLayoutInfosInOneSizeMode(
      appConfig,
      contentWidgetId,
      LayoutItemType.Widget,
      browserSizeMode
    )
    return contentLayoutsInfo
  }

  getContentLayoutSetting = () => {
    const appConfig = getAppStore().getState().appConfig
    const { layouts } = appConfig
    const contentLayoutsInfo = this.getContentLayout()
    const contentLayoutId = contentLayoutsInfo?.[0]?.layoutId
    const contentLayoutItemId = contentLayoutsInfo?.[0]?.layoutItemId
    const setting =
      layouts?.[contentLayoutId]?.content?.[contentLayoutItemId]?.setting
    return setting
  }

  getListMaxSize = () => {
    const { boundingBox, heightLayoutItemSizeModes, layoutId, appMode, pageMode } = this.props
    const isListHeightCustom = heightLayoutItemSizeModes === LayoutItemSizeModes.Custom && boundingBox?.height
    const setting = this.getContentLayoutSetting()
    const isContentWidthAuto =
      setting?.autoProps?.width === 'auto' || setting?.widthMode === 'auto'
    const isContentHeightAuto =
      setting?.autoProps?.height === 'auto' || setting?.heightMode === 'auto' || !setting
    // const isUse600 = (pageMode === PageMode.AutoScroll && (isContentHeightAuto || !setting?.autoProps?.width))
    const DESIGN_SIZE = (pageMode === PageMode.AutoScroll && isContentHeightAuto) ? 600 : this.bodySize.clientHeight
    const bodyHeight = appMode === AppMode.Design ? DESIGN_SIZE : this.bodySize.clientHeight
    const maxHeight = isListHeightCustom ? boundingBox?.height : bodyHeight
    const isListHeightCustomUnitPX = isListHeightCustom && !(boundingBox?.height?.includes && boundingBox?.height?.includes('%'))
    let maxSize = Immutable({
      maxWidth: this.bodySize.scrollWidth,
      maxHeight: maxHeight,
      maxSizeIsBodySize: false
    })
    const appConfig = getAppStore().getState().appConfig
    const { layouts } = appConfig
    const type = layouts[layoutId]?.type
    if (type === LayoutType.ColumnLayout && isContentWidthAuto) {
      maxSize = maxSize.set('maxWidth', this.bodySize.clientWidth).set('maxSizeIsBodySize', true)
    }
    if ((type as any) === 'ROW' && isContentHeightAuto && !isListHeightCustomUnitPX) {
      const maxHeight = appMode === AppMode.Design ? DESIGN_SIZE : this.bodySize.clientHeight
      const maxSizeIsBodySize = appMode !== AppMode.Design
      maxSize = maxSize.set('maxHeight', maxHeight).set('maxSizeIsBodySize', maxSizeIsBodySize)
    }
    maxSize = maxSize.set('maxHeight', this.initElementSize(maxSize.maxHeight))
    maxSize = maxSize.set('maxWidth', this.initElementSize(maxSize.maxWidth))
    return maxSize
  }

  initElementSize = (size) => {
    if (Number(size)) {
      return `${size}px`
    } else if (typeof (size) === 'string') {
      if (size?.includes('px') || size?.includes('rem')) {
        return size
      } else if (size?.includes('%')) {
        return '100%'
      }
    } else {
      return size
    }
  }

  getRefreshLoadingClass = () => {
    const { config, appMode } = this.props
    const { scrollBarOpen, layoutType } = config
    const isEditor = window.jimuConfig.isInBuilder && appMode === AppMode.Design
    if (!scrollBarOpen || isEditor) {
      return ''
    }
    if (layoutType === ListLayoutType.Column) {
      return 'horizon-loading'
    } else {
      return 'vertical-loading'
    }
  }

  resetAutoRefreshTimes = (interval: number, showLoading = false) => {
    clearTimeout(this.resetAutoRefreshTime)
    if (interval <= 0) {
      clearInterval(this.autoRefreshLoadingTime)
    }

    this.resetAutoRefreshTime = setTimeout(() => {
      if (showLoading && interval > 0) {
        this.setState({
          autoRefreshLoadingString: this.formatMessage('lastUpdateAFewTime')
        })
      }
      this.setState({
        showLoading: showLoading
      })
    }, 0)
  }

  setRefreshLoadingString = (showLoading = false) => {
    if (!showLoading) {
      return false
    }

    let time = 0
    clearInterval(this.autoRefreshLoadingTime)

    this.autoRefreshLoadingTime = setInterval(() => {
      time++

      this.setState({
        autoRefreshLoadingString: this.getLoadingString(time)
      })
    }, 60000)
  }

  getLoadingString = (time: number): string => {
    let loadingString = this.formatMessage('lastUpdateAFewTime')
    if (time > 1 && time <= 2) {
      loadingString = this.formatMessage('lastUpdateAMinute')
    } else if (time > 2) {
      loadingString = this.formatMessage('lastUpdateTime', { updateTime: time })
    }
    return loadingString
  }

  onItemsRendered = ({
    overscanStartIndex,
    overscanStopIndex,
    visibleStartIndex,
    visibleStopIndex,
    visibleColumnStartIndex,
    visibleColumnStopIndex,
    visibleRowStartIndex,
    visibleRowStopIndex
  }) => {
    const { config } = this.props
    // All index params are numbers.
    this.listVisibleStartIndex = config?.layoutType === ListLayoutType.GRID ? this.getItemIndexByRowAndColumnIndex(visibleRowStartIndex, visibleColumnStartIndex) : visibleStartIndex
    this.listVisibleStopIndex = config?.layoutType === ListLayoutType.GRID ? this.getItemIndexByRowAndColumnIndex(visibleRowStopIndex, visibleColumnStopIndex) : visibleStopIndex
    if (this.needRefreshListOnListRendered) {
      this.needRefreshListOnListRendered = false
      this.refreshList()
    }
    if (this.isSwitchPage) {
      if (config.pageStyle === PageStyle.Scroll) {
        if (this.records.length > this.listVisibleStopIndex + 1) {
          this.isSwitchPage = false
          this.onItemsRenderedTimeout = setTimeout(() => {
            this.handleScrollDown(null)
            if (this.isScrollToNextStep) {
              this.isScrollToNextStep = false
            }
          }, 500)
        }
      } else {
        this.isSwitchPage = false
      }
    }
  }

  getItemIndexByRowAndColumnIndex = (rowIndex, columnIndex) => {
    const columnCount = this.getItemColumnCount()
    return rowIndex * columnCount + columnIndex
  }

  itemSize = index => {
    const { config } = this.props
    const { currentCardSize } = this.state
    const isHorizon = config?.layoutType === ListLayoutType.Column
    const space = config?.layoutType === ListLayoutType.GRID ? config?.verticalSpace : config?.space
    const itemWidth = currentCardSize.width + space
    const itemHeight = currentCardSize.height + space
    const size = isHorizon ? itemWidth : itemHeight
    return size
  }

  columnWidth = (index: number, cardWidth: number, space: number = 0): number => {
    return cardWidth + space
  }

  rowHeight = (rowIndex: number, cardHeight: number, space: number = 0): number => {
    return cardHeight + space
  }

  getItemsByRecords = records => {
    const {
      config,
      selectionIsInSelf,
      selectionIsSelf,
      builderStatus
    } = this.props
    const { datasource, hoverIndex } = this.state
    const selectedRecordIds = (!datasource || !config.isItemStyleConfirm
      ? []
      : datasource.getSelectedRecordIds()
    ).map(v => v + '')

    return (
      records &&
      records.map((record, index) => {
        const editProps = {
          hideCardTool: this.state.hideCardTool,
          selectionIsList: selectionIsSelf,
          selectionIsInList: selectionIsInSelf,
          isEditing: this.isEditing(),
          builderStatus: builderStatus,
          lockItemRatio: config.lockItemRatio,
          changeIsResizingCard: this.changeIsResizingCard
        }
        return {
          index,
          isHover: hoverIndex === index,
          record: config.isItemStyleConfirm ? record : undefined,
          active:
            !record.fake &&
            config.isItemStyleConfirm &&
            datasource &&
            selectedRecordIds.includes(record.getId()),
          ...this.getOtherProps(),
          ...editProps
        }
      })
    )
  }

  getOtherProps = () => {
    const {
      config,
      theme,
      id,
      appMode,
      builderSupportModules,
      layouts,
      browserSizeMode,
      dispatch,
      isRTL
    } = this.props
    const { datasource } = this.state
    const isWidthPercentage = listUtils.getCardSizeWidthUnitInConfig(this.props)?.width?.unit === DistanceUnits.PERCENTAGE
    return {
      browserSizeMode: browserSizeMode,
      space: config.space,
      isRTL: isRTL,
      builderSupportModules: builderSupportModules,
      formatMessage: this.formatMessage,
      dispatch: dispatch,
      widgetId: id,
      interact:
        window.jimuConfig.isInBuilder &&
        builderSupportModules.widgetModules.interact,
      selectCard: this.selectCard,
      handleResizeCard: this.handleResizeCard,
      appMode: appMode,
      onChange: this.handleItemChange,
      hoverLayoutOpen: config.cardConfigs[Status.Hover].enable,
      selectable:
        config.cardConfigs[Status.Selected].selectionMode !==
        SelectionModeType.None,
      direction: config.direction,
      theme: theme,
      LayoutEntry: this.state.LayoutEntry,
      layouts: layouts,
      layoutType: config?.layoutType,
      keepAspectRatio: config?.keepAspectRatio,
      gridItemSizeRatio: config?.gridItemSizeRatio,
      cardConfigs: config.cardConfigs,
      datasourceId: datasource && datasource.id,
      updateCardToolPosition: this.updateCardToolPosition,
      isWidthPercentage: isWidthPercentage,
      horizontalSpace: config?.horizontalSpace
    }
  }

  itemRender = props => {
    const { appMode, config } = this.props
    let style = props.style
    const columnIndex = props?.columnIndex || 0
    const rowIndex = props?.rowIndex || 0
    const rowCount = this.getItemRowCount()
    const columnCount = this.getItemColumnCount()
    const index = config?.layoutType === ListLayoutType.GRID ? this.getItemIndexByRowAndColumnIndex(rowIndex, columnIndex) : props.index
    const items = props.data
    const recordLength = this.records?.length || 0
    const isLastItem = recordLength - 1 === index
    let listItemStyle
    switch (config?.layoutType) {
      case ListLayoutType.Column:
        listItemStyle = {
          width: `${parseFloat(style.width) - config.space}px`,
          height: '100%'
        }
        break
      case ListLayoutType.Row:
        listItemStyle = {
          width: '100%',
          height: `${parseFloat(style.height) - config.space}px`
        }
        break
      case ListLayoutType.GRID:
        listItemStyle = {
          height: `${parseFloat(style.height) - config?.verticalSpace}px`,
          width: `${parseFloat(style?.width) - config?.horizontalSpace}px`
        }
        break
    }

    //The size of list item content
    switch (config?.layoutType) {
      case ListLayoutType.Column:
        style = {
          ...style,
          width: isLastItem ? `${parseFloat(style.width) - config.space}px` : `${parseFloat(style.width)}px`
        }
        break
      case ListLayoutType.Row:
        style = {
          ...style,
          height: isLastItem ? `${parseFloat(style.height) - config.space}px` : `${parseFloat(style.height)}px`
        }
        break
      case ListLayoutType.GRID:
        style = {
          ...style,
          height: rowCount === (rowIndex + 1) ? `${parseFloat(style.height) - config?.verticalSpace}px` : `${parseFloat(style.height)}px`,
          width: columnCount === (columnIndex + 1) ? `${parseFloat(style?.width) - config?.horizontalSpace}px` : `${parseFloat(style?.width)}px`
        }
        break
    }
    const isEditor = index === 0 && window.jimuConfig.isInBuilder && appMode === AppMode.Design
    const ListCard = isEditor ? ListCardEditor : ListCardViewer
    if (items?.length < index + 1) return null
    return (
      <div style={style}>
        <ListCard
          listStyle={listItemStyle}
          widgetId={this.props.id}
          {...items[index]}
          handleListMouseMove={this.handleListMouseMove}
          handleListMouseLeave={this.handleListMouseLeave}
          itemIdex={index} />
      </div>
    )
  }

  itemKey = index => {
    const item = this.records[index]
    return `${(item?.getId && item?.getId()) || index}`
  }

  gridItemIndex = indexOption => {
    const { columnIndex, rowIndex } = indexOption
    const index = this.getItemIndexByRowAndColumnIndex(rowIndex, columnIndex)
    const item = this.records[index]
    return `${(item?.getId && item?.getId()) || index + 100}`
  }

  getItemColumnCount = () => {
    const { widgetRect, currentCardSize } = this.state
    const { config } = this.props
    let listWidth = (widgetRect && widgetRect.width) || LIST_CARD_MIN_SIZE
    listWidth = listWidth - SCROLL_BAR_WIDTH
    const cardWidth = currentCardSize.width + config?.horizontalSpace
    //The actual width of the last column is currentCardSize.width
    //'listWidth-4' is for the width of the scroll bar
    //The space in the last column should be removed
    return Math.floor((listWidth - currentCardSize.width) / cardWidth + 1) || 1
    // return Math.floor((listWidth + config?.horizontalSpace) / (currentCardSize.width + config?.horizontalSpace)) || 1
  }

  getItemRowCount = () => {
    return Math.ceil(this.records.length / this.getItemColumnCount()) || 1
  }

  getListContentLeftPadding = () => {
    const { widgetRect, currentCardSize } = this.state
    const { config } = this.props
    const listWidth = (widgetRect && widgetRect.width) || LIST_CARD_MIN_SIZE
    const rowWidth = this.getItemColumnCount() * (currentCardSize.width + config?.horizontalSpace) - config?.horizontalSpace
    let padding
    switch (config?.gridAlignment) {
      case TextAlignValue.LEFT:
        padding = 0
        break
      case TextAlignValue.RIGHT:
        padding = listWidth - rowWidth - SCROLL_BAR_WIDTH
        break
      default:
        padding = (listWidth - rowWidth - SCROLL_BAR_WIDTH) / 2
        break
    }
    if (config?.layoutType === ListLayoutType.GRID) {
      return padding > 0 ? padding : 0
    } else {
      return 0
    }
  }

  onCreateDataSourceFailed = (err) => {
    this.setState({
      createDataSourceFailed: true
    })
  }

  renderWidgetPlaceholder = (): React.ReactElement => {
    return <WidgetPlaceholder icon={widgetPrintOutlined} widgetId={this.props.id} message={''} />
  }

  onListContainerMouseMove = () => {
    if (this.needAutoScrollToSelectedItemWhenLoadPage && this.records) {
      this.needAutoScrollToSelectedItemWhenLoadPage = false
    }
  }

  changeIsCanClickLink = (): boolean => {
    return this.canClickLink
  }

  onDataSourceInfoChange = (info: IMDataSourceInfo, preInfo?: IMDataSourceInfo) => {
    const { config, activeSort } = this.props
    if (!config?.sortOpen || activeSort || typeof activeSort !== 'boolean') return

    const orderByFields = this.getOrderByFields(info)
    const preyOrderByFields = this.getOrderByFields(preInfo)
    if (!this.checkIsOrderByFieldsChange(orderByFields, preyOrderByFields)) return

    const newOrderByFields = orderByFields.filter(item => !preyOrderByFields.includes(item))

    const currentSort = config.sorts.map(sort => {
      const orderByFieldsItem = getOrderByFields(config.sorts, true, sort.ruleOptionName, true)[0]
      return {
        ruleOptionName: sort.ruleOptionName,
        orderByFieldsItem: orderByFieldsItem
      }
    })
    const newOrderByFieldsOfCurrentWidget = currentSort.filter(sort => {
      return newOrderByFields.includes(sort.orderByFieldsItem)
    })

    if (newOrderByFieldsOfCurrentWidget?.length > 0) {
      this.setState({
        sortOptionName: newOrderByFieldsOfCurrentWidget[0].ruleOptionName,
        showSortString: false
      })
    } else {
      this.setState({
        sortOptionName: null,
        showSortString: true
      })
    }
  }

  checkIsOrderByFieldsChange = (orderByFields = [], preyOrderByFields = []) => {
    return JSON.stringify(orderByFields) !== JSON.stringify(preyOrderByFields)
  }

  getOrderByFields = (info: IMDataSourceInfo): string[] => {
    if (!info) return []
    let orderByFields = []
    for (const id in info?.widgetQueries) {
      const orderByFieldsOfWidget = (info.widgetQueries[id] as any)?.orderByFields || []
      orderByFields = orderByFields.concat(orderByFieldsOfWidget)
    }
    return Array.from(new Set(orderByFields))
  }

  onDsSelectionChange = (selection) => {
    const { datasource } = this.state
    datasource && this.scrollToSelectedItems(datasource)
  }

  checkIsQueryCount = (config: IMConfig) => {
    if (config?.showRecordCount) {
      return config?.showRecordCount
    }
    if (config?.pageStyle === PageStyle.MultiPage) {
      return config?.hidePageTotal as any === false
    } else {
      return false
    }
  }

  checkIsShowMask = () => {
    const { config, appMode, browserSizeMode, selectionIsInSelf, selectionIsSelf, builderStatus, layouts } = this.props
    const { forceShowMask } = this.state
    const appConfig = getAppStore().getState().appConfig
    const isInBuilder = window.jimuConfig.isInBuilder
    const currentLayout =
      appConfig?.layouts[
        searchUtils.findLayoutId(
          Immutable(layouts[builderStatus]),
          browserSizeMode,
          appConfig.mainSizeMode
        )
      ]
    const currentLayoutType = currentLayout && currentLayout.type

    if (!isInBuilder || appMode === AppMode.Run) {
      return false
    } else {
      if (appMode === AppMode.Express) {
        return (!config.isItemStyleConfirm && currentLayoutType)
      } else {
        return forceShowMask || (!selectionIsInSelf && !selectionIsSelf) || (!config.isItemStyleConfirm && currentLayoutType)
      }
    }
  }

  render () {
    const { config, id, appMode, queryObject, selectionIsInSelf, selectionIsSelf, useDataSources, activeSort } = this.props
    const { datasource, widgetRect, page, createDataSourceFailed, sortOptionName, searchText, filterApplied, currentFilter } = this.state
    const isInBuilder = window.jimuConfig.isInBuilder
    const classes = classNames('jimu-widget', 'widget-list', 'list-widget-' + id)

    if (!config.itemStyle) {
      return (
        <WidgetPlaceholder
          widgetId={this.props.id}
          icon={require('./assets/icon.svg')}
          message={this.formatMessage('placeHolderTip')}
        />
      )
    }

    const showBottomTool = listUtils.showBottomTools(this.props, this.state)
    const bottomToolH = listUtils.getBottomToolH(this.paginatorDiv.current, showBottomTool)
    const showTopTools = listUtils.showTopTools(this.props)
    const listHeight = listUtils.getListHeight(widgetRect, bottomToolH, showTopTools)
    const columnCount = config?.layoutType === ListLayoutType.GRID ? this.getItemColumnCount() : null
    const pageSize = listUtils.getPageSize(widgetRect, listHeight, this.props, columnCount)
    this.pageSize = pageSize
    const queryPageSize = pageSize

    let query = getQueryOptions({
      sortOptionName: sortOptionName,
      searchText: searchText,
      currentFilter: currentFilter,
      filterApplied: filterApplied,
      datasource: datasource,
      config: config,
      pageSize: queryPageSize,
      useDataSources: Immutable(useDataSources),
      page: page,
      activeSort: activeSort
    })

    this.queryOptions = query

    if (
      !compareQueryOptionsExceptPaging(
        query,
        this.lastQuery,
        datasource as QueriableDataSource
      ) && datasource
    ) {
      const temp = query
      if (page !== 1) {
        query = this.lastQuery
        this.lastQuery = temp
        this.resetPage()
      } else {
        this.lastQuery = temp
      }
    }
    return (
      <div
        className={classes}
        css={getStyle(this.props, this.isEditing(), showBottomTool)}
        onPointerDown={evt => {
          isInBuilder &&
          appMode === AppMode.Design &&
          !selectionIsSelf &&
          !selectionIsInSelf &&
          this.handleListPointerDown(evt)
        }}
      >
        <div className='widget-list d-flex' onMouseMove={this.onListContainerMouseMove}>
          <LinkContainer
            widgetId={id}
            appMode={appMode}
            linkParam={config.linkParam}
            queryObject={queryObject}
            useDataSources={Immutable(useDataSources)}
            changeIsCanClickLink={this.changeIsCanClickLink}
          >
            {this.isDsConfigured()
              ? (
                <DataSourceComponent
                  query={datasource ? query : null}
                  useDataSource={Immutable(useDataSources && useDataSources[0])}
                  onDataSourceCreated={this.onDSCreated}
                  onCreateDataSourceFailed={this.onCreateDataSourceFailed}
                  widgetId={this.props.id}
                  queryCount={this.checkIsQueryCount(config)}
                  onDataSourceInfoChange={this.onDataSourceInfoChange}
                  onSelectionChange={this.onDsSelectionChange}
                >
                  {this.renderList}
                </DataSourceComponent>
                )
              : (
                  this.renderList()
                )}
            {(!this.isHasRenderList && !createDataSourceFailed) && (
              <div className='list-loading-con w-100 h-100'>
                <div className='jimu-secondary-loading'></div>
              </div>)}
            {
              createDataSourceFailed && <div className='list-error-con position-relative w-100 h-100'>
                {this.renderWidgetPlaceholder()}
                <Alert
                  className='position-absolute alert-panel-of-list'
                  type='warning'
                  withIcon
                  text={this.formatMessage('dataSourceCreateError')}
                />
              </div>
            }
          </LinkContainer>
        </div>

        {this.checkIsShowMask() && <div className='list-with-mask' />}
        <ReactResizeDetector
          handleWidth
          handleHeight
          onResize={this.debounceOnResize}
        />
      </div>
    )
  }
}

export default Widget
