/** @jsx jsx */
import { React, hooks, jsx, css, DataSourceManager, Immutable, uuidv1, classNames, type ImmutableArray, type UseDataSource, utils as jimuCoreUtils } from 'jimu-core'
import {
  LayerTypes, type JimuMapView, type JimuLayerView, type JimuFeatureLayerView, type JimuSceneLayerView, type JimuBuildingComponentSublayerView,
  type JimuImageryLayerView, type JimuOrientedImageryLayerView, type JimuSubtypeGroupLayerView, type JimuSubtypeSublayerView
} from 'jimu-arcgis'
import { defaultMessages as jimuUIMessages, Button, Tooltip, Loading } from 'jimu-ui'
import { DataMapOutlined } from 'jimu-icons/outlined/gis/data-map'
import { DataSceneOutlined } from 'jimu-icons/outlined/gis/data-scene'
import { SettingOutlined } from 'jimu-icons/outlined/application/setting'
import { DownOutlined } from 'jimu-icons/outlined/directional/down'
import { UpOutlined } from 'jimu-icons/outlined/directional/up'
import { WarningOutlined } from 'jimu-icons/outlined/suggested/warning'
import { SettingRow, SidePopper, JimuLayerViewSelector } from 'jimu-ui/advanced/setting-components'
import { List, type TreeItemType, type CommandType, type CommandActionDataType, type _TreeItem } from 'jimu-ui/basic/list-tree'
import LayerItemDetail from './layer-item-detail'
import TitleWithSwitch from './title-with-switch'
import defaultMessages from '../translations/default'
import { type DataSourceItem, type IMDataSourceItem, type IMJimuMapViewConfigInfo, getDefaultIMJimuMapViewConfigInfo } from '../../config'
import { isSupportedJimuLayerView, getFinalAllowGeneratedForMap, getFinalEnableAttributeSelectionForMap, sortDataSourceItemsByLayersOrder } from '../../utils'
import selectByAttributeIconSrc from 'jimu-icons/svg/outlined/application/attribute.svg'

interface MapLayersSettingProps {
  jimuMapView: JimuMapView
  jimuMapViewConfigInfo: IMJimuMapViewConfigInfo
  onJimuMapViewConfigInfoChange: (jimuMapViewId: string, jimuMapViewConfigInfo: IMJimuMapViewConfigInfo) => void
}

export type SelectableJimuLayerView = JimuFeatureLayerView | JimuSceneLayerView | JimuBuildingComponentSublayerView | JimuImageryLayerView | JimuOrientedImageryLayerView | JimuSubtypeGroupLayerView | JimuSubtypeSublayerView

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
      justify-content: flex-end;
      min-width: 20px;

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
`

/**
 * Select layers and configure filters for one JimuMapView.
 */
export default function MapLayersSetting (props: MapLayersSettingProps) {
  const {
    jimuMapView,
    onJimuMapViewConfigInfoChange
  } = props

  const jimuMapViewConfigInfo = props.jimuMapViewConfigInfo || getDefaultIMJimuMapViewConfigInfo()
  const syncWithMap = !!(jimuMapViewConfigInfo.syncWithMap)
  const allowGenerated = !!(jimuMapViewConfigInfo.allowGenerated)
  const enableAttributeSelection = !!(jimuMapViewConfigInfo.enableAttributeSelection)
  const rawDataSourceItems = props.jimuMapViewConfigInfo?.dataSourceItems

  const translate = hooks.useTranslation(jimuUIMessages, defaultMessages)

  const mapDataSource = DataSourceManager.getInstance().getDataSource(jimuMapView.dataSourceId)
  const mapDataSourceLabel = mapDataSource?.getLabel() || ''

  const jimuMapViewId = jimuMapView.id
  const jimuMapViewIdRef = React.useRef<string>(jimuMapViewId)
  jimuMapViewIdRef.current = jimuMapViewId
  const isWebScene = jimuMapView.view?.type === '3d'

  // isLayersAndDataSourcesLoaded is true means all JimuLayerViews loaded and all related data sources of the JimuLayerViews are created
  const [isLayersAndDataSourcesLoaded, setIsLayersAndDataSourcesLoaded] = React.useState<boolean>(false)

  // If rawDataSourceItems is undefined, means it likes first opened.
  const isRawDataSourceItemsUndefined = !rawDataSourceItems
  const isRawDataSourceItemsUndefinedRef = React.useRef<boolean>(isRawDataSourceItemsUndefined)
  isRawDataSourceItemsUndefinedRef.current = isRawDataSourceItemsUndefined

  // rawDataSourceItems maybe undefined, so need to wrap it with imDataSourceItems, the following code should use imDataSourceItems instead of rawDataSourceItems
  const imDataSourceItems = React.useMemo(() => {
    return Immutable(rawDataSourceItems || []) as Immutable.ImmutableArray<DataSourceItem>
  }, [rawDataSourceItems])

  const configuredJimuLayerViewIds = React.useMemo(() => {
    const newConfiguredJimuLayerViewIds: string[] = []
    imDataSourceItems.forEach(dataSourceItem => {
      newConfiguredJimuLayerViewIds.push(dataSourceItem.jimuLayerViewId)
    })
    return newConfiguredJimuLayerViewIds
  }, [imDataSourceItems])

  const [isJimuLayerViewSelectorSidePopperOpened, setIsJimuLayerViewSelectorSidePopperOpened] = React.useState<boolean>(false)
  const mapLayersSettingBtnRef = React.useRef<HTMLButtonElement>(null)

  // allSelectableJimuLayerViews means the JimuLayerViews that have data source and not generated at runtime
  const [allSelectableJimuLayerViews, setAllSelectableJimuLayerViews] = React.useState<SelectableJimuLayerView[]>([])
  const [currentJimuLayerViewIdToShowDetail, setCurrentJimuLayerViewIdToShowDetail] = React.useState<string>('')

  // const allSelectableJimuLayerViewIds = React.useMemo(() => {
  //   return allSelectableJimuLayerViews.map(jimuLayerView => jimuLayerView.id)
  // }, [allSelectableJimuLayerViews])

  // all JimuLayerViews that can show in JimuLayerViewSelector, include FeatureJimuLayerView/SceneJimuLayerView and their ancestor JimuLayerViews
  const allAvailableJimuLayerViewIdsObjForJimuLayerViewSelector = React.useMemo(() => {
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

  const currentLayerItemToShowDetail = React.useMemo(() => {
    if (currentJimuLayerViewIdToShowDetail) {
      return imDataSourceItems.find(layerItem => layerItem.jimuLayerViewId === currentJimuLayerViewIdToShowDetail)
    }

    return null
  }, [currentJimuLayerViewIdToShowDetail, imDataSourceItems])

  const onCustomizeMapSwitchChange = React.useCallback((evt, checked: boolean) => {
    const newSyncWithMap = !checked
    let newJimuMapViewConfigInfo = jimuMapViewConfigInfo.set('syncWithMap', newSyncWithMap)

    if (newSyncWithMap) {
      // If sync with map,
      // allowGenerated should be set to true
      // enableAttributeSelection should be set to false
      // dataSourceItems should be set to undefined (not empty array)
      newJimuMapViewConfigInfo = newJimuMapViewConfigInfo
        .set('allowGenerated', true)
        .set('enableAttributeSelection', false)
        .set('dataSourceItems', undefined) // set to undefined (not empty array) because we want to select all visible JimuQueriableLayerView again when syncWithMap is set to false
    }

    onJimuMapViewConfigInfoChange(jimuMapViewId, newJimuMapViewConfigInfo)
  }, [jimuMapViewConfigInfo, jimuMapViewId, onJimuMapViewConfigInfoChange])

  const onAllowGeneratedLayersSwitchChange = React.useCallback((evt, checked: boolean) => {
    const newJimuMapViewConfigInfo = jimuMapViewConfigInfo.set('allowGenerated', checked)
    onJimuMapViewConfigInfoChange(jimuMapViewId, newJimuMapViewConfigInfo)
  }, [jimuMapViewConfigInfo, jimuMapViewId, onJimuMapViewConfigInfoChange])

  const onGlobalAttributeSelectionSwitchChange = React.useCallback((evt, checked: boolean) => {
    let newJimuMapViewConfigInfo = jimuMapViewConfigInfo.set('enableAttributeSelection', checked)

    if (!checked) {
      // need to remove all sqlExpressions if the global attribute selection is disabled
      const newDataSourceItems = imDataSourceItems.map(dataSourceItem => {
        const newDataSourceItem = dataSourceItem.set('sqlExpression', null)
        return newDataSourceItem
      })
      newJimuMapViewConfigInfo = newJimuMapViewConfigInfo.set(jimuMapViewId, newDataSourceItems)
    }

    onJimuMapViewConfigInfoChange(jimuMapViewId, newJimuMapViewConfigInfo)
  }, [imDataSourceItems, jimuMapViewConfigInfo, jimuMapViewId, onJimuMapViewConfigInfoChange])

  // update data source items to config
  const updateIMDataSourceItemsConfig = React.useCallback((imNewDataSourceItems: ImmutableArray<DataSourceItem>) => {
    const newJimuMapViewConfigInfo = jimuMapViewConfigInfo.set('dataSourceItems', imNewDataSourceItems)
    onJimuMapViewConfigInfoChange(jimuMapViewId, newJimuMapViewConfigInfo)
  }, [jimuMapViewConfigInfo, jimuMapViewId, onJimuMapViewConfigInfoChange])

  // update data source items to config, this method will also sort the data source items by map layers order
  const updateAndSortDataSourceItemsConfig = React.useCallback((newDataSourceItems: DataSourceItem[]) => {
    const sortedNewDataSourceItems = sortDataSourceItemsByLayersOrder(jimuMapView, newDataSourceItems)
    const imSortedNewDataSourceItems = Immutable(sortedNewDataSourceItems)
    updateIMDataSourceItemsConfig(imSortedNewDataSourceItems)
  }, [jimuMapView, updateIMDataSourceItemsConfig])
  const updateAndSortDataSourceItemsConfigRef = React.useRef<typeof updateAndSortDataSourceItemsConfig>()
  updateAndSortDataSourceItemsConfigRef.current = updateAndSortDataSourceItemsConfig

  const [isLayerListVisible, setIsLayerListVisible] = React.useState<boolean>(false)

  // callback when click list item
  const onClickListItem = React.useCallback((refComponent: _TreeItem) => {
    // LayerItemDetail component is used to configure sqlExpression and sqlHint,
    // so it is only available when the global enableAttributeSelection is true.
    if (enableAttributeSelection) {
      const itemJsons = refComponent?.props?.itemJsons
      const itemJson = itemJsons?.length > 0 ? itemJsons[0] : null

      if (itemJson) {
        const jimuLayerViewId = itemJson.itemKey
        setCurrentJimuLayerViewIdToShowDetail(jimuLayerViewId)
      }
    }
  }, [enableAttributeSelection])

  // configured items in config
  const listItemsJson = React.useMemo((): TreeItemType[] => {
    const result: TreeItemType[] = []

    imDataSourceItems.forEach(imDataSourceItem => {
      const {
        jimuLayerViewId,
        sqlExpression
      } = imDataSourceItem

      if (!jimuLayerViewId) {
        return
      }

      const jimuLayerView = allSelectableJimuLayerViews.find(item => item.id === jimuLayerViewId)

      if (!jimuLayerView) {
        return
      }

      const itemStateChecked = !!(jimuLayerViewId && jimuLayerViewId === currentJimuLayerViewIdToShowDetail)
      const itemStateDisabled = !enableAttributeSelection
      const layerTitle = jimuLayerView.layer?.title || ''

      let commands: CommandType[] = []

      const hasSql = sqlExpression?.parts?.length > 0

      if (hasSql) {
        // only show sql icon when user has configured sqlExpression
        commands = [
          {
            label: '',

            // IconComponentProps
            iconProps: {
              icon: selectByAttributeIconSrc,
              size: 16
            },

            action: ({ data }: CommandActionDataType) => {
              onClickListItem(data?.refComponent)
            }
          }
        ]
      }

      const treeItem: TreeItemType = {
        itemKey: jimuLayerViewId,
        itemStateChecked,
        itemStateDisabled,
        itemStateTitle: layerTitle,
        itemStateCommands: commands
      }

      result.push(treeItem)
    })

    return result
  }, [allSelectableJimuLayerViews, currentJimuLayerViewIdToShowDetail, enableAttributeSelection, onClickListItem, imDataSourceItems])

  // wait for all JimuLayerViews loaded and all related data sources of the JimuLayerViews are created
  React.useEffect(() => {
    async function getJimuLayerViews () {
      const thisJimuMapViewId = jimuMapView.id
      const allJimuLayerViewsObj = await jimuMapView.whenAllJimuLayerViewLoaded()
      const allJimuLayerViews: JimuLayerView[] = Object.values(allJimuLayerViewsObj)
      const allJimuQueriableLayerViews: SelectableJimuLayerView[] = allJimuLayerViews.filter(jimuLayerView => {
        return (!jimuLayerView.fromRuntime) && isSupportedJimuLayerView(jimuLayerView)
      }) as SelectableJimuLayerView[]

      // only filter the JimuLayerView that has data source
      const promises = allJimuQueriableLayerViews.map(jimuLayerView => jimuLayerView.createLayerDataSource())

      try {
        await Promise.all(promises)
      } catch (e) {
        // some SceneLayer can't create data source, it is as expected, just log it
        console.log(e)
      }

      // If the Map widget has two web maps, there will be two MapLayersSetting instances.
      // In Builder, both JimuLayerViews and data sources are created by default, then the above async code logic just take little time (about 20ms).
      // So the two MapLayersSetting instances run here almost at the same time, and they call updateAndSortDataSourceItemsConfigRef.current(dataSourceItems) at the same time,
      // and they call onDataSourceItemsChange almost at the same time.
      // By test, MapLayersSetting1 calls onDataSourceItemsChange at time1, and MapLayersSetting2 calls onDataSourceItemsChange at (time1 + 3ms).
      // Calling onDataSourceItemsChange will update the config.
      // Here is the expected workflow:
      // MapLayersSetting1 (webmap1) calls onDataSourceItemsChange: config -> config1, config1.mapInfo only includes layer items of webmap1
      // MapLayersSetting2 (webmap2) calls onDataSourceItemsChange: config1 -> config2, config2 merge config1, config2.mapInfo includes layer items of both webmap1 and webmap2

      // Here is the real workflow:
      // MapLayersSetting1 (webmap1) calls onDataSourceItemsChange: config -> config1, config1.mapInfo only includes layer items of webmap1
      // MapLayersSetting2 (webmap2) calls onDataSourceItemsChange: config -> config2, config2 replace config1, config2.mapInfo only includes layer items of webmap2

      // To solve the above issue, we need to increase the time interval between MapLayersSetting2.onDataSourceItemsChange and MapLayersSetting1.onDataSourceItemsChange.
      if (!jimuMapView.isActive) {
        // By test, the duration of MapLayersSetting2.onDataSourceItemsChange and MapLayersSetting1.onDataSourceItemsChange is about 3ms, we use 500ms for safety.
        await waitTime(500)
      }

      const allSelectableJimuLayerViews: SelectableJimuLayerView[] = allJimuQueriableLayerViews.filter(jimuLayerView => !!jimuLayerView.getLayerDataSource())

      // need to check if the current view is changed
      if (jimuMapViewIdRef.current === thisJimuMapViewId) {
        setAllSelectableJimuLayerViews(allSelectableJimuLayerViews)
        setIsLayersAndDataSourcesLoaded(true)
      }
    }

    getJimuLayerViews()
  }, [jimuMapView])

  React.useEffect(() => {
    // When user first connects to the JimuMapView and syncWithMap is false, we need to save all visible JimuQueriableLayerView into config by default.
    if (isLayersAndDataSourcesLoaded && isRawDataSourceItemsUndefinedRef.current && !syncWithMap) {
      const initialConfigJimuLayerViews = allSelectableJimuLayerViews.filter(jimuLayerView => {
        // only select visible layers by default
        if (!jimuLayerView.isLayerVisible()) {
          return false
        }

        if (jimuLayerView.type === LayerTypes.SubtypeGroupLayer) {
          const subtypeGroupLayerView = jimuLayerView as JimuSubtypeGroupLayerView

          // SubtypeGrouplayer and SubtypeSublayer are mutually exclusive. By default, we include all SubtypeSublayers and exclude all SubtypeGrouplayers as the initial config.
          if (subtypeGroupLayerView.layer?.sublayers?.length > 0) {
            return false
          }
        }

        return true
      })

      const dataSourceItems: DataSourceItem[] = initialConfigJimuLayerViews.map(jimuLayerView => getDataSourceItemByJimuLayerView(jimuLayerView))

      if (updateAndSortDataSourceItemsConfigRef.current) {
        updateAndSortDataSourceItemsConfigRef.current(dataSourceItems)
      }
    }
  }, [allSelectableJimuLayerViews, isLayersAndDataSourcesLoaded, syncWithMap])

  const onMapLayersSettingBtnClicked = React.useCallback(() => {
    setIsJimuLayerViewSelectorSidePopperOpened(true)
  }, [])

  const onToggleLayerListBtnClicked = React.useCallback(() => {
    setIsLayerListVisible(visible => !visible)
  }, [])

  const onLayerItemDetailPopperToggle = React.useCallback(() => {
    setCurrentJimuLayerViewIdToShowDetail('')
  }, [setCurrentJimuLayerViewIdToShowDetail])

  // sqlExpression or sqlHint changed for one dataSourceItem
  const onLayerItemDetailUpdate = React.useCallback((newImDataSourceItem: IMDataSourceItem) => {
    const newImDataSourceItems = imDataSourceItems.map((item) => {
      if (newImDataSourceItem.jimuLayerViewId && item.jimuLayerViewId === newImDataSourceItem.jimuLayerViewId) {
        return newImDataSourceItem
      } else {
        return item
      }
    }) as unknown as ImmutableArray<DataSourceItem>

    updateIMDataSourceItemsConfig(newImDataSourceItems)
  }, [imDataSourceItems, updateIMDataSourceItemsConfig])

  const onJimuLayerViewSelectorSidePopperToggle = React.useCallback(() => {
    setIsJimuLayerViewSelectorSidePopperOpened(false)
  }, [])

  // Hide the JimuLayerViews that not in allAvailableJimuLayerViewIdsObjForJimuLayerViewSelector.
  const jimuLayerViewSelectorHideLayers = React.useCallback((jimuLayerView: JimuLayerView) => {
    const jimuLayerViewId = jimuLayerView.id
    return !allAvailableJimuLayerViewIdsObjForJimuLayerViewSelector[jimuLayerViewId]
  }, [allAvailableJimuLayerViewIdsObjForJimuLayerViewSelector])

  // If JimuLayerView is not in allSelectableJimuLayerViews, disable selecting in JimuLayerViewSelector.
  const jimuLayerViewSelectorDisableLayers = React.useCallback((jimuLayerView: JimuLayerView) => {
    return !allSelectableJimuLayerViews.includes(jimuLayerView as SelectableJimuLayerView)
  }, [allSelectableJimuLayerViews])

  /**
   * JimuLayerViewSelector change
   * @param newSelectedJimuLayerViewIds newSelectedJimuLayerViewIds is the new all selected JimuLayerViewIds, not the diff changed JimuLayerViewIds
   */
  const onJimuLayerViewSelectorChange = (newSelectedJimuLayerViewIds: string[]) => {
    newSelectedJimuLayerViewIds = Array.from(new Set(newSelectedJimuLayerViewIds))

    // handle SubtypeGrouplayer and SubtypeSublayer start
    // SubtypeGrouplayer and SubtypeSublayer are mutually exclusive.
    let needExcludeJimuLayerViewIds: string[] = []

    const oldConfigJimuLayerViewIds = imDataSourceItems.map(imDataSourceItem => imDataSourceItem.jimuLayerViewId).asMutable()
    const { added: addedJimuLayerViewIds } = jimuCoreUtils.diffArrays(true, oldConfigJimuLayerViewIds, newSelectedJimuLayerViewIds)
    addedJimuLayerViewIds.forEach(addedJimuLayerViewId => {
      if (addedJimuLayerViewId) {
        const jimuLayerView = jimuMapView.jimuLayerViews?.[addedJimuLayerViewId]

        if (jimuLayerView) {
          if (jimuLayerView.type === LayerTypes.SubtypeGroupLayer) {
            // exclude all the child SubtypeSublayer ids
            const childJimuLayerViewIds = jimuMapView.getChildJimuLayerViewIds(jimuLayerView.id)
            needExcludeJimuLayerViewIds.push(...childJimuLayerViewIds)
          } else if (jimuLayerView.type === LayerTypes.SubtypeSublayer) {
            // exclude the parent SubtypeGroupLayer id
            if (jimuLayerView.parentJimuLayerViewId) {
              needExcludeJimuLayerViewIds.push(jimuLayerView.parentJimuLayerViewId)
            }
          }
        }
      }
    })
    // needExcludeJimuLayerViewIds maybe have duplicate ids
    needExcludeJimuLayerViewIds = Array.from(new Set(needExcludeJimuLayerViewIds))
    // remove needExcludeJimuLayerViewIds from newSelectedJimuLayerViewIds
    newSelectedJimuLayerViewIds = newSelectedJimuLayerViewIds.filter(jimuLayerViewId => !needExcludeJimuLayerViewIds.includes(jimuLayerViewId))
    newSelectedJimuLayerViewIds = Array.from(new Set(newSelectedJimuLayerViewIds))
    // handle SubtypeGrouplayer and SubtypeSublayer end

    const allSelectableJimuLayerViewIds = allSelectableJimuLayerViews.map(jimuLayerView => jimuLayerView.id)
    let { saved: intersectionJimuLayerViewIds } = jimuCoreUtils.diffArrays(true, allSelectableJimuLayerViewIds, newSelectedJimuLayerViewIds)
    intersectionJimuLayerViewIds = Array.from(new Set(intersectionJimuLayerViewIds))

    const dataSourceItemsObj: { [key: string]: DataSourceItem } = {}

    imDataSourceItems.forEach(imDataSourceItem => {
      const jimuLayerViewId = imDataSourceItem.jimuLayerViewId
      dataSourceItemsObj[jimuLayerViewId] = imDataSourceItem.asMutable() as unknown as DataSourceItem
    })

    const newDataSourceItems: DataSourceItem[] = []

    intersectionJimuLayerViewIds.forEach(jimuLayerViewId => {
      let dataSourceItem = dataSourceItemsObj[jimuLayerViewId]

      if (!dataSourceItem) {
        // the jimuLayerViewId is newly selected
        if (jimuMapView) {
          const jimuLayerView = jimuMapView.jimuLayerViews[jimuLayerViewId]

          if (jimuLayerView) {
            dataSourceItem = getDataSourceItemByJimuLayerView(jimuLayerView)
          }
        }
      }

      if (dataSourceItem) {
        newDataSourceItems.push(dataSourceItem)
      }
    })

    updateAndSortDataSourceItemsConfig(newDataSourceItems)
  }

  const jimuLayerViewSelectorSidePopperTrigger: HTMLElement[] = []

  if (mapLayersSettingBtnRef.current) {
    jimuLayerViewSelectorSidePopperTrigger.push(mapLayersSettingBtnRef.current)
  }

  return (
    <div className='map-layers-setting' css={style}>
      <div className='map-layers-header w-100 d-flex align-items-center mt-4'>
        {
          isWebScene && <DataSceneOutlined className='mr-2' />
        }

        {
          !isWebScene && <DataMapOutlined className='mr-2' />
        }

        <SettingRow
          flow='no-wrap'
          className='map-layers-header-setting-row w-100'
          label={mapDataSourceLabel}
          aria-label={mapDataSourceLabel}
        >
          <div className='map-title-icon-container d-flex align-items-center'>
            {
              !isLayersAndDataSourcesLoaded &&
              <div className='setting-loading-container'>
                <Loading type="DONUT" />
              </div>
            }

            {
              isLayersAndDataSourcesLoaded && allSelectableJimuLayerViews.length === 0 &&
              <Tooltip title={translate('noAvailableLayers')} showArrow={false} placement='top'>
                <span>
                  <Button
                    className='border-0'
                    disabled={!isLayersAndDataSourcesLoaded}
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

            {
              isLayersAndDataSourcesLoaded && allSelectableJimuLayerViews.length > 0 &&
              <Tooltip title={translate('customizeLayers')} showArrow={false} placement='top'>
                <span>
                  <Button
                    ref={mapLayersSettingBtnRef}
                    className='map-layers-setting-btn p-0 border-0'
                    disabled={!isLayersAndDataSourcesLoaded}
                    type='tertiary'
                    icon={true}
                    size='sm'
                    onClick={onMapLayersSettingBtnClicked}
                  >
                    <SettingOutlined
                      size={16}
                    />
                  </Button>
                </span>
              </Tooltip>
            }

            {
              !syncWithMap && isLayersAndDataSourcesLoaded && allSelectableJimuLayerViews.length > 0 &&
              <Button
                className='layer-list-toggle-btn ml-1 p-0 border-0'
                type='tertiary'
                icon={true}
                size='sm'
                onClick={onToggleLayerListBtnClicked}
              >
                {
                  isLayerListVisible &&
                  <UpOutlined
                    size={16}
                  />
                }

                {
                  !isLayerListVisible &&
                  <DownOutlined
                    size={16}
                  />
                }
              </Button>
            }
          </div>
        </SettingRow>
      </div>

      {
        !syncWithMap &&
        <List
          className={classNames(['w-100 mt-1', { 'd-none': !isLayerListVisible }])}
          dndEnabled={false}
          showCheckbox={false}
          itemsJson={listItemsJson}
          onClickItemBody={(actionData, refComponent) => {
            onClickListItem(refComponent)
          }}
        />
      }

      {
        isJimuLayerViewSelectorSidePopperOpened &&
        <SidePopper
          isOpen={true}
          toggle={onJimuLayerViewSelectorSidePopperToggle}
          position='right'
          trigger={jimuLayerViewSelectorSidePopperTrigger}
          title={translate('customizeLayers')}
        >
          <SettingRow
            className='w-100 pl-4 pr-4'
            label={mapDataSourceLabel}
            aria-label={mapDataSourceLabel}
          ></SettingRow>

          <SettingRow flow='wrap' className='w-100 pl-4 pr-4'>
            <TitleWithSwitch
              checked={!syncWithMap}
              titleKey='customizeLayers'
              onSwitchChange={onCustomizeMapSwitchChange}
            />

            <TitleWithSwitch
              disabled={syncWithMap}
              checked={getFinalAllowGeneratedForMap(syncWithMap, allowGenerated)}
              titleKey='allowGeneratedData'
              className='mt-3'
              onSwitchChange={onAllowGeneratedLayersSwitchChange}
            />

            <TitleWithSwitch
              disabled={syncWithMap}
              checked={getFinalEnableAttributeSelectionForMap(syncWithMap, enableAttributeSelection)}
              titleKey='attributeSelection'
              className='mt-3'
              onSwitchChange={onGlobalAttributeSelectionSwitchChange}
            />
          </SettingRow>

          {/* Need to use a div to wrapper JimuLayerViewSelector to fix the scrollbar issue. */}
          {
            !syncWithMap &&
            <div className='select-jimu-layer-view-selector-container p-4'>
              <JimuLayerViewSelector
                jimuMapViewId={jimuMapViewId}
                isMultiSelection={true}
                selectedValues={configuredJimuLayerViewIds.slice()}
                hideLayers={jimuLayerViewSelectorHideLayers}
                disableLayers={jimuLayerViewSelectorDisableLayers}
                onChange={onJimuLayerViewSelectorChange}
              />
            </div>
          }
        </SidePopper>
      }

      {
        (jimuMapView && currentLayerItemToShowDetail) &&
        <SidePopper
          isOpen={true}
          toggle={onLayerItemDetailPopperToggle}
          position='right'
          trigger={[]}
          title={translate('configureLayerAttribute')}
        >
          <LayerItemDetail
            jimuMapView={jimuMapView}
            currentDataSourceItem={currentLayerItemToShowDetail}
            onLayerItemDetailUpdate={onLayerItemDetailUpdate}
          />
        </SidePopper>
      }
    </div>
  )
}

function getDataSourceItemByJimuLayerView (jimuLayerView: JimuLayerView): DataSourceItem {
  const uid = uuidv1()
  const useDataSource = getUseDataSourceByJimuLayerView(jimuLayerView)
  const jimuLayerViewId = jimuLayerView.id

  const dataSourceItem: DataSourceItem = {
    uid,
    sqlHint: '',
    useDataSource,
    sqlExpression: null,
    jimuLayerViewId
  }

  return dataSourceItem
}

function getUseDataSourceByJimuLayerView (jimuLayerView: JimuLayerView): UseDataSource {
  const ds = jimuLayerView.getLayerDataSource()
  const dsId = ds.id
  const mainDs = ds.getMainDataSource()
  const rootDs = ds.getRootDataSource()
  const mainDataSourceId = mainDs ? mainDs.id : dsId
  const rootDsId = rootDs ? rootDs.id : ''

  const useDataSource: UseDataSource = {
    dataSourceId: dsId,
    mainDataSourceId,
    rootDataSourceId: rootDsId
  }

  return useDataSource
}

function waitTime (ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}
