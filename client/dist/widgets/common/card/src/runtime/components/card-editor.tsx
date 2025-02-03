/** @jsx jsx */
import {
  React,
  jsx,
  css,
  type IMThemeVariables,
  AppMode,
  type LayoutInfo,
  LayoutItemType,
  appActions,
  Immutable,
  type ImmutableArray,
  ReactRedux,
  type IMState,
  AnimationContext,
  TransitionContainer,
  getNextAnimationId,
  type IMWidgetJson
} from 'jimu-core'
import { styleUtils } from 'jimu-ui'
import { Status, CardLayout } from '../../config'
import { searchUtils } from 'jimu-layouts/layout-runtime'
import { type MyDropDownItem } from './my-dropdown'
import Card, { type CardProps, type CardStates } from './card-base'
import { SyncOnOutlined } from 'jimu-icons/outlined/editor/sync-on'
import { SyncOffOutlined } from 'jimu-icons/outlined/editor/sync-off'
import { type AppConfigAction } from 'jimu-for-builder'
import { initBackgroundStyle } from '../utils/utils'

interface ExtraProps {
  selection?: LayoutInfo
}

const statesPopperOffset = [0, 5]
const statesModifiers = [
  {
    name: 'flip',
    options: {
      boundary: document.body,
      fallbackPlacements: ['right-start', 'bottom-start', 'top-start', 'top-end']
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

interface CardEditorProps extends CardProps {
  builderSupportModules?: any
  isEditing?: boolean
  LayoutEntry?: any
  selectionIsCard?: boolean
  selectionIsInCard?: boolean
  builderStatus?: Status
  interact?: any
  dispatch?: any
  isShowMask?: boolean
  isRTL?: boolean
  hideCardTool?: boolean
  selectSelf?: () => void
}

interface CardEditorStates extends CardStates {
  didMount: boolean
  previousIndex: number
  currentIndex: number
  regularPlayId: number
  hoverPlayId: number
  widgetsUpdate: symbol
}

export class _CardEditor extends Card<
CardEditorProps & ExtraProps,
CardEditorStates
> {
  interactable: Interact.Interactable
  lastResizeCall = null
  regularLayoutRef: React.RefObject<HTMLDivElement>
  hoverLayoutRef: React.RefObject<HTMLDivElement>
  layoutRef: React.RefObject<HTMLDivElement>
  isUpdateFirst: boolean

  constructor (props) {
    super(props)

    this.state = {
      didMount: false,
      previousIndex: 1,
      currentIndex: 0,
      regularPlayId: null,
      hoverPlayId: null,
      widgetsUpdate: null
    }
    this.regularLayoutRef = React.createRef()
    this.hoverLayoutRef = React.createRef()
    this.layoutRef = React.createRef()
    this.isUpdateFirst = true
  }

  componentDidMount () {
    this.setState({
      didMount: true
    })
  }

  componentDidUpdate (prevProps) {
    const { cardConfigs, builderStatus } = this.props
    const prevCardConfigs = prevProps.cardConfigs
    const isPreviewIdChange =
      prevCardConfigs?.transitionInfo?.previewId ===
      cardConfigs?.transitionInfo?.previewId
    const isStatusChange =
      prevProps.builderStatus &&
      prevProps.builderStatus !== builderStatus &&
      !this.isUpdateFirst
    const isHoverEnableChange =
      prevCardConfigs[Status.Hover].enable !== cardConfigs[Status.Hover].enable
    if (!isPreviewIdChange || isStatusChange || isHoverEnableChange) {
      this.toggleStatus(builderStatus)
    }

    if (this.isUpdateFirst) {
      this.isUpdateFirst = false
    }
  }

  handleCopyTo = (evt, status: Status, selectedLayoutItem, linked: boolean) => {
    if (!selectedLayoutItem) return
    const {
      layouts,
      builderSupportModules,
      browserSizeMode,
      builderStatus
    } = this.props
    const jimuForBuilderLib = builderSupportModules.jimuForBuilderLib
    let action: AppConfigAction = jimuForBuilderLib.getAppConfigAction()
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
    if (linked) {
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
    } else {
      // create a blank layout item and set widgetId
      const service = jimuForBuilderLib.LayoutServiceProvider.getService(appConfig, desLayoutId)
      const cResult = service.createBlankItem(appConfig, desLayoutId)
      appConfig = cResult[0]
      const newItemId = cResult[1]
      const destLayoutInfo = { layoutId: desLayoutId, layoutItemId: newItemId }
      const originLayoutItem = searchUtils.findLayoutItem(appConfig, { layoutId: originLayoutId, layoutItemId: selectedLayoutItem.id })

      // add widget parent
      appConfig = jimuForBuilderLib.widgetService.addParent(appConfig, selectedLayoutItem.widgetId, destLayoutInfo, browserSizeMode)

      // sync the two layout items
      action = jimuForBuilderLib.getAppConfigAction(appConfig)
      action.editLayoutItemProperty(destLayoutInfo, 'bbox', originLayoutItem.bbox)
        .editLayoutItemProperty(destLayoutInfo, 'setting', originLayoutItem.setting)
        .editLayoutItemProperty(destLayoutInfo, 'type', originLayoutItem.type)
        .editLayoutItemProperty(destLayoutInfo, 'widgetId', originLayoutItem.widgetId)
        .adjustOrderOfItem(destLayoutInfo, -1)
    }
    this.setState({
      widgetsUpdate: Symbol()
    })

    action.exec()
    evt.stopPropagation()
    evt.nativeEvent.stopImmediatePropagation()
  }

  editStatus = (name, value) => {
    const { dispatch, widgetId } = this.props
    dispatch(appActions.widgetStatePropChange(widgetId, name, value))
  }

  handleBuilderStatusChange (evt, status: Status) {
    // this.toggleStatus(status);
    this.editStatus('showCardSetting', status)
    this.editStatus('builderStatus', status)

    this?.props?.selectSelf()
    evt.stopPropagation()
    evt.nativeEvent.stopImmediatePropagation()
  }

  toggleStatus = (status: Status) => {
    const { cardConfigs } = this.props
    const isHoverEnable = cardConfigs?.HOVER?.enable
    const isHover = status === Status.Hover
    let { previousIndex, currentIndex, hoverPlayId, regularPlayId } = this.state
    const isSwitchToDefault = status === Status.Default && currentIndex === 1
    if (isHoverEnable || isSwitchToDefault) {
      previousIndex = isHover ? 0 : 1
      currentIndex = isHover ? 1 : 0
      hoverPlayId = isHover ? getNextAnimationId() : null
      regularPlayId = isHover ? null : getNextAnimationId()
    }
    this.setState({
      previousIndex: previousIndex,
      currentIndex: currentIndex,
      hoverPlayId: hoverPlayId,
      regularPlayId: regularPlayId
    })
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
    const jimuForBuilderLib = builderSupportModules.jimuForBuilderLib
    let action: AppConfigAction = jimuForBuilderLib.getAppConfigAction()
    const appConfig = action.appConfig
    const selectedLayoutItem = searchUtils.findLayoutItem(appConfig, selection)
    if (!selectedLayoutItem) return
    const currentLayoutId = appConfig.widgets[widgetId].layouts[builderStatus][browserSizeMode]
    const newItemId = action.duplicateLayoutItemInSameLayout({ layoutId: currentLayoutId, layoutItemId: selectedLayoutItem.id })

    action.editLayoutItemProperty({ layoutId: selection.layoutId, layoutItemId: newItemId }, 'bbox', selectedLayoutItem.bbox)
      .removeLayoutItem(
        { layoutId: currentLayoutId, layoutItemId: selectedLayoutItem.id },
        false
      )

    // remove parent except { layoutId: currentLayoutId, layoutItemId: newItemId } from the duplicated result
    const layoutItem = searchUtils.findLayoutItem(action.appConfig, { layoutId: currentLayoutId, layoutItemId: newItemId })
    const contentService = new jimuForBuilderLib.ContentServiceWrapper(action.appConfig, layoutItem)
    contentService.removeSizeModeParent(browserSizeMode)
    contentService.addParent({ layoutId: currentLayoutId, layoutItemId: newItemId }, browserSizeMode)

    action = jimuForBuilderLib.getAppConfigAction(contentService.getConfig())

    if (
      selection.layoutId === currentLayoutId &&
      selection.layoutItemId === selectedLayoutItem.id
    ) {
      dispatch(appActions.selectionChanged(null))
    }
    const content = action.appConfig.layouts[currentLayoutId].content
    const newItemKey = Object.keys(content)[Object.keys(content).length - 1]
    if (newItemKey) {
      const newItem = content[newItemKey]
      dispatch(
        appActions.selectionChanged({
          layoutId: currentLayoutId,
          layoutItemId: newItem.id
        })
      )
      //When breaking link, the parent of the newly generated widget still has another layout,
      //which is wrong. Currently, the widget needs to handle it by itself.
      // const ItemWidgetJson = action.appConfig.widgets[newItem.widgetId]
      // const newItemWidgetJson = this.initParentOfNewWidgetAfterIsolate(ItemWidgetJson, currentLayoutId)
      // action
      //   .editWidget(newItemWidgetJson)
      //   .exec()
    }

    action.exec()
    evt.stopPropagation()
    evt.nativeEvent.stopImmediatePropagation()
  }

  initParentOfNewWidgetAfterIsolate = (widgetJson: IMWidgetJson, currentLayoutId: string): IMWidgetJson => {
    const { browserSizeMode } = this.props
    const parent = widgetJson.parent
    const newItemCurrentParent = parent[browserSizeMode]
    const newParent = newItemCurrentParent?.filter(layout => layout.layoutId === currentLayoutId)
    return widgetJson.setIn(['parent', browserSizeMode], newParent)
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
    let linkedToHover = true
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

    const syncToHover = () => {
      const { cardLayout } = this.props
      if (cardConfigs[Status.Hover] && cardLayout !== CardLayout.AUTO) {
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
              selectedLayoutItem,
              linkedToHover
            )
          }
        })
      }
    }

    const syncToRegular = () => {
      const { cardLayout } = this.props
      if (cardLayout !== CardLayout.AUTO) {
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
              selectedLayoutItem,
              linkedToRegular
            )
          }
        })
      }
    }

    if (builderStatus === Status.Default) {
      syncToHover()
      title = this.formatMessage('linkedTo', {
        where: this.formatMessage('hover').toLocaleLowerCase()
      })
    } else if (builderStatus === Status.Hover) {
      syncToRegular()
      title = this.formatMessage('linkedTo', {
        where: this.formatMessage('default').toLocaleLowerCase()
      })
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
    const isInBuilder = window.jimuConfig.isInBuilder
    if (!isInBuilder) return
    const {
      builderSupportModules,
      selectionIsCard,
      selectionIsInCard,
      appMode,
      hideCardTool,
      cardConfigs
    } = this.props

    const {
      BuilderPopper,
      GLOBAL_RESIZING_CLASS_NAME,
      GLOBAL_H5_DRAGGING_CLASS_NAME,
      GLOBAL_DRAGGING_CLASS_NAME
    } = builderSupportModules.widgetModules

    const isSelf = selectionIsCard
    let showTools = true
    if (
      (!selectionIsInCard && !isSelf) ||
      appMode === AppMode.Run ||
      hideCardTool
    ) {
      showTools = false
    }

    return (
      this.props.isEditing &&
      cardConfigs[Status.Hover].enable && (
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
          reference={this.layoutRef.current}
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
    const isInBuilder = window.jimuConfig.isInBuilder
    if (!isInBuilder) return
    const {
      selection,
      widgetId,
      builderSupportModules,
      browserSizeMode,
      builderStatus,
      selectionIsCard
    } = this.props

    const action: AppConfigAction = builderSupportModules.jimuForBuilderLib.getAppConfigAction()
    const appConfig = action.appConfig

    const {
      searchUtils,
      BuilderDropDown,
      BuilderButton,
      withBuilderTheme
    } = builderSupportModules.widgetModules

    const isSelf = selectionIsCard

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
          <BuilderButton
            active={builderStatus === Status.Hover}
            className='mt-1'
            onClick={evt => { this.handleBuilderStatusChange(evt, Status.Hover) }}
          >
            {this.formatMessage('hover')}
          </BuilderButton>
          {!isSelf && (showSync || showBreak) && (
            <BuilderDropDown
              className='mt-1 w-100'
              toggleIsIcon
              toggleTitle={syncTitle}
              toggleType='default'
              direction='left'
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

  getEditorStyle = () => {
    return css`
      &.card-content {
        .fixed-layout {
          border: 0 !important;
        }
      }
    `
  }

  renderCardEditor = () => {
    const { cardConfigs, LayoutEntry, layouts, browserSizeMode, cardLayout } = this.props
    const { hoverPlayId, regularPlayId } = this.state
    const regularLayout = layouts[Status.Default]
    const hoverLayout = cardLayout === CardLayout.AUTO ? regularLayout : layouts[Status.Hover]

    const regularBgStyle = initBackgroundStyle(cardConfigs[Status.Default].backgroundStyle)
    const hoverBgStyle = initBackgroundStyle(cardConfigs[Status.Hover].backgroundStyle)

    const transitionInfo = cardConfigs.transitionInfo
    const editorContent = []

    const regularMergedStyle: any = {
      ...styleUtils.toCSSStyle(regularBgStyle || ({} as any))
    }

    const regularEditor = (
      <div
        className='card-content d-flex surface-1'
        css={this.getEditorStyle()}
        ref={this.regularLayoutRef}
        key={Status.Default}
      >
        <div className='w-100, h-100 animation-list' style={regularMergedStyle}>
          <AnimationContext.Provider
            value={{
              setting: transitionInfo?.oneByOneEffect || null,
              playId: regularPlayId,
              oid: regularLayout[browserSizeMode]
            }}
          >
            <LayoutEntry
              className='h-100'
              isRepeat
              layouts={regularLayout}
              isInWidget
            />
          </AnimationContext.Provider>
        </div>
      </div>
    )
    editorContent.push(regularEditor)
    if (!cardConfigs[Status.Hover].enable) {
      return editorContent
    }

    const hoverMergedStyle: any = {
      ...styleUtils.toCSSStyle(hoverBgStyle || ({} as any))
    }

    const isShowMask = cardLayout === CardLayout.AUTO && cardConfigs[Status.Hover].enable
    const hoverEditor = (
      <div
        className='card-content d-flex surface-1'
        css={this.getEditorStyle()}
        ref={this.hoverLayoutRef}
        key={Status.Hover}
      >
        <div className='w-100, h-100 animation-list position-relative' style={hoverMergedStyle}>
          <AnimationContext.Provider
            value={{
              setting: transitionInfo?.oneByOneEffect || null,
              playId: hoverPlayId,
              oid: hoverLayout?.[browserSizeMode]
            }}
          >
            <LayoutEntry
              className='h-100'
              isRepeat
              layouts={hoverLayout}
              isInWidget
            />
          </AnimationContext.Provider>
          {isShowMask && <div className='card-editor-mask position-absolute'></div>}
        </div>
      </div>
    )
    editorContent.push(hoverEditor)
    return editorContent
  }

  getCardStyle = () => {
    const { builderStatus, cardConfigs } = this.props
    const status = cardConfigs[Status.Hover].enable
      ? builderStatus
      : Status.Default
    const style = {
      boxShadow: cardConfigs[status]?.backgroundStyle?.boxShadow,
      borderRadius: cardConfigs[status]?.backgroundStyle?.borderRadius
    }

    const cardShadowStyle: any = {
      ...styleUtils.toCSSStyle(style as any)
    }
    return cardShadowStyle
  }

  render () {
    const { cardConfigs, widgetId, isShowMask, builderStatus, selectionIsCard, selectionIsInCard } = this.props
    const { didMount, previousIndex, currentIndex } = this.state
    const transitionInfo = cardConfigs.transitionInfo

    const cardEditClass = `card-${widgetId}`
    const usePreviewId = (selectionIsCard || selectionIsInCard) ? transitionInfo?.previewId : null
    const previewId = usePreviewId || null

    return (
      <div
        css={this.getStyle(builderStatus)}
        style={this.getCardStyle()}
        className={cardEditClass}
        // onClick={this.handleItemClick}
      >
        {didMount && this.renderCardTools()}
        <div className='w-100, h-100' ref={this.layoutRef}>
          <TransitionContainer
            previousIndex={previousIndex}
            currentIndex={currentIndex}
            transitionType={transitionInfo?.transition?.type}
            direction={transitionInfo?.transition?.direction}
            playId={didMount ? previewId : null}
            withOneByOne={!!transitionInfo?.oneByOneEffect}
          >
            {this.renderCardEditor()}
          </TransitionContainer>
        </div>
        {isShowMask && <div className='edit-mask position-absolute' />}
      </div>
    )
  }
}

export default ReactRedux.connect<ExtraProps, unknown, CardEditorProps>(
  (state: IMState, props: CardEditorProps) => {
    const { appMode } = props
    if (!window.jimuConfig.isInBuilder || appMode === AppMode.Run) {
      return {
        selection: undefined
      }
    }
    const selection =
      props.selectionIsInCard && state?.appRuntimeInfo?.selection
    return {
      selection
    }
  }
)(_CardEditor)
