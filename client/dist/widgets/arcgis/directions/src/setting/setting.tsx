/** @jsx jsx */
import { jsx, React, css, polished, lodash, type ImmutableArray, Immutable, DataSourceTypes, type DataSourceJson, classNames, type UseUtility, SupportedUtilityType, loadArcGISJSAPIModules, hooks, getAppStore, UtilityManager } from 'jimu-core'
import { defaultMessages as jimuUIMessages, Switch } from 'jimu-ui'
import { type AllWidgetSettingProps } from 'jimu-for-builder'
import { MapWidgetSelector, SettingRow, SettingSection, SearchGeneralSetting, SearchDataSetting, SearchSuggestionSetting, SearchDataType, type IMSearchSuggestionConfig, type SearchDataConfig, type SearchSuggestionConfig, type SearchGeocodeDataConfig } from 'jimu-ui/advanced/setting-components'
import { addNewUtility, extractService, UtilitySelector } from 'jimu-ui/advanced/utility-selector'
import { ClickOutlined } from 'jimu-icons/outlined/application/click'

import defaultMessages from './translations/default'
import { type RouteConfig, type IMConfig } from '../config'
import { DEFAULT_ROUTE_URL, MAX_SUGGESTIONS } from '../constants'
import { getDirectionPointOutputDsId, getDirectionLineOutputDsId, getRouteOutputDsId, getStopOutputDsId, convertJSAPIFieldsToJimuFields } from '../utils'

const { useMemo, useEffect, useState } = React
const DEFAULT_SEARCH_SUGGESTION_SETTINGS = {
  maxSuggestions: MAX_SUGGESTIONS
} as SearchSuggestionConfig
const supportedUtilityTypes = [SupportedUtilityType.Routing]

const Setting = (props: AllWidgetSettingProps<IMConfig>) => {
  const { onSettingChange, id, config, useMapWidgetIds, useUtilities, portalUrl } = props
  const translate = hooks.useTranslation(defaultMessages, jimuUIMessages)
  const routeConfig = config?.routeConfig
  const searchDataConfig = config.searchConfig?.dataConfig
  const searchGeneralConfig = config.searchConfig?.generalConfig
  const searchSuggestionConfig = useMemo(() => (Immutable(DEFAULT_SEARCH_SUGGESTION_SETTINGS).merge(config.searchConfig?.suggestionConfig || {})), [config.searchConfig?.suggestionConfig]) as IMSearchSuggestionConfig

  const [defaultRouteUtilityId, setDefaultRouteUtilityId] = useState(null)
  const [isDefaultRouteUsed, setIsDefaultRouteUsed] = useState(false)

  const onMapWidgetSelected = async (ids: string[]) => {
    const outputDsJsons = await getOutputDataSourceJsons(id, ids, translate)
    onSettingChange({
      id: id,
      useMapWidgetIds: ids
    }, outputDsJsons)
  }

  const onSearchDataSettingsChange = (settings: ImmutableArray<SearchDataConfig>) => {
    if (!lodash.isDeepEqual(settings, searchDataConfig)) {
      onSettingChange({
        id: id,
        config: config.setIn(['searchConfig', 'dataConfig'], settings),
        useUtilities: getUsedUtilities(routeConfig?.useUtility, settings?.map(c => c.useUtility)?.asMutable())
      })
    }
  }

  const onSearchGeneralSettingsChange = (hint: string) => {
    if (typeof hint === 'string' && hint !== searchGeneralConfig?.hint) {
      onSettingChange({
        id: id,
        config: config.setIn(['searchConfig', 'generalConfig'], { hint })
      })
    }
  }

  const onSearchSuggestionSettingsChange = (settings: IMSearchSuggestionConfig) => {
    if (!lodash.isDeepEqual(settings, searchSuggestionConfig)) {
      onSettingChange({
        id: id,
        config: config.setIn(['searchConfig', 'suggestionConfig'], settings)
      })
    }
  }

  const onRouteUtilityChange = (utilities: ImmutableArray<UseUtility>) => {
    if (utilities?.[0]?.utilityId !== routeConfig?.useUtility?.utilityId) {
      onSettingChange({
        id: id,
        config: config.setIn(['routeConfig', 'useUtility'], utilities?.[0]),
        useUtilities: getUsedUtilities(utilities?.[0], config.searchConfig?.dataConfig?.map(c => c.useUtility)?.asMutable())
      })
    }
  }

  const onShowRuntimeLayersChange = (event) => {
    const showRuntimeLayers = event.target.checked
    onSettingChange({
      id: id,
      config: config.set('showRuntimeLayers', showRuntimeLayers)
    })
  }

  const hasMap = useMemo(() => useMapWidgetIds?.length > 0, [useMapWidgetIds])

  const ariaDescId = `${id}-desc`

  useEffect(() => {
    const validSearchDataConfig = searchDataConfig && getValidSearchDataConfig(searchDataConfig, useUtilities)
    const validRouteConfig = routeConfig && getValidRouteConfig(routeConfig, useUtilities)

    if (!lodash.isDeepEqual(validSearchDataConfig, searchDataConfig) || !lodash.isDeepEqual(validRouteConfig, routeConfig)) {
      onSettingChange({
        id: id,
        config: config.setIn(['searchConfig', 'dataConfig'], validSearchDataConfig).setIn(['routeConfig'], validRouteConfig),
        useUtilities: getUsedUtilities(validRouteConfig?.useUtility, validSearchDataConfig?.map(c => c.useUtility)?.asMutable())
      })
    }
  }, [config, id, onSettingChange, routeConfig, searchDataConfig, useUtilities])

  useEffect(() => {
    // Add org route utility if it is not added
    if (defaultRouteUtilityId) {
      return
    }
    const routingUtility = getAllRoutingUtility(translate)
    const utility = routingUtility[0]
    addNewUtility(utility)
    const uid = UtilityManager.getInstance().getIdOfOrgUtility(utility.name, utility.url, utility.index, utility.label)
    if (!defaultRouteUtilityId && uid) {
      setDefaultRouteUtilityId(uid)
    }
  }, [defaultRouteUtilityId, translate])

  useEffect(() => {
    // Use added default route utility if no route utility is chosen
    if (defaultRouteUtilityId && !config?.routeConfig && !isDefaultRouteUsed) {
      const useUtility = {
        utilityId: defaultRouteUtilityId
      }
      onSettingChange({
        id: id,
        config: config.setIn(['routeConfig', 'useUtility'], useUtility),
        useUtilities: getUsedUtilities(useUtility, config.searchConfig?.dataConfig?.map(c => c.useUtility)?.asMutable())
      })
      setIsDefaultRouteUsed(true)
    }
  }, [config, isDefaultRouteUsed, defaultRouteUtilityId, id, onSettingChange, translate])

  return (
    <div className='widget-setting-directions jimu-widget-setting' css={style}>
      <SettingSection title={translate('selectMapWidget')} className={classNames({ 'border-0': !hasMap })}>
        <SettingRow>
          <MapWidgetSelector onSelect={onMapWidgetSelected} useMapWidgetIds={useMapWidgetIds} />
        </SettingRow>
      </SettingSection>
      {
        hasMap
          ? <div>
            <SettingSection role='group' aria-label={translate('routeSettings')} title={translate('routeSettings')}>
              <SettingRow flow='wrap' label={translate('routeUrl')}>
                <UtilitySelector
                  useUtilities={Immutable(routeConfig?.useUtility && useUtilities?.some(u => routeConfig.useUtility.utilityId === u.utilityId) ? [routeConfig.useUtility] : [])}
                  onChange={onRouteUtilityChange}
                  showRemove
                  closePopupOnSelect
                  types={supportedUtilityTypes}
                  aria-describedby={ariaDescId}
                />
              </SettingRow>
              <SettingRow className='mt-0'>
                <i className='text-break example-url' id={ariaDescId}>
                  {translate('exampleUrl', { url: `${DEFAULT_ROUTE_URL}` })}
                </i>
              </SettingRow>
            </SettingSection>
            <SettingSection role='group' aria-label={translate('searchSettings')} title={translate('searchSettings')} className='search-settings'>
              <SearchDataSetting id={id} datasourceConfig={searchDataConfig as unknown as ImmutableArray<SearchDataConfig>}
                createOutputDs={false} portalUrl={portalUrl} hideIconSetting={true}
                searchDataSettingType={SearchDataType.GeocodeService} onSettingChange={onSearchDataSettingsChange}
                autoSelectAllOrgGeocodeService
              />
              <SearchGeneralSetting id={id} hint={searchGeneralConfig?.hint} onSettingChange={onSearchGeneralSettingsChange} />
              <SearchSuggestionSetting id={id} settingConfig={searchSuggestionConfig} onSettingChange={onSearchSuggestionSettingsChange} hideRecentSearchSetting={true} />
            </SettingSection>
            <SettingSection role='group' aria-label={translate('generalSettings')} title={translate('generalSettings')} className='general-settings'>
              <SettingRow label={translate('showRuntimeLayers')}>
                <Switch
                  checked={config?.showRuntimeLayers ?? true}
                  onChange={onShowRuntimeLayersChange}
                />
              </SettingRow>
            </SettingSection>
          </div>
          : <div className='d-flex justify-content-center align-items-center placeholder-container'>
              <div className='text-center'>
                <ClickOutlined size={48} className='d-inline-block placeholder-icon mb-2' />
                <p className='placeholder-hint'>{translate('selectMapHint')}</p>
              </div>
            </div>
      }
    </div>
  )
}

export default Setting

const style = css`
.route-url-input{
  min-height: ${polished.rem(100)}
}
.example-url{
  font-size: ${polished.rem(12)};
  color: var(--ref-palette-neutral-1000);
}
.warning-icon{
  color: var(--sys-color-error-main);
}
.warning-hint{
  width: calc(100% - 20px);
  margin: 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--sys-color-error-main);
}
.placeholder-container{
  height: calc(100% - 100px);
  .placeholder-hint{
    font-size: ${polished.rem(14)};
    font-weight: 500;
    color: var(--ref-palette-neutral-1000);
    max-width: ${polished.rem(160)};
  }
  .placeholder-icon{
    color: var(--ref-palette-neutral-800);
  }
}
.search-settings{
  >div>div {
    padding-left: 0 !important;
    padding-right: 0 !important;
    padding-top: 0 !important;
    border: 0 !important;
  }
}
`

async function getOutputDataSourceJsons (widgetId: string, mapWidgetIds: string[], translate: (id: string) => string): Promise<DataSourceJson[]> {
  // If do not have used map widget, won't generate any output data sources.
  if (!mapWidgetIds || mapWidgetIds.length === 0) {
    return Promise.resolve([])
  }
  try {
    const [Stop, DirectionPoint, DirectionLine, RouteInfo] = await loadArcGISJSAPIModules(['esri/rest/support/Stop', 'esri/rest/support/DirectionPoint', 'esri/rest/support/DirectionLine', 'esri/rest/support/RouteInfo'])
    return [
      {
        id: getStopOutputDsId(widgetId),
        label: translate('outputStops'),
        type: DataSourceTypes.FeatureLayer,
        isOutputFromWidget: true,
        geometryType: 'esriGeometryPoint',
        schema: {
          idField: Stop.fields.find(f => f.type === 'esriFieldTypeOID')?.name || '__OBJECTID',
          fields: { ...convertJSAPIFieldsToJimuFields(Stop.fields) }
        }
      },
      {
        id: getDirectionPointOutputDsId(widgetId),
        label: translate('outputDirectionPoints'),
        type: DataSourceTypes.FeatureLayer,
        isOutputFromWidget: true,
        geometryType: 'esriGeometryPoint',
        schema: {
          idField: DirectionPoint.fields.find(f => f.type === 'esriFieldTypeOID')?.name || '__OBJECTID',
          fields: { ...convertJSAPIFieldsToJimuFields(DirectionPoint.fields) }
        }
      },
      {
        id: getDirectionLineOutputDsId(widgetId),
        label: translate('outputDirectionLines'),
        type: DataSourceTypes.FeatureLayer,
        isOutputFromWidget: true,
        geometryType: 'esriGeometryPolyline',
        schema: {
          idField: DirectionLine.fields.find(f => f.type === 'esriFieldTypeOID')?.name || '__OBJECTID',
          fields: { ...convertJSAPIFieldsToJimuFields(DirectionLine.fields) }
        }
      },
      {
        id: getRouteOutputDsId(widgetId),
        label: translate('outputRoute'),
        type: DataSourceTypes.FeatureLayer,
        isOutputFromWidget: true,
        geometryType: 'esriGeometryPolyline',
        schema: {
          idField: RouteInfo.fields.find(f => f.type === 'esriFieldTypeOID')?.name || '__OBJECTID',
          fields: { ...convertJSAPIFieldsToJimuFields(RouteInfo.fields) }
        }
      }
    ]
  } catch (err) {
    console.warn('Failed to create output data source in directions widget. ', err)
    return Promise.resolve([])
  }
}

function getUsedUtilities (routeUtility: UseUtility, searchUtilities: UseUtility[]): UseUtility[] {
  return [routeUtility].concat(searchUtilities).filter(u => !!u)
}

function getValidSearchDataConfig (searchDataConfig: ImmutableArray<SearchGeocodeDataConfig>, useUtilities: ImmutableArray<UseUtility>) {
  return searchDataConfig.filter(searchConfig => {
    return useUtilities.some(useUtility => {
      return useUtility.utilityId === searchConfig.useUtility.utilityId
    })
  })
}

function getValidRouteConfig (routeConfig: RouteConfig, useUtilities: ImmutableArray<UseUtility>) {
  if (routeConfig && routeConfig.useUtility && useUtilities.some(useUtility => useUtility.utilityId === routeConfig.useUtility.utilityId)) {
    return routeConfig
  }
  return null
}

function getAllRoutingUtility (nls) {
  const helperServices = getAppStore().getState().portalSelf?.helperServices
  return extractService(helperServices, SupportedUtilityType.Routing, null, null, nls)
}
