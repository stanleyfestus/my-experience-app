/**@jsx jsx */
import { React, css, jsx, type LayoutItemConstructorProps } from 'jimu-core'
import { WidgetList } from 'jimu-ui/advanced/setting-components'
import { type ToolSettingPanelProps } from 'jimu-layouts/layout-runtime'
import { isLayoutItemAcceptedForController, widgetStatePropChange } from '../runtime/builder/utils'

const styles = css`
  width: 380px;
  height: 600px;
  >.content {
    height: 100%;
    margin-top: 0 !important;
    padding-top: var(--sys-spacing-4);
    .list-container {
      height: calc(100% - 100px);
    }
  }
`

export const AddWidgetComponent = (props: ToolSettingPanelProps) => {
  const controllerId = props.widgetId

  const handleItemSelect = React.useCallback((item: LayoutItemConstructorProps) => {
    widgetStatePropChange(controllerId, 'itemToAdd', item)
  }, [controllerId])

  return <div css={styles}>
    <WidgetList
      isAccepted={isLayoutItemAcceptedForController}
      onSelect={handleItemSelect}
    />
  </div>
}
