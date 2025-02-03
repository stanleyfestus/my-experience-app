/** @jsx jsx */
import {
  React,
  jsx,
  type IMThemeVariables,
  Immutable,
  type IntlShape,
  type UseDataSource,
  type SerializedStyles,
  css,
  JimuFieldType,
  DataSourceComponent,
  type QueriableDataSource,
  type IMFieldSchema,
  type FeatureLayerDataSource,
  DataSourceManager,
  CONSTANTS,
  AllDataSourceTypes,
  type IMDataSourceInfo,
  type IMDataSourceJson
} from 'jimu-core'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import {
  TextInput,
  Switch,
  defaultMessages as jimuUIMessages,
  Checkbox,
  type MultiSelectItem,
  Select,
  Label,
  Button,
  DistanceUnits,
  Radio
} from 'jimu-ui'
import {
  DataSourceSelector,
  FieldSelector,
  FieldSelectorWithFullTextIndex,
  dataComponentsUtils
} from 'jimu-ui/advanced/data-source-selector'
import { type LayersConfig, SelectionModeType, LayerHonorModeType, ResponsiveType } from '../config'
import defaultMessages from './translations/default'
import { Fragment } from 'react'
import { List, TreeItemActionType } from 'jimu-ui/basic/list-tree'
import { builderAppSync } from 'jimu-for-builder'
import { VisibleOutlined } from 'jimu-icons/outlined/application/visible'
import { InvisibleOutlined } from 'jimu-icons/outlined/application/invisible'
import uppercaseOutlined from 'jimu-icons/svg/outlined/editor/uppercase.svg'
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker'
import { defaultMessages as jimuLayoutsMessages } from 'jimu-layouts/layout-runtime'
import { FontStyle, type FontStyles, InputUnit } from 'jimu-ui/advanced/style-setting-components'

const { OUTPUT_DATA_VIEW_ID } = CONSTANTS
const FontStyleTypes = ['bold'] as FontStyles[]

interface Props {
  useDataSource?: UseDataSource
  isMapMode: boolean
  intl: IntlShape
  theme: IMThemeVariables
  appTheme: IMThemeVariables
  widgetId: string
  newAddFlag: boolean
  orgUseDataSources?: Immutable.ImmutableArray<any>
  dataSourceChange?: (useDataSources: UseDataSource[]) => void
  optionChange: (prop: string, value: any, viewId?: string) => void
  multiOptionsChange?: (options: any) => void
  multiOptionsAndUseDsChange?: (options: any, useDs: any) => void
  onDataSourceFieldsChange: (updateDataSource: UseDataSource, updateInfo: { id: string, usedFields: string[] }) => void
  onClose?: () => void
}

interface State {
  dataSource: QueriableDataSource
  itemLabel: string
  hasUncheck: boolean
}

export default class LayerConfig extends React.PureComponent<
Props & LayersConfig,
State
> {
  partSupportedDsTypes = Immutable([
    AllDataSourceTypes.FeatureLayer, AllDataSourceTypes.SceneLayer, AllDataSourceTypes.BuildingComponentSubLayer, AllDataSourceTypes.OrientedImageryLayer,
    AllDataSourceTypes.ImageryLayer, AllDataSourceTypes.SubtypeSublayer
  ])

  supportedDsTypes = Immutable([
    AllDataSourceTypes.FeatureLayer, AllDataSourceTypes.SceneLayer, AllDataSourceTypes.WebMap, AllDataSourceTypes.WebScene, AllDataSourceTypes.MapService,
    AllDataSourceTypes.FeatureService, AllDataSourceTypes.SceneService, AllDataSourceTypes.GroupLayer, AllDataSourceTypes.BuildingComponentSubLayer,
    AllDataSourceTypes.BuildingGroupSubLayer, AllDataSourceTypes.BuildingSceneLayer, AllDataSourceTypes.OrientedImageryLayer, AllDataSourceTypes.ImageryLayer
  ])

  batchDsTypes = Immutable([
    AllDataSourceTypes.WebMap, AllDataSourceTypes.WebScene, AllDataSourceTypes.MapService, AllDataSourceTypes.FeatureService,
    AllDataSourceTypes.SceneService, AllDataSourceTypes.GroupLayer, AllDataSourceTypes.BuildingGroupSubLayer, AllDataSourceTypes.BuildingSceneLayer,
    AllDataSourceTypes.SubtypeGroupLayer
  ])

  colRef: React.RefObject<HTMLButtonElement>
  dsManager: DataSourceManager

  constructor (props) {
    super(props)

    this.state = {
      dataSource: undefined,
      itemLabel: props.name || '',
      hasUncheck: this.getUncheckState(props.tableFields, props.id)
    }
    this.colRef = React.createRef()
    this.dsManager = DataSourceManager.getInstance()
  }

  componentDidUpdate (preProps: Props & LayersConfig, preState: State) {
    const { name, useDataSource, tableFields, optionChange } = this.props
    if (name !== preProps.name) {
      this.setState({ itemLabel: this.props.name || '' })
    }
    // check wether the tableFields is in new ds's allFields
    if (!tableFields) return
    const selectedDs = this.dsManager.getDataSource(useDataSource?.dataSourceId)
    // Ds removed, should't update the 'tableFields'
    if (!selectedDs) return
    const allFieldsSchema = selectedDs?.getSchema()
    const allFields = allFieldsSchema?.fields ? Object.values(allFieldsSchema?.fields) : []
    let needResetFields = false
    const allFieldsKey = allFields.map(item => item.jimuName)
    for (const item of tableFields) {
      if (!allFieldsKey.includes(item.jimuName)) {
        needResetFields = true
        break
      }
    }
    if (needResetFields) {
      const { tableFields: newTableFields } = this.getFieldsFromDataSource()
      optionChange('tableFields', newTableFields)
    }
  }

  nameChange = event => {
    const value = event.target.value
    this.setState({ itemLabel: value })
  }

  nameAccept = (value) => {
    value = value?.trim()
    value = value === '' ? this.props.name : value
    if (value !== this.state.itemLabel) {
      this.setState({ itemLabel: value })
    }
    this.props.optionChange('name', value)
  }

  getUncheckState = (tableFields = [], dsConfigId?: string) => {
    let hasUncheck = false
    let currentDs
    if (this.state) {
      currentDs = this.state.dataSource
    } else {
      if (!dsConfigId) return hasUncheck
      const { isMapMode } = this.props
      const strIndex = dsConfigId.lastIndexOf('-')
      const dsId = isMapMode ? dsConfigId : dsConfigId.substring(0, strIndex)
      currentDs = DataSourceManager.getInstance().getDataSource(dsId)
    }
    const layerDefinition = (currentDs as FeatureLayerDataSource)?.getLayerDefinition()
    tableFields.forEach(item => {
      const editable = this.getFieldEditable(layerDefinition, item.jimuName)
      if (!item.editAuthority && editable) hasUncheck = true
    })
    return hasUncheck
  }

  handleCheckboxChange = evt => {
    const target = evt.currentTarget
    if (!target) return
    if (target.dataset.field === 'enableEdit') {
      const { tableFields } = this.props
      const newTableFields = tableFields.map(item => {
        return {
          ...item,
          editAuthority: item.editable
        }
      })
      this.props.multiOptionsChange({
        enableEdit: target.checked,
        tableFields: newTableFields
      })
    } else {
      this.props.optionChange(target.dataset.field, target.checked)
    }
  }

  changeMatchType = (evt, checked: boolean) => {
    this.props.optionChange('searchExact', checked)
  }

  formatMessage = (id: string, values?: { [key: string]: any }) => {
    const messages = Object.assign({}, defaultMessages, jimuUIMessages, jimuLayoutsMessages)
    return this.props.intl.formatMessage(
      { id: id, defaultMessage: messages[id] },
      values
    )
  }

  displaySelectedFields = values => {
    return this.formatMessage('numSelected', { number: values.length })
  }

  filterSearchFields = (newTableFields) => {
    const { searchFields } = this.props
    const tableFieldsNames = newTableFields.map(item => item.jimuName)
    const filteredSearchFields = searchFields.filter(field => tableFieldsNames.includes(field))
    return filteredSearchFields
  }

  getFieldEditable = (layerDefinition, jimuName) => {
    const fieldsConfig = layerDefinition?.fields || []
    const orgField = fieldsConfig.find(config => config.name === jimuName)
    const fieldEditable = orgField ? orgField?.editable : true
    return fieldEditable
  }

  mergeArray = (arr1, arr2) => {
    const arr = arr1.concat(arr2)
    const newSet = new Set(arr)
    return Array.from(newSet)
  }

  onFieldChange = (allSelectedFields: IMFieldSchema[]) => {
    if (!allSelectedFields) return
    const { dataSource } = this.state
    const {
      id, isMapMode, useDataSource, tableFields, orgUseDataSources,
      multiOptionsChange, onDataSourceFieldsChange, multiOptionsAndUseDsChange
    } = this.props
    const layerDefinition = (dataSource as FeatureLayerDataSource)?.getLayerDefinition()
    const filteredFields = allSelectedFields.filter(ele => ele).map(item => {
      const editable = this.getFieldEditable(layerDefinition, item.jimuName)
      const curTableFields = tableFields.find(ele => ele.jimuName === item.jimuName)
      const newVisible = curTableFields ? curTableFields?.visible : true
      const newAuthority = curTableFields ? curTableFields?.editAuthority : editable
      return { ...item, editAuthority: newAuthority, editable, visible: newVisible }
    })
    // update searchFields, tableFields and the fields used
    const filteredSearchFields = this.filterSearchFields(filteredFields)
    const usedFields = allSelectedFields.map(f => f.jimuName)
    const updateOptions = {
      searchFields: filteredSearchFields,
      tableFields: filteredFields
    }
    // change usedFields
    if (isMapMode) {
      const index = orgUseDataSources?.findIndex(item => item?.dataSourceId === useDataSource?.dataSourceId)
      if (index === undefined || index < 0) return
      const newUseDataSources = orgUseDataSources.asMutable({ deep: true })
      const updateDataSource = orgUseDataSources[index]
      const newUpdateDataSource = Immutable(updateDataSource).set('fields', usedFields).set('useFieldsInPopupInfo', false)
      newUseDataSources[index] = newUpdateDataSource.asMutable({ deep: true })
      multiOptionsAndUseDsChange(updateOptions, newUseDataSources)
    } else {
      onDataSourceFieldsChange(useDataSource, { id, usedFields })
      multiOptionsChange(updateOptions)
    }
  }

  onDataSourceCreated = (dataSource: QueriableDataSource): void => {
    this.setState({ dataSource }, () => {
      if (this.checkIsDsAutoRefreshSettingOpen(dataSource)) {
        this.props.optionChange('updateText', true)
      }
    })
  }

  onDataSourceInfoChange = (info: IMDataSourceInfo) => {
    if (!info || !this.state.dataSource) {
      return
    }
    if (this.checkIsDsAutoRefreshSettingOpen(this.state.dataSource)) {
      this.props.optionChange('updateText', true)
    }
  }

  getSearchingFields = (): MultiSelectItem[] => {
    const res = []
    const { tableFields } = this.props
    if (tableFields.length > 0) {
      tableFields.forEach(item => {
        if (item.type === JimuFieldType.String) {
          res.push({
            value: item.jimuName || item.name,
            label: item.alias || item.name
          })
        }
      })
    }
    return res
  }

  handleChooseSearchingFieldsChange = (allSelectedFields: IMFieldSchema[]) => {
    const { widgetId } = this.props
    if (allSelectedFields.length === 0) {
      builderAppSync.publishChangeWidgetStatePropToApp({ widgetId, propKey: 'optionChangeSuggestion', value: true })
    }
    this.props.optionChange('searchFields', allSelectedFields.map(fieldSchema => fieldSchema.name))
  }

  onSearchPlaceholderChange = (e) => {
    const searchHint = e.target.value
    const preSearchHint = this.props?.searchHint
    if (preSearchHint === searchHint) return
    this.props.optionChange('searchHint', searchHint)
  }

  getSelectModeOptions = (): JSX.Element[] => {
    return [
      <option key={SelectionModeType.Single} value={SelectionModeType.Single}>
        {this.formatMessage('single')}
      </option>,
      <option
        key={SelectionModeType.Multiple}
        value={SelectionModeType.Multiple}
      >
        {this.formatMessage('multiple')}
      </option>
    ]
  }

  getStyle (theme: IMThemeVariables): SerializedStyles {
    return css`
      .layer-config-panel {
        .panel-inner {
          .title {
            max-width: 70%;
          }
        }
        .setting-container {
          height: 100%;
          overflow: auto;
          .fields-list-header {
            background: ${theme.ref.palette.neutral[300]};
            border-bottom: 1px solid ${theme.ref.palette.neutral[600]};
            height: 34px;
            width: 100%;
            flex-wrap: nowrap;
            .jimu-checkbox {
              margin-top: 2px;
            }
          }
          .selected-fields-con{
            margin-top: 0;
            .selected-fields-list {
              flex: 1;
              max-height: 265px;
              overflow-y: auto;
            }
            .jimu-tree-item{
              background: ${theme.ref.palette.neutral[300]};
              border-bottom: 1px solid ${theme.ref.palette.neutral[400]};
              .jimu-tree-item__content{
                div:first-of-type{
                  padding-left: 2px;
                }
                .jimu-tree-item__body{
                  background: ${theme.ref.palette.neutral[300]};
                }
              }
            }
          }
          .table-options {
            .table-options-item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            .select-option {
              margin-bottom: 8px;
            }
          }
          .ds-container {
            position: absolute;
            display: none;
          }
          .component-field-selector {
            .search-input {
              width: 100%;
            }
            .field-list {
              max-height: 300px;
            }
          }
          .config-word-break {
            word-wrap: break-word;
          }
          .last-setting-section {
            border-bottom: unset;
          }
        }
      }
    `
  }

  getFieldsFromDataSource = () => {
    const { useDataSource } = this.props
    const selectedDs = DataSourceManager.getInstance().getDataSource(useDataSource?.dataSourceId)
    const allFieldsSchema = selectedDs?.getSchema()
    const allFields = allFieldsSchema?.fields ? Object.values(allFieldsSchema?.fields) : []
    const defaultInvisible = [
      'CreationDate',
      'Creator',
      'EditDate',
      'Editor',
      'GlobalID'
    ]
    const layerDefinition = (selectedDs as FeatureLayerDataSource)?.getLayerDefinition()
    const fieldsConfig = layerDefinition?.fields || []
    let tableFields = allFields.filter(
      item => !defaultInvisible.includes(item.jimuName)
    ).map(item => {
      const orgField = fieldsConfig.find(field => field.name === item.jimuName)
      const defaultAuthority = orgField?.editable
      return { ...item, editAuthority: defaultAuthority, editable: defaultAuthority, visible: true }
    })
    // If there are too many columns, only the first 50 columns will be displayed by default
    if (tableFields?.length > 50) {
      tableFields = tableFields.slice(0, 50)
    }
    return { allFields, tableFields }
  }

  checkFieldsExist = (allFields, tableField) => {
    let exist = false
    for (const item of allFields) {
      if (item.jimuName === tableField.jimuName) {
        exist = true
        break
      }
    }
    return exist
  }

  handleHonorTypeChange = (mode: LayerHonorModeType) => {
    const { isMapMode, multiOptionsAndUseDsChange, tableFields, orgUseDataSources, useDataSource } = this.props
    const updateOptions = {
      layerHonorMode: mode,
      enableDelete: false
    }
    if (isMapMode) {
      // Turn to 'CUSTOM', need to set useFieldsInPopupInfo false, record fields.
      // Turn to 'WEBMAP', need to set useFieldsInPopupInfo true, clear fields.
      const index = orgUseDataSources?.findIndex(item => item?.dataSourceId === useDataSource?.dataSourceId)
      if (index === undefined || index < 0) return
      const newUseDataSources = orgUseDataSources.asMutable({ deep: true })
      if (mode === LayerHonorModeType.Custom) {
        const usedFields = tableFields.map(f => f.jimuName)
        const updateDataSource = orgUseDataSources[index]
        const newUpdateDataSource = Immutable(updateDataSource).set('fields', usedFields).set('useFieldsInPopupInfo', false)
        newUseDataSources[index] = newUpdateDataSource.asMutable({ deep: true })
      } else {
        const updateDataSource = orgUseDataSources[index]
        const newUpdateDataSource = Immutable(updateDataSource).set('fields', []).set('useFieldsInPopupInfo', true)
        newUseDataSources[index] = newUpdateDataSource.asMutable({ deep: true })
      }
      multiOptionsAndUseDsChange(updateOptions, newUseDataSources)
    } else {
      this.props.multiOptionsChange(updateOptions)
    }
  }

  handleListBoxAll = (hasUncheck: boolean, layerDefinition) => {
    const { tableFields } = this.props
    const newTableFields = tableFields.map(item => {
      const fieldEditable = this.getFieldEditable(layerDefinition, item.jimuName)
      return {
        ...item,
        editAuthority: fieldEditable ? hasUncheck : false
      }
    })
    this.setState({ hasUncheck: !hasUncheck })
    this.props.optionChange('tableFields', newTableFields)
  }

  getCurrentEditField = (jimuName: string) => {
    const { tableFields } = this.props
    return tableFields.find(item => item.jimuName === jimuName)
  }

  toggleFieldVisible = (jimuName: string) => {
    const { tableFields } = this.props
    const curIndex = tableFields.findIndex(item => item.jimuName === jimuName)
    const visible = tableFields[curIndex].visible
    tableFields[curIndex].visible = !visible
    this.props.optionChange('tableFields', tableFields)
  }

  onKeyUp = (evt, jimuName) => {
    if (!evt) return
    if (evt.key === 'Enter') {
      this.toggleFieldVisible(jimuName)
    }
  }

  handleColumnStyleChange = (key: string, value: ResponsiveType | number) => {
    const { columnSetting } = this.props
    if (columnSetting) {
      columnSetting[key] = value
      this.props.optionChange('columnSetting', columnSetting)
    } else {
      const newColumnSetting = {
        responsiveType: ResponsiveType.Fixed,
        columnWidth: 200
      }
      newColumnSetting[key] = value
      this.props.optionChange('columnSetting', newColumnSetting)
    }
  }

  handleHeaderStyleChange = (key: string, value: string | number | boolean): void => {
    const { headerFontSetting } = this.props
    if (headerFontSetting) {
      headerFontSetting[key] = value
      this.props.optionChange('headerFontSetting', headerFontSetting)
    } else {
      const newFontSetting = {
        backgroundColor: '',
        fontSize: 14,
        bold: false,
        color: ''
      }
      newFontSetting[key] = value
      this.props.optionChange('headerFontSetting', newFontSetting)
    }
  }

  checkIsDsAutoRefreshSettingOpen = (dataSource: QueriableDataSource): boolean => {
    if (!dataSource) return false
    const interval = dataSource?.getAutoRefreshInterval() || 0
    return interval > 0
  }

  getDsCapabilities = (capabilities: string, capType: string) => {
    if (capabilities) {
      return Array.isArray(capabilities)
        ? capabilities?.join().toLowerCase().includes(capType)
        : capabilities?.toLowerCase().includes(capType)
    } else {
      return false
    }
  }

  onFilterDs = (dsJson: IMDataSourceJson): boolean => {
    let hideDsFlag = false
    const isBatchDs = this.batchDsTypes.includes(dsJson.type as any)
    if (isBatchDs) {
      const dataSource = this.dsManager.getDataSource(dsJson.id)
      const allChildDs = dataSource.isDataSourceSet() ? dataSource.getAllChildDataSources() : []
      const allSupChildDs = allChildDs.filter(item => this.partSupportedDsTypes.includes(item.type as any))
      if (allSupChildDs?.length === 0) {
        hideDsFlag = true
      }
    }
    return hideDsFlag
  }

  render () {
    const {
      useDataSource,
      optionChange,
      theme,
      appTheme,
      tableFields,
      searchFields,
      searchExact,
      searchHint,
      enableEdit,
      enableSearch,
      widgetId,
      dataSourceChange,
      headerFontSetting,
      columnSetting,
      updateText,
      id,
      layerHonorMode,
      newAddFlag,
      isMapMode
    } = this.props
    const { dataSource, itemLabel, hasUncheck } = this.state
    const layerDefinition =
      dataSource && (dataSource as FeatureLayerDataSource).getLayerDefinition()
    const optionsArray = ['enableSelect', 'showCount', 'enableRefresh'] // 'allowCsv',
    const allFieldsSchema = dataSource?.getSchema()
    const dsTableFields = tableFields?.map(item => {
      const newItem = allFieldsSchema?.fields?.[item.jimuName] || {}
      return {
        ...item,
        ...newItem
      }
    })
    const _tableFields: string[] = []
    if (tableFields && tableFields.length > 0) {
      tableFields.forEach(item => {
        _tableFields.push(item.jimuName)
      })
    }
    const { allFields } = this.getFieldsFromDataSource()
    // Can't edit Feature collection(dataSource.url is undefined) and output ds
    const editableDs = dataSource?.url && dataSource?.dataViewId !== OUTPUT_DATA_VIEW_ID
    const capabilities = layerDefinition?.capabilities
    const updatable = this.getDsCapabilities(capabilities, 'update') && editableDs
    const deletable = this.getDsCapabilities(capabilities, 'delete') && editableDs
    const isCustom = layerHonorMode === LayerHonorModeType.Custom
    const showDelete = isCustom ? (enableEdit && deletable) : deletable
    const advancedActionMap = {
      overrideItemBlockInfo: ({ itemBlockInfo }, refComponent) => {
        return {
          name: TreeItemActionType.RenderOverrideItem,
          children: [{
            name: TreeItemActionType.RenderOverrideItemDroppableContainer,
            children: [{
              name: TreeItemActionType.RenderOverrideItemContent,
              children: [{
                name: TreeItemActionType.RenderOverrideItemBody,
                children: [{
                  name: TreeItemActionType.RenderOverrideItemMainLine,
                  children: [{
                    name: TreeItemActionType.RenderOverrideItemDraggableContainer,
                    children: [{
                      name: TreeItemActionType.RenderOverrideItemDragHandle
                    }, {
                      name: TreeItemActionType.RenderOverrideItemChildrenToggle
                    }, {
                      name: TreeItemActionType.RenderOverrideItemIcon
                    }, {
                      name: TreeItemActionType.RenderOverrideItemTitle
                    }, {
                      name: TreeItemActionType.RenderOverrideItemCommands
                    }, {
                      name: TreeItemActionType.RenderOverrideItemDetailToggle
                    }]
                  }]
                }, {
                  name: TreeItemActionType.RenderOverrideItemDetailLine
                }]
              }]
            }]
          }]
        }
      }
    }
    let editCount = 0
    dsTableFields?.forEach(item => {
      if (item?.editAuthority) editCount++
    })
    const visibleLabel = this.formatMessage('visible')
    const invisibleLabel = this.formatMessage('invisible')

    return (
      <div className='w-100 h-100' css={this.getStyle(theme)}>
        <div className='w-100 h-100 layer-config-panel'>
          <div className='setting-container'>
            <SettingSection title={this.formatMessage('data')} className="pt-0">
              <SettingRow>
                <DataSourceSelector
                  types={this.partSupportedDsTypes}
                  disableRemove={() => true}
                  disableDataSourceList={isMapMode}
                  hideDataView={isMapMode}
                  useDataSources={
                    useDataSource ? Immutable([useDataSource]) : Immutable([])
                  }
                  mustUseDataSource
                  onChange={dataSourceChange}
                  closeDataSourceListOnChange
                  hideDs={this.onFilterDs}
                  isMultiple={newAddFlag}
                  isBatched={true}
                />
              </SettingRow>
              {useDataSource && this.checkIsDsAutoRefreshSettingOpen(dataSource) &&
                <SettingRow label={this.formatMessage('updateText')}>
                  <Switch
                    className='can-x-switch'
                    checked={updateText}
                    onChange={evt => {
                      optionChange('updateText', evt.target.checked)
                    }}
                    aria-label={this.formatMessage('updateText')}
                  />
                </SettingRow>
              }
            </SettingSection>

            {useDataSource &&
              <Fragment>
                <SettingSection title={this.formatMessage('label')}>
                  <SettingRow>
                    <TextInput
                      type='text'
                      size='sm'
                      className='w-100'
                      value={itemLabel}
                      onChange={this.nameChange}
                      onAcceptValue={this.nameAccept}
                      aria-label={this.formatMessage('label')}
                    />
                  </SettingRow>
                </SettingSection>

                <SettingSection title={this.formatMessage('configFields')}>
                  <SettingRow>
                    <Select
                      size='sm'
                      className='w-100'
                      value={layerHonorMode}
                      onChange={e => { this.handleHonorTypeChange(e.target.value) }}
                    >
                      <option value={LayerHonorModeType.Webmap}>{this.formatMessage('layerHonorSetting')}</option>
                      <option value={LayerHonorModeType.Custom}>{this.formatMessage('layerCustomize')}</option>
                    </Select>
                  </SettingRow>
                  {isCustom &&
                    <Fragment>
                      <SettingRow>{this.formatMessage('configTips')}</SettingRow>
                      <SettingRow>
                        <FieldSelector
                          useDataSources={
                            useDataSource ? Immutable([useDataSource]) : Immutable([])
                          }
                          aria-label={this.formatMessage('configTips')}
                          onChange={this.onFieldChange}
                          selectedFields={Immutable(_tableFields)}
                          isMultiple
                          isDataSourceDropDownHidden
                          useDropdown
                          useMultiDropdownBottomTools
                        />
                      </SettingRow>
                      <SettingRow flow='wrap' label={enableEdit && this.formatMessage('editableCount', { count: editCount })}>
                        <div className='fields-list-header form-inline'>
                          <div className='d-flex w-100 ml-1 fields-list-check'>
                            {enableEdit &&
                              <Checkbox
                                id='editAllField'
                                data-field='editAllField'
                                onClick={() => { this.handleListBoxAll(hasUncheck, layerDefinition) }}
                                checked={!hasUncheck}
                                title={hasUncheck
                                  ? `${this.formatMessage('editable')} (${this.formatMessage('checkAll')})`
                                  : `${this.formatMessage('editable')} (${this.formatMessage('uncheckAll')})`}
                              />
                            }
                            <Label
                              for='editAllField'
                              style={{ cursor: 'pointer' }}
                              className='ml-2'
                              title={this.formatMessage('field')}
                            >
                              {this.formatMessage('field')}
                            </Label>
                          </div>
                        </div>
                      </SettingRow>
                      <SettingRow className='selected-fields-con'>
                        <List
                          className='selected-fields-list'
                          itemsJson={Array.from(dsTableFields).map((item, index) => ({
                            itemStateDetailContent: item,
                            ...(enableEdit ? { itemStateChecked: item?.editAuthority } : {}),
                            itemStateDisabled: !this.checkFieldsExist(allFields, item),
                            itemKey: `${index}`,
                            itemStateIcon: dataComponentsUtils.getIconFromFieldType(item.type, theme),
                            itemStateTitle: item.alias || item.jimuName || item.name,
                            isCheckboxDisabled: !this.getFieldEditable(layerDefinition, item.jimuName),
                            itemStateCommands: []
                          }))}
                          dndEnabled
                          isMultiSelection={enableEdit}
                          onUpdateItem={(actionData, refComponent) => {
                            const { itemJsons, updateType } = actionData
                            if (enableEdit || updateType === TreeItemActionType.HandleDidDrop) {
                              const parentItemJson = itemJsons[itemJsons.length - 1]
                              const newTableFields = parentItemJson.map(item => {
                                return {
                                  ...item.itemStateDetailContent,
                                  editAuthority: item.itemStateChecked
                                }
                              })
                              optionChange('tableFields', newTableFields)
                              const hasUncheck = this.getUncheckState(newTableFields)
                              this.setState({ hasUncheck })
                            }
                          }}
                          renderOverrideItemDetailToggle={(actionData, refComponent) => {
                            const { itemJsons, itemJsons: [{ itemStateDetailContent }] } = refComponent.props
                            const [currentItemJson] = itemJsons
                            const { jimuName } = currentItemJson?.itemStateDetailContent
                            const curField = this.getCurrentEditField(jimuName)
                            const getStyle = () => {
                              return css`
                                &.jimu-tree-item__detail-toggle {
                                  display: flex;
                                  align-items: center;
                                  cursor: pointer;

                                  .icon-btn-sizer {
                                    margin: 0;
                                    min-width: 0.5rem;
                                    min-height: 0.5rem;
                                  }
                                }
                              `
                            }
                            return (
                              itemStateDetailContent
                                ? <Fragment>
                                  <Button
                                    icon
                                    type='tertiary'
                                    title={curField.visible ? visibleLabel : invisibleLabel}
                                    aria-label={curField.visible ? visibleLabel : invisibleLabel}
                                    className='jimu-tree-item__detail-toggle'
                                    onClick={(evt) => {
                                      evt.stopPropagation()
                                      this.toggleFieldVisible(jimuName)
                                    }}
                                    onKeyUp={(e) => { this.onKeyUp(e, jimuName) }}
                                    css={getStyle}
                                  >
                                    {curField.visible ? <VisibleOutlined /> : <InvisibleOutlined />}
                                  </Button>
                                </Fragment>
                                : null
                            )
                          }}
                          {...advancedActionMap}
                        />
                      </SettingRow>
                      {/* {layerDefinition?.hasAttachments &&
                        <SettingRow>
                          <div className="d-flex w-100">
                            <Checkbox
                              data-field="enableAttachments"
                              onClick={this.handleCheckboxChange}
                              checked={this.props.enableAttachments} />
                            <div className="ml-2 config-word-break" title={this.formatMessage('enableAttachments')}>{this.formatMessage('enableAttachments')}</div>
                          </div>
                        </SettingRow>
                      } */}
                      {updatable && (
                        <SettingRow>
                          <div className='d-flex w-100'>
                            <Checkbox
                              id='editable-cb'
                              data-field='enableEdit'
                              onClick={this.handleCheckboxChange}
                              checked={enableEdit}
                            />
                            <Label
                              for='editable-cb'
                              style={{ cursor: 'pointer' }}
                              className='ml-2'
                              title={this.formatMessage('enableEdit')}
                            >
                              {this.formatMessage('enableEdit')}
                            </Label>
                          </div>
                        </SettingRow>
                      )}
                    </Fragment>
                  }
                </SettingSection>

                <SettingSection
                  role='group'
                  title={this.formatMessage('tableOptions')}
                  aria-label={this.formatMessage('tableOptions')}
                >
                  <SettingRow label={<strong>{this.formatMessage('columnSize')}</strong>} flow='wrap' role='group' aria-label={this.formatMessage('columnSize')}>
                    <div className='jimu-builder--background-setting'>
                      <div role='radiogroup'>
                        <Label className='d-flex align-items-center'>
                          <Radio
                            style={{ cursor: 'pointer' }}
                            name='responsiveType'
                            className='mr-2'
                            checked={columnSetting?.responsiveType === ResponsiveType.Fit}
                            onChange={() => { this.handleColumnStyleChange('responsiveType', ResponsiveType.Fit) }}
                          />
                          {this.formatMessage('fitToData')}
                        </Label>
                        <Label className='d-flex align-items-center'>
                          <Radio
                            style={{ cursor: 'pointer' }}
                            name='displayOrderType'
                            className='mr-2'
                            checked={columnSetting?.responsiveType === ResponsiveType.Fixed}
                            onChange={() => { this.handleColumnStyleChange('responsiveType', ResponsiveType.Fixed) }}
                          />
                          {this.formatMessage('fixed')}
                        </Label>
                      </div>
                      {columnSetting?.responsiveType === ResponsiveType.Fixed &&
                        <SettingRow label={this.formatMessage('columnWidth')}>
                          <InputUnit
                            style={{ width: '35%' }}
                            aria-label={this.formatMessage('columnWidth')}
                            min={80}
                            max={8192}
                            value={{ distance: columnSetting?.columnWidth ?? 80, unit: DistanceUnits.PIXEL }}
                            onChange={({ distance }) => { this.handleColumnStyleChange('columnWidth', distance) }}
                          />
                        </SettingRow>
                      }
                    </div>
                  </SettingRow>
                  <SettingRow label={<strong>{this.formatMessage('variableHeader')}</strong>} flow='wrap' role='group' aria-label={this.formatMessage('variableHeader')}>
                    <div className='jimu-builder--background-setting'>
                      <SettingRow
                        truncateLabel
                        flow='no-wrap'
                        role='group'
                        label={this.formatMessage('font')}
                        aria-label={this.formatMessage('font')}
                        className='mt-2'
                      >
                        <FontStyle
                          aria-label={this.formatMessage('fontStyle')}
                          bold={headerFontSetting?.bold}
                          types={FontStyleTypes}
                          onChange={this.handleHeaderStyleChange}
                        />
                        <ThemeColorPicker
                          icon={uppercaseOutlined}
                          type='with-icon'
                          title={this.formatMessage('fontColor')}
                          aria-label={this.formatMessage('fontColor')}
                          specificTheme={appTheme}
                          value={headerFontSetting?.color}
                          onChange={value => { this.handleHeaderStyleChange('color', value) }}
                          className='jimu-outline-inside'
                        />
                        <InputUnit
                          style={{ width: '35%' }}
                          aria-label={this.formatMessage('fontSize')}
                          min={12}
                          max={99}
                          value={{ distance: headerFontSetting?.fontSize ?? 14, unit: DistanceUnits.PIXEL }}
                          onChange={({ distance }) => { this.handleHeaderStyleChange('fontSize', distance) }}
                        />
                      </SettingRow>
                      <SettingRow label={this.formatMessage('backgroundColor')}>
                        <ThemeColorPicker
                          text={true}
                          specificTheme={appTheme}
                          aria-label={this.formatMessage('backgroundColor')}
                          value={headerFontSetting?.backgroundColor}
                          onChange={value => { this.handleHeaderStyleChange('backgroundColor', value) }}
                        />
                      </SettingRow>
                    </div>
                  </SettingRow>
                </SettingSection>

                <SettingSection
                  role='group'
                  className='last-setting-section'
                  title={this.formatMessage('tools')}
                  aria-label={this.formatMessage('tools')}
                >
                  <SettingRow label={this.formatMessage('enableSearch')}>
                    <Switch
                      className='can-x-switch'
                      checked={enableSearch || false}
                      onChange={evt => {
                        const checked = evt.target.checked
                        builderAppSync.publishChangeWidgetStatePropToApp({ widgetId, propKey: 'optionChangeSuggestion', value: true })
                        optionChange('enableSearch', checked)
                      }}
                      aria-label={this.formatMessage('enableSearch')}
                    />
                  </SettingRow>
                  {enableSearch && (
                    <Fragment>
                      <SettingRow flow='wrap' label={this.formatMessage('searchFields')}>
                        <div
                          className='w-100 search-container'
                          style={{ zIndex: 3 }}
                        >
                          <FieldSelectorWithFullTextIndex
                            useDataSources={useDataSource ? Immutable([useDataSource]) : Immutable([]) }
                            onChange={this.handleChooseSearchingFieldsChange}
                            selectedFields={searchFields ? Immutable(searchFields) : Immutable([])}
                            isMultiple
                            isDataSourceDropDownHidden
                            useDropdown
                            useMultiDropdownBottomTools
                            widgetId={id}
                            types={Immutable([JimuFieldType.Number, JimuFieldType.String])}
                            aria-label={this.formatMessage('searchFields')}
                          />
                        </div>
                      </SettingRow>
                      <SettingRow className='w-100 d-flex justify-content-between'>
                        <Label>
                          <Checkbox
                            style={{ cursor: 'pointer' }}
                            checked={searchExact}
                            aria-label={this.formatMessage('fullMatch')}
                            onChange={this.changeMatchType}
                          />
                          <div className='m-0 ml-2 flex-grow-1 omit-label'>
                            {this.formatMessage('fullMatch')}
                          </div>
                        </Label>
                      </SettingRow>
                      <SettingRow flow='wrap' label={this.formatMessage('searchHint')}>
                        <TextInput
                          size='sm'
                          className='search-placeholder w-100'
                          placeholder={this.formatMessage('search')}
                          value={searchHint || ''}
                          onChange={this.onSearchPlaceholderChange}
                          aria-label={this.formatMessage('searchHint')}
                        />
                      </SettingRow>
                    </Fragment>
                  )}
                  {optionsArray.map((key, index) => {
                    return (
                      <Fragment key={index}>
                        <SettingRow label={this.formatMessage(key)}>
                          <Switch
                            className='can-x-switch'
                            checked={this.props[key] || false}
                            onChange={evt => {
                              optionChange(key, evt.target.checked)
                            }}
                            aria-label={this.formatMessage(key)}
                          />
                        </SettingRow>
                        {key === 'enableSelect' && this.props[key] && (
                          <SettingRow
                            flow='wrap'
                            label={this.formatMessage('selectMode')}
                            className='select-option'
                          >
                            <Select
                              size='sm'
                              value={
                                this.props.selectMode ||
                                SelectionModeType.Multiple
                              }
                              onChange={evt => {
                                optionChange('selectMode', evt.target.value)
                              }}
                              aria-label={this.formatMessage('selectMode')}
                            >
                              {this.getSelectModeOptions()}
                            </Select>
                          </SettingRow>
                        )}
                      </Fragment>
                    )
                  })}
                  {showDelete &&
                    <SettingRow label={this.formatMessage('deleteRecords')}>
                      <Switch
                        className='can-x-switch'
                        checked={this.props.enableDelete || false}
                        onChange={evt => {
                          optionChange('enableDelete', evt.target.checked)
                        }}
                        aria-label={this.formatMessage('deleteRecords')}
                      />
                    </SettingRow>
                  }
                </SettingSection>
                <div className='ds-container'>
                  <DataSourceComponent
                    useDataSource={Immutable(useDataSource)}
                    onDataSourceCreated={this.onDataSourceCreated}
                    onDataSourceInfoChange={this.onDataSourceInfoChange}
                  />
                </div>
              </Fragment>
            }
          </div>
        </div>
      </div>
    )
  }
}
