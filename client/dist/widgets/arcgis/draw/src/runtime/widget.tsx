/** @jsx jsx */
import { React, jsx, type AllWidgetProps, useIntl, classNames } from 'jimu-core'
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis'
import { WidgetPlaceholder } from 'jimu-ui'
import { type IMConfig, DrawingTool } from '../config'
import { JimuDraw, type JimuDrawCreationMode, type JimuDrawVisibleElements } from 'jimu-ui/advanced/map'
import { getStyles } from './style'
import { versionManager } from '../version-manager'

import defaultMessages from './translations/default'
import DrawIcon from '../../icon.svg'

function Widget (props: AllWidgetProps<IMConfig>): React.ReactElement {
  const [currentJimuMapView, setCurrentJimuMapView] = React.useState(null)
  const handleActiveViewChange = (jimuMapView: JimuMapView): void => {
    setCurrentJimuMapView(jimuMapView)
  }

  // visibleElements
  const visibleElements = {} as JimuDrawVisibleElements
  visibleElements.createTools = {
    point: props.config.drawingTools.includes(DrawingTool.Point),
    polyline: props.config.drawingTools.includes(DrawingTool.Polyline),
    polygon: props.config.drawingTools.includes(DrawingTool.Polygon),
    rectangle: props.config.drawingTools.includes(DrawingTool.Rectangle),
    circle: props.config.drawingTools.includes(DrawingTool.Circle),
    customText: props.config.drawingTools.includes(DrawingTool.Text)
  }

  // hide API setting icon for 10.1
  visibleElements.settingsMenu = false

  const isShowPlaceHolderFlag = (!currentJimuMapView)
  const placeHolderTips = useIntl().formatMessage({ id: '_widgetLabel', defaultMessage: defaultMessages._widgetLabel })
  // Renderer
  return <div className='draw-widget-container h-100' css={getStyles()}>
    { /* 1.placeholder */ }
    {isShowPlaceHolderFlag &&
      <div className='w-100 h-100'>
        <WidgetPlaceholder
          className={classNames('w-100 placeholder-wrapper', { 'in-controller': (!!props.controllerWidgetId) })}
          icon={DrawIcon} widgetId={props.id} message={placeHolderTips}
        />
      </div>
    }
    { /* 2.jimu-draw */ }
    {!isShowPlaceHolderFlag &&
      <JimuDraw
        jimuMapView={currentJimuMapView}
        isDisplayCanvasLayer={props.config.isDisplayCanvasLayer}
        // api options
        drawingOptions={{
          creationMode: props.config.drawMode as unknown as JimuDrawCreationMode,
          visibleElements: visibleElements,
          // snapping
          //snappingOptions?: __esri.SnappingOptionsProperties
          // layer list mode
          layerListMode: props.config.layerListMode,
          // defaults
          updateOnGraphicClick: true,
          // drawingEffect3D
          drawingElevationMode3D: props.config.drawingElevationMode3D
        }}
        // ui
        uiOptions={{
          arrangement: props.config.arrangement,
          isAutoWidth: props.autoWidth,
          isAutoHeight: props.autoHeight
        }}
        // measurements
        measurementsInfo={props.config.measurementsInfo.asMutable() as any}
        measurementsUnitsInfos={props.config.measurementsUnitsInfos.asMutable()}
        // other options
      ></JimuDraw>
    }
    { /* 3.map view comp */ }
    <JimuMapViewComponent
      useMapWidgetId={props.useMapWidgetIds?.[0]}
      onActiveViewChange={handleActiveViewChange}
    />
  </div>
}

Widget.versionManager = versionManager
export default Widget
