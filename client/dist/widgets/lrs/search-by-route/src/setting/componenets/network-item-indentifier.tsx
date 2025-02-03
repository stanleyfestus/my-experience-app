/** @jsx jsx */
import { React, jsx, type ImmutableObject, hooks } from 'jimu-core'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { Checkbox, Select } from 'jimu-ui'
import { List, TreeItemActionType, type TreeItemType, type TreeItemsType } from 'jimu-ui/basic/list-tree'
import { Identifiers, LineIdentifiers, type NetworkItem } from '../../config'
import defaultMessages from '../translations/default'

interface Props {
  widgetId: string
  networkItem?: ImmutableObject<NetworkItem>
  onPropertyChanged: (prop: string, value: any, dsUpdateRequired?: boolean) => void
}

export function NetworkItemIdentifier (props: Props) {
  const { networkItem, onPropertyChanged } = props
  const getI18nMessage = hooks.useTranslation(defaultMessages)
  const currentNetwork = Object.assign({}, {}, networkItem)

  const getActiveIdentifiersCount = (): number => {
    // Returns how many identifiers are available.
    let count = 0
    if (currentNetwork.useRouteId) { count++ }
    if (currentNetwork.useRouteName) { count++ }
    if (currentNetwork.useMultiField) { count++ }
    return count
  }

  const getCheckedState = (index: number) => {
    return currentNetwork.routeIdFields[index].enabled
  }

  const setCheckState = (index: number) => {
    const updatedFields = currentNetwork.routeIdFields.asMutable({ deep: true })
    updatedFields[index].enabled = !updatedFields[index].enabled
    onPropertyChanged('routeIdFields', updatedFields, true)
  }

  const onOrderChanged = (updatedFields) => {
    onPropertyChanged('routeIdFields', updatedFields, true)
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

  return (
    <SettingSection title={getI18nMessage('defaultIdentifier')}>
      <SettingRow flow='wrap' label={getI18nMessage('routeIdentifier')}>
          <Select
            aria-label={getI18nMessage('routeIdentifier')}
            className='w-100'
            size='sm'
            value={currentNetwork.defaultIdentifer}
            disabled={getActiveIdentifiersCount() === 1}
            onChange={(e) => { onPropertyChanged('defaultIdentifer', e.target.value, true) }}
          >
            {currentNetwork.useRouteId && (
              <option value={Identifiers.RouteId}>{getI18nMessage('routeId')}</option>
            )}
            {currentNetwork.useRouteName && (
              <option value={Identifiers.RouteName}>{getI18nMessage('routeName')}</option>
            )}
            {currentNetwork.useMultiField && (
              <option value={Identifiers.MultiField}>{getI18nMessage('routeFields')}</option>
            )}
          </Select>
      </SettingRow>
      {currentNetwork.defaultIdentifer === Identifiers.MultiField && (
      <React.Fragment>
        <List
          className='list-routeid-fields pt-2'
          showCheckbox={true}
          dndEnabled={true}
          itemsJson={Array.from(currentNetwork.routeIdFields).map(
            (item, index) => ({
              itemStateDetailContent: item,
              itemKey: `${index}`,
              itemStateChecked: getCheckedState(index),
              itemStateTitle: item.field.alias,
              itemStateCommands: []
            })
          )}
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
          renderOverrideItemDetailToggle={((actionData, refComponent) => {
            const { itemJsons, itemJsons: [{ itemStateDetailVisible, itemStateDetailContent }] } = refComponent.props
            const [currentItemJson] = itemJsons
            const index = +currentItemJson.itemKey

            return (
              itemStateDetailContent
                ? <Checkbox
                  aria-expanded={!!itemStateDetailVisible}
                  className='jimu-tree-item__detail-toggle mr-2'
                  checked={getCheckedState(index)}
                  onClick={(evt) => { setCheckState(index) }}
                />
                : null
            )
          })}
          onClickItemBody={(actionData, refComponent) => {
            const { itemJsons: [currentItemJson] } = refComponent.props
            setCheckState(+currentItemJson.itemKey)
          }}
          {...advancedActionMap}
        />
      </React.Fragment>
      )}
      {currentNetwork.supportsLines && (
        <div style={{ marginTop: '12px' }}>
        <SettingRow flow='wrap' label={getI18nMessage('lineIdentifier')}>
          <Select
            aria-label={getI18nMessage('lineIdentifier')}
            className='w-100'
            size='sm'
            value={currentNetwork.defaultLineIdentifier}
            disabled={getActiveIdentifiersCount() === 1}
            onChange={(e) => { onPropertyChanged('defaultLineIdentifier', e.target.value, true) }}
          >
            {currentNetwork.useLineId && (
              <option value={LineIdentifiers.LineId}>{getI18nMessage('lineId')}</option>
            )}
            {currentNetwork.useLineName && (
              <option value={LineIdentifiers.LineName}>{getI18nMessage('lineName')}</option>
            )}
          </Select>
        </SettingRow>
        </div>
      )}
    </SettingSection>
  )
}
