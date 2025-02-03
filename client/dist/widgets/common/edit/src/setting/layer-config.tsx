/** @jsx jsx */
import {
  React,
  jsx,
  type IMThemeVariables,
  Immutable,
  type IntlShape,
  type IMUseDataSource,
  type UseDataSource,
  type SerializedStyles,
  polished,
  css,
  type QueriableDataSource,
  type IMFieldSchema,
  DataSourceManager,
  type IMDataSourceJson,
  type FeatureLayerDataSource,
  DataSourceComponent,
  SupportedLayerServiceTypes,
  utils,
  AllDataSourceTypes,
  DataSourceTypes,
  type SceneLayerDataSource
} from 'jimu-core'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import {
  TextInput,
  defaultMessages as jimuUIMessages,
  Checkbox,
  PanelHeader,
  Button,
  Switch,
  TextArea,
  Label,
  Popper,
  Select
} from 'jimu-ui'
import {
  DataSourceSelector,
  FieldSelector,
  dataComponentsUtils
} from 'jimu-ui/advanced/data-source-selector'
import { type LayersConfig, type TreeFields, LayerHonorModeType } from '../config'
import defaultMessages from './translations/default'
import { Tree, TreeCollapseStyle, TreeItemActionType, type TreeItemType, TreeAlignmentType } from 'jimu-ui/basic/list-tree'
import { AddFolderOutlined } from 'jimu-icons/outlined/editor/add-folder'
import { TrashOutlined } from 'jimu-icons/outlined/editor/trash'
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info'
import { INVISIBLE_FIELD } from './setting-const'
import { Fragment } from 'react'
const TREE_ROOT_ITEM = 'root item for tree data entry'

interface Props {
  useDataSource: IMUseDataSource
  isMapMode: boolean
  intl: IntlShape
  theme: IMThemeVariables
  layerEditingEnabled: boolean
  dataSourceChange?: (useDataSources: UseDataSource[]) => void
  filterDs?: (dsJson: IMDataSourceJson) => boolean
  optionChange: (prop: string, value: any) => void
  multiOptionsChange: (options: any) => void
  onClose?: () => void
}

interface State {
  dataSource: QueriableDataSource
  rootItemJson: TreeItemType
  itemLabel: string
  hasUncheck: boolean
  indeterminate: boolean
  isOpenDetailPopper: boolean
  popperRef: HTMLElement
  curEditField: any
  groupUpdating: boolean
}

export default class LayerConfig extends React.PureComponent<
Props & LayersConfig,
State
> {
  supportedDsTypes = Immutable([
    AllDataSourceTypes.FeatureLayer, AllDataSourceTypes.SceneLayer,
    AllDataSourceTypes.OrientedImageryLayer, AllDataSourceTypes.SubtypeSublayer
  ])

  colRef: React.RefObject<HTMLButtonElement>
  popperTextRef: HTMLInputElement

  constructor (props) {
    super(props)

    this.state = {
      dataSource: undefined,
      rootItemJson: this.constructTreeItem(props.groupedFields),
      itemLabel: props.name || '',
      hasUncheck: this.getUncheckState(props.groupedFields),
      indeterminate: this.getIndeterminate(props.groupedFields),
      isOpenDetailPopper: false,
      popperRef: undefined,
      curEditField: undefined,
      groupUpdating: false
    }
    this.colRef = React.createRef()
  }

  componentDidUpdate (preProps: Props & LayersConfig, preState: State) {
    if (this.props.name !== preProps.name) {
      this.setState({ itemLabel: this.props.name || '' })
    }
    if (this.props.id !== preProps.id) {
      this.setState({ rootItemJson: this.constructTreeItem(this.props.groupedFields) })
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

  getUncheckState = (groupedFields: TreeFields[] = []) => {
    return groupedFields.some(item => !item.editAuthority && item.editable)
  }

  getIndeterminate = (groupedFields: TreeFields[] = []) => {
    const hasCheck = groupedFields.some(item => item.editAuthority && item.editable)
    const hasUncheck = groupedFields.some(item => !item.editAuthority && item.editable)
    return hasCheck && hasUncheck
  }

  getGroupMaxId (arr: TreeFields[] = []): number {
    const numbers = []
    arr.forEach(item => {
      if (item?.groupKey) {
        numbers.push(item?.groupKey)
      }
    })
    return numbers.length > 0 ? Math.max.apply(null, numbers) : 0
  }

  onLayerModeChange = (value: LayerHonorModeType) => {
    this.props.optionChange('layerHonorMode', value)
  }

  handleSwitchChange = (evt, name: string) => {
    const target = evt.currentTarget
    if (!target) return
    this.props.optionChange(name, target.checked)
  }

  handleUpdateRecordsChange = (evt, allowGeometryUpdates: boolean) => {
    const target = evt.currentTarget
    if (!target) return
    const newSwitchStatus = target.checked
    this.props.multiOptionsChange({
      updateRecords: newSwitchStatus,
      updateAttributes: newSwitchStatus,
      updateGeometries: allowGeometryUpdates && newSwitchStatus
    })
  }

  handleUpdateAttrOrGeoChange = (evt, name: string) => {
    const target = evt.currentTarget
    if (!target) return
    const newStatus = target.checked
    const { updateAttributes, updateGeometries } = this.props
    const bothClose = (name === 'updateAttributes' && !newStatus && !updateGeometries) ||
      (name === 'updateGeometries' && !newStatus && !updateAttributes)
    if (bothClose) {
      this.props.multiOptionsChange({
        updateRecords: false,
        updateAttributes: false,
        updateGeometries: false
      })
    } else {
      this.props.optionChange(name, newStatus)
    }
  }

  findEditingIndex = (targetId: string) => {
    const { groupedFields: orgGroupedFields } = this.props
    let editingIndex
    orgGroupedFields.forEach((field, index) => {
      if (field.jimuName === targetId) {
        editingIndex = [index]
      } else if (field?.children) {
        const subIndex = field.children.findIndex(item => item.jimuName === targetId)
        if (subIndex > -1) {
          editingIndex = [index, subIndex]
        }
      }
    })
    return editingIndex
  }

  handleTreeBoxChange = evt => {
    const target = evt.currentTarget
    if (!target) return
    const { groupedFields: orgGroupedFields } = this.props
    const editingIndex = this.findEditingIndex(target.id)
    // edit editAuthority
    if (editingIndex.length === 2) {
      const [index, subIndex] = editingIndex
      orgGroupedFields[index][subIndex].editAuthority = target.checked
    } else if (editingIndex.length === 1) {
      const [index] = editingIndex
      orgGroupedFields[index].editAuthority = target.checked
    }
    this.props.optionChange('groupedFields', orgGroupedFields)
    const newItemJson = this.constructTreeItem(orgGroupedFields)
    this.setState({ rootItemJson: newItemJson })
  }

  handleTreeDescChange = (id, value) => {
    const { groupedFields: orgGroupedFields } = this.props
    const editingIndex = this.findEditingIndex(id)
    // edit description
    if (editingIndex.length === 2) {
      const [index, subIndex] = editingIndex
      orgGroupedFields[index].children[subIndex].subDescription = value
    } else if (editingIndex.length === 1) {
      const [index] = editingIndex
      orgGroupedFields[index].subDescription = value
    }
    this.props.optionChange('groupedFields', orgGroupedFields)
    const newItemJson = this.constructTreeItem(orgGroupedFields)
    this.setState({ rootItemJson: newItemJson, isOpenDetailPopper: false })
  }

  formatMessage = (id: string, values?: { [key: string]: any }) => {
    const messages = Object.assign({}, defaultMessages, jimuUIMessages)
    return this.props.intl.formatMessage(
      { id: id, defaultMessage: messages[id] },
      values
    )
  }

  minusArray = (array1, array2, key?: string) => {
    const keyField = key || 'jimuName'
    const lengthFlag = array1.length > array2.length
    const arr1 = lengthFlag ? array1 : array2
    const arr2 = lengthFlag ? array2 : array1
    return arr1.filter(item => {
      const hasField = arr2.some(ele => {
        return ele?.[keyField] === item?.[keyField]
      })
      return !hasField
    })
  }

  onFieldChange = (allSelectedFields: IMFieldSchema[]) => {
    if (!allSelectedFields) return
    const { dataSource } = this.state
    const { showFields: orgShowFields, groupedFields: orgGroupedFields } = this.props
    const filteredFields = allSelectedFields.filter(item => item)
    if (allSelectedFields.length === 0) { // uncheck all
      orgGroupedFields.length = 0
    } else {
      // find the changed field
      const changed = this.minusArray(allSelectedFields, orgShowFields)
      const changedField = changed?.[0]
      // find the changed index in orgGroupedFields
      let editingIndex
      orgGroupedFields.forEach((field, index) => {
        if (field?.children) {
          const subIndex = field.children.findIndex(item => item.jimuName === changedField?.jimuName)
          if (subIndex > -1) {
            editingIndex = [index, subIndex]
          }
        } else {
          if (field.jimuName === changedField?.jimuName) {
            editingIndex = [index]
          }
        }
      })
      if (editingIndex) { // uncheck
        if (editingIndex.length === 2) {
          const [index, subIndex] = editingIndex
          orgGroupedFields[index].children.splice(subIndex, 1)
        } else if (editingIndex.length === 1) {
          const [index] = editingIndex
          orgGroupedFields.splice(index, 1)
        }
      } else { // check
        const layerDefinition = (dataSource as FeatureLayerDataSource)?.getLayerDefinition()
        const fieldsConfig = layerDefinition?.fields || []
        const orgField = fieldsConfig.find(field => field.name === changedField.jimuName)
        const defaultAuthority = orgField?.editable
        orgGroupedFields.push({ ...changedField, editAuthority: defaultAuthority, subDescription: changedField?.description || '', editable: defaultAuthority })
      }
    }
    this.props.multiOptionsChange({
      showFields: filteredFields,
      groupedFields: orgGroupedFields
    })
    const newItemJson = this.constructTreeItem(orgGroupedFields)
    const hasUncheck = this.getUncheckState(orgGroupedFields)
    const indeterminate = this.getIndeterminate(orgGroupedFields)
    this.setState({ rootItemJson: newItemJson, hasUncheck, indeterminate })
  }

  onDataSourceCreated = (dataSource: QueriableDataSource): void => {
    this.setState({ dataSource }, () => {
      const { groupedFields } = this.props
      const newItemJson = this.constructTreeItem(groupedFields)
      this.setState({ rootItemJson: newItemJson })
    })
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
          height: calc(100% - ${polished.rem(58)});
          overflow: auto;
          .layer-mode {
            .layer-mode-item {
              display: flex;
              margin-bottom: 8px;
            }
          }
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
              max-height: 300px;
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
                  .jimu-tree-item__title{
                    .jimu-input{
                      width: 125px;
                    }
                  }
                  .item-remove-button {
                    padding: 0 .125rem; /** consistent with detail icon from tree. */
                  }
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
          .capability-item{
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
          }
          .disabled-label{
            color: ${theme.ref.palette.neutral[700]};
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
    return allFields
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

  getSelectorFields = (showFields: IMFieldSchema[]) => {
    const selectorFields: string[] = []
    if (showFields && showFields.length > 0) {
      showFields.forEach(item => {
        selectorFields.push(item.jimuName)
      })
    }
    return selectorFields
  }

  handleTreeBoxAll = (hasUncheck) => {
    const { groupedFields } = this.props
    const newGroupedFields = groupedFields.map(item => {
      if (item?.children) {
        return {
          ...item,
          editAuthority: hasUncheck,
          children: item.children.map(child => {
            return {
              ...child,
              ...(child.editable ? { editAuthority: hasUncheck } : {})
            }
          })
        }
      }
      return {
        ...item,
        ...(item.editable ? { editAuthority: hasUncheck } : {})
      }
    })
    this.props.optionChange('groupedFields', newGroupedFields)
    const newItemJson = this.constructTreeItem(newGroupedFields)
    this.setState({ rootItemJson: newItemJson, hasUncheck: !hasUncheck, indeterminate: false })
  }

  addGroupForFields = () => {
    this.setState({ groupUpdating: true }, () => {
      setTimeout(() => {
        this.setState({ groupUpdating: false })
      }, 1000)
    })
    const { groupedFields: orgGroupedFields } = this.props
    const newGroupId = this.getGroupMaxId(orgGroupedFields) + 1
    const newGroupField = {
      jimuName: `${this.formatMessage('group')}-${newGroupId}`,
      name: `${this.formatMessage('group')}-${newGroupId}`,
      alias: `${this.formatMessage('group')}-${newGroupId}`,
      subDescription: '',
      editAuthority: false,
      editable: true,
      children: [],
      groupKey: newGroupId
    } as TreeFields
    orgGroupedFields.unshift(newGroupField)
    this.props.optionChange('groupedFields', orgGroupedFields)
    const newItemJson = this.constructTreeItem(orgGroupedFields)
    this.setState({ rootItemJson: newItemJson })
  }

  removeGroup = (jimuName: string) => {
    const { curEditField } = this.state
    const { groupedFields: orgGroupedFields } = this.props
    const activeIndex = orgGroupedFields.findIndex(item => item.jimuName === jimuName)
    orgGroupedFields.splice(activeIndex, 1, ...orgGroupedFields[activeIndex]?.children)
    this.props.optionChange('groupedFields', orgGroupedFields)
    const newItemJson = this.constructTreeItem(orgGroupedFields)
    this.setState({ rootItemJson: newItemJson })
    if (curEditField?.jimuName === jimuName) {
      this.setState({ isOpenDetailPopper: false })
    }
  }

  constructTreeItem = (groupedFields: TreeFields[] = []) => {
    const { theme, layerEditingEnabled } = this.props
    const allFields = this.getFieldsFromDataSource()
    const showFieldsToTreeItem = (groupedFields: TreeFields[]) => {
      return Array.from(groupedFields).map((item, index) => ({
        itemKey: `${utils.getUUID()}_${index}`,
        itemStateChecked: layerEditingEnabled ? item?.editAuthority : false,
        itemStateTitle: item.alias || item.jimuName || item.name,
        itemStateIcon: dataComponentsUtils.getIconFromFieldType(item.type, theme),
        itemStateDetailContent: item,
        itemStateDisabled: item?.groupKey ? false : !this.checkFieldsExist(allFields, item),
        itemStateCommands: [],
        isCheckboxDisabled: layerEditingEnabled ? !item.editable : true,
        ...(item.children ? { itemChildren: showFieldsToTreeItem(item.children) } : {})
      }))
    }
    const treeItem = showFieldsToTreeItem(groupedFields)
    const treeItemJson = {
      itemKey: TREE_ROOT_ITEM,
      itemStateTitle: TREE_ROOT_ITEM,
      itemChildren: treeItem
    }
    return treeItemJson
  }

  setRootItemJson = (nextRootItemJson) => {
    this.setState({ rootItemJson: nextRootItemJson })
  }

  showDetailPopper = (ref, curField) => {
    const { isOpenDetailPopper } = this.state
    this.setState({
      isOpenDetailPopper: !isOpenDetailPopper,
      popperRef: ref,
      curEditField: curField
    })
  }

  getCurrentEditField = (jimuName) => {
    const { groupedFields } = this.props
    const curIndex = this.findEditingIndex(jimuName)
    let curField: any = {
      jimuName: '',
      groupKey: '',
      editAuthority: false,
      children: [],
      subDescription: '',
      description: '',
      name: ''
    }
    if (curIndex?.length === 2) {
      const [index, subIndex] = curIndex
      curField = groupedFields[index].children[subIndex]
    } else if (curIndex?.length === 1) {
      const [index] = curIndex
      curField = groupedFields[index]
    }
    return curField
  }

  render () {
    const {
      onClose,
      optionChange,
      dataSourceChange,
      filterDs,
      id,
      useDataSource,
      theme,
      showFields,
      addRecords,
      deleteRecords,
      updateRecords,
      updateAttributes,
      updateGeometries,
      groupedFields,
      layerHonorMode,
      layerEditingEnabled,
      isMapMode
    } = this.props
    const { rootItemJson, itemLabel, dataSource, hasUncheck, indeterminate, isOpenDetailPopper, popperRef, curEditField, groupUpdating } = this.state
    const geometryMode = isMapMode
    const selectorFields = this.getSelectorFields(showFields)
    // capabilities
    const currentDataSource = !dataSource ? DataSourceManager.getInstance().getDataSource(id) : dataSource
    const isScene = currentDataSource?.type === DataSourceTypes.SceneLayer
    const layerDefinition = isScene
      ? (currentDataSource as SceneLayerDataSource).getAssociatedDataSource()?.getLayerDefinition()
      : (currentDataSource as FeatureLayerDataSource)?.getLayerDefinition()
    const allowGeometryUpdates = layerDefinition?.allowGeometryUpdates
    const isTable = layerDefinition?.type === SupportedLayerServiceTypes.Table
    const getDsCap = (capabilities: string, capType: string) => {
      if (capabilities) {
        return Array.isArray(capabilities)
          ? capabilities?.join().toLowerCase().includes(capType)
          : capabilities?.toLowerCase().includes(capType)
      } else {
        return false
      }
    }
    const capabilities = layerDefinition?.capabilities
    const create = getDsCap(capabilities, 'create')
    const update = getDsCap(capabilities, 'update')
    const deletable = getDsCap(capabilities, 'delete')
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
          }, {
            name: TreeItemActionType.RenderOverrideItemSubitems
          }]
        }
      }
    }
    let editCount = 0
    groupedFields?.forEach(item => {
      if (item?.children) {
        item?.children.forEach(ele => {
          if (ele?.editAuthority) editCount++
        })
      } else {
        if (item?.editAuthority) editCount++
      }
    })
    const isFromMap = !!(currentDataSource?.getRootDataSource() as any)?.map

    return (
      <div className='w-100 h-100' css={this.getStyle(theme)}>
        <div className='w-100 h-100 layer-config-panel'>
          <div className="w-100 d-flex px-4 py-0">
            <PanelHeader
              level={1}
              className='px-0 py-4 panel-inner'
              showClose={!!onClose}
              onClose={onClose}
              title={this.formatMessage('layerConfig')}>
            </PanelHeader>
          </div>
          <div className='setting-container'>
            <SettingSection title={this.formatMessage('data')} className="pt-0">
              <SettingRow>
                <DataSourceSelector
                  types={this.supportedDsTypes}
                  disableRemove={() => true}
                  disableDataSourceList={isMapMode}
                  hideDataView
                  useDataSources={
                    useDataSource ? Immutable([useDataSource]) : Immutable([])
                  }
                  mustUseDataSource
                  onChange={dataSourceChange}
                  closeDataSourceListOnChange
                  hideDs={filterDs}
                  hideTabs={Immutable(['OUTPUT'])}
                />
              </SettingRow>
            </SettingSection>

            {useDataSource &&
              <Fragment>
                <SettingSection title={this.formatMessage('label')}>
                  <SettingRow>
                    <TextInput
                      size='sm'
                      type='text'
                      className='w-100'
                      value={itemLabel}
                      onChange={this.nameChange}
                      onAcceptValue={this.nameAccept}
                      aria-label={this.formatMessage('label')}
                    />
                  </SettingRow>
                </SettingSection>

                <SettingSection title={this.formatMessage('capability')}>
                  {layerEditingEnabled
                    ? <Fragment>
                      {((!geometryMode && isTable) || geometryMode) &&
                        <div className='capability-item' key={'addRecords'}>
                          <span className='text-break' style={{ width: '80%' }}>{this.formatMessage('addRecords')}</span>
                          <Switch
                            aria-label={this.formatMessage('addRecords')}
                            className='can-x-switch'
                            checked={addRecords}
                            onChange={evt => { this.handleSwitchChange(evt, 'addRecords') }}
                            disabled={!create}
                          />
                        </div>
                      }
                      <div className='capability-item' key={'deleteRecords'}>
                        <span className='text-break' style={{ width: '80%' }}>{this.formatMessage('deleteRecords')}</span>
                        <Switch
                          aria-label={this.formatMessage('deleteRecords')}
                          className='can-x-switch'
                          checked={deleteRecords}
                          onChange={evt => { this.handleSwitchChange(evt, 'deleteRecords') }}
                          disabled={!deletable}
                        />
                      </div>
                      <div className='capability-item' key={'updateRecords'}>
                        <span className='text-break' style={{ width: '80%' }}>{this.formatMessage('updateRecords')}</span>
                        <Switch
                          aria-label={this.formatMessage('updateRecords')}
                          className='can-x-switch'
                          checked={updateRecords}
                          onChange={evt => { this.handleUpdateRecordsChange(evt, allowGeometryUpdates) }}
                          disabled={!update}
                        />
                      </div>
                      {geometryMode && updateRecords &&
                        <div className='ml-4'>
                          <Label className='w-100 d-flex'>
                            <Checkbox
                              style={{ cursor: 'pointer', marginTop: '2px' }}
                              checked={updateAttributes}
                              aria-label={this.formatMessage('attribute')}
                              onChange={evt => { this.handleUpdateAttrOrGeoChange(evt, 'updateAttributes') }}
                            />
                            <div className='m-0 ml-2 flex-grow-1 omit-label'>
                              {this.formatMessage('attribute')}
                            </div>
                          </Label>
                          <Label className='w-100 d-flex'>
                            <Checkbox
                              style={{ cursor: 'pointer', marginTop: '2px' }}
                              checked={updateGeometries}
                              aria-label={this.formatMessage('geometry')}
                              onChange={evt => { this.handleUpdateAttrOrGeoChange(evt, 'updateGeometries') }}
                              disabled={!allowGeometryUpdates}
                            />
                            <div className={`m-0 ml-2 flex-grow-1 omit-label ${!allowGeometryUpdates && 'disabled-label'}`}>
                              {this.formatMessage('geometry')}
                            </div>
                          </Label>
                        </div>
                      }
                    </Fragment>
                    : this.formatMessage('uneditableTips')
                  }
                </SettingSection>

                <SettingSection title={this.formatMessage('configFields')}>
                  {isFromMap &&
                    <SettingRow>
                      <Select
                        size='sm'
                        className='w-100'
                        value={layerHonorMode}
                        onChange={(e) => { optionChange('layerHonorMode', e.target.value) }}
                      >
                        <option value={LayerHonorModeType.Webmap}>{this.formatMessage('layerHonorSetting')}</option>
                        <option value={LayerHonorModeType.Custom}>{this.formatMessage('layerCustomize')}</option>
                      </Select>
                    </SettingRow>
                  }
                  {layerHonorMode === LayerHonorModeType.Custom &&
                    <Fragment>
                      <SettingRow flow='wrap' label={this.formatMessage('configFieldsTip')}>
                        <FieldSelector
                          useDataSources={
                            useDataSource ? Immutable([useDataSource]) : Immutable([])
                          }
                          onChange={this.onFieldChange}
                          selectedFields={Immutable(selectorFields)}
                          isMultiple
                          isDataSourceDropDownHidden
                          useDropdown
                          useMultiDropdownBottomTools
                          hiddenFields={Immutable(INVISIBLE_FIELD)}
                        />
                      </SettingRow>

                      <SettingRow flow='wrap' label={layerEditingEnabled && this.formatMessage('editableCount', { count: editCount })}>
                        <div className='fields-list-header form-inline'>
                          <div className='d-flex w-100 ml-5 fields-list-check'>
                            {layerEditingEnabled &&
                              <Checkbox
                                id='editAll'
                                data-field='editAll'
                                onClick={() => { this.handleTreeBoxAll(hasUncheck) }}
                                checked={!hasUncheck}
                                indeterminate={indeterminate}
                                title={hasUncheck
                                  ? `${this.formatMessage('editable')} (${this.formatMessage('checkAll')})`
                                  : `${this.formatMessage('editable')} (${this.formatMessage('uncheckAll')})`}
                              />
                            }
                            <Label
                              for='editAll'
                              style={{ cursor: 'pointer' }}
                              className='ml-2'
                              title={this.formatMessage('field')}
                            >
                              {this.formatMessage('field')}
                            </Label>
                          </div>
                          <Button
                            icon
                            size='sm'
                            type='tertiary'
                            onClick={this.addGroupForFields}
                            title={this.formatMessage('addGroup')}
                            aria-label={this.formatMessage('addGroup')}
                            disabled={groupUpdating}
                          >
                            <AddFolderOutlined />
                          </Button>
                        </div>
                      </SettingRow>

                      <SettingRow className='selected-fields-con'>
                        <Tree
                          className='selected-fields-list'
                          rootItemJson={rootItemJson}
                          treeAlignmentType={TreeAlignmentType.Intact}
                          dndEnabled
                          checkboxLinkage={layerEditingEnabled}
                          collapseStyle={TreeCollapseStyle.Arrow}
                          renderOverrideItemCommands={(actionData, refComponent) => {
                            const { itemJsons } = refComponent.props
                            const [currentItemJson] = itemJsons
                            const { jimuName: jimuNameKey } = currentItemJson?.itemStateDetailContent
                            const curField = this.getCurrentEditField(jimuNameKey)
                            const { jimuName, groupKey } = curField
                            return groupKey
                              ? <Button
                                  icon
                                  size='sm'
                                  type='tertiary'
                                  className='item-remove-button'
                                  onClick={(evt) => {
                                    evt?.stopPropagation()
                                    this.removeGroup(jimuName)
                                  }}
                                  onKeyUp={(evt) => {
                                    if (evt.key === ' ' || evt.key === 'Enter') {
                                      this.removeGroup(jimuName)
                                    }
                                  }}
                                  title={this.formatMessage('remove')}
                                  aria-label={this.formatMessage('remove')}
                                >
                                <TrashOutlined />
                              </Button>
                              : ''
                          }}
                          renderOverrideItemDetailToggle={(actionData, refComponent) => {
                            const { itemJsons, itemJsons: [{ itemStateDetailVisible, itemStateDetailContent, itemStateDisabled }] } = refComponent.props
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
                                ? <Button
                                    icon
                                    type='tertiary'
                                    size='sm'
                                    title={this.formatMessage('description')}
                                    aria-label={this.formatMessage('description')}
                                    disabled={!!itemStateDisabled}
                                    aria-expanded={!!itemStateDetailVisible}
                                    className='jimu-tree-item__detail-toggle'
                                    onClick={(evt) => {
                                      evt.stopPropagation()
                                      this.showDetailPopper(refComponent.dragRef, curField)
                                    }}
                                    onKeyUp={(evt) => {
                                      if (evt.key === ' ' || evt.key === 'Enter') {
                                        evt.stopPropagation()
                                        this.showDetailPopper(refComponent.dragRef, curField)
                                      }
                                    }}
                                    css={getStyle}
                                  >
                                    <InfoOutlined autoFlip={!itemStateDetailVisible} />
                                  </Button>
                                : null
                            )
                          }}
                          isItemDroppable={(actionData, refComponent) => {
                            const { draggingItemJsons, targetItemJsons, dropType } = actionData
                            const isTargetGroup = targetItemJsons[0]?.itemChildren
                            const isTargetParentGroup = targetItemJsons[Math.min(1, targetItemJsons.length - 2)]?.itemChildren // skip the tree root
                            const isSourceGroup = draggingItemJsons[0]?.itemChildren
                            let droppable = true
                            if (dropType === 'to-inside' && (!isTargetGroup || isSourceGroup)) {
                              droppable = false
                            }
                            if (dropType !== 'to-inside' && isTargetParentGroup && isSourceGroup) {
                              droppable = false
                            }
                            return droppable
                          }}
                          isFolder={(actionData, refComponent) => {
                            const { targetItemJsons } = actionData
                            const [currentItemJson] = targetItemJsons
                            const { groupKey } = currentItemJson?.itemStateDetailContent
                            return !!groupKey
                          }}
                          onUpdateItem={(actionData, refComponent) => {
                            const { itemJsons, updateType } = actionData
                            const parentItemJson = itemJsons[itemJsons.length - 1]
                            const [currentItemJson] = itemJsons
                            const { jimuName } = currentItemJson?.itemStateDetailContent
                            const curField = this.getCurrentEditField(jimuName)
                            const { groupKey } = curField
                            if (!groupKey && updateType === TreeItemActionType.HandleStartEditing) return
                            const newGroupedFields = parentItemJson.itemChildren?.map((item, index) => {
                              if (item?.itemChildren) {
                                if (!item.itemStateTitle) {
                                  parentItemJson.itemChildren[index].itemStateTitle = item.itemStateDetailContent?.jimuName
                                }
                                return {
                                  ...item.itemStateDetailContent,
                                  children: item.itemChildren.map(child => {
                                    return {
                                      ...child.itemStateDetailContent,
                                      editAuthority: child.itemStateChecked
                                    }
                                  }),
                                  ...(item.itemStateTitle
                                    ? {
                                        name: item.itemStateTitle,
                                        alias: item.itemStateTitle
                                      }
                                    : {
                                        name: item.itemStateDetailContent?.jimuName,
                                        alias: item.itemStateDetailContent?.jimuName
                                      }
                                  ),
                                  editAuthority: item.itemChildren?.length > 0
                                    ? !item.itemChildren?.some(item => {
                                        return item.isCheckboxDisabled === false && item.itemStateChecked === false
                                      })
                                    : false
                                }
                              }
                              return {
                                ...item.itemStateDetailContent,
                                editAuthority: item.itemStateChecked
                              }
                            })
                            optionChange('groupedFields', newGroupedFields)
                            const hasUncheck = this.getUncheckState(newGroupedFields)
                            const indeterminate = this.getIndeterminate(newGroupedFields)
                            this.setState({ rootItemJson: parentItemJson, hasUncheck, indeterminate })
                          }}
                          {...advancedActionMap}
                        />
                        <Popper
                          placement='bottom-start'
                          disableResize
                          reference={popperRef}
                          offset={[-27, 3]}
                          open={isOpenDetailPopper}
                          showArrow={false}
                          toggle={e => {
                            this.setState({ isOpenDetailPopper: !isOpenDetailPopper })
                          }}
                        >
                          <div style={{ width: 228, height: 132 }} className='p-4'>
                            <TextArea
                              ref={e => { this.popperTextRef = e }}
                              id={curEditField?.jimuName}
                              className='w-100'
                              height={60}
                              placeholder={this.formatMessage('editFieldDescription')}
                              defaultValue={curEditField?.subDescription || curEditField?.description}
                            />
                            <div className='mt-4 float-right'>
                              <Button size='sm' type='primary' onClick={() => { this.handleTreeDescChange(curEditField?.jimuName, this.popperTextRef.value) }}>
                                {this.formatMessage('commonModalOk')}
                              </Button>
                              <Button size='sm' className='ml-1' onClick={() => {
                                this.setState({ isOpenDetailPopper: false })
                              }}>
                                {this.formatMessage('commonModalCancel')}
                              </Button>
                            </div>
                          </div>
                        </Popper>
                      </SettingRow>
                    </Fragment>
                  }
                </SettingSection>
                <div className='ds-container'>
                  <DataSourceComponent
                    useDataSource={Immutable(useDataSource)}
                    onDataSourceCreated={this.onDataSourceCreated}
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
