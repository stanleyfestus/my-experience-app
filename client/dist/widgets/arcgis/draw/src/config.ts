import { type ImmutableObject } from 'jimu-core'
import { type MeasurementsUnitsInfo, type DrawingElevationMode3D, type MeasurementsPropsInfo } from 'jimu-ui/advanced/map'

export enum Arrangement {
  Panel = 'Panel',
  Toolbar = 'Toolbar'
}

export enum DrawMode {
  Continuous = 'continuous',
  Update = 'update'
}

export enum DrawingTool {
  Point = 'point',
  //Multipoint = 'multipoint'
  Polyline = 'polyline',
  Polygon = 'polygon',
  Rectangle = 'rectangle',
  Circle = 'circle',
  Text = 'text'
}

// for groupLayer listMode
export enum LayerListMode {
  Show = 'show',
  Hide = 'hide'
  //,HideChildren = 'hide-children'
}

export interface Config {
  isDisplayCanvasLayer: boolean
  arrangement: Arrangement
  drawMode: DrawMode
  drawingTools: DrawingTool[]

  layerListMode: LayerListMode

  measurementsInfo: MeasurementsPropsInfo
  measurementsUnitsInfos: MeasurementsUnitsInfo[]
  //isEnableAdvancedSetting: boolean
  drawingElevationMode3D: DrawingElevationMode3D
}

export type IMConfig = ImmutableObject<Config>
