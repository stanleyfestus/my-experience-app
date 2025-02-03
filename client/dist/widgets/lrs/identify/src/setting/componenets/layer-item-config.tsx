/** @jsx jsx */
import { React, jsx, css, hooks, type ImmutableObject } from 'jimu-core'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { Checkbox, Switch, TextInput } from 'jimu-ui'
import { LrsLayerType, type LrsLayer, type AttributeFieldSettings } from '../../config'
import { useDataSourceExists } from '../../runtime/data-source/use-data-source-exist'
import { List, TreeItemActionType, type TreeItemsType, type TreeItemType } from 'jimu-ui/basic/list-tree'
import defaultMessages from './../translations/default'

interface Props {
  widgetId: string
  total: number
  index: number
  lrsLayer?: ImmutableObject<LrsLayer>
  onLayerChanged: (index: number, item: ImmutableObject<LrsLayer>, dsUpdateRequired?: boolean) => void
}

export function LayerItemConfig (props: Props) {
  const { widgetId, index, lrsLayer, onLayerChanged } = props
  const [itemLabel, setItemLabel] = React.useState(lrsLayer?.name)
  const dsExist: boolean = useDataSourceExists({ widgetId, useDataSourceId: lrsLayer?.useDataSource?.dataSourceId })
  const getI18nMessage = hooks.useTranslation(defaultMessages)

  React.useEffect(() => {
    // Update if label has changed.
    if (lrsLayer?.name && itemLabel !== lrsLayer?.name) {
      setItemLabel(lrsLayer?.name)
    }
    // eslint-disable-next-line
  }, [lrsLayer?.name])

  const updateProperty = React.useCallback((prop: string, value: any, dsUpdateRequired = false) => {
    // Updates a single property on the current layer.
    let newItem
    if (value == null) {
      newItem = lrsLayer.without(prop as any)
    } else {
      newItem = lrsLayer.set(prop, value)
    }
    onLayerChanged(index, newItem, dsUpdateRequired)
  }, [onLayerChanged, index, lrsLayer])

  const updateEventInfoProperty = React.useCallback((prop: string, value: any, dsUpdateRequired = false) => {
    const eventInfo = lrsLayer.eventInfo
    const newEventInfo = eventInfo.set(prop, value)
    const newItem = lrsLayer.set('eventInfo', newEventInfo)
    onLayerChanged(index, newItem, dsUpdateRequired)
  }, [onLayerChanged, index, lrsLayer])

  const updateNetworkInfoProperty = React.useCallback((prop: string, value: any, dsUpdateRequired = false) => {
    const networkInfo = lrsLayer.networkInfo
    const newNetworkInfo = networkInfo.set(prop, value)
    const newItem = lrsLayer.set('networkInfo', newNetworkInfo)
    onLayerChanged(index, newItem, dsUpdateRequired)
  }, [onLayerChanged, index, lrsLayer])

  const handleLabelChange = React.useCallback((e) => {
    setItemLabel(e.target.value)
  }, [])

  const handleLabelAccept = React.useCallback((value) => {
    if (value.trim().length > 0) {
      updateProperty('name', value, true)
    } else {
      setItemLabel(lrsLayer?.name)
    }
  }, [lrsLayer?.name, updateProperty])

  const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    updateProperty('useFieldAlias', checked, false)
    if (lrsLayer.layerType === LrsLayerType.network) {
      updateNetworkInfoProperty('useFieldAlias', checked)
    }
  }

  const getCheckedState = (index: number) => {
    if (lrsLayer.layerType === LrsLayerType.network) return lrsLayer.networkInfo.attributeFields[index].enabled
    else if (lrsLayer.layerType === LrsLayerType.event) return lrsLayer.eventInfo.attributeFields[index].enabled
  }

  const setCheckState = (index: number) => {
    if (lrsLayer.layerType === LrsLayerType.event) {
      const updatedFields = lrsLayer.eventInfo.attributeFields.asMutable({ deep: true })
      updatedFields[index].enabled = !updatedFields[index].enabled
      updateEventInfoProperty('attributeFields', updatedFields, true)
    } else if (lrsLayer.layerType === LrsLayerType.network) {
      const updatedFields = lrsLayer.networkInfo.attributeFields.asMutable({ deep: true })
      updatedFields[index].enabled = !updatedFields[index].enabled
      updateNetworkInfoProperty('attributeFields', updatedFields, true)
    }
  }

  const onOrderChanged = (updatedFields: AttributeFieldSettings[]) => {
    if (lrsLayer.layerType === LrsLayerType.event) {
      updateEventInfoProperty('attributeFields', updatedFields, true)
    } else if (lrsLayer.layerType === LrsLayerType.network) {
      updateNetworkInfoProperty('attributeFields', updatedFields, true)
    }
  }

  const advancedActionMap = {
    overrideItemBlockInfo: ({ itemBlockInfo }: any, refComponent: any) => {
      return {
        name: TreeItemActionType.RenderOverrideItem,
        children: [{
          name: TreeItemActionType.RenderOverrideItemDroppableContainer,
          withListGroupItemWrapper: false,
          children: [{
            name: TreeItemActionType.RenderOverrideItemDraggableContainer,
            children: [{
              name: TreeItemActionType.RenderOverrideItemBody,
              children: [{
                name: TreeItemActionType.RenderOverrideItemMainLine,
                children: [{
                  name: TreeItemActionType.RenderOverrideItemDragHandle
                }, {
                  name: TreeItemActionType.RenderOverrideItemDetailToggle
                }, {
                  name: TreeItemActionType.RenderOverrideItemTitle
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

  const renderEventLayerConfig = () => {
    return (
      <div css={css`height: 100%; overflow:auto;`}>
        {lrsLayer && dsExist && (
        <React.Fragment>
          <SettingSection role='group'
          // aria-label={getI18nMessage('label')} title={getI18nMessage('label')}
          >
            <SettingRow>
              <TextInput
                size='sm'
                type='text'
                className='w-100'
                value={itemLabel}
                onChange={handleLabelChange}
                onAcceptValue={handleLabelAccept}
                // aria-label={getI18nMessage('label')}
                />
            </SettingRow>
            </SettingSection>
          </React.Fragment>
        )}
      </div>
    )
  }

  const renderNetworkLayerConfig = () => {
    return (
      <div css={css`height: 100%; overflow:auto;`}>
        {lrsLayer && dsExist && (
        <React.Fragment>
          <SettingSection role='group'
          // aria-label={getI18nMessage('label')} title={getI18nMessage('label')}
          >
            <SettingRow>
              <TextInput
                size='sm'
                type='text'
                className='w-100'
                value={itemLabel}
                onChange={handleLabelChange}
                onAcceptValue={handleLabelAccept}
                // aria-label={getI18nMessage('label')}
                />
            </SettingRow>
            <SettingRow flow="no-wrap" label={getI18nMessage('useFieldAlias')}>
              <Switch
                aria-label={getI18nMessage('useFieldAlias')}
                checked={lrsLayer.networkInfo.useFieldAlias}
                onChange={handleAliasChange}
                />
            </SettingRow>
            </SettingSection>
              <SettingSection role='group'>
                <SettingRow flow="wrap" label={getI18nMessage('configureFields')} >
                  <List
                    className='list-routeid-fields pt-2 w-100'
                    itemsJson={Array.from(lrsLayer.networkInfo.attributeFields).map(
                      (item, index) => ({
                        itemStateDetailContent: item,
                        itemKey: `${index}`,
                        itemStateChecked: getCheckedState(index),
                        itemStateTitle: lrsLayer.networkInfo.useFieldAlias ? item.field.alias : item.field.name
                      })
                    )}
                    renderOverrideItemDetailToggle={((actionData, refComponent) => {
                      const { itemJsons, itemJsons: [{ itemStateDetailVisible, itemStateDetailContent }] } = refComponent.props
                      const [currentItemJson] = itemJsons
                      const index = +currentItemJson.itemKey

                      return (
                        itemStateDetailContent
                          ? <Checkbox
                                  aria-expanded={!!itemStateDetailVisible}
                                  className='jimu-tree-item__detail-toggle mr-2'
                                  checked={lrsLayer.networkInfo.attributeFields[index].enabled}
                                  onClick={(evt) => { setCheckState(index) }}
                                />
                          : null
                      )
                    })}
                    dndEnabled
                    onUpdateItem={(actionData, refComponent) => {
                      const { itemJsons } = refComponent.props
                      const [, parentItemJson] = itemJsons as [
                        TreeItemType,
                        TreeItemsType
                      ]
                      onOrderChanged(
                        parentItemJson.map((i) => i.itemStateDetailContent)
                      )
                    }}
                    onClickItemBody={(actionData, refComponent) => {
                      const { itemJsons: [currentItemJson] } = refComponent.props
                      setCheckState(+currentItemJson.itemKey)
                    }}
                    {...advancedActionMap}
                  />
                </SettingRow>
              </SettingSection>
          </React.Fragment>
        )}
      </div>
    )
  }

  if (lrsLayer.layerType === LrsLayerType.event) {
    return (
      <div className='h-100'>
        {renderEventLayerConfig()}
      </div>
    )
  } else if (lrsLayer.layerType === LrsLayerType.network) {
    return (
      <div className='h-100'>
        {renderNetworkLayerConfig()}
      </div>
    )
  }
}
