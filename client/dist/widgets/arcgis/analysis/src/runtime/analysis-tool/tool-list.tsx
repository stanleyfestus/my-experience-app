/** @jsx jsx */
import { React, jsx, type Immutable, css, hooks } from 'jimu-core'
import { RightOutlined } from 'jimu-icons/outlined/directional/right'
import { List, TreeItemActionType, TreeStyle } from 'jimu-ui/basic/list-tree'
import { type ToolConfig } from '../../config'
import { getToolIcon, useGetDisplayedToolName } from '../../utils/util'
import { Button, defaultMessages as jimuiDefaultMessages } from 'jimu-ui'
import defaultMessages from '../translations/default'

interface Props {
  toolList: Immutable.ImmutableArray<ToolConfig>
  backFromToolId: string
  onSelect: (toolId: string) => void
}

const style = css`
  padding: 1rem;
  .jimu-tree-item__title {
    margin-left: 0.25rem;
    line-height: 1.375rem;
  }
  .jimu-tree-item {
    margin-bottom: 0.25rem;
  }
  .jimu-tree-item__body {
    padding: 0.3125rem 0.5rem;
    color: var(--ref-palette-neutral-1100);
    cursor: pointer;
    .open-detail-icon {
      color: var(--ref-palette-neutral-1100);
      cursor: pointer;
    }
  }
`

const ToolList = (props: Props) => {
  const { toolList, backFromToolId, onSelect } = props

  const translate = hooks.useTranslation(defaultMessages, jimuiDefaultMessages)

  const getDisplayedToolName = useGetDisplayedToolName()

  return <List
    css={style}
    itemsJson={toolList.asMutable().map((tool) => {
      const toolName = getDisplayedToolName(tool)
      return {
        itemKey: tool.id,
        itemStateIcon: { icon: getToolIcon(tool.toolName, tool.type, tool.analysisEngine) },
        itemStateTitle: toolName
      }
    })}
    size='default'
    treeStyle={TreeStyle.Card}
    overrideItemBlockInfo={({ itemBlockInfo }) => {
      return {
        name: TreeItemActionType.RenderOverrideItem,
        children: [{
          name: TreeItemActionType.RenderOverrideItemBody,
          children: [{
            name: TreeItemActionType.RenderOverrideItemIcon
          }, {
            name: TreeItemActionType.RenderOverrideItemTitle
          }, {
            name: TreeItemActionType.RenderOverrideItemMainLine
          }]
        }]
      }
    }}
    renderOverrideItemMainLine={(actionData, refComponent) => {
      const { itemJsons } = refComponent.props
      const currentItemJson = itemJsons[0]
      const toolId = currentItemJson.itemKey
      return <div>
        <Button icon type='tertiary' className='py-0' aria-label={translate('select')} autoFocus={toolId === backFromToolId}>
          <RightOutlined className='open-detail-icon flip-icon' />
        </Button>
      </div>
    }}
    onClickItemBody={(actionData, refComponent) => {
      const { itemJsons } = refComponent.props
      const currentItemJson = itemJsons[0]
      const toolId = currentItemJson.itemKey
      onSelect(toolId)
    }}
  />
}

export default ToolList
