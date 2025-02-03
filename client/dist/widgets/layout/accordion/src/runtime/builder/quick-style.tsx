/** @jsx jsx */
import { React, ReactRedux, classNames, jsx, css, type IMState, Immutable } from 'jimu-core'
import { Icon } from 'jimu-ui'
import { type ToolSettingPanelProps } from 'jimu-layouts/layout-runtime'
import { quickStyles } from '../../quickstyles'
import style1Icon from './style1.svg'
import style2Icon from './style2.svg'
import style3Icon from './style3.svg'
import style4Icon from './style4.svg'
import { getAppConfigAction } from 'jimu-for-builder'

const styleIcons = [style1Icon, style2Icon, style3Icon, style4Icon]

const style = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  padding: 1rem;
  .card-item {
    background: var(--ref-palette-neutral-300);
    padding: 15px;
    cursor: pointer;
    width: 130px;
    height: 130px;
    &:hover, &.active {
      outline: 2px solid var(--ref-palette-primary-600);
    }
  }
  .quick-style-thumb {
    width: 100%;
    height: 100%;
  }
`

export function QuickStyle (props: ToolSettingPanelProps) {
  const { widgetId } = props

  const selectedType = ReactRedux.useSelector((state: IMState) => {
    let appConfig
    if (window.jimuConfig.isBuilder) {
      appConfig = state.appStateInBuilder.appConfig
    } else {
      appConfig = state.appConfig
    }
    const widgetJson = appConfig.widgets[widgetId]
    return widgetJson?.config?.useQuickStyle
  })

  const handleQuickStyleChange = React.useCallback((type: number) => {
    const appConfigAction = getAppConfigAction()
    const config = Immutable(quickStyles.length >= type ? quickStyles[type - 1] : quickStyles[0])

    appConfigAction.editWidgetProperty(widgetId, 'config', config).exec()
  }, [widgetId])

  return (
    <div css={style}>
      {[1, 2, 3, 4].map((type, index) => {
        return (
          <div key={index} className={classNames('card-item', { active: selectedType === type })} onClick={() => { handleQuickStyleChange(type) }}>
            <Icon className='quick-style-thumb' icon={styleIcons[index]} />
          </div>
        )
      })}
    </div>
  )
}
