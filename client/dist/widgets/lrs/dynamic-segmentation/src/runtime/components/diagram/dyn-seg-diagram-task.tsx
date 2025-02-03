/** @jsx jsx */
import {
  type IntlShape,
  React,
  jsx,
  type ImmutableArray,
  type ImmutableObject
} from 'jimu-core'
import { isDefined, type NetworkInfo, type LrsLayer } from 'widgets/shared-code/lrs'
import { type Track, type AttributeSetParam, type MeasureRange, type SubtypeLayers } from '../../../config'
import { getSubtypeLayers } from '../../utils/feature-layer-utils'
import { getFieldInfo } from '../../utils/table-utils'
import { getRecordsAsTracks } from '../../utils/diagram-utils'
import { useDynSegRuntimeDispatch } from '../../state'
import { DynSegDiagram } from './dyn-seg-diagram'

export interface DynSegDiagramTaskProps {
  intl: IntlShape
  widgetId: string
  featureLayer: __esri.FeatureLayer
  records: __esri.Graphic[]
  lrsLayers: ImmutableArray<LrsLayer>
  attributeSet: AttributeSetParam[]
  measureRange: MeasureRange
  defaultRange: number
  networkInfo: ImmutableObject<NetworkInfo>
  showEventStatistics: boolean
}

export function DynSegDiagramTask (props: DynSegDiagramTaskProps) {
  const { widgetId, featureLayer, records, lrsLayers, attributeSet, measureRange, defaultRange, networkInfo, showEventStatistics } = props
  const [showDiagram, setShowDiagram] = React.useState<boolean>(true)
  const [trackMap, setTrackMap] = React.useState<Map<string, Track>>(new Map())
  const [subTypeInfo, setSubTypeInfo] = React.useState<SubtypeLayers[]>([])

  const dispatch = useDynSegRuntimeDispatch()

  React.useEffect(() => {
    if (isDefined(records)) {
      loadRecords(records)
    } else {
      resetState()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadRecords = async (records: __esri.Graphic[]) => {
    const subtypeLayers = await getSubtypeLayers(lrsLayers, attributeSet)
    const allFieldInfo = getFieldInfo(featureLayer, lrsLayers, subtypeLayers)
    const tracks = await getRecordsAsTracks(records, allFieldInfo, lrsLayers, attributeSet, measureRange, networkInfo)
    dispatch({ type: 'SET_FIELD_INFO', value: allFieldInfo })
    dispatch({ type: 'SET_IS_LOADING', value: false })
    setTrackMap(tracks)
    setShowDiagram(true)
    setSubTypeInfo(subtypeLayers)
  }

  const resetState = () => {
    dispatch({ type: 'SET_FIELD_INFO', value: [] })
    setShowDiagram(false)
  }

  return (
   <div className="dyn-seg-diagram h-100 w-100 d-flex">
      {showDiagram && (
        <DynSegDiagram
          widgetId={widgetId}
          trackMap={trackMap}
          measureRange={measureRange}
          defaultRange={defaultRange}
          featureLayer={featureLayer}
          subtypeLayers={subTypeInfo}
          networkInfo={networkInfo}
          lrsLayers={lrsLayers}
          showEventStatistics={showEventStatistics}
          />
      )}
  </div>
  )
}
