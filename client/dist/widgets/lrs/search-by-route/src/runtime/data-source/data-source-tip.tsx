/** @jsx jsx */
import {
  React,
  jsx,
  getAppStore,
  DataSourceComponent,
  type DataSource,
  type UseDataSource,
  appConfigUtils,
  type IMDataSourceInfo,
  DataSourceStatus,
  type ImmutableObject,
  hooks
} from 'jimu-core'
import { Icon, Tooltip, Button, defaultMessages } from 'jimu-ui'
import iconWarning from 'jimu-icons/svg/outlined/suggested/warning.svg'
import iconError from 'jimu-icons/svg/outlined/suggested/wrong.svg'
import { useDataSourceExists } from './use-data-source-exist'
import { StatusIndicator, StatusType } from '../utils/status-utils'

interface ContentProps {
  widgetId: string
  useDataSource: ImmutableObject<UseDataSource>
  onStatusChange?: (enabled: boolean) => void
  onDataSourceCreated?: (ds: DataSource) => void
  showMessage?: boolean
}

/**
 * Show icon and message if the data source doesn't work.
 * @param props
 * @returns
 */
export function DataSourceTip (props: ContentProps) {
  const { widgetId, useDataSource, onStatusChange, onDataSourceCreated, showMessage = false } = props
  const getI18nMessage = hooks.useTranslation(defaultMessages)
  const dsExists: boolean = useDataSourceExists({ widgetId, useDataSourceId: useDataSource.dataSourceId })
  const [dsStatus, setDsStatus] = React.useState<'error' | 'warning' | 'creating'>(null)
  const [dataSource, setDataSource] = React.useState<DataSource>(null)

  const handleDsInfoChange = React.useCallback((info: IMDataSourceInfo) => {
    if (info) {
      const { status, instanceStatus } = info
      if (instanceStatus === DataSourceStatus.NotCreated) {
        setDsStatus('creating')
        onStatusChange?.(false)
      } else if (instanceStatus === DataSourceStatus.CreateError || status === DataSourceStatus.LoadError) {
        setDsStatus('error')
        onStatusChange?.(false)
      } else if (status === DataSourceStatus.NotReady) {
        setDsStatus('warning')
        onStatusChange?.(false)
      } else {
        setDsStatus(null)
        onStatusChange?.(true)
      }
    }
  }, [onStatusChange])

  const handleDsCreated = React.useCallback((ds: DataSource) => {
    setDataSource(ds)
    onDataSourceCreated?.(ds)
  }, [onDataSourceCreated])

  const handleDsCreateFailed = React.useCallback(() => {
    setDataSource(null)
    setDsStatus('error')
    onStatusChange?.(false)
  }, [onStatusChange])

  let statusIcon
  let statusMsg
  let color
  if (dsStatus === 'creating') {
    statusIcon = iconWarning // show warning icon that ds is not ready.
    statusMsg = getI18nMessage('loading')
  } else if (!dsExists || dsStatus === 'error') {
    statusIcon = iconError
    statusMsg = getI18nMessage('dataSourceCreateError')
    color = 'var(--danger-500)'
  } else if (dsStatus === 'warning') {
    const originDs = dataSource?.getOriginDataSources()?.[0]
    const dsLabel = originDs?.getLabel()

    const widgetId = appConfigUtils.getWidgetIdByOutputDataSource(useDataSource)
    const appState = window?.jimuConfig?.isBuilder
      ? getAppStore().getState().appStateInBuilder
      : getAppStore().getState()
    const widgetLabel = appState.appConfig.widgets[widgetId]?.label

    color = 'var(--warning-700)'
    statusIcon = iconWarning
    statusMsg = getI18nMessage('outputDataIsNotGenerated', {
      outputDsLabel: dsLabel ?? '',
      sourceWidgetName: widgetLabel ?? ''
    })
  }
  return (
    <React.Fragment>
      {dsExists && (
        <DataSourceComponent
          useDataSource={useDataSource}
          onDataSourceInfoChange={handleDsInfoChange}
          onDataSourceCreated={handleDsCreated}
          onCreateDataSourceFailed={handleDsCreateFailed}
        />
      )}
      {dsStatus === 'creating' && <StatusIndicator statusType={StatusType.Loading} title={statusMsg} />}
      {(!dsExists || dsStatus === 'error' || dsStatus === 'warning') && (
        <div className='d-flex align-items-center'>
          <Tooltip title={statusMsg}>
            <Button size='sm' type='tertiary' icon><Icon icon={statusIcon} color={color} /></Button>
          </Tooltip>
          {showMessage && <div className='status-message'>{statusMsg}</div>}
        </div>
      )}
    </React.Fragment>
  )
}
