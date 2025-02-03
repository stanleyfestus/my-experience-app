import { React } from 'jimu-core'
import { DisplayType, type RouteInfoFromDataAction, type DynSegFieldInfo, type TableEdits } from '../../config'
import { type JimuMapView } from 'jimu-arcgis'

export interface DynSegRuntimeState {
  pendingEdits?: Map<string, TableEdits>
  records?: __esri.Graphic[]
  originalRecords?: __esri.Graphic[]
  selectedRecordIds?: number[]
  fieldInfo?: DynSegFieldInfo[]
  errorCount?: number
  isLoading?: boolean
  display?: DisplayType
  routeInfo?: RouteInfoFromDataAction
  jimuMapView?: JimuMapView
  highlightLayer: __esri.GraphicsLayer
  highlightColor: string
  selectedSldId?: string // selected SLD id, uses trackId - trackRecordId
  outputDataSources?: string[]
}

const initialState: DynSegRuntimeState = {
  pendingEdits: new Map<string, TableEdits>(),
  records: [],
  originalRecords: [],
  selectedRecordIds: [],
  fieldInfo: [],
  errorCount: 0,
  isLoading: false,
  display: DisplayType.Table,
  routeInfo: {
    networkInfo: undefined,
    fromMeasure: 0,
    toMeasure: 0
  },
  jimuMapView: undefined,
  highlightLayer: null,
  highlightColor: '#65adff',
  selectedSldId: '',
  outputDataSources: []
}

const reducer = (state: DynSegRuntimeState, action) => {
  switch (action.type) {
    case 'SET_EDITS':
      return { ...state, pendingEdits: action.value }
    case 'SET_RECORDS':
      return { ...state, records: action.value }
    case 'SET_ORIGINAL_RECORDS':
      return { ...state, originalRecords: action.value }
    case 'SET_SELECTED_RECORD_IDS':
      return { ...state, selectedRecordIds: action.value }
    case 'SET_FIELD_INFO':
      return { ...state, fieldInfo: action.value }
    case 'SET_ERROR_COUNT':
      return { ...state, errorCount: action.value }
    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.value }
    case 'SET_DISPLAY':
      return { ...state, display: action.value }
    case 'SET_ROUTE_INFO':
      return { ...state, routeInfo: action.value }
    case 'SET_JIMU_MAP_VIEW':
      return { ...state, jimuMapView: action.value }
    case 'SET_HIGHLIGHT_LAYER':
      return { ...state, highlightLayer: action.value }
    case 'SET_HIGHLIGHT_COLOR':
      return { ...state, highlightColor: action.value }
    case 'SET_SELECTED_SLD_ID':
      return { ...state, selectedSldId: action.value }
    case 'SET_OUTPUT_DATA_SOURCES':
      return { ...state, outputDataSources: action.value }
    case 'RESET_STATE':
      return {
        ...initialState,
        isLoading: true,
        display: state.display,
        jimuMapView: state.jimuMapView,
        highlightLayer: state.highlightLayer,
        highlightColor: state.highlightColor,
        outputDataSources: state.outputDataSources
      }
    default:
      return state
  }
}

const DynSegRuntimeStateContext = React.createContext<DynSegRuntimeState>(undefined)
const DynSegRuntimeDispatchContext = React.createContext<React.Dispatch<any>>(undefined)

interface DynSegRuntimeStateProviderProps {
  defaultState?: DynSegRuntimeState
  children: React.ReactNode
}

export const DynSegRuntimeStateProvider = (props: DynSegRuntimeStateProviderProps) => {
  const { defaultState, children } = props

  const [state, dispatch] = React.useReducer<typeof reducer>(reducer, defaultState || initialState)

  return <DynSegRuntimeStateContext.Provider value={state}>
    <DynSegRuntimeDispatchContext.Provider value={dispatch}>
      {children}
    </DynSegRuntimeDispatchContext.Provider>
  </DynSegRuntimeStateContext.Provider>
}

export const useDynSegRuntimeState = () => {
  return React.useContext(DynSegRuntimeStateContext)
}

export const useDynSegRuntimeDispatch = () => {
  return React.useContext(DynSegRuntimeDispatchContext)
}
