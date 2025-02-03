import { React, type ImmutableObject, classNames, hooks } from 'jimu-core'
import { defaultMessages as jimuUiDefaultMessage, TextInput, Switch, CollapsableToggle } from 'jimu-ui'
import { type WebChartAxisScrollBar, type DateTimeFormatOptions, type WebChartAxis } from 'jimu-ui/advanced/chart'
import { SettingRow } from 'jimu-ui/advanced/setting-components'
import defaultMessages from '../../../../../translations/default'
import { DateFormatSetting } from '../../components'
import { ScrollbarSetting } from './scrollbar'

const ShowDateFormatSetting = false
const DisplayRangeSlider = false

export interface DateAxisProps {
  className?: string
  axis: ImmutableObject<WebChartAxis>
  onChange?: (axis: ImmutableObject<WebChartAxis>) => void
}

export const DateAxis = (props: DateAxisProps): React.ReactElement => {
  const translate = hooks.useTranslation(defaultMessages, jimuUiDefaultMessage)
  const { className, axis: propAxis, onChange } = props
  const visible = propAxis.visible ?? true
  const titleText = propAxis.title.content?.text ?? ''
  const valueFormat = propAxis.valueFormat
  const scrollbar = propAxis.scrollbar
  const showGrid = propAxis.grid?.width > 0

  const handleVisibleChange = (visible: boolean): void => {
    let axis = propAxis.set('visible', visible).setIn(['labels', 'visible'], visible)
    if (!visible) {
      axis = axis.setIn(['grid', 'width'], 0)
    }
    onChange?.(axis)
  }

  const handleTitleTextChange = (value: string): void => {
    onChange?.(
      propAxis.set(
        'title',
        propAxis.title.set('visible', value !== '').setIn(['content', 'text'], value)
      )
    )
  }

  const handleValueFormatChange = (value: ImmutableObject<DateTimeFormatOptions>): void => {
    onChange?.(propAxis.set('valueFormat', value))
  }

  const handleShowGridChange = (): void => {
    onChange?.(propAxis.setIn(['grid', 'width'], showGrid ? 0 : 1))
  }

  const handleScrollbarChange = (value: ImmutableObject<WebChartAxisScrollBar>): void => {
    onChange?.(propAxis.setIn(['scrollbar'], value))
  }

  return (
    <div className={classNames('date-axis w-100', className)}>
      <SettingRow label={translate('axisTitle')} flow='wrap' level={2}>
        <TextInput
          size='sm'
          aria-label={translate('axisTitle')}
          defaultValue={titleText}
          className='w-100'
          onAcceptValue={handleTitleTextChange}
        />
      </SettingRow>
      <CollapsableToggle
        role='group'
        level={2}
        className='mt-4'
        isOpen={visible}
        label={translate('axisLabel')}
        aria-label={translate('axisLabel')}
        onRequestOpen={() => { handleVisibleChange(true) }}
        onRequestClose={() => { handleVisibleChange(false) }}>
        {ShowDateFormatSetting && <DateFormatSetting
          className='mt-2'
          value={valueFormat as ImmutableObject<DateTimeFormatOptions>}
          onChange={handleValueFormatChange}
        />}
      </CollapsableToggle>
      <SettingRow label={translate('axisGrid')} level={2} className='mt-4'>
        <Switch aria-label={translate('axisGrid')} checked={showGrid} onChange={handleShowGridChange} />
      </SettingRow>
      {DisplayRangeSlider && <ScrollbarSetting className='mt-3' value={scrollbar} onChange={handleScrollbarChange} />}
    </div>
  )
}
