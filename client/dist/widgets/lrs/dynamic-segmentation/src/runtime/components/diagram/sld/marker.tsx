/** @jsx jsx */
import { CalcitePopover } from 'calcite-components'
import {
  type DataSource,
  type FeatureLayerDataSource,
  type ImmutableObject,
  React, jsx,
  loadArcGISJSAPIModule,
  polished
} from 'jimu-core'
import { type MeasureRange, type DynSegFieldInfo, type SubtypeLayers, type Track, type TrackRecord } from 'widgets/lrs/dynamic-segmentation/src/config'
import { atOrBetween, getMapAllLayers, isDefined, isWithinTolerance, type NetworkInfo } from 'widgets/shared-code/lrs'
import { useDynSegRuntimeState } from '../../../state'
import { getDisplayFieldInfo, getDisplayFieldValue, getGraphic, getXFromM } from '../../../utils/diagram-utils'
import { rgba } from 'polished'
import { Label } from 'jimu-ui'
import { getTheme } from 'jimu-theme'

export interface MarkerProps {
  x: number
  m: number
  snapTolerance: number
  isPopupActive: boolean
  isHoverActive: boolean
  trackMap: Map<string, Track>
  featureLayer: __esri.FeatureLayer
  subtypeLayers: SubtypeLayers[]
  maxHeight: number
  networkInfo: ImmutableObject<NetworkInfo>
  measureRange: MeasureRange
  contentWidth: number
  sidebarWidth: number
  scrollPos: number
}

export interface RecordAttributes {
  displayField: string
  displayValue: string
  background: string
  order: number
}

export function Marker (props: MarkerProps) {
  const {
    x,
    m,
    snapTolerance,
    isPopupActive,
    isHoverActive,
    trackMap,
    featureLayer,
    subtypeLayers,
    maxHeight,
    networkInfo,
    measureRange,
    contentWidth,
    sidebarWidth,
    scrollPos
  } = props
  const [attributesToDisplay, setAttributesToDisplay] = React.useState<Map<string, RecordAttributes>>(new Map())
  const { fieldInfo } = useDynSegRuntimeState()
  const [symbolUtils, setSymbolUtils] = React.useState<typeof __esri.symbolUtils>(null)
  const { jimuMapView } = useDynSegRuntimeState()
  const [snapX, setSnapX] = React.useState<number>(x)
  const [snapM, setSnapM] = React.useState<number>(m)
  const ref = React.useRef(null)
  const theme = getTheme()

  React.useEffect(() => {
    const loadDisplay = async () => {
      const attributeMap = new Map<string, RecordAttributes>()
      if (!isNaN(m)) {
        const snapping = snapToPoint()
        setSnapX(snapping[0])
        setSnapM(snapping[1])
        await Promise.all([...trackMap.keys()].map(async (trackKey) => {
          if (trackMap.get(trackKey).isActive) {
            await Promise.all(trackMap.get(trackKey).records.map(async (record) => {
              if (record.hasValue && isWithinRange(record, snapping[1])) {
                const fields = getFields(trackMap.get(trackKey).layerName)
                const fieldInfos = getFieldInfos(trackMap.get(trackKey).layerName)
                const key = trackMap.get(trackKey).index.toString() + '-' + record.index.toString()
                const background = await getDisplayBackground(trackMap.get(trackKey), record)
                const RecordAttributes: RecordAttributes = {
                  displayField: getDisplayFieldInfo(fieldInfos, record).originalFieldAlias,
                  displayValue: getDisplayFieldValue(fields, fieldInfo, record, subtypeLayers),
                  background: background,
                  order: trackMap.get(trackKey).index
                }
                attributeMap.set(key, RecordAttributes)
              }
            }))
          }
          return trackKey
        })).then(() => {
          setAttributesToDisplay(attributeMap)
        })
      }
    }

    if (!isNaN(m)) {
      loadDisplay()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [m])

  const allLayersDS = React.useMemo(() => {
    if (jimuMapView) {
      return getMapAllLayers(jimuMapView.mapWidgetId)
    }
  }, [jimuMapView])

  const getSymbolUtils = async (): Promise<typeof __esri.symbolUtils> => {
    if (symbolUtils) {
      return symbolUtils
    } else {
      const symbolUtil = await loadArcGISJSAPIModule('esri/symbols/support/symbolUtils')
      setSymbolUtils(symbolUtil)
      return symbolUtil
    }
  }

  const getFieldInfos = (layerName: string): DynSegFieldInfo[] => {
    return fieldInfo.filter((field) => field.eventName === layerName)
  }

  const getFields = (layerName: string): __esri.Field[] => {
    if (isDefined(featureLayer)) {
      return featureLayer.fields.filter(f => f.alias.includes('.') && f.alias.split('.')[0] === layerName)
    }
    return null
  }

  const getDisplayBackground = async (track: Track, record: TrackRecord): Promise<string> => {
    const [symbolUtils, graphic] = await Promise.all([getSymbolUtils(), getGraphic(record, null, true)])
    const featureDS = getLayer(track) as FeatureLayerDataSource
    const displayColor = await symbolUtils.getDisplayedColor(graphic, { renderer: featureDS.layer.renderer })
    if (!isDefined(displayColor)) {
      return rgba(255, 255, 255, 0)
    }
    return rgba(displayColor.r, displayColor.g, displayColor.b, 0.5)
  }

  const getLayer = (track: Track): DataSource => {
    if (isDefined(allLayersDS) && allLayersDS.length) {
      const layer = allLayersDS.find((ds) => {
        const fs = ds as FeatureLayerDataSource
        return fs.layer.layerId.toString() === track.layerId
      })
      if (isDefined(layer)) {
        return layer
      }
    }
    return null
  }

  const snapToPoint = (): [number, number] => {
    const mTolerance = networkInfo?.mTolerance
    const keys = [...trackMap.keys()]
    for (let i = 0; i < keys.length; i++) {
      const track = trackMap.get(keys[i])
      if (track.isActive) {
        for (let j = 0; j < track.records.length; j++) {
          const record = track.records[j]
          if (record.isPoint && record.hasValue) {
            if (atOrBetween([m - snapTolerance, m + snapTolerance], record.fromMeasure, mTolerance)) {
              return [getMAtX(record.fromMeasure), record.fromMeasure]
            }
          }
        }
      }
    }
    return [x, m]
  }

  const getMAtX = (m: number): number => {
    if (isNaN(m)) return NaN
    const x = getXFromM(m, measureRange, contentWidth) + sidebarWidth - scrollPos
    return Math.floor(x)
  }

  const isWithinRange = (record: TrackRecord, snappedM: number): boolean => {
    const mTolerance = networkInfo?.mTolerance
    if (isWithinTolerance(snappedM, record.fromMeasure, mTolerance) || isWithinTolerance(snappedM, record.toMeasure, mTolerance)) {
      return true
    }
    if (!record.isPoint && snappedM > record.fromMeasure && snappedM < record.toMeasure) {
      return true
    }
    return false
  }

  const getPrecision = () => {
    if (isDefined(networkInfo)) {
      return networkInfo.measurePrecision
    }
    return 0
  }

  const showPopup = (): boolean => {
    return isPopupActive || isHoverActive
  }

  const getSortedKeys = (): string[] => {
    const sortedMap = new Map([...attributesToDisplay.entries()].sort((a, b) => a[1].order - b[1].order))
    return [...sortedMap.keys()]
  }

  const getMeasureCount = (): number => {
    if (isNaN(snapM)) {
      return 0
    }
    const value = snapM.toFixed(getPrecision())
    return value.toString().length
  }

  const getMinWidth = (): number => {
    const count = getMeasureCount()
    return count * 12
  }

  return (
  <div
    ref={ref}
    id='sld-marker'
    className={`sld-marker sld-marker--pointer ${showPopup() ? 'sld-is-visible' : ''} `}
    style={{ left: !isNaN(snapX) ? snapX : 0 }}>
    <CalcitePopover
      id='sld-marker-popover'
      style={{
        minWidth: getMinWidth() + 'px',
        borderRadius: '5px',
        boxShadow: '4px 4px 8px 2px rgba(0, 0, 0, 0.3)',
        border: `1px solid ${polished.rgba(theme.sys.color.surface.overlayHint, 0.5)}`
      }}
          autoClose={undefined}
          closable={undefined}
          open={showPopup() ? true : undefined}
          overlayPositioning='absolute'
          placement='auto-start'
          offsetDistance={15}
          offsetSkidding={10}
          scale='s'
          label={snapM.toFixed(getPrecision())}
          heading={snapM.toFixed(getPrecision())}
          referenceElement={'sld-marker'}>
          {isPopupActive &&
             <div style={{
               padding: '10px',
               textWrap: 'nowrap',
               maxHeight: maxHeight,
               overflow: 'auto'
             }}>
              {getSortedKeys().map((key) => {
                return (
                  <span key={key}>
                    <div
                      style={{
                        background: attributesToDisplay.get(key).background,
                        marginBottom: '3px'
                      }}>
                      <Label
                        centric={true}
                        style={{ margin: '2px 5px' }}>
                        {`${attributesToDisplay.get(key).displayField}: ${attributesToDisplay.get(key).displayValue}`}
                      </Label>
                    </div>
                  </span>
                )
              })}
            </div>
          }
      </CalcitePopover>
  </div>

  )
}
