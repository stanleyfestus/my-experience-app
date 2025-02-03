/** @jsx jsx */
import {
  React, hooks, jsx, css, DataSourceManager, classNames, urlUtils, type ImmutableObject,
  type IMThemeVariables, type IntlShape, type UseDataSource, Immutable, AllDataSourceTypes,
  type ImmutableArray
} from 'jimu-core'
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
import { constructConfig, isSupportedJimuLayerView } from '../../utils'

interface MapLayersSettingProps {
  jimuMapView: JimuMapView
  widgetId: string
  theme: IMThemeVariables
  theme2: IMThemeVariables
  intl: IntlShape
  isMapMode: boolean
  sidePopperTrigger?: HTMLDivElement
  mapViewConfig?: ImmutableObject<MapViewConfig>
  useDataSources: ImmutableArray<UseDataSource>
  onLayerItemClick: (dsId: string, index: number) => void
  onMapSettingClick: (viewId: string) => void
  onLayerSettingChange: (viewId: string, key: string, value, useDs?: UseDataSource[]) => void
  onMultipleLayerSettingChange: (viewId: string, updateOptions: any, useDs?: UseDataSource[]) => void
  onMapLayersConfigChange: (key: string, value, useDs?: UseDataSource[]) => void
  onMapLayersMultipleConfigChange: (updateOptions: any, useDs?: UseDataSource[]) => void
  onDataSourceFieldsChange: (updateDataSource: UseDataSource, updateInfo: { id: string, usedFields: string[] }) => void
  onMapLayersConfigActiveIdSet: (activeId: string) => void
}

export type SelectableJimuLayerView = JimuFeatureLayerView | JimuSceneLayerView

const partSupportedDsTypes = Immutable([
  AllDataSourceTypes.FeatureLayer, AllDataSourceTypes.SceneLayer, AllDataSourceTypes.BuildingComponentSubLayer,
  AllDataSourceTypes.OrientedImageryLayer, AllDataSourceTypes.ImageryLayer, AllDataSourceTypes.SubtypeSublayer
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
    jimuMapView, mapViewConfig, theme, theme2, widgetId, intl, isMapMode, sidePopperTrigger, useDataSources: propUseDataSources = Immutable([]),
    onLayerItemClick, onMapSettingClick, onLayerSettingChange, onMultipleLayerSettingChange, onMapLayersConfigChange,
    onMapLayersMultipleConfigChange, onDataSourceFieldsChange, onMapLayersConfigActiveIdSet
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
      const newSelectableJimuLayerViews: SelectableJimuLayerView[] = allJimuFeatureLayerViewsOrJimuSceneLayerViews.filter(jimuLayerView => !!jimuLayerView.getLayerDataSource())
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

  const getUseDs = (ds, customInit?: boolean) => {
    if (!ds) return null
    return {
      dataSourceId: ds.id,
      mainDataSourceId: ds.getMainDataSource().id,
      dataViewId: ds.dataViewId,
      rootDataSourceId: ds.getRootDataSource()?.id,
      ...(customInit ? { useFieldsInPopupInfo: true } : {})
    }
  }

  const onCustomizeToggle = useCallback(async (viewId: string, enabled: boolean) => {
    // if (enabled && (!temporaryConfig?.customJimuLayerViewIds || temporaryConfig.customJimuLayerViewIds.length === 0)) {
    let updatedUseDataSource = propUseDataSources.asMutable({ deep: true })
    if (enabled) {
      const jimuLayerViews = jimuMapView.jimuLayerViews
      const jimuTables = jimuMapView.jimuTables
      const allViewIds = []
      for (const layerViewId in jimuLayerViews) {
        const jimuLayerView = jimuLayerViews[layerViewId]
        const layerValid = jimuLayerView.isLayerVisible() && isSupportedJimuLayerView(jimuLayerView)
        if (layerValid) {
          allViewIds.push(layerViewId)
          const layerDs = jimuLayerView?.getLayerDataSource()
          const useDataSource = getUseDs(layerDs, true)
          updatedUseDataSource = getUpdatedUseDataSources(updatedUseDataSource, 'add', useDataSource)
        }
      }
      for (const layerTableId in jimuTables) {
        const jimuTable = jimuTables[layerTableId]
        const layerValid = jimuTable.visible
        if (layerValid) {
          allViewIds.push(layerTableId)
          const layerDataSourceId = jimuMapView.getDataSourceIdByAPILayer(jimuTable)
          const tableDs = DataSourceManager.getInstance().getDataSource(layerDataSourceId)
          const mapDs = jimuMapView.getMapDataSource()
          let layerDs = tableDs
          if (!tableDs && mapDs) {
            layerDs = await mapDs.createDataSourceByLayer(jimuTable)
          }
          const useDataSource = getUseDs(layerDs, true)
          updatedUseDataSource = getUpdatedUseDataSources(updatedUseDataSource, 'add', useDataSource)
        }
      }
      const updateConfig = {
        customJimuLayerViewIds: allViewIds,
        customizeLayers: enabled
      }
      onMultipleLayerSettingChange(viewId, updateConfig, updatedUseDataSource)
    } else {
      const jimuLayerViews = jimuMapView.jimuLayerViews
      const jimuTables = jimuMapView.jimuTables
      for (const layerViewId in jimuLayerViews) {
        const jimuLayerView = jimuLayerViews[layerViewId]
        const layerValid = jimuLayerView.isLayerVisible() && isSupportedJimuLayerView(jimuLayerView)
        if (layerValid) {
          const layerDs = jimuLayerView?.getLayerDataSource()
          const removedUseDataSource = getUseDs(layerDs)
          updatedUseDataSource = getUpdatedUseDataSources(updatedUseDataSource, 'remove', removedUseDataSource)
        }
      }
      for (const layerTableId in jimuTables) {
        const jimuTable = jimuTables[layerTableId]
        const layerValid = jimuTable.visible
        if (layerValid) {
          const layerDataSourceId = jimuMapView.getDataSourceIdByAPILayer(jimuTable)
          const tableDs = DataSourceManager.getInstance().getDataSource(layerDataSourceId)
          const mapDs = jimuMapView.getMapDataSource()
          let layerDs = tableDs
          if (!tableDs && mapDs) {
            layerDs = await mapDs.createDataSourceByLayer(jimuTable)
          }
          const removedUseDataSource = getUseDs(layerDs)
          updatedUseDataSource = getUpdatedUseDataSources(updatedUseDataSource, 'remove', removedUseDataSource)
        }
      }
      onLayerSettingChange(viewId, 'customizeLayers', enabled, updatedUseDataSource)
    }
  }, [jimuMapView, onLayerSettingChange, onMultipleLayerSettingChange, propUseDataSources])

  // Hide the JimuLayerViews that not in allAvailableJimuLayerViewIdsObjForJimuLayerViewSelector.
  const jimuLayerViewSelectorHideLayers = useCallback((jimuLayerView: JimuLayerView) => {
    const jimuLayerViewId = jimuLayerView.id
    return !allAvailableJimuLayerViewIdsObjForJimuLayerViewSelector[jimuLayerViewId]
  }, [allAvailableJimuLayerViewIdsObjForJimuLayerViewSelector])

  // If JimuLayerView is not in allSelectableJimuLayerViews, disable selecting in JimuLayerViewSelector.
  const jimuLayerViewSelectorDisableLayers = useCallback((jimuLayerView: JimuLayerView) => {
    return !allSelectableJimuLayerViews.includes(jimuLayerView as SelectableJimuLayerView)
  }, [allSelectableJimuLayerViews])

  const getTemporaryConfig = async () => {
    const jimuLayerViews = jimuMapView.jimuLayerViews
    const jimuTables = jimuMapView.jimuTables
    const newLayersConfig = [] as LayersConfig[]
    for (const layerViewId in jimuLayerViews) {
      const layerDs = jimuLayerViews[layerViewId]?.getLayerDataSource()
      if (!layerDs || !partSupportedDsTypes.includes(layerDs.type as any)) continue
      const currentDs = dsManager.getDataSource(layerDs.id)
      const configInSetting = mapViewConfig?.layersConfig.find(item => item.id === layerDs.id)
      let thisLayerConfig
      if (configInSetting) {
        thisLayerConfig = configInSetting
      } else {
        const defaultConfig = constructConfig(currentDs, true, undefined, jimuLayerViews[layerViewId].jimuMapViewId || jimuMapView.id)
        thisLayerConfig = defaultConfig
      }
      newLayersConfig.push(thisLayerConfig)
    }
    for (const tableLayerId in jimuTables) {
      const tableLayer = jimuTables[tableLayerId]
      const layerDataSourceId = jimuMapView.getDataSourceIdByAPILayer(tableLayer)
      const tableDs = dsManager.getDataSource(layerDataSourceId)
      const mapDs = jimuMapView.getMapDataSource()
      let layerDs = tableDs
      if (!tableDs && mapDs) {
        layerDs = await mapDs.createDataSourceByLayer(tableLayer)
      }
      if (!layerDs || !partSupportedDsTypes.includes(layerDs.type as any)) continue
      const configInSetting = mapViewConfig?.layersConfig.find(item => item.id === layerDs.id)
      let thisLayerConfig
      if (configInSetting) {
        thisLayerConfig = configInSetting
      } else {
        const defaultConfig = constructConfig(layerDs, true, undefined, jimuMapView.id)
        thisLayerConfig = defaultConfig
      }
      newLayersConfig.push(thisLayerConfig)
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

  const minusArray = (array1, array2) => {
    const lengthFlag = array1.length > array2.length
    const arr1 = lengthFlag ? array1 : array2
    const arr2 = lengthFlag ? array2 : array1
    return arr1.filter(item => {
      const hasId = arr2.some(ele => {
        return ele === item
      })
      return !hasId
    })
  }

  const onViewSelectorChange = async (newSelectedViewIds: string[]) => {
    const jimuLayerViews = jimuMapView.jimuLayerViews
    const jimuTables = jimuMapView.jimuTables
    const originalViewIds = mapViewConfig?.customJimuLayerViewIds
    const diffId = minusArray(newSelectedViewIds, originalViewIds)
    const jimuLayerView = jimuLayerViews[diffId]
    const jimuTable = jimuTables[diffId]
    let newDS
    if (jimuLayerView) {
      newDS = jimuLayerView.getLayerDataSource()
    } else if (jimuTable) {
      const layerDataSourceId = jimuMapView.getDataSourceIdByAPILayer(jimuTable)
      const tableDs = DataSourceManager.getInstance().getDataSource(layerDataSourceId)
      const mapDs = jimuMapView.getMapDataSource()
      newDS = tableDs
      if (!tableDs && mapDs) {
        newDS = await mapDs.createDataSourceByLayer(jimuTable)
      }
    }
    const useDataSource = getUseDs(newDS, true)
    let updatedUseDataSource = propUseDataSources.asMutable({ deep: true })
    if (newSelectedViewIds.length > originalViewIds.length) {
      updatedUseDataSource = getUpdatedUseDataSources(updatedUseDataSource, 'add', useDataSource)
    } else {
      updatedUseDataSource = getUpdatedUseDataSources(updatedUseDataSource, 'remove', useDataSource)
    }
    onLayerSettingChange(jimuMapView.id, 'customJimuLayerViewIds', newSelectedViewIds, updatedUseDataSource)
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

  const handleMapLayersConfigChange = (key: string, value) => {
    onMapLayersConfigChange(key, value, propUseDataSources.asMutable({ deep: true }))
  }

  const handleMapLayersMultipleConfigChange = (options: any) => {
    onMapLayersMultipleConfigChange(options, propUseDataSources.asMutable({ deep: true }))
  }

  const handleMultiOptionsAndUseDsChange = (options: any, useDs) => {
    onMapLayersMultipleConfigChange(options, useDs)
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
            {isLayersAndDsLoaded && allSelectableJimuLayerViews.length > 0 && temporaryConfig &&
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
            onLayerItemClick(layerConfig.parentViewId, layerTabIndex)
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
              checked={temporaryConfig?.customizeLayers}
              data-key='customizeLayers'
              onChange={(event) => {
                onCustomizeToggle(temporaryConfig?.parentViewId, event.target.checked)
              }}
              aria-label={translate('customizeLayers')}
            />
          </SettingRow>
          {temporaryConfig?.customizeLayers &&
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
                  isShowTables={true}
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
        title={translate('layerConfig')}
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
          appTheme={theme2}
          widgetId={widgetId}
          newAddFlag={false}
          optionChange={handleMapLayersConfigChange}
          multiOptionsChange={handleMapLayersMultipleConfigChange}
          multiOptionsAndUseDsChange={handleMultiOptionsAndUseDsChange}
          orgUseDataSources={propUseDataSources}
          onDataSourceFieldsChange={onDataSourceFieldsChange}
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

const getUpdatedUseDataSources = (useDataSources: UseDataSource[], type: 'add' | 'remove', useDataSource: UseDataSource) => {
  let updatedUseDataSources = useDataSources || []
  if (type === 'remove') {
    updatedUseDataSources = updatedUseDataSources.filter(item => item.dataSourceId !== useDataSource.dataSourceId)
  } else if (type === 'add' && useDataSource && !updatedUseDataSources.find(item => item.dataSourceId === useDataSource.dataSourceId)) {
    updatedUseDataSources = updatedUseDataSources.concat([useDataSource])
  }
  return updatedUseDataSources.length > 0 ? updatedUseDataSources : undefined
}
