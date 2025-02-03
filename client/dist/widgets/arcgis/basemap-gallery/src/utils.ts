import { React, Immutable, type ImmutableObject } from 'jimu-core'
import { type BasemapFromUrl, type BasemapInfo, BasemapsType, type Config, type IMConfig } from './config'
import { basemapUtils } from 'jimu-arcgis'

export function useFullConfig (config: Partial<IMConfig>) {
  return React.useMemo(() => {
    return Immutable({
      basemapsType: BasemapsType.Organization,
      customBasemaps: []
    } as Config).merge(config)
  }, [config])
}

export const isBasemapFromUrl = (basemapInfo: BasemapInfo | ImmutableObject<BasemapInfo>): basemapInfo is BasemapFromUrl => {
  return (basemapInfo as BasemapFromUrl).layerUrls?.length > 0 // only basemaps added from url will have layerUrls property
}

export const getBasemap = async (
  basemapInfo: BasemapInfo,
  Basemap: typeof __esri.Basemap,
  Layer: typeof __esri.Layer,
  VectorTileLayer: typeof __esri.VectorTileLayer
) => {
  let basemap: __esri.Basemap
  if (!isBasemapFromUrl(basemapInfo)) {
    basemap = new Basemap({
      portalItem: {
        id: basemapInfo.id
      }
    })
  } else {
    const layers = await Promise.all(basemapInfo.layerUrls.map((url) => {
      if (url.endsWith('MapServer') || url.endsWith('ImageServer') || url.endsWith('VectorTileServer')) {
        return Layer.fromArcGISServerUrl({ url }).catch((error) => {
          console.error('create layer for basemap error', error)
        })
      }
      // for json url and basemap style url
      return new VectorTileLayer({ url })
    }))
    basemap = new Basemap({
      id: basemapInfo.id,
      title: basemapInfo.title,
      thumbnailUrl: basemapInfo.thumbnail?.url,
      baseLayers: layers.filter((ly): ly is __esri.Layer => !!ly)
    })
  }
  return basemapUtils.loadBasemap(basemap)
}
