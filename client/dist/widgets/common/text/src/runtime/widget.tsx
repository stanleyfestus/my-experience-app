import {
  React, classNames, type AllWidgetProps, type IMState, type RepeatedDataSource, appActions, AppMode, Immutable,
  ReactRedux, type IntlShape, type IMExpressionMap, expressionUtils, type ExpressionMap, MutableStoreManager, getAppStore, hooks
} from 'jimu-core'
import { DefaultConfig, type IMConfig } from '../config'
import { type Editor } from 'jimu-ui/advanced/rich-text-editor'
import { Displayer } from './displayer'
import defaultMessages from './translations/default'
import { richTextUtils } from 'jimu-ui'
import { versionManager } from '../version-manager'

enum RepeatType { None, Main, Sub }

/* Ensure that the cursor can be displayed when automatic width of layout */
const MinHeight = '12px'

const translate = (id: string, intl: IntlShape): string => {
  return intl !== null ? intl.formatMessage({ id: id, defaultMessage: defaultMessages[id] }) : ''
}

const translatePlaceholder = (placeholder: string, intl: IntlShape): string => {
  if (placeholder === defaultMessages.defaultPlaceholder) {
    placeholder = translate('defaultPlaceholder', intl)
  }
  return placeholder
}

const Widget = (props: AllWidgetProps<IMConfig>): React.ReactElement => {
  const {
    builderSupportModules,
    id,
    intl,
    useDataSources: propUseDataSources,
    repeatedDataSource,
    useDataSourcesEnabled,
    isInlineEditing,
    config,
    savedConfig,
    onInitResizeHandler
  } = props

  const dispatch = ReactRedux.useDispatch()
  const { current: isInBuilder } = React.useRef(getAppStore().getState().appContext.isInBuilder)

  // Check whether the widget is selected in builder
  const selected = hooks.useWidgetSelected(id)
  const selectedRef = hooks.useLatest(selected)

  const appMode = ReactRedux.useSelector((state: IMState) => state.appRuntimeInfo.appMode)

  const getAppConfigAction = builderSupportModules?.jimuForBuilderLib.getAppConfigAction
  const RichEditor = builderSupportModules?.widgetModules.Editor
  const builderUtils = builderSupportModules?.widgetModules.builderUtils

  const wrap = config.style?.wrap ?? true
  const color = config.style?.color
  const text = config.text
  const tooltip = config.tooltip
  const placeholder = translatePlaceholder(config.placeholder, intl)
  const useDataSources = useDataSourcesEnabled ? propUseDataSources : undefined
  const useDataSourcesLength = useDataSources?.length ?? 0
  // The expressions in rich-text
  const [expressions, setExpressions] = React.useState<IMExpressionMap>(null)

  // Check whether the text is in the list widget according to the repeatedDataSource
  //  If there is no repeatedDataSource, it is not in the list widget => RepeatType.None
  //  If repeatedDataSource.recordIndex is 0, means that it is the edited one in the list widget => RepeatType.Main
  //  If repeatedDataSource.recordIndex is not 0, means that it is the widget in the list that only displays text => RepeatType.Sub
  const repeat = React.useMemo(() => {
    let repeat = RepeatType.Sub
    if (repeatedDataSource == null) {
      repeat = RepeatType.None
    } else {
      if ((repeatedDataSource as RepeatedDataSource).recordIndex === 0) {
        repeat = RepeatType.Main
      } else {
        repeat = RepeatType.Sub
      }
    }
    return repeat
  }, [repeatedDataSource])

  const isMainWidgetRef = hooks.useLatest(repeat !== RepeatType.Sub)

  // When appMode changed, set `isInlineEditing` to false
  React.useEffect(() => {
    if (!isMainWidgetRef.current || !selectedRef.current) {
      return
    }
    if (appMode === AppMode.Run) {
      dispatch(appActions.setWidgetIsInlineEditingState(id, false))
    }
  }, [isMainWidgetRef, selectedRef, appMode, dispatch, id])

  // When `isInlineEditing` changed, set `showExpression` to false
  hooks.useUpdateEffect(() => {
    if (!isMainWidgetRef.current || !isInBuilder) {
      return
    }
    if (!isInlineEditing) {
      dispatch(appActions.widgetStatePropChange(id, 'showExpression', false))
    }
  }, [isMainWidgetRef, isInlineEditing, dispatch, id])

  /**
   * Determine whether it can be edited:
   * 1: When the widget is selected and not only used to display the text in the list(RepeatType.Sub), create the rich text editor for the setting panel to use
   * 2: Show rich text editor when `isInlineEditing`
   */
  const editingAbility = (appMode === AppMode.Design || appMode === AppMode.Express) && repeat !== RepeatType.Sub
  const createEditor = editingAbility && selected
  const editable = editingAbility && isInlineEditing

  // Send `editor` instance to setting through `widgetMutableStatePropChange`
  const onEditorCreate = (editor: Editor): void => {
    MutableStoreManager.getInstance().updateStateValue(id, 'editor', editor)
  }

  const onEditorDestroy = (): void => {
    MutableStoreManager.getInstance().updateStateValue(id, 'editor', null)
  }

  const syncInlineEditingTool = () => {
    dispatch(appActions.widgetToolbarStateChange(id, ['text-inline-editing']))
  }

  const unMountingRef = React.useRef(false)
  React.useEffect(() => {
    return () => {
      unMountingRef.current = true
    }
  }, [])

  hooks.useUpdateEffect(() => {
    if (!isMainWidgetRef.current) return
    let expressions = richTextUtils.getAllExpressions(text)
    expressions = expressions != null ? expressions : Immutable({}) as IMExpressionMap
    expressions = expressions.merge((tooltip != null ? { tooltip } : {}) as ExpressionMap)
    setExpressions(expressions)
  }, [isMainWidgetRef, text, tooltip, useDataSourcesLength])

  // Save text and placeholder to config
  const onEditorComplete = (value: string, placeholder: string): void => {
    if (unMountingRef.current) return
    if (!isInBuilder) return
    getAppConfigAction().editWidget({ id, config: savedConfig.set('text', value).set('placeholder', placeholder) }).exec()
  }

  const handleExpressionChange = hooks.useEventCallback(() => {
    if (unMountingRef.current) return
    if (!isInBuilder) return
    const parts = builderUtils.getExpressionParts(expressions)
    const udsWithFields = expressionUtils.getUseDataSourceFromExpParts(parts, useDataSources) as any

    getAppConfigAction().editWidget({
      id,
      useDataSources: udsWithFields
    }).exec()
  })

  // When `expressions` changed, put the fields in `useDataSources`
  hooks.useUpdateEffect(() => {
    handleExpressionChange()
  }, [expressions, handleExpressionChange])

  return (
    <div
      data-testid='text-widget'
      style={{ minHeight: MinHeight, color }}
      className={classNames('widget-text jimu-widget p-1')}
    >
      {createEditor && <RichEditor
        className={classNames({ 'd-none': !editable })}
        widgetId={id}
        nowrap={!wrap}
        onInitResizeHandler={onInitResizeHandler}
        useDataSources={useDataSources}
        enabled={!!isInlineEditing}
        onCreate={onEditorCreate}
        onDestroy={onEditorDestroy}
        onComplete={onEditorComplete}
        onEditorFocus={syncInlineEditingTool}
        placeholder={placeholder}
        preserveWhitespace
        value={text}
      />}
      <Displayer
        className={classNames({ 'd-none': editable })}
        value={text}
        tooltip={tooltip}
        wrap={wrap}
        placeholder={placeholder}
        useDataSources={useDataSources}
        widgetId={id}
        repeatedDataSource={repeatedDataSource as RepeatedDataSource}
      />
    </div>
  )
}

Widget.versionManager = versionManager
Widget.getFullConfig = (config: IMConfig) => {
  return DefaultConfig.merge(config, { deep: true })
}

export default Widget
