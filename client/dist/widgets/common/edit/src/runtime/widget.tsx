/** @jsx jsx */
import {
  React,
  jsx,
  type AllWidgetProps,
  classNames,
  type QueriableDataSource,
  DataSourceStatus,
  type IMState,
  dataSourceUtils,
  DataSourceManager,
  type DataRecord,
  type AppMode,
  type DataSource,
  defaultMessages as jimuCoreMessages,
  appActions,
  privilegeUtils,
  esri,
  lodash,
  SessionManager,
  ServiceManager,
  type QueryParams,
  type IMRuntimeInfos,
  WidgetState,
  AllDataSourceTypes,
  type ImageryLayerDataSource,
  type SubtypeSublayerDataSource,
  Immutable,
  type SceneLayerDataSource,
  type IMUseDataSource
} from 'jimu-core'
import {
  EditModeType,
  type IMConfig,
  LayerHonorModeType,
  SparkChangedType,
  SnapSettingMode,
  type LayersConfig
} from '../config'
import {
  type FeatureDataRecord,
  type FeatureLayerDataSource,
  JimuMapViewComponent,
  type JimuMapView,
  ADD_TO_MAP_DATA_ID_PREFIX,
  LayerTypes,
  type JimuLayerView,
  SHOW_ON_MAP_DATA_ID_PREFIX
} from 'jimu-arcgis'
import defaultMessages from './translations/default'
import {
  defaultMessages as jimuUIDefaultMessages,
  Button,
  Select,
  WidgetPlaceholder,
  TextInput,
  Loading
} from 'jimu-ui'
import { getStyle } from './style'
import EditItemDataSource from './edit-item-ds'
import { PlusOutlined } from 'jimu-icons/outlined/editor/plus'
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info'
import FeatureForm from 'esri/widgets/FeatureForm'
import Editor from 'esri/widgets/Editor'
import FeatureLayer from 'esri/layers/FeatureLayer'
import OrientedImageryLayer from 'esri/layers/OrientedImageryLayer'
import FormTemplate from 'esri/form/FormTemplate'
import FieldElement from 'esri/form/elements/FieldElement'
import GroupElement from 'esri/form/elements/GroupElement'
import type RelationshipElement from 'esri/form/elements/RelationshipElement'
import Graphic from 'esri/Graphic'
import Query from 'esri/rest/support/Query'
import { versionManager } from '../version-manager'
import { WarningOutlined } from 'jimu-icons/outlined/suggested/warning'
import reactiveUtils from 'esri/core/reactiveUtils'
import { SearchOutlined } from 'jimu-icons/outlined/editor/search'
import { getAllLayersConfig, sortJimuLayerViews } from '../utils'

const editPlaceholderIcon = require('./assets/icons/placeholder-edit-geometry-empty.svg')
const CSS = {
  base: 'esri-item-list',
  widget: 'esri-widget',
  header: 'esri-editor__header',
  formHeader: 'esri-feature-form__form-header',
  description: 'esri-feature-form__description-text',
  controls: 'esri-editor__controls',
  buttonDisabled: 'esri-button--disabled',
  heading: 'esri-widget__heading',
  featureForm: 'esri-feature-form',
  filterContainer: 'esri-item-list__filter-container',
  filterPlaceholder: 'esri-item-list__filter-placeholder',
  filterPlaceholderText: 'esri-item-list__filter-placeholder-text',
  scroller: 'esri-editor__scroller',
  content: 'esri-editor__content',
  list: 'esri-item-list__list',
  group: 'esri-item-list__group',
  noMatchesMessage: 'esri-item-list__no-matches-message',
  itemLabel: 'esri-item-list__list-item-label',
  itemContainer: 'esri-item-list__list-item-container',
  item: 'esri-item-list__list-item',
  groupHeader: 'esri-item-list__group-header',
  interactive: 'esri-interactive',
  backButton: 'esri-editor__back-button',
  title: 'esri-editor__title',
  leftArrowIcon: 'esri-icon-left',

  widgetHeading: 'esri-widget__heading',
  warningOption: 'esri-editor__warning-option',
  warningOptionPrimary: 'esri-editor__warning-option--primary',
  warningOptionPositive: 'esri-editor__warning-option--positive',

  progressBar: 'esri-editor__progress-bar',
  promptDanger: 'esri-editor__prompt--danger',
  promptHeader: 'esri-editor__prompt__header',
  promptHeaderHeading: 'esri-editor__prompt__header__heading',
  promptMessage: 'esri-editor__prompt__message',
  promptDivider: 'esri-editor__prompt__divider',
  promptActions: 'esri-editor__prompt__actions',
  loader: 'esri-feature-table__loader',
  loaderContainer: 'esri-feature-table__loader-container'
}
const messages = Object.assign({}, defaultMessages, jimuUIDefaultMessages, jimuCoreMessages)
const supportLayerTypes = Immutable([
  LayerTypes.FeatureLayer, LayerTypes.SceneLayer, LayerTypes.BuildingComponentSublayer,
  LayerTypes.OrientedImageryLayer, LayerTypes.SubtypeSublayer
])
const supportedDsTypes = Immutable([
  AllDataSourceTypes.FeatureLayer, AllDataSourceTypes.SceneLayer, AllDataSourceTypes.BuildingComponentSubLayer,
  AllDataSourceTypes.OrientedImageryLayer, AllDataSourceTypes.SubtypeSublayer
])

export interface Props {
  appMode: AppMode
  widgetsRuntimeInfo: IMRuntimeInfos
}

export interface GroupFeature {
  id: string
  label: string
  items: __esri.Graphic[]
}

export interface ControlButton {
  label: string
  type: 'default' | 'primary' | 'secondary' | 'tertiary'
  clickHandler: () => void
  disabled?: boolean
}

export enum ModifyType {
  new = 'NEW',
  update = 'UPDATE'
}

export interface State {
  jimuMapView: JimuMapView
  dataSources: { [dsId: string]: DataSource }
  outputDataSourceIsNotReady: { [dsId: string]: boolean }
  editFeatures: { [dsId: string]: DataRecord[] }
  activeId: string
  featureFormStep: 'empty' | 'list' | 'form' | 'new'
  filterText: string
  formPrivileges: 'full' | 'none' | 'normal'
  formEditable?: boolean
  delConfirm: boolean
  attrUpdating: boolean
  formChange: boolean
  formSubmittable: boolean
  loading: boolean
  selectionStartWorkflow: boolean
  selectionChangeConfirm: boolean
  fullLayersConfig: LayersConfig[]
  mapUseDataSources: IMUseDataSource[]
  mapDataSources: IMUseDataSource[]
}

export default class Widget extends React.PureComponent<
AllWidgetProps<IMConfig> & Props,
State
> {
  edit: __esri.FeatureForm | __esri.Editor
  editContainer: React.RefObject<HTMLDivElement>
  formHeaderContainer: React.RefObject<HTMLDivElement>

  dsManager: DataSourceManager
  removeLayerOnce: boolean
  selectedIds: { [dsId: string]: string[] }
  currentRequestId: number
  timerFn: any
  editorSelectFeature: boolean
  editorNotBackButton: boolean
  relationships: { [layerId: string]: any }
  changeBeforeRender: any
  loadChangeAfterRenderTimer: any
  toBeChangedSelection: { dataSourceId: string, selectedIds: string[] }
  remainDsId: string
  isActiveViewChange: boolean

  static mapExtraStateProps = (
    state: IMState,
    props: AllWidgetProps<IMConfig>
  ): Props => {
    return {
      appMode: state?.appRuntimeInfo?.appMode,
      widgetsRuntimeInfo: state?.widgetsRuntimeInfo
    }
  }

  constructor (props) {
    super(props)

    this.state = {
      jimuMapView: undefined,
      dataSources: {},
      outputDataSourceIsNotReady: {},
      editFeatures: {},
      activeId: undefined,
      featureFormStep: 'empty',
      filterText: '',
      formPrivileges: 'normal',
      formEditable: false,
      delConfirm: false,
      attrUpdating: false,
      formChange: false,
      formSubmittable: true,
      loading: false,
      selectionStartWorkflow: false,
      selectionChangeConfirm: false,
      fullLayersConfig: undefined,
      mapUseDataSources: [],
      mapDataSources: []
    }
    this.editContainer = React.createRef<HTMLDivElement>()
    this.formHeaderContainer = React.createRef<HTMLDivElement>()
    this.dsManager = DataSourceManager.getInstance()
    this.removeLayerOnce = false
    this.selectedIds = {}
    this.currentRequestId = 0
    this.timerFn = null
    this.editorSelectFeature = false
    this.editorNotBackButton = false
    this.relationships = {}
    this.changeBeforeRender = undefined
    this.loadChangeAfterRenderTimer = undefined
    this.toBeChangedSelection = { dataSourceId: '', selectedIds: [] }
    this.remainDsId = ''
    this.isActiveViewChange = false
  }

  static versionManager = versionManager

  async componentDidUpdate (prevProps: AllWidgetProps<IMConfig> & Props, prevState: State) {
    const { id, config, widgetsRuntimeInfo, useMapWidgetIds } = this.props
    const { editFeatures, dataSources, activeId, jimuMapView, featureFormStep, fullLayersConfig, mapUseDataSources } = this.state
    const {
      editMode, layersConfig, mapViewsConfig, selfSnapping, featureSnapping, defaultSelfEnabled, defaultFeatureEnabled, defaultSnapLayers,
      snapSettingMode, tooltip, defaultTooltipEnabled, templateFilter, relatedRecords, liveDataEditing, initialReshapeMode
    } = config
    const { editFeatures: preEditFeatures, fullLayersConfig: preFullLayersConfig, mapUseDataSources: preMapUseDataSources } = prevState
    const { config: preConfig, widgetsRuntimeInfo: preWidgetsRuntimeInfo, useMapWidgetIds: preUseMapWidgetIds } = prevProps
    const {
      editMode: preEditMode, layersConfig: preLayersConfig, mapViewsConfig: preMapViewsConfig, selfSnapping: preSelf, featureSnapping: preFeature, defaultSelfEnabled: preDefaultSelfEnabled, defaultFeatureEnabled: preDefaultFeatureEnabled,
      defaultSnapLayers: preDefaultSnapLayers, snapSettingMode: preSnapSettingMode, tooltip: preTooltip, defaultTooltipEnabled: preDefaultTooltipEnabled, templateFilter: preTemplateFilter,
      relatedRecords: preRelatedRecords, liveDataEditing: preLiveDataEditing, initialReshapeMode: preInitialReshapeMode
    } = preConfig
    // if mapUseDataSources ds component need to update
    if (lodash.isDeepEqual(mapUseDataSources, preMapUseDataSources)) {
      this.setState({ mapDataSources: mapUseDataSources })
    }
    // map removed
    if (!lodash.isDeepEqual(useMapWidgetIds, preUseMapWidgetIds) && (!useMapWidgetIds || useMapWidgetIds.length === 0)) {
      this.setState({ fullLayersConfig: [] })
      return
    }
    let allLayersConfig
    // update all config
    const isGeoMode = editMode === EditModeType.Geometry
    const layersConfigChange = !lodash.isDeepEqual(layersConfig, preLayersConfig) || !lodash.isDeepEqual(mapViewsConfig, preMapViewsConfig)
    if (layersConfigChange || editMode !== preEditMode) {
      allLayersConfig = await getAllLayersConfig(layersConfig, mapViewsConfig, jimuMapView, isGeoMode)
      this.setState({ fullLayersConfig: allLayersConfig })
      // config change need to update useDs for map mode
      if (isGeoMode) this.updateAllUseDataSourcesFromView(jimuMapView)
    } else {
      allLayersConfig = fullLayersConfig
    }
    // widget controller open/close
    // Edit is in controller
    const currentWidgetState = widgetsRuntimeInfo[id].state
    const prevWidgetState = preWidgetsRuntimeInfo[id].state
    const inConfigEditFeatures = this.getInLayersConfigFeatures(editFeatures, allLayersConfig)
    const flatEditFeatures = this.flatMapArray(inConfigEditFeatures)
    const editCount = flatEditFeatures.length
    if (isGeoMode) {
      if (prevWidgetState === WidgetState.Opened && currentWidgetState === WidgetState.Closed) {
        const edit = this.edit as __esri.Editor
        if (edit?.activeWorkflow) edit?.cancelWorkflow()
      } else if (prevWidgetState === WidgetState.Closed && currentWidgetState === WidgetState.Opened && editCount !== 0) {
        this.setState({ selectionStartWorkflow: true }, () => {
          this.startWorkFlowWhenAwait()
        })
      }
    } else {
      if (prevWidgetState === WidgetState.Closed && currentWidgetState === WidgetState.Opened) {
        this.createEditForm(activeId, false)
      }
    }
    // The 'editFeatures' not equal to 0, 'preEditFeatures' are different from 'editFeatures',indicates that some selections change to other selections.
    // In this case, even if the state becomes 'ready', there is no need to deselect dataSource
    const preInConfigEditFeatures = this.getInLayersConfigFeatures(preEditFeatures, preLayersConfig)
    const flatPreEditFeatures = this.flatMapArray(preInConfigEditFeatures)
    const newEditCount = flatEditFeatures.length
    const preEditCount = flatPreEditFeatures.length
    if (newEditCount !== 0 && preEditCount !== 0 && !this.getWhetherArrayIsShallowEqual(flatEditFeatures, flatPreEditFeatures)) {
      this.editorNotBackButton = true
    } else {
      this.editorNotBackButton = false
    }
    // props change and state change will cause configSetting change both, only exec when state change
    const configSettingChange = !lodash.isDeepEqual(preFullLayersConfig, allLayersConfig) && !lodash.isDeepEqual(prevState, this.state)
    const liveDataEnableChange = liveDataEditing !== preLiveDataEditing
    const relatedRecordsChange = relatedRecords !== preRelatedRecords
    const generalSettingChange = liveDataEnableChange || relatedRecordsChange
    if (allLayersConfig?.length === 0) this.destroyEdit()
    const editModeChange = preEditMode !== editMode
    if (editModeChange) this.destroyEdit()
    // liveData and relatedRecords need to new editor
    if (configSettingChange || generalSettingChange) {
      if (isGeoMode) {
        this.newOrUpdateEditor(ModifyType.new, undefined, relatedRecordsChange, allLayersConfig)
      } else {
        const edit = this.edit as __esri.FeatureForm
        const selectedDs = Object.keys(editFeatures)
        const hasSelected = layersConfig.some(config => selectedDs.includes(config.id))
        const inConfigEditFeatures = this.getInLayersConfigFeatures(editFeatures, layersConfig)
        const flatEditFeatures = this.flatMapArray(inConfigEditFeatures)
        const editCount = flatEditFeatures.length
        if (edit?.formTemplate && layersConfig.length !== 0) {
          const activeConfig = layersConfig.asMutable({ deep: true }).find(item => item.id === activeId)
          // layerHonorMode change
          if (activeConfig?.layerHonorMode === LayerHonorModeType.Webmap) {
            const dataSource = dataSources[activeId]
            edit.formTemplate = (dataSource as any)?.layer?.formTemplate
          } else if (edit?.formTemplate) {
            const formElements = this.constructFormElements()
            const formTemplate = new FormTemplate({
              elements: formElements
            })
            edit.formTemplate = formTemplate
          }
          const elements = edit?.formTemplate?.elements
          if (elements?.length === 0) {
            document.getElementById(`edit-container-${id}`)?.classList.add('esri-hidden')
          } else if (editCount !== 0 && featureFormStep === 'form') {
            document.getElementById(`edit-container-${id}`)?.classList.remove('esri-hidden')
          }
        } else if (layersConfig.length !== 0 && hasSelected) {
          // some feature has been selected before mode change
          if (editCount === 1) {
            const dataSource = dataSources?.[selectedDs[0]]
            const graphic = dataSource.getSelectedRecords()?.[0] as any
            if (!graphic) return
            this.renderFeatureForm(dataSource as QueriableDataSource, graphic)
          } else if (editCount > 1 || editCount === 0) {
            document.getElementById(`edit-container-${id}`)?.classList.add('esri-hidden')
          }
        }
      }
    }
    // snap config change
    const flexibleMode = snapSettingMode === SnapSettingMode.Flexible
    const snapOn = selfSnapping || featureSnapping
    const snappingControlsOpen = flexibleMode && snapOn
    const settingsOpen = snappingControlsOpen || tooltip
    const snapChange = (selfSnapping !== preSelf) || (featureSnapping !== preFeature) || (defaultSelfEnabled !== preDefaultSelfEnabled) ||
      (defaultFeatureEnabled !== preDefaultFeatureEnabled) || (defaultSnapLayers !== preDefaultSnapLayers) || (snapSettingMode !== preSnapSettingMode)
    if (snapChange) {
      const defaultSnapSources = await this.getDefaultSnapSources(jimuMapView, defaultSnapLayers)
      if (this.edit && isGeoMode) {
        const editor = (this.edit as Editor)
        const orgVisibleElements = editor.visibleElements
        const newVisibleElements = {
          ...orgVisibleElements,
          settingsMenu: settingsOpen,
          tooltipsToggle: tooltip,
          snappingControls: snappingControlsOpen,
          snappingControlsElements: {
            enabledToggle: true,
            selfEnabledToggle: selfSnapping,
            featureEnabledToggle: featureSnapping,
            gridEnabledToggle: false,
            gridControls: false,
            gridControlsElements: {}
          }
        }
        const orgSnappingOptions = editor.snappingOptions
        const newSnappingOptions: any = {
          ...orgSnappingOptions,
          enabled: defaultSelfEnabled || defaultFeatureEnabled,
          selfEnabled: defaultSelfEnabled,
          featureEnabled: defaultFeatureEnabled,
          featureSources: defaultSnapSources
        }
        editor.visibleElements = newVisibleElements
        editor.snappingOptions = newSnappingOptions
      }
    }
    // tooltip config change
    const tooltipChange = (tooltip !== preTooltip) || (defaultTooltipEnabled !== preDefaultTooltipEnabled)
    if (tooltipChange) {
      if (this.edit && isGeoMode) {
        const editor = (this.edit as Editor)
        editor.visibleElements.tooltipsToggle = tooltip
        editor.visibleElements.settingsMenu = settingsOpen

        const orgTooltipOptions = editor.tooltipOptions
        const newTooltipOptions: any = {
          ...orgTooltipOptions,
          enabled: defaultTooltipEnabled
        }
        editor.tooltipOptions = newTooltipOptions
      }
    }
    // template filter config change
    if (templateFilter !== preTemplateFilter) {
      if (this.edit && isGeoMode) {
        const editor = (this.edit as Editor)
        editor.supportingWidgetDefaults = {
          featureTemplates: {
            visibleElements: {
              filter: templateFilter
            }
          }
        }
      }
    }
    // initialReshapeMode config change
    if (initialReshapeMode !== preInitialReshapeMode) {
      if (this.edit && isGeoMode) {
        const editor = (this.edit as Editor)
        editor.supportingWidgetDefaults = {
          sketch: {
            defaultUpdateOptions: {
              tool: initialReshapeMode ? 'reshape' : 'transform'
            }
          }
        }
      }
    }
    const removeLayerFlag = this.props?.stateProps?.removeLayerFlag || false
    if (removeLayerFlag && !this.removeLayerOnce) {
      this.props.dispatch(
        appActions.widgetStatePropChange(id, 'removeLayerFlag', false)
      )
      const newEditFeatures = Object.assign({}, editFeatures)
      const idArray = Object.keys(newEditFeatures)
      idArray.forEach(id => {
        if (!layersConfig.find(config => config.id === id)) {
          delete newEditFeatures[id]
        }
      })
      const inConfigEditFeatures = this.getInLayersConfigFeatures(newEditFeatures, layersConfig)
      const flatEditFeatures = this.flatMapArray(inConfigEditFeatures)
      const editCount = flatEditFeatures.length
      const step = editCount > 1 ? 'list' : editCount === 1 ? 'form' : 'empty'
      if (step === 'form') {
        this.removeLayerOnce = true
        const dsId = flatEditFeatures[0]?.dataSource?.belongToDataSource?.id
        document.getElementById(`edit-container-${id}`)?.classList.remove('esri-hidden')
        this.renderFeatureForm(dataSources[dsId] as QueriableDataSource, flatEditFeatures[0])
      } else if (step === 'list') {
        document.getElementById(`edit-container-${id}`)?.classList.add('esri-hidden')
      }
      this.setState({ editFeatures: newEditFeatures, featureFormStep: step })
    }
  }

  componentWillUnmount () {
    const { config } = this.props
    const { editMode } = config
    const isGeoMode = editMode === EditModeType.Geometry
    if (this.edit && !this.edit.destroyed && isGeoMode) {
      const edit = this.edit as __esri.Editor
      edit?.cancelWorkflow && edit.cancelWorkflow()
    }
  }

  getWhetherArrayIsShallowEqual = (arr1: any[], arr2: any[]): boolean => {
    let isEqual = false
    if (arr1 && arr2 && arr1.length === arr2.length) {
      isEqual = !arr1.some((v, i) => v !== arr2[i])
    }
    return isEqual
  }

  updateAllUseDataSourcesFromView = (jimuMapView: JimuMapView) => {
    if (!jimuMapView || jimuMapView.isDestroyed()) return
    const { config } = this.props
    const { mapViewsConfig } = config
    const viewConfig = mapViewsConfig?.[jimuMapView.id]
    const customizeLayers = viewConfig?.customizeLayers
    const customJimuLayerViewIds = viewConfig?.customJimuLayerViewIds
    const mapUseDataSources = []
    const jimuLayerViews = jimuMapView.jimuLayerViews
    for (const layerViewId in jimuLayerViews) {
      const jimuLayerView = jimuLayerViews[layerViewId]
      const isLayerVisible = jimuLayerView.isLayerVisible()
      if (!isLayerVisible) continue
      if (customizeLayers && !customJimuLayerViewIds?.includes(layerViewId)) continue
      const layerDs = jimuLayerView?.getLayerDataSource()
      if (!layerDs || !supportedDsTypes.includes(layerDs.type as any)) continue
      const currentDs = this.dsManager.getDataSource(layerDs.id)
      const mainDs = currentDs.getMainDataSource()
      const rootDs = currentDs.getRootDataSource()
      const usedDs: IMUseDataSource = Immutable({
        dataSourceId: currentDs.id,
        mainDataSourceId: mainDs?.id,
        dataViewId: currentDs.dataViewId,
        rootDataSourceId: rootDs?.id
      })
      mapUseDataSources.push(usedDs)
    }
    this.setState({ mapUseDataSources })
  }

  visibleChangedListener = async (visibleChangedJimuLayerViews: JimuLayerView[]) => {
    const { jimuMapView } = this.state
    const { config } = this.props
    const { layersConfig, mapViewsConfig, editMode } = config
    const isGeoMode = editMode === EditModeType.Geometry
    const allLayersConfig = await getAllLayersConfig(layersConfig, mapViewsConfig, jimuMapView, isGeoMode)
    this.setState({ fullLayersConfig: allLayersConfig })
  }

  viewCreatedListener = async (jimuLayerView: JimuLayerView) => {
    if (jimuLayerView.fromRuntime) {
      const { jimuMapView } = this.state
      const { config } = this.props
      const { layersConfig, mapViewsConfig, editMode } = config
      const isGeoMode = editMode === EditModeType.Geometry
      const allLayersConfig = await getAllLayersConfig(layersConfig, mapViewsConfig, jimuMapView, isGeoMode)
      this.setState({ fullLayersConfig: allLayersConfig })
    }
  }

  viewRemovedListener = async (removedJimuLayerView: JimuLayerView) => {
    if (removedJimuLayerView.fromRuntime) {
      const { jimuMapView } = this.state
      const { config } = this.props
      const { layersConfig, mapViewsConfig, editMode } = config
      const isGeoMode = editMode === EditModeType.Geometry
      const allLayersConfig = await getAllLayersConfig(layersConfig, mapViewsConfig, jimuMapView, isGeoMode)
      this.setState({ fullLayersConfig: allLayersConfig })
    }
  }

  handleActiveViewChange = async (jimuMapView: JimuMapView) => {
    const { config } = this.props
    const { editMode, layersConfig, mapViewsConfig } = config
    const isGeoMode = editMode === EditModeType.Geometry
    if (jimuMapView) await jimuMapView.whenAllJimuLayerViewLoaded()
    const allLayersConfig = await getAllLayersConfig(layersConfig, mapViewsConfig, jimuMapView, isGeoMode)
    this.setState({ jimuMapView, fullLayersConfig: allLayersConfig }, () => {
      this.isActiveViewChange = true
      this.updateAllUseDataSourcesFromView(jimuMapView)
      if (jimuMapView) {
        jimuMapView.removeJimuLayerViewsVisibleChangeListener(this.visibleChangedListener)
        jimuMapView.removeJimuLayerViewCreatedListener(this.viewCreatedListener)
        jimuMapView.removeJimuLayerViewRemovedListener(this.viewRemovedListener)
        if (isGeoMode) {
          jimuMapView.addJimuLayerViewsVisibleChangeListener(this.visibleChangedListener)
          jimuMapView.addJimuLayerViewCreatedListener(this.viewCreatedListener)
          jimuMapView.addJimuLayerViewRemovedListener(this.viewRemovedListener)
        }
      }

      if (!jimuMapView) {
        this.destroyEdit()
      }
    })
  }

  formatMessage = (id: string, values?: { [key: string]: any }) => {
    return this.props.intl.formatMessage(
      { id: id, defaultMessage: messages[id] },
      values
    )
  }

  destroyEdit = () => {
    this.edit && !this.edit.destroyed && this.edit.destroy()
  }

  flatMapArray = (editFeatures) => {
    // flat editFeatures
    const flatEditFeatures = []
    for (const dsId in editFeatures) {
      if (editFeatures?.[dsId]) {
        flatEditFeatures.push(...editFeatures[dsId])
      }
    }
    return flatEditFeatures
  }

  flatMapArrayWithView = (editFeatures, jimuMapView: JimuMapView) => {
    const flatEditFeatures = []
    const mapDsId = jimuMapView?.dataSourceId
    for (const dsId in editFeatures) {
      if (dsId.indexOf(mapDsId) === 0 && editFeatures?.[dsId]) {
        flatEditFeatures.push(...editFeatures[dsId])
      }
    }
    return flatEditFeatures
  }

  createEditForm = async (dataSourceId: string, dsChange: boolean, newRequestId?: number) => {
    const { dataSources, editFeatures } = this.state
    const { id, config } = this.props
    const { layersConfig } = config
    const dataSource = dataSources[dataSourceId] as QueriableDataSource
    // update editFeatures for some change cause by url
    const newEditFeatures = editFeatures
    if (dataSource) {
      newEditFeatures[dataSourceId] = dataSource.getSelectedRecords()
    }
    const inConfigEditFeatures = this.getInLayersConfigFeatures(newEditFeatures, layersConfig)
    const flatEditFeatures = this.flatMapArray(inConfigEditFeatures)
    const editCount = flatEditFeatures.length
    const step = editCount > 1 ? 'list' : editCount === 1 ? 'form' : 'empty'
    this.setState({ featureFormStep: step })
    // create FeatureForm or change edit feature
    if (editCount === 1) {
      const graphic = dataSource.getSelectedRecords()?.[0] as any
      const objectIdField = dataSource.getIdField() || 'OBJECTID'
      const recordQuery = graphic
        ? `${objectIdField} IN (${graphic.getId()})`
        : ''
      const fullGraphic = await dataSource.query({
        where: recordQuery,
        returnGeometry: true,
        notAddFieldsToClient: true,
        outFields: ['*']
      } as QueryParams).then(result => {
        return result?.records?.[0]
      })
      // Deselect one by one until the last one, if not the current DS, needs special treatment
      if (!fullGraphic) return
      if (dsChange || !this.edit || this.edit?.destroyed) {
        this.renderFeatureForm(dataSource, fullGraphic, newRequestId)
      } else {
        document.getElementById(`edit-container-${id}`)?.classList.remove('esri-hidden')
        this.createOrUpdateHeader(dataSource, (fullGraphic as FeatureDataRecord)?.feature)
        const edit = this.edit as __esri.FeatureForm
        if (!edit) return
        const graphicFeature = await dataSourceUtils.changeToJSAPIGraphic((fullGraphic as FeatureDataRecord)?.feature)
        edit.feature = graphicFeature
      }
    } else if (editCount > 1 || editCount === 0) { // list or no data
      document.getElementById(`edit-container-${id}`)?.classList.add('esri-hidden')
    }
  }

  getDsAccessibleInfo = (url: string) => {
    if (!url) return Promise.resolve(false)
    const request = esri.restRequest.request
    return request(`${url}?f=json`).then(info => {
      if (Object.keys(info).includes('error')) {
        return false
      } else {
        return true
      }
    }).catch((err) => {
      return false
    })
  }

  getPrivilege = () => {
    return privilegeUtils.checkExbAccess(privilegeUtils.CheckTarget.Experience).then(exbAccess => {
      return exbAccess?.capabilities?.canEditFeature
    })
  }

  getIsAdvancedPermission = async (editorLayer, dataSource?): Promise<boolean> => {
    const { dataSources } = this.state
    const currentLayerDs = dataSource || dataSources[Object.keys(dataSources).find(dsId => dsId.includes(editorLayer.id))]
    if (!currentLayerDs) return false
    const layerItemInfo = await currentLayerDs?.fetchItemInfo().then(info => {
      return info
    }).catch(err => {
      console.error(err)
    })
    if (!layerItemInfo || !layerItemInfo.url) return false
    // user is admin/owner, or user and item are in the same update org
    // If there is no portalUrl, it means it's non-hosted (sampleServer6)
    const portalUrl = ServiceManager.getInstance().getServerInfoByServiceUrl(layerItemInfo.url)?.owningSystemUrl
    if (!portalUrl) return false
    const sessionForItem = SessionManager.getInstance().getSessionByUrl(portalUrl)
    // If there is no session, it means there was no pop-up login
    if (!sessionForItem) return false
    const user = await sessionForItem.getUser()
    const isAdmin = user?.role === 'org_admin' && layerItemInfo?.isOrgItem
    const isOwner = layerItemInfo.owner === user?.username
    const isInUpdatedGroup = await privilegeUtils.isItemInTheUpdatedGroup(layerItemInfo.id, sessionForItem)
    return isAdmin || isOwner || isInUpdatedGroup
  }

  sendSparkMsg = (changedType: SparkChangedType, layerName: string) => {
    const sendDiscussionAsync = (window as any)?.Capacitor?.Plugins?.Spark?.sendDiscussionAsync
    if (sendDiscussionAsync) {
      const appUrl = window.location.href
      sendDiscussionAsync({
        title: `${changedType} data to ${layerName}`,
        content: appUrl
      })
    }
  }

  getTimezone = (dataSource) => {
    return dataSourceUtils.getTimezoneAPIFromRuntime(dataSource.getTimezone())
  }

  renderFeatureForm = (orgDataSource: QueriableDataSource, graphic?, newRequestId?, isAdd?: boolean) => {
    this.setState({ loading: true })
    const { activeId } = this.state
    const { config, id } = this.props
    const { editMode, layersConfig } = config
    const activeConfig = layersConfig.asMutable({ deep: true }).find(item => item.id === activeId)
    this.destroyEdit()
    const isSceneLayer = orgDataSource?.type === AllDataSourceTypes.SceneLayer || orgDataSource?.type === AllDataSourceTypes.BuildingComponentSubLayer
    const dataSource = isSceneLayer ? (orgDataSource as SceneLayerDataSource).getAssociatedDataSource() : orgDataSource
    this.getFeatureLayer(dataSource).then(async (layer) => {
      const doNotRender = newRequestId && (newRequestId !== this.currentRequestId)
      if (doNotRender) {
        this.setState({ loading: false })
        return
      }
      this.removeLayerOnce = false
      if (!layer) {
        this.setState({ loading: false })
        return
      }
      // Build container for edit
      const container = document && document.createElement('div')
      container.id = `edit-container-${id}`
      container.className = `edit-container-${id}`
      this.editContainer.current.appendChild(container)
      let featureLayer
      if (layer.layer) {
        featureLayer = layer.layer
      } else {
        featureLayer = layer
      }
      // fetch to confirm whether it's a public source
      const accessible = await this.getDsAccessibleInfo(featureLayer?.url)
      // use exb privilege instead of api's supportsUpdateByOthers
      const privilegeEditable = await this.getPrivilege()
      // New logic of API: The user with advanced permissions can modify the configuration regardless of the configuration
      const isAdvancedPermission = await this.getIsAdvancedPermission(featureLayer, dataSource)
      // full editing privileges
      const fullEditingPrivileges = featureLayer?.userHasFullEditingPrivileges
      const layerEditingEnabled = featureLayer?.editingEnabled ?? true
      const editable = accessible || privilegeEditable
      let formPrivileges
      if (isAdvancedPermission || (fullEditingPrivileges && layerEditingEnabled)) {
        formPrivileges = 'full'
      } else if (fullEditingPrivileges && !layerEditingEnabled) {
        formPrivileges = 'none'
      } else {
        formPrivileges = 'normal'
      }
      this.setState({
        formPrivileges,
        formEditable: editable
      })
      // check if the selected feature is editable
      const haveUpdateOrAdd = isAdd ? activeConfig.addRecords : (activeConfig.updateRecords || activeConfig.deleteRecords)
      if (formPrivileges === 'none' || (formPrivileges === 'normal' && !haveUpdateOrAdd)) {
        this.setState({ loading: false, featureFormStep: 'empty' })
        return
      }
      if (editMode === EditModeType.Attribute) {
        const elements = this.constructFormElements(dataSource.id)
        const formTemplate = new FormTemplate({
          elements: elements
        })
        const graphicFeature = graphic?.feature ? await dataSourceUtils.changeToJSAPIGraphic(graphic?.feature) : undefined
        const useFeature = graphicFeature || new Graphic({
          layer: featureLayer
        })
        const useFormTemplate = activeConfig.layerHonorMode === LayerHonorModeType.Webmap
          ? (dataSource as any)?.layer?.formTemplate
          : formTemplate
        this.edit = new FeatureForm({
          container: container,
          feature: useFeature,
          layer: featureLayer,
          formTemplate: useFormTemplate,
          timeZone: this.getTimezone(dataSource)
        })
        // Render form header
        this.createOrUpdateHeader(dataSource, useFeature)
        if (graphic) this.setState({ featureFormStep: 'form' })

        const editForm = this.edit
        editForm.on('submit', () => {
          const newFeature = editForm?.feature || useFeature
          if (newFeature) {
            if (newFeature?.geometry) {
              newFeature.geometry = null
            }
            // Grab updated attributes from the form.
            const updated = editForm.getValues()
            Object.keys(updated).forEach((name) => {
              newFeature.attributes[name] = updated[name]
            })
            // Setup the applyEdits parameter with updates.
            const edits = {
              updateFeatures: [newFeature]
            }
            this.applyAttributeUpdates(edits)
          }
        })

        editForm.on('value-change', (changedValue) => {
          const idField = dataSource.getIdField()
          const { feature, fieldName } = changedValue
          // Exclude cases where the 'value-change' is caused by dataSource select.
          // If the changed field has an idField, the change is caused by dataSource select change.
          if (fieldName === idField) return
          const formSubmittable = (this.edit.viewModel as __esri.FeatureFormViewModel)?.submittable
          this.setState({ formSubmittable })
          const originalFormValues = feature.attributes || editForm.feature.attributes
          const newFormValues = editForm?.viewModel.getValues()
          let changedFlag = false
          if (newFormValues) {
            for (const key in newFormValues) {
              if (originalFormValues[key] !== newFormValues[key]) {
                changedFlag = true
                break
              }
            }
          }
          this.setState({ formChange: changedFlag })
        })

        const isTableLayer = featureLayer.isTable
        const editsListener = (event) => {
          const { addedFeatures, updatedFeatures, deletedFeatures } = event
          const adds = addedFeatures && addedFeatures.length > 0
          const updates = updatedFeatures && updatedFeatures.length > 0
          const deletes = deletedFeatures && deletedFeatures.length > 0
          let changedType = SparkChangedType.Added
          if (adds) {
            changedType = SparkChangedType.Added
            const addFeature = event?.edits?.addFeatures?.[0]
            if (addFeature) {
              const idField = dataSource.getIdField()
              const record = dataSource.buildRecord(addFeature) as FeatureDataRecord
              const recordData = record?.getData() || {}
              record.setData({ ...recordData, [idField]: addedFeatures[0]?.objectId?.toString() })
              dataSource.afterAddRecord(record)
              if (isTableLayer) dataSource.selectRecordById(record.getId(), record)
            }
          }
          if (updates) {
            changedType = SparkChangedType.Updated
            const updateFeature = event?.edits?.updateFeatures?.[0]
            if (updateFeature) {
              const record = dataSource?.buildRecord(updateFeature)
              dataSource?.afterUpdateRecord(record)
            }
          }
          if (deletes) {
            changedType = SparkChangedType.Deleted
            const deleteFeature = event?.edits?.deleteFeatures?.[0]
            if (deleteFeature) {
              const record = dataSource.buildRecord(deleteFeature)
              dataSource.afterDeleteRecordById(record.getId())
            }
          }
          if (adds || updates || deletes) {
            this.sendSparkMsg(changedType, featureLayer.title)
          }
        }
        if (featureLayer.type === 'subtype-sublayer') {
          featureLayer.parent.on('edits', editsListener)
        } else {
          featureLayer.on('edits', editsListener)
        }
        this.setState({ loading: false })
      }
    }).catch(err => {
      this.setState({ loading: false })
      this.removeLayerOnce = false
      console.error(err)
    })
  }

  createOrUpdateHeader = (dataSource, feature) => {
    const { id } = this.props
    const { featureFormStep } = this.state
    const displayField = this.getLayerDisplayField(dataSource)
    const title = featureFormStep === 'new' ? this.formatMessage('addFeature') : feature?.attributes?.[displayField]
    if (!document?.getElementById(`form_heading_${id}`)) {
      const formDom = document && document.createElement('div')
      formDom.className = 'd-flex'
      formDom.innerHTML = `
        <button id='back_home_${id}' class='back-button surface-1 ${classNames(CSS.backButton)}' title='${this.formatMessage('back')}'><</button>
        <header class='${classNames(CSS.header)}'>
          <h4 id='form_heading_${id}' class='text-truncate ${classNames(CSS.heading)}' title='${title}'>${title}</h4>
        </header>
      `
      this.formHeaderContainer.current.appendChild(formDom)
      document.getElementById(`back_home_${id}`)?.addEventListener('click', this.handleBack)
    } else {
      document.getElementById(`form_heading_${id}`).innerText = title
    }
  }

  deleteChangeDataSource = (selectedAfterDel) => {
    const { activeId, editFeatures } = this.state
    const newEditFeatures = Object.assign({}, editFeatures)
    newEditFeatures[activeId] = selectedAfterDel
    this.setState({ editFeatures: newEditFeatures }, () => {
      this.createEditForm(activeId, false)
    })
  }

  applyAttributeUpdates = (params) => {
    const { dataSources, editFeatures, activeId } = this.state
    const editForm = this.edit as __esri.FeatureForm
    const dataSource = dataSources[activeId]
    const gdbVersion = (dataSource as FeatureLayerDataSource).getGDBVersion()
    const formLayer = editForm.layer as unknown as __esri.FeatureLayer
    formLayer.applyEdits(params, { gdbVersion }).then((editsResult) => {
      if (params?.deleteFeatures) {
        const selectedRecords = dataSource?.getSelectedRecords() as any
        const selectedAfterDel = selectedRecords.filter(item => item.feature.attributes !== params?.deleteFeatures[0].attributes)
        if (selectedAfterDel.length > 0) {
          this.deleteChangeDataSource(selectedAfterDel)
        } else {
          const newEditFeatures = Object.assign({}, editFeatures)
          delete newEditFeatures[activeId]
          const formHeader = this.formHeaderContainer.current
          if (formHeader?.innerHTML) formHeader.innerHTML = ''
          this.destroyEdit()
          this.setState({ editFeatures: newEditFeatures, featureFormStep: 'empty', activeId: '' })
        }
      } else if (params?.updateFeatures) {
        this.setState({ attrUpdating: false })
      }
      this.setState({ formChange: false, formSubmittable: true })
    }).catch((error) => {
      if (params?.updateFeatures) {
        this.setState({ attrUpdating: false })
      }
      console.error(error)
    })
  }

  constructFormElements = (dsId?) => {
    let { activeId } = this.state
    if (dsId) activeId = dsId
    const { config } = this.props
    const { layersConfig } = config
    const activeConfig = layersConfig.asMutable({ deep: true }).find(item => item.id === activeId)
    if (!activeConfig) return []
    const { groupedFields } = activeConfig
    const elements = groupedFields.map(item => {
      if (item?.children) {
        return new GroupElement({
          label: item.name,
          description: item.subDescription || item?.description,
          elements: item?.children.map(ele => {
            return new FieldElement({
              fieldName: ele.jimuName,
              label: ele?.alias || ele?.name,
              description: ele.subDescription || ele?.description,
              editableExpression: ele.editAuthority ? 'true' : 'false'
            })
          })
        })
      } else {
        return new FieldElement({
          fieldName: item.jimuName,
          label: item?.alias || item?.name,
          description: item.subDescription || item?.description,
          editableExpression: item.editAuthority ? 'true' : 'false'
        })
      }
    })
    return elements
  }

  onFilterChange = (evt) => {
    this.setState({ filterText: evt.target.value })
  }

  renderListItems = (editFeatures) => {
    const { filterText } = this.state
    const { config } = this.props
    const { layersConfig } = config
    const groupedSelectedFeatures = []
    for (const dsId in editFeatures) {
      const featuresArray = editFeatures[dsId]
      const dataSource = featuresArray?.[0]?.dataSource
      const beToDs = dataSource?.belongToDataSource
      const layerId = beToDs?.jimuChildId
      const layerLabel = beToDs?.layerDefinition?.name || beToDs?.layerDefinition?.description
      const displayField = this.getLayerDisplayField(dataSource)
      const objectIdField = this.getLayerObjectIdField(dataSource)
      const group = {
        id: layerId,
        label: layerLabel,
        dsId,
        items: featuresArray.filter(ele => {
          const label = ele.feature.attributes?.[displayField] || ele.feature.attributes?.[objectIdField] || ele.feature.attributes?.objectid
          const lowerCasedFilter = filterText.toLowerCase()
          return !lowerCasedFilter || label?.toString()?.toLowerCase().indexOf(lowerCasedFilter) > -1
        }).map(item => {
          const objectIdFieldValue = item.feature.attributes?.[displayField] || item.feature.attributes?.[objectIdField] || item.feature.attributes?.objectid
          return {
            id: objectIdFieldValue,
            dsId,
            label: objectIdFieldValue,
            data: item.feature
          }
        })
      }
      groupedSelectedFeatures.push(group)
    }
    let count = 0
    groupedSelectedFeatures.forEach(item => {
      count += item.items.length
    })
    // Sort the FeatureForm selection list
    groupedSelectedFeatures.sort((a, b) => {
      const aIndex = layersConfig.findIndex(config => config.layerId === a.id)
      const bIndex = layersConfig.findIndex(config => config.layerId === b.id)
      return aIndex - bIndex
    })

    if (count === 0) {
      return (
        <div className={CSS.noMatchesMessage} key='no-matches'>
          {this.formatMessage('noItemsFound')}
        </div>
      )
    }

    return (
      <div key='item-container'>
        {groupedSelectedFeatures.map(group =>
          this.renderGroup(group)
        )}
      </div>
    )
  }

  renderGroup = (group) => {
    if (group.items.length === 0) return

    return (
      <div role='group' aria-label={group.label} className={CSS.group} key={group.id}>
        <h4 className={classNames(CSS.groupHeader, CSS.heading)}>
          <span className={CSS.itemLabel}>{group.label}</span>
        </h4>
        <div className={CSS.list} role='listbox'>
          {group.items.map((item, index) =>
            this.renderItem(item, index)
          )}
        </div>
      </div>
    )
  }

  renderItem = (item, index: number) => {
    const key = `${item.dsId}__${item.label}_${index}`
    const { dataSources } = this.state

    return (
      <Button
        role='option'
        className={classNames(`w-100 border-0 ${CSS.item}`)}
        key={key}
        onClick={() => {
          clearTimeout(this.timerFn)
          this.timerFn = setTimeout(() => {
            this.renderFeatureForm(dataSources[item.dsId] as QueriableDataSource, { feature: item.data })
          }, 200)
        }}
        onDoubleClick={() => {
          clearTimeout(this.timerFn)
        }}
      >
        <div className={CSS.itemContainer}>
          <span className={CSS.itemLabel}>{item.label}</span>
        </div>
      </Button>
    )
  }

  getLayerDisplayField = (dataSource) => {
    const displayField =
      dataSource?.layer?.displayField ||
      dataSource?.layerDefinition?.displayField ||
      dataSource?.belongToDataSource?.layerDefinition?.displayField ||
      dataSource?.layer?.objectIdField ||
      dataSource?.layerDefinition?.objectIdField ||
      dataSource?.belongToDataSource?.layerDefinition?.objectIdField ||
      'OBJECTID'
    return displayField
  }

  getLayerObjectIdField = (dataSource) => {
    const objectIdField =
      dataSource?.layer?.objectIdField ||
      dataSource?.belongToDataSource?.layerDefinition?.objectIdField ||
      'OBJECTID'
    return objectIdField
  }

  renderFeatureList = (editFeatures, description: string) => {
    const { id, label, theme } = this.props
    const { filterText } = this.state
    const placeholderId = `${id}-placeholder`
    const formHeader = this.formHeaderContainer.current
    if (formHeader?.innerHTML) formHeader.innerHTML = ''

    return (
      <div className='surface-1 border-0 h-100'>
        <div className={CSS.featureForm}>
          <div className={CSS.formHeader}>
            <h2 className={CSS.heading}>{label}</h2>
            <p className={classNames(`text-truncate ${CSS.description}`)} key='description' title={description}>
              {description}
            </p>
          </div>
        </div>
        <div className={classNames(`feature-list ${CSS.content} ${CSS.scroller}`)}>
          <div className={classNames(CSS.base, CSS.widget)}>
            <div className='d-flex align-items-center m-2'>
              <TextInput
                aria-labelledby={placeholderId}
                className='w-100'
                placeholder={this.formatMessage('search')}
                onChange={this.onFilterChange}
                value={filterText}
                prefix={<SearchOutlined color={theme.ref.palette.neutral[700]} />}
                allowClear
                title={filterText}
              />
            </div>
            <div key='content' className={classNames(CSS.scroller)}>
              {this.renderListItems(editFeatures)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderFormEmpty = (description?: string) => {
    const { fullLayersConfig, jimuMapView } = this.state
    const { id, label, config } = this.props
    const { noDataMessage, editMode, layersConfig, mapViewsConfig } = config
    const formHeader = this.formHeaderContainer.current
    if (formHeader?.innerHTML) formHeader.innerHTML = ''
    const isAttrMode = editMode === EditModeType.Attribute
    const isMapMode = editMode === EditModeType.Geometry
    const hasValidLayer = isAttrMode ? layersConfig?.length > 0 : fullLayersConfig?.length > 0
    const noLayerTips = isAttrMode ? this.formatMessage('initAttEmptyMessage') : this.formatMessage('initGeoEmptyMessage')
    const emptyTips = hasValidLayer ? (noDataMessage || this.formatMessage('noRecordTips')) : noLayerTips
    const formDom = document.getElementById(`edit-container-${id}`)
    if (formDom) formDom?.classList.add('esri-hidden')
    const isCustom = mapViewsConfig?.[jimuMapView?.id]?.customizeLayers
    const haveCustomJimuLayerViewIds = isCustom ? mapViewsConfig?.[jimuMapView.id]?.customJimuLayerViewIds?.length >= 0 : true

    return (
      isMapMode && (!jimuMapView || (jimuMapView && !haveCustomJimuLayerViewIds))
        ? <div className='jimu-secondary-loading' />
        : <div className='surface-1 border-0 h-100'>
        <div className={classNames(`editor-white-bg ${CSS.featureForm}`)}>
          <div className={CSS.formHeader}>
            <h2 className={CSS.heading}>{label}</h2>
            {hasValidLayer &&
              <p className={classNames(`text-truncate ${CSS.description}`)} key='description' title={description}>
                {description}
              </p>
            }
          </div>
        </div>
        <div className='w-100 text-center edit-blank'>
          <div className='position-absolute edit-blank-content w-100'>
            <InfoOutlined size={32} className='placeholder-icon'/>
            <p>{emptyTips}</p>
          </div>
        </div>
      </div>
    )
  }

  renderControlButtons = (buttons: ControlButton[]) => {
    return (
      <div className={classNames(`flex-row justify-content-between ${CSS.controls}`)} key='controls'>
        {buttons.map(({ disabled = false, label, type, clickHandler }, index) =>
          this.renderButton({
            label,
            class: classNames(
              { 'single-buttons': buttons.length === 1 },
              { 'multi-buttons': buttons.length > 1 },
              disabled ? CSS.buttonDisabled : null
            ),
            type,
            disabled,
            clickHandler,
            key: index
          })
        )}
      </div>
    )
  }

  handleNew = (): void => {
    const { dataSources, formPrivileges } = this.state
    const { config } = this.props
    const { layersConfig } = config
    const formPrivilegesIsFull = formPrivileges === 'full'
    const formPrivilegesIsNormal = formPrivileges === 'normal'
    let firstId
    if (formPrivilegesIsFull) {
      firstId = layersConfig.find(config => config?.isTable)?.id
    } else if (formPrivilegesIsNormal) {
      firstId = layersConfig.find(config => config?.addRecords)?.id
    }
    if (firstId) {
      const firstDataSource = dataSources?.[firstId]
      if (!firstDataSource) return
      this.setState({ featureFormStep: 'new', activeId: firstId }, () => {
        this.renderFeatureForm(firstDataSource as QueriableDataSource, undefined, undefined, true)
      })
    }
  }

  handleAdd = (): void => {
    const formViewModel = this.edit.viewModel as __esri.FeatureFormViewModel
    if (formViewModel?.submittable) {
      const addFeature = formViewModel?.feature
      if (addFeature) {
        const updated = (this.edit as __esri.FeatureForm).getValues()
        addFeature.attributes = updated
        const edits = {
          addFeatures: [addFeature]
        }
        this.applyAttributeUpdates(edits)
      }
    }
  }

  handleSave = (): void => {
    const formViewModel = this.edit.viewModel as __esri.FeatureFormViewModel
    if (formViewModel?.submittable) {
      formViewModel?.submit()
      this.setState({ attrUpdating: true })
    }
  }

  handleDeleteConfirm = () => {
    this.setState({ delConfirm: true })
  }

  cancelDelete = () => {
    this.setState({ delConfirm: false })
  }

  handleDelete = (): void => {
    const { dataSources, activeId } = this.state
    const dataSource = dataSources[activeId]
    const currentRecord = dataSource?.getSelectedRecords()?.[0] as FeatureDataRecord
    const delFeature = currentRecord?.feature
    if (delFeature) {
      const edits = {
        deleteFeatures: [delFeature]
      }
      this.applyAttributeUpdates(edits)
    }
    this.setState({ delConfirm: false })
  }

  renderButton = (props) => {
    return (
      <Button
        className={props.class}
        disabled={props.disabled}
        key={props.key}
        onClick={props.clickHandler}
        type={props.type}
      >
        {props.label}
      </Button>
    )
  }

  constructFieldConfig = (groupedFields, relatedRecords: boolean, originalRelationshipElement = []) => {
    const useGroupedFields = groupedFields?.asMutable ? groupedFields.asMutable({ deep: true }) : groupedFields
    const elements: Array<GroupElement | FieldElement | RelationshipElement> = useGroupedFields.map(item => {
      if (item?.children) {
        return new GroupElement({
          label: item.name,
          description: item.subDescription || item?.description,
          elements: item?.children.map(ele => {
            return new FieldElement({
              fieldName: ele.jimuName,
              label: ele?.alias || ele?.name,
              description: ele.subDescription || ele?.description,
              editableExpression: ele.editAuthority ? 'true' : 'false'
            })
          })
        })
      } else {
        return new FieldElement({
          fieldName: item.jimuName,
          label: item?.alias || item?.name,
          description: item.subDescription || item?.description,
          editableExpression: item.editAuthority ? 'true' : 'false'
        })
      }
    })
    const newRelationshipElement = []
    if (!relatedRecords) {
      for (const element of originalRelationshipElement) {
        const newElement = element.clone()
        newElement.editableExpression = 'false'
        newRelationshipElement.push(newElement)
      }
    }
    const relationshipElement = relatedRecords ? originalRelationshipElement : newRelationshipElement
    const fullElements = relationshipElement ? elements.concat(relationshipElement) : elements
    return fullElements
  }

  editorLayerWatcher = (event, id: string, layer, layerName: string) => {
    const { dataSources, activeId } = this.state
    const dataSource = dataSources[id]
    const { addedFeatures, updatedFeatures, deletedFeatures } = event
    const adds = addedFeatures && addedFeatures.length > 0
    const updates = updatedFeatures && updatedFeatures.length > 0
    const deletes = deletedFeatures && deletedFeatures.length > 0
    let changedType = SparkChangedType.Added
    if (adds) {
      changedType = SparkChangedType.Added
      const addFeature = event?.edits?.addFeatures?.[0]
      if (addFeature) {
        const record = dataSource.buildRecord(addFeature)
        dataSource.afterAddRecord(record)
      }
    }
    if (updates) {
      changedType = SparkChangedType.Updated
      const updateFeature = event?.edits?.updateFeatures?.[0]
      const originalFeature = (this.edit.viewModel as __esri.EditorViewModel)?.featureFormViewModel?.feature || (this.edit as any)?._featureForm?.feature
      const originalAttributes = originalFeature?.attributes || {}
      const originalGeometry = originalFeature?.geometry || null
      const originalLayer = originalFeature?.layer || layer
      const newAttributes = Object.assign(originalAttributes, updateFeature?.attributes)
      updateFeature.attributes = newAttributes
      updateFeature.layer = originalLayer
      if (!updateFeature.geometry) updateFeature.geometry = originalGeometry
      if (updateFeature) {
        const record = dataSource?.buildRecord(updateFeature)
        dataSource?.afterUpdateRecord(record)
        const newEditFeatures = {}
        if (!activeId) return
        newEditFeatures[activeId] = [record]
        const editor = this.edit as Editor
        const editingLayerId = (editor.activeWorkflow.data as any)?.rootFeature?.layer?.id
        // deal with duplicated layer with same original source
        if (editingLayerId === layer.id) {
          this.startWorkFlowWhenAwait(newEditFeatures)
        }
      }
    }
    if (deletes) {
      changedType = SparkChangedType.Deleted
      const deleteFeature = event?.edits?.deleteFeatures?.[0]
      if (deleteFeature) {
        const record = dataSource.buildRecord(deleteFeature)
        dataSource.afterDeleteRecordById(record.getId())
      }
    }
    if (adds || updates || deletes) {
      this.sendSparkMsg(changedType, layerName)
    }
  }

  isLayerInfoChange = (newInfos: any[], originInfos: any[]): boolean => {
    let isChange = false
    if (newInfos?.length !== originInfos?.length) return true
    newInfos.forEach((newInfo, index) => {
      const originIndex = originInfos.findIndex(originInfo => originInfo.layer.id === newInfo.layer.id)
      if (originIndex !== index) {
        isChange = true
        return
      }
      const originInfo = originInfos[originIndex]
      if (originInfo) {
        const optionKeys = [
          'enabled',
          'addEnabled',
          'updateEnabled',
          'deleteEnabled',
          'formTemplate'
        ]
        for (const key of optionKeys) {
          if (originInfo[key] !== newInfo[key]) {
            isChange = true
            break
          }
        }
      } else {
        isChange = true
      }
    })
    return isChange
  }

  clearAllDsSelect = () => {
    const { dataSources } = this.state
    const dsKeys = Object.keys(dataSources)
    dsKeys.forEach(key => {
      dataSources[key]?.clearSelection()
    })
  }

  getDsCap = (capabilities: string, capType: string) => {
    if (capabilities) {
      return Array.isArray(capabilities)
        ? capabilities?.join().toLowerCase().includes(capType)
        : capabilities?.toLowerCase().includes(capType)
    } else {
      return false
    }
  }

  constructUneditableInfo = (layer: __esri.Layer) => {
    return {
      layer,
      enabled: false,
      addEnabled: false,
      updateEnabled: false,
      deleteEnabled: false
    }
  }

  getAllLayersIncludeSubtype = (jimuMapView: JimuMapView) => {
    const jimuMapAllLayers = jimuMapView.view?.map?.allLayers || []
    let mapAllLayers = jimuMapAllLayers
    const flattenSubGroup = (subGroupLayer) => {
      const flatSubLayers = []
      const recursionGetSublayer = (layer) => {
        if (layer.type === 'subtype-group') {
          const subLayers = layer.sublayers
          subLayers.forEach(subLayer => {
            recursionGetSublayer(subLayer)
          })
        } else if (layer.type === 'subtype-sublayer') {
          flatSubLayers.push(layer)
        }
      }
      recursionGetSublayer(subGroupLayer)
      return flatSubLayers
    }
    jimuMapAllLayers.forEach(layer => {
      if (layer.type === 'subtype-group') {
        const flattenLayers = flattenSubGroup(layer)
        mapAllLayers = mapAllLayers.concat(flattenLayers)
      }
    })
    return mapAllLayers
  }

  newOrUpdateEditor = async (modifyType: ModifyType, mapView?: JimuMapView, relatedRecordsChange?: boolean, newFullLayersConfig?: LayersConfig[]) => {
    const isNewEditor = modifyType === ModifyType.new
    const { jimuMapView: orgJimuMapView, dataSources, editFeatures, fullLayersConfig: orgFullLayersConfig } = this.state
    if (newFullLayersConfig) this.setState({ fullLayersConfig: newFullLayersConfig })
    const fullLayersConfig = newFullLayersConfig || orgFullLayersConfig
    const { id, config } = this.props
    const {
      selfSnapping, featureSnapping, defaultSelfEnabled, defaultFeatureEnabled, defaultSnapLayers, defaultTooltipEnabled,
      snapSettingMode, tooltip, templateFilter, relatedRecords, liveDataEditing, initialReshapeMode
    } = config
    const editLayerInfos = []
    let newEditor
    let jimuMapView = orgJimuMapView
    if (mapView) jimuMapView = mapView
    if (!jimuMapView) return
    let count = 0
    if (isNewEditor) {
      const { useMapWidgetIds } = this.props
      if (!useMapWidgetIds || useMapWidgetIds.length === 0) return
      if (!fullLayersConfig || fullLayersConfig.length === 0) return
      // only setting change
      if (typeof this.edit !== 'undefined' && !relatedRecordsChange && !this.isActiveViewChange) {
        if (!mapView && this.edit && !this.edit.destroyed) {
          this.newOrUpdateEditor(ModifyType.update, jimuMapView)
          return
        }
      }
      if (this.isActiveViewChange) {
        this.isActiveViewChange = false
      }
      this.destroyEdit()
      let container = null
      const existingDom = document.getElementById(`edit-container-${id}`)
      if (existingDom) {
        existingDom.remove()
      }
      container = document && document.createElement('div')
      container.id = `edit-container-${id}`
      container.className = `h-100 edit-container-${id}`
      this.editContainer.current.appendChild(container)
      const flexibleMode = snapSettingMode === SnapSettingMode.Flexible
      const snapOn = selfSnapping || featureSnapping
      const defaultSnapSources = await this.getDefaultSnapSources(jimuMapView, defaultSnapLayers)
      const snappingControlsOpen = flexibleMode && snapOn
      const settingsOpen = snappingControlsOpen || tooltip
      newEditor = (showUpdateBtn: boolean) => {
        this.edit = new Editor({
          container: container,
          view: jimuMapView.view,
          layerInfos: editLayerInfos,
          tooltipOptions: {
            enabled: defaultTooltipEnabled
          },
          snappingOptions: {
            enabled: defaultSelfEnabled || defaultFeatureEnabled,
            selfEnabled: defaultSelfEnabled,
            featureEnabled: defaultFeatureEnabled,
            featureSources: defaultSnapSources
          },
          visibleElements: {
            snappingControls: flexibleMode && snapOn,
            snappingControlsElements: {
              enabledToggle: true,
              selfEnabledToggle: selfSnapping,
              featureEnabledToggle: featureSnapping,
              gridEnabledToggle: false,
              gridControls: false,
              gridControlsElements: {}
            },
            tooltipsToggle: tooltip,
            settingsMenu: settingsOpen,
            editFeaturesSection: showUpdateBtn
          },
          supportingWidgetDefaults: {
            featureTemplates: {
              visibleElements: {
                filter: templateFilter
              }
            },
            sketch: {
              defaultUpdateOptions: {
                tool: initialReshapeMode ? 'reshape' : 'transform'
              }
            }
          }
        })
        // eslint-disable-next-line
        const that = this
        reactiveUtils.watch(() => this.edit.viewModel.state, (editState, oldEditState) => {
          // When the state is not 'ready', then the editor will have the back button, and the Dom will render after a short while after the state change,
          // thus delaying the binding to clear the back button
          if (editState !== 'ready') {
            setTimeout(() => {
              const shadowRoot = document.querySelector('calcite-flow-item:not([hidden])')?.shadowRoot
              const backButtonDom = shadowRoot?.querySelector('.back-button')
              const backEvent = () => {
                this.setState({ editFeatures: {} }, () => {
                  this.clearAllDsSelect()
                })
              }
              backButtonDom?.removeEventListener('click', backEvent)
              backButtonDom?.addEventListener('click', backEvent)
            }, 500)
          }
          const featureFormViewModel = (that.edit.viewModel as any)?.featureFormViewModel
          const feature = featureFormViewModel?.feature
          if (!feature) return
          const { dataSources, selectionStartWorkflow } = that.state
          const curLayerId = feature?.layer?.id || featureFormViewModel?.layer?.id
          const activeConfig = fullLayersConfig?.find(config => config.layerId === curLayerId)
          if (!activeConfig) return
          const dataSource = dataSources[activeConfig.id]
          // When table state is 'ready'('awaiting-feature-to-update' means being update),
          // this means that you have returned to the editor home page from editing or awaiting.
          if ((!this.editorNotBackButton && editState === 'ready')) {
            dataSource?.clearSelection()
          }
          // In the 2023.11.1 patch test, a dataSource synchronization problem was found.
          // Debug found that the API state changed from 'editing-existing-feature' to 'editing-attributes'.
          if (editState === 'editing-attributes') {
            const record = dataSource?.buildRecord(feature)
            if (selectionStartWorkflow) {
              that.setState({ selectionStartWorkflow: false })
            } else {
              this.editorSelectFeature = true
              dataSource?.selectRecordById(record.getId(), record)
            }
          }
        })
        // recheck editFeatures for some change cause by url or other pages/windows
        const newEditFeatures = Object.assign({}, editFeatures)
        for (const dsId in dataSources) {
          const curLayerInfo = editLayerInfos.find(info => dsId.includes(info.layer.id))
          const hasEditableFeature = curLayerInfo?.updateEnabled || curLayerInfo?.deleteEnabled
          if (hasEditableFeature) {
            newEditFeatures[dsId] = dataSources[dsId].getSelectedRecords()
          }
        }
        if (!lodash.isDeepEqual(editFeatures, newEditFeatures)) {
          this.setState({ editFeatures: newEditFeatures, selectionStartWorkflow: true }, () => {
            if (!jimuMapView) return
            this.startWorkFlowWhenAwait(newEditFeatures)
          })
        }
      }
    }
    // Due to the special mechanism of the interface, all unConfigured layers are enabled by default.
    // Therefore, now set the default permissions of layer not configured to false.
    const mapAllLayers = this.getAllLayersIncludeSubtype(jimuMapView)
    // When 'add to map' in runtime the first time, the addToMap layer will not in mapAllLayers
    const mapViewLayers = jimuMapView.view?.map?.layers || []
    const addToMapLayers = mapViewLayers.filter(layer => layer?.id.includes(ADD_TO_MAP_DATA_ID_PREFIX))
    addToMapLayers.forEach(addedLayer => {
      const alreadyHas = mapAllLayers.find(l => l.id === addedLayer.id)
      if (!alreadyHas) {
        mapAllLayers.push(addedLayer)
      }
    })
    const allLayers = mapAllLayers.filter(item => {
      const layerInfo = item as any
      return supportLayerTypes.includes(layerInfo.type)
    })
    // Draw widget measurement layers and track layers
    const uneditableLayers: __esri.Layer[] = []
    mapAllLayers.forEach(layer => {
      if (layer?.id.includes('jimu-draw-measurements-layer') || (layer as any)?._exb_not_editable) {
        uneditableLayers.push(layer)
      }
    })
    if (uneditableLayers.length > 0) {
      uneditableLayers.forEach(uneditableLayer => {
        editLayerInfos.push(this.constructUneditableInfo(uneditableLayer))
      })
    }
    // configured layer setting need to follow the order of setting
    const configLayerInfos = []
    // if one or more layers have update or delete privilege, we need show 'select' btn in api
    let showUpdateBtn = false
    allLayers.forEach(async layer => {
      const activeConfigLayer = fullLayersConfig?.find(config => config.layerId === layer.id)
      // new Editor must use layer on map
      const editorUseLayer = layer
      // If editorUseLayer is undefined, indicates that map is invisible(switch mapGroup)
      // It does not have to be added to editLayerInfos
      if (editorUseLayer) {
        // It has been configured in setting
        const isAddToMap = editorUseLayer.id?.includes(ADD_TO_MAP_DATA_ID_PREFIX) || (editorUseLayer.parent as any)?.id?.includes(ADD_TO_MAP_DATA_ID_PREFIX)
        const isShowOnmMap = editorUseLayer.id?.includes(SHOW_ON_MAP_DATA_ID_PREFIX)
        const haveUrl = (editorUseLayer as any)?.url // feature collection
        if (activeConfigLayer && !isAddToMap && !isShowOnmMap && haveUrl) {
          const { groupedFields, addRecords, deleteRecords, updateRecords, updateAttributes, updateGeometries, layerHonorMode, id } = activeConfigLayer
          const isHonorWebmap = layerHonorMode === LayerHonorModeType.Webmap
          // fetch to confirm whether it's a public source
          const accessible = await this.getDsAccessibleInfo((layer as any)?.url)
          // use exb privilege instead of api's supportsUpdateByOthers
          const privilegeEditable = await this.getPrivilege()
          // New logic of API: The user with advanced permissions can modify the configuration regardless of the configuration
          const isAdvancedPermission = await this.getIsAdvancedPermission(editorUseLayer)
          const haveUpdatePrivilege = updateRecords || deleteRecords
          if (isAdvancedPermission || haveUpdatePrivilege) {
            showUpdateBtn = true
          }
          // full editing privileges
          const fullEditingPrivileges = (editorUseLayer as any)?.userHasFullEditingPrivileges
          const layerEditingEnabled = (editorUseLayer as any)?.editingEnabled ?? true
          // exb access and privilege
          const editable = accessible || privilegeEditable
          // construct formTemplate
          const originalFormTemplate = (editorUseLayer as any)?.formTemplate ?? {}
          const haveTemplateElements = originalFormTemplate.elements?.length > 0
          const { expressionInfos: originalExpressionInfos, title: originalTitle } = originalFormTemplate
          const dataSource = this.state.dataSources[activeConfigLayer.id]
          // use popupTemplate editable
          const popupTemplateFieldInfos = (editorUseLayer as any)?.popupTemplate?.fieldInfos || []
          // use schemaFields to filter used fields, some field is special and invisible in schema
          const allFieldsSchema = dataSource?.getSchema()
          const schemaFieldsKeys = allFieldsSchema?.fields ? Object.keys(allFieldsSchema.fields) : []
          const layerDefinition = (dataSource as FeatureLayerDataSource)?.getLayerDefinition()
          const fieldsConfig = layerDefinition?.fields || []
          const allFields = allFieldsSchema?.fields ? Object.values(allFieldsSchema?.fields) : []
          const useFields = layerDefinition?.fields?.length > 0 ? layerDefinition.fields : allFields
          const filteredUseFields = (useFields as any[]).filter(item => schemaFieldsKeys.includes(item.jimuName || item.name))
          let originalRelationshipElement = this.relationships[editorUseLayer.id]
          if (!originalRelationshipElement) {
            const oriRelationElements = originalFormTemplate?.elements?.filter(element => element.type === 'relationship')
            const oriRelations = []
            oriRelationElements?.forEach(element => {
              oriRelations.push(element?.clone())
            })
            this.relationships[editorUseLayer.id] = oriRelations
            originalRelationshipElement = oriRelations
          }
          let usedFormTemplate = {}
          // honor webmap
          if (isHonorWebmap) {
            const objectIdField = dataSource?.getIdField() || 'OBJECTID'
            const usedFields = this.getUsedFields(fieldsConfig, filteredUseFields, objectIdField, popupTemplateFieldInfos)
            if (haveTemplateElements) {
              // honor, allow relatedRecords
              if (relatedRecords) {
                if (originalRelationshipElement?.length > 0) {
                  const newFormTemplate = originalFormTemplate.clone()
                  // replace old relationship elements
                  newFormTemplate.elements.map(element => {
                    let newElement = element
                    if (element.type === 'relationship') {
                      const origElement = originalRelationshipElement.find(item => (item.label === element.label && item.relationshipId === element.relationshipId))
                      if (origElement) newElement = origElement
                    }
                    return newElement
                  })
                  usedFormTemplate = newFormTemplate
                } else {
                  const newFormTemplate = originalFormTemplate.clone()
                  usedFormTemplate = newFormTemplate
                }
              // honor, not allow relatedRecords
              } else {
                if (originalRelationshipElement?.length > 0) {
                  const newFormTemplate = originalFormTemplate.clone()
                  // find and close all relationship
                  for (const element of newFormTemplate.elements) {
                    if (element.type === 'relationship') {
                      element.editableExpression = 'false'
                    }
                  }
                  usedFormTemplate = newFormTemplate
                } else {
                  const newFormTemplate = originalFormTemplate.clone()
                  usedFormTemplate = newFormTemplate
                }
              }
            } else {
              usedFormTemplate = new FormTemplate({
                elements: this.constructFieldConfig(usedFields, relatedRecords, []),
                expressionInfos: originalExpressionInfos,
                title: originalTitle || editorUseLayer?.title
              })
            }
          // customize
          } else {
            usedFormTemplate = new FormTemplate({
              elements: this.constructFieldConfig(groupedFields, relatedRecords, originalRelationshipElement),
              expressionInfos: originalExpressionInfos,
              title: originalTitle || editorUseLayer?.title
            })
          }
          if (isAdvancedPermission || (fullEditingPrivileges && layerEditingEnabled)) {
            configLayerInfos.push({
              layer: editorUseLayer,
              ...(usedFormTemplate ? { formTemplate: usedFormTemplate } : {}),
              enabled: true,
              addEnabled: true,
              updateEnabled: true,
              deleteEnabled: true,
              attributeUpdatesEnabled: true,
              geometryUpdatesEnabled: true
            })
          } else if (fullEditingPrivileges && !layerEditingEnabled) {
            configLayerInfos.push(this.constructUneditableInfo(editorUseLayer))
          } else {
            configLayerInfos.push({
              layer: editorUseLayer,
              ...(usedFormTemplate ? { formTemplate: usedFormTemplate } : {}),
              enabled: editable && (addRecords || updateRecords || deleteRecords),
              addEnabled: addRecords,
              updateEnabled: updateRecords,
              deleteEnabled: deleteRecords,
              attributeUpdatesEnabled: updateAttributes,
              geometryUpdatesEnabled: updateGeometries
            })
          }
          // update dataSource after edit
          const watchEditLayer = editorUseLayer as any
          // subtype sublayer have no 'on' method, need to use on in it's parent subtype-group layer
          if (watchEditLayer.on) {
            if (isNewEditor || !watchEditLayer.hasEventListener('edits')) {
              watchEditLayer.on('edits', event => {
                this.editorLayerWatcher(event, id, watchEditLayer, watchEditLayer.title)
              })
            }
          } else {
            const usedWatchLayer = watchEditLayer.parent
            if (isNewEditor || !usedWatchLayer.hasEventListener('edits')) {
              usedWatchLayer.on('edits', event => {
                this.editorLayerWatcher(event, id, watchEditLayer, watchEditLayer.title)
              })
            }
          }
        // runtime added layer
        } else if (liveDataEditing && isAddToMap) {
          await jimuMapView.whenJimuMapViewLoaded()
          await jimuMapView.whenAllJimuLayerViewLoaded()
          const addedLayerDs = jimuMapView.jimuLayerViews[`${jimuMapView.id}-${editorUseLayer.id}`]?.getLayerDataSource()
          const featureLayerDs = addedLayerDs as FeatureLayerDataSource
          // file upload ds: only have layer, but not itemId and url
          if (!addedLayerDs || (!featureLayerDs.itemId && !featureLayerDs.url)) {
            editLayerInfos.push(this.constructUneditableInfo(editorUseLayer))
            count++
            return
          }
          const isAdvancedPermission = await this.getIsAdvancedPermission(editorUseLayer, addedLayerDs)
          const fullEditingPrivileges = (editorUseLayer as any)?.userHasFullEditingPrivileges
          const layerEditingEnabled = (editorUseLayer as any)?.editingEnabled ?? true
          const accessible = await this.getDsAccessibleInfo((layer as any)?.url)
          const privilegeEditable = await this.getPrivilege()
          const editable = accessible || privilegeEditable
          const layerDefinition = (editorUseLayer as any)?.sourceJSON
          const allowGeometryUpdates = layerDefinition?.allowGeometryUpdates
          const capabilities = layerDefinition?.capabilities
          const create = this.getDsCap(capabilities, 'create')
          const update = this.getDsCap(capabilities, 'update')
          const deletable = this.getDsCap(capabilities, 'delete')
          if (isAdvancedPermission || (fullEditingPrivileges && layerEditingEnabled)) {
            showUpdateBtn = true
            editLayerInfos.push({
              layer: editorUseLayer,
              enabled: true,
              addEnabled: true,
              updateEnabled: true,
              deleteEnabled: true,
              attributeUpdatesEnabled: true,
              geometryUpdatesEnabled: true
            })
          } else if (fullEditingPrivileges && !layerEditingEnabled) {
            editLayerInfos.push(this.constructUneditableInfo(editorUseLayer))
          } else {
            if (editable && (update || deletable)) {
              showUpdateBtn = true
            }
            editLayerInfos.push({
              layer: editorUseLayer,
              enabled: editable && (create || update || deletable),
              addEnabled: create,
              updateEnabled: update,
              deleteEnabled: deletable,
              attributeUpdatesEnabled: update,
              geometryUpdatesEnabled: allowGeometryUpdates && update
            })
          }
        } else {
          editLayerInfos.push(this.constructUneditableInfo(editorUseLayer))
        }
      }
      count++
      if (count === allLayers.length) {
        // Sort the config layer at the end of the loop
        // use customJimuLayerViewIds order if customize
        const { config } = this.props
        const { mapViewsConfig } = config
        const viewConfig = mapViewsConfig?.[jimuMapView.id]
        const customizeLayers = viewConfig?.customizeLayers
        const customJimuLayerViewIds = viewConfig?.customJimuLayerViewIds
        if (customizeLayers) {
          configLayerInfos.sort((a, b) => {
            const aIndex = customJimuLayerViewIds?.findIndex(viewId => viewId.includes(a.layer.id))
            const bIndex = customJimuLayerViewIds?.findIndex(viewId => viewId.includes(b.layer.id))
            return aIndex - bIndex
          })
        } else {
          const jimuLayerViews = jimuMapView.jimuLayerViews
          const sortedJimuLayerViews = sortJimuLayerViews(Object.values(jimuLayerViews))
          configLayerInfos.sort((a, b) => {
            const aIndex = sortedJimuLayerViews?.findIndex(view => view.id.includes(a.layer.id))
            const bIndex = sortedJimuLayerViews?.findIndex(view => view.id.includes(b.layer.id))
            return aIndex - bIndex
          })
        }
        editLayerInfos.unshift(...configLayerInfos)
        if (isNewEditor) {
          newEditor(showUpdateBtn)
        } else {
          const editor = this.edit as Editor
          const isLayerInfoChange = this.isLayerInfoChange(editLayerInfos, editor.layerInfos)
          if (isLayerInfoChange) editor.layerInfos = editLayerInfos
          editor.visibleElements.editFeaturesSection = showUpdateBtn
        }
      }
    })
  }

  getUsedFields = (fieldsConfig, filteredUseFields, objectIdField: string, popupTemplateFieldInfos) => {
    const usedFields = []
    filteredUseFields.forEach(item => {
      const orgField = fieldsConfig.find(field => field.name === item.name)
      const defaultAuthority = orgField?.editable
      const defaultInvisible = [
        objectIdField,
        'CreationDate',
        'Creator',
        'EditDate',
        'Editor',
        'GlobalID'
      ]
      if (!defaultInvisible.includes(item.name)) {
        const usePopupField = popupTemplateFieldInfos.find(ele => ele.fieldName === item.name)
        const editable = usePopupField ? usePopupField?.isEditable : defaultAuthority
        usedFields.push({
          name: item.name,
          jimuName: item.name,
          alias: item.alias,
          editable: editable,
          editAuthority: editable
        })
      }
    })
    return usedFields
  }

  getDefaultSnapSources = async (jimuMapView: JimuMapView, defaultSnapLayers) => {
    if (!jimuMapView) return []
    await jimuMapView.whenAllJimuLayerViewLoaded()
    if (!jimuMapView?.jimuLayerViews) return []
    const allViewLayerKeys = Object.keys(jimuMapView.jimuLayerViews)
    const snapLayersSources = allViewLayerKeys.filter(layerViewId => {
      return defaultSnapLayers?.includes(jimuMapView.jimuLayerViews[layerViewId].layerDataSourceId)
    }).map(lvId => {
      return {
        layer: jimuMapView.jimuLayerViews[lvId].layer,
        enabled: true
      }
    })
    return snapLayersSources
  }

  getImageryLayer = (dataSource): Promise<any> => {
    const ds = dataSource as ImageryLayerDataSource
    let imageLayer
    const curQuery: any = ds.getCurrentQueryParams()
    if (ds.itemId) {
      const layerId = parseInt(ds.layerId)
      const layerConfig = {
        portalItem: {
          id: ds.itemId,
          portal: {
            url: ds.portalUrl
          }
        },
        definitionExpression: curQuery.where,
        layerId: layerId || undefined
      }
      if (ds.url) (layerConfig as any).url = ds.url
      imageLayer = new OrientedImageryLayer(layerConfig)
    } else if (ds.url) {
      imageLayer = new OrientedImageryLayer({
        definitionExpression: curQuery.where,
        url: ds.url
      })
    } else if (ds.layer) {
      return ds?.createJSAPILayerByDataSource().then(layer => {
        return layer
      })
    }
    return Promise.resolve(imageLayer)
  }

  getSubtypeSublayer = (dataSource): Promise<any> => {
    const subLayerDs = dataSource as SubtypeSublayerDataSource
    return subLayerDs?.createJSAPILayerByDataSource().then(layer => {
      return layer
    })
  }

  getFeatureLayer = (dataSource: QueriableDataSource) => {
    if (dataSource.type === AllDataSourceTypes.OrientedImageryLayer) {
      return this.getImageryLayer(dataSource)
    } else if (dataSource.type === AllDataSourceTypes.SubtypeSublayer) {
      return this.getSubtypeSublayer(dataSource)
    }
    const { id } = this.props
    const ds = dataSource as FeatureLayerDataSource
    const notToLoad = dataSource?.getDataSourceJson()?.isDataInDataSourceInstance
    let featureLayer
    const curQuery: any = dataSource && dataSource.getCurrentQueryParams()
    if (notToLoad) {
      // chart output and selected features need load
      return ds.load({ returnGeometry: true }, { widgetId: id }).then(async (records) => {
        const dataRecords = await Promise.resolve(records) as FeatureDataRecord[]
        return dataSourceUtils.createJSAPIFeatureLayerByRecords(ds, dataRecords)
      }).catch(err => {
        console.error(err)
      })
    }
    // Adjust the order, because ds.layer is a reference type that changes the original data
    // csv upload type ds: only have layer, but not itemId and url
    if (!FeatureLayer) return Promise.resolve(featureLayer)
    if (ds?.itemId) {
      const layerId = parseInt(ds.layerId)
      const layerConfig = {
        portalItem: {
          id: ds.itemId,
          portal: {
            url: ds.portalUrl
          }
        },
        definitionExpression: curQuery.where,
        layerId: layerId || undefined
      }
      if (ds.url) (layerConfig as any).url = ds.url
      featureLayer = new FeatureLayer(layerConfig)
    } else if (ds.url) {
      featureLayer = new FeatureLayer({
        definitionExpression: curQuery.where,
        url: ds.url
      })
    } else if (ds.layer) {
      return ds.load({ returnGeometry: true }, { widgetId: id }).then(async (records) => {
        const dataRecords = await Promise.resolve(records) as FeatureDataRecord[]
        return dataSourceUtils.createJSAPIFeatureLayerByRecords(ds, dataRecords)
      }).catch(err => {
        console.error(err)
      })
    } else {
      return Promise.resolve(featureLayer)
    }
    return Promise.resolve(featureLayer)
  }

  getCurrentEditLayer = (layerId: string) => {
    if (!layerId) return undefined
    const { activeId, jimuMapView, fullLayersConfig } = this.state
    const mapLayers = this.getAllLayersIncludeSubtype(jimuMapView)
    const activeConfig = fullLayersConfig?.find(item => item.id === activeId)
    const { id: configDsId } = activeConfig
    let currentEditLayer = mapLayers.find(layer => {
      return layer.type === LayerTypes.SceneLayer
        ? configDsId.includes(layer.id)
        : layer.id === layerId
    })
    if (!currentEditLayer) {
      mapLayers.forEach(layer => {
        const subLayers = (layer as any)?.layers
        if (subLayers && (configDsId?.includes(layer.id) || configDsId?.includes(layerId))) {
          currentEditLayer = subLayers.find(layer => (layer.layerId?.toString() === layerId || layer.id === layerId))
        }
      })
    }
    return currentEditLayer
  }

  startWorkFlowWhenAwait = async (editFeatures?, useDataSourceId?: string) => {
    const { activeId, dataSources, editFeatures: orgEditFeatures, jimuMapView } = this.state
    const edit = this.edit as __esri.Editor
    // The number of selected(the layers from the same map)
    const newEditFeatures = editFeatures || orgEditFeatures
    const mapEditCount = this.flatMapArrayWithView(newEditFeatures, jimuMapView).length
    if (mapEditCount === 1) {
      const dsId = useDataSourceId || activeId
      const objectIdField = this.getLayerObjectIdField(dataSources[dsId])
      const activeGraphic = (newEditFeatures?.[dsId]?.[0] as FeatureDataRecord)?.feature as __esri.Graphic
      const currentEditLayer = this.getCurrentEditLayer(activeGraphic?.layer?.id) as __esri.FeatureLayer
      // currentEditLayer is not in active map
      if (!currentEditLayer) return
      const query = new Query({
        where: `${objectIdField} = ${activeGraphic.attributes[objectIdField]}`,
        outFields: ['*'],
        returnGeometry: true
      })
      currentEditLayer.queryFeatures(query).then(results => {
        const activeFeature = results?.features[0]
        edit?.startUpdateWorkflowAtFeatureEdit(activeFeature)
      }).catch(err => {
        console.error(err)
      })
    } else if (mapEditCount > 1) {
      const loopAddGraphics = async () => {
        let graphics = []
        const promises = []
        for (const dsId in newEditFeatures) {
          const objectIdField = this.getLayerObjectIdField(dataSources[dsId])
          const layerFeaturesArray = newEditFeatures?.[dsId]
          if (layerFeaturesArray?.length > 0) {
            const selectedQuery = `${objectIdField} IN (${newEditFeatures[dsId]
              .map(record => {
                const activeGraphic = (record as FeatureDataRecord)?.feature as __esri.Graphic
                return activeGraphic.attributes[objectIdField]
              })
              .join()})`
            const currentGraphic = (layerFeaturesArray[0] as FeatureDataRecord)?.feature as __esri.Graphic
            const currentEditLayer = this.getCurrentEditLayer(currentGraphic?.layer?.id) as __esri.FeatureLayer
            if (!currentEditLayer) return
            const query = new Query({
              where: selectedQuery,
              outFields: ['*'],
              returnGeometry: true
            })
            promises.push(currentEditLayer.queryFeatures(query))
          }
        }
        const results = await Promise.all(promises)
        Object.keys(newEditFeatures).forEach((dsId, index) => {
          graphics = graphics.concat(results[index]?.features || [])
        })
        return graphics
      }
      const graphics = await loopAddGraphics()
      edit?.startUpdateWorkflowAtMultipleFeatureSelection(graphics)
    } else {
      if (edit?.activeWorkflow) edit?.cancelWorkflow()
    }
  }

  idsArrayEquals = (newDataSourceId: string, newSelectedIds: string[]) => {
    if (!newSelectedIds) return false
    if (this.selectedIds[newDataSourceId]?.length !== newSelectedIds.length) return false
    let equal = true
    this.selectedIds[newDataSourceId]?.forEach((id, index) => {
      if (id !== newSelectedIds[index]) equal = false
    })
    return equal
  }

  dsSelectionChangeExec = (dataSourceId: string, selectedIds: string[]) => {
    const newRequestId = this.currentRequestId + 1
    this.currentRequestId++
    this.selectedIds[dataSourceId] = selectedIds
    const { activeId, dataSources, editFeatures, jimuMapView, fullLayersConfig } = this.state
    const { id, config, widgetsRuntimeInfo } = this.props
    const { editMode } = config
    const isGeoMode = editMode === EditModeType.Geometry
    if (!isGeoMode) {
      this.setState({ formChange: false })
    }
    let useDataSourceId = dataSourceId
    const newEditFeatures = Object.assign({}, editFeatures)
    if (!dataSources[useDataSourceId]) {
      const currentDs = this.dsManager.getDataSource(useDataSourceId)
      if (currentDs) {
        dataSources[useDataSourceId] = currentDs
      }
    }
    const selectedRecords = dataSources[useDataSourceId]?.getSelectedRecords()
    // check if the selected feature is editable, if not, don't add it to 'newEditFeatures'
    if (isGeoMode) {
      const editor = this.edit as Editor
      // url param: If selection change occurs before editor render,
      // record this data and modify the editFeatures after editor render.
      if (!editor && !this.changeBeforeRender) {
        this.changeBeforeRender = { dataSourceId, selectedRecords }
        let time = 0
        this.loadChangeAfterRenderTimer = setInterval(() => {
          time++
          if (this.edit) {
            const { dataSourceId, selectedRecords } = this.changeBeforeRender
            this.onDataSourceSelectedChange(dataSourceId, selectedRecords)
            this.changeBeforeRender = undefined
            clearInterval(this.loadChangeAfterRenderTimer)
          } else if (time === 5 && !this.edit) {
            this.changeBeforeRender = undefined
            clearInterval(this.loadChangeAfterRenderTimer)
          }
        }, 1000)
        return
      }
      const curLayerInfo = editor?.layerInfos.find(info => useDataSourceId.includes(info.layer.id))
      const hasEditableFeature = curLayerInfo?.updateEnabled || curLayerInfo?.deleteEnabled
      if (hasEditableFeature) {
        newEditFeatures[useDataSourceId] = selectedRecords
      }
    } else {
      newEditFeatures[useDataSourceId] = selectedRecords
    }
    const inConfigEditFeatures = this.getInLayersConfigFeatures(newEditFeatures, fullLayersConfig)
    const flatEditFeatures = this.flatMapArray(inConfigEditFeatures)
    const editCount = flatEditFeatures.length
    this.setState({ editFeatures: newEditFeatures })
    if (isGeoMode && editCount === 0) {
      const editor = this.edit as Editor
      if (editor?.activeWorkflow) editor?.cancelWorkflow()
    }
    // To avoid causing ds to trigger the processing done by edit workflow again after editor select synchronizes ds
    if (this.editorSelectFeature) {
      this.setState({ activeId: dataSourceId })
      this.editorSelectFeature = false
      return
    }
    // If the last one of ds has been deselect, and there still other ds has selected record
    // dataSourceId need change to other's (Only for Attribute Type)
    if (selectedRecords?.length === 0 && editCount === 1) {
      let newDsId
      for (const dsId in newEditFeatures) {
        if (newEditFeatures?.[dsId]?.length === 1) {
          newDsId = dsId
        }
      }
      useDataSourceId = newDsId
    }
    if (isGeoMode && selectedRecords?.length === 0) {
      const editor = this.edit as Editor
      if (editor?.activeWorkflow) editor?.cancelWorkflow()
    }
    const dsChange = activeId !== dataSourceId
    // FeatureForm
    if (!isGeoMode) {
      this.setState({ activeId: useDataSourceId }, () => {
        this.createEditForm(useDataSourceId, dsChange, newRequestId)
      })
    }
    // Editor
    if (isGeoMode && selectedIds && selectedIds.length !== 0) {
      this.setState({ activeId: dataSourceId })
    }
    if (isGeoMode && editCount !== 0) {
      if (!jimuMapView) return
      // When controller is close, don't start workflow
      const currentWidgetState = widgetsRuntimeInfo[id].state
      if (currentWidgetState === WidgetState.Closed) return
      this.setState({ selectionStartWorkflow: true }, () => {
        this.startWorkFlowWhenAwait(newEditFeatures, useDataSourceId)
      })
    }
  }

  onDataSourceSelectedChange = async (dataSourceId: string, selectedIds: string[]) => {
    // 'ds A selected 1' change to 'ds B selected 1'
    // will start onDataSourceSelectedChange twice, 'ds A selected 1 -> null' and 'ds B selected null -> 1'
    if (this.remainDsId && this.remainDsId === dataSourceId) {
      this.remainDsId = ''
      return
    }
    if (this.idsArrayEquals(dataSourceId, selectedIds)) return
    // 241111 Temporarily hidden this function, needs to be further improved.
    // const { config } = this.props
    // const { editMode } = config
    // const isGeoMode = editMode === EditModeType.Geometry
    // selection change when Editor editing
    // const viewModel = this.edit?.viewModel as any
    // if (isGeoMode && viewModel?.state === 'editing-attributes' && viewModel?.hasPendingEdits) {
    //   const editor = this.edit as Editor
    //   const editingLayer = (editor.activeWorkflow.data as any)?.rootFeature?.layer
    //   const editingLayerId = editingLayer?.id
    //   const editingDataSourceId = (editor.view as any).dataSourceInfo?.dataSourceId
    //   const editingLayerDsId = `${editingDataSourceId}-${editingLayerId}`
    //   // selection change contain current
    //   const currentLayerChanged = editingLayer.type === 'subtype-sublayer'
    //     ? dataSourceId.includes(editingLayerId)
    //     : dataSourceId === editingLayerDsId
    //   if (currentLayerChanged) {
    //     this.toBeChangedSelection = { dataSourceId, selectedIds }
    //     return
    //   }
    // }
    // selection change when FeatureForm editing
    // const { featureFormStep, formChange } = this.state
    // if (!isGeoMode && featureFormStep === 'form' && formChange) {
    //   const editForm = this.edit as __esri.FeatureForm
    //   const editingLayerId = editForm?.feature?.layer?.id
    //   if (dataSourceId.includes(editingLayerId)) {
    //     this.toBeChangedSelection = { dataSourceId, selectedIds }
    //     this.setState({ selectionChangeConfirm: true })
    //     return
    //   }
    // }
    this.dsSelectionChangeExec(dataSourceId, selectedIds)
  }

  onIsDataSourceNotReady = (dataSourceId: string, dataSourceStatus: DataSourceStatus) => {
    this.setState((state: State) => {
      const isOutPutDs = state.dataSources[dataSourceId]?.getDataSourceJson().isOutputFromWidget
      if (!isOutPutDs) {
        return
      }
      const outputDataSource = Object.assign({}, state.outputDataSourceIsNotReady)
      outputDataSource[dataSourceId] = dataSourceStatus === DataSourceStatus.NotReady
      return { outputDataSourceIsNotReady: outputDataSource }
    })
  }

  onCreateDataSourceCreatedOrFailed = (dataSourceId: string, dataSource: DataSource) => {
    this.setState((state: State) => {
      const newDataSources = Object.assign({}, state.dataSources)
      newDataSources[dataSourceId] = dataSource
      return { dataSources: newDataSources }
    })
  }

  onDataSourceVersionChange = (dataSourceId: string) => {
    const { config } = this.props
    const { editMode } = config
    // FeatureForm
    if (editMode === EditModeType.Attribute) {
      this.setState({ activeId: dataSourceId, formChange: false }, () => {
        this.createEditForm(dataSourceId, true)
      })
    }
  }

  onLayerChange = (evt) => {
    const { dataSources } = this.state
    const selectedLayerId = evt?.target?.value
    this.setState({ activeId: selectedLayerId }, () => {
      this.renderFeatureForm(dataSources[selectedLayerId] as QueriableDataSource)
    })
  }

  handleBack = (): void => {
    const { id, config } = this.props
    const { layersConfig } = config
    const { editFeatures } = this.state
    const inConfigEditFeatures = this.getInLayersConfigFeatures(editFeatures, layersConfig)
    const flatEditFeatures = this.flatMapArray(inConfigEditFeatures)
    const editCount = flatEditFeatures.length
    if (editCount <= 1) {
      this.setState({ featureFormStep: 'empty' })
    } else if (editCount > 1) {
      this.setState({ featureFormStep: 'list' })
    }
    document.getElementById(`edit-container-${id}`).classList.add('esri-hidden')
  }

  getInLayersConfigFeatures = (editFeatures, layersConfig) => {
    const newEditFeatures = Object.assign({}, editFeatures)
    const editFeaturesKeys = Object.keys(editFeatures)
    editFeaturesKeys.forEach(dsId => {
      const isInLayersConfig = layersConfig?.some(config => dsId.includes(config.id))
      if (!isInLayersConfig) {
        delete newEditFeatures[dsId]
      }
    })
    return newEditFeatures
  }

  handleChangeModeOk = () => {
    this.setState({ selectionChangeConfirm: false })
    // continue ds change
    const { dataSourceId, selectedIds } = this.toBeChangedSelection
    this.dsSelectionChangeExec(dataSourceId, selectedIds)
  }

  handleChangeModeClose = () => {
    const { dataSources } = this.state
    this.setState({ selectionChangeConfirm: false })
    // remain current ds selection
    const { dataSourceId } = this.toBeChangedSelection
    if (dataSourceId) {
      const currentDs = dataSources[dataSourceId] || this.dsManager.getDataSource(dataSourceId)
      currentDs.selectRecordsByIds(this.selectedIds[dataSourceId])
      this.remainDsId = dataSourceId
    }
  }

  render () {
    const {
      activeId, editFeatures, featureFormStep, formPrivileges, formEditable, delConfirm, attrUpdating, formChange,
      formSubmittable, loading, fullLayersConfig, mapUseDataSources
    } = this.state
    const { id, theme, config, useDataSources, useMapWidgetIds } = this.props
    const { editMode, description, layersConfig } = config
    const isAttrMode = editMode === EditModeType.Attribute
    const useFullLayersConfig = isAttrMode ? layersConfig : fullLayersConfig
    const activeConfig = useFullLayersConfig?.find(item => item.id === activeId)
    const updateRecords = activeConfig?.updateRecords ?? false
    const deleteRecords = activeConfig?.deleteRecords ?? false
    const inConfigEditFeatures = this.getInLayersConfigFeatures(editFeatures, useFullLayersConfig)
    const flatEditFeatures = this.flatMapArray(inConfigEditFeatures)
    const editCount = flatEditFeatures.length
    // The add button is displayed if any of them are allowed to be added
    const hasTableLayer = layersConfig.some(config => config?.isTable)
    const addable = layersConfig.some(config => config?.addRecords)
    const formPrivilegesIsFull = formPrivileges === 'full'
    const formPrivilegesIsNormal = formPrivileges === 'normal'
    const controls: ControlButton[] = []
    if (formPrivilegesIsFull || (formPrivilegesIsNormal && updateRecords)) {
      controls.push({
        label: this.formatMessage('update'),
        type: 'primary',
        disabled: !(formChange && formSubmittable),
        clickHandler: this.handleSave
      })
    }
    if (formPrivilegesIsFull || (formPrivilegesIsNormal && deleteRecords)) {
      controls.push({
        label: this.formatMessage('delete'),
        type: 'default',
        clickHandler: this.handleDeleteConfirm
      })
    }
    const addControls: ControlButton[] = []
    const hasTableLayerAdd = (formPrivilegesIsFull && hasTableLayer) || (formPrivilegesIsNormal && addable)
    if (hasTableLayerAdd) {
      addControls.push({
        label: this.formatMessage('add'),
        type: 'primary',
        disabled: false,
        clickHandler: this.handleAdd
      })
    }
    const hasSurface = (isAttrMode && (featureFormStep === 'form' || featureFormStep === 'new')) || (!isAttrMode && useFullLayersConfig && useFullLayersConfig?.length !== 0)
    const hasEdit = (isAttrMode && featureFormStep !== 'list' && featureFormStep !== 'empty') || (!isAttrMode && useFullLayersConfig && useFullLayersConfig?.length !== 0)
    const hasFormHeader = isAttrMode && featureFormStep !== 'list' && featureFormStep !== 'empty'
    let featureFormLayer
    if (formPrivilegesIsFull) {
      featureFormLayer = layersConfig.filter(item => item.isTable)
    } else if (formPrivilegesIsNormal) {
      featureFormLayer = layersConfig.filter(item => item.addRecords)
    }

    if (!isAttrMode && (!useMapWidgetIds || useMapWidgetIds.length === 0)) {
      return (
        <WidgetPlaceholder
          widgetId={id}
          autoFlip
          iconSize='large'
          style={{ position: 'absolute', left: 0, top: 0 }}
          icon={editPlaceholderIcon}
          data-testid='editPlaceholder'
        />
      )
    }

    return (
      <div className={classNames(`jimu-widget widget-edit esri-widget edit-widget-${id}`)} css={getStyle(theme, id, featureFormStep, editCount, isAttrMode)}>
        {isAttrMode && attrUpdating &&
          <div className={CSS.progressBar} />
        }
        <div className={classNames('edit-con', { 'surface-1 border-0': hasSurface, 'h-100': hasEdit })}>
          <div className={classNames({ 'form-header-container': hasFormHeader })} ref={this.formHeaderContainer}/>
          <div className={classNames({ 'h-100': !isAttrMode, 'attr-height': isAttrMode && hasEdit })} ref={this.editContainer}>
            {isAttrMode && featureFormStep === 'new' &&
              <div className='layer-selector'>
                <label className='esri-feature-form__label'>
                  {this.formatMessage('selectLayer')}
                </label>
                <Select
                  value={activeId}
                  onChange={this.onLayerChange}
                >
                  {featureFormLayer.map(config => {
                    return (
                      <option key={config.id} value={config.id}>
                        {config.name}
                      </option>
                    )
                  })}
                </Select>
              </div>
            }
          </div>
          {isAttrMode && editCount > 0 && featureFormStep === 'form' && formEditable && controls?.length > 0 &&
            this.renderControlButtons(controls)
          }
          {isAttrMode && featureFormStep === 'new' &&
            this.renderControlButtons(addControls)
          }
        </div>
        {!isAttrMode &&
          <JimuMapViewComponent
            useMapWidgetId={useMapWidgetIds?.[0]}
            onActiveViewChange={this.handleActiveViewChange}
          />
        }
        {isAttrMode && editCount > 1 && featureFormStep === 'list' &&
          this.renderFeatureList(inConfigEditFeatures, description)
        }
        {loading && <Loading />}
        {isAttrMode && (featureFormStep === 'empty' || layersConfig.length === 0) &&
          this.renderFormEmpty(description)
        }
        {!isAttrMode && (!useFullLayersConfig || useFullLayersConfig?.length === 0) &&
          this.renderFormEmpty()
        }
        {isAttrMode && delConfirm &&
          <React.Fragment>
            <div className='confirm-scrim'/>
            <div className={CSS.promptDanger}>
              <div className={CSS.promptHeader}>
                <WarningOutlined />
                <h4 className={classNames(CSS.widgetHeading, CSS.promptHeaderHeading)}>{this.formatMessage('deleteRecord')}</h4>
              </div>
              <div className={CSS.promptMessage}>{this.formatMessage('deleteRecordTips')}</div>
              <div className={CSS.promptDivider}></div>
              <div className={CSS.promptActions}>
                <Button
                  className={classNames(CSS.warningOption, CSS.warningOptionPrimary)}
                  onClick={this.cancelDelete}
                >
                  {this.formatMessage('keepRecord')}
                </Button>
                <Button
                  className={classNames(CSS.warningOption, CSS.warningOptionPositive)}
                  onClick={this.handleDelete}
                >
                  {this.formatMessage('delete')}
                </Button>
              </div>
            </div>
          </React.Fragment>
        }
        {isAttrMode && hasTableLayerAdd && featureFormStep !== 'form' && featureFormStep !== 'new' &&
          <Button
            size='sm'
            icon
            type='tertiary'
            className='add-feature-btn'
            onClick={this.handleNew}
            title={this.formatMessage('addFeature')}
            aria-label={this.formatMessage('addFeature')}
          >
            <PlusOutlined className='mr-1'/>
            {this.formatMessage('add')}
          </Button>
        }
        {
          // <ConfirmDialog
          //   level='warning'
          //   title={this.formatMessage('selectionChangeConfirmTitle')}
          //   hasNotShowAgainOption={false}
          //   content={this.formatMessage('selectionChangeConfirmTips')}
          //   confirmLabel={this.formatMessage('discardConfirm')}
          //   cancelLabel={this.formatMessage('discardCancel')}
          //   onConfirm={this.handleChangeModeOk}
          //   onClose={this.handleChangeModeClose}
          // />
        }
        <div className='ds-container'>
          {
            (isAttrMode ? useDataSources : mapUseDataSources)?.map((useDs, key) => {
              return (
                <EditItemDataSource
                  key={key}
                  useDataSource={useDs}
                  onIsDataSourceNotReady={this.onIsDataSourceNotReady}
                  onDataSourceSelectedChange={this.onDataSourceSelectedChange}
                  onCreateDataSourceCreatedOrFailed={this.onCreateDataSourceCreatedOrFailed}
                  onDataSourceVersionChange={this.onDataSourceVersionChange}
                />
              )
            })
          }
        </div>
      </div>
    )
  }
}
