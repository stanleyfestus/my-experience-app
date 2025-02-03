/** @jsx jsx */
import {
  React, jsx, css, type Immutable, hooks
} from 'jimu-core'
import { type CustomToolConfig, type ToolConfig, ToolType, type HistoryItemWithDs } from '../../config'
import { Button, defaultMessages as jimuiDefaultMessages, Dropdown, DropdownButton, DropdownItem, DropdownMenu, Loading, Tooltip } from 'jimu-ui'
import defaultMessages from '../translations/default'
import { MoreHorizontalOutlined } from 'jimu-icons/outlined/application/more-horizontal'
import { UnancelableTools } from '@arcgis/analysis-core'
import { AnalysisEngine, type AnalysisToolItem, UserPrivileges } from '@arcgis/analysis-ui-schema'
import tools from '../../utils/tools.json'
import { hasNAPrivilege, hasGeoEnrichmentPrivilege, AnalysisJobStatus, isStatusCancellable } from '@arcgis/analysis-shared-utils'
import { CloseOutlined } from 'jimu-icons/outlined/editor/close'
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info'
import { type JimuMapView } from 'jimu-arcgis'
import { EmptyOutlined } from 'jimu-icons/outlined/application/empty'
import { List, TreeItemActionType, TreeStyle } from 'jimu-ui/basic/list-tree'
import { getToolIcon, useAnalysisEnginesAccess, useGetDisplayedToolName } from '../../utils/util'

interface Props {
  portal: __esri.Portal
  historyList: HistoryItemWithDs[]
  jimuMapView: JimuMapView
  toolList: Immutable.ImmutableArray<ToolConfig>
  onViewDetails: (historyId: string) => void
  onRemove: (historyId: string) => void
  onOpenTool: (historyId: string) => void
  onCancelJob: (historyId: string) => void
}

const listStyle = css`
  padding: 1rem;
  .jimu-tree-item_template-card .jimu-tree-item__body .jimu-tree-item__main-line {
    padding: 0 !important;
  }
  .jimu-tree-item__body>.jimu-tree-item__main-line {
    flex-direction: column;
    align-items: flex-start;
    margin-right: 1rem;
    cursor: pointer;
    .jimu-tree-item__main-line {
      color: var(--ref-palette-neutral-1100);
      font-weight: 500;
    }
  }
  .jimu-tree-item__body {
    padding: 0.4375rem 1rem 0.4375rem 0.75rem;
  }
  .jimu-tree-item__title {
    line-height: 1.375rem;
  }
  .progress-detail {
    margin-top: 0.125rem;
    line-height: 1.375rem;
    color: var(--ref-palette-neutral-1000)
  }
  .jimu-tree-item [data-dndzone-droppable=true] {
    border: none;
  }
  .jimu-tree-item_template {
    padding-top: 0.5rem
  }
  .divider {
    width: 100%;
    height: 1px;
    background: var(--ref-palette-neutral-300);
    margin-top: 0.5rem;
  }
  .jimu-tree-item__draggable {
    flex-direction: column;
  }
  .jimu-dropdown-button {
    color: var(--ref-palette-neutral-1100);
  }
  .running-loading {
    top: auto;
    bottom: 0;
  }
`

const { useEffect, useState } = React

const HistoryList = (props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { portal, historyList, jimuMapView, toolList, onViewDetails, onRemove, onOpenTool, onCancelJob } = props

  const translate = hooks.useTranslation(defaultMessages, jimuiDefaultMessages)

  const [hasNAPrivilegeRes, setHasNAPrivilegeRes] = useState(false)
  const [hasGeoEnrichmentPrivilegeRes, setHasGeoEnrichmentPrivilegeRes] = useState(false)
  const [toolsWithNAPrivilege, setToolsWithNAPrivilege] = useState<AnalysisToolItem[]>([])

  const canAccessAnalysisEngines = useAnalysisEnginesAccess(portal)

  useEffect(() => {
    setHasNAPrivilegeRes(hasNAPrivilege(portal?.user))
    setHasGeoEnrichmentPrivilegeRes(hasGeoEnrichmentPrivilege(portal?.user))
    setToolsWithNAPrivilege((tools as AnalysisToolItem[]).filter((tool: AnalysisToolItem) => tool.privilegeRequirements !== undefined && tool.privilegeRequirements.includes(UserPrivileges.Network)))
  }, [portal])

  const checkHistoryItemForPrivileges = (historyItem: HistoryItemWithDs): boolean => {
    const privilegesMet = []

    // Check for NA privileges
    const toolRequiresNAPrivilege = toolsWithNAPrivilege.find((tool) => tool.toolName === historyItem.toolName) !== undefined
    const naPrivilegesMet = toolRequiresNAPrivilege ? hasNAPrivilegeRes : true
    privilegesMet.push(naPrivilegesMet)

    // Check for raster privileges
    const isRasterAnalysisEngineTool = historyItem.analysisEngine === AnalysisEngine.Raster
    const rasterPrivilegesMet = isRasterAnalysisEngineTool ? canAccessAnalysisEngines(AnalysisEngine.Raster) : true
    privilegesMet.push(rasterPrivilegesMet)

    // Check for standard privileges
    const isStandardAnalysisEngineTool = historyItem.analysisEngine === AnalysisEngine.Standard
    const standardPrivilegesMet = isStandardAnalysisEngineTool
      ? canAccessAnalysisEngines(AnalysisEngine.Standard)
      : true
    privilegesMet.push(standardPrivilegesMet)

    // Check for geoenrichment privileges
    const isEnrichLayerTool = historyItem.toolName === 'EnrichLayer'
    const enrichLayerPrivilege = isEnrichLayerTool ? hasGeoEnrichmentPrivilegeRes : true
    privilegesMet.push(enrichLayerPrivilege)

    return privilegesMet.includes(false)
  }

  const formatHistoryItemDescription = (historyItem: HistoryItemWithDs): string => {
    let description = ''
    const endTimeString = historyItem.endTimestamp !== undefined ? new Date(historyItem.endTimestamp).toUTCString() : ''
    switch (historyItem.jobInfo.jobStatus) {
      case AnalysisJobStatus.Canceled:
        description = historyItem.endTimestamp !== undefined ? translate('canceledAtTime', { time: endTimeString }) : translate('canceled')
        break
      case AnalysisJobStatus.Canceling:
        description = translate('canceling')
        break
      case AnalysisJobStatus.Deleted:
        break
      case AnalysisJobStatus.TimedOut:
      case AnalysisJobStatus.Failed:
        description =
          historyItem.endTimestamp !== undefined ? translate('jobFailedAtTime', { time: endTimeString }) : translate('jobFailed')
        break
      case AnalysisJobStatus.Executing:
        description = translate('running')
        break
      case AnalysisJobStatus.New:
        description = translate('provisioningResources')
        break
      case AnalysisJobStatus.Submitted:
        description = translate('submitted')
        break
      case AnalysisJobStatus.Succeeded:
        description = translate('completeAtTime', { time: endTimeString })
        break
      case AnalysisJobStatus.Waiting:
        description = translate('waiting')
        break
      default:
        break
    }

    return description
  }

  const getDisplayedToolName = useGetDisplayedToolName()

  const historyStatusIsError = (history: HistoryItemWithDs) => {
    return [AnalysisJobStatus.TimedOut, AnalysisJobStatus.Failed, AnalysisJobStatus.Canceled].includes(history.jobInfo.jobStatus)
  }

  return historyList.length
    ? <List
        css={listStyle}
        itemsJson={historyList.filter((history => toolList.find((t) => t.id === history.toolId))).map((history, index) => {
          const tool = toolList.find((t) => t.id === history.toolId)
          const isError = historyStatusIsError(history)
          const icon = isError ? require('jimu-icons/svg/outlined/suggested/wrong.svg') : getToolIcon(history.toolName, tool.type, tool.analysisEngine)
          return {
            itemKey: `${history.startTimestamp}`,
            itemStateIcon: { icon, color: isError ? 'var(--danger-600)' : undefined },
            itemStateTitle: getDisplayedToolName(tool),
            itemStateDetailContent: { history, index }
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
                name: TreeItemActionType.RenderOverrideItemMainLine,
                children: [{
                  name: TreeItemActionType.RenderOverrideItemMainLine,
                  children: [{
                    name: TreeItemActionType.RenderOverrideItemIcon
                  }, {
                    name: TreeItemActionType.RenderOverrideItemTitle
                  }]
                }, {
                  name: TreeItemActionType.RenderOverrideItemContent
                }]
              }, {
                name: TreeItemActionType.RenderOverrideItemCommands
              }]
            }, {
              name: TreeItemActionType.RenderOverrideItemDetailLine
            }]
          }
        }}
        renderOverrideItemContent={(actionData, refComponent) => {
          const { itemJsons } = refComponent.props
          const currentItemJson = itemJsons[0]
          const history = currentItemJson.itemStateDetailContent?.history as HistoryItemWithDs
          const jobStatus = history.jobInfo?.jobStatus
          const statusCancellable = isStatusCancellable(jobStatus)
          const isStatusCanceling = jobStatus === AnalysisJobStatus.Canceling
          return <div className='progress-detail'>
            {formatHistoryItemDescription(history)}
            {(statusCancellable || isStatusCanceling) && <Loading className='running-loading' type="BAR" />}
          </div>
        }}
        renderOverrideItemCommands={(actionData, refComponent) => {
          const { itemJsons } = refComponent.props
          const currentItemJson = itemJsons[0]
          const history = currentItemJson.itemStateDetailContent?.history as HistoryItemWithDs
          const jobStatus = history.jobInfo?.jobStatus
          const statusCancellable = isStatusCancellable(jobStatus)
          const tool = toolList.find((t) => t.id === history.toolId)
          const isSyncCustomTool = tool?.type === ToolType.Custom && (tool?.config as CustomToolConfig)?.toolInfo?.executionType === 'esriExecutionTypeSynchronous'
          const isToolCancellable = !(isSyncCustomTool || (tool?.type === ToolType.Standard && UnancelableTools.find((item: { toolName: string, analysisEngine: AnalysisEngine }) => {
            return history.toolName === item.toolName && history.analysisEngine === item.analysisEngine
          })))

          const historyItemPrivilegesMet = !checkHistoryItemForPrivileges(history)
          return <Dropdown onClick={(e) => { e.stopPropagation() }}>
            {!statusCancellable && <DropdownButton arrow={false} icon type='tertiary'>
              <MoreHorizontalOutlined color={'var(--dark-800)'} />
            </DropdownButton>}
            {!statusCancellable
              ? <DropdownMenu>
                  <DropdownItem onClick={() => { onViewDetails(history.id) }}>{translate('viewDetails')}</DropdownItem>
                  <DropdownItem disabled={!historyItemPrivilegesMet} onClick={() => {
                    if (historyItemPrivilegesMet) {
                      onOpenTool(history.id)
                    }
                  }}>{translate('openTool')}</DropdownItem>
                  {!history.isImportedFromMap && <DropdownItem onClick={() => { onRemove(history.id) }}>{translate('remove')}</DropdownItem>}
                </DropdownMenu>
              : jobStatus !== AnalysisJobStatus.New && (isToolCancellable
                ? <Tooltip placement='top' title={translate('cancelLabel')}><Button className='border-0 p-0' icon onClick={() => { onCancelJob(history.id) }}><CloseOutlined /></Button></Tooltip>
                : <Tooltip placement='top' title={translate('uncancellableLabel')}><Button className='border-0 p-0' icon><InfoOutlined /></Button></Tooltip>)
            }
          </Dropdown>
        }}
        renderOverrideItemDetailLine={(actionData, refComponent) => {
          const { itemJsons } = refComponent.props
          const currentItemJson = itemJsons[0]
          const index = currentItemJson.itemStateDetailContent?.index as number
          const history = currentItemJson.itemStateDetailContent?.history as HistoryItemWithDs
          const hasDivider = history.isImportedFromMap && historyList[index + 1] && !historyList[index + 1].isImportedFromMap
          return hasDivider ? <div className='divider'></div> : null
        }}
        handleClickItemBody={(actionData, refComponent) => {
          const { itemJsons } = refComponent.props
          const currentItemJson = itemJsons[0]
          const history = currentItemJson.itemStateDetailContent?.history as HistoryItemWithDs
          onViewDetails(history.id)
        }}
      />
    : <div className='d-flex align-items-center justify-content-center' css={css`height: 100%; flex-direction: column; padding: 0 20%; color: var(--ref-palette-neutral-1000); text-align: center`}>
        <EmptyOutlined className='mb-2' size={24} />
        {translate('historyEmptyPlaceholder')}
      </div>
}

export default HistoryList
