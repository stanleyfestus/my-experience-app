/** @jsx jsx */
import { React, jsx, type ImmutableArray, type UseDataSource, type WidgetInitResizeCallback } from 'jimu-core'
import { type Editor as EditorType, type RenderPlugin } from 'jimu-ui/advanced/rich-text-editor'
import { EditorPlaceholder, type EditorPlaceholderProps } from './placeholder'
import { TextPlugins } from './plugins'
import { type CSSObject } from 'jimu-theme'
import { getInvalidDataSourceIds } from './utils'
const { useMemo, useCallback } = React

interface EditorProps extends Omit<EditorPlaceholderProps, 'modules' | 'plugin' | 'editorRef'> {
  widgetId: string
  onInitResizeHandler?: WidgetInitResizeCallback
  useDataSources?: ImmutableArray<UseDataSource>
  onCreate?: (editor: EditorType) => void
  onDestroy?: () => void
  value?: string
}

export const usePlugin = (widgetId: string, useDataSources: ImmutableArray<UseDataSource>, enabled: boolean, onInitResizeHandler: WidgetInitResizeCallback): RenderPlugin => {
  return React.useMemo(() => {
    return ({ editor, selection, formats }) => {
      return <TextPlugins editor={editor} selection={selection} formats={formats} widgetId={widgetId} useDataSources={useDataSources} enabled={enabled} onInitResizeHandler={onInitResizeHandler} />
    }
  }, [enabled, onInitResizeHandler, useDataSources, widgetId])
}

export const useStyle = (text: string, useDataSources: ImmutableArray<UseDataSource>) => {
  return useMemo(() => {
    // Find the invalid data source from the text
    // Because the text in config is not saved in real time,
    // so the update of invalid data source here may be delayed.
    const dsIds = getInvalidDataSourceIds(text, useDataSources)
    const styles: CSSObject = {
      '.ql-editor': {
        lineHeight: 1.42
      }
    }
    dsIds?.forEach(dsId => {
      styles[`exp[data-dsid*="${dsId}"]`] = {
        opacity: 0.5,
        background: 'var(--sys-color-error-main)',
        outline: '1px solid white'
      }
    })
    return styles
  }, [text, useDataSources])
}

export const useEditorCycle = (onEditorCreate, onEditorDestroy): (editor: any) => any => {
  return useCallback(editor => {
    return editor != null ? onEditorCreate?.(editor) : onEditorDestroy?.()
  }, [onEditorCreate, onEditorDestroy])
}

export const Editor = (props: EditorProps): React.ReactElement => {
  const {
    value,
    widgetId,
    useDataSources,
    onComplete,
    onCreate: onEditorCreate,
    onDestroy: onEditorDestroy,
    onInitResizeHandler,
    enabled,
    ...others
  } = props

  const [text, setText] = React.useState(value)
  const setEditor = useEditorCycle(onEditorCreate, onEditorDestroy)
  const plugin = usePlugin(widgetId, useDataSources, enabled, onInitResizeHandler)
  const style = useStyle(text, useDataSources)

  return (
    <EditorPlaceholder
      editorRef={setEditor}
      css={style}
      value={value}
      plugin={plugin}
      onChange={setText}
      onComplete={onComplete}
      enabled={enabled}
      {...others}
    />
  )
}
