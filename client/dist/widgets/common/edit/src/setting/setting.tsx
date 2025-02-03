/** @jsx jsx */
import {
  React,
  Immutable,
  type ImmutableObject,
  type IMState,
  jsx,
  type UseDataSource,
  type IMThemeVariables,
  type SerializedStyles,
  css,
  urlUtils,
  DataSourceManager,
  type IMUseDataSource,
  type ImmutableArray,
  polished,
  type DataSource,
  type IMDataSourceJson,
  getAppStore,
  type FeatureLayerDataSource,
  SupportedLayerServiceTypes,
  type ClauseValuePair,
  AllDataSourceTypes,
  DataSourceTypes,
  type SceneLayerDataSource,
  lodash
} from 'jimu-core'
import {
  defaultMessages as jimuUIDefaultMessages,
  Button,
  Alert,
  TextArea,
  Radio,
  Label,
  ConfirmDialog,
  Switch,
  Checkbox,
  Select,
  AdvancedSelect,
  type AdvancedSelectItem
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
  EditModeType,
  LayerHonorModeType,
  ImportHintType,
  SnapSettingMode
} from '../config'
import defaultMessages from './translations/default'
import { List, TreeItemActionType } from 'jimu-ui/basic/list-tree'
import LayerConfigDataSource from './layer-config-ds'
import { PlusOutlined } from 'jimu-icons/outlined/editor/plus'
import { ClickOutlined } from 'jimu-icons/outlined/application/click'
import { createRef, Fragment } from 'react'
import { getMapAllLayersDs } from '../common-builder-support'
import { INVISIBLE_FIELD } from './setting-const'
import { type JimuMapView, JimuMapViewComponent, MapViewManager } from 'jimu-arcgis'
import MapLayersSetting from './components/map-layers-setting'
import { getDsCap, constructConfig } from '../utils'
const IconClose = require('jimu-icons/svg/outlined/editor/close.svg')
const messages = Object.assign({}, defaultMessages, jimuUIDefaultMessages)

interface ExtraProps {
  activeTabId: string
}

export interface WidgetSettingState {
  showLayerPanel: boolean
  refreshPanel: boolean
  dataSources: { [dsId: string]: DataSource }
  changeModeConfirmOpen: boolean
  importHintType: ImportHintType
  popperFocusNode: HTMLElement
  jimuMapViews: { [viewId: string]: JimuMapView }
  allLayerLoaded: boolean
  activeJmViewId: string
  activeId: string
}

export default class Setting extends React.PureComponent<
AllWidgetSettingProps<IMConfig> & ExtraProps,
WidgetSettingState
> {
  supportedDsTypes = Immutable([
    AllDataSourceTypes.FeatureLayer, AllDataSourceTypes.SceneLayer,
    AllDataSourceTypes.OrientedImageryLayer, AllDataSourceTypes.SubtypeSublayer
  ])

  index: number
  dsManager: DataSourceManager
  dsHash: { [index: number]: ImmutableObject<UseDataSource> }
  sidePopperTrigger = createRef<HTMLDivElement>()
  customizeLayersTrigger = createRef<HTMLDivElement>()
  toBeChangedMode: EditModeType

  static mapExtraStateProps = (
    state: IMState,
    props: AllWidgetSettingProps<IMConfig>
  ): ExtraProps => {
    return {
      activeTabId: state?.appStateInBuilder?.widgetsState[props.id]?.activeTabId
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
      showLayerPanel: false,
      refreshPanel: false,
      dataSources: {},
      changeModeConfirmOpen: false,
      importHintType: undefined,
      popperFocusNode: null,
      jimuMapViews: {},
      allLayerLoaded: false,
      activeJmViewId: '',
      activeId: ''
    }
  }

  componentDidUpdate (prevProps: AllWidgetSettingProps<IMConfig> & ExtraProps) {
    const { useMapWidgetIds, config } = this.props
    const { mapViewsConfig, editMode } = config
    const isMapMode = editMode === EditModeType.Geometry
    const { jimuMapViews } = this.state
    const { useMapWidgetIds: prevUseMapWidgetIds, config: prevConfig } = prevProps
    const { mapViewsConfig: prevMapViewsConfig } = prevConfig
    if (useMapWidgetIds?.[0] !== prevUseMapWidgetIds?.[0]) {
      this.onPropertyChange('defaultSnapLayers', [])
    }
    if (!lodash.isDeepEqual(mapViewsConfig, prevMapViewsConfig) && isMapMode) {
      this.updateAllUseDataSourcesFromViews(jimuMapViews)
    }
  }

  updateDsHash = (layersConfig: LayersConfig[]) => {
    this.dsHash = {}
    let index = 0
    layersConfig.forEach(item => {
      this.dsHash[index] = item.useDataSource
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

  // save currentSelectedDs to array
  dataSourceChangeSave = (useDataSources: UseDataSource[]) => {
    if (!useDataSources) {
      return
    }
    const { config } = this.props
    const { editMode } = config
    const isAttrMode = editMode === EditModeType.Attribute
    const geometryMode = config.editMode === EditModeType.Geometry
    const currentIMUseDs = Immutable(useDataSources[0])
    this.dsManager
      .createDataSourceByUseDataSource(currentIMUseDs)
      .then(resultDs => {
        // Init capabilities
        const isScene = resultDs.type === DataSourceTypes.SceneLayer
        const currentDs = isScene ? (resultDs as SceneLayerDataSource)?.getAssociatedDataSource() : resultDs as FeatureLayerDataSource
        const layerDefinition = currentDs?.getLayerDefinition()
        const allowGeometryUpdates = layerDefinition?.allowGeometryUpdates
        const capabilities = layerDefinition?.capabilities
        const isTable = layerDefinition?.type === SupportedLayerServiceTypes.Table
        const isTableEditable = ((!geometryMode && isTable) || geometryMode)
        const create = getDsCap(capabilities, 'create') && isTableEditable
        const update = getDsCap(capabilities, 'update')
        const deletable = getDsCap(capabilities, 'delete')
        // Fields operation
        const allFields = currentDs?.getSchema()
        let allFieldsDetails = allFields?.fields ? Object.values(allFields?.fields) : []
        // Filter uneditable field TODO
        const fieldsConfig = layerDefinition?.fields || []
        // According to the API, these five items do not displayed in the Editor by default
        allFieldsDetails = allFieldsDetails.filter(
          item => !INVISIBLE_FIELD.includes(item.name)
        )
        // Popup Setting is initially selected by default if the map has popup setting
        const popupSetting = currentDs?.layer?.formTemplate?.elements
        if (popupSetting) {
          const popupFieldNames = []
          popupSetting.forEach(ele => {
            const popupEle = ele as any
            if (popupEle?.elements?.length > 0) {
              popupEle?.elements.forEach(subEle => {
                if (subEle.fieldName) popupFieldNames.push(subEle.fieldName)
              })
            } else {
              if (popupEle.fieldName) popupFieldNames.push(popupEle.fieldName)
            }
          })
          allFieldsDetails = allFieldsDetails.filter(
            item => popupFieldNames.includes(item.name)
          )
        }
        // If there are too many columns, only the first 50 columns will be displayed by default
        if (allFieldsDetails?.length > 50) {
          allFieldsDetails = allFieldsDetails.slice(0, 50)
        }
        // Field editing is enabled by default
        const initGroupedFields = allFieldsDetails.map(item => {
          const orgField = fieldsConfig.find(field => field.name === item.jimuName)
          const defaultAuthority = orgField?.editable
          return { ...item, editAuthority: defaultAuthority, subDescription: item?.description || '', editable: defaultAuthority }
        })
        const isFromMap = !!(currentDs.getRootDataSource() as any)?.map
        const layerItem: LayersConfig = {
          id: currentDs.id,
          name: currentDs.getLabel(),
          layerId: currentDs?.jimuChildId,
          useDataSource: currentIMUseDs,
          addRecords: create,
          deleteRecords: deletable,
          updateRecords: update,
          updateAttributes: update,
          updateGeometries: allowGeometryUpdates && update,
          featureSnapping: false,
          showFields: allFieldsDetails,
          groupedFields: initGroupedFields,
          layerHonorMode: isFromMap ? LayerHonorModeType.Webmap : LayerHonorModeType.Custom,
          ...(isAttrMode ? { layerEditingEnabled: (currentDs?.getMainDataSource() as any)?.layer?.editingEnabled ?? true, isTable } : {})
        }

        const currentLayer = this.props.config.layersConfig[this.index]
        let layerItems
        if (currentLayer) {
          // update config, reset other opts for current config
          const _conf = this.props.config.layersConfig.asMutable({ deep: true })
          _conf.splice(this.index, 1, layerItem)
          layerItems = Immutable(_conf)
        } else {
          // add new config
          layerItems = this.props.config.layersConfig.concat([
            Immutable(layerItem)
          ])
        }
        // update dsHash
        this.dsHash[this.index] = currentIMUseDs
        this.updateDsHash(layerItems)

        const config = {
          id: this.props.id,
          config: this.props.config.set('layersConfig', layerItems),
          useDataSources: this.getUseDataSourcesByDsHash()
        }
        this.props.onSettingChange(config)
      }).catch(err => {
        console.error(err)
      })
  }

  importAllLayersConfigSave = async (useDataSources: UseDataSource[]) => {
    if (useDataSources?.length === 0) return
    const loopAddConfigs = async () => {
      let layerItems = this.props.config.layersConfig
      const promises = []
      useDataSources.forEach(useDataSource => {
        if (useDataSource.dataSourceId.startsWith('add-data')) return
        promises.push(this.dsManager.createDataSourceByUseDataSource(Immutable(useDataSource)))
      })
      const results = await Promise.all(promises)
      useDataSources.forEach((useDataSource, index) => {
        const resultDs = results[index]
        if (!this.supportedDsTypes.includes(resultDs?.type)) return
        const isScene = resultDs.type === DataSourceTypes.SceneLayer
        const currentDs = isScene ? (resultDs as SceneLayerDataSource)?.getAssociatedDataSource() : resultDs as FeatureLayerDataSource
        const layerDefinition = currentDs?.getLayerDefinition()
        // Geometry mode(Api Editor), hide the table temporarily
        const isTable = currentDs?.layer?.isTable || layerDefinition?.type === SupportedLayerServiceTypes.Table
        if (isTable || currentDs?.getDataSourceJson()?.isHidden) return
        const currentIMUseDs = Immutable(useDataSource)
        const fieldsConfig = layerDefinition?.fields || []
        const allFields = currentDs?.getSchema()
        let allFieldsDetails = allFields?.fields ? Object.values(allFields?.fields) : []
        // According to the API, these five items do not displayed in the Editor by default
        allFieldsDetails = allFieldsDetails.filter(
          item => !INVISIBLE_FIELD.includes(item.jimuName)
        )
        // Popup Setting is initially selected by default if the map has popup setting
        const popupSetting = currentDs?.layer?.formTemplate?.elements
        if (popupSetting) {
          const popupFieldNames = []
          popupSetting.forEach(ele => {
            const popupEle = ele as any
            if (popupEle?.elements?.length > 0) {
              popupEle?.elements.forEach(subEle => {
                if (subEle.fieldName) popupFieldNames.push(subEle.fieldName)
              })
            } else {
              if (popupEle.fieldName) popupFieldNames.push(popupEle.fieldName)
            }
          })
          allFieldsDetails = allFieldsDetails.filter(
            item => popupFieldNames.includes(item.name)
          )
        }
        // If there are too many columns, only the first 50 columns will be displayed by default
        if (allFieldsDetails?.length > 50) {
          allFieldsDetails = allFieldsDetails.slice(0, 50)
        }
        // Field editing is enabled by default
        const initGroupedFields = allFieldsDetails.map(item => {
          const orgField = fieldsConfig.find(field => field.name === item.jimuName)
          const defaultAuthority = orgField?.editable
          return { ...item, editAuthority: defaultAuthority, subDescription: item?.description || '', editable: defaultAuthority }
        })
        // init capabilities
        const allowGeometryUpdates = layerDefinition?.allowGeometryUpdates
        const capabilities = layerDefinition?.capabilities
        const create = getDsCap(capabilities, 'create')
        const update = getDsCap(capabilities, 'update')
        const deletable = getDsCap(capabilities, 'delete')
        const isFromMap = !!(currentDs.getRootDataSource() as any)?.map
        const layerItem: LayersConfig = {
          id: currentDs.id,
          name: currentDs.getLabel(),
          layerId: currentDs?.jimuChildId,
          useDataSource: currentIMUseDs,
          addRecords: create,
          deleteRecords: deletable,
          updateRecords: update,
          updateAttributes: update,
          updateGeometries: allowGeometryUpdates && update,
          featureSnapping: false,
          showFields: allFieldsDetails,
          groupedFields: initGroupedFields,
          layerHonorMode: isFromMap ? LayerHonorModeType.Webmap : LayerHonorModeType.Custom
        }
        layerItems = layerItems.concat([
          Immutable(layerItem)
        ])
        // update dsHash
        this.dsHash[this.index] = currentIMUseDs
        if (useDataSources.length === index + 1 && layerItems.length === 0) {
          this.setState({ importHintType: ImportHintType.NoLayer }, () => {
            setTimeout(() => {
              this.setState({ importHintType: undefined })
            }, 3000)
          })
        }
      })
      return layerItems
    }
    const layerItems = await loopAddConfigs()
    this.updateDsHash(layerItems.asMutable({ deep: true }))
    const updateConfig = {
      id: this.props.id,
      config: this.props.config.set('layersConfig', layerItems),
      useDataSources: this.getUseDataSourcesByDsHash()
    }
    this.props.onSettingChange(updateConfig)
  }

  updateAllUseDataSourcesFromViews = (jimuMapViews: { [viewId: string]: JimuMapView }) => {
    const { config } = this.props
    const { mapViewsConfig } = config
    const newLayersConfig = [] as LayersConfig[]
    for (const viewId in jimuMapViews) {
      const jimuMapView = jimuMapViews[viewId]
      const jimuLayerViews = jimuMapView.jimuLayerViews
      const viewConfig = mapViewsConfig?.[viewId]
      const customizeLayers = viewConfig?.customizeLayers
      const customJimuLayerViewIds = viewConfig?.customJimuLayerViewIds
      for (const layerViewId in jimuLayerViews) {
        const jimuLayerView = jimuLayerViews[layerViewId]
        if (customizeLayers && !customJimuLayerViewIds?.includes(layerViewId)) continue
        const layerDs = jimuLayerView?.getLayerDataSource()
        if (!layerDs || !this.supportedDsTypes.includes(layerDs.type as any)) continue
        const currentDs = this.dsManager.getDataSource(layerDs.id)
        const defaultConfig = constructConfig(currentDs, jimuLayerView.jimuMapViewId)
        newLayersConfig.push(defaultConfig)
      }
    }
    this.updateDsHash(newLayersConfig)
    const updateConfig = {
      id: this.props.id,
      useDataSources: this.getUseDataSourcesByDsHash()
    }
    this.props.onSettingChange(updateConfig)
  }

  onViewsCreate = (views: { [viewId: string]: JimuMapView }) => {
    const { config } = this.props
    const { editMode } = config
    const isMapMode = editMode === EditModeType.Geometry
    this.setState({ allLayerLoaded: false })
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
          this.setState({ jimuMapViews: views, allLayerLoaded: true }, () => {
            if (isMapMode) this.updateAllUseDataSourcesFromViews(views)
          })
        }
      }
    })
  }

  onFilterDs = (dsJson: IMDataSourceJson): boolean => {
    if (!dsJson?.url || dsJson?.isOutputFromWidget) return true
    const { useMapWidgetIds, config } = this.props
    const { layersConfig, editMode } = config
    const alreadySelectIds = layersConfig.map(item => item.id)
    let hideDsFlag = false
    if (editMode === EditModeType.Geometry) {
      const useMapWidget = useMapWidgetIds?.[0]
      if (!useMapWidget) return true
      // Geometry mode(Api Editor), hide the table temporarily
      const dataSource = this.dsManager.getDataSource(dsJson.id)
      const layerDef = (dataSource as FeatureLayerDataSource)?.getLayerDefinition()
      const isTable = (dataSource as any)?.layer?.isTable || layerDef?.type === SupportedLayerServiceTypes.Table
      if (isTable) return true
      const appConfig = getAppStore().getState().appStateInBuilder.appConfig
      const mapUseDataSources = appConfig.widgets[useMapWidget]?.useDataSources
      const mapUseDataSourcesIds = mapUseDataSources.map(item => item.dataSourceId)
      const thisDsId = dsJson.id.split('-')[0]
      // Use map useDataSources to filter map and alreadySelectIds to filter selected
      hideDsFlag = !mapUseDataSourcesIds.includes(thisDsId) || (mapUseDataSourcesIds.includes(thisDsId) && alreadySelectIds.includes(dsJson.id))
    } else {
      hideDsFlag = alreadySelectIds.includes(dsJson.id)
    }
    return hideDsFlag
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
    let fis = this.props.config.set('layersConfig', _layer)
    // remove description
    if (_layer?.length === 0) {
      fis = fis.set('description', '')
    }
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

  getStyle = (theme: IMThemeVariables): SerializedStyles => {
    return css`
      .widget-setting-edit {
        .layerlist-tools{
          .layerlist-tools-item{
            display: flex;
            margin-bottom: 8px;
          }
        }

        .filter-item {
          display: flex;
          padding: 0.5rem 0.75rem;
          margin-bottom: 0.25rem;
          line-height: 23px;
          cursor: pointer;
          background-color: ${theme.sys.color.secondary.main};

          .filter-item-icon {
            width: 14px;
            margin-right: 0.5rem;
          }
          .filter-item-name {
            word-wrap: break-word;
          }
        }

        .edit-tips{
          font-style: italic;
          font-size: 12px;
          color: ${theme.ref.palette.neutral[1000]};
        }
        .filter-item-active {
          border-left: 2px solid ${theme.sys.color.primary.main};
        }
        .capability-header{
          margin-bottom: 12px;
        }
        .capability-item{
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .empty-placeholder {
          display: flex;
          flex-flow: column;
          justify-content: center;
          height: calc(100% - 379px);
          overflow: hidden;
          .empty-placeholder-inner {
            padding: 0px 20px;
            flex-direction: column;
            align-items: center;
            display: flex;

            .empty-placeholder-text {
              color: ${theme.ref.palette.neutral[1000]};
              font-size: ${polished.rem(14)};
              margin-top: 16px;
              text-align: center;
            }
            .empty-placeholder-icon {
              color: ${theme.ref.palette.neutral[800]};
            }
          }
        }

        .setting-ui-unit-tree, .setting-ui-unit-list {
          width: 100%;
          .tree-item {
            justify-content: space-between;
            align-items: center;
            font-size: ${polished.rem(13)};
            &.tree-item_level-1 {
            }
            .jimu-checkbox {
              margin-right: .5rem;
            }
          }
        }
        .setting-ui-unit-list-new {
          padding-top: ${polished.rem(8)};
        }
      }
    `
  }

  formatMessage = (id: string, values?: { [key: string]: any }) => {
    return this.props.intl.formatMessage(
      { id: id, defaultMessage: messages[id] },
      values
    )
  }

  onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    this.props.onSettingChange({
      id: this.props.id,
      useMapWidgetIds
    })
    this.onPropertyChange('layersConfig', [])
  }

  onShowLayerPanel = (index: number, newAdded = false) => {
    const { showLayerPanel } = this.state
    this.settSidePopperAnchor(index, newAdded)
    if (index === this.index) {
      this.setState({ showLayerPanel: !showLayerPanel })
    } else {
      this.setState({
        showLayerPanel: true,
        refreshPanel: !this.state.refreshPanel
      })
      this.index = index
    }
  }

  settSidePopperAnchor = (index?: number, newAdded = false) => {
    let node: any
    if (newAdded) {
      node = this.sidePopperTrigger.current.getElementsByClassName('add-edit-btn')[0]
    } else {
      node = this.sidePopperTrigger.current.getElementsByClassName('jimu-tree-item__body')[index]
    }
    this.setState({ popperFocusNode: node })
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

  onEditModeChange = (value: EditModeType) => {
    this.toBeChangedMode = value
    const { config } = this.props
    const { editMode, layersConfig } = config
    const isAttrMode = editMode === EditModeType.Attribute
    // no layer config, switching mode directly
    if (isAttrMode && layersConfig.length === 0) {
      this.onPropertyChange('editMode', this.toBeChangedMode)
      this.setState({ showLayerPanel: false })
      return
    }
    if (value !== editMode) {
      this.setState({ changeModeConfirmOpen: true })
    }
  }

  handleChangeModeOk = () => {
    const changeArray = [
      { name: 'editMode', value: this.toBeChangedMode },
      { name: 'layersConfig', value: [] },
      { name: 'mapViewsConfig', value: {} }
    ]
    this.onMultiplePropertyChange(changeArray)
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

  onLayerSettingChange = (viewId: string, key: string, value) => {
    this.onMapModeSettingChange('layer', { viewId, key, value })
  }

  onMultipleLayerSettingChange = (viewId: string, updateOptions) => {
    this.onMapModeSettingChange('layer-multiple', { viewId, updateOptions })
  }

  onMapLayersConfigChange = (key: string, value: any) => {
    this.onMapModeSettingChange('single', { key, value })
  }

  onMapLayersMultipleConfigChange = (updateOptions) => {
    this.onMapModeSettingChange('multiple', updateOptions)
  }

  onMapLayersConfigActiveIdSet = (activeId: string) => {
    this.setState({ activeId })
  }

  getDefaultConfig = () => {
    const { activeId, jimuMapViews, activeJmViewId } = this.state
    const jimuLayerViews = jimuMapViews[activeJmViewId].jimuLayerViews
    const activeViewId = `${activeJmViewId}${activeId.substring(activeId.indexOf('-'))}`
    const activeView = jimuLayerViews[activeViewId]
    const currentDs = this.dsManager.getDataSource(activeView?.layerDataSourceId)
    const newLayerConfig = constructConfig(currentDs, activeView?.jimuMapViewId)
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

  onMapModeSettingChange = (type: 'single' | 'multiple' | 'layer' | 'layer-multiple', updateValue: any) => {
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
        const config = { id, config: newConfig }
        this.props.onSettingChange(config)
        return
      } else if (isLayerMultipleType) {
        const { viewId, updateOptions } = updateValue
        const newSetting = {
          ...originalMapViewsConfig[viewId],
          ...updateOptions
        }
        newConfig = orgConfig.setIn(['mapViewsConfig', viewId], newSetting)
        const config = { id, config: newConfig }
        this.props.onSettingChange(config)
        return
      }
      const currentMapViewConfig = originalMapViewsConfig[activeJmViewId]
      const currentLayerConfigIndex = currentMapViewConfig.layersConfig.findIndex(config => config.id === activeId)
      if (currentLayerConfigIndex > -1) {
        const currentLayerConfig = currentMapViewConfig.layersConfig[currentLayerConfigIndex]
        const updateObject = this.getUpdateObject(currentLayerConfig.asMutable({ deep: true }), type, updateValue)
        newConfig = orgConfig.setIn(['mapViewsConfig', activeJmViewId, 'layersConfig', currentLayerConfigIndex.toString()], updateObject)
        const config = { id, config: newConfig }
        this.props.onSettingChange(config)
      } else {
        const newLayerConfig = this.getDefaultConfig()
        const newMapLayersConfig = currentMapViewConfig.layersConfig.asMutable({ deep: true })
        const updateObject = this.getUpdateObject(newLayerConfig, type, updateValue)
        newMapLayersConfig.push(updateObject)
        newConfig = orgConfig.setIn(['mapViewsConfig', activeJmViewId, 'layersConfig'], newMapLayersConfig)
        const config = { id, config: newConfig }
        this.props.onSettingChange(config)
      }
    } else {
      let newViewConfig
      const allViewIds = Object.keys(jimuMapViews[activeJmViewId].jimuLayerViews)
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
        const newLayerConfig = this.getDefaultConfig()
        const updateObject = this.getUpdateObject(newLayerConfig, type, updateValue)
        newViewConfig = {
          parentViewId: activeJmViewId,
          customizeLayers: false,
          customJimuLayerViewIds: allViewIds,
          layersConfig: [updateObject]
        }
      }
      const newConfig = orgConfig.setIn(['mapViewsConfig', activeJmViewId], newViewConfig)
      const config = { id, config: newConfig }
      this.props.onSettingChange(config)
    }
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

  onMultiplePropertyChange = (changeArr) => {
    const { config } = this.props
    let newConfig = config
    changeArr.forEach(item => {
      if (item.value === config[item.name]) return
      newConfig = newConfig.set(item.name, item.value)
    })
    const alterProps = {
      id: this.props.id,
      config: newConfig
    }
    this.props.onSettingChange(alterProps)
  }

  getAllLayersOptions = (): AdvancedSelectItem[] => {
    const res = []
    const { jimuMapViews, allLayerLoaded } = this.state
    if (!allLayerLoaded) return res
    Object.keys(jimuMapViews).forEach(viewId => {
      const jimuLayerViews = jimuMapViews[viewId].jimuLayerViews
      for (const layerViewId in jimuLayerViews) {
        const dsJson = jimuLayerViews[layerViewId]?.getLayerDataSource()?.getDataSourceJson()
        if (dsJson) {
          res.push({
            value: dsJson.id,
            label: dsJson.sourceLabel
          })
        }
      }
    })
    return res
  }

  getSnapLayers = (defaultSnapLayers: Immutable.ImmutableArray<string>): AdvancedSelectItem[] => {
    const res = []
    const { jimuMapViews } = this.state
    Object.keys(jimuMapViews).forEach(viewId => {
      const jimuLayerViews = jimuMapViews[viewId].jimuLayerViews
      for (const layerViewId in jimuLayerViews) {
        const dsJson = jimuLayerViews[layerViewId]?.getLayerDataSource()?.getDataSourceJson()
        if (dsJson && defaultSnapLayers?.includes(dsJson.id)) {
          res.push({
            value: dsJson.id,
            label: dsJson.sourceLabel
          })
        }
      }
    })
    return res
  }

  onSnapLayersChange = (valuePairs: ClauseValuePair[]) => {
    if (!valuePairs) valuePairs = []
    const newSnapLayers = valuePairs.map(item => item.value)
    this.onPropertyChange('defaultSnapLayers', newSnapLayers)
  }

  onTooltipToggle = (showTooltip: boolean) => {
    const changeArray = [
      { name: 'tooltip', value: showTooltip },
      { name: 'defaultTooltipEnabled', value: false }
    ]
    this.onMultiplePropertyChange(changeArray)
  }

  displaySelectedLayers = (values: string[]): string => {
    return this.formatMessage('numSelected', { number: values.length })
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

  getTableLayerList = () => {
    const { jimuMapViews } = this.state
    const { config, theme, theme2, id, intl, useMapWidgetIds } = this.props
    const { editMode } = config
    const isGeoMode = editMode === EditModeType.Geometry
    const partProps = { theme, theme2, widgetId: id, intl, isMapMode: isGeoMode }

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
              useMapWidgetIds={useMapWidgetIds}
              onLayerItemClick={this.onLayerItemClick}
              onMapSettingClick={this.onMapSettingClick}
              onLayerSettingChange={this.onLayerSettingChange}
              onMultipleLayerSettingChange={this.onMultipleLayerSettingChange}
              onMapLayersConfigChange={this.onMapLayersConfigChange}
              onMapLayersMultipleConfigChange={this.onMapLayersMultipleConfigChange}
              onMapLayersConfigActiveIdSet={this.onMapLayersConfigActiveIdSet}
            />
          })
        }
      </div>
    )
  }

  render () {
    const { showLayerPanel, changeModeConfirmOpen, importHintType, allLayerLoaded } = this.state
    const { theme, config, useMapWidgetIds } = this.props
    const {
      layersConfig, editMode, selfSnapping, featureSnapping, defaultSelfEnabled, defaultFeatureEnabled, defaultSnapLayers,
      snapSettingMode, tooltip, defaultTooltipEnabled, templateFilter, relatedRecords, liveDataEditing, initialReshapeMode
    } = config
    const isAttrMode = editMode === EditModeType.Attribute
    const isGeoMode = editMode === EditModeType.Geometry
    const newEditString = isAttrMode ? this.formatMessage('newEdit') : this.formatMessage('newEditGeo')
    const modeString = isAttrMode ? this.formatMessage('editableSource') : this.formatMessage('editableLayer')
    const itemsLength = layersConfig.length
    const appConfig = getAppStore().getState().appStateInBuilder.appConfig
    const useMapWidget = useMapWidgetIds?.[0]
    const btnDisabled = isGeoMode && ((!useMapWidgetIds || useMapWidgetIds?.length === 0) || !appConfig.widgets?.[useMapWidget])
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
    const haveConfig = isGeoMode ? useMapWidgetIds?.length > 0 : itemsLength > 0
    // check layer capability
    const allLayersDs = getMapAllLayersDs(useMapWidget)
    const currentLayer = allLayersDs.find(layer => layersConfig[this.index]?.id === layer.id)
    const layerEditingEnabled = isGeoMode ? (currentLayer?.getMainDataSource() as any)?.layer?.editingEnabled ?? true : layersConfig[this.index]?.layerEditingEnabled
    const isExpressBuilder = window.isExpressBuilder

    return (
      <div css={this.getStyle(theme)} className='h-100'>
        <div className='jimu-widget-setting widget-setting-edit h-100'>
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

          <SettingSection role='group' title={this.formatMessage('mode')}>
            <div ref={this.sidePopperTrigger}>
              <SettingSection className='border-0 pt-0 pl-0 pr-0'>
                <div role='radiogroup' className='mb-4'>
                  <Label className='d-flex align-items-center'>
                    <Radio
                      style={{ cursor: 'pointer' }}
                      name='editModeType'
                      className='mr-2'
                      checked={isAttrMode}
                      onChange={() => { this.onEditModeChange(EditModeType.Attribute) }}
                    />
                    {this.formatMessage('attrMode')}
                  </Label>
                  <Label className='d-flex align-items-center'>
                    <Radio
                      style={{ cursor: 'pointer' }}
                      name='editModeType'
                      className='mr-2'
                      checked={isGeoMode}
                      onChange={() => { this.onEditModeChange(EditModeType.Geometry) }}
                    />
                    {this.formatMessage('interactWithMap')}
                  </Label>
                </div>

                {isGeoMode &&
                  <Fragment>
                    <SettingRow>
                      <MapWidgetSelector
                        onSelect={this.onMapWidgetSelected}
                        useMapWidgetIds={useMapWidgetIds}
                      />
                    </SettingRow>
                    {importHintType &&
                      <Alert
                        withIcon
                        tabIndex={0}
                        className='w-100 mt-2 mb-2'
                        open
                        closable
                        onClose={() => { this.setState({ importHintType: undefined }) }}
                        text={importHintType === ImportHintType.NoLayer ? this.formatMessage('noLayerTips') : this.formatMessage('selectMapTip')}
                        type='warning'
                      />
                    }
                  </Fragment>
                }
                {isAttrMode &&
                  <SettingRow>
                    <Button
                      className='w-100 add-edit-btn'
                      type='primary'
                      onClick={() => {
                        this.onShowLayerPanel(itemsLength, true)
                      }}
                      disabled={btnDisabled}
                      title={newEditString}
                      aria-label={newEditString}
                      aria-describedby={'edit-blank-msg'}
                    >
                      <div className='w-100 px-2 text-truncate'>
                        <PlusOutlined className='mr-1 mb-1'/>
                        {newEditString}
                      </div>
                    </Button>
                  </SettingRow>
                }
                {isAttrMode &&
                  <SettingRow>
                    <div className='text-break edit-tips'>
                      {this.formatMessage('newEditTips')}
                    </div>
                  </SettingRow>
                }
              </SettingSection>

              {isAttrMode &&
                <SettingSection className='border-0 pt-0 pl-0 pr-0'>
                  <div className='setting-ui-unit-list'>
                    {!!itemsLength &&
                      <List
                        className='setting-ui-unit-list-existing'
                        itemsJson={Array.from(config.layersConfig).map((item, index) => ({
                          itemStateDetailContent: item,
                          itemKey: `${index}`,
                          itemStateTitle: item.name,
                          itemStateChecked: showLayerPanel && index === this.index,
                          itemStateCommands: [
                            {
                              label: this.formatMessage('remove'),
                              iconProps: () => ({ icon: IconClose, size: 12 }),
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
                            />
                            : ''
                        }}
                        onUpdateItem={(actionData, refComponent) => {
                          const { itemJsons } = refComponent.props
                          const [currentItemJson, parentItemJson] = itemJsons
                          this.onItemUpdated(parentItemJson, +currentItemJson.itemKey)
                        }}
                        onClickItemBody={(actionData, refComponent) => {
                          const { itemJsons: [currentItemJson] } = refComponent.props
                          this.onShowLayerPanel(+currentItemJson.itemKey)
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
                          itemStateTitle: item.name,
                          itemStateChecked: true,
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
              {isGeoMode &&
                this.getLayersSettingContent()
              }
              {isGeoMode && haveConfig && !this.isDataSourceEmpty() &&
                <SettingSection
                  role='group'
                  title={this.formatMessage('snappingSettings')}
                  aria-label={this.formatMessage('snappingSettings')}
                  className='border-0 pt-0 pl-0 pr-0'
                >
                  <SettingRow>
                    <Select
                      size='sm'
                      className='w-100'
                      value={snapSettingMode}
                      onChange={evt => { this.onPropertyChange('snapSettingMode', evt.target.value) }}
                    >
                      <option value={SnapSettingMode.Prescriptive}>{this.formatMessage('prescriptiveMode')}</option>
                      <option value={SnapSettingMode.Flexible}>{this.formatMessage('flexibleMode')}</option>
                    </Select>
                  </SettingRow>
                  {snapSettingMode === SnapSettingMode.Prescriptive
                    ? <Fragment>
                      <SettingRow>
                        <Label className='d-flex align-items-center'>
                          <Checkbox
                            checked={defaultSelfEnabled}
                            className='mr-1'
                            onChange={evt => { this.onPropertyChange('defaultSelfEnabled', evt.target.checked) }}
                          />
                          {this.formatMessage('selfSnapping')}
                        </Label>
                      </SettingRow>
                      <SettingRow>
                        <Label className='d-flex align-items-center'>
                          <Checkbox
                            checked={defaultFeatureEnabled}
                            className='mr-1'
                            onChange={evt => { this.onPropertyChange('defaultFeatureEnabled', evt.target.checked) }}
                          />
                          {this.formatMessage('featureSnapping')}
                        </Label>
                      </SettingRow>
                    </Fragment>
                    : <Fragment>
                      <SettingRow label={this.formatMessage('selfSnapping')}>
                        <Switch
                          className='can-x-switch'
                          checked={selfSnapping}
                          data-key='selfSnapping'
                          onChange={evt => { this.onPropertyChange('selfSnapping', evt.target.checked) }}
                          aria-label={this.formatMessage('selfSnapping')}
                        />
                      </SettingRow>
                      {selfSnapping &&
                        <SettingRow>
                          <Label className='d-flex align-items-center'>
                            <Checkbox
                              checked={defaultSelfEnabled}
                              className='mr-1'
                              onChange={evt => { this.onPropertyChange('defaultSelfEnabled', evt.target.checked) }}
                            />
                            {this.formatMessage('defaultEnabled')}
                          </Label>
                        </SettingRow>
                      }
                      <SettingRow label={this.formatMessage('featureSnapping')}>
                        <Switch
                          className='can-x-switch'
                          checked={featureSnapping}
                          data-key='featureSnapping'
                          onChange={evt => { this.onPropertyChange('featureSnapping', evt.target.checked) }}
                          aria-label={this.formatMessage('featureSnapping')}
                        />
                      </SettingRow>
                      {featureSnapping &&
                        <SettingRow>
                          <Label className='d-flex align-items-center'>
                            <Checkbox
                              checked={defaultFeatureEnabled}
                              className='mr-1'
                              onChange={evt => { this.onPropertyChange('defaultFeatureEnabled', evt.target.checked) }}
                            />
                            {this.formatMessage('defaultEnabled')}
                          </Label>
                        </SettingRow>
                      }
                    </Fragment>
                  }
                  <SettingRow
                    flow='wrap'
                    label={this.formatMessage('chooseDefault')}
                    className='select-option'
                  >
                    <AdvancedSelect
                      size='sm'
                      title={this.formatMessage('chooseDefault')}
                      fluid
                      hideCheckAll={false}
                      hideBottomTools={true}
                      hideSearchInput={true}
                      staticValues={this.getAllLayersOptions()}
                      sortValuesByLabel={false}
                      isMultiple
                      selectedValues={this.getSnapLayers(defaultSnapLayers)}
                      onChange={this.onSnapLayersChange}
                      aria-label={this.formatMessage('chooseDefault')}
                      buttonProps={{ disabled: !allLayerLoaded }}
                    />
                  </SettingRow>
                </SettingSection>
              }
            </div>
          </SettingSection>

          {itemsLength === 0 && !showLayerPanel && !isExpressBuilder && isAttrMode &&
            <div className='empty-placeholder w-100'>
              <div className='empty-placeholder-inner'>
                <div className='empty-placeholder-icon'><ClickOutlined size={48} /></div>
                  <div
                    className='empty-placeholder-text'
                    id='edit-blank-msg'
                    dangerouslySetInnerHTML={{
                      __html: this.formatMessage('editBlankStatus', {
                        EditString: newEditString,
                        ModeString: modeString
                      })
                    }}
                  />
              </div>
            </div>
          }
          {haveConfig && (isGeoMode ? !this.isDataSourceEmpty() : true) &&
            <SettingSection
              role='group'
              aria-label={this.formatMessage('iconGroup_general')}
              title={this.formatMessage('iconGroup_general')}
            >
              {isGeoMode &&
                <Fragment>
                  <SettingRow label={this.formatMessage('tooltip')}>
                    <Switch
                      className='can-x-switch'
                      checked={tooltip}
                      data-key='tooltip'
                      onChange={evt => { this.onTooltipToggle(evt.target.checked) }}
                      aria-label={this.formatMessage('tooltip')}
                    />
                  </SettingRow>
                  {tooltip &&
                    <SettingRow>
                      <Label className='d-flex align-items-center'>
                        <Checkbox
                          checked={defaultTooltipEnabled}
                          className='mr-1'
                          onChange={evt => { this.onPropertyChange('defaultTooltipEnabled', evt.target.checked) }}
                        />
                        {this.formatMessage('defaultEnabled')}
                      </Label>
                    </SettingRow>
                  }
                  <SettingRow label={this.formatMessage('templateFilter')}>
                    <Switch
                      className='can-x-switch'
                      checked={templateFilter}
                      data-key='templateFilter'
                      onChange={evt => { this.onPropertyChange('templateFilter', evt.target.checked) }}
                      aria-label={this.formatMessage('templateFilter')}
                    />
                  </SettingRow>
                  <SettingRow label={this.formatMessage('relatedRecords')}>
                    <Switch
                      className='can-x-switch'
                      checked={relatedRecords}
                      data-key='relatedRecords'
                      onChange={evt => { this.onPropertyChange('relatedRecords', evt.target.checked) }}
                      aria-label={this.formatMessage('relatedRecords')}
                    />
                  </SettingRow>
                  <SettingRow label={this.formatMessage('runtimeDataEditing')}>
                    <Switch
                      className='can-x-switch'
                      checked={liveDataEditing}
                      data-key='liveDataEditing'
                      onChange={evt => { this.onPropertyChange('liveDataEditing', evt.target.checked) }}
                      aria-label={this.formatMessage('runtimeDataEditing')}
                    />
                  </SettingRow>
                  <SettingRow label={this.formatMessage('initialReshapeMode')}>
                    <Switch
                      className='can-x-switch'
                      checked={initialReshapeMode}
                      data-key='initialReshapeMode'
                      onChange={evt => { this.onPropertyChange('initialReshapeMode', evt.target.checked) }}
                      aria-label={this.formatMessage('initialReshapeMode')}
                    />
                  </SettingRow>
                </Fragment>
              }
              {isAttrMode &&
                <Fragment>
                  <SettingRow
                    flow='wrap'
                    label={this.formatMessage('description')}
                  >
                    <TextArea
                      className='w-100'
                      height={90}
                      aria-label={this.formatMessage('description')}
                      placeholder={this.formatMessage('editFieldDescription')}
                      defaultValue={config.description ?? ''}
                      onBlur={evt => { this.onPropertyChange('description', evt.target.value) }}
                    />
                  </SettingRow>
                  <SettingRow
                    flow='wrap'
                    label={this.formatMessage('noDataMessage')}
                  >
                    <TextArea
                      className='w-100'
                      height={75}
                      aria-label={this.formatMessage('noDataMessage')}
                      placeholder={this.formatMessage('noDataMessageDefaultText')}
                      defaultValue={config.noDataMessage}
                      onBlur={evt => { this.onPropertyChange('noDataMessage', evt.target.value) }}
                    />
                  </SettingRow>
                </Fragment>
              }
            </SettingSection>
          }
          <JimuMapViewComponent
            useMapWidgetId={useMapWidgetIds?.[0]}
            onViewsCreate={this.onViewsCreate}
          />
          <SidePopper
            position='right'
            isOpen={showLayerPanel && !urlUtils.getAppIdPageIdFromUrl().pageId}
            toggle={this.onCloseLayerPanel}
            trigger={this.sidePopperTrigger?.current}
            backToFocusNode={this.state.popperFocusNode}
          >
            <LayerConfig
              {...config.layersConfig.asMutable({ deep: true })[this.index]}
              intl={this.props.intl}
              theme={theme}
              isMapMode={isGeoMode}
              layerEditingEnabled={layerEditingEnabled}
              dataSourceChange={this.dataSourceChangeSave}
              filterDs={this.onFilterDs}
              optionChange={this.optionChangeSave}
              multiOptionsChange={this.multiOptionsChangeSave}
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
