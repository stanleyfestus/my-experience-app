import { React, type IMState, appActions, getAppStore, ReactRedux, type ImmutableArray, type UseDataSource, type WidgetInitResizeCallback, hooks, BrowserSizeMode } from 'jimu-core'
import { Bubble, RichExpressionBuilderPopper, type RichPluginRequiredProps } from 'jimu-ui/advanced/rich-text-editor'
import { defaultMessages } from 'jimu-ui'
import { ThemeSwitchComponent } from 'jimu-theme'
import { appBuilderSync } from 'jimu-for-builder'

interface _TextPliuginsProps {
  useDataSources: ImmutableArray<UseDataSource>
  widgetId: string
  enabled: boolean
  onInitResizeHandler?: WidgetInitResizeCallback
}

export type TextPliuginsProps = _TextPliuginsProps & RichPluginRequiredProps

export const TextPlugins = (props: TextPliuginsProps): React.ReactElement => {
  const { editor, formats, selection, useDataSources, widgetId, enabled, onInitResizeHandler } = props
  const showExpression = ReactRedux.useSelector((state: IMState) => !!state.widgetsState[widgetId]?.showExpression)
  const browserSizeMode = ReactRedux.useSelector((state: IMState) => state.browserSizeMode)
  const uri = ReactRedux.useSelector((state: IMState) => state.appConfig.widgets[widgetId]?.uri)
  const translate = hooks.useTranslation(defaultMessages)
  //When version1 changes, `Bubble` will be hidden
  const [version1, setVersion1] = React.useState(0)
  //When version2 changes, `Expression` will be repositioned
  const [version2, setVersion2] = React.useState(0)
  const expressNodeRef = React.useRef<HTMLDivElement>(null)

  // In small screen mode, render the tool settingPanel to the right of the iframe.
  if (browserSizeMode === BrowserSizeMode.Small) {
    appBuilderSync.publishSidePanelToApp({
      type: 'textExpression',
      widgetId,
      uri,
      editor,
      formats,
      selection,
      useDataSources,
      active: showExpression
    })
  }

  React.useEffect(() => {
    onInitResizeHandler?.(() => {
      setVersion1(v => v + 1)
      expressNodeRef.current?.classList.add('d-none')
    }, null, () => {
      setVersion2(v => v + 1)
      expressNodeRef.current?.classList.remove('d-none')
    })
  }, [onInitResizeHandler])

  const headerProps = React.useMemo(() => ({
    title: translate('dynamicContent'),
    onClose: () => {
      getAppStore().dispatch(appActions.widgetStatePropChange(widgetId, 'showExpression', false))
      getAppStore().dispatch(appActions.widgetToolbarStateChange(widgetId, ['text-expression']))
    }
  }), [widgetId, translate])

  hooks.useUpdateEffect(() => {
    setVersion1(v => v + 1)
  }, [enabled])

  return (
    <ThemeSwitchComponent useTheme2={true}>
      <Bubble editor={editor} formats={formats} selection={selection} source='user' version={version1} />
      {browserSizeMode !== BrowserSizeMode.Small &&
        <RichExpressionBuilderPopper
          ref={expressNodeRef}
          version={version2}
          source='user'
          editor={editor}
          formats={formats}
          selection={selection}
          open={showExpression}
          useDataSources={useDataSources}
          header={headerProps}
          widgetId={widgetId}
        />
      }
    </ThemeSwitchComponent>
  )
}
