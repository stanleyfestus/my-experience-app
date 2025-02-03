import { React, hooks } from 'jimu-core'
import { WidgetPlaceholder } from 'jimu-ui'
import defaultMessages from '../translations/default'
const analysisIcon = require('jimu-icons/svg/outlined/brand/widget-analysis.svg')

interface PlaceholderProps {
  show?: boolean
  widgetId: string
}

export const Placeholder = (props: PlaceholderProps) => {
  const { widgetId, show } = props

  const translate = hooks.useTranslation(defaultMessages)

  return show
    ? <WidgetPlaceholder
      icon={analysisIcon}
      widgetId={widgetId}
      message={translate('_widgetLabel')} />
    : null
}
