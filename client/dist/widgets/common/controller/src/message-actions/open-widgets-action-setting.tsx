import { React, type ActionSettingProps, Immutable, hooks, defaultMessages as jimuCoreMessages, MessageType, type UseDataSource } from 'jimu-core'
import { Label, Radio, defaultMessages as jimuUIMessages } from 'jimu-ui'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { type IMActionConfig } from '../config'
import defaultMessages from '../setting/translations/default'
import SelectData from './components/select-data'
import SelectWidgets from './components/select-widgets'

export default function OpenWidgetsActionSetting (props: ActionSettingProps<IMActionConfig>) {
  const { actionId, widgetId, messageWidgetId, messageType, onSettingChange } = props
  const config = props.config || Immutable({ widgetIds: [] as string[], controllerId: widgetId, useDataSources: [] as UseDataSource[] })

  const configRef = hooks.useLatest(config)
  React.useEffect(() => {
    const config = configRef.current
    if (!props.config) {
      onSettingChange({
        actionId,
        config
      })
    }
  }, [actionId, configRef, onSettingChange, props.config])

  const showTriggerData = [MessageType.DataRecordsSelectionChange].includes(messageType)

  const translate = hooks.useTranslation(defaultMessages, jimuCoreMessages, jimuUIMessages)

  const [useCustomData, setUseCustomData] = React.useState(config.useDataSources?.length > 0)
  const handleUseCustomData = React.useCallback((isUseCustomData: boolean) => {
    setUseCustomData(isUseCustomData)
    const config = configRef.current
    if (!isUseCustomData && config.useDataSources?.length > 0) {
      onSettingChange({
        actionId,
        config: config.set('useDataSources', [])
      })
    }
  }, [actionId, configRef, onSettingChange])

  const handleChangeData = React.useCallback((useDataSources: UseDataSource[]) => {
    const config = configRef.current
    onSettingChange({
      actionId,
      config: config.set('useDataSources', useDataSources)
    })
  }, [actionId, configRef, onSettingChange])

  const handleChangeWidgets = React.useCallback((widgetIds: string[]) => {
    const config = configRef.current
    onSettingChange({
      actionId,
      config: config.set('widgetIds', widgetIds)
    })
  }, [actionId, configRef, onSettingChange])

  return <div>
    {showTriggerData && <SettingSection title={translate('messageAction_TriggerData')}>
      <SettingRow>
        <Label>
          <Radio className='mr-2' checked={!useCustomData} onChange={() => { handleUseCustomData(false) }} />
          { translate('allDataWithoutCount') }
        </Label>
      </SettingRow>
      <SettingRow>
        <Label className='d-flex align-items-center label-line-height'>
          <Radio className='mr-2' checked={useCustomData} onChange={() => { handleUseCustomData(true) }} />
          { translate('custom') }
        </Label>
      </SettingRow>
      {useCustomData && <SettingRow flow='wrap'>
        <SelectData
          messageWidgetId={messageWidgetId}
          useDataSources={config.useDataSources}
          onChange={handleChangeData}
        />
      </SettingRow>}
    </SettingSection>}
    <SettingSection>
      <SettingRow label={translate('messageAction_openWidget')} flow='wrap'>
        <SelectWidgets
          widgetId={widgetId}
          selectedWidgetIds={config.widgetIds}
          onChange={handleChangeWidgets}
        />
      </SettingRow>
    </SettingSection>
  </div>
}
