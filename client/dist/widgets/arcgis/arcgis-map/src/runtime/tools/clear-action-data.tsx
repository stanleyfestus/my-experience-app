/** @jsx jsx */
import { css, jsx, MutableStoreManager, getAppStore, type ImmutableObject, type JimuMapViewInfo } from 'jimu-core'
import { type ShowOnMapDatas, type AddToMapDatas, type MapMutableState, ActionType, DataChangeType } from 'jimu-arcgis'
import { Icon, Dropdown, DropdownMenu, DropdownButton, DropdownItem, defaultMessages } from 'jimu-ui'
import { BaseTool, type BaseToolProps, type IconType } from '../layout/base/base-tool'
import { MultiSourceMapContext } from '../components/multisourcemap-context'

interface State {
  isOpen: boolean
}

interface ListItem {
  layerId: string
  title: string
  isAction: boolean // true means this item comes from ShowOnMap/AddToMap actions, false means it comes from JimuLayerView
}

export default class ClearActionData extends BaseTool<BaseToolProps, State> {
  toolName = 'ClearActionData'

  constructor (props) {
    super(props)
    this.state = { isOpen: false }
  }

  static getIsNeedSetting () {
    return false
  }

  getStyle () {
    return css`
      .jimu-dropdown {
        display: flex;
        .icon-btn {
          padding: 7px;
          border-radius: 0;
        }
      }
    `
  }

  getTitle () {
    return this.props.intl.formatMessage({ id: 'clearResults', defaultMessage: defaultMessages.clearResults })
  }

  getIcon (): IconType {
    return {
      icon: require('jimu-icons/svg/outlined/editor/trash.svg'),
      onIconClick: () => {
        this.onIconClick()
      }
    }
  }

  getListItems (mapWidgetId: string): ListItem[] {
    const mapMutableState: MapMutableState = MutableStoreManager.getInstance().getStateValue([mapWidgetId]) || {}
    const listItems1 = this.getListItemsByAddOrShowOnMapDatas(mapWidgetId, mapMutableState)
    const layerIds1 = listItems1.map(listItem => listItem.layerId)
    let listItems2 = this.getListItemsByRemoveableLayerIdsInfo(mapMutableState)
    // one layerId maybe both in showOnMapDatas/addToMapDatas and removeableLayerIdsInfo, so need to remove repeat items
    listItems2 = listItems2.filter(listItem => !layerIds1.includes(listItem.layerId))
    const result = listItems1.concat(listItems2)
    return result
  }

  /**
   * Only show layers that crated by data actions. The layers maybe crated by showOnMap data action or addToMap data action.
   * @param mapWidgetId
   * @returns
   */
  getListItemsByAddOrShowOnMapDatas (mapWidgetId: string, mapMutableState: MapMutableState): ListItem[] {
    const showOnMapDatas: ShowOnMapDatas = mapMutableState?.showOnMapDatas || {}
    const addToMapDatas: AddToMapDatas = mapMutableState?.addToMapDatas || {}

    const showOnMapDataInfos = Object.entries(showOnMapDatas).map(entry => {
      return {
        id: entry[0],
        title: entry[1].title,
        jimuMapViewId: entry[1].jimuMapViewId,
        mapWidgetId: entry[1].mapWidgetId,
        needToRemove: true,
        type: entry[1].type
      }
    })

    const addToMapDataInfos = Object.entries(addToMapDatas).map(entry => {
      return {
        id: entry[0],
        title: entry[1].title,
        jimuMapViewId: entry[1].jimuMapViewId,
        mapWidgetId: entry[1].mapWidgetId,
        needToRemove: entry[1].dataChangeType === DataChangeType.Created,
        type: entry[1].type
      }
    })

    const dataActionInfos = showOnMapDataInfos.concat(addToMapDataInfos).filter(dataInfo => {
      // There is no jimuMapViewId while generating the action data if the map widget hasn't been loaded in the another page/view,
      // use a default jimuMapViewId to show data.
      let jimuMapViewId = dataInfo.jimuMapViewId
      if (!jimuMapViewId && dataInfo.mapWidgetId === mapWidgetId) {
        const jimuMapViewsInfo: ImmutableObject<{ [jimuMapViewId: string]: JimuMapViewInfo }> = getAppStore().getState().jimuMapViewsInfo
        jimuMapViewId = Object.keys(jimuMapViewsInfo || {}).find(viewId => jimuMapViewsInfo[viewId].mapWidgetId === mapWidgetId)
      }

      return (jimuMapViewId === this.props.jimuMapView.id && dataInfo.type === ActionType.DataAction && dataInfo.needToRemove)
    })

    const dataActionListItems: ListItem[] = dataActionInfos.map((item) => {
      const listItem: ListItem = {
        layerId: item.id,
        title: item.title,
        isAction: true
      }

      return listItem
    })

    return dataActionListItems
  }

  /**
   * Get list items by JimuLayerView.removeableByMapTool.
   * @param mutableState
   */
  getListItemsByRemoveableLayerIdsInfo (mutableState: MapMutableState): ListItem[] {
    const listItems: ListItem[] = []
    const removeableLayerIdsInfo = mutableState?.removeableLayerIdsInfo || {}
    const jimuMapView = this.props.jimuMapView

    if (jimuMapView) {
      const map = jimuMapView.view?.map

      if (map) {
        const removeableLayerIds = removeableLayerIdsInfo[jimuMapView.id] || []

        removeableLayerIds.forEach(layerId => {
          const layer = map.findLayerById(layerId)

          if (layer) {
            const title = layer.title || layerId
            const listItem: ListItem = {
              layerId,
              title,
              isAction: false
            }

            listItems.push(listItem)
          }
        })
      }
    }

    return listItems
  }

  onIconClick = () => {}

  onDropDownToggle = () => {
    this.setState({ isOpen: !this.state.isOpen })
  }

  createDropdownItem (listItem: ListItem, mapWidgetId: string, index: number) {
    const key = `${listItem.layerId}-index-${index}`

    return (
      <DropdownItem
        key={key}
        header={false}
        onClick={() => { this.onItemClick(listItem, mapWidgetId) }}
      >
        {listItem.title}
      </DropdownItem>
    )
  }

  onItemClick = (listItem: ListItem, mapWidgetId: string) => {
    this.setState({ isOpen: false })

    const layerId = listItem.layerId

    const mutableState = MutableStoreManager.getInstance().getStateValue([mapWidgetId]) || {}

    if (listItem.isAction) {
      // this item comes from ShowOnMap/AddToMap actions, remove it by mutableStoreManager.updateStateValue().
      const actionDataId = layerId
      const showOnMapDatas = mutableState.showOnMapDatas
      const addToMapDatas = mutableState.addToMapDatas

      if (showOnMapDatas) {
        delete showOnMapDatas[actionDataId]
        MutableStoreManager.getInstance().updateStateValue(mapWidgetId, 'showOnMapDatas', showOnMapDatas)
      }

      if (addToMapDatas && addToMapDatas[actionDataId]?.dataChangeType === DataChangeType.Created) {
        MutableStoreManager.getInstance().updateStateValue(mapWidgetId, `addToMapDatas.${actionDataId}.dataChangeType`, DataChangeType.Remove)
      }
    } else {
      // this item comes from JimuLayerView.removeableByMapTool

      // just remove the layer from map, don't need to update removeableLayerIdsInfo (only update removeableLayerIdsInfo when calling JimuLayerView.setRemoveableByMapTool())
      const map = this.props.jimuMapView?.view?.map

      if (map) {
        const layer = map.findLayerById(layerId)

        if (layer) {
          map.remove(layer)
        }
      }
    }
  }

  getExpandPanel (): JSX.Element {
    return (
      <MultiSourceMapContext.Consumer>
        {({ mapWidgetId }) => (
          this.getContent(mapWidgetId)
        )}
      </MultiSourceMapContext.Consumer>
    )
  }

  getContent = (mapWidgetId: string) => {
    const listItems = this.getListItems(mapWidgetId)
    const dropdownItems = listItems.map((listItem, index) => this.createDropdownItem(listItem, mapWidgetId, index))

    if (dropdownItems.length > 0) {
      return (
        <div css={this.getStyle()} title={this.getTitle()}>
          <Dropdown
            direction='down'
            size='sm'
            toggle={this.onDropDownToggle}
            isOpen={this.state.isOpen}
          >
            <DropdownButton icon arrow={false} size='sm' type='default'>
              <Icon size={16} className='exbmap-ui-tool-icon' icon={this.getIcon().icon} />
            </DropdownButton>
            <DropdownMenu>
              {dropdownItems}
            </DropdownMenu>
          </Dropdown>
        </div>
      )
    }

    return null
  }
}
