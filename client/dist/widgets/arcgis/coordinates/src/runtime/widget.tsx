/** @jsx jsx */
import { React, jsx, type AllWidgetProps, utils, moduleLoader, lodash, ReactResizeDetector, hooks, type IMState, ReactRedux, css } from 'jimu-core'
import { type CoordinateConfig, DisplayOrderType, ElevationUnitType, type IMConfig, type WidgetRect, WidgetStyleType } from '../config'
import defaultMessages from './translations/default'
import { type JimuMapView, JimuMapViewComponent } from 'jimu-arcgis'
import {
  Button, Card, CardBody, CardFooter, Dropdown, DropdownButton, DropdownItem,
  DropdownMenu, WidgetPlaceholder, defaultMessages as jimuDefaultMessages
} from 'jimu-ui'
import Graphic from 'esri/Graphic'
import GraphicsLayer from 'esri/layers/GraphicsLayer'
import SpatialReference from 'esri/geometry/SpatialReference'
import PictureMarkerSymbol from 'esri/symbols/PictureMarkerSymbol'
import coordinateFormatter from 'esri/geometry/coordinateFormatter'
import webMercatorUtils from 'esri/geometry/support/webMercatorUtils'
import Point from 'esri/geometry/Point'
import projection from 'esri/geometry/projection'
import geometryService from 'esri/rest/geometryService'
import ProjectParameters from 'esri/rest/support/ProjectParameters'
import { degToDDM, degToDMS, getCrsBySpheroidStr, getCSUnitByCrs, getWktKeyStr, getUnitRate, getUnits, isGeographicUnit, isProjectUnit, localizeNumberBySettingInfo } from '../utils'
import { getStyle } from './style'
import { CopyButton } from 'jimu-ui/basic/copy-button'
import { TextAutoFit } from './components/text-fit'
import coordinatesIcon from '../../icon.svg'
import { DownOutlined } from 'jimu-icons/outlined/directional/down'
import { LocatorOutlined } from 'jimu-icons/outlined/editor/locator'
import { LayoutItemSizeModes } from 'jimu-layouts/layout-runtime'
import reactiveUtils from 'esri/core/reactiveUtils'

const { useState, useEffect, useRef } = React

const Widget = (props: AllWidgetProps<IMConfig>): React.ReactElement => {
  const { config, useMapWidgetIds, theme, id, layoutId, layoutItemId, controllerWidgetId } = props
  const { coordinateSystem, coordinateDecimal, altitudeDecimal, showSeparators, displayOrder, widgetStyle, mapInfo, mapInfo2 } = config
  const widgetSizeAuto = ReactRedux.useSelector((state: IMState) => {
    const appConfig = state && state.appConfig
    const layout = appConfig.layouts?.[layoutId]
    const layoutSetting = layout?.content?.[layoutItemId]?.setting
    const isHeightAuto =
      layoutSetting?.autoProps?.height === LayoutItemSizeModes.Auto ||
      layoutSetting?.autoProps?.height === true
    const isWidthAuto =
      layoutSetting?.autoProps?.width === LayoutItemSizeModes.Auto ||
      layoutSetting?.autoProps?.width === true
    return isHeightAuto || isWidthAuto
  })
  // state
  const [widgetRect, setWidgetRect] = useState<WidgetRect>({ width: 250, height: 100 })
  const [currentJimuMapView, setCurrentJimuMapView] = useState(null)
  const [enableRealtime, setEnableRealtime] = useState(true)
  const [selectedSystemId, setSelectedSystemId] = useState(coordinateSystem?.[0]?.id)
  const [locateActive, setLocateActive] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const [showMouseTips, setShowMouseTips] = useState(false)
  const [geoInfo, setGeoInfo] = useState('')

  const [elevInfo, setElevInfo] = useState('')
  const [elevNum, setElevNum] = useState(null)
  const [elevUnit, setElevUnit] = useState('')

  const [eyeInfo, setEyeInfo] = useState('')
  const [eyeNum, setEyeNum] = useState(null)
  const [eyeUnit, setEyeUnit] = useState('')

  const [modulesLoaded, setModulesLoaded] = useState(false)
  // translate
  const translate = hooks.useTranslation(defaultMessages, jimuDefaultMessages)
  const mapClickTips = translate('mapClickTips')
  const mouseMoveTips = translate('mouseMoveTips')
  const enableClickTips = translate('enableClickTips')
  const disableClickTips = translate('disableClickTips')
  const computing = translate('computing')
  const placeHolderName = translate('_widgetLabel')
  //units
  const unitInches = translate('unitsInches')
  const unitFoot = translate('unitsLabelFeet')
  const unitFootUs = translate('unitsFoot_US')
  const unitYards = translate('unitsLabelYards')
  const unitMiles = translate('unitsLabelMiles')
  const unitNauticalMiles = translate('unitsLabelNauticalMiles')
  const unitMillimeters = translate('unitsMillimeters')
  const unitCentimeters = translate('unitsCentimeters')
  const unitMeters = translate('unitsLabelMeters')
  const unitKilometers = translate('unitsLabelKilometers')
  const unitDecimeters = translate('unitsDecimeters')
  const unitDD = translate('unitsDecimalDegrees')
  const unitDDM = translate('unitsDegreesDecimalMinutes')
  const unitDMS = translate('unitsDegreeMinutesSeconds')
  const unitMgrs = translate('unitsMgrs')
  const unitUsng = translate('unitsUsng')
  const changeSystem = translate('changeSystem')
  // global variable
  const mapWkid = useRef(null)
  const mapPortalId = useRef(null)
  const graphicsLayer = useRef(null)
  const markerGraphic = useRef(null)
  const moveListener = useRef(null)
  const clickListener = useRef(null)
  const wkidUtilsRef = useRef(null)
  // unit nls map
  const unitNlsMap = {
    INCHES: unitInches,
    FOOT: unitFoot,
    FOOT_US: unitFootUs,
    YARDS: unitYards,
    MILES: unitMiles,
    NAUTICAL_MILES: unitNauticalMiles,
    MILLIMETERS: unitMillimeters,
    CENTIMETERS: unitCentimeters,
    METER: unitMeters,
    KILOMETERS: unitKilometers,
    DECIMETERS: unitDecimeters,
    DEGREE: unitDD,
    DECIMAL_DEGREES: unitDD,
    DEGREES_DECIMAL_MINUTES: unitDDM,
    DEGREE_MINUTE_SECONDS: unitDMS,
    MGRS: unitMgrs,
    USNG: unitUsng
  }
  const unitAbbrMap = {
    [unitKilometers]: translate('kilometerAbbr'),
    [unitMeters]: translate('meterAbbr'),
    [unitFoot]: translate('feetAbbr')
  }
  const COORDINATES_MIN_WIDTH = 160
  const COORDINATES_MIN_HEIGHT = 26

  useEffect(() => {
    return () => {
      if (markerGraphic.current) {
        graphicsLayer.current?.remove(markerGraphic.current)
      }
      if (graphicsLayer.current) {
        const map = currentJimuMapView?.view?.map
        map?.remove(graphicsLayer.current)
      }
      if (clickListener.current) clickListener.current?.remove()
      if (moveListener.current) moveListener.current?.remove()
    }
    // eslint-disable-next-line
  }, [])

  hooks.useUpdateEffect(() => {
    const view = currentJimuMapView?.view
    const viewTypeIsThree = view?.type === '3d'
    if (enableRealtime) {
      clickListener.current?.remove()
      moveListener.current?.remove()
      moveListener.current = view?.on('pointer-move', (event) => {
        const point = view.toMap({ x: event.x, y: event.y })
        const threeDPoint = { x: event?.native?.pageX, y: event?.native?.pageY }
        onMouseMove(point, viewTypeIsThree ? threeDPoint : undefined)
      })
    } else {
      clickListener.current?.remove()
      moveListener.current?.remove()
      if (locateActive) {
        clickListener.current = view?.on('click', (event) => {
          const threeDPoint = { x: event?.native?.pageX, y: event?.native?.pageY }
          onMapClick(event, viewTypeIsThree ? threeDPoint : undefined)
        })
      }
    }
  }, [currentJimuMapView, locateActive, enableRealtime, selectedSystemId,
    coordinateSystem, coordinateDecimal, altitudeDecimal, showSeparators, displayOrder])

  useEffect(() => {
    graphicsLayer.current = new GraphicsLayer({ listMode: 'hide' })
    markerGraphic.current = null
    const map = currentJimuMapView?.view?.map
    map?.add(graphicsLayer.current)
    // change status when view switch
    checkSystemSetTips()
    // eslint-disable-next-line
  }, [currentJimuMapView, mapInfo, mapInfo2])

  const resetAllGeoInfo = () => {
    setGeoInfo('')
    setElevInfo('')
    setElevNum(null)
    setElevUnit('')
    setEyeInfo('')
    setEyeNum(null)
    setEyeUnit('')
    setLocateActive(false)
  }

  const removeLayerAndMarker = () => {
    if (markerGraphic.current) {
      graphicsLayer.current?.remove(markerGraphic.current)
    }
    if (graphicsLayer.current) {
      const orgMap = currentJimuMapView?.view?.map
      orgMap?.remove(graphicsLayer.current)
    }
  }

  const onActiveViewChange = (jimuMapView: JimuMapView) => {
    // switch map: clear all geo info
    resetAllGeoInfo()
    removeLayerAndMarker()
    setCurrentJimuMapView(jimuMapView)
    const view = jimuMapView?.view
    if (!view) return
    mapWkid.current = view?.spatialReference?.wkid
    mapPortalId.current = (view?.map as any)?.portalItem?.id
    // monitor basemap change
    reactiveUtils.watch(() => view?.map?.basemap, () => {
      (view as any).cursor = 'default'
      if (!view?.basemapView) return
      const baseMapView = view.basemapView?.view
      mapWkid.current = baseMapView?.spatialReference?.wkid
      mapPortalId.current = (baseMapView?.map as any)?.portalItem?.id
      checkSystemSetTips()
      resetAllGeoInfo()
      removeLayerAndMarker()
    })
  }

  const debounceOnResize = lodash.debounce(
    (width, height) => { onResize(width, height) },
    200
  )

  const onResize = (width, height) => {
    const newWidgetRect = {
      width,
      height
    }
    const notResetSize = width < COORDINATES_MIN_WIDTH || height < COORDINATES_MIN_HEIGHT
    if (notResetSize) return
    setWidgetRect(newWidgetRect)
  }

  const checkSystemSetTips = async () => {
    const selectedSystem = coordinateSystem.find(item => item.id === selectedSystemId)
    const canShowClient = await canShowInClient(selectedSystem)
    if (canShowClient) {
      if (!locateActive) {
        setEnableRealtime(true)
        setShowMouseTips(true)
      }
    } else {
      setEnableRealtime(false)
      setShowMouseTips(false)
    }
  }

  const getMarkerGraphic = (mapPoint) => {
    const symbol = new PictureMarkerSymbol({
      url: require('./assets/pin-exb.svg'),
      width: 12,
      height: 22,
      yoffset: 11
    })
    return new Graphic({
      geometry: mapPoint,
      symbol
    })
  }

  const getUsedMapInfo = () => {
    const curMapId = currentJimuMapView?.view?.map?.portalItem?.id
    const mapArr = []
    if (mapInfo) mapArr.push(mapInfo)
    if (mapInfo2) mapArr.push(mapInfo2)
    return mapArr.find(info => info?.id === curMapId)
  }

  const canShowInClient = async (selectedSystem: CoordinateConfig): Promise<boolean> => {
    const { wkid, crs } = selectedSystem
    const curWkidNum = parseInt(wkid)
    const curSr = new SpatialReference({ wkid: curWkidNum })
    const mapSr = new SpatialReference({ wkid: mapWkid.current })
    const specialCase = (mapWkid.current === 4326 && curSr.isWebMercator) ||
      (curWkidNum === 4326 && mapSr.isWebMercator)
    const curLabel = crs?.name
    // If same wkid with basemap, use the recorded wkid.Otherwise, load wkidUtils.
    const usedConfigMapInfo = getUsedMapInfo()
    // get map label
    const hasMap = useMapWidgetIds && useMapWidgetIds?.length > 0
    const getMapLabel = (): Promise<string> => {
      if (!mapWkid.current || !hasMap) {
        return Promise.resolve('')
      } else if (usedConfigMapInfo?.wkid && mapWkid.current === usedConfigMapInfo?.wkid) {
        return Promise.resolve(usedConfigMapInfo?.label)
      } else {
        if (!modulesLoaded) {
          return moduleLoader.loadModule('jimu-core/wkid').then(module => {
            wkidUtilsRef.current = module
            setModulesLoaded(true)
            const { getSRLabel } = module
            return getSRLabel(mapWkid.current)
          })
        } else {
          const { getSRLabel } = wkidUtilsRef.current
          return getSRLabel(mapWkid.current)
        }
      }
    }
    const mapLabel = await getMapLabel()
    const isSameSR = curLabel && curLabel === mapLabel
    if (isSameSR || specialCase) return true
    return false
  }

  const projectMapPoint = (point, selectedSystem, threeDPoint?) => {
    const { wkid, datumWkid, datumWkid2, transformForward, transformForward2, displayUnit, crs } = selectedSystem
    if (!wkid) return
    const curWkidNum = parseInt(wkid)
    const curSr = new SpatialReference({ wkid: curWkidNum })
    const mapSr = new SpatialReference({ wkid: mapWkid.current })
    let outWkid = null
    const params = new ProjectParameters({
      geometries: [point],
      transformForward: false
    })

    outWkid = curWkidNum
    let useGeo = false
    let outCrs
    if (curSr.isGeographic) {
      outWkid = curWkidNum
    } else {
      const useDisplayUnit = displayUnit || getDefaultUnits(curSr.isGeographic, mapSr.isWebMercator, crs)
      if (isProjectUnit(useDisplayUnit)) {
        outWkid = curWkidNum
      } else { // geoUnit or USNG, MGRS
        // When output wkid is not used, need to use GEOGCS to find the outSR
        const spheroidStr = getWktKeyStr(crs, 'GEOGCS')
        outCrs = getCrsBySpheroidStr(spheroidStr)
        outWkid = outCrs?.wkid
        useGeo = true
      }
    }

    if (datumWkid && datumWkid2) {
      if (mapPortalId.current === mapInfo.id) {
        params.transformation = new SpatialReference({ wkid: parseInt(datumWkid) })
        params.transformForward = transformForward
      } else if (mapPortalId.current === mapInfo2.id) {
        params.transformation = new SpatialReference({ wkid: parseInt(datumWkid2) })
        params.transformForward = transformForward2
      }
    } else if (datumWkid && !datumWkid2) {
      params.transformation = new SpatialReference({ wkid: parseInt(datumWkid) })
      params.transformForward = transformForward
    }
    params.outSpatialReference = new SpatialReference({ wkid: parseInt(outWkid) })
    setGeoInfo(computing)
    const defUrl = utils.getGeometryService()
    geometryService.project(defUrl, params).then(geometries => {
      const point = geometries[0]
      let outputUnit = displayUnit
      // use default units
      if (!outputUnit) {
        outputUnit = getDefaultUnits(curSr.isGeographic, mapSr.isWebMercator, crs)
      }
      if (outputUnit === 'MGRS' || outputUnit === 'USNG') {
        displayUsngOrMgrs(outputUnit, point)
      } else if (isGeographicUnit(outputUnit)) {
        displayDegOrDms(outputUnit, point, mapSr.isWebMercator, useGeo ? outCrs.unit : '')
      } else {
        displayProject(outputUnit, point, mapSr.isWebMercator, useGeo ? outCrs.unit : '')
      }
    })

    const view = currentJimuMapView?.view
    const viewTypeIsThree = view?.type === '3d'
    if (viewTypeIsThree) {
      _setEyeInfo()
      if (threeDPoint) _setElevInfo(threeDPoint)
    }
  }

  const onMapClick = async (evt, threeDPoint?) => {
    // if (window.appInfo.isRunInMobile) {
    //   return
    // }
    // Changing the reference causes a bug where mark's position is changed the first time
    if (!evt.mapPoint) return
    const copyMapPoint = Point.fromJSON(evt.mapPoint.toJSON())
    evt.stopPropagation()
    setShowTips(false)
    if (enableRealtime || !selectedSystemId) return
    const selectedSystem = coordinateSystem.find(item => item.id === selectedSystemId)
    const canShowClient = await canShowInClient(selectedSystem)
    const needMarker = canShowClient || locateActive
    if (needMarker && !markerGraphic.current) {
      markerGraphic.current = getMarkerGraphic(evt.mapPoint)
      graphicsLayer.current.add(markerGraphic.current)
    }
    if (canShowClient) {
      markerGraphic.current.geometry = evt.mapPoint
      displayOnClient(copyMapPoint, threeDPoint)
      return
    }
    if (locateActive) {
      markerGraphic.current.geometry = evt.mapPoint
      const { x, y } = evt.mapPoint
      const mapSr = currentJimuMapView?.view?.spatialReference
      const point = new Point({ x, y, spatialReference: mapSr })
      projectMapPoint(point, selectedSystem, threeDPoint)
    }
  }

  const onMouseMove = async (point, threeDPoint?) => {
    // if (window.appInfo.isRunInMobile) {
    //   return
    // }
    setShowMouseTips(false)
    if (!enableRealtime || !selectedSystemId) return
    const selectedSystem = coordinateSystem.find(item => item.id === selectedSystemId)
    const canShowClient = await canShowInClient(selectedSystem)
    if (canShowClient) {
      displayOnClient(point, threeDPoint)
    }
  }

  const unitToNls = (unit): string => {
    return unitNlsMap[unit] || unitNlsMap[unit?.toUpperCase()]
  }

  const displayUsngOrMgrs = (unit: 'MGRS' | 'USNG', normalizedPoint) => {
    coordinateFormatter.load().then(() => {
      const nlsUnit = unitToNls(unit)
      if (unit === 'MGRS') {
        const mgrs = coordinateFormatter.toMgrs(normalizedPoint, 'automatic', 5)
        setGeoInfo(`${mgrs} ${nlsUnit}`)
      } else if (unit === 'USNG') {
        const usng = coordinateFormatter.toUsng(normalizedPoint, 5)
        setGeoInfo(`${usng} ${nlsUnit}`)
      }
    })
  }

  const displayDegOrDms = (unit: string, normalizedPoint, mapIsMercator?: boolean, outCrsUnit?: string) => {
    let { x, y } = normalizedPoint
    const orderXy = displayOrder === DisplayOrderType.xy
    // get unitRate
    const selectedSystem = coordinateSystem.find(item => item.id === selectedSystemId)
    const { crs } = selectedSystem
    const defaultUnit = outCrsUnit || getCSUnitByCrs(crs)
    const unitRate = getUnitRate(defaultUnit, unit, mapIsMercator)
    x = x * unitRate
    y = y * unitRate
    if (unit === 'DEGREE_MINUTE_SECONDS') {
      x = degToDMS(x, 'LON', coordinateDecimal, showSeparators)
      y = degToDMS(y, 'LAT', coordinateDecimal, showSeparators)
      orderXy ? setGeoInfo(`${x} ${y}`) : setGeoInfo(`${y} ${x}`)
    } else if (unit === 'DEGREES_DECIMAL_MINUTES') {
      //for hack DEGREES_DECIMAL_MINUTES
      x = degToDDM(x, coordinateDecimal, showSeparators, 'longitude')
      y = degToDDM(y, coordinateDecimal, showSeparators, 'latitude')
      orderXy ? setGeoInfo(`${x} ${y}`) : setGeoInfo(`${y} ${x}`)
    } else {
      const nlsUnit = unitToNls(unit)
      orderXy ? setGeoInfo(`${toFormat(x)} ${toFormat(y)} ${nlsUnit}`) : setGeoInfo(`${toFormat(y)} ${toFormat(x)} ${nlsUnit}`)
    }
  }

  const toFormat = (num) => {
    if (isNaN(num)) return ''
    return localizeNumberBySettingInfo(num, {
      places: coordinateDecimal,
      digitSeparator: showSeparators
    })
  }

  const displayProject = (unit: string, normalizedPoint, mapIsMercator?: boolean, outCrsUnit?: string) => {
    let { x, y } = normalizedPoint
    // get unitRate
    const selectedSystem = coordinateSystem.find(item => item.id === selectedSystemId)
    const { crs } = selectedSystem
    const defaultUnit = outCrsUnit || getCSUnitByCrs(crs)
    const unitRate = getUnitRate(defaultUnit, unit, mapIsMercator)
    x = x * unitRate
    y = y * unitRate
    const nlsUnit = unitToNls(unit)
    const orderXy = displayOrder === DisplayOrderType.xy
    orderXy ? setGeoInfo(`${toFormat(x)} ${toFormat(y)} ${nlsUnit}`) : setGeoInfo(`${toFormat(y)} ${toFormat(x)} ${nlsUnit}`)
  }

  const getDefaultUnits = (isGeographic: boolean, mapIsWebMercator: boolean, crs: any): string => {
    const userUnit = getUnits()
    let outputUnit = ''
    if (isGeographic) {
      outputUnit = getCSUnitByCrs(crs)
      if (!outputUnit) outputUnit = 'METER'
    } else {
      outputUnit = userUnit === 'english' ? 'FOOT' : 'METER'
    }
    //default show mercator is degrees.
    if (mapIsWebMercator) {
      outputUnit = 'DECIMAL_DEGREES'
    }
    return outputUnit
  }

  const _setElevInfo = (threeDPoint) => {
    const view = currentJimuMapView?.view
    if (!threeDPoint) {
      setElevInfo('')
      setElevNum(null)
      setElevUnit('')
      return
    }
    view.hitTest({
      x: threeDPoint.x,
      y: threeDPoint.y
    }).then(position => {
      let elev = ''
      // if (!isJustElev) {
      //   this._setLonLat(position);
      // }
      if (position.results && position.results[0] &&
        position.results[0].mapPoint && position.results[0].mapPoint.z) {
        elev = _getElev(position.results[0].mapPoint) // result elev(ray casting)
        setElevInfo(elev)
      } else if (typeof position !== 'undefined' && position.ground &&
        position.ground.mapPoint !== null && typeof position.ground.mapPoint.z !== 'undefined') {
        elev = _getElev(position.ground.mapPoint) // ground elev
      }
      setElevInfo(elev)
    })
  }

  const _getElev = (pos) => {
    let elev = ''
    if (pos && pos.z !== undefined) {
      const { num, unit } = tranNumToKmOrM(pos.z, true)
      const abbrUnit = unitAbbrMap[unit]
      setElevNum(num)
      setElevUnit(unit)
      elev = `${translate('elev', { ele: abbrUnit })} ${num} ${unit}`
    } else {
      setElevNum(null)
      setElevUnit('')
    }
    return elev
  }

  const _setEyeInfo = () => {
    const view = currentJimuMapView?.view
    if (!view || !view?.camera || !view?.camera?.position) {
      setEyeInfo('')
      setEyeNum(null)
      setEyeUnit('')
      return
    }
    const eyeAlt = view.camera.position?.z
    const { num, unit } = tranNumToKmOrM(eyeAlt)
    const abbrUnit = unitAbbrMap[unit]
    setEyeInfo(`${translate('eyeAlt', { alt: abbrUnit })} ${num} ${unit}`)
    setEyeNum(num)
    setEyeUnit(unit)
  }

  const tranNumToKmOrM = (num, isElev?: boolean) => {
    const selectedSystem = coordinateSystem.find(item => item.id === selectedSystemId)
    const { elevationUnit } = selectedSystem
    const isMetric = elevationUnit === ElevationUnitType.metric
    if (!num) return { num: 0, unit: isMetric ? unitMeters : unitFoot }
    let unit = ''
    let threshold = 1000
    num = parseFloat(num)
    if (isElev) {
      //switch to km if more than 10,000 m.
      threshold = 10000
    }
    if (isMetric) {
      if (num >= threshold || num <= -(threshold)) {
        num = num / 1000
        unit = unitKilometers
      } else {
        unit = unitMeters
      }
    } else {
      //show elevation in feet and not meters.
      num = num * 3.2808399
      unit = unitFoot
    }
    num = localizeNumberBySettingInfo(num, {
      places: altitudeDecimal,
      digitSeparator: showSeparators
    })
    return { num, unit }
  }

  const getOutputWkid = (selectedSystem: CoordinateConfig) => {
    const { wkid, displayUnit, crs } = selectedSystem
    const curWkidNum = parseInt(wkid)
    let outWkid = curWkidNum
    const curSr = new SpatialReference({ wkid: curWkidNum })
    const mapSr = new SpatialReference({ wkid: mapWkid.current })
    let outCrs
    if (!curSr.isGeographic) {
      const useDisplayUnit = displayUnit || getDefaultUnits(curSr.isGeographic, mapSr.isWebMercator, crs)
      if (isProjectUnit(useDisplayUnit)) {
        outWkid = curWkidNum
      } else { // geoUnit or USNG, MGRS
        // When output wkid is not used, need to use GEOGCS to find the outSR
        const spheroidStr = getWktKeyStr(crs, 'GEOGCS')
        outCrs = getCrsBySpheroidStr(spheroidStr)
        outWkid = outCrs?.wkid
      }
    }
    return outWkid
  }

  const displayOnClient = (mapPoint, threeDPoint?) => {
    // when the mouse pointer out of earth, show eyeInfo only
    if (!mapPoint || !mapPoint?.x || !mapPoint?.y) {
      setElevInfo('')
      setElevNum(null)
      setElevUnit('')
      setGeoInfo('')
      return
    }
    const copyMapPoint = Point.fromJSON(mapPoint.toJSON())
    const selectedSystem = coordinateSystem.find(item => item.id === selectedSystemId)
    const { displayUnit, wkid, crs } = selectedSystem
    const curWkidNum = parseInt(wkid)
    const curSr = new SpatialReference({ wkid: curWkidNum })
    const mapSr = new SpatialReference({ wkid: mapWkid.current })
    let { x, y } = mapPoint
    const convertInClient = (mapWkid.current === 4326 && curSr.isWebMercator) ||
      (curWkidNum === 4326 && mapSr.isWebMercator)
    let normalizedPoint = null
    // make sure longitude values stays within -180/180
    normalizedPoint = mapPoint.normalize()
    // get default units
    let outputUnit = displayUnit
    const systemDefaultUnit = getDefaultUnits(curSr.isGeographic, mapSr.isWebMercator, crs)
    // const systemDefaultUnit = getCSUnitByCrs(crs)
    if (!outputUnit) {
      outputUnit = systemDefaultUnit
    }
    // this means system output unit
    const isGeoUnit = isGeographicUnit(outputUnit)
    const isProUnit = isProjectUnit(outputUnit)
    if (isGeoUnit) {
      x = normalizedPoint.longitude || x
      y = normalizedPoint.latitude || y
      normalizedPoint.x = x
      normalizedPoint.y = y
    }

    // 'MGRS' & 'USNG' need to convert pro point to gcs point
    const convertPoint = projection.project(copyMapPoint, new SpatialReference({ wkid: getOutputWkid(selectedSystem) }))
    if (convertInClient) {
      // process special case
      if (mapPoint.spatialReference.wkid === 4326 && curSr.isWebMercator) {
        if (outputUnit === 'MGRS' || outputUnit === 'USNG') {
          displayUsngOrMgrs(outputUnit, convertPoint)
        } else if (isGeoUnit) {
          displayDegOrDms(outputUnit, normalizedPoint, mapSr.isWebMercator)
        } else if (isProUnit) {
          const mCoord = webMercatorUtils.lngLatToXY(x, y)
          displayProject(outputUnit, { x: mCoord[0], y: mCoord[1] }, mapSr.isWebMercator)
        }
      } else if (curWkidNum === 4326 && mapSr.isWebMercator) {
        if (outputUnit === 'MGRS' || outputUnit === 'USNG') {
          displayUsngOrMgrs(outputUnit, convertPoint)
        } else if (isGeoUnit) {
          displayDegOrDms(outputUnit, normalizedPoint, mapSr.isWebMercator)
        }
      }
    } else {
      // setting display units
      if (mapPoint.spatialReference.wkid === 4326 || mapPoint.spatialReference.isWebMercator) {
        if (outputUnit === 'MGRS' || outputUnit === 'USNG') {
          displayUsngOrMgrs(outputUnit, convertPoint)
        } else if (isGeoUnit) {
          displayDegOrDms(outputUnit, normalizedPoint, mapSr.isWebMercator)
        } else if (isProUnit) {
          displayProject(outputUnit, normalizedPoint, mapSr.isWebMercator)
        }
      } else { // proj or geo
        if (curSr.isGeographic) {
          if (outputUnit === 'MGRS' || outputUnit === 'USNG') {
            displayUsngOrMgrs(outputUnit, convertPoint)
          } else if (isGeoUnit) {
            displayDegOrDms(outputUnit, normalizedPoint, mapSr.isWebMercator)
          }
        } else {
          displayProject(outputUnit, normalizedPoint, mapSr.isWebMercator)
        }
      }
    }

    const view = currentJimuMapView?.view
    const viewTypeIsThree = view?.type === '3d'
    if (viewTypeIsThree) {
      _setEyeInfo()
      if (threeDPoint) _setElevInfo(threeDPoint)
    }
  }

  const onLocateClick = async () => {
    setGeoInfo('')
    setElevInfo('')
    setElevNum(null)
    setElevUnit('')
    setEyeInfo('')
    setEyeNum(null)
    setEyeUnit('')
    graphicsLayer.current.remove(markerGraphic.current)
    markerGraphic.current = null
    const selectedSystem = coordinateSystem.find(item => item.id === selectedSystemId)
    const canShowClient = await canShowInClient(selectedSystem)
    if (canShowClient) {
      if (!locateActive) {
        setShowTips(true)
        setShowMouseTips(false)
        setEnableRealtime(false)
      } else {
        setShowTips(false)
        setShowMouseTips(true)
        setEnableRealtime(true)
      }
    } else {
      setShowMouseTips(false)
      setEnableRealtime(false)
      if (!locateActive) {
        setShowTips(true)
      } else {
        setShowTips(false)
        setGeoInfo('')
      }
    }
    if (currentJimuMapView?.view) {
      const cursorType = locateActive ? 'default' : 'crosshair'
      currentJimuMapView.view.cursor = cursorType
    }
    setLocateActive(!locateActive)
  }

  const handleSystemChange = async (systemId: string) => {
    const selectedSystem = coordinateSystem.find(item => item.id === systemId)
    const canShowClient = await canShowInClient(selectedSystem)
    if (canShowClient) {
      setEnableRealtime(true)
      setShowMouseTips(true)
    } else {
      setEnableRealtime(false)
      setShowMouseTips(false)
    }
    setSelectedSystemId(systemId)
    setLocateActive(false)
    setShowTips(false)
    setGeoInfo('')
    setEyeInfo('')
    setEyeNum(null)
    setEyeUnit('')
    setElevInfo('')
    setElevNum(null)
    setElevUnit('')
    graphicsLayer.current.remove(markerGraphic.current)
    markerGraphic.current = null
  }

  const useMap = useMapWidgetIds?.length > 0
  if (!useMap) {
    return (
      <WidgetPlaceholder
        widgetId={id}
        icon={coordinatesIcon}
        data-testid='coordinatesPlaceholder'
        message={placeHolderName}
        css={css`
          & {
            ${controllerWidgetId && `
              min-height: 140px;
              min-width: 242px;
              .thumbnail-wrapper {
                padding: 46px 0 !important;
              }
            `}
          }
        `}
      />
    )
  }
  const locateBtnTips = locateActive ? disableClickTips : enableClickTips
  const isClassic = widgetStyle === WidgetStyleType.classic
  const hasSecondDivider = geoInfo || elevInfo
  const classicGeo = `${geoInfo}${elevInfo && `${geoInfo && ' | '}${elevInfo}`}${eyeInfo && `${hasSecondDivider && ' | '}${eyeInfo}`}`
  const classicInfo = showTips ? mapClickTips : (showMouseTips ? mouseMoveTips : classicGeo || enableClickTips)
  const hasElevOrEye = (eyeNum !== null) || (elevNum !== null)
  const elevText = translate('elev', { ele: unitAbbrMap[elevUnit] })
  const eyeAltText = translate('eyeAlt', { alt: unitAbbrMap[eyeUnit] })
  const modernInfo = (
    showTips
      ? mapClickTips
      : (showMouseTips
          ? mouseMoveTips
          : <div className='info-container'>
              <div className={`d-flex w-100 ${hasElevOrEye ? 'h-50' : 'h-100'}`}>
                {(geoInfo === computing || !geoInfo)
                  ? <div className='coordinates-computing'>{geoInfo || (hasElevOrEye ? '--' : enableClickTips)}</div>
                  : (widgetSizeAuto
                      ? <div className='coordinates-card-text-geo-fixed'>{geoInfo}</div>
                      : <TextAutoFit className='coordinates-card-text-geo' text={geoInfo} widgetRect={widgetRect} domChange={hasElevOrEye} />
                    )
                }
              </div>
              {hasElevOrEye &&
                <div className='h-50'>
                  <div className='text-fit-container'>
                    {elevNum !== null
                      ? (widgetSizeAuto
                          ? <div className='coordinates-card-text-fixed'>{elevNum}</div>
                          : <TextAutoFit className='coordinates-card-text' text={elevNum} widgetRect={widgetRect} />
                        )
                      : <div className='coordinates-card-text-empty'>--</div>
                    }
                    <div className='info-unit truncate-two' title={elevText}>{elevText}</div>
                  </div>
                  <div className='text-fit-container'>
                    {eyeNum !== null
                      ? (widgetSizeAuto
                          ? <div className='coordinates-card-text-fixed'>{eyeNum}</div>
                          : <TextAutoFit className='coordinates-card-text' text={eyeNum} widgetRect={widgetRect} />
                        )
                      : <div className='coordinates-card-text-empty'>--</div>
                    }
                    <div className='info-unit truncate-two' title={eyeAltText}>{eyeAltText}</div>
                  </div>
                </div>
              }
            </div>
        )
  )
  const infoTipsArr = [mapClickTips, mouseMoveTips, enableClickTips]
  const isDefaultTips = infoTipsArr.includes(classicInfo)
  const classicCopyDisable = enableRealtime || isDefaultTips || (!locateActive && !geoInfo)
  const modernCopyDisable = enableRealtime || isDefaultTips || (!locateActive && !classicInfo.trim())
  const hasSystem = coordinateSystem?.length > 0

  return (
    <div className='jimu-widget-coordinates jimu-widget h-100' css={getStyle(theme, isClassic, widgetRect, widgetSizeAuto)}>
      {isClassic
        ? <div className='coordinates-widget-container d-flex justify-content-between surface-1'>
          <Button
            icon
            size='sm'
            type='tertiary'
            onClick={onLocateClick}
            variant={locateActive ? 'contained' : 'text'}
            color={locateActive ? 'primary' : 'default'}
            title={locateBtnTips}
            aria-label={locateBtnTips}
            className='jimu-outline-inside coordinates-locate'
            disabled={!hasSystem}
            aria-pressed={locateActive}
          >
            <LocatorOutlined />
          </Button>
          <div className='coordinates-info text-truncate' title={classicInfo}>
            {classicInfo}
          </div>
          <CopyButton
            text={classicInfo}
            disabled={classicCopyDisable}
          />
          {hasSystem &&
            <Dropdown size='sm' activeIcon>
              <DropdownButton
                arrow={false}
                icon
                size='sm'
                type='tertiary'
                className='suspension-drop-btn jimu-outline-inside'
                title={changeSystem}
              >
                <DownOutlined />
              </DropdownButton>
              <DropdownMenu>
                {coordinateSystem.map(item => {
                  const isActivated = item.id === selectedSystemId
                  return (
                    <DropdownItem key={item.id} active={isActivated} onClick={() => handleSystemChange(item.id)}>
                      {item.name}
                    </DropdownItem>
                  )
                })}
              </DropdownMenu>
            </Dropdown>
          }
        </div>
        : <div className='coordinates-widget-container w-100 h-100 surface-1'>
        <Card className='h-100 coordinates-card'>
          <CardBody className='widget-card-content'>
            {modernInfo}
          </CardBody>
          <CardFooter className='widget-card-footer'>
            <div className='jimu-widget d-flex justify-content-between align-items-center'>
              <Button
                icon
                size='sm'
                type='tertiary'
                onClick={onLocateClick}
                variant={locateActive ? 'contained' : 'text'}
                color={locateActive ? 'primary' : 'default'}
                title={locateBtnTips}
                aria-label={locateBtnTips}
                aria-pressed={locateActive}
              >
                <LocatorOutlined />
              </Button>
              <div className='d-flex justify-content-between'>
                {classicInfo &&
                  <CopyButton
                    text={classicInfo}
                    disabled={modernCopyDisable}
                    className='coordinates-card-copy mr-1'
                  />
                }
                {hasSystem &&
                  <Dropdown size='sm' activeIcon>
                    <DropdownButton
                      arrow={false}
                      icon
                      size='sm'
                      type='tertiary'
                      className='suspension-drop-btn'
                      title={changeSystem}
                    >
                      <DownOutlined className='suspension-drop-btn' />
                    </DropdownButton>
                    <DropdownMenu>
                      {coordinateSystem.map(item => {
                        const isActivated = item.id === selectedSystemId
                        return (
                          <DropdownItem key={item.id} active={isActivated} onClick={() => handleSystemChange(item.id)}>
                            {item.name}
                          </DropdownItem>
                        )
                      })}
                    </DropdownMenu>
                  </Dropdown>
                }
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
      }
      <JimuMapViewComponent
        useMapWidgetId={useMapWidgetIds?.[0]}
        onActiveViewChange={onActiveViewChange}
      />
      <ReactResizeDetector
        handleWidth
        handleHeight
        onResize={debounceOnResize}
      />
    </div>
  )
}

export default Widget
