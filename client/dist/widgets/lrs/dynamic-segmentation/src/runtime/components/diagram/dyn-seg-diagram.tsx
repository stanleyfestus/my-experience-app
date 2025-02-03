/** @jsx jsx */
import {
  type ImmutableArray,
  type ImmutableObject,
  React,
  jsx
} from 'jimu-core'
import { type SubtypeLayers, type MeasureRange, type Track, type TrackRecord, type DynSegFieldInfo } from '../../../config'
import { Sidebar } from './sidebar/sidebar'
import { Sld } from './sld/sld'
import { useContainerDimensions } from './resizer'
import { SLD_INACTIVE_HEIGHT, SLD_TRACK_HEIGHT } from '../../../constants'
import { Header } from './header/header'
import { Marker } from './sld/marker'
import { isDefined, type LrsLayer, type NetworkInfo } from 'widgets/shared-code/lrs'
import { getMFromX } from '../../utils/diagram-utils'
import { EditPopup } from './edit-popup/edit-popup'

export interface DynSegDiagramProps {
  widgetId: string
  trackMap: Map<string, Track>
  measureRange: MeasureRange
  defaultRange: number
  featureLayer: __esri.FeatureLayer
  subtypeLayers: SubtypeLayers[]
  networkInfo: ImmutableObject<NetworkInfo>
  lrsLayers: ImmutableArray<LrsLayer>
  showEventStatistics: boolean
}

export function DynSegDiagram (props: DynSegDiagramProps) {
  const { widgetId, trackMap, measureRange, defaultRange, featureLayer, subtypeLayers, networkInfo, lrsLayers, showEventStatistics } = props
  const [sidebarWidth, setSidebarWidth] = React.useState(200)
  const [isResizing, setIsResizing] = React.useState(false)
  const [isScrolling, setIsScrolling] = React.useState(false)
  const [zoom, setZoom] = React.useState(0)
  const [scrollPos, setScrollPos] = React.useState(0)
  const ref = React.useRef(null)
  const sldRef = React.useRef(null)
  const sidebarRef = React.useRef(null)
  const { refWidth } = useContainerDimensions(ref)
  const mouseCoords = React.useRef({ startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 })
  const [currentTrackMap, setCurrentTrackMap] = React.useState(trackMap)
  const [rulerX, setRulerX] = React.useState(0)
  const [rulerM, setRulerM] = React.useState(NaN)
  const [snapTolearnce, setSnapTolerance] = React.useState<number>(0)
  const [showRulerPopup, setShowRulerPopup] = React.useState(false)
  const [showRulerHover, setShowRulerHover] = React.useState(false)
  const [trackToEdit, setTrackToEdit] = React.useState<Track>(null)
  const [trackRecordToEdit, setTrackRecordToEdit] = React.useState<TrackRecord>(null)
  const [trackFieldInfos, setTrackFieldInfos] = React.useState<DynSegFieldInfo[]>([])

  React.useEffect(() => {
    setCurrentTrackMap(trackMap)
  }, [trackMap])

  React.useEffect(() => {
    const rangeDiff = measureRange.to - measureRange.from
    const displayRatio = rangeDiff / defaultRange
    if (displayRatio < 1) {
      setZoom(1)
    } else {
      setZoom(displayRatio)
    }
  }, [defaultRange, measureRange])

  //#region sidebar events
  const handleResizeMouseDown = (event) => {
    setIsResizing(true)
    event.preventDefault()
  }

  const handleZoomChange = React.useCallback((zoom: number) => {
    setZoom(zoom)
  }, [])

  const handleOnNavForwardOrBack = (forward: boolean) => {
    if (!sldRef.current) return
    const slider = sldRef.current
    const scrollLeft = slider.scrollLeft
    const clientWidth = slider.clientWidth
    const scrollStep = clientWidth
    if (forward) {
      slider.scrollLeft = scrollLeft + scrollStep
    } else {
      slider.scrollLeft = scrollLeft - scrollStep
    }
  }

  const handleOnNavStartOrEnd = (end: boolean) => {
    if (!sldRef.current) return
    const slider = sldRef.current
    if (end) {
      slider.scrollLeft = slider.scrollWidth
    } else {
      slider.scrollLeft = 0
    }
  }

  const handleTrackMapChanged = (trackMap: Map<string, Track>) => {
    setCurrentTrackMap(trackMap)
  }
  //#endregion

  //#region sld events
  const handleSldMouseDown = (event) => {
    if (!sldRef.current) return
    const horizontalSlider = sldRef.current
    const verticalSlider = sidebarRef.current
    const startX = event.pageX - horizontalSlider.offsetLeft
    const startY = event.pageY - verticalSlider.offsetTop
    const scrollLeft = horizontalSlider.scrollLeft
    const scrollTop = verticalSlider.scrollTop
    mouseCoords.current = { startX, startY, scrollLeft, scrollTop }
    setIsScrolling(true)
    document.body.style.cursor = 'grabbing'
  }

  const handleMouseUp = (event) => {
    setIsResizing(false)
    if (isScrolling) {
      setIsScrolling(false)
      if (!sldRef.current) return
      document.body.style.cursor = 'default'
    }
  }

  const handleMouseMove = (event) => {
    if (isResizing && !isScrolling) {
      if (event.pageX < 140) return
      setSidebarWidth(event.pageX)
    }
    if (!isResizing && isScrolling && sldRef.current) {
      event.preventDefault()
      const horizontalSlider = sldRef.current
      const verticalSlider = sidebarRef.current
      const x = event.pageX - horizontalSlider.offsetLeft
      const y = event.pageY - verticalSlider.offsetTop
      const walkX = (x - mouseCoords.current.startX) * 1.5
      const walkY = (y - mouseCoords.current.startY) * 1.5
      horizontalSlider.scrollLeft = mouseCoords.current.scrollLeft - walkX
      verticalSlider.scrollTop = mouseCoords.current.scrollTop - walkY
    }
  }

  const handleSideBarScroll = (e) => {
    if (sldRef.current) {
      sldRef.current.scrollTop = e.target.scrollTop
    }
  }

  const handleSldScroll = (e) => {
    setScrollPos(e.target.scrollLeft)
    if (sidebarRef.current) {
      sidebarRef.current.scrollTop = e.target.scrollTop
    }
    if (sldRef.current) {
      sldRef.current.scrollTop = e.target.scrollTop
    }
    setRulerM(getRulerM(rulerX))
  }
  //#endregion

  //#region ruler events
  const handleOnRulerClickOrHovered = (e, clicked: boolean, hover: boolean) => {
    if (!isDefined(e)) {
      setRulerX(NaN)
      setRulerM(NaN)
    } else {
      setRulerX(getRulerX(e))
      setRulerM(getRulerM(getRulerX(e)))
      setSnapTolerance(getRulerM(getRulerX(e) + 10) - getRulerM(getRulerX(e)))
    }
    setShowRulerPopup(clicked)
    setShowRulerHover(hover)
  }

  const getRulerM = (x: number, newScrollPos?: number): number => {
    if (isNaN(x)) return NaN
    let currentScrollPos = scrollPos
    if (isDefined(newScrollPos)) {
      currentScrollPos = newScrollPos
    }
    let xOffset = currentScrollPos + (x - sidebarWidth)
    if (xOffset < 0) {
      // Should never be less than 0
      xOffset = 0
    }
    return getMFromX(xOffset, measureRange, getSldContentWidth)
  }

  const getRulerX = (e: any): number => {
    const target = e.currentTarget
    const bounds = target.getBoundingClientRect()
    return (e.clientX - bounds.left) + sidebarWidth
  }

  const getMaxPopupHeight = (): number => {
    if (!ref.current) return 0
    return ref.current.clientHeight - (ref.current.clientHeight * 0.3)
  }
  //#endregion

  const handleEditItem = (trackRecord: TrackRecord, track: Track, fieldInfos: DynSegFieldInfo[]) => {
    setTrackToEdit(track)
    setTrackRecordToEdit(trackRecord)
    setTrackFieldInfos(fieldInfos)
    setShowRulerPopup(false)
    setShowRulerHover(false)
  }

  const handleEditItemDone = () => {
    setTrackToEdit(null)
    setTrackRecordToEdit(null)
    setTrackFieldInfos(null)
  }

  const handleApplyEdit = (track: Track) => {
    const updatedTrackMap = new Map(currentTrackMap)
    updatedTrackMap.set(track.layerName, track)
    setCurrentTrackMap(updatedTrackMap)
  }

  const getScrollbarWidth = React.useMemo(() => {
    const el = document.createElement('div')
    el.style.cssText = 'overflow:scroll; visibility:hidden; position:absolute;'
    document.body.appendChild(el)
    const width = el.offsetWidth - el.clientWidth
    el.remove()
    return width
  }, [])

  const getSidebarDisplayHeight = React.useMemo(() => {
    let height = 0
    currentTrackMap.forEach((track) => {
      if (track.isActive) {
        height += SLD_TRACK_HEIGHT
      } else {
        height += SLD_INACTIVE_HEIGHT
      }
    })
    return height + getScrollbarWidth
  }, [getScrollbarWidth, currentTrackMap])

  const getSldDisplayHeight = React.useMemo(() => {
    let height = 0
    currentTrackMap.forEach((track) => {
      if (track.isActive) {
        height += SLD_TRACK_HEIGHT
      } else {
        height += SLD_INACTIVE_HEIGHT
      }
    })
    return height
  }, [currentTrackMap])

  const getSldWidth = React.useMemo((): number => {
    return refWidth - sidebarWidth - getScrollbarWidth
  }, [getScrollbarWidth, refWidth, sidebarWidth])

  const getSldContentWidth = React.useMemo((): number => {
    return (refWidth - sidebarWidth - getScrollbarWidth) * zoom
  }, [getScrollbarWidth, refWidth, sidebarWidth, zoom])

  return (
   <div ref={ref}
    className="dyn-seg-diagram-container h-100 w-100 d-flex"
    style={{ flexDirection: 'column' }}
    onMouseUp={handleMouseUp}
    onMouseMove={handleMouseMove}
    >
    <EditPopup
      widgetId={widgetId}
      track={trackToEdit}
      trackRecord={trackRecordToEdit}
      trackFieldInfos={trackFieldInfos}
      lrsLayers={lrsLayers}
      subtypeLayers={subtypeLayers}
      networkInfo={networkInfo}
      showEventStatistics={showEventStatistics}
      onApply={handleApplyEdit}
      onClose={handleEditItemDone}
    />
    <Marker
      x={rulerX}
      m={rulerM}
      snapTolerance={snapTolearnce}
      isPopupActive={showRulerPopup}
      isHoverActive={showRulerHover}
      trackMap={currentTrackMap}
      featureLayer={featureLayer}
      subtypeLayers={subtypeLayers}
      maxHeight={getMaxPopupHeight()}
      networkInfo={networkInfo}
      measureRange={measureRange}
      contentWidth={getSldContentWidth}
      sidebarWidth={sidebarWidth}
      scrollPos={scrollPos}
    />
    <Header
      sidebarWidth={sidebarWidth}
      bodyWidth={getSldWidth}
      contentWidth={getSldContentWidth}
      measureRange={measureRange}
      zoom={zoom}
      scrollPosition={scrollPos}
      onZoomChange={handleZoomChange}
      onNavForwardOrBack={handleOnNavForwardOrBack}
      onNavStartOrEnd={handleOnNavStartOrEnd}
      onClickOrHover={handleOnRulerClickOrHovered}
    />
    <div className='diagram-container h-100 w-100 d-flex' >
      <div
        ref={sidebarRef}
        className='sidebar-container h-100 d-flex'
        onScroll={handleSideBarScroll}>
        <Sidebar
          trackMap={currentTrackMap}
          width={sidebarWidth}
          height={getSidebarDisplayHeight}
          onTrackChanged={handleTrackMapChanged}/>
        <div
          className="sidebar-resizer d-flex"
          style={{ height: getSidebarDisplayHeight }}
          onMouseDown={handleResizeMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        />
      </div>
      <div ref={sldRef}
        className='sld-container h-100'
        onScroll={handleSldScroll}
        onMouseDown={handleSldMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}>
        <Sld
          trackMap={currentTrackMap}
          containerWidth={getSldWidth}
          height={getSldDisplayHeight}
          contentWidth={getSldContentWidth}
          measureRange={measureRange}
          featureLayer={featureLayer}
          subtypeLayers={subtypeLayers}
          onItemClick={handleEditItem}/>
      </div>
    </div>
  </div>
  )
}
