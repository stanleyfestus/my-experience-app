import { React, type DataSource, type DataSourceConstructorOptions, DataSourceManager, DataSourcesChangeMessage, DataSourcesChangeType, Immutable, loadArcGISJSAPIModules, MessageManager, MutableStoreManager, type ServiceDefinition, ServiceManager } from 'jimu-core'
import { SupportedLayerServiceTypes, type FeatureLayerDataSourceConstructorOptions } from 'jimu-core/data-source'
import { type DataOptions } from './types'

export function getDataSource (id: string): DataSource {
  return DataSourceManager.getInstance().getDataSource(id)
}

export async function createDataSourcesByDataOptions (multiDataOptions: DataOptions[], widgetId: string, publishMessage = true): Promise<DataSource[]> {
  if (!multiDataOptions || multiDataOptions.length === 0) {
    return Promise.resolve([])
  }

  let FeatureLayer: typeof __esri.FeatureLayer
  let Graphic: typeof __esri.Graphic
  let Field: typeof __esri.Field
  if (multiDataOptions.some(o => o.restLayer)) {
    const apiModules = await loadArcGISJSAPIModules(['esri/layers/FeatureLayer', 'esri/Graphic', 'esri/layers/support/Field'])
    FeatureLayer = apiModules[0]
    Graphic = apiModules[1]
    Field = apiModules[2]
  }

  const dataSourceConstructorOptions: DataSourceConstructorOptions[] = multiDataOptions.map(o => {
    if (o.restLayer && FeatureLayer && Graphic && Field) {
      return {
        id: o.dataSourceJson.id,
        dataSourceJson: Immutable(o.dataSourceJson),
        layer: new FeatureLayer({
          source: o.restLayer.featureSet?.features?.map(f => Graphic.fromJSON(f)) || [],
          objectIdField: o.restLayer.layerDefinition?.objectIdField,
          fields: o.restLayer.layerDefinition?.fields?.map(f => Field.fromJSON(f)),
          sourceJSON: o.restLayer.layerDefinition,
          title: o.dataSourceJson.label || o.dataSourceJson.sourceLabel
        })
      } as FeatureLayerDataSourceConstructorOptions
    } else {
      return {
        id: o.dataSourceJson.id,
        dataSourceJson: Immutable(o.dataSourceJson)
      } as DataSourceConstructorOptions
    }
  })

  // Capabilities of the client-side layer will be changed after load. Need to set it back.
  await Promise.allSettled(dataSourceConstructorOptions.filter((o: FeatureLayerDataSourceConstructorOptions) => o.layer).map(async (o: FeatureLayerDataSourceConstructorOptions) => {
    const capabilitiesBeforeLoad = (o.layer as __esri.FeatureLayer).sourceJSON?.capabilities
    if (capabilitiesBeforeLoad) {
      await o.layer.load()
      ;(o.layer as __esri.FeatureLayer).sourceJSON.capabilities = capabilitiesBeforeLoad
    }
  }))

  return Promise.allSettled(dataSourceConstructorOptions.map(o => DataSourceManager.getInstance().createDataSource(o).then(ds => ds.isDataSourceSet() && !ds.areChildDataSourcesCreated() ? ds.childDataSourcesReady().then(() => ds) : ds)))
    .then(res => res.filter(r => r.status === 'fulfilled').map(r => (r as unknown as PromiseFulfilledResult<DataSource>).value))
    .then(dataSources => {
      // publish message
      if (publishMessage && dataSources.length > 0) {
        const dataSourcesChangeMessage = new DataSourcesChangeMessage(widgetId, DataSourcesChangeType.Create, dataSources)
        MessageManager.getInstance().publishMessage(dataSourcesChangeMessage)
      }

      if (dataSources.length < multiDataOptions.length) {
        return Promise.reject('Failed to create some data source.')
      }

      return dataSources
    })
}

export async function updateDataSourcesByDataOptions (multiDataOptions: DataOptions[], widgetId: string): Promise<void> {
  if (!multiDataOptions || multiDataOptions.length === 0) {
    return Promise.resolve()
  }

  return Promise.resolve().then(() => {
    // TODO: need to publish message to tell framework data source is updated?
    multiDataOptions.forEach(d => {
      const ds = getDataSource(d.dataSourceJson.id)
      if (ds) {
        DataSourceManager.getInstance().updateDataSourceByDataSourceJson(ds, Immutable(d.dataSourceJson))
      }
    })
  })
}

export function destroyDataSourcesById (ids: string[], widgetId: string, publishMessage = true): Promise<void> {
  const dataSources = ids.map(id => getDataSource(id)).filter(ds => !!ds)
  // publish message
  if (publishMessage && dataSources.length > 0) {
    const dataSourcesChangeMessage = new DataSourcesChangeMessage(widgetId, DataSourcesChangeType.Remove, dataSources)
    MessageManager.getInstance().publishMessage(dataSourcesChangeMessage)
  }

  return Promise.resolve().then(() => {
    ids.forEach(id => {
      // Remove filter actions.
      MutableStoreManager.getInstance().updateStateValue('setFilter', id, null)
      DataSourceManager.getInstance().destroyDataSource(id)
    })
  })
}

export function preventDefault (evt: React.MouseEvent<HTMLDivElement>) {
  evt.stopPropagation()
  evt.preventDefault()
  evt.nativeEvent?.stopImmediatePropagation()
}

export function usePrevious <T> (state: T): T | undefined {
  const prevRef = React.useRef<T>()
  const curRef = React.useRef<T>()

  if (!Object.is(curRef.current, state)) {
    prevRef.current = curRef.current
    curRef.current = state
  }

  return prevRef.current
}

export function getNextAddedDataId (widgetId: string, order: number): string {
  // Use time stamp since if one data is loading (the data source json hasn't been created yet) and user adds another data at the same time, the data source id will be duplicated.
  return `add-data-${widgetId}-${order}-${new Date().getTime()}`
}

export function getLayerUrlByServiceDefinition (serviceUrl: string, serviceDefinition: ServiceDefinition) {
  const layers = (serviceDefinition?.layers || []).concat(serviceDefinition?.tables || [])
  const layerId = `${layers[0]?.id || 0}`
  return `${serviceUrl}/${layerId}`
}

export async function getLayerInfoFromSingleLayerFeatureService (serviceUrl: string, serviceDefinition: ServiceDefinition) {
  const layers = (serviceDefinition?.layers || []).concat(serviceDefinition?.tables || [])
  // If the single layer is not feature layer or table, will still create feature service data source.
  if (layers.length === 1 && ((serviceDefinition?.layers?.length === 1 && serviceDefinition?.layers?.[0]?.type === SupportedLayerServiceTypes.FeatureLayer) || (serviceDefinition?.tables?.length === 1))) {
    const url = getLayerUrlByServiceDefinition(serviceUrl, serviceDefinition)
    const layerDefinition = await ServiceManager.getInstance().fetchServiceInfo(url).then(res => res.definition)
    return { url, layerDefinition }
  }
  return null
}

export function isIOSDevice () {
  return /iPad|iPhone|iPod/.test(window.navigator.userAgent)
}
