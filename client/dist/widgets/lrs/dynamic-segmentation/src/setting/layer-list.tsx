/** @jsx jsx */
import {
  React,
  hooks,
  jsx,
  type IMThemeVariables,
  DataSourceManager,
  classNames,
  polished,
  css,
  type UseDataSource,
  Immutable,
  urlUtils,
  type SceneLayerDataSource,
  SessionManager,
  type IntlShape
} from 'jimu-core'
import {
  type EventInfo,
  type LrsLayer,
  LrsLayerType,
  type NetworkInfo,
  getFeatureLayer,
  requestService,
  formatMessage,
  type AttributeSets,
  errorMessageDelay,
  getLrsRequestUrl,
  getUniqueUrls,
  getMapAllLayers,
  getNetworkInfoFromResults,
  getEventInfoFromResults,
  getAttributeSets,
  isParentNetworkAvailable
} from 'widgets/shared-code/lrs'
import { type ImmutableArray, type ImmutableObject } from 'seamless-immutable'
import defaultMessages from './translations/default'
import { type FeatureLayerDataSource } from 'jimu-arcgis/arcgis-data-source'
import { type CommandActionDataType, List, TreeItemActionType, type TreeItemType, type TreeItemsType } from 'jimu-ui/basic/list-tree'
import { MapWidgetSelector, SettingRow, SettingSection, SidePopper } from 'jimu-ui/advanced/setting-components'
import { Fragment } from 'react'
import { WarningOutlined } from 'jimu-icons/outlined/suggested/warning'
import { ClickOutlined } from 'jimu-icons/outlined/application/click'
import { Alert, Button } from 'jimu-ui'
import { LayerConfig } from './layer-config'
const IconClose = require('jimu-icons/svg/outlined/editor/close.svg')

interface Props {
  intl: IntlShape
  widgetId: string
  layers?: ImmutableArray<LrsLayer>
  mapWidgetIds: ImmutableArray<string>
  portalUrl: string
  attributeSets: ImmutableObject<AttributeSets>
  lineAttributeSet: string
  pointAttributeSet: string
  runningQuery: boolean
  theme: IMThemeVariables
  onLayersAdded: (item: ImmutableArray<LrsLayer> | any, dsUpdateRequired?: boolean) => void
  onLayerRemoved: (index: number) => void
  onClearAll: () => void
  onLayerChanged: (index: number, item: ImmutableObject<LrsLayer>, dsUpdateRequired?: boolean) => void
  onLayerOrderChanged: (layers: LrsLayer[]) => void
  onMapWidgetedChanged: (mapWidgetIds: string[]) => void
  onAttributeSetsChanged: (attributeSets: AttributeSets) => void
  setRunningQuery: (val: boolean) => void
}

export function LrsLayerList (props: Props) {
  const {
    runningQuery,
    intl,
    widgetId,
    layers = [],
    mapWidgetIds,
    portalUrl,
    attributeSets,
    lineAttributeSet,
    pointAttributeSet,
    theme,
    onLayersAdded,
    onLayerRemoved,
    onClearAll,
    onLayerChanged,
    onLayerOrderChanged,
    onMapWidgetedChanged,
    onAttributeSetsChanged,
    setRunningQuery
  } = props
  const sidePopperTrigger = React.useRef<HTMLDivElement>(null)
  const [noLrsLayers, setNoLrsLayers] = React.useState<boolean>(false)
  const [noNetworkLayers, setNoNetworkLayers] = React.useState<boolean>(false)
  const [noEventLayers, setNoEventLayers] = React.useState<boolean>(false)
  const [multipleServices, setMultipleServices] = React.useState<boolean>(false)
  const [selectedIndex, setSelectedIndex] = React.useState<number>(-1)
  const [noMapSelected, setNoMapSelected] = React.useState<boolean>(false)
  const getI18nMessage = hooks.useTranslation(defaultMessages)
  let isRunningQuery = runningQuery

  const importAll = () => {
    // Reset the error messages.
    setNoLrsLayers(false)
    setMultipleServices(false)
    setNoNetworkLayers(false)
    setNoMapSelected(false)

    if (mapWidgetIds?.[0] === undefined) {
      setNoMapSelected(true)
      setTimeout(() => {
        setNoMapSelected(false)
      }, errorMessageDelay)
    } else {
      // Get a list of unique urls
      const urls = getUniqueUrls(mapWidgetIds?.[0])
      if (urls.length > 1) {
        // Display multiple services error
        setMultipleServices(true)
        setTimeout(() => {
          setMultipleServices(false)
        }, errorMessageDelay)
      } else if (urls.length > 0) {
        if (!isRunningQuery) {
          FindLrs(urls, 0)
        }
      } else {
        setNoLrsLayers(true)
        setTimeout(() => {
          setNoLrsLayers(false)
        }, errorMessageDelay)
      }
    }
  }

  const FindLrs = async (urls: string[], index: number): Promise<boolean> => {
    isRunningQuery = true
    setRunningQuery(true)
    let returnVal = false
    const requestURL = urls[index]
    let params = null
    const session = SessionManager.getInstance().getSessionByUrl(portalUrl)
    const currentToken = session && session.token ? session.token : ''

    if (currentToken) {
      params = { f: 'json', token: currentToken }
    } else {
      params = { f: 'json' }
    }

    returnVal = await requestService({
      method: 'GET',
      url: requestURL,
      params: params
    })
      .then((result: any) => {
        // eslint-disable-next-line no-prototype-builtins
        if (result.hasOwnProperty('lrs')) {
          PopulateLrsLayers(result, requestURL)
          PopulateAttributeSets(requestURL)
        } else {
          setNoLrsLayers(true)
          setTimeout(() => {
            setNoLrsLayers(false)
          }, errorMessageDelay)
          return false
        }
      })
      .catch((e: any) => {
        return false
      })
    return returnVal
  }

  const PopulateLrsLayers = (lrsJson: any, url: string) => {
    const useMapWidget = mapWidgetIds?.[0]
    const allLayers = getMapAllLayers(useMapWidget)
    const useDataSources = []
    const allLayerIds = []
    const networkIds = []
    const eventIds = []
    const eventLayers = []

    const allLayersAsFeatureLayerDS: FeatureLayerDataSource[] = []
    allLayers.forEach((layer => {
      allLayersAsFeatureLayerDS.push(layer as FeatureLayerDataSource)
    }))

    // Use the layer id we got from the LRServer REST call
    // to find the DS in the map widget.
    lrsJson.networkLayers.forEach((item) => {
      if (allLayersAsFeatureLayerDS.findIndex(layer => layer.layerId === item.id.toString()) > -1) {
        networkIds.push(item.id)
        allLayerIds.push(item.id)
      }
    })

    lrsJson.eventLayers.forEach((item) => {
      if (allLayersAsFeatureLayerDS.findIndex(layer => layer.layerId === item.id.toString()) > -1) {
        eventIds.push(item.id)
        allLayerIds.push(item.id)

        if (item.type === 'esriLRSPointEventLayer' || item.type === 'esriLRSLinearEventLayer') {
          eventLayers.push(item)
        }
      }
    })

    allLayers.forEach((layer) => {
      const haveUrl = layer?.getDataSourceJson()?.url
      const layerDefinition = (layer as FeatureLayerDataSource)?.getLayerDefinition()
      // Check if we already load this layer.
      const find1 = layers.findIndex((config) => config.id === layer.id) === -1
      // Check if this layer is an LRS layer.
      const find2 = allLayerIds.findIndex((id) => id === layerDefinition.id) > -1
      if (haveUrl && find1 && find2) {
        useDataSources.push({
          dataSourceId: layer.id,
          mainDataSourceId: layer.id,
          dataViewId: layer.dataViewId,
          rootDataSourceId: layer.getRootDataSource()?.id
        })
      }
    })

    if (layers.length === 0 && useDataSources.length === 0) {
      // No LRS networks found.
      setNoLrsLayers(true)
      setTimeout(() => {
        setNoLrsLayers(false)
      }, errorMessageDelay)
    } else if (networkIds.length === 0) {
      // No network layers found.
      setNoNetworkLayers(true)
      setTimeout(() => {
        setNoNetworkLayers(false)
      }, errorMessageDelay)
    } else if (eventLayers.length === 0) {
      // No Point event layers found.
      setNoEventLayers(true)
      setTimeout(() => {
        setNoEventLayers(false)
      }, errorMessageDelay)
    } else if (useDataSources.length > 0) {
      // Import the network settings.
      importAllLayersConfigSave(useDataSources, networkIds, eventIds)
    }
  }

  const importAllLayersConfigSave = async (
    useDataSources: UseDataSource[],
    networkIds: number[],
    eventIds: number[]
  ) => {
    if (useDataSources?.length === 0) return
    const loopAddConfigs = async () => {
      let layerItems = []
      const promises = []
      useDataSources.forEach((useDataSource) => {
        promises.push(
          DataSourceManager.getInstance()
            .createDataSourceByUseDataSource(Immutable(useDataSource))
            .then(async (originDs: FeatureLayerDataSource | SceneLayerDataSource) => {
              const layerDefinition = originDs?.getLayerDefinition()

              const isNetwork = networkIds.findIndex((id) => id === layerDefinition.id) > -1
              const isEvent = eventIds.findIndex((id) => id === layerDefinition.id) > -1

              const layerUrl = originDs?.url
              const lrsMainUrl = getLrsRequestUrl(layerUrl)
              let lrsFeatureUrl = ''
              if (isNetwork) {
                lrsFeatureUrl = lrsMainUrl + '/networkLayers/' + layerDefinition.id
              } else if (isEvent) {
                lrsFeatureUrl = lrsMainUrl + '/eventLayers/' + layerDefinition.id
              }

              if (lrsFeatureUrl.length > 0) {
                await CreateLrsLayer(originDs, useDataSource, lrsFeatureUrl, lrsMainUrl, isNetwork, isEvent).then(
                  (networkResults: ImmutableObject<LrsLayer>) => {
                    if (networkResults) {
                      layerItems = layerItems.concat([Immutable(networkResults)])
                    }
                    return layerItems
                  }
                )
              }
            })
        )
      })
      await Promise.all(promises)
      return layerItems
    }
    const layerItems = await loopAddConfigs()
    onLayersAdded(layerItems)
  }

  const CreateLrsLayer = (
    originDs: FeatureLayerDataSource | SceneLayerDataSource,
    useDataSource: UseDataSource,
    lrsFeatureUrl: string,
    lrsMainUrl: string,
    isNetwork: boolean,
    isEvent: boolean
  ): Promise< ImmutableObject<LrsLayer>> => {
    return getFeatureLayer(originDs).then((featureLayer) => {
      const session = SessionManager.getInstance().getSessionByUrl(portalUrl)
      const currentToken = session && session.token ? session.token : ''

      let params = null
      if (currentToken) {
        params = { f: 'json', token: currentToken }
      } else {
        params = { f: 'json' }
      }

      return new Promise((resolve, reject) => {
        requestService({ method: 'POST', url: lrsFeatureUrl, params: params })
          .then((result: any) => {
            if (!result) {
              resolve(null)
            }

            const type = result.type as string
            if (type === 'esriLRSNetworkLayer' ||
              type === 'esriLRSPointEventLayer' ||
              type === 'esriLRSLinearEventLayer') {
              let networkInfo: NetworkInfo = {} as NetworkInfo
              let eventInfo: EventInfo = {} as EventInfo

              // Get all fields from original datasource.
              const allFields = originDs?.getSchema()

              const serviceLayerId = result.id as number
              let layerType = LrsLayerType.nonLrs
              if (isNetwork && !result.isDerived) {
                layerType = LrsLayerType.network
                networkInfo = getNetworkInfoFromResults(result, lrsFeatureUrl, allFields)
              } else if (isEvent) {
                layerType = LrsLayerType.event
                eventInfo = getEventInfoFromResults(result, lrsFeatureUrl, allFields, featureLayer)
              }

              const displayField = featureLayer?.displayField

              // Create the network object.
              const layerInfo: LrsLayer = {
                id: originDs.id,
                serviceId: serviceLayerId,
                name: originDs.getLabel(),
                originName: originDs.getLayerDefinition().name,
                lrsUrl: lrsMainUrl,
                useDataSource: useDataSource as any,
                layerType: layerType,
                networkInfo: networkInfo || undefined,
                eventInfo: eventInfo || undefined,
                intersectionInfo: undefined,
                useFieldAlias: true,
                displayField: displayField
              }
              const lrsLayer: ImmutableObject<LrsLayer> = Immutable(Object.assign({}, layerInfo, { layerInfo }))
              resolve(lrsLayer)
            } else {
              resolve(null)
            }
          })
      })
    })
  }

  const PopulateAttributeSets = async (url: string) => {
    getAttributeSets(url, portalUrl).then((attributeSets: AttributeSets) => {
      onAttributeSetsChanged(attributeSets)
    }).catch((e) => {
      return false
    })
  }

  const onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    onMapWidgetedChanged(useMapWidgetIds)
  }

  const clearSelection = React.useCallback(() => {
    setSelectedIndex(-1)
  }, [])

  const onShowNetworkPanel = (index: number) => {
    if (index === selectedIndex) {
      setSelectedIndex(-1)
    } else {
      setSelectedIndex(index)
    }
  }

  const style = css`
    border-bottom: 1px 
    solid var(--ref-palette-neutral-700);
        
    &.h-100 > 
    .jimu-widget-setting--section {
      border-bottom: none;
    }

    .error-tips {
      font-style: italic;
      font-size: 12px;
      color: var(--ref-palette-neutral-1000);
      margin-top: 5px;
      .display-error-tips {
        width: calc(100% - 20px);
        margin: 0 4px;
        color: ${theme.sys.color.error.main};
      }
    }

    .empty-placeholder {
      display: flex;
      flex-flow: column;
      justify-content: center;
      height: calc(100% - 255px);
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
  `

  // Actions for list items
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

  return (
    <div
      ref={sidePopperTrigger}
      css={style}
      className={classNames('d-flex flex-column', { 'h-100': layers.length === 0 })}
    >
      <SettingSection className="border-0">
        <Fragment>
          <SettingRow label={formatMessage(intl, 'selectMap')} />
          <SettingRow>
            <MapWidgetSelector
              onSelect={onMapWidgetSelected}
              useMapWidgetIds={mapWidgetIds}
            />
          </SettingRow>
          <SettingRow>
            <Button
              role={'button'}
              className={'w-100 text-dark'}
              type={'primary'}
              onClick={importAll}
              title={formatMessage(intl, 'loadLayers')}
              aria-label={formatMessage(intl, 'loadLayers')}
            >
              {formatMessage(intl, 'loadLayers')}
            </Button>
          </SettingRow>
          {layers && layers.length > 0 && (
            <SettingRow>
              <Button
                role={'button'}
                className={'w-100 text-dark'}
                type={'primary'}
                onClick={onClearAll}
                title={formatMessage(intl, 'clearLayers')}
                aria-label={formatMessage(intl, 'clearLayers')}
              >
                {formatMessage(intl, 'clearLayers')}
              </Button>
            </SettingRow>
          )}
          {noLrsLayers && (
            <div className="text-break error-tips d-flex align-items-center">
              <Fragment>
                <WarningOutlined color={theme.sys.color.error.main} />
                <div className="display-error-tips">
                  {formatMessage(intl, 'noLrsLayersTips')}
                </div>
              </Fragment>
            </div>
          )}
          {noMapSelected && (
            <div className="text-break error-tips d-flex align-items-center">
              <Fragment>
                <WarningOutlined color={theme.sys.color.error.main} />
                <div className="display-error-tips">
                  {formatMessage(intl, 'noMapSelectedTips')}
                </div>
              </Fragment>
            </div>
          )}
          {noNetworkLayers && (
            <div className="text-break error-tips d-flex align-items-center">
              <Fragment>
                <WarningOutlined color={theme.sys.color.error.main} />
                <div className="display-error-tips">
                  {formatMessage(intl, 'noNetworkLayersTips')}
                </div>
              </Fragment>
            </div>
          )}
          {noEventLayers && (
            <div className="text-break error-tips d-flex align-items-center">
              <Fragment>
                <WarningOutlined color={theme.sys.color.error.main} />
                <div className="display-error-tips">
                  {getI18nMessage('noEventLayersTips')}
                </div>
              </Fragment>
            </div>
          )}
          {multipleServices && (
            <div className="text-break error-tips d-flex align-items-center">
              <Fragment>
                <WarningOutlined color={theme.sys.color.error.main} />
                <div className="display-error-tips">
                  {formatMessage(intl, 'multipleServicesTips')}
                </div>
              </Fragment>
            </div>
          )}
        </Fragment>
      </SettingSection>

      <SettingSection className={classNames('pt-0 border-0', { 'h-100': layers.length === 0 })}>
        <SettingRow>
          <div className="setting-ui-unit-list w-100">
            <List
              className="setting-ui-unit-list-exsiting"
              itemsJson={layers.map((item, index) => ({
                itemStateDetailContent: item,
                itemKey: `${index}`,
                itemStateChecked: selectedIndex === index,
                itemStateTitle: item.name,
                itemStateCommands: [
                  {
                    label: formatMessage(intl, 'removeLayer'),
                    iconProps: () => ({ icon: IconClose, size: 12 }),
                    action: ({ data }: CommandActionDataType) => {
                      const { itemJsons: [currentItemJson] } = data
                      const index = +currentItemJson.itemKey
                      if (index === selectedIndex) { clearSelection() }
                      onLayerRemoved(index)
                    }
                  }
                ]
              })) as TreeItemType[]}
              renderOverrideItemDetailToggle={(actionData, refComponent) => {
                const { itemJsons } = refComponent.props
                const [currentItemJson] = itemJsons
                const accessible = isParentNetworkAvailable(+currentItemJson.itemKey, layers as ImmutableArray<LrsLayer>)
                return !accessible
                  ? <Alert
                    buttonType='tertiary'
                    form='tooltip'
                    size='small'
                    type='error'
                    text={formatMessage(intl, 'missingParentNetwork')}
                  />
                  : ''
              }}
              dndEnabled
              onUpdateItem={(actionData, refComponent) => {
                const { itemJsons } = refComponent.props
                const [, parentItemJson] = itemJsons as [TreeItemType, TreeItemsType]
                onLayerOrderChanged(parentItemJson.map(i => i.itemStateDetailContent))
              }}
              onClickItemBody={(actionData, refComponent) => {
                const { itemJsons: [currentItemJson] } = refComponent.props
                onShowNetworkPanel(+currentItemJson.itemKey)
              }}
              {...advancedActionMap}
            />
            {layers.length === selectedIndex && (
              <List
                className="setting-ui-unit-list-new"
                css={css`.jimu-tree-item__detail-toggle { display: none !important; }`}
                itemsJson={[{
                  name: '......'
                }
                ].map((item) => ({
                  itemStateDetailContent: item,
                  itemKey: `${selectedIndex}`,
                  itemStateChecked: true,
                  itemStateTitle: item.name,
                  itemStateCommands: []
                }))}
                dndEnabled={false}
                {...advancedActionMap}
              />
            )}
          </div>
        </SettingRow>
         {layers.length === 0 && (
            <div className="empty-placeholder w-100 h-100">
              <div className="empty-placeholder-inner">
                <div className="empty-placeholder-icon">
                  <ClickOutlined size={48} />
                </div>
                <div
                  className="empty-placeholder-text"
                  id="edit-blank-msg"
                  dangerouslySetInnerHTML={{
                    __html: getI18nMessage('blankStatus')
                  }}
                />
              </div>
            </div>
         )}
         <SidePopper
            isOpen={selectedIndex >= 0 && !urlUtils.getAppIdPageIdFromUrl().pageId}
            toggle={clearSelection}
            position="right"
            trigger={sidePopperTrigger?.current}
            title={getI18nMessage('layerConfig')}
          >
            <LayerConfig
              widgetId={widgetId}
              index={selectedIndex}
              total={layers.length}
              lrsLayer={layers[selectedIndex]}
              attributeSets={attributeSets}
              lineAttributeSet={lineAttributeSet}
              pointAttributeSet={pointAttributeSet}
              onLayerChanged={onLayerChanged}
            />
        </SidePopper>
      </SettingSection>
    </div>
  )
}
