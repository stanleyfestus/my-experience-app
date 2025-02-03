/**@jsx jsx */
import { React, jsx, ReactRedux, type IMState, hooks, type IMLayoutItemJson } from 'jimu-core'
import { getFallbackPlacementsModifier } from 'jimu-ui'
import { getTheme2 } from 'jimu-theme'
import { shallowEqual } from 'react-redux'
import { getWidgetChildLayoutJson } from '../common/layout-utils'
import { BASE_LAYOUT_NAME } from '../../common/consts'
import { LayoutItemToolbar } from 'jimu-layouts/layout-builder'

interface WidgetToolbarProps {
  id: string
}

export default function WidgetToolbar (props: WidgetToolbarProps) {
  const { id } = props

  const { layoutId, layoutItem } = ReactRedux.useSelector((state: IMState) => {
    const selection = state.appRuntimeInfo?.selection
    const layoutJson = getWidgetChildLayoutJson(id, BASE_LAYOUT_NAME)
    let layoutId: string, layoutItem: IMLayoutItemJson
    if (selection && selection.layoutId === layoutJson.id && layoutJson.content[selection.layoutItemId]) {
      layoutId = selection.layoutId
      layoutItem = layoutJson.content[selection.layoutItemId]
    }
    return { layoutId, layoutItem }
  }, shallowEqual)

  const [refElement, setRefElement] = React.useState<HTMLElement>(null)
  React.useEffect(() => {
    if (layoutId && layoutItem) {
      // widget loading could be very slow, try get refElement at most 20 times
      let tryCount = 0
      const updateInterval = setInterval(() => {
        tryCount++
        const newRefElement = (document.querySelector(`.single-widget-launcher:has(.widget-renderer[data-widgetid=${layoutItem?.widgetId}])`) ||
          document.querySelector(`.multiple-widget-launcher:has(.widget-renderer[data-widgetid=${layoutItem?.widgetId}])`) ||
          document.querySelector(`.mobile-panel-popper:has(.widget-renderer[data-widgetid=${layoutItem?.widgetId}])`))
        setRefElement(newRefElement as HTMLElement)
        if (tryCount >= 20 || newRefElement) clearInterval(updateInterval)
      }, 100)
    } else {
      setRefElement(null)
    }
  }, [layoutId, layoutItem])

  const modifiers = React.useMemo(() => [
    {
      name: 'preventOverflow',
      enabled: true,
      options: {
        boundary: 'viewport',
        altAxis: true // allow the popper to overlap its reference element.
      }
    },
    {
      name: 'flip',
      enabled: true,
      options: {
        boundary: 'body',
        fallbackPlacements: getFallbackPlacementsModifier(['top-start', 'bottom-start'], true).options.fallbackPlacements
      }
    }
  ], [])

  const translate = hooks.useTranslation()

  return layoutId && layoutItem && refElement && <React.Fragment>
      <LayoutItemToolbar
        key={layoutId + layoutItem.id}
        layoutId={layoutId}
        layoutItem={layoutItem}
        refElement={refElement}
        modifiers={modifiers}
        builderTheme={getTheme2()}
        formatMessage={translate}
        showDefaultTools={false}
      />
  </React.Fragment>
}
