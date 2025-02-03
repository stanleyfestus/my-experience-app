/** @jsx jsx */
import {
  React,
  RepeatedDataSourceProvider,
  jsx,
  css,
  type IMThemeVariables,
  AppMode,
  type LayoutInfo,
  utils,
  LayoutItemType,
  appActions,
  Immutable,
  type ImmutableArray,
  type LayoutItemConstructorProps,
  ReactRedux,
  type IMState,
  classNames
} from 'jimu-core'
import { ListGroupItem, styleUtils } from 'jimu-ui'
import {
  type CardSize,
  Status,
  SelectionModeType,
  LIST_CARD_MIN_SIZE,
  ListLayout,
  ListLayoutType,
  type IMCardConfig
} from '../../config'
import { searchUtils } from 'jimu-layouts/layout-runtime'
import { type MyDropDownItem } from './my-dropdown'
import ListCard, { type ListCardProps, type ListCardStates } from './list-card-base'

import { SyncOnOutlined } from 'jimu-icons/outlined/editor/sync-on'
import { SyncOffOutlined } from 'jimu-icons/outlined/editor/sync-off'
import { type AppConfigAction } from 'jimu-for-builder'
import { initBackgroundStyle, isItemAccept } from '../utils/utils'

const cornerSize = 12
const cornerPosition = -10
const sideSize = 16
const sidePosition = -10
const zIndexHandle = 20

interface ExtraProps {
  selection: LayoutInfo
  showBreak: boolean
  horizontalSpace?: number
  isWidthPercentage?: boolean
}

const statesPopperOffset = [0, 5]
const statesModifiers = [
  {
    name: 'flip',
    options: {
      boundary: document.body,
      fallbackPlacements: ['right-start', 'left-start', 'bottom-start', 'top-end', 'top-start']
    }
  }
]
const applyPopperModifiers = [
  {
    name: 'offset',
    options: {
      offset: [0, 10]
    }
  },
  {
    name: 'arrow',
    enabled: true
  }
]

interface ListCardEditorProps extends ListCardProps {
  builderSupportModules?: any
  isEditing?: boolean
  LayoutEntry?: any
  selectionIsList?: boolean
  selectionIsInList?: boolean
  builderStatus?: Status
  interact?: any
  dispatch?: any
  isRTL?: boolean
  lockItemRatio?: boolean
  keepAspectRatio?: boolean
  gridItemSizeRatio?: number
  hideCardTool?: boolean
  cardConfigs?: IMCardConfig
  changeIsResizingCard: (isResizing: boolean) => void
  handleResizeCard?: (
    newCardSize: CardSize,
    resizeEnd?: boolean,
    isLeft?: boolean,
    isTop?: boolean,
    isEnd?: boolean
  ) => void
  selectCard?: () => void
}

interface ListCardEditorStates extends ListCardStates {
  didMount: boolean
}

class _ListCardEditor extends ListCard<
ListCardEditorProps & ExtraProps,
ListCardEditorStates
> {
  interactable: Interact.Interactable
  resizeRef: React.RefObject<HTMLDivElement>
  lastResizeCall = null

  constructor (props) {
    super(props)

    this.state = {
      didMount: false
    }
    this.resizeRef = React.createRef()

    this.providerData = this.getNewProviderData()
  }

  shouldComponentUpdate (nextProps, nextStats) {
    let shouldUpdate = this.shouldComponentUpdateExcept(nextProps, nextStats, [
      'listStyle',
      'selection'
    ])
    shouldUpdate =
      shouldUpdate ||
      !utils.isDeepEqual(this.props.listStyle, nextProps.listStyle)
    if (!shouldUpdate) {
      const { selectionIsInList, selectionIsList } = this.props
      if (selectionIsList || selectionIsInList) {
        shouldUpdate = !utils.isDeepEqual(
          this.props.selection,
          nextProps.selection
        )
      }
    }
    return shouldUpdate
  }

  componentDidUpdate (preProps) {
    const {
      selectionIsInList,
      isEditing,
      layoutType,
      isRTL,
      lockItemRatio,
      keepAspectRatio,
      index
    } = this.props
    if (window.jimuConfig.isInBuilder && index === 0) {
      if (this.interactable) {
        if (isEditing && !selectionIsInList) {
          if (layoutType === ListLayoutType.GRID) {
            this.interactable.resizable({
              edges: {
                top: false,
                left: isRTL,
                bottom: !keepAspectRatio,
                right: !isRTL
              }
            })
            this.interactable.resizable(true)
          } else {
            if (!lockItemRatio) {
              this.interactable.resizable({
                edges: {
                  top: false,
                  left: layoutType === ListLayoutType.Column && isRTL,
                  bottom: layoutType === ListLayoutType.Row,
                  right: layoutType === ListLayoutType.Column && !isRTL
                }
              })
              this.interactable.resizable(true)
            } else {
              this.interactable.resizable(false)
            }
          }
        } else {
          this.interactable.resizable(false)
        }
      }
    }
  }

  componentDidMount () {
    const { index, layoutType, updateCardToolPosition, keepAspectRatio } = this.props
    if (
      index === 0 &&
      window.jimuConfig.isInBuilder &&
      this.resizeRef.current
    ) {
      const { interact, handleResizeCard, isRTL, lockItemRatio } = this.props
      this.interactable = interact(this.resizeRef.current).resizable({
        // resize from all edges and corners
        edges: {
          top: false,
          left: (layoutType === ListLayoutType.Column || layoutType === ListLayoutType.GRID) && isRTL,
          bottom: ((layoutType === ListLayoutType.Row && !lockItemRatio) || (layoutType === ListLayoutType.GRID && !keepAspectRatio)),
          right: ((layoutType === ListLayoutType.Column && !lockItemRatio) || layoutType === ListLayoutType.GRID) && !isRTL
        },
        modifiers: [
          // keep the edges inside the parent
          interact.modifiers.restrictEdges({
            endOnly: true
          }),

          // minimum size
          interact.modifiers.restrictSize({
            min: { width: LIST_CARD_MIN_SIZE, height: LIST_CARD_MIN_SIZE }
          })
        ],
        inertia: false,
        onstart: (event: Interact.InteractEvent) => {
          const { changeIsResizingCard } = this.props
          if (changeIsResizingCard) {
            changeIsResizingCard(true)
          }
          event.stopPropagation()
        },
        onmove: (event: Interact.ResizeEvent) => {
          event.stopPropagation()

          if (this.lastResizeCall) {
            cancelAnimationFrame(this.lastResizeCall)
          }
          const rect = event.rect
          const newCardSize = this.getNewCardSize(rect, true)
          updateCardToolPosition()
          this.lastResizeCall = requestAnimationFrame(() => {
            const edges = {} as any // event.interaction.edges;
            handleResizeCard(newCardSize, false, edges.top, edges.left)
          })
        },
        onend: (event: Interact.ResizeEvent) => {
          event.stopPropagation()
          if (this.lastResizeCall) {
            cancelAnimationFrame(this.lastResizeCall)
          }
          this.lastResizeCall = requestAnimationFrame(() => {
            const rect = event.rect
            const newCardSize = this.getNewCardSize(rect)
            handleResizeCard(newCardSize, true)
            const { changeIsResizingCard } = this.props
            if (changeIsResizingCard) {
              changeIsResizingCard(false)
            }
          })
        }
      })
    }
    this.setState({
      didMount: true
    })
  }

  getNewCardSize = (rect, isResizing: boolean = false) => {
    const { keepAspectRatio, layoutType, gridItemSizeRatio, horizontalSpace, isWidthPercentage } = this.props
    let newCardSize
    let width = rect.right - rect.left
    if (!isResizing && isWidthPercentage) {
      width = rect.right - rect.left + horizontalSpace
    }
    if (layoutType === ListLayoutType.GRID && keepAspectRatio) {
      newCardSize = {
        width: width,
        height: width * gridItemSizeRatio
      }
    } else {
      newCardSize = {
        width: width,
        height: rect.bottom - rect.top
      }
    }
    return newCardSize
  }

  componentWillUnMount () {
    if (this.lastResizeCall) {
      cancelAnimationFrame(this.lastResizeCall)
    }
    if (this.interactable) {
      this.interactable.unset()
      this.interactable = null
    }
  }

  handleItemClick = evt => {
    const { selectCard } = this.props
    if (evt) {
      evt.stopPropagation()
    }
    selectCard()
  }

  handleCopyTo = (evt, status: Status, linked: boolean) => {
    const {
      layouts,
      builderSupportModules,
      browserSizeMode,
      builderStatus,
      selection
    } = this.props
    let action: AppConfigAction = builderSupportModules.jimuForBuilderLib.getAppConfigAction()
    const selectedLayoutItem = searchUtils.findLayoutItem(action.appConfig, selection)
    if (!selectedLayoutItem) return
    let appConfig = action.appConfig
    const originLayoutId = searchUtils.findLayoutId(
      layouts[builderStatus],
      browserSizeMode,
      appConfig.mainSizeMode
    )
    const desLayoutId = searchUtils.findLayoutId(
      layouts[status],
      browserSizeMode,
      appConfig.mainSizeMode
    )

    if (!linked) {
      // no target item, duplicate one
      // create a blank layout item and set widgetId
      const service = builderSupportModules.jimuForBuilderLib.LayoutServiceProvider.getService(appConfig, desLayoutId)
      const cResult = service.createBlankItem(appConfig, desLayoutId)
      appConfig = cResult[0]
      const newItemId = cResult[1]
      const destLayoutInfo = { layoutId: desLayoutId, layoutItemId: newItemId }
      const originLayoutItem = searchUtils.findLayoutItem(appConfig, { layoutId: originLayoutId, layoutItemId: selectedLayoutItem.id })

      // add widget parent
      appConfig = builderSupportModules.jimuForBuilderLib.widgetService.addParent(appConfig, selectedLayoutItem.widgetId, destLayoutInfo, browserSizeMode)

      // sync the two layout items
      action = builderSupportModules.jimuForBuilderLib.getAppConfigAction(appConfig)
      action.editLayoutItemProperty(destLayoutInfo, 'bbox', originLayoutItem.bbox)
        .editLayoutItemProperty(destLayoutInfo, 'setting', originLayoutItem.setting)
        .editLayoutItemProperty(destLayoutInfo, 'type', originLayoutItem.type)
        .editLayoutItemProperty(destLayoutInfo, 'widgetId', originLayoutItem.widgetId)
        .adjustOrderOfItem(destLayoutInfo, -1)
    } else {
      const searchUtils = builderSupportModules.widgetModules.searchUtils
      const widgetId = selectedLayoutItem.widgetId
      const widgetJson = appConfig.widgets[widgetId]
      const parents = widgetJson.parent[browserSizeMode]
      const originLayoutInfo = parents.find(item => item.layoutId === originLayoutId)
      const destLayoutInfo = parents.find(item => item.layoutId === desLayoutId)

      const originLayoutItem = searchUtils.findLayoutItem(appConfig, originLayoutInfo)
      // sync bbox and setting
      action.editLayoutItemProperty(destLayoutInfo, 'bbox', originLayoutItem.bbox)
        .editLayoutItemProperty(destLayoutInfo, 'setting', originLayoutItem.setting)
    }

    action.exec()
    evt.stopPropagation()
    evt.nativeEvent.stopImmediatePropagation()
  }

  editStatus = (name, value) => {
    const { dispatch, widgetId } = this.props
    dispatch(appActions.widgetStatePropChange(widgetId, name, value))
  }

  handleBuilderStatusChange (evt, status) {
    this.editStatus('showCardSetting', status)
    this.editStatus('builderStatus', status)

    const { selectCard } = this.props
    selectCard()

    evt.stopPropagation()
    evt.nativeEvent.stopImmediatePropagation()
  }

  handleBreakLink = evt => {
    const {
      builderSupportModules,
      browserSizeMode,
      selection,
      builderStatus,
      dispatch,
      widgetId
    } = this.props
    const action: AppConfigAction = builderSupportModules.jimuForBuilderLib.getAppConfigAction()
    const appConfig = action.appConfig
    const selectedLayoutItem = searchUtils.findLayoutItem(appConfig, selection)
    if (!selectedLayoutItem) return

    const currentLayoutId = appConfig.widgets[widgetId].layouts[builderStatus][browserSizeMode]
    const newItemId = action.duplicateLayoutItemInSameLayout({ layoutId: currentLayoutId, layoutItemId: selectedLayoutItem.id })
    // keep its position
    action.editLayoutItemProperty({ layoutId: currentLayoutId, layoutItemId: newItemId }, 'bbox', selectedLayoutItem.bbox)
      .removeLayoutItem({ layoutId: currentLayoutId, layoutItemId: selectedLayoutItem.id }, false)
    action.exec()

    dispatch(
      appActions.selectionChanged({
        layoutId: currentLayoutId,
        layoutItemId: newItemId
      })
    )

    evt.stopPropagation()
    evt.nativeEvent.stopImmediatePropagation()
  }

  private readonly getCopyDropdownItems = (
    showBreak: boolean
  ): { items: ImmutableArray<MyDropDownItem>, title: string } => {
    const {
      cardConfigs,
      layouts,
      browserSizeMode,
      selection,
      builderStatus,
      builderSupportModules
    } = this.props
    const action: AppConfigAction = builderSupportModules.jimuForBuilderLib.getAppConfigAction()
    const appConfig = action.appConfig
    const selectedLayoutItem = searchUtils.findLayoutItem(appConfig, selection)
    if (!selection || !selectedLayoutItem || !window.jimuConfig.isInBuilder) {
      return {
        items: Immutable([]),
        title: ''
      }
    }
    const items = [] as any
    let title = ''
    let linkedToRegular = true
    let linkedToSelect =
      cardConfigs[Status.Selected].selectionMode !== SelectionModeType.None
    let linkedToHover = !!cardConfigs[Status.Hover].enable
    const isWidgetInLayout = (layoutId: string, widgetId: string): boolean => {
      const searchUtils = builderSupportModules.widgetModules.searchUtils
      const widgets = searchUtils.getContentsInLayoutWithRecursiveLayouts(
        appConfig,
        layoutId,
        LayoutItemType.Widget,
        browserSizeMode
      )
      return widgets.indexOf(widgetId) > -1
    }
    const isShowApplyToHover = cardConfigs[Status.Hover]?.listLayout !== ListLayout?.AUTO
    const isShowApplyToSelected = cardConfigs[Status.Selected]?.listLayout !== ListLayout?.AUTO

    const syncToHover = () => {
      if (cardConfigs[Status.Hover].enable) {
        const layoutId = searchUtils.findLayoutId(
          layouts[Status.Hover],
          browserSizeMode,
          appConfig.mainSizeMode
        )
        if (
          !isWidgetInLayout(
            layoutId,
            appConfig.layouts[selection.layoutId].content[
              selection.layoutItemId
            ].widgetId
          )
        ) {
          linkedToHover = false
        }
        items.push({
          label: this.formatMessage('applyTo', {
            status: this.formatMessage('hover').toLocaleLowerCase()
          }),
          event: evt => {
            this.handleCopyTo(
              evt,
              Status.Hover,
              linkedToHover
            )
          }
        })
      }
    }

    const syncToSelected = () => {
      if (
        cardConfigs[Status.Selected].selectionMode !== SelectionModeType.None
      ) {
        const layoutId = searchUtils.findLayoutId(
          layouts[Status.Selected],
          browserSizeMode,
          appConfig.mainSizeMode
        )
        if (
          !isWidgetInLayout(
            layoutId,
            appConfig.layouts[selection.layoutId].content[
              selection.layoutItemId
            ].widgetId
          )
        ) {
          linkedToSelect = false
        }
        items.push({
          label: this.formatMessage('applyTo', {
            status: this.formatMessage('selected').toLocaleLowerCase()
          }),
          event: evt => {
            this.handleCopyTo(
              evt,
              Status.Selected,
              linkedToSelect
            )
          }
        })
      }
    }

    const syncToRegular = () => {
      const layoutId = searchUtils.findLayoutId(
        layouts[Status.Default],
        browserSizeMode,
        appConfig.mainSizeMode
      )
      if (
        !isWidgetInLayout(
          layoutId,
          appConfig.layouts[selection.layoutId].content[selection.layoutItemId]
            .widgetId
        )
      ) {
        linkedToRegular = false
      }
      items.push({
        label: this.formatMessage('applyTo', {
          status: this.formatMessage('default').toLocaleLowerCase()
        }),
        event: evt => {
          this.handleCopyTo(
            evt,
            Status.Default,
            linkedToRegular
          )
        }
      })
    }

    if (builderStatus === Status.Default) {
      isShowApplyToHover && syncToHover()
      isShowApplyToSelected && syncToSelected()
      if (linkedToHover && linkedToSelect) {
        title = this.formatMessage('linkedToAnd', {
          where1: this.formatMessage('selected').toLocaleLowerCase(),
          where2: this.formatMessage('hover').toLocaleLowerCase()
        })
      } else if (linkedToHover) {
        title = this.formatMessage('linkedTo', {
          where: this.formatMessage('hover').toLocaleLowerCase()
        })
      } else if (linkedToSelect) {
        title = this.formatMessage('linkedTo', {
          where: this.formatMessage('selected').toLocaleLowerCase()
        })
      }
    } else if (builderStatus === Status.Hover) {
      syncToRegular()
      isShowApplyToSelected && syncToSelected()
      if (linkedToRegular && linkedToSelect) {
        title = this.formatMessage('linkedToAnd', {
          where1: this.formatMessage('default').toLocaleLowerCase(),
          where2: this.formatMessage('selected').toLocaleLowerCase()
        })
      } else if (linkedToRegular) {
        title = this.formatMessage('linkedTo', {
          where: this.formatMessage('default').toLocaleLowerCase()
        })
      } else if (linkedToSelect) {
        title = this.formatMessage('linkedTo', {
          where: this.formatMessage('selected').toLocaleLowerCase()
        })
      }
    } else {
      syncToRegular()
      isShowApplyToHover && syncToHover()
      if (linkedToRegular && linkedToHover) {
        title = this.formatMessage('linkedToAnd', {
          where1: this.formatMessage('default').toLocaleLowerCase(),
          where2: this.formatMessage('hover').toLocaleLowerCase()
        })
      } else if (linkedToRegular) {
        title = this.formatMessage('linkedTo', {
          where: this.formatMessage('default').toLocaleLowerCase()
        })
      } else if (linkedToHover) {
        title = this.formatMessage('linkedTo', {
          where: this.formatMessage('hover').toLocaleLowerCase()
        })
      }
    }
    if (showBreak) {
      items.push({
        label: this.formatMessage('isolate'),
        event: this.handleBreakLink
      })
    } else {
      title = this.formatMessage('isolate')
    }

    return {
      items: Immutable(items),
      title: title
    }
  }

  _renderAction = () => {
    const handlers = []
    const { theme, layoutType, keepAspectRatio } = this.props
    const sideHandle = css`
      box-shadow: none;

      &:after {
        position: absolute;
        content: '';
        width: ${cornerSize}px;
        height: ${cornerSize}px;
        background-color: ${theme.sys.color.primary.main};
        border: 2px solid ${theme.ref.palette.white};
        border-radius: 50%;
        z-index: ${zIndexHandle};
      }
    `

    const bottomSideLine = css`
      box-shadow: none;
      height: ${sideSize}px;
      left: 0px;
      right: 0px;
      bottom: ${-1 * (sideSize / 2)}px;
      &:after {
        position: absolute;
        content: '';
        bottom: 50%;
        left: 0;
        right: 0;
        height: 2px;
        background-color: ${theme.sys.color.primary.light};
        z-index: ${zIndexHandle};
      }
    `

    const rightSideLine = css`
      box-shadow: none;
      width: ${sideSize}px;
      top: 0px;
      bottom: 0px;
      right: ${-1 * (sideSize / 2)}px;
      &:after {
        position: absolute;
        content: '';
        right: 50%;
        top: 0;
        bottom: 0;
        width: 2px;
        background-color: ${theme.sys.color.primary.light};
        z-index: ${zIndexHandle};
      }
    `

    const handle = css`
      position: absolute;
    `

    const rightSideCursor = css`
      width: ${sideSize}px;
      top: ${-1 * sidePosition}px;
      bottom: ${-1 * sidePosition}px;
      right: ${-1 * (sideSize / 2)}px;

      &:after {
        top: 50%;
        right: 50%;
        margin-top: ${cornerPosition / 2}px;
        margin-right: ${cornerPosition / 2}px;
      }
    `
    const bottomSideCursor = css`
      height: ${sideSize}px;
      left: ${-1 * sidePosition}px;
      right: ${-1 * sidePosition}px;
      bottom: ${-1 * (sideSize / 2)}px;

      &:after {
        left: 50%;
        bottom: 50%;
        margin-left: ${cornerPosition / 2}px;
        margin-bottom: ${cornerPosition / 2}px;
      }
    `
    switch (layoutType) {
      case ListLayoutType.Column:
        handlers.push(
          <span
            key='10'
            className='list-card-rnd-resize-left-line'
            css={[handle, rightSideLine]}
          />
        )
        handlers.push(
          <span
            key='4'
            className='list-card-rnd-resize-right'
            css={[handle, sideHandle, rightSideCursor]}
          />
        )
        break
      case ListLayoutType.Row:
        handlers.push(
          <span
            key='9'
            className='list-card-rnd-resize-bottom-line'
            css={[handle, bottomSideLine]}
          />
        )
        handlers.push(
          <span
            key='6'
            className='list-card-rnd-resize-bottom'
            css={[handle, sideHandle, bottomSideCursor]}
          />
        )
        break
      case ListLayoutType.GRID:
        handlers.push(
          <span
            key='10'
            className='list-card-rnd-resize-left-line'
            css={[handle, rightSideLine]}
          />
        )
        handlers.push(
          <span
            key='4'
            className='list-card-rnd-resize-right'
            css={[handle, sideHandle, rightSideCursor]}
          />
        )
        if (!keepAspectRatio) {
          handlers.push(
            <span
              key='9'
              className='list-card-rnd-resize-bottom-line'
              css={[handle, bottomSideLine]}
            />
          )
          handlers.push(
            <span
              key='6'
              className='list-card-rnd-resize-bottom'
              css={[handle, sideHandle, bottomSideCursor]}
            />
          )
        }
        break
    }
    return handlers
  }

  getCardToolsStyle = (theme: IMThemeVariables) => {
    return css`
      width: 100%;
      .btn {
        width: 100%;
      }
      .dropdown-toggle {
        justify-content: center;
      }
    `
  }

  renderCardTools = () => {
    const { index } = this.props
    const isInBuilder = window.jimuConfig.isInBuilder
    if (!isInBuilder || index > 0) return
    const {
      cardConfigs,
      appMode,
      builderSupportModules,
      datasourceId,
      selectionIsInList,
      selectionIsList,
      hideCardTool
    } = this.props

    let showTools = true
    const {
      BuilderPopper,
      GLOBAL_RESIZING_CLASS_NAME,
      GLOBAL_H5_DRAGGING_CLASS_NAME,
      GLOBAL_DRAGGING_CLASS_NAME
    } = builderSupportModules.widgetModules

    const isInList = selectionIsInList
    const isSelf = selectionIsList
    if (
      (!isInList && !isSelf) ||
      appMode === AppMode.Run ||
      hideCardTool ||
      !datasourceId
    ) {
      showTools = false
    }

    return (
      showTools &&
      this.props.isEditing &&
      (cardConfigs[Status.Hover].enable ||
        cardConfigs[Status.Selected].selectionMode !==
          SelectionModeType.None) && (
        <BuilderPopper
          placement='left-start'
          trapFocus={false}
          autoFocus={false}
          css={css`
            .${GLOBAL_DRAGGING_CLASS_NAME} &,
            .${GLOBAL_RESIZING_CLASS_NAME} &,
            .${GLOBAL_H5_DRAGGING_CLASS_NAME} & {
              &.popper {
                display: none;
              }
            }
          `}
          reference={this.resizeRef.current}
          offset={statesPopperOffset}
          modifiers={statesModifiers}
          open={showTools}
        >
          {this.getCardMenuElement()}
        </BuilderPopper>
      )
    )
  }

  getCardMenuElement = () => {
    const { index } = this.props
    const isInBuilder = window.jimuConfig.isInBuilder
    if (!isInBuilder || index > 0) return
    const {
      cardConfigs,
      selection,
      widgetId,
      builderSupportModules,
      browserSizeMode,
      builderStatus,
      selectionIsList
    } = this.props

    const action: AppConfigAction = builderSupportModules.jimuForBuilderLib.getAppConfigAction()
    const appConfig = action.appConfig

    const {
      searchUtils,
      BuilderDropDown,
      BuilderButton,
      withBuilderTheme
    } = builderSupportModules.widgetModules

    const isSelf = selectionIsList

    const showBreak =
      !isSelf &&
      selection &&
      searchUtils &&
      searchUtils.getRelatedLayoutItemsInWidgetByLayoutInfo(
        appConfig,
        selection,
        widgetId,
        browserSizeMode
      ).length > 1
    const { items: syncItems, title: syncTitle } = this.getCopyDropdownItems(
      showBreak
    )
    const showSync = syncItems && syncItems.length > 0
    const listLayout = cardConfigs[builderStatus]?.listLayout || ListLayout.CUSTOM
    const isShowSyncOrBreak = showSync || showBreak
    const isShowCopyPopper = !isSelf && isShowSyncOrBreak && listLayout === ListLayout.CUSTOM
    const CardMenu = withBuilderTheme(theme => {
      return (
        <div
          className='status-group d-flex flex-column align-items-center p-2'
          css={this.getCardToolsStyle(theme)}
        >
          <BuilderButton
            active={builderStatus === Status.Default}
            onClick={evt => { this.handleBuilderStatusChange(evt, Status.Default) }}
          >
            {this.formatMessage('default')}
          </BuilderButton>
          {cardConfigs[Status.Hover].enable && (
            <BuilderButton
              active={builderStatus === Status.Hover}
              className='mt-1'
              onClick={evt => { this.handleBuilderStatusChange(evt, Status.Hover) }}
            >
              {this.formatMessage('hover')}
            </BuilderButton>
          )}
          {cardConfigs[Status.Selected].selectionMode !==
            SelectionModeType.None && (
            <BuilderButton
              active={builderStatus === Status.Selected}
              className='mt-1'
              onClick={evt => { this.handleBuilderStatusChange(evt, Status.Selected) }}
            >
              {this.formatMessage('selected')}
            </BuilderButton>
          )}
          {isShowCopyPopper && (
            <BuilderDropDown
              className='mt-1 w-100'
              toggleIsIcon
              toggleTitle={syncTitle}
              toggleType='default'
              direction='left'
              toggleArrow={false}
              toggleContent={theme => (
                showBreak ? <SyncOnOutlined size={16}/> : <SyncOffOutlined size={16}/>
              )}
              modifiers={applyPopperModifiers}
              items={syncItems}
            />
          )}
        </div>
      )
    })
    return (<CardMenu/>)
  }

  isItemAccept = (item: LayoutItemConstructorProps, isPlaceholder: boolean): boolean => {
    const { isEditing, builderSupportModules, widgetId } = this.props
    return isItemAccept(item, isPlaceholder, isEditing, widgetId, builderSupportModules)
  }

  getEditorStyle = () => {
    return css`
      &.list-card-content {
        .fixed-layout {
          border: 0 !important;
        }
      }
    `
  }

  render () {
    const {
      selectable,
      active,
      cardConfigs,
      LayoutEntry,
      selectionIsInList,
      isEditing,
      widgetId,
      listStyle,
      lockItemRatio,
      builderStatus,
      layouts,
      layoutType
    } = this.props
    const { didMount } = this.state
    const layout = layouts[builderStatus]
    const listLayout = cardConfigs[builderStatus]?.listLayout || ListLayout.CUSTOM
    const regularLayout = layouts[Status.Default]
    const showLayout = listLayout === ListLayout.AUTO ? regularLayout : layout
    const bgStyle = initBackgroundStyle(cardConfigs[builderStatus].backgroundStyle)
    const isShowMask = listLayout === ListLayout.AUTO && builderStatus !== Status.Default
    const mergedStyle: any = {
      ...styleUtils.toCSSStyle(bgStyle || ({} as any))
    }
    const cardContentStyle: any = {
      ...styleUtils.toCSSStyle(
        {
          borderRadius: bgStyle?.borderRadius || 0
        } || ({} as any)
      )
    }

    const newProviderData = this.getNewProviderData()
    if (!this.isProviderEqual(newProviderData, this.providerData)) {
      this.providerData = newProviderData
    }
    const isLockItemRatio = layoutType !== ListLayoutType.GRID && lockItemRatio
    return (
      <RepeatedDataSourceProvider data={this.providerData}>
        <ListGroupItem
          active={selectable && active}
          css={this.getStyle(builderStatus)}
          style={{ ...cardContentStyle, ...listStyle }}
          className={classNames('surface-1', `list-card-${widgetId}`)}
          onClick={this.handleItemClick}
          role='listCardEditor'
        >
          {isShowMask && <div className='card-editor-mask position-absolute'></div>}
          {didMount && this.renderCardTools()}
          <div
            className='list-card-content d-flex'
            style={mergedStyle}
            css={this.getEditorStyle()}
            ref={this.resizeRef}
          >
            <LayoutEntry
              isItemAccepted={this.isItemAccept}
              isRepeat
              layouts={showLayout}
              isInWidget
            />
            {isEditing &&
              !selectionIsInList &&
              !isLockItemRatio &&
              this._renderAction()}
          </div>
        </ListGroupItem>
      </RepeatedDataSourceProvider>
    )
  }
}

export default ReactRedux.connect<ExtraProps, unknown, ListCardEditorProps>(
  (state: IMState, props: ListCardEditorProps) => {
    const {
      selectionIsList,
      builderSupportModules,
      appMode,
      widgetId,
      browserSizeMode
    } = props
    if (!window.jimuConfig.isInBuilder || appMode === AppMode.Run) {
      return {
        selection: undefined,
        showBreak: false
      }
    }
    const searchUtils = builderSupportModules?.widgetModules?.searchUtils
    const action: AppConfigAction = builderSupportModules.jimuForBuilderLib.getAppConfigAction()
    const appConfig = action.appConfig
    const selection =
      props.index === 0 &&
      props.selectionIsInList &&
      state &&
      state.appRuntimeInfo &&
      state.appRuntimeInfo.selection
    const showBreak =
      !selectionIsList &&
      selection &&
      searchUtils &&
      searchUtils.getRelatedLayoutItemsInWidgetByLayoutInfo(
        appConfig,
        selection,
        widgetId,
        browserSizeMode
      ).length > 1
    return {
      selection,
      showBreak
    }
  }
)(_ListCardEditor)
