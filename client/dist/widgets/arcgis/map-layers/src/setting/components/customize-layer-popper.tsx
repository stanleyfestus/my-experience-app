/** @jsx jsx */
import { Switch } from 'jimu-ui'
import defaultMessages from '../translations/default'
import {
  JimuLayerViewSelector,
  SettingRow,
  SettingSection
} from 'jimu-ui/advanced/setting-components'
import { getStyleForLI } from '../lib/style'
import { jsx, defaultMessages as jimuCoreDefaultMessages, hooks, React } from 'jimu-core'
import { type WidgetSettingProps } from '../setting'
import { MapViewManager } from 'jimu-arcgis'

interface Props {
  mapViewId: string
  isCustomizeEnabled: boolean
  settingProps: WidgetSettingProps
}

export default function CustomizeLayerPopper (props: Props) {
  const {
    mapViewId,
    isCustomizeEnabled,
    settingProps
  } = props
  const translate = hooks.useTranslation(defaultMessages, jimuCoreDefaultMessages)
  const localMapView = MapViewManager.getInstance().getJimuMapViewById(mapViewId)

  const getAllTreeItemKeys = React.useCallback(() => {
    let result = Object.keys(localMapView?.jimuLayerViews || {})
    if (settingProps.config?.showTables) {
      result = result.concat(...Object.keys(localMapView?.jimuTables))
    }
    return result
  }, [localMapView?.jimuLayerViews, localMapView?.jimuTables, settingProps.config?.showTables])

  const selectedValues = React.useMemo(() => {
    // For the app that has `showJimuLayerViewIds`, uses it directly
    if (settingProps.config?.customizeLayerOptions?.[mapViewId]?.showJimuLayerViewIds) {
      return settingProps.config?.customizeLayerOptions?.[mapViewId]?.showJimuLayerViewIds.asMutable()
    }
    // For the old app, use previous logic
    const keys = getAllTreeItemKeys()
    const hiddenSet = new Set(settingProps.config?.customizeLayerOptions?.[mapViewId]?.hiddenJimuLayerViewIds)
    return keys.filter(key => {
      return !hiddenSet.has(key)
    })
  }, [getAllTreeItemKeys, mapViewId, settingProps.config?.customizeLayerOptions])

  const onCustomizeLayerChange = (showJimuLayerViewIds: string[]) => {
    const newConfig = settingProps.config.setIn(['customizeLayerOptions', mapViewId, 'showJimuLayerViewIds'], showJimuLayerViewIds)

    settingProps.onSettingChange({
      id: settingProps.id,
      config: newConfig
    })
  }

  const onToggleCustomizeLayer = async (mapViewId: string, isEnabled: boolean) => {
    const keys = getAllTreeItemKeys()
    if (!isEnabled) {
      // Restore the layer's listMode
      const selectedSet = new Set(selectedValues)
      const hiddenValues = keys.filter(key => !selectedSet.has(key))
      for (const hiddenLayerViewId of hiddenValues) {
        const jimuLayerView = await localMapView.whenJimuLayerViewLoaded(hiddenLayerViewId)
        const layerObj = jimuLayerView.layer
        layerObj.listMode = 'show'
      }
    }

    // No matter it's on/off, clean up the ids array
    settingProps.onSettingChange({
      id: settingProps.id,
      config: settingProps.config.setIn(['customizeLayerOptions', mapViewId], {
        isEnabled: isEnabled,
        hiddenJimuLayerViewIds: [],
        // Store all layer ids when enabling customization
        showJimuLayerViewIds: isEnabled ? [...keys] : []
      })
    })
  }

  return (
    <React.Fragment>
      <div className="w-100 h-100" css={getStyleForLI(settingProps.theme)}>
        <div className="w-100 h-100 layer-item-panel">
          <SettingSection>
            <SettingRow label={translate('customizeLayers')}>
              <Switch
                className="can-x-switch"
                checked={isCustomizeEnabled}
                data-key="customizeLayers"
                onChange={(event) => {
                  onToggleCustomizeLayer(mapViewId, event.target.checked)
                }}
                aria-label={translate('customizeLayers')}
              />
            </SettingRow>
            {isCustomizeEnabled && (
              <SettingRow>
                <JimuLayerViewSelector
                  // Use key attribute to force create new component instance
                  key={mapViewId}
                  jimuMapViewId={mapViewId}
                  onChange={onCustomizeLayerChange}
                  isMultiSelection
                  selectedValues={selectedValues}
                  isShowTables={settingProps.config?.showTables}
                ></JimuLayerViewSelector>
              </SettingRow>
            )}
          </SettingSection>
        </div>
      </div>
    </React.Fragment>
  )
}
