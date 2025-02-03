/** @jsx jsx */ // <-- make sure to include the jsx pragma
import { React, jsx, type IMThemeVariables, type IntlShape } from 'jimu-core'
import { Checkbox, Icon, defaultMessages as jimuUIDefaultMessages, Label, Tooltip } from 'jimu-ui'
import { SettingRow } from 'jimu-ui/advanced/setting-components'
import defaultMessages from '../translations/default'
import { ColorPicker } from 'jimu-ui/basic/color-picker'
import { type ProfileStyle, type ProfileSettings } from '../../config'
import { getSelectableLayersSettingsStyle } from '../lib/style'
import { getConfigIcon, presetColors } from '../constants'
import LineStylePicker from './line-style-picker'

const { epConfigIcon } = getConfigIcon()

interface Props {
  intl: IntlShape
  theme: IMThemeVariables
  currentDs: string
  config: ProfileSettings
  onSelectableLayersStyleUpdated: (prop: string, value: string | boolean | ProfileStyle, isNextSelectable: boolean) => void
}

interface IState {
  color: string
}

export default class SelectableLayersStyleSetting extends React.PureComponent<Props, IState> {
  constructor (props) {
    super(props)

    this.state = {
      color: ''
    }
  }

  nls = (id: string) => {
    const messages = Object.assign({}, defaultMessages, jimuUIDefaultMessages)
    //for unit testing no need to mock intl we can directly use default en msg
    if (this.props.intl && this.props.intl.formatMessage) {
      return this.props.intl.formatMessage({ id: id, defaultMessage: messages[id] })
    } else {
      return messages[id]
    }
  }

  onHighlightGraphicsColorChange = (color: string) => {
    this.props.onSelectableLayersStyleUpdated('graphicsHighlightColor', color, false)
  }

  onNextSelectableOptionChange = (evt: React.FormEvent<HTMLInputElement>) => {
    this.props.onSelectableLayersStyleUpdated('displayNextSelectableLine', evt.currentTarget.checked, true)
  }

  updateNextSelectableLineStyle = (object: string, property: string, value: any) => {
    const style: ProfileStyle = {
      lineType: property === 'lineType' ? value : this.props.config.nextSelectableLineOptions?.style?.lineType,
      lineColor: property === 'lineColor' ? value : this.props.config.nextSelectableLineOptions?.style?.lineColor,
      lineThickness: property === 'lineThickness' ? value : this.props.config.nextSelectableLineOptions?.style?.lineThickness
    }
    this.props.onSelectableLayersStyleUpdated('style', style, true)
  }

  onAddedLayersOptionChange = (evt: React.FormEvent<HTMLInputElement>) => {
    this.props.onSelectableLayersStyleUpdated('supportAddedLayers', evt.currentTarget.checked, false)
  }

  render () {
    return <div style={{ height: '100%', width: '100%', marginTop: 5 }} css={getSelectableLayersSettingsStyle(this.props.theme)}>
      <div>
        <SettingRow className='pt-4 ep-divider-top'>
          <Label tabIndex={0} aria-label={this.nls('chooseHighlightColor')} style={{ width: 185 }} className='d-flex'>
            <div className='flex-grow-1 text-break title4'>
              {this.nls('chooseHighlightColor')}
            </div>
          </Label>
          <ColorPicker className='ml-3' aria-label={this.nls('chooseHighlightColor')} title={this.nls('chooseHighlightColor')} placement={'top'}
            offset={[0, 0]} presetColors={presetColors} showArrow color={this.props.config.graphicsHighlightColor || '#b54900'}
            onChange={this.onHighlightGraphicsColorChange} />
        </SettingRow>

        <SettingRow>
          <Label className='w-100 d-flex cursor-pointer'>
            <Checkbox className={'mr-2 font-13'} checked={this.props.config.nextSelectableLineOptions?.displayNextSelectableLine}
              onChange={this.onNextSelectableOptionChange} role={'checkbox'} aria-label={this.nls('nextSelectableOptionLabel')} />
            <div className='flex-grow-1 text-break'>
              {this.nls('nextSelectableOptionLabel')}
            </div>
          </Label>
          <Tooltip role={'tooltip'} tabIndex={0} aria-label={this.nls('nextSelectableTooltip')}
            title={this.nls('nextSelectableTooltip')} showArrow placement='top'>
            <div className='ml-2 d-inline'>
              <Icon size={14} icon={epConfigIcon.infoIcon} />
            </div>
          </Tooltip>
        </SettingRow>

        {this.props.config.nextSelectableLineOptions?.displayNextSelectableLine &&
          <SettingRow>
            <LineStylePicker
              intl={this.props.intl}
              lineItem={'style'}
              isNextSelectable={true}
              onLineStyleChange={this.updateNextSelectableLineStyle}
              config={this.props.config.nextSelectableLineOptions?.style}
            />
          </SettingRow>
        }

        <SettingRow>
          <Label className='w-100 d-flex cursor-pointer'>
            <Checkbox className={'mr-2 font-13'} checked={this.props.config.supportAddedLayers}
              onChange={this.onAddedLayersOptionChange} role={'checkbox'} aria-label={this.nls('supportAddedLayers')} />
            <div className='flex-grow-1 text-break'>
              {this.nls('supportAddedLayers')}
            </div>
          </Label>
          <Tooltip role={'tooltip'} tabIndex={0} aria-label={this.nls('supportAddedLayersTooltip')}
            title={this.nls('supportAddedLayersTooltip')} showArrow placement='top'>
            <div className='ml-2 d-inline'>
              <Icon size={14} icon={epConfigIcon.infoIcon} />
            </div>
          </Tooltip>
        </SettingRow>
      </div>
    </div>
  }
}
