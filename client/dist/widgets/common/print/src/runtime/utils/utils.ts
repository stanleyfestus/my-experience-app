import { type IMPrintResultList, type IMPrintTemplateProperties, type PrintTemplateProperties, PrintExtentType, LayoutTypes, ReportTypes } from '../../config'
import { getLegendLayer, checkIsReportDsInUseMap, getUrlOfUseUtility } from '../../utils/utils'
import { getPortalUrlByUtility } from '../../utils/service-util'
import { type JimuMapView, loadArcGISJSAPIModules } from 'jimu-arcgis'
import { type IMUseUtility, type ImmutableArray, DataSourceManager, DataSourceStatus } from 'jimu-core'

interface InitTemplatePropertiesParamsTypes {
  printTemplateProperties: IMPrintTemplateProperties
  mapView: JimuMapView
  locale: string
  utility: IMUseUtility
  useMapWidgetIds: ImmutableArray<string>
  widgetId: string
  isSupportReport?: boolean
}

export const getNewResultItemTitle = (title: string, printResultList: IMPrintResultList): string => {
  let index = 1
  let newTitle = title
  printResultList.forEach(item => {
    if (newTitle === item?.title) {
      newTitle = `${title} (${index})`
      index++
      getNewResultItemTitle(newTitle, printResultList)
    }
  })
  return newTitle
}

/**
 * Get result id list
*/
export const getResultIdList = (printResultList: IMPrintResultList): string[] => {
  if (!printResultList) return []
  return printResultList?.asMutable()?.map(item => item.resultId)
}

/**
 * Get new datasource config id
*/
export const getNewResultId = (printResultList: IMPrintResultList): string => {
  const resultIdList = getResultIdList(printResultList)
  if (!resultIdList || resultIdList?.length === 0) return 'result_0'
  const maxIndex = getConfigIndexMaxNumber(resultIdList)
  return `config_${maxIndex + 1}`
}

const getConfigIndexMaxNumber = (resultIdList: string[]) => {
  if (!resultIdList || resultIdList?.length === 0) return 0
  const idIndexData = resultIdList?.map(id => {
    const currentIndex = id?.split('_')?.pop()
    return currentIndex ? Number(currentIndex) : 0
  })
  return idIndexData?.sort((a, b) => b - a)?.[0]
}

export function getPreviewLayerId (widgetId: string, jimuMapViewId: string): string {
  return 'print-extents-layer-' + widgetId + '-' + jimuMapViewId
}

export function getLayerIdByReportDs (dsId: string, widgetId: string): string {
  return `print-report-layer-${widgetId}-${dsId}`
}

export function checkDsIsOutputDs (dataSourceId: string): boolean {
  const dsM = DataSourceManager.getInstance()
  return dsM.getDataSource(dataSourceId)?.getDataSourceJson()?.isOutputFromWidget
}

export async function getCredentialToken (useUtility: IMUseUtility) {
  if (!useUtility) return
  return loadArcGISJSAPIModules(['esri/kernel']).then(([esriNS]) => {
    return getUrlOfUseUtility(useUtility).then(printServiceUrl => {
      const credential = esriNS.id.findCredential(printServiceUrl)
      return Promise.resolve(credential?.token)
    })
  })
}

function checkIsOutputDsAvaible (dsId: string): boolean {
  const dsM = DataSourceManager.getInstance()
  const dsStatus = dsM.getDataSource(dsId)?.getStatus()
  return dsStatus !== DataSourceStatus.NotCreated && dsStatus !== DataSourceStatus.CreateError && dsStatus !== DataSourceStatus.LoadError && dsStatus !== DataSourceStatus.SaveError && dsStatus !== DataSourceStatus.NotReady
}

export function removeReportLayers (jimuMapView: JimuMapView, reportOptions: any, widgetId: string, useMapWidgetIds: ImmutableArray<string>) {
  if (!jimuMapView || !reportOptions || !useMapWidgetIds || !widgetId) return
  const reportSectionOverrides = reportOptions?.reportSectionOverrides || {}
  Object.keys(reportSectionOverrides).forEach(async key => {
    const reportItem = reportSectionOverrides[key]
    if (reportItem?.exbDatasource?.length > 0) {
      const isReportDsInUseMap = checkIsReportDsInUseMap(reportItem, useMapWidgetIds)
      const dsId = reportItem?.exbDatasource?.[0]?.dataSourceId
      if (!isReportDsInUseMap && jimuMapView) {
        const reportLayerId = getLayerIdByReportDs(dsId, widgetId)
        const layer = jimuMapView.view.map.findLayerById(reportLayerId)
        if (layer) {
          jimuMapView.removeLayerFromMap(reportLayerId)
        }
      }
    }
  })
}

async function initReportOptions (reportOptions, jimuMapView: JimuMapView, useMapWidgetIds: ImmutableArray<string>, widgetId: string): Promise<any> {
  const reportSectionOverrides = reportOptions?.reportSectionOverrides || {}
  await Promise.all(Object.keys(reportSectionOverrides).map(async key => {
    const reportItem = reportSectionOverrides[key]
    if (reportItem?.exbDatasource?.length > 0) {
      const isReportDsInUseMap = checkIsReportDsInUseMap(reportItem, useMapWidgetIds)
      const dsId = reportItem?.exbDatasource?.[0]?.dataSourceId
      if (isReportDsInUseMap) {
        //Ds in use map
        const dsM = DataSourceManager.getInstance()
        const ds = dsM.getDataSource(dsId)
        const layerId = (ds as any).layer?.id || ''
        reportSectionOverrides[key].sourceId = layerId
      } else {
        //When the map does not use this ds, it needs to create a layer based on this ds.
        const reportLayerId = getLayerIdByReportDs(dsId, widgetId)
        if (jimuMapView) {
          await addReportLayersByDsId(jimuMapView, dsId, widgetId)
          reportSectionOverrides[key].sourceId = reportLayerId
        }
      }
      delete reportSectionOverrides[key].exbDatasource
    }
  }))
  reportOptions && (reportOptions.reportSectionOverrides = reportSectionOverrides)
  return Promise.resolve(reportOptions || {})
}

async function addReportLayersByDsId (jimuMapView: JimuMapView, dsId: string, widgetId: string) {
  const reportLayerId = getLayerIdByReportDs(dsId, widgetId)
  if (jimuMapView) {
    const layer = jimuMapView.view.map.findLayerById(reportLayerId)
    const isOutputDs = checkDsIsOutputDs(dsId)
    if (!checkIsOutputDsAvaible(dsId)) {
      return
    }
    let jimuLayerView

    if (layer && isOutputDs) {
      jimuLayerView = jimuMapView.getJimuLayerViewByAPILayer(layer)
    } else {
      jimuLayerView = await jimuMapView.addLayerToMap(dsId, reportLayerId)
    }

    if (jimuLayerView) {
      //The API that generates `WebmapJson` uses `layerViews`, so we should make sure the `layerView` is loaded.
      await jimuMapView.whenJimuLayerViewLoaded(jimuLayerView.id)
      jimuLayerView.layer.opacity = 0
      await moveFeaturesToCenterWhenPrintUseOutputDsOfNearMe(jimuLayerView, jimuMapView)
      await jimuLayerView.whenCurrentLayerViewNotUpdating()
      await fillEmptyFeatureLayers(jimuLayerView, jimuMapView)
      await jimuLayerView.whenCurrentLayerViewNotUpdating()
    }
  }
}

/**
 * Remind: remove it in next release
 * This is a temporary solution to the problem that if the features in Near Me are not loaded, it can not used in Print report.
 * Sow we need move the Features in near me to the center of the map when printing.
*/
async function moveFeaturesToCenterWhenPrintUseOutputDsOfNearMe (jimuLayerView, jimuMapView: JimuMapView) {
  const moveFeaturesToCenterWhenPrinting = jimuLayerView.layer?.customParameters?.moveFeaturesToCenterWhenPrinting
  if (!moveFeaturesToCenterWhenPrinting) return

  const featureSet = await jimuLayerView?.layer?.queryFeatures({ returnGeometry: true })
  const features = featureSet?.features || []
  if (features.length === 0) return

  const center = jimuMapView.view.extent?.center
  const layer = jimuLayerView?.layer

  if (layer.geometryType === 'point') {
    const [Graphic] = await loadArcGISJSAPIModules(['esri/Graphic'])
    const point = {
      type: 'point',
      x: center.x,
      y: center.y,
      spatialReference: jimuMapView.view.spatialReference
    }
    const newGraphics = features.map(f => {
      const graphic = new Graphic({
        attributes: f?.attributes || {},
        geometry: point
      })
      return graphic
    })
    await layer.applyEdits({ updateFeatures: newGraphics })
  } else if (layer.geometryType === 'polyline') {
    const [Graphic, Polyline] = await loadArcGISJSAPIModules(['esri/Graphic', 'esri/geometry/Polyline'])
    const paths = [
      [
        [jimuMapView.view.extent.center.x, jimuMapView.view.extent.center.y],
        [jimuMapView.view.extent.center.x + 5, jimuMapView.view.extent.center.y + 5]
      ]
    ]

    const line = new Polyline({
      hasZ: false,
      hasM: false,
      paths: paths,
      spatialReference: jimuMapView.view.spatialReference
    })

    const newGraphics = features.map(f => {
      const graphic = new Graphic({
        attributes: f?.attributes || {},
        geometry: line
      })
      return graphic
    })
    await layer.applyEdits({ updateFeatures: newGraphics })
  } else if (layer.geometryType === 'polygon') {
    const [Graphic, Polygon] = await loadArcGISJSAPIModules(['esri/Graphic', 'esri/geometry/Polygon'])
    const rings = [
      [
        [jimuMapView.view.extent.xmin, jimuMapView.view.extent.ymin],
        [jimuMapView.view.extent.xmin, jimuMapView.view.extent.ymax],
        [jimuMapView.view.extent.xmax, jimuMapView.view.extent.ymax],
        [jimuMapView.view.extent.xmin, jimuMapView.view.extent.ymin]
      ]
    ]

    const polygon = new Polygon({
      hasZ: false,
      hasM: false,
      rings: rings,
      spatialReference: jimuMapView.view.spatialReference
    })

    const newGraphics = features.map(f => {
      const graphic = new Graphic({
        attributes: f?.attributes || {},
        geometry: polygon
      })
      return graphic
    })
    await layer.applyEdits({ updateFeatures: newGraphics })
  }
}

/**
 * When the feature collection data in the current extent is empty,
 * the print api will ignore this feature collection layer when generating WebmapJson,
 * this will cause report error in the print request, so in order to deal with this problem, we need to insert a piece of data into this empty feature layer.
 * Related issue: https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/17583
*/
async function fillEmptyFeatureLayers (jimuLayerView, jimuMapView: JimuMapView) {
  if (!jimuLayerView?.view?.queryFeatureCount || !jimuLayerView?.whenCurrentLayerViewNotUpdating) return false
  await jimuLayerView.whenCurrentLayerViewNotUpdating()
  const extent = jimuMapView?.view?.extent
  const layer = jimuLayerView?.layer
  const featureSetCount = await jimuLayerView?.layer?.queryFeatureCount({
    geometry: extent
  })

  if (featureSetCount === 0 && layer.geometryType === 'point') {
    const point = {
      type: 'point',
      x: jimuMapView.view.extent.center.x,
      y: jimuMapView.view.extent.center.y,
      spatialReference: jimuMapView.view.spatialReference
    }
    const defaultAttributes = {}
    const date = new Date()
    defaultAttributes[layer.objectIdField] = date.getTime()
    await loadArcGISJSAPIModules(['esri/Graphic']).then(([Graphic]) => {
      const pointGraphic = new Graphic({
        geometry: point,
        attributes: defaultAttributes
      })

      return layer.applyEdits({
        addFeatures: [pointGraphic]
      }).then(() => {
        return Promise.resolve(true)
      })
    })
  } else if (featureSetCount === 0 && layer.geometryType === 'polyline') {
    const defaultAttributes = {}
    const date = new Date()
    defaultAttributes[layer.objectIdField] = date.getTime()
    await loadArcGISJSAPIModules(['esri/Graphic', 'esri/geometry/Polyline']).then(([Graphic, Polyline]) => {
      const paths = [
        [
          [jimuMapView.view.extent.center.x, jimuMapView.view.extent.center.y],
          [jimuMapView.view.extent.center.x + 5, jimuMapView.view.extent.center.y + 5]
        ]
      ]

      const line = new Polyline({
        hasZ: false,
        hasM: false,
        paths: paths,
        spatialReference: jimuMapView.view.spatialReference
      })

      const lineGraphic = new Graphic({
        geometry: line,
        attributes: defaultAttributes
      })

      return layer.applyEdits({
        addFeatures: [lineGraphic]
      }).then(() => {
        return Promise.resolve(true)
      })
    })
  } else if (featureSetCount === 0 && layer.geometryType === 'polygon') {
    const defaultAttributes = {}
    const date = new Date()
    defaultAttributes[layer.objectIdField] = date.getTime()
    await loadArcGISJSAPIModules(['esri/Graphic', 'esri/geometry/Polygon']).then(([Graphic, Polygon]) => {
      const rings = [
        [
          [jimuMapView.view.extent.xmin, jimuMapView.view.extent.ymin],
          [jimuMapView.view.extent.xmin, jimuMapView.view.extent.ymax],
          [jimuMapView.view.extent.xmax, jimuMapView.view.extent.ymax],
          [jimuMapView.view.extent.xmin, jimuMapView.view.extent.ymin]
        ]
      ]

      const poly = new Polygon({
        hasZ: false,
        hasM: false,
        rings: rings,
        spatialReference: jimuMapView.view.spatialReference
      })

      const polyGraphic = new Graphic({
        geometry: poly,
        attributes: defaultAttributes
      })

      return layer.applyEdits({
        addFeatures: [polyGraphic]
      }).then(() => {
        return Promise.resolve(true)
      })
    })
  } else {
    return Promise.resolve(true)
  }
}

export async function initTemplateProperties (params: InitTemplatePropertiesParamsTypes): Promise<PrintTemplateProperties> {
  const { printTemplateProperties, mapView, locale, utility, isSupportReport, useMapWidgetIds, widgetId } = params
  try {
    // eslint-disable-next-line
    const isRemoveTitleText = printTemplateProperties?.hasTitleText === false
    // eslint-disable-next-line
    const isRemoveLegend = printTemplateProperties?.hasLegend === false
    let newTemplateProperties = printTemplateProperties
      .without('enableTitle', 'enableAuthor', 'enableOutputSpatialReference', 'enableMapPrintExtents', 'enableQuality', 'enableMapSize', 'enableFeatureAttribution', 'enableCopyright',
        'enableLegend', 'enableMapAttribution', 'enableCustomTextElements', 'hasAuthorText', 'hasCopyrightText', 'hasLegend', 'hasTitleText', 'selectedFormatList', 'mapFrameSize', 'mapFrameUnit', 'legendEnabled',
        'templateId', 'printExtentType', 'customTextElementEnableList'
      )
    switch (printTemplateProperties?.printExtentType) {
      case PrintExtentType.CurrentMapExtent:
        newTemplateProperties = newTemplateProperties.set('scalePreserved', false)
        break
      case PrintExtentType.CurrentMapScale:
        newTemplateProperties = newTemplateProperties.set('outScale', mapView?.view?.scale).set('scalePreserved', true)
        break
      case PrintExtentType.SetMapScale:
        newTemplateProperties = newTemplateProperties.set('scalePreserved', true)
        break
    }
    let templateProperties = newTemplateProperties?.asMutable({ deep: true })
    if (isRemoveTitleText) {
      delete templateProperties?.layoutOptions?.titleText
    }
    if (isRemoveLegend) {
      delete templateProperties?.layoutOptions?.legendLayers
    }
    if (printTemplateProperties?.layoutOptions?.legendLayers) {
      templateProperties.layoutOptions.legendLayers = await getLegendLayer(mapView)
    } else {
      templateProperties.layoutOptions.legendLayers = []
    }

    if (printTemplateProperties.layoutTypes === LayoutTypes.CustomLayout || printTemplateProperties.reportTypes === ReportTypes.CustomReport) {
      templateProperties = await initCustomReportOrCustomLayout(templateProperties, utility)
    }

    if (isSupportReport) {
      //Init reportOptions
      const newReportOptions = await initReportOptions(templateProperties?.reportOptions, mapView, useMapWidgetIds, widgetId)
      templateProperties.reportOptions = newReportOptions
    }

    // init Date of customTextElements
    templateProperties = initCustomTextElements(templateProperties, locale)

    return Promise.resolve(templateProperties)
  } catch (err) {
    console.error(err)
    isSupportReport && removeReportLayers(mapView, printTemplateProperties?.reportOptions, widgetId, useMapWidgetIds)
    return Promise.resolve(null)
  }
}

async function initCustomReportOrCustomLayout (printTemplateProperties: PrintTemplateProperties, utility: IMUseUtility): Promise<PrintTemplateProperties> {
  const newPrintTemplateProperties = printTemplateProperties
  return loadArcGISJSAPIModules(['esri/portal/PortalItem']).then(modules => {
    const [PortalItem] = modules
    return getPortalUrlByUtility(utility).then(portalUrl => {
      if (printTemplateProperties.layoutTypes === LayoutTypes.CustomLayout && printTemplateProperties.customLayoutItem?.id) {
        const layoutItem = new PortalItem({
          id: printTemplateProperties.customLayoutItem.id,
          portal: portalUrl
        })
        newPrintTemplateProperties.layoutItem = layoutItem
      }

      if (printTemplateProperties.reportTypes === ReportTypes.CustomReport && printTemplateProperties.customReportItem?.id) {
        const reportItem = new PortalItem({
          id: printTemplateProperties.customReportItem.id,
          portal: portalUrl
        })
        newPrintTemplateProperties.reportItem = reportItem
      }

      delete newPrintTemplateProperties.customLayoutItem
      delete newPrintTemplateProperties.customReportItem
      delete newPrintTemplateProperties.layoutTypes
      delete newPrintTemplateProperties.reportTypes
      return Promise.resolve(newPrintTemplateProperties)
    })
  }, err => {
    return Promise.resolve(newPrintTemplateProperties)
  }).catch(err => {
    return Promise.resolve(newPrintTemplateProperties)
  })
}

function initCustomTextElements (templateProperties: PrintTemplateProperties, locale: string): PrintTemplateProperties {
  const customTextElements = templateProperties.layoutOptions?.customTextElements || []
  let hasDate = false
  customTextElements.forEach(el => {
    if (el.date) {
      hasDate = true
    }
  })

  if (!hasDate) {
    customTextElements.push({ Date: new Date().toLocaleString(locale) })
  }
  templateProperties.layoutOptions.customTextElements = customTextElements
  return templateProperties
}
