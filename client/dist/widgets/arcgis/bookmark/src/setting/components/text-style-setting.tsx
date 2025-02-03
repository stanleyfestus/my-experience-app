/** @jsx jsx */
import { React, jsx, hooks } from 'jimu-core'
import { FontFamily } from 'jimu-ui/advanced/rich-text-editor'
import { FontStyle, InputUnit, type FontFamilyValue } from 'jimu-ui/advanced/style-setting-components'
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker'
import defaultMessages from '../translations/default'
import { defaultMessages as jimuDefaultMessages, type LinearUnit } from 'jimu-ui'
import uppercaseOutlined from 'jimu-icons/svg/outlined/editor/uppercase.svg'
import { type BookmarkTextStyle } from '../../config'
import { getTheme2 } from 'jimu-theme'

interface TextStyleSettingProps {
  textStyle: BookmarkTextStyle
  onFontChange: (key: any, value: any) => void
  onFontStyleChange: (key: string, value: any) => void
}

export const TextStyleSetting = (props: TextStyleSettingProps): React.ReactElement => {
  const { textStyle, onFontChange, onFontStyleChange } = props
  const { fontFamily, fontStyles, fontColor, fontSize } = textStyle

  const appTheme = getTheme2()

  const translate = hooks.useTranslation(defaultMessages, jimuDefaultMessages)

  const bold = fontStyles?.weight === 'bold'
  const italic = fontStyles?.style === 'italic'
  const underline = fontStyles?.decoration === 'underline'
  const strike = fontStyles?.decoration === 'line-through'

  const size = `${fontSize}px`

  const handleFontFamilyChange = (family: FontFamilyValue): void => {
    onFontChange?.('fontFamily', family)
  }

  const handleFontStyleChange = (_key: string, selected: boolean): void => {
    let key = ''
    let value: string
    if (_key === 'bold') {
      key = 'weight'
      value = selected ? 'bold' : 'normal'
    }
    if (_key === 'italic') {
      key = 'style'
      value = selected ? 'italic' : 'normal'
    }
    if (_key === 'underline') {
      key = 'decoration'
      value = selected ? 'underline' : 'none'
    }
    if (_key === 'strike') {
      key = 'decoration'
      value = selected ? 'line-through' : 'none'
    }
    onFontStyleChange?.(key, value)
  }

  const handleColorChange = (color: string): void => {
    onFontChange?.('fontColor', color)
  }

  const handleFontSizeChange = (value: LinearUnit, evt): void => {
    if (value.distance == null) return
    onFontChange?.('fontSize', value.distance.toString())
  }

  return (
    <React.Fragment>
      <FontFamily className='w-100' font={fontFamily} onChange={handleFontFamilyChange} />
      <div className='d-flex justify-content-between mt-2'>
        <FontStyle
          aria-label={translate('fontStyle')}
          style={{ width: '45%' }}
          onChange={handleFontStyleChange}
          bold={bold}
          italic={italic}
          underline={underline}
          strike={strike}
        />
        <ThemeColorPicker
          icon={uppercaseOutlined}
          type='with-icon'
          title={translate('fontColor')}
          aria-label={translate('fontColor')}
          style={{ width: '11%' }}
          specificTheme={appTheme}
          value={fontColor}
          onChange={handleColorChange}
        />
        <InputUnit
          style={{ width: '35%' }}
          value={size}
          min={4}
          max={99}
          aria-label={translate('fontSize')}
          onChange={handleFontSizeChange}
        />
      </div>
    </React.Fragment>
  )
}
