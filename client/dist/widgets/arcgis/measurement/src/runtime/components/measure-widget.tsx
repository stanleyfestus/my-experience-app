/** @jsx jsx */
import { React, jsx, css, classNames, AppMode, type IMState, ReactRedux, loadArcGISJSAPIModules, hooks, type IMThemeVariables } from 'jimu-core'
import { type JimuMapView } from 'jimu-arcgis'
import { Button, Loading, LoadingType, Popper, getFallbackPlacementsModifier } from 'jimu-ui'
import type DistanceMeasurement2D from '@arcgis/core/widgets/DistanceMeasurement2D'
import type AreaMeasurement2D from '@arcgis/core/widgets/AreaMeasurement2D'
import type DirectLineMeasurement3D from '@arcgis/core/widgets/DirectLineMeasurement3D'
import type AreaMeasurement3D from '@arcgis/core/widgets/AreaMeasurement3D'
import type * as reactiveUtils from '@arcgis/core/core/reactiveUtils'
import { MeasurementArrangement, type MeasurementClass, type IMConfig, type MeasureButton, type MeasureState } from '../../config'
import { Global, useTheme } from 'jimu-theme'

interface MeasureWidgetProps {
  id: string
  config: IMConfig
  jimuMapView: JimuMapView
  activeButton: MeasureButton['name']
  activeTool: MeasurementClass
  setActiveTool: (tool: MeasurementClass) => void
  rootRef: React.MutableRefObject<HTMLDivElement>
  translate: (id: string, values?: any) => string
  onClear: () => void
}

const overrideCalciteVars = (theme: IMThemeVariables) => `
  --calcite-color-text-inverse: ${theme.components?.button?.variants?.primary?.default?.color} !important;
  --calcite-color-brand: ${theme.components?.button?.variants?.primary?.default?.bg} !important;
  --calcite-color-brand-hover: ${theme.components?.button?.variants?.primary?.hover?.bg} !important;
`

const getStyle = (theme: IMThemeVariables, measureState: MeasureState) => css`
&.measure-panel {
  border-top: 1px solid var(--sys-color-divider-primary);
  overflow: auto;
  .measure-clear {
    padding: 0 15px 12px 15px;
    button {
      width: 100%;
      height: 32px;
    }
  }
  .esri-widget {
    background-color: transparent !important;
  }
  ${overrideCalciteVars(theme)}
  ${['disabled', 'ready'].includes(measureState)
    ? css`
    height: calc(100% - 42px);
    .esri-widget--panel {
      height: 100%;
      .esri-measurement-widget-content {
        height: 100%;
        .esri-measurement-widget-content__hint {
          height: 100%;
          display: grid;
          place-items: center;
          text-align: center;
        }
      }
    }`
    : ''}
}
`

const popperModifiers = [
  getFallbackPlacementsModifier(['top-start']),
  {
    name: 'preventOverflow',
    enabled: true,
    options: {
      boundariesElement: 'viewport',
      padding: 0
    }
  }
]

interface JsApiModules {
  DistanceMeasurement2D: DistanceMeasurement2D
  AreaMeasurement2D: AreaMeasurement2D
  DirectLineMeasurement3D: DirectLineMeasurement3D
  AreaMeasurement3D: AreaMeasurement3D
  reactiveUtils: reactiveUtils
}

interface MapViewWidget {
  [jimuMapViewId: string]: {
    measureDistance?: DistanceMeasurement2D | DirectLineMeasurement3D
    measureArea?: AreaMeasurement2D | AreaMeasurement3D
  }
}

export default function MeasureWidget (props: MeasureWidgetProps): React.ReactElement {
  const { id, config, activeButton, jimuMapView, activeTool, setActiveTool, rootRef, translate, onClear } = props
  const {
    defaultDistanceUnit = 'metric',
    defaultAreaUnit = 'metric',
    arrangement = MeasurementArrangement.Classic
  } = config

  const [loading, setLoading] = React.useState(false)
  const [jsApiModules, setJsApiModules] = React.useState<JsApiModules>(null)
  React.useEffect(() => {
    setLoading(true)
    loadArcGISJSAPIModules([
      'esri/widgets/DistanceMeasurement2D',
      'esri/widgets/AreaMeasurement2D',
      'esri/widgets/DirectLineMeasurement3D',
      'esri/widgets/AreaMeasurement3D',
      'esri/core/reactiveUtils'
    ]).then((modules) => {
      const [DistanceMeasurement2D, AreaMeasurement2D, DirectLineMeasurement3D, AreaMeasurement3D, reactiveUtils] = modules
      setJsApiModules({ DistanceMeasurement2D, AreaMeasurement2D, DirectLineMeasurement3D, AreaMeasurement3D, reactiveUtils })
      setLoading(false)
    })
  }, [])

  const panelRef = React.useRef<HTMLDivElement>(null)
  const popperRef = React.useRef<HTMLDivElement>(null)
  const mapViewWidgetRef = React.useRef<MapViewWidget>({})
  const watchRef = React.useRef<IHandle>(null)
  React.useEffect(() => {
    Object.values(mapViewWidgetRef.current).forEach(mapViewWidget => {
      mapViewWidget.measureDistance && (mapViewWidget.measureDistance.viewModel.unit = defaultDistanceUnit)
      mapViewWidget.measureArea && (mapViewWidget.measureArea.viewModel.unit = defaultAreaUnit)
    })
  }, [defaultDistanceUnit, defaultAreaUnit])
  const isToolbarArrangement = arrangement === MeasurementArrangement.Toolbar
  const containerRef = isToolbarArrangement ? popperRef : panelRef
  const [measureState, setMeasureState] = React.useState<MeasureState>('disabled')
  const jimuMapViewRef = hooks.useLatest(jimuMapView)
  React.useEffect(() => {
    const jimuMapView = jimuMapViewRef.current
    if (!jimuMapView?.view || !containerRef.current || !jsApiModules) return
    // hide previous tool, if `ready` or `measuring`, clear
    const prevTool = activeTool
    if (typeof prevTool?.container === 'object' && prevTool?.container !== null) {
      prevTool.container.style.visibility = 'hidden'
      prevTool.container.style.height = '0'
      prevTool.container.style.overflow = 'hidden'
    }
    const prevState = prevTool?.viewModel?.state
    if (['ready', 'measuring'].includes(prevState)) {
      prevTool.viewModel.clear()
    }
    // clear previous watch
    if (watchRef.current) {
      watchRef.current?.remove?.()
      watchRef.current = null
    }
    // create a new widget, or get a previously created widget
    let WidgetClass, unit: __esri.SystemOrLengthUnit | __esri.SystemOrAreaUnit
    const { DistanceMeasurement2D, AreaMeasurement2D, DirectLineMeasurement3D, AreaMeasurement3D, reactiveUtils } = jsApiModules
    const mapViewWidget = mapViewWidgetRef.current[jimuMapView.id] || (mapViewWidgetRef.current[jimuMapView.id] = {})
    if (activeButton === 'measureDistance') {
      WidgetClass = jimuMapView.view.type === '2d' ? DistanceMeasurement2D : DirectLineMeasurement3D
      unit = defaultDistanceUnit
    } else if (activeButton === 'measureArea') {
      WidgetClass = jimuMapView.view.type === '2d' ? AreaMeasurement2D : AreaMeasurement3D
      unit = defaultAreaUnit
    } else {
      setMeasureState('disabled')
      return
    }
    if (!mapViewWidget[activeButton]) {
      if (WidgetClass && unit) {
        mapViewWidget[activeButton] = new WidgetClass({
          id: `${id}-${jimuMapView.id}-${activeButton}`,
          container: document.createElement('div'),
          view: jimuMapView.view,
          unit,
          visible: true
        }) as (DistanceMeasurement2D | DirectLineMeasurement3D) & (AreaMeasurement2D | AreaMeasurement3D)
      }
    }
    // switch tool
    const curTool = mapViewWidget[activeButton]
    setActiveTool(curTool)
    // show current tool, sync state
    if (typeof curTool?.container === 'object' && curTool?.container !== null) {
      curTool.container.style.visibility = 'visible'
      curTool.container.style.height = ''
      curTool.container.style.overflow = ''
    }
    const curState = curTool?.viewModel?.state
    setMeasureState(curState || 'disabled')
    if (curState !== 'measured' && curTool) {
      curTool.viewModel.start()
    }
    // watch and set measure state
    if (curTool) {
      containerRef.current.prepend(curTool.container)
      watchRef.current = reactiveUtils.watch(
        () => curTool?.viewModel?.state,
        (state) => {
          setMeasureState(state || 'disabled')
        }
      )
    }
    // popper keep same width with root
    if (rootRef.current && popperRef.current) {
      popperRef.current.style.width = rootRef.current.offsetWidth + 'px'
    }
  }, [id, activeButton, jimuMapViewRef, containerRef, activeTool, setActiveTool, rootRef, defaultDistanceUnit, defaultAreaUnit, jsApiModules])

  const originIsClickHighlight = React.useMemo(() => jimuMapView?.isClickHighlightEnabled?.(), [jimuMapView])
  React.useEffect(() => {
    if (originIsClickHighlight) {
      if (['ready', 'measuring'].includes(measureState)) {
        jimuMapView.disableClickHighlight()
      } else {
        jimuMapView.enableClickHighlight()
      }
    }
  }, [jimuMapView, measureState, originIsClickHighlight])

  const isDesignMode = ReactRedux.useSelector((state: IMState) => state.appRuntimeInfo.appMode === AppMode.Design)

  const currentPageId = ReactRedux.useSelector((state: IMState) => state.appRuntimeInfo.currentPageId)
  const originalPageIdRef = React.useRef(currentPageId)
  const isOtherPage = currentPageId !== originalPageIdRef.current

  // destroy widgets before unmount
  const destroyWidgets = React.useCallback(() => {
    Object.values(mapViewWidgetRef.current).forEach(mapViewWidget => {
      mapViewWidget.measureDistance?.destroy?.()
      mapViewWidget.measureDistance = null
      mapViewWidget.measureArea?.destroy?.()
      mapViewWidget.measureArea = null
    })
  }, [])
  const isInBuilder = ReactRedux.useSelector((state: IMState) => state.appContext.isInBuilder)
  hooks.useUpdateEffect(() => {
    if (isInBuilder) {
      destroyWidgets()
      setMeasureState('disabled')
    }
  }, [jimuMapView, arrangement, isInBuilder])
  React.useEffect(() => {
    return () => {
      destroyWidgets()
      setActiveTool(null)
    }
  }, [destroyWidgets, setActiveTool])

  const theme = useTheme()

  return <React.Fragment>
    {loading && <Loading type={LoadingType.Secondary} />}
    {!loading && !isToolbarArrangement && <div ref={panelRef} className='measure-panel' css={getStyle(theme, measureState)}>
      {activeButton === '' && <div aria-label={translate('selectToStart')} className='esri-widget esri-widget--panel' role='presentation'>
        <div className='esri-measurement-widget-content'>
          <section className='esri-measurement-widget-content__hint'>
            <p className='esri-measurement-widget-content__hint-text'>{translate('selectToStart')}</p>
          </section>
        </div>
      </div>}
      {activeButton !== '' && ['measuring', 'measured'].includes(measureState) && <div className='measure-clear'>
        <Button
          type='secondary'
          onClick={onClear}
          aria-label={translate('clearMeasurement')}
        >
          {translate('clearMeasurement')}
        </Button>
      </div>}
    </div>}
    {!loading && isToolbarArrangement && !isDesignMode && <Popper
      className={classNames('surface-1', { 'd-none': isOtherPage })}
      reference={rootRef.current}
      placement='bottom-start'
      open={activeButton !== ''}
      keepMount={true}
      modifiers={popperModifiers}
      offset={[0, 5]}>
      <div ref={popperRef} className='measure-popper'></div>
      <Global styles={css`
        .measure-popper {
          .esri-widget {
            background-color: transparent !important;
          }
          .esri-measurement-widget-content__settings {
            display: ${isToolbarArrangement ? 'none' : 'block'};
          }
          ${overrideCalciteVars(theme)}
        }
      `} />
    </Popper>}
  </React.Fragment>
}
