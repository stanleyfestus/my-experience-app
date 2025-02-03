/** @jsx jsx */
import { jsx, type IMState, ReactRedux, type IMThemeVariables, css } from 'jimu-core'
import { SortTree } from 'jimu-ui/advanced/setting-components'
import { useTheme } from 'jimu-theme'
import { type ToolSettingPanelProps } from 'jimu-layouts/layout-runtime'

const getStyles = (theme: IMThemeVariables) => css`
width: 300px;
height: 400px;
overflow-y: auto;
padding: ${theme.sys.spacing[4]};
.jimu-tree-item__main-line {
  height: 32px;
  background-color: ${theme.ref.palette.neutral[500]};
  &:hover {
    background-color: ${theme.ref.palette.neutral[600]};
  }
  color: ${theme.ref.palette.neutral[1100]};
}
.jimu-tree-item__body {
  border: none !important;
}
`

export const ManageWidgetsComponent = (props: ToolSettingPanelProps) => {
  const controllerId = props.widgetId

  const widgetTreeJson = ReactRedux.useSelector((state: IMState) => {
    const appState = state.appStateInBuilder ? state.appStateInBuilder : state
    return appState.widgetsState[controllerId].widgetTreeJson
  })?.asMutable?.({ deep: true })

  const isItemDroppable = ReactRedux.useSelector((state: IMState) => {
    const appState = state.appStateInBuilder ? state.appStateInBuilder : state
    return appState.widgetsState[controllerId].isItemDroppable
  })

  const onTreeSort = ReactRedux.useSelector((state: IMState) => {
    const appState = state.appStateInBuilder ? state.appStateInBuilder : state
    return appState.widgetsState[controllerId].onTreeSort
  })

  const onTreeRemove = ReactRedux.useSelector((state: IMState) => {
    const appState = state.appStateInBuilder ? state.appStateInBuilder : state
    return appState.widgetsState[controllerId].onTreeRemove
  })

  const theme = useTheme()

  return (<div css={getStyles(theme)}>
    <SortTree
      rootItemJson={widgetTreeJson}
      isItemDroppable={isItemDroppable}
      onSort={onTreeSort}
      onRemove={onTreeRemove}
    />
  </div>)
}
