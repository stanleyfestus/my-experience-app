/** @jsx jsx */
import {
  React,
  Immutable,
  type ImmutableObject,
  type DataSourceJson,
  type IMState,
  jsx,
  type UseDataSource,
  urlUtils,
  DataSourceManager,
  type IMUseDataSource,
  type ImmutableArray,
  type DataSource,
  AllDataSourceTypes,
  type WidgetJson
} from 'jimu-core'
import {
  defaultMessages as jimuUIDefaultMessages,
  Button,
  Icon,
  Tooltip,
  Alert,
  Label,
  Radio,
  ConfirmDialog,
  Switch,
  Checkbox
} from 'jimu-ui'
import LayerConfig from './layer-config'
import {
  SettingSection,
  SettingRow,
  SidePopper,
  MapWidgetSelector
} from 'jimu-ui/advanced/setting-components'
import { type AllWidgetSettingProps, builderAppSync } from 'jimu-for-builder'
import {
  type IMConfig,
  type LayersConfig,
  TableArrangeType,
  TableModeType
} from '../config'
import defaultMessages from './translations/default'
import { List, TreeItemActionType } from 'jimu-ui/basic/list-tree'
import LayerConfigDataSource from './layer-config-ds'
import CloseOutlined from 'jimu-icons/svg/outlined/editor/close.svg'
import { ClickOutlined } from 'jimu-icons/outlined/application/click'
import { createRef, Fragment } from 'react'
import { JimuMapViewComponent, MapViewManager, type JimuMapView } from 'jimu-arcgis'
import { getStyle } from './style'
import MapLayersSetting from './components/map-layers-setting'
import { constructConfig, isSupportedJimuLayerView } from '../utils'
const messages = Object.assign({}, defaultMessages, jimuUIDefaultMessages)
const advancedActionMap = {
  overrideItemBlockInfo: ({ itemBlockInfo }, refComponent) => {
    return {
      name: TreeItemActionType.RenderOverrideItem,
      children: [{
        name: TreeItemActionType.RenderOverrideItemDroppableContainer,
        children: [{
          name: TreeItemActionType.RenderOverrideItemDraggableContainer,
          children: [{
            name: TreeItemActionType.RenderOverrideItemBody,
            children: [{
              name: TreeItemActionType.RenderOverrideItemMainLine,
              children: [{
                name: TreeItemActionType.RenderOverrideItemDragHandle
              }, {
                name: TreeItemActionType.RenderOverrideItemIcon,
                autoCollapsed: true
              }, {
                name: TreeItemActionType.RenderOverrideItemTitle
              }, {
                name: TreeItemActionType.RenderOverrideItemDetailToggle
              }, {
                name: TreeItemActionType.RenderOverrideItemCommands
              }]
            }]
          }]
        }]
      }]
    }
  }
}

interface ExtraProps {
  dsJsons: ImmutableObject<{ [dsId: string]: DataSourceJson }>
  activeTabId: string
  needUpdateConfig: { updateIds: string[], deleteIds: string[] }
}

export interface WidgetSettingState {
  activeId: string
  showLayerPanel: boolean
  refreshPanel: boolean
  dataSources: { [dsId: string]: DataSource }
  popperFocusNode: HTMLElement
  newAddFlag: boolean
  changeModeConfirmOpen: boolean
  jimuMapViews: { [viewId: string]: JimuMapView }
  activeJmViewId: string
}

export type WidgetSettingProps = AllWidgetSettingProps<IMConfig> & ExtraProps

export default class Setting extends React.PureComponent<
WidgetSettingProps,
WidgetSettingState
> {
  partSupportedDsTypes = Immutable([
    AllDataSourceTypes.FeatureLayer, AllDataSourceTypes.SceneLayer, AllDataSourceTypes.BuildingComponentSubLayer,
    AllDataSourceTypes.OrientedImageryLayer, AllDataSourceTypes.ImageryLayer, AllDataSourceTypes.SubtypeSublayer
  ])

  index: number
  dsManager: DataSourceManager
  dsHash: { [index: number]: ImmutableObject<UseDataSource> }
  sidePopperTrigger = createRef<HTMLDivElement>()
  toBeChangedMode: TableModeType
  customizeLayersRef: HTMLDivElement
  customizeLayersTrigger = createRef<HTMLDivElement>()

  static mapExtraStateProps = (
    state: IMState,
    props: AllWidgetSettingProps<IMConfig>
  ): ExtraProps => {
    return {
      dsJsons: state.appStateInBuilder.appConfig.dataSources,
      activeTabId: state.appStateInBuilder?.widgetsState[props.id]?.activeTabId,
      needUpdateConfig: state.appStateInBuilder?.widgetsState[props.id]?.needUpdateConfig || { updateIds: [], deleteIds: [] }
    }
  }

  constructor (props) {
    super(props)
    this.index = 0
    this.dsManager = DataSourceManager.getInstance()
    this.updateDsHash(
      this.props.config.layersConfig
        ? ((this.props.config.layersConfig as unknown) as LayersConfig[])
        : []
    )
    this.state = {
      activeId: props.activeTabId,
      showLayerPanel: false,
      refreshPanel: false,
      dataSources: {},
      popperFocusNode: null,
      newAddFlag: false,
      changeModeConfirmOpen: false,
      jimuMapViews: {},
      activeJmViewId: ''
    }
  }

  componentDidUpdate (prevProps: AllWidgetSettingProps<IMConfig> & ExtraProps) {
    const { activeId } = this.state
    const { activeTabId } = this.props
    if (activeTabId !== prevProps.activeTabId) {
      if (activeTabId !== activeId) {
        this.setState({ activeId: activeTabId })
      }
    }
  }

  updateDsHash = (layersConfig: LayersConfig[]) => {
    this.dsHash = {}
    let index = 0
    layersConfig.forEach(item => {
      const { useDataSource, tableFields } = item
      const usedFields = tableFields.map(f => f.jimuName)
      const newUpdateDataSource = Immutable(useDataSource).set('fields', usedFields)
      this.dsHash[index] = newUpdateDataSource
      index++
    })
  }

  getArrayMaxId (layersConfigs: ImmutableArray<LayersConfig>): number {
    const numbers = layersConfigs.map(layersConfig => {
      return layersConfig.id.split('-').reverse()[0]
    })
    return numbers.length > 0 ? Math.max.apply(null, numbers) : 0
  }

  getNewConfigId = (dsId): string => {
    const index =
      this.props.config?.layersConfig.length > 0
        ? this.getArrayMaxId(this.props.config.layersConfig)
        : 0
    return `${dsId}-${index + 1}`
  }

  flattenDataSources = (selectedDs: DataSource) => {
    const flatDataSources = []
    const recursionGetDs = (dataSource: DataSource) => {
      // isDataSourceSet is false represents the ds is leaf node
      if (dataSource.isDataSourceSet()) {
        const childDataSources = dataSource.getChildDataSources()
        childDataSources.forEach(ds => {
          recursionGetDs(ds)
        })
      } else {
        flatDataSources.push(dataSource)
      }
    }
    recursionGetDs(selectedDs)
    return flatDataSources
  }

  // save currentSelectedDs to array
  dataSourceChangeSave = (useDataSources: UseDataSource[]) => {
    if (!useDataSources) {
      return
    }
    const selectedDs: DataSource[] = useDataSources.map(useDataSource => DataSourceManager.getInstance().getDataSource(useDataSource.dataSourceId))
    const { config } = this.props
    const { layersConfig } = config
    const currentLayer = layersConfig[this.index]
    let count = 0
    const newAddedConfigs = []
    selectedDs.forEach(dataSource => {
      if (!dataSource?.getDataSourceJson()?.isHidden) {
        const newLayerItem = constructConfig(dataSource, false, this.getNewConfigId)
        newAddedConfigs.push(newLayerItem)
      }
      count++
    })
    const dsCount = selectedDs.length
    if (count === dsCount) {
      let newLayersConfig
      if (currentLayer && dsCount === 1) { // update layer config
        const _conf = layersConfig.asMutable({ deep: true })
        _conf.splice(this.index, 1, newAddedConfigs[0])
        newLayersConfig = Immutable(_conf)
      } else { // add new layer config
        const originalLayersConfig = layersConfig
        newLayersConfig = originalLayersConfig.concat(newAddedConfigs)
      }
      this.updateDsHash(newLayersConfig.asMutable({ deep: true }))
      const config = {
        id: this.props.id,
        config: this.props.config.set('layersConfig', newLayersConfig),
        useDataSources: this.getUseDataSourcesByDsHash()
      }
      this.props.onSettingChange(config)
      this.setState({ newAddFlag: false })
    }
  }

  runtimeConfigUpdate = (needUpdateConfig: { updateIds: string[], deleteIds: string[] }) => {
    const useDataSources = []
    const { jimuMapViews } = this.state
    Object.keys(jimuMapViews).forEach(viewId => {
      const jimuLayerViews = jimuMapViews[viewId].jimuLayerViews
      for (const layerViewId in jimuLayerViews) {
        const layerDs = jimuLayerViews[layerViewId]?.getLayerDataSource()
        const haveUrl = layerDs?.getDataSourceJson()?.url
        if (haveUrl && needUpdateConfig.updateIds.includes(layerViewId)) {
          useDataSources.push({
            dataSourceId: layerDs.id,
            mainDataSourceId: layerDs.id,
            dataViewId: layerDs.dataViewId,
            rootDataSourceId: layerDs.getRootDataSource()?.id,
            viewId
          })
        }
      }
    })
    this.bindMapLayersConfigSave(useDataSources, false, needUpdateConfig.deleteIds)
  }

  bindMapLayersConfigSave = async (useDataSources: any[], isNew: boolean, removedIds?: string[]) => {
    const nothingUpdate = (!removedIds || removedIds?.length === 0) && useDataSources?.length === 0
    if (nothingUpdate) return
    const { jimuMapViews } = this.state
    const { config } = this.props
    const { mapViewsConfig } = config
    // update newMapViewsConfig
    let count = 0
    const mapAllConfigs = []
    const newMapViewsConfig = isNew ? {} : mapViewsConfig.asMutable({ deep: true }) as any
    useDataSources.forEach((useDataSource, index) => {
      const viewId = useDataSource.viewId
      if (!newMapViewsConfig[viewId]) {
        const allViewIds = Object.keys(jimuMapViews[viewId].jimuLayerViews)
        newMapViewsConfig[viewId] = {
          parentViewId: viewId,
          customizeLayers: false,
          customJimuLayerViewIds: allViewIds,
          layersConfig: []
        }
      }
      const currentIMUseDs = Immutable(useDataSource)
      const currentDs = this.dsManager.getDataSource(currentIMUseDs.dataSourceId)
      if (this.partSupportedDsTypes.includes(currentDs?.type as any) && !currentDs?.getDataSourceJson()?.isHidden) {
        const newLayerConfig = constructConfig(currentDs, true)
        mapAllConfigs.push(newLayerConfig)
        const dataSourceId = useDataSource.dataSourceId
        const layerViewId = `${viewId}${dataSourceId.substring(dataSourceId.indexOf('-'))}`
        newMapViewsConfig[viewId].layersConfig.push(newLayerConfig)
        newMapViewsConfig[viewId].customJimuLayerViewIds.push(layerViewId)
      }
      count++
    })
    // delete newMapViewsConfig
    let deleteDone = false
    const needDelete = removedIds && removedIds.length > 0
    if (needDelete) {
      let viewCount = 0
      for (const jimuViewId in newMapViewsConfig) {
        const originLayersConfig = newMapViewsConfig[jimuViewId].layersConfig
        const newLayersConfig = originLayersConfig.filter(item => !removedIds.includes(item.id))
        newMapViewsConfig[jimuViewId].layersConfig = newLayersConfig
        viewCount++
      }
      if (viewCount === Object.keys(newMapViewsConfig).length) deleteDone = true
    } else {
      deleteDone = true
    }
    const dsCount = useDataSources.length
    if (count === dsCount && deleteDone) {
      this.updateDsHash(mapAllConfigs)
      const config = {
        id: this.props.id,
        config: this.props.config.set('mapViewsConfig', newMapViewsConfig),
        useDataSources: this.getUseDataSourcesByDsHash()
      }
      this.props.onSettingChange(config)
    }
  }

  onViewsCreate = (views: { [viewId: string]: JimuMapView }) => {
    const { id, needUpdateConfig } = this.props
    const viewsKeys = Object.keys(views)
    const viewsCount = viewsKeys.length
    const viewsLoaded = {}
    let index = 0
    viewsKeys.forEach(async viewId => {
      viewsLoaded[viewId] = false
      const jimuMapView = views[viewId]
      await jimuMapView.whenJimuMapViewLoaded()
      await jimuMapView.whenAllJimuLayerViewLoaded()
      viewsLoaded[viewId] = true
      index++
      if (index === viewsCount) {
        const isAllLoaded = Object.values(viewsLoaded).every(tag => tag)
        if (isAllLoaded) {
          this.setState({ jimuMapViews: views }, () => {
            if (needUpdateConfig.updateIds.length > 0 || needUpdateConfig.deleteIds.length > 0) {
              this.runtimeConfigUpdate(needUpdateConfig)
              builderAppSync.publishChangeWidgetStatePropToApp({ widgetId: id, propKey: 'needUpdateConfig', value: { updateIds: [], deleteIds: [] } })
            }
          })
        }
      }
    })
  }

  onCloseLayerPanel = () => {
    this.setState({ showLayerPanel: false })
    this.index = 0
  }

  getUniqueValues = (array1: any[] = [], array2: any[] = []): any[] => {
    const array = array1.concat(array2)
    const res = array.filter(function (item, index, array) {
      return array.indexOf(item) === index
    })
    return res
  }

  getUseDataSourcesByDsHash = (): UseDataSource[] => {
    const dsHash: any = {}
    Object.keys(this.dsHash).forEach(index => {
      const dsId = this.dsHash[index].dataSourceId
      let ds: IMUseDataSource
      if (!dsHash[dsId]) {
        ds = this.dsHash[index]
      } else {
        ds = Immutable({
          dataSourceId: this.dsHash[index].dataSourceId,
          mainDataSourceId: this.dsHash[index].mainDataSourceId,
          dataViewId: this.dsHash[index].dataViewId,
          rootDataSourceId: this.dsHash[index].rootDataSourceId,
          fields: this.getUniqueValues(
            dsHash[dsId].fields,
            (this.dsHash[index].fields as unknown) as any[]
          )
        })
      }
      dsHash[dsId] = ds
    })

    // get new array from hash
    const dsArray = []
    Object.keys(dsHash).forEach(dsId => {
      dsArray.push(dsHash[dsId])
    })
    return dsArray
  }

  removeLayer = (index: number) => {
    if (this.index === index) {
      this.onCloseLayerPanel()
    }
    // del current filter item
    const _layer = this.props.config.layersConfig.asMutable({ deep: true })
    _layer.splice(index, 1)
    const fis = this.props.config.set('layersConfig', _layer)

    // update dsHash
    delete this.dsHash[index]
    this.updateDsHash(_layer)

    const config = {
      id: this.props.id,
      config: fis,
      useDataSources: this.getUseDataSourcesByDsHash()
    }
    this.props.onSettingChange(config)

    if (this.index > index) {
      this.index--
    }
    builderAppSync.publishChangeWidgetStatePropToApp({
      widgetId: this.props.id,
      propKey: 'removeLayerFlag',
      value: true
    })
  }

  optionChangeSave = (prop: string, value: any) => {
    const currentLayer = this.props.config.layersConfig[this.index]
    if (currentLayer) {
      const orgConfig = this.props.config
      const newConfig = orgConfig.setIn(['layersConfig', this.index.toString()], { ...currentLayer, [prop]: value })
      const config = {
        id: this.props.id,
        config: newConfig
      }
      this.props.onSettingChange(config)
    }
  }

  multiOptionsChangeSave = (updateOptions: any) => {
    const currentLayer = this.props.config.layersConfig[this.index]
    if (currentLayer) {
      const orgConfig = this.props.config
      const newConfig = orgConfig.setIn(['layersConfig', this.index.toString()], { ...currentLayer, ...updateOptions })
      const config = {
        id: this.props.id,
        config: newConfig
      }
      this.props.onSettingChange(config)
    }
  }

  dataSourceFieldsChange = (updateDataSource: UseDataSource, updateInfo: { id: string, usedFields: string[] }) => {
    const { activeJmViewId } = this.state
    const { config } = this.props
    const { tableMode, layersConfig, mapViewsConfig } = config
    const isMapMode = tableMode === TableModeType.Map
    let usedConfigs
    if (isMapMode) {
      usedConfigs = mapViewsConfig[activeJmViewId].layersConfig.filter(item => updateDataSource?.dataSourceId === item?.useDataSource?.dataSourceId)
    } else {
      usedConfigs = layersConfig.filter(item => updateDataSource?.dataSourceId === item?.useDataSource?.dataSourceId)
    }
    let usedFields = []
    usedConfigs.forEach(config => {
      const { id, tableFields } = config
      if (id === updateInfo?.id) {
        usedFields = usedFields.concat(updateInfo?.usedFields)
      } else {
        const configUsedFields = tableFields.map(f => f.jimuName)
        usedFields = usedFields.concat(configUsedFields)
      }
    })
    const newSet = new Set(usedFields)
    const newUsedFields = Array.from(newSet)
    const { useDataSources } = this.props
    const index = useDataSources?.findIndex(item => item.dataSourceId === updateDataSource?.dataSourceId)
    if (index === undefined || index < 0) return
    const newUseDataSources = useDataSources.asMutable({ deep: true })
    const newUpdateDataSource = Immutable(updateDataSource).set('fields', newUsedFields).set('useFieldsInPopupInfo', false)
    newUseDataSources[index] = newUpdateDataSource.asMutable({ deep: true })
    this.props.onSettingChange({
      id: this.props.id,
      useDataSources: newUseDataSources
    })
  }

  formatMessage = (id: string, values?: { [key: string]: any }) => {
    return this.props.intl.formatMessage(
      { id: id, defaultMessage: messages[id] },
      values
    )
  }

  onMapLayersConfigActiveIdSet = (activeId: string) => {
    this.setState({ activeId })
  }

  onShowLayerPanel = (index: number, newAdded: boolean = false, currentTabId?: string) => {
    const { showLayerPanel } = this.state
    this.setSidePopperAnchor(index, newAdded)
    this.setState({ newAddFlag: newAdded })
    if (index === this.index) {
      if (!showLayerPanel) {
        this.setState({ activeId: currentTabId })
      }
      this.setState({ showLayerPanel: !showLayerPanel })
    } else {
      this.setState({
        activeId: currentTabId,
        showLayerPanel: true,
        refreshPanel: !this.state.refreshPanel
      })
      this.index = index
    }
  }

  switchTableType = (type: TableArrangeType) => {
    if (type !== this.props.config.arrangeType) {
      const config = {
        id: this.props.id,
        config: this.props.config.set('arrangeType', type)
      }
      this.props.onSettingChange(config)
    }
  }

  onItemUpdated = (parentItemJson, currentIndex: number) => {
    const { id, config } = this.props
    const newLayerConfigs = parentItemJson.map(item => {
      return item.itemStateDetailContent
    })
    const newConfig = {
      id,
      config: config.set('layersConfig', newLayerConfigs)
    }
    this.updateDsHash(newLayerConfigs)
    this.props.onSettingChange(newConfig)
  }

  onCreateDataSourceCreatedOrFailed = (dataSourceId: string, dataSource: DataSource) => {
    // The next state depends on the current state. Can't use this.state since it's not updated in in a cycle
    this.setState((state: WidgetSettingState) => {
      const newDataSources = Object.assign({}, state.dataSources)
      newDataSources[dataSourceId] = dataSource
      return { dataSources: newDataSources }
    })
  }

  isDataSourceAccessible = (dataSourceId: string) => {
    const dataSourceIsInProps = this.props.useDataSources?.filter(useDs => dataSourceId === useDs.dataSourceId).length > 0
    return this.state.dataSources[dataSourceId] !== null && dataSourceIsInProps
  }

  setSidePopperAnchor = (index?: number, newAdded = false) => {
    let node: any
    if (newAdded) {
      node = this.sidePopperTrigger.current.getElementsByClassName('add-table-btn')[0]
    } else {
      node = this.sidePopperTrigger.current.getElementsByClassName('jimu-tree-item__body')[index]
    }
    this.setState({ popperFocusNode: node })
  }

  onPropertyChange = (name, value) => {
    const { config } = this.props
    if (value === config[name]) {
      return
    }
    const newConfig = config.set(name, value)
    const alterProps = {
      id: this.props.id,
      config: newConfig
    }
    this.props.onSettingChange(alterProps)
  }

  onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    this.props.onSettingChange({
      id: this.props.id,
      useMapWidgetIds
    })
  }

  onTableModeChange = (value: TableModeType) => {
    this.toBeChangedMode = value
    const { config } = this.props
    const { tableMode, layersConfig } = config
    const isLayerMode = tableMode === TableModeType.Layer
    // no layer config, switching mode directly
    if (isLayerMode && layersConfig.length === 0) {
      const alterProps = {
        id: this.props.id,
        config: config.set('tableMode', value).set('enableMapExtentFilter', true).set('defaultExtentFilterEnabled', false)
      } as WidgetJson
      if (this.toBeChangedMode === TableModeType.Map) {
        alterProps.useDataSources = null
      } else {
        alterProps.useMapWidgetIds = null
        alterProps.useDataSources = null
      }
      this.props.onSettingChange(alterProps)
      this.setState({ showLayerPanel: false })
      return
    }
    if (value !== tableMode) {
      this.setState({ changeModeConfirmOpen: true })
    }
  }

  handleChangeModeOk = () => {
    const { config } = this.props
    const changeConfigArray = [
      { name: 'tableMode', value: this.toBeChangedMode },
      { name: 'layersConfig', value: [] },
      { name: 'mapViewsConfig', value: {} },
      { name: 'enableMapExtentFilter', value: this.toBeChangedMode === TableModeType.Map },
      { name: 'defaultExtentFilterEnabled', value: false }
    ]
    let newConfig = config
    changeConfigArray.forEach(item => {
      if (item.value === config[item.name]) return
      newConfig = newConfig.set(item.name, item.value)
    })
    const alterProps = {
      id: this.props.id,
      config: newConfig
    } as WidgetJson
    if (this.toBeChangedMode === TableModeType.Map) {
      alterProps.useDataSources = null
    } else {
      alterProps.useMapWidgetIds = null
      alterProps.useDataSources = null
    }
    this.props.onSettingChange(alterProps)
    this.setState({ changeModeConfirmOpen: false, showLayerPanel: false })
  }

  handleChangeModeClose = () => {
    this.setState({ changeModeConfirmOpen: false })
  }

  onLayerItemClick = (viewId: string, index: number) => {
    this.index = index
    this.setState({ activeJmViewId: viewId })
  }

  onMapSettingClick = (viewId: string) => {
    this.setState({ activeJmViewId: viewId })
  }

  isDataSourceEmpty = (): boolean => {
    const mapViews = MapViewManager.getInstance().getJimuMapViewGroup(this.props.useMapWidgetIds[0])?.jimuMapViews || {}
    // The connected widget only have ONE map view & have no data source
    if (Object.keys(mapViews).length === 1 && !Object.values(mapViews)?.[0]?.dataSourceId) {
      return true
    } else {
      return false
    }
  }

  getDefaultConfig = async () => {
    const { activeId, jimuMapViews, activeJmViewId } = this.state
    const jimuMapView = jimuMapViews[activeJmViewId]
    const jimuLayerViews = jimuMapViews[activeJmViewId].jimuLayerViews
    const jimuTables = jimuMapViews[activeJmViewId].jimuTables
    const activeViewId = `${activeJmViewId}${activeId.substring(activeId.indexOf('-'))}`
    let type = 'layer'
    let activeView: any = jimuLayerViews[activeViewId]
    if (!activeView) {
      activeView = jimuTables[activeViewId]
      if (activeView) {
        type = 'table'
      }
    }
    if (!activeView) return null
    let currentDs
    if (type === 'table') {
      const layerDataSourceId = jimuMapView.getDataSourceIdByAPILayer(activeView)
      const tableDs = this.dsManager.getDataSource(layerDataSourceId)
      const mapDs = jimuMapView.getMapDataSource()
      currentDs = tableDs
      if (!tableDs && mapDs) {
        currentDs = await mapDs.createDataSourceByLayer(activeView)
      }
    } else {
      currentDs = this.dsManager.getDataSource(activeView?.layerDataSourceId)
      if (!currentDs) {
        currentDs = await activeView.createLayerDataSource()
      }
    }
    if (!currentDs) return null
    const newLayerConfig = constructConfig(currentDs, true, undefined, activeView?.jimuMapViewId || activeJmViewId)
    return newLayerConfig
  }

  getUpdateObject = (currentConfig: LayersConfig, type: 'single' | 'multiple', updateValue: any) => {
    let updateObject
    if (type === 'single') {
      const { key, value } = updateValue
      updateObject = { ...currentConfig, [key]: value }
    } else if (type === 'multiple') {
      updateObject = { ...currentConfig, ...updateValue }
    }
    return updateObject
  }

  onMapModeSettingChange = async (type: 'single' | 'multiple' | 'layer' | 'layer-multiple', updateValue: any, useDs?: UseDataSource[]) => {
    const { id, config } = this.props
    const { activeId, jimuMapViews, activeJmViewId } = this.state
    const orgConfig = config
    const originalMapViewsConfig = orgConfig.mapViewsConfig
    const isLayerType = type === 'layer'
    const isLayerMultipleType = type === 'layer-multiple'
    if (originalMapViewsConfig?.[activeJmViewId]) {
      let newConfig
      if (isLayerType) {
        const { viewId, key, value } = updateValue
        newConfig = orgConfig.setIn(['mapViewsConfig', viewId, key], value)
        const config = {
          id,
          config: newConfig,
          useDataSources: useDs
        }
        this.props.onSettingChange(config)
        return
      } else if (isLayerMultipleType) {
        const { viewId, updateOptions } = updateValue
        const newSetting = {
          ...originalMapViewsConfig[viewId],
          ...updateOptions
        }
        newConfig = orgConfig.setIn(['mapViewsConfig', viewId], newSetting)
        const config = {
          id,
          config: newConfig,
          useDataSources: useDs
        }
        this.props.onSettingChange(config)
        return
      }
      const currentMapViewConfig = originalMapViewsConfig[activeJmViewId]
      const currentLayerConfigIndex = currentMapViewConfig.layersConfig.findIndex(config => config.id === activeId)
      if (currentLayerConfigIndex > -1) {
        const currentLayerConfig = currentMapViewConfig.layersConfig[currentLayerConfigIndex]
        const updateObject = this.getUpdateObject(currentLayerConfig.asMutable({ deep: true }), type, updateValue)
        newConfig = orgConfig.setIn(['mapViewsConfig', activeJmViewId, 'layersConfig', currentLayerConfigIndex.toString()], updateObject)
        const config = {
          id,
          config: newConfig,
          useDataSources: useDs
        }
        this.props.onSettingChange(config)
      } else {
        const newLayerConfig = await this.getDefaultConfig()
        if (!newLayerConfig) return
        const newMapLayersConfig = currentMapViewConfig.layersConfig.asMutable({ deep: true })
        const updateObject = this.getUpdateObject(newLayerConfig, type, updateValue)
        newMapLayersConfig.push(updateObject)
        newConfig = orgConfig.setIn(['mapViewsConfig', activeJmViewId, 'layersConfig'], newMapLayersConfig)
        const config = {
          id,
          config: newConfig,
          useDataSources: useDs
        }
        this.props.onSettingChange(config)
      }
    } else {
      let newViewConfig
      const allViewIds = []
      const jimuLayerViews = jimuMapViews[activeJmViewId].jimuLayerViews
      const jimuTables = jimuMapViews[activeJmViewId].jimuTables
      for (const layerViewId in jimuLayerViews) {
        const jimuLayerView = jimuLayerViews[layerViewId]
        const layerInvalid = jimuLayerView.isLayerVisible() && isSupportedJimuLayerView(jimuLayerView)
        if (layerInvalid) allViewIds.push(layerViewId)
      }
      for (const layerTableId in jimuTables) {
        const jimuTable = jimuTables[layerTableId]
        const layerValid = jimuTable.visible
        if (layerValid) allViewIds.push(layerTableId)
      }
      if (isLayerType) {
        const { viewId, key, value } = updateValue
        newViewConfig = {
          parentViewId: activeJmViewId || viewId,
          customizeLayers: false,
          customJimuLayerViewIds: allViewIds,
          layersConfig: [],
          [key]: value
        }
      } else if (isLayerMultipleType) {
        const { viewId, updateOptions } = updateValue
        newViewConfig = {
          parentViewId: activeJmViewId || viewId,
          customizeLayers: false,
          customJimuLayerViewIds: allViewIds,
          layersConfig: [],
          ...updateOptions
        }
      } else {
        const newLayerConfig = await this.getDefaultConfig()
        if (!newLayerConfig) return
        const updateObject = this.getUpdateObject(newLayerConfig, type, updateValue)
        newViewConfig = {
          parentViewId: activeJmViewId,
          customizeLayers: false,
          customJimuLayerViewIds: allViewIds,
          layersConfig: [updateObject]
        }
      }
      const newConfig = orgConfig.setIn(['mapViewsConfig', activeJmViewId], newViewConfig)
      const config = {
        id,
        config: newConfig,
        useDataSources: useDs
      }
      this.props.onSettingChange(config)
    }
  }

  onLayerSettingChange = (viewId: string, key: string, value, useDs?: UseDataSource[]) => {
    this.onMapModeSettingChange('layer', { viewId, key, value }, useDs)
  }

  onMultipleLayerSettingChange = (viewId: string, updateOptions, useDs?: UseDataSource[]) => {
    this.onMapModeSettingChange('layer-multiple', { viewId, updateOptions }, useDs)
  }

  onMapLayersConfigChange = (key: string, value: any, useDs?: UseDataSource[]) => {
    this.onMapModeSettingChange('single', { key, value }, useDs)
  }

  onMapLayersMultipleConfigChange = (updateOptions, useDs?: UseDataSource[]) => {
    this.onMapModeSettingChange('multiple', updateOptions, useDs)
  }

  getTableLayerList = () => {
    const { jimuMapViews } = this.state
    const { config, theme, theme2, id, intl, useDataSources } = this.props
    const { tableMode } = config
    const isMapMode = tableMode === TableModeType.Map
    const partProps = { theme, theme2, widgetId: id, intl, isMapMode, useDataSources }

    return (
      <div ref={this.customizeLayersTrigger} className='w-100'>
        {
          Object.keys(jimuMapViews).map(viewId => {
            const jimuMapView = jimuMapViews[viewId]
            return <MapLayersSetting
              {...partProps}
              key={viewId}
              jimuMapView={jimuMapView}
              sidePopperTrigger={this.sidePopperTrigger?.current}
              mapViewConfig={config?.mapViewsConfig?.[viewId]}
              onLayerItemClick={this.onLayerItemClick}
              onMapSettingClick={this.onMapSettingClick}
              onLayerSettingChange={this.onLayerSettingChange}
              onMultipleLayerSettingChange={this.onMultipleLayerSettingChange}
              onMapLayersConfigChange={this.onMapLayersConfigChange}
              onMapLayersMultipleConfigChange={this.onMapLayersMultipleConfigChange}
              onDataSourceFieldsChange={this.dataSourceFieldsChange}
              onMapLayersConfigActiveIdSet={this.onMapLayersConfigActiveIdSet}
            />
          })
        }
      </div>
    )
  }

  getLayersSettingContent = () => {
    return (
      this.props.useMapWidgetIds?.length > 0 && (
        <SettingSection className='border-0 pt-0 pl-0 pr-0'>
          <SettingRow>
            {this.isDataSourceEmpty()
              ? <Alert
                tabIndex={0}
                className='warningMsg'
                open
                text={this.formatMessage('noWebMapWebSceneTip')}
                type='warning'
              />
              : this.getTableLayerList()
            }
          </SettingRow>
        </SettingSection>
      )
    )
  }

  render () {
    const { activeId, showLayerPanel, popperFocusNode, newAddFlag, changeModeConfirmOpen } = this.state
    const { theme, theme2, config, id, useMapWidgetIds } = this.props
    const { tableMode, enableMapExtentFilter, defaultExtentFilterEnabled } = config
    const isLayerMode = tableMode === TableModeType.Layer
    const isMapMode = tableMode === TableModeType.Map
    const newSheetString = this.formatMessage('newSheet')
    const itemsLength = config.layersConfig.length
    const emptyPlaceholderTips = isMapMode
      ? this.formatMessage('noMapSelectedTips')
      : this.formatMessage('tableBlankStatus', { SheetString: newSheetString })
    const haveConfig = isMapMode ? useMapWidgetIds?.length > 0 : itemsLength > 0
    const isExpressBuilder = window.isExpressBuilder

    return (
      <div css={getStyle(theme)} className='h-100'>
        <div className='widget-setting-table h-100'>
          {
            this.props.useDataSources?.map((useDs, index) => {
              return (
                <LayerConfigDataSource
                  key={index}
                  useDataSource={useDs}
                  onCreateDataSourceCreatedOrFailed={this.onCreateDataSourceCreatedOrFailed}
                />
              )
            })
          }
          <SettingSection title={this.formatMessage('source')}>
            <div ref={this.sidePopperTrigger}>
              <SettingSection className='border-0 pt-0 pl-0 pr-0'>
                <div role='radiogroup' className='mb-4'>
                  <Label className='d-flex align-items-center'>
                    <Radio
                      style={{ cursor: 'pointer' }}
                      name='tableModeType'
                      className='mr-2'
                      checked={isLayerMode}
                      onChange={() => { this.onTableModeChange(TableModeType.Layer) }}
                    />
                    {this.formatMessage('selectLayers')}
                  </Label>
                  <Label className='d-flex align-items-center'>
                    <Radio
                      style={{ cursor: 'pointer' }}
                      name='tableModeType'
                      className='mr-2'
                      checked={isMapMode}
                      onChange={() => { this.onTableModeChange(TableModeType.Map) }}
                    />
                    {this.formatMessage('interactWithMap')}
                  </Label>
                </div>
                {isMapMode &&
                  <Fragment>
                    <SettingRow>
                      <MapWidgetSelector
                        onSelect={this.onMapWidgetSelected}
                        useMapWidgetIds={useMapWidgetIds}
                      />
                      <JimuMapViewComponent
                        useMapWidgetId={useMapWidgetIds?.[0]}
                        onViewsCreate={this.onViewsCreate}
                      />
                    </SettingRow>
                  </Fragment>
                }
                {isLayerMode &&
                  <SettingRow>
                    <Button
                      className='w-100 text-default add-table-btn'
                      type='primary'
                      onClick={() => {
                        this.onShowLayerPanel(itemsLength, true)
                      }}
                      aria-label={newSheetString}
                      aria-describedby={'table-blank-msg'}
                    >
                      <div className='w-100 px-2 text-truncate'>
                        {newSheetString}
                      </div>
                    </Button>
                  </SettingRow>
                }
              </SettingSection>

              {isLayerMode &&
                <SettingSection className='border-0 pt-0 pl-0 pr-0'>
                  <div className='setting-ui-unit-list'>
                    {!!itemsLength &&
                      <List
                        className='setting-ui-unit-list-existing'
                        itemsJson={Array.from(config.layersConfig).map((item, index) => ({
                          itemStateDetailContent: item,
                          itemKey: `${index}`,
                          itemStateChecked: showLayerPanel && index === this.index,
                          itemStateTitle: item.name,
                          itemStateCommands: [
                            {
                              label: this.formatMessage('remove'),
                              iconProps: () => ({ icon: CloseOutlined, size: 12 }),
                              action: () => {
                                this.removeLayer(index)
                              }
                            }
                          ]
                        }))}
                        dndEnabled
                        renderOverrideItemDetailToggle={(actionData, refComponent) => {
                          const { itemJsons } = refComponent.props
                          const [currentItemJson] = itemJsons
                          const dsId = currentItemJson?.itemStateDetailContent?.useDataSource?.dataSourceId
                          const accessible = this.isDataSourceAccessible(dsId)
                          return !accessible
                            ? <Alert
                              buttonType='tertiary'
                              form='tooltip'
                              size='small'
                              type='error'
                              text={this.formatMessage('dataSourceCreateError')}
                            >
                            </Alert>
                            : ''
                        }}
                        onUpdateItem={(actionData, refComponent) => {
                          const { itemJsons } = refComponent.props
                          const [currentItemJson, parentItemJson] = itemJsons
                          this.onItemUpdated(parentItemJson, +currentItemJson.itemKey)
                        }}
                        onClickItemBody={(actionData, refComponent) => {
                          const { itemJsons: [currentItemJson] } = refComponent.props
                          const currentTabId = currentItemJson.itemStateDetailContent.id
                          this.onShowLayerPanel(+currentItemJson.itemKey, false, currentTabId)
                          if (activeId !== currentTabId) {
                            builderAppSync.publishChangeWidgetStatePropToApp({ widgetId: id, propKey: 'activeTabId', value: currentTabId })
                            builderAppSync.publishChangeWidgetStatePropToApp({ widgetId: id, propKey: 'settingChangeTab', value: true })
                          }
                        }}
                        {...advancedActionMap}
                      />
                    }
                    {itemsLength === this.index && showLayerPanel &&
                      <List
                        className='setting-ui-unit-list-new'
                        itemsJson={[{
                          name: '......'
                        }].map((item, x) => ({
                          itemStateDetailContent: item,
                          itemKey: `${this.index}`,
                          itemStateChecked: true,
                          itemStateTitle: item.name,
                          itemStateCommands: []
                        }))}
                        dndEnabled={false}
                        renderOverrideItemDetailToggle={() => '' }
                        {...advancedActionMap}
                      />
                    }
                  </div>
                </SettingSection>
              }
              {isMapMode &&
                this.getLayersSettingContent()
              }
            </div>
          </SettingSection>

          {isMapMode && useMapWidgetIds?.length > 0 &&
            <SettingSection
              title={this.formatMessage('tools')}
              role='group'
              aria-label={this.formatMessage('tools')}
            >
              <SettingRow label={this.formatMessage('enableMapExtentFilter')} >
                <Switch
                  className='can-x-switch'
                  checked={enableMapExtentFilter}
                  data-key='enableMapExtentFilter'
                  onChange={(evt) => {
                    this.onPropertyChange('enableMapExtentFilter', evt.target.checked)
                  }}
                  aria-label={this.formatMessage('enableMapExtentFilter')}
                />
              </SettingRow>
              {enableMapExtentFilter &&
                <SettingRow>
                  <Label className='d-flex align-items-center'>
                    <Checkbox
                      checked={defaultExtentFilterEnabled}
                      className='mr-1'
                      onChange={evt => { this.onPropertyChange('defaultExtentFilterEnabled', evt.target.checked) }}
                    />
                    {this.formatMessage('defaultEnabled')}
                  </Label>
                </SettingRow>
              }
            </SettingSection>
          }

          {!haveConfig && !isExpressBuilder &&
            <div className='empty-placeholder w-100'>
              <div className='empty-placeholder-inner'>
                <div className='empty-placeholder-icon'><ClickOutlined size={48} /></div>
                  <div
                    className='empty-placeholder-text'
                    id='table-blank-msg'
                    dangerouslySetInnerHTML={{
                      __html: emptyPlaceholderTips
                    }}
                  />
              </div>
            </div>
          }
          {haveConfig &&
            <SettingSection
              className='arrange-style-container'
              title={this.formatMessage('sheetStyle')}
              role='group'
              aria-label={this.formatMessage('sheetStyle')}
            >
              <SettingRow className='arrange_container'>
                <Tooltip title={this.formatMessage('tabs')} placement='bottom'>
                  <Button
                    onClick={() => { this.onPropertyChange('arrangeType', TableArrangeType.Tabs) }}
                    icon
                    size='sm'
                    type='tertiary'
                    active={config.arrangeType === TableArrangeType.Tabs}
                    aria-pressed={config.arrangeType === TableArrangeType.Tabs}
                  >
                    <Icon
                      autoFlip
                      width={109}
                      height={70}
                      icon={require('./assets/image_table_tabs.svg')}
                    />
                  </Button>
                </Tooltip>
                <Tooltip
                  title={this.formatMessage('dropdown')}
                  placement='bottom'
                >
                  <Button
                    onClick={() => { this.onPropertyChange('arrangeType', TableArrangeType.Dropdown) }}
                    className='ml-2'
                    icon
                    size='sm'
                    type='tertiary'
                    active={config.arrangeType === TableArrangeType.Dropdown}
                    aria-pressed={config.arrangeType === TableArrangeType.Dropdown}
                  >
                    <Icon
                      autoFlip
                      width={109}
                      height={70}
                      icon={require('./assets/image_table_dropdown.svg')}
                    />
                  </Button>
                </Tooltip>
              </SettingRow>
            </SettingSection>
          }
          <SidePopper
            position='right'
            title={this.formatMessage('layerConfig')}
            isOpen={showLayerPanel && !urlUtils.getAppIdPageIdFromUrl().pageId}
            toggle={this.onCloseLayerPanel}
            trigger={this.sidePopperTrigger?.current}
            backToFocusNode={popperFocusNode}
          >
            <LayerConfig
              {...config.layersConfig.asMutable({ deep: true })[this.index]}
              isMapMode={isMapMode}
              intl={this.props.intl}
              theme={theme}
              appTheme={theme2}
              widgetId={id}
              newAddFlag={newAddFlag}
              dataSourceChange={this.dataSourceChangeSave}
              optionChange={this.optionChangeSave}
              multiOptionsChange={this.multiOptionsChangeSave}
              onDataSourceFieldsChange={this.dataSourceFieldsChange}
              onClose={this.onCloseLayerPanel}
            />
          </SidePopper>
          {changeModeConfirmOpen &&
            <ConfirmDialog
              level='warning'
              title={this.formatMessage('changeModeConfirmTitle')}
              hasNotShowAgainOption={false}
              content={this.formatMessage('changeModeConfirmTips')}
              onConfirm={this.handleChangeModeOk}
              onClose={this.handleChangeModeClose}
            />
          }
        </div>
      </div>
    )
  }
}
