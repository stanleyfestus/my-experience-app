/** @jsx jsx */
import {
  React, jsx, type ActionSettingProps, Immutable, type UseDataSource, MessageType
} from 'jimu-core'
import { withTheme } from 'jimu-theme'
import type { ActionConfig } from './types'
import SelectData from './select-data'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { Label, Radio } from 'jimu-ui'

interface State {
  useCustomData: boolean
}

class _OpenSidebarSetting extends React.PureComponent<ActionSettingProps<ActionConfig>, State> {
  state: State = { useCustomData: false }

  componentDidMount () {
    if (!this.props.config?.useDataSources) {
      this.handleDataChange([])
    }
    this.setState({ useCustomData: this.props.config?.useDataSources?.length > 0 })
  }

  handleDataChange = (useDataSources: UseDataSource[]) => {
    this.props.onSettingChange({
      actionId: this.props.actionId,
      config: { useDataSources: useDataSources?.length > 0 ? useDataSources : [] }
    })
  }

  render () {
    if (this.props.messageType !== MessageType.DataRecordsSelectionChange) {
      return null
    }

    const { messageWidgetId, config } = this.props

    return (
      <SettingSection className='border-0' title={this.props.intl.formatMessage({ id: 'messageAction_TriggerData' })}>
        <SettingRow>
          <div>
            <div>
              <Label check centric>
                <Radio
                  name='useAllData'
                  style={{ cursor: 'pointer' }}
                  value='all'
                  className='mr-2'
                  checked={!this.state.useCustomData}
                  onClick={() => { this.setState({ useCustomData: false }) }}
                />
                {this.props.intl.formatMessage({ id: 'allDataWithoutCount' })}
              </Label>
            </div>
            <div className='mt-2'>
              <Label check centric>
                <Radio
                  name='useCustomData'
                  style={{ cursor: 'pointer' }}
                  value='custom'
                  className='mr-2'
                  checked={this.state.useCustomData}
                  onClick={() => { this.setState({ useCustomData: true }) }}
                />
                {this.props.intl.formatMessage({ id: 'custom' })}
              </Label>
            </div>
          </div>
        </SettingRow>
        {this.state.useCustomData && (
          <SettingRow flow='wrap'>
            <SelectData
              widgetId={messageWidgetId}
              useDataSources={Immutable(config?.useDataSources ?? [])}
              onChange={this.handleDataChange}
            />
          </SettingRow>
        )}
      </SettingSection>
    )
  }
}

export default withTheme(_OpenSidebarSetting)
