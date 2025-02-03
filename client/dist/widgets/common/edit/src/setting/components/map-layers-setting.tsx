/** @jsx jsx */
import { React, hooks, jsx, css, DataSourceManager, classNames, urlUtils, type ImmutableObject, type IMThemeVariables, type IntlShape, Immutable, AllDataSourceTypes, type ImmutableArray } from 'jimu-core'
import { type JimuMapView, type JimuLayerView, type JimuFeatureLayerView, type JimuSceneLayerView } from 'jimu-arcgis'
import { defaultMessages as jimuUIMessages, Button, Tooltip, Loading, Switch } from 'jimu-ui'
import { DataMapOutlined } from 'jimu-icons/outlined/gis/data-map'
import { DataSceneOutlined } from 'jimu-icons/outlined/gis/data-scene'
import { SettingOutlined } from 'jimu-icons/outlined/application/setting'
import { DownOutlined } from 'jimu-icons/outlined/directional/down'
import { UpOutlined } from 'jimu-icons/outlined/directional/up'
import { WarningOutlined } from 'jimu-icons/outlined/suggested/warning'
import { SettingRow, SidePopper, JimuLayerViewSelector } from 'jimu-ui/advanced/setting-components'
import { List } from 'jimu-ui/basic/list-tree'
import LayerConfig from '../layer-config'
import defaultMessages from '../translations/default'
import { type LayersConfig, type MapViewConfig } from '../../config'
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { builderAppSync } from 'jimu-for-builder'
import { constructConfig, isSupportedJimuLayerView, sortJimuLayerViews } from '../../utils'
import { getMapAllLayersDs } from '../../common-builder-support'

interface MapLayersSettingProps {
  jimuMapView: JimuMapView
  widgetId: string
  theme: IMThemeVariables
  theme2: IMThemeVariables
  intl: IntlShape
  isMapMode: boolean
  sidePopperTrigger?: HTMLDivElement
  mapViewConfig?: ImmutableObject<MapViewConfig>
  useMapWidgetIds?: ImmutableArray<string>
  onLayerItemClick: (dsId: string, index: number) => void
  onMapSettingClick: (viewId: string) => void
  onLayerSettingChange: (viewId: string, key: string, value) => void
  onMultipleLayerSettingChange: (viewId: string, updateOptions: any) => void
  onMapLayersConfigChange: (key: string, value) => void
  onMapLayersMultipleConfigChange: (updateOptions: any) => void
  onMapLayersConfigActiveIdSet: (activeId: string) => void
}

export type SelectableJimuLayerView = JimuFeatureLayerView | JimuSceneLayerView

const partSupportedDsTypes = Immutable([
  AllDataSourceTypes.FeatureLayer, AllDataSourceTypes.SceneLayer, AllDataSourceTypes.BuildingComponentSubLayer,
  AllDataSourceTypes.OrientedImageryLayer, AllDataSourceTypes.SubtypeSublayer
])

const style = css`
  .map-layers-header-setting-row.jimu-widget-setting--row-label {
    margin-top: 0 !important;
  }

  .map-layers-header-setting-row {
    width: calc(100% - 22px);
    max-width: calc(100% - 22px);

    .jimu-widget-setting--row-label {
      width: 100%;
      flex-basis: 100%;
      flex-shrink: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .map-title-icon-container {
      flex-wrap: no-wrap;
      flex-shrink: 0;
      flex-grow: 0;

      .setting-loading-container {
        position: relative;
        height: 16px;
        width: 16px;

        .donut-loading {
          width: 16px !important;
          height: 16px !important;
          left: 0 !important;
          right: 0 !important;
          top: 0 !important;
          bottom: 0 !important;
        }
      }
    }
  }

  .jimu-tree-item.jimu-tree-item_template-card.jimu-tree-item_disabled-false .jimu-tree-item__content .jimu-tree-item__body:hover {
    cursor: pointer !important;
  }
`

export default function MapLayersSetting (props: MapLayersSettingProps) {
  const {
    jimuMapView, mapViewConfig, theme, widgetId, intl, isMapMode, sidePopperTrigger, useMapWidgetIds,
    onLayerItemClick, onMapSettingClick, onLayerSettingChange, onMultipleLayerSettingChange, onMapLayersConfigChange,
    onMapLayersMultipleConfigChange, onMapLayersConfigActiveIdSet
  } = props
  const translate = hooks.useTranslation(jimuUIMessages, defaultMessages)

  // state
  const [activeId, setActiveId] = useState<string>('')
  const [showLayerPanel, setShowLayerPanel] = useState<boolean>(false)
  const [popperFocusNode, setPopperFocusNode] = useState<HTMLElement>(null)
  // isLayersAndDsLoaded is true means all JimuLayerViews loaded and all related data sources of the JimuLayerViews are created
  const [isLayersAndDsLoaded, setIsLayersAndDsLoaded] = useState<boolean>(false)
  const [isViewSelectorPopperOpened, setIsViewSelectorPopperOpened] = useState<boolean>(false)
  // allSelectableJimuLayerViews means the JimuLayerViews that have data source and not generated at runtime
  const [allSelectableJimuLayerViews, setAllSelectableJimuLayerViews] = useState<SelectableJimuLayerView[]>([])
  const [isLayerListVisible, setIsLayerListVisible] = useState<boolean>(false)
  const [temporaryConfig, setTemporaryConfig] = useState<MapViewConfig>(null)

  // other variable
  const layerIndex = useRef(null)
  const dsManager = DataSourceManager.getInstance()
  const mapDataSource = dsManager.getDataSource(jimuMapView.dataSourceId)
  const mapDataSourceLabel = mapDataSource?.getLabel() || ''
  const jimuMapViewId = jimuMapView.id
  const jimuMapViewIdRef = useRef<string>(jimuMapViewId)
  jimuMapViewIdRef.current = jimuMapViewId
  const isWebScene = jimuMapView.view?.type === '3d'
  const mapLayersSettingBtnRef = useRef<HTMLButtonElement>(null)
  // all JimuLayerViews that can show in JimuLayerViewSelector, include FeatureJimuLayerView/SceneJimuLayerView and their ancestor JimuLayerViews
  const allAvailableJimuLayerViewIdsObjForJimuLayerViewSelector = useMemo(() => {
    const jimuLayerViewIdsObj: { [jimuLayerViewId: string]: boolean } = {}
    allSelectableJimuLayerViews.forEach(leafJimuLayerView => {
      jimuLayerViewIdsObj[leafJimuLayerView.id] = true
      const ancestorJimuLayerViews = leafJimuLayerView.getAllAncestorJimuLayerViews()
      ancestorJimuLayerViews.forEach(ancestorJimuLayerView => {
        jimuLayerViewIdsObj[ancestorJimuLayerView.id] = true
      })
    })
    return jimuLayerViewIdsObj
  }, [allSelectableJimuLayerViews])

  useEffect(() => {
    getTemporaryConfig()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapViewConfig, jimuMapView])

  useEffect(() => {
    async function getJimuLayerViews () {
      const thisJimuMapViewId = jimuMapView.id
      const allJimuLayerViewsObj = await jimuMapView.whenAllJimuLayerViewLoaded()
      const allJimuLayerViews: JimuLayerView[] = Object.values(allJimuLayerViewsObj)
      const allJimuFeatureLayerViewsOrJimuSceneLayerViews: SelectableJimuLayerView[] = allJimuLayerViews.filter(jimuLayerView => {
        return !jimuLayerView.fromRuntime && isSupportedJimuLayerView(jimuLayerView)
      }) as SelectableJimuLayerView[]
      // only filter the JimuLayerView that has data source
      const promises = allJimuFeatureLayerViewsOrJimuSceneLayerViews.map(jimuLayerView => jimuLayerView.createLayerDataSource())
      try {
        await Promise.all(promises)
      } catch (e) {
        // some SceneLayer can't create data source, it is as expected, just log it
        console.log(e)
      }
      // To solve the above issue, we need to increase the time interval between MapLayersSetting2.onDataSourceItemsChange and MapLayersSetting1.onDataSourceItemsChange.
      if (!jimuMapView.isActive) {
        // By test, the duration of MapLayersSetting2.onDataSourceItemsChange and MapLayersSetting1.onDataSourceItemsChange is about 3ms, we use 500ms for safety.
        await waitTime(500)
      }
      const newSelectableJimuLayerViews: SelectableJimuLayerView[] = allJimuFeatureLayerViewsOrJimuSceneLayerViews.filter(jimuLayerView => {
        return !!jimuLayerView.getLayerDataSource() && !!jimuLayerView.layer?.url
      })
      // need to check if the current view is changed
      if (jimuMapViewIdRef.current === thisJimuMapViewId) {
        setAllSelectableJimuLayerViews(newSelectableJimuLayerViews)
        setIsLayersAndDsLoaded(true)
      }
    }
    getJimuLayerViews()
  }, [jimuMapView])

  const onSettingClick = useCallback(() => {
    setIsViewSelectorPopperOpened(true)
    onMapSettingClick(jimuMapView.id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onToggleLayerListClick = useCallback(() => {
    setIsLayerListVisible(visible => !visible)
  }, [])

  const onViewSelectorPopperToggle = useCallback(() => {
    setIsViewSelectorPopperOpened(false)
  }, [])

  const onCustomizeToggle = useCallback((viewId: string, enabled: boolean) => {
    if (enabled && (!temporaryConfig?.customJimuLayerViewIds || temporaryConfig.customJimuLayerViewIds.length === 0)) {
      const allViewIds = Object.keys(jimuMapView.jimuLayerViews).filter(lvId => {
        const jimuLayerView = jimuMapView.jimuLayerViews[lvId]
        return isSupportedJimuLayerView(jimuLayerView)
      })
      // sort customJimuLayerViewIds by jimuLayerViews
      const jimuLayerViews = jimuMapView.jimuLayerViews
      if (jimuLayerViews) {
        const sortedJimuLayerViews = sortJimuLayerViews(Object.values(jimuLayerViews))
        allViewIds.sort((a, b) => {
          const aIndex = sortedJimuLayerViews?.findIndex(view => view.id === a)
          const bIndex = sortedJimuLayerViews?.findIndex(view => view.id === b)
          return aIndex - bIndex
        })
      }
      const updateConfig = {
        customJimuLayerViewIds: allViewIds,
        customizeLayers: enabled
      }
      onMultipleLayerSettingChange(viewId, updateConfig)
    } else {
      // close customizeLayers need to clear the un-used layersConfig
      const updateConfig = {
        layersConfig: [],
        customizeLayers: enabled
      }
      onMultipleLayerSettingChange(viewId, updateConfig)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onLayerSettingChange])

  // Hide the JimuLayerViews that not in allAvailableJimuLayerViewIdsObjForJimuLayerViewSelector.
  const jimuLayerViewSelectorHideLayers = useCallback((jimuLayerView: JimuLayerView) => {
    const jimuLayerViewId = jimuLayerView.id
    return !allAvailableJimuLayerViewIdsObjForJimuLayerViewSelector[jimuLayerViewId]
  }, [allAvailableJimuLayerViewIdsObjForJimuLayerViewSelector])

  // If JimuLayerView is not in allSelectableJimuLayerViews, disable selecting in JimuLayerViewSelector.
  const jimuLayerViewSelectorDisableLayers = useCallback((jimuLayerView: JimuLayerView) => {
    return !allSelectableJimuLayerViews.includes(jimuLayerView as SelectableJimuLayerView)
  }, [allSelectableJimuLayerViews])

  const getTemporaryConfig = () => {
    const jimuLayerViews = jimuMapView.jimuLayerViews
    const newLayersConfig = [] as LayersConfig[]
    for (const layerViewId in jimuLayerViews) {
      const layerDs = jimuLayerViews[layerViewId]?.getLayerDataSource()
      if (!layerDs || !partSupportedDsTypes.includes(layerDs.type as any) || !jimuLayerViews[layerViewId]?.layer?.url) continue
      const currentDs = dsManager.getDataSource(layerDs.id)
      const configInSetting = mapViewConfig?.layersConfig.find(item => item.id === layerDs.id)
      let thisLayerConfig
      if (configInSetting) {
        thisLayerConfig = configInSetting
      } else {
        const defaultConfig = constructConfig(currentDs, jimuLayerViews[layerViewId]?.jimuMapViewId)
        thisLayerConfig = defaultConfig
      }
      newLayersConfig.push(thisLayerConfig)
    }
    // sort by customJimuLayerViewIds or jimuLayerViews order
    const customizeLayers = mapViewConfig?.customizeLayers
    const customJimuLayerViewIds = mapViewConfig?.customJimuLayerViewIds
    if (customizeLayers && customJimuLayerViewIds?.length > 0) {
      newLayersConfig.sort((a, b) => {
        const aIndex = customJimuLayerViewIds?.findIndex(viewId => viewId.includes(a.id))
        const bIndex = customJimuLayerViewIds?.findIndex(viewId => viewId.includes(b.id))
        return aIndex - bIndex
      })
    } else {
      const sortedJimuLayerViews = sortJimuLayerViews(Object.values(jimuLayerViews))
      newLayersConfig.sort((a, b) => {
        const aIndex = sortedJimuLayerViews?.findIndex(view => view.id.includes(a.id))
        const bIndex = sortedJimuLayerViews?.findIndex(view => view.id.includes(b.id))
        return aIndex - bIndex
      })
    }
    const newMapViewConfig: MapViewConfig = {
      parentViewId: mapViewConfig?.parentViewId || jimuMapView.id,
      customizeLayers: mapViewConfig && 'customizeLayers' in mapViewConfig ? mapViewConfig.customizeLayers : false,
      customJimuLayerViewIds: mapViewConfig?.customJimuLayerViewIds?.asMutable({ deep: true }) || [],
      layersConfig: Immutable(newLayersConfig)
    }
    setTemporaryConfig(newMapViewConfig)
  }

  const getTreeItems = () => {
    const treeItems = []
    const usedLayerViewIds = temporaryConfig?.customJimuLayerViewIds?.map(item => {
      const prefixIndex = item.indexOf('-')
      return item.substring(prefixIndex + 1)
    })
    const filteredLayersConfig = temporaryConfig?.customizeLayers
      ? temporaryConfig?.layersConfig.filter(item => usedLayerViewIds.includes(item.id)) || []
      : temporaryConfig?.layersConfig || []
    filteredLayersConfig.forEach((config, index) => {
      treeItems.push({
        itemStateDetailContent: config,
        itemKey: `${index}`,
        itemStateChecked: showLayerPanel && index === layerIndex.current,
        itemStateTitle: config.name,
        itemStateCommands: []
      })
    })
    return treeItems
  }

  const onViewSelectorChange = (newSelectedViewIds: string[]) => {
    // sort customJimuLayerViewIds by jimuLayerViews
    const jimuLayerViews = jimuMapView.jimuLayerViews
    if (jimuLayerViews) {
      const sortedJimuLayerViews = sortJimuLayerViews(Object.values(jimuLayerViews))
      newSelectedViewIds.sort((a, b) => {
        const aIndex = sortedJimuLayerViews?.findIndex(view => view.id === a)
        const bIndex = sortedJimuLayerViews?.findIndex(view => view.id === b)
        return aIndex - bIndex
      })
    }
    onLayerSettingChange(jimuMapView.id, 'customJimuLayerViewIds', newSelectedViewIds)
  }

  const viewSelectorPopperTrigger: HTMLElement[] = []
  if (mapLayersSettingBtnRef.current) {
    viewSelectorPopperTrigger.push(mapLayersSettingBtnRef.current)
  }

  const setSidePopperAnchor = (index: number) => {
    const node = sidePopperTrigger.getElementsByClassName('jimu-tree-item__body')[index]
    setPopperFocusNode(node as HTMLElement)
  }

  const onShowLayerPanel = (index: number, currentTabId?: string) => {
    setSidePopperAnchor(index)
    if (index === layerIndex.current) {
      if (!showLayerPanel) {
        setActiveId(currentTabId)
        onMapLayersConfigActiveIdSet(currentTabId)
      }
      setShowLayerPanel(!showLayerPanel)
    } else {
      // refreshPanel: !this.state.refreshPanel
      setActiveId(currentTabId)
      onMapLayersConfigActiveIdSet(currentTabId)
      setShowLayerPanel(true)
      layerIndex.current = index
    }
  }

  const onCloseLayerPanel = () => {
    setShowLayerPanel(false)
    layerIndex.current = 0
  }

  const usedLayerViewIds = temporaryConfig?.customJimuLayerViewIds?.map(item => {
    const prefixIndex = item.indexOf('-')
    return item.substring(prefixIndex + 1)
  })
  const filteredLayersConfig = temporaryConfig?.customizeLayers
    ? temporaryConfig?.layersConfig?.filter(item => usedLayerViewIds.includes(item.id))
    : temporaryConfig?.layersConfig
    // check layer capability
  const allLayersDs = getMapAllLayersDs(useMapWidgetIds?.[0])
  const currentLayer = allLayersDs.find(layer => filteredLayersConfig?.[layerIndex.current]?.id === layer.id)
  const layerEditingEnabled = (currentLayer?.getMainDataSource() as any)?.layer?.editingEnabled ?? true

  return (
    <div className='map-layers-setting' css={style}>
      <div className='map-layers-header w-100 d-flex align-items-center mt-4'>
        {isWebScene ? <DataSceneOutlined className='mr-2' /> : <DataMapOutlined className='mr-2' />}
        <SettingRow
          flow='no-wrap'
          className='map-layers-header-setting-row w-100'
          label={mapDataSourceLabel}
          aria-label={mapDataSourceLabel}
        >
          <div className='map-title-icon-container d-flex align-items-center'>
            {!isLayersAndDsLoaded &&
              <div className='setting-loading-container'>
                <Loading type="DONUT" />
              </div>
            }
            {isLayersAndDsLoaded && allSelectableJimuLayerViews.length === 0 &&
              <Tooltip title={translate('noAvailableLayers')} showArrow={false} placement='top'>
                <span>
                  <Button
                    className='border-0'
                    disabled={!isLayersAndDsLoaded}
                    type='tertiary'
                    icon={true}
                    size='sm'
                  >
                    <WarningOutlined
                      size={16}
                      color={'var(--warning-600)'}
                    />
                  </Button>
                </span>
              </Tooltip>
            }
            {isLayersAndDsLoaded && allSelectableJimuLayerViews.length > 0 &&
              <Fragment>
                <Tooltip title={translate('selectLayers')} showArrow={false} placement='top'>
                  <span>
                    <Button
                      ref={mapLayersSettingBtnRef}
                      className='map-layers-setting-btn mr-1 p-0 border-0'
                      disabled={!isLayersAndDsLoaded}
                      type='tertiary'
                      icon={true}
                      size='sm'
                      onClick={onSettingClick}
                    >
                      <SettingOutlined size={16} />
                    </Button>
                  </span>
                </Tooltip>
                {temporaryConfig?.customizeLayers &&
                  <Button
                    className='layer-list-toggle-btn p-0 border-0'
                    type='tertiary'
                    icon={true}
                    size='sm'
                    onClick={onToggleLayerListClick}
                  >
                    {isLayerListVisible ? <UpOutlined size={16} /> : <DownOutlined size={16} />}
                  </Button>
                }
              </Fragment>
            }
          </div>
        </SettingRow>
      </div>

      {temporaryConfig?.customizeLayers &&
        <List
          className={classNames(['w-100 mt-1', { 'd-none': !isLayerListVisible }])}
          itemsJson={getTreeItems()}
          dndEnabled={false}
          renderOverrideItemDetailToggle={() => ''}
          onClickItemBody={(actionData, refComponent) => {
            const { itemJsons: [currentItemJson] } = refComponent.props
            const layerConfig = currentItemJson.itemStateDetailContent
            const currentTabId = layerConfig.id
            const layerTabIndex = +currentItemJson.itemKey
            onLayerItemClick(layerConfig.parentViewId || jimuMapView.id, layerTabIndex)
            onShowLayerPanel(layerTabIndex, currentTabId)
            if (activeId !== currentTabId) {
              builderAppSync.publishChangeWidgetStatePropToApp({ widgetId, propKey: 'activeTabId', value: currentTabId })
              builderAppSync.publishChangeWidgetStatePropToApp({ widgetId, propKey: 'settingChangeTab', value: true })
            }
          }}
        />
      }

      {isViewSelectorPopperOpened &&
        <SidePopper
          isOpen={true}
          toggle={onViewSelectorPopperToggle}
          position='right'
          trigger={viewSelectorPopperTrigger}
          title={translate('selectLayers')}
        >
          <SettingRow className='w-100 pl-4 pr-4' label={translate('customizeLayers')}>
            <Switch
              className='can-x-switch'
              checked={temporaryConfig.customizeLayers}
              data-key='customizeLayers'
              onChange={(event) => {
                onCustomizeToggle(temporaryConfig.parentViewId, event.target.checked)
              }}
              aria-label={translate('customizeLayers')}
            />
          </SettingRow>
          {temporaryConfig.customizeLayers &&
            <Fragment>
              <SettingRow
                className='w-100 pl-4 pr-4'
                label={mapDataSourceLabel}
                aria-label={mapDataSourceLabel}
              />
              {/* Need to use a div to wrapper JimuLayerViewSelector to fix the scrollbar issue. */}
              <div className='select-jimu-layer-view-selector-container p-4'>
                <JimuLayerViewSelector
                  key={jimuMapViewId}
                  jimuMapViewId={jimuMapViewId}
                  isMultiSelection={true}
                  selectedValues={temporaryConfig?.customJimuLayerViewIds}
                  hideLayers={jimuLayerViewSelectorHideLayers}
                  disableLayers={jimuLayerViewSelectorDisableLayers}
                  onChange={onViewSelectorChange}
                />
              </div>
            </Fragment>
          }
        </SidePopper>
      }

      <SidePopper
        position='right'
        isOpen={showLayerPanel && !urlUtils.getAppIdPageIdFromUrl().pageId}
        toggle={onCloseLayerPanel}
        trigger={sidePopperTrigger}
        backToFocusNode={popperFocusNode}
      >
        <LayerConfig
          {...filteredLayersConfig?.asMutable({ deep: true })[layerIndex.current]}
          isMapMode={isMapMode}
          intl={intl}
          theme={theme}
          layerEditingEnabled={layerEditingEnabled}
          optionChange={onMapLayersConfigChange}
          multiOptionsChange={onMapLayersMultipleConfigChange}
          onClose={onCloseLayerPanel}
        />
      </SidePopper>
    </div>
  )
}

function waitTime (ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}
