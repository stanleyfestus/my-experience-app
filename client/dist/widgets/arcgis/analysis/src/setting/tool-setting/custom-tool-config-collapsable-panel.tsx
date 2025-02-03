/** @jsx jsx */
import { React, jsx, hooks, type ImmutableObject } from 'jimu-core'
import { CollapsablePanel, defaultMessages as jimuiDefaultMessage, TextInput } from 'jimu-ui'
import { SettingRow } from 'jimu-ui/advanced/setting-components'
import { type AnalysisToolParam } from '@arcgis/analysis-ui-schema'

interface Props {
  parameter: ImmutableObject<AnalysisToolParam>
  children?: React.ReactNode
  onDisplayNameChange: (value: string) => void
}

const CustomToolConfigCollapsablePanel = (props: Props) => {
  const { parameter, onDisplayNameChange, children } = props
  const translate = hooks.useTranslation(jimuiDefaultMessage)

  const [editingDisplayName, setEditingDisplayName] = React.useState('')
  React.useEffect(() => {
    setEditingDisplayName(parameter.displayName || '')
  }, [parameter.displayName])

  return <CollapsablePanel
    className='parameter-setting-collapse'
    label={parameter.displayName || parameter.name}
    aria-label={parameter.displayName || parameter.name}
    type="default" defaultIsOpen={false}
  >
    <SettingRow className='pt-4 dark-600'>{`${translate('type')}: ${parameter.dataType}`}</SettingRow>
    <SettingRow className='mt-2 dark-600'>{`${translate('required')}: ${translate(parameter.parameterType === 'esriGPParameterTypeRequired' ? 'trueKey' : 'falseKey')}`}</SettingRow>
    <SettingRow className={`mt-2 label-dark-400 ${children ? '' : 'last-setting-row'}`} label={translate('label')} flow='wrap' role='group' aria-label={translate('label')}>
      <TextInput size='sm' className='w-100' value={editingDisplayName}
        onChange={(e) => { setEditingDisplayName(e.target.value) }}
        onAcceptValue={(value) => {
          if (!value) {
            setEditingDisplayName(parameter.displayName || '')
            return
          }
          onDisplayNameChange(value)
        }}
      />
    </SettingRow>
    {children}
  </CollapsablePanel>
}

export default CustomToolConfigCollapsablePanel
