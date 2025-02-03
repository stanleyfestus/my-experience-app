/** @jsx jsx */
import { jsx, type ThemeButtonType, css, type IMThemeVariables, type SerializedStyles, classNames, polished, hooks, type MobileSidePanelContentOptions, ReactRedux, type IMState } from 'jimu-core'
import { ThemeSwitchComponent, useTheme, useTheme2, useUseTheme2 } from 'jimu-theme'
import { Link, defaultMessages as jimuUIMessages } from 'jimu-ui'
import { type ToolSettingPanelProps } from 'jimu-layouts/layout-runtime'
import { getAppConfigAction } from 'jimu-for-builder'

const THEMETYPES: ThemeButtonType[] = [
  'default',
  'primary',
  'secondary',
  'tertiary',
  'danger',
  'link'
]

const getStyle = (appTheme: IMThemeVariables, builderTheme: IMThemeVariables): SerializedStyles => {
  return css`
    width: 360px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: ${appTheme.sys.spacing[3]};
    padding: ${appTheme.sys.spacing[5]};
    .button-item{
      width: 100%;
      font-size: ${polished.rem(13)};
    }
    .quick-style-item{
      padding: ${appTheme.sys.spacing[2]};
      margin: 2px;
      &.quick-style-item-selected{
        outline: 2px solid ${builderTheme.sys.color.primary.light};
      }
      background-color: ${appTheme.sys.color.surface.background};
        cursor: pointer;
    }
  `
}

export const QuickStyle = (props: ToolSettingPanelProps | MobileSidePanelContentOptions) => {
  const { widgetId } = props

  const config = ReactRedux.useSelector((state: IMState) => {
    const appState = state.appStateInBuilder ? state.appStateInBuilder : state
    return appState.appConfig.widgets[widgetId]?.config
  })

  const selectedType = !config?.styleConfig?.useCustom && config?.styleConfig?.themeStyle?.quickStyleType

  const onChange = (t: ThemeButtonType) => {
    let newConfig = config.setIn(['styleConfig', 'useCustom'], false)
    newConfig = newConfig.setIn(['styleConfig', 'themeStyle', 'quickStyleType'], t)
    newConfig = newConfig.set('styleConfig', newConfig.styleConfig.without('customStyle'))
    getAppConfigAction().editWidgetConfig(widgetId, newConfig).exec()
  }

  const theme = useTheme()
  const theme2 = useTheme2()
  const isUseTheme2 = useUseTheme2()
  const appTheme = window.jimuConfig.isBuilder !== isUseTheme2 ? theme2 : theme
  const builderTheme = window.jimuConfig.isBuilder !== isUseTheme2 ? theme : theme2
  const translate = hooks.useTranslation(jimuUIMessages)

  return <div css={getStyle(appTheme, builderTheme)}>
    <ThemeSwitchComponent useTheme2={window.jimuConfig.isBuilder}>
    {
      THEMETYPES.map((t, i) =>
        <div key={i} className={classNames('quick-style-item', { 'quick-style-item-selected': selectedType === t })} onClick={() => { onChange(t) }}>
          <Link title={translate('variableButton')}
            role="button"
            className="button-item text-truncate" type={t}
          >
            {translate('variableButton')}
          </Link>
        </div>
      )
    }
    </ThemeSwitchComponent>
  </div>
}
