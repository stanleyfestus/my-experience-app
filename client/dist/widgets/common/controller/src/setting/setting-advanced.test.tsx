import * as React from 'react'
import { mockTheme, getInitState, widgetRender } from 'jimu-for-test'
import { SettingAdvanced } from './setting-advanced'
import '@testing-library/jest-dom'
import { getAppStore, appActions } from 'jimu-core'

const themeBoxStyle = {
  default: { color: '#fff', iconColor: '#ccc', bg: '#ff0' },
  active: { color: '#fff', iconColor: '#ccc', bg: '#ff0' },
  hover: { color: '#000', iconColor: '#444', bg: '#00f' }
} as any

const initState = getInitState().merge({ appConfig: { dialogs: {} } })
getAppStore().dispatch(appActions.updateStoreState(initState))
window.locale = 'en'

describe('<SettingAdvanced />', () => {
  const mockOnSettingConfigChange = jest.fn()
  const mockOnSettingConfigReset = jest.fn()
  describe('given themeBoxDataItems prop', () => {
    const renderContent = (
      <SettingAdvanced
        variant={themeBoxStyle}
        defaultIsOpen
        onChange={mockOnSettingConfigChange}
        onReset={mockOnSettingConfigReset}
      />
    )

    it('Tab has defaultActive prop properly provided', () => {
      const { container } = widgetRender(false, mockTheme as any)(renderContent)
      const Tabs = container.querySelectorAll('.tab-title-item > .jimu-link')
      expect(Tabs[0]).toHaveClass('active')
      expect(Tabs[1]).not.toHaveClass('active')
    })

    it('ThemeColorPicker has value prop properly provided', () => {
      const { container } = widgetRender(false, mockTheme as any)(renderContent)
      const Tabs = container.querySelectorAll('.tab-pane')
      const ThemeColorPickers = Tabs[0].querySelectorAll('.color-block[data-color],.color-picker-block[data-color]')
      expect(ThemeColorPickers[0].getAttribute('data-color')).toBe(themeBoxStyle.default.color)
      expect(ThemeColorPickers[1].getAttribute('data-color')).toBe(themeBoxStyle.default.iconColor)
      expect(ThemeColorPickers[2].getAttribute('data-color')).toBe(themeBoxStyle.default.bg)
    })
  })
})
