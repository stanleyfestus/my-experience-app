import { Immutable, type DataSource, DataSourceManager, uuidv1, AllDataSourceTypes, type UseDataSource } from 'jimu-core'
import { loadArcGISJSAPIModules, LayerTypes } from 'jimu-arcgis'
import { DistanceUnits } from 'jimu-ui'
import { type IMConfig, StyleType, FontSizeType } from './config'

export const supportedDsTypes = Immutable([AllDataSourceTypes.FeatureLayer, AllDataSourceTypes.SceneLayer, AllDataSourceTypes.BuildingComponentSubLayer,
  AllDataSourceTypes.OrientedImageryLayer, AllDataSourceTypes.ImageryLayer, AllDataSourceTypes.SubtypeSublayer])

export const supportedLayerTypes = Immutable([LayerTypes.FeatureLayer, LayerTypes.SceneLayer, LayerTypes.BuildingComponentSublayer,
  LayerTypes.OrientedImageryLayer, LayerTypes.ImageryLayer, LayerTypes.SubtypeSublayer])

export const supportedAllDsTypes = Immutable([
  AllDataSourceTypes.FeatureLayer, AllDataSourceTypes.SceneLayer, AllDataSourceTypes.WebMap, AllDataSourceTypes.WebScene, AllDataSourceTypes.MapService,
  AllDataSourceTypes.FeatureService, AllDataSourceTypes.SceneService, AllDataSourceTypes.GroupLayer, AllDataSourceTypes.BuildingComponentSubLayer,
  AllDataSourceTypes.BuildingGroupSubLayer, AllDataSourceTypes.BuildingSceneLayer, AllDataSourceTypes.OrientedImageryLayer, AllDataSourceTypes.ImageryLayer,
  AllDataSourceTypes.SubtypeGroupLayer, AllDataSourceTypes.SubtypeSublayer
])

export const batchDsTypes = Immutable([
  AllDataSourceTypes.WebMap, AllDataSourceTypes.WebScene, AllDataSourceTypes.MapService, AllDataSourceTypes.FeatureService,
  AllDataSourceTypes.SceneService, AllDataSourceTypes.GroupLayer, AllDataSourceTypes.BuildingGroupSubLayer, AllDataSourceTypes.BuildingSceneLayer,
  AllDataSourceTypes.SubtypeGroupLayer
])

export async function getFeatureLayer (dataSource) {
  return await loadArcGISJSAPIModules([
    'esri/layers/FeatureLayer'
  ]).then(modules => {
    const [FeatureLayer] = modules
    let featureLayer
    if (dataSource.layer) {
      // return Promise.resolve(dataSource.layer);
      featureLayer = dataSource.layer
    } else {
      if (dataSource.itemId) {
        featureLayer = new FeatureLayer({
          portalItem: {
            id: dataSource.itemId,
            portal: {
              url: dataSource.portalUrl
            }
          }
        })
      } else {
        featureLayer = new FeatureLayer({
          url: dataSource.url
        })
      }
    }

    // Bug: js-api does not enter the callback if there is no load method here.
    return featureLayer.load().then(async () => {
      return await Promise.resolve(featureLayer)
    })

    /*
    return new Promise((resolve, reject) => {
      featureLayer.when(() => {
        console.log("when");
        resolve(featureLayer);
      }, () => {
        reject();
        console.log("when error");
      })
    });
     */
  }).catch((e) => {
    console.warn(e)
    return null
  })
}

export function flattenDataSources (ds: DataSource) {
  const flatDataSources = []
  const recursionGetDs = (dataSource: DataSource) => {
    // isDataSourceSet is false represents the ds is leaf node
    if (dataSource.isDataSourceSet()) {
      const childDataSources = dataSource.getChildDataSources()
      childDataSources.forEach(ds => {
        recursionGetDs(ds)
      })
    } else {
      flatDataSources.push(dataSource)
    }
  }
  recursionGetDs(ds)
  return flatDataSources
}

export function isSupportedDataType (dataSource): boolean {
  return supportedDsTypes.includes(dataSource?.type) && !dataSource?.dataSourceJson?.isHidden
}

export function createDefaultUseDataSource (dataSource) {
  return Immutable({
    dataSourceId: dataSource.id,
    mainDataSourceId: dataSource.getMainDataSource()?.id,
    dataViewId: dataSource.dataViewId,
    rootDataSourceId: dataSource.getRootDataSource()?.id
  } as UseDataSource)
}

export function createDefaultDSConfig (dataSourceId: string, label?: string) {
  const dataSource = DataSourceManager.getInstance().getDataSource(dataSourceId)
  return {
    id: uuidv1(),
    label: label || dataSource?.getLabel() || dataSourceId,
    useDataSourceId: dataSourceId,
    contentConfig: {
      title: true,
      fields: true,
      media: true,
      attachments: true,
      lastEditInfo: true
    }
  }
}

export function getDefaultConfig (): IMConfig {
  return Immutable({
    useMapWidget: true,
    limitGraphics: false,
    maxGraphics: 0,
    noDataMessage: '',
    styleType: StyleType.usePopupDefined,
    style: {
      textColor: '',
      fontSizeType: FontSizeType.auto,
      fontSize: {
        distance: 14,
        unit: DistanceUnits.PIXEL
      },
      backgroundColor: ''
    },
    dsNavigator: true,
    featureNavigator: true,
    showCount: true,
    dsConfigs: [],
    dsConfigsOfMapWidget: []
  })
}
