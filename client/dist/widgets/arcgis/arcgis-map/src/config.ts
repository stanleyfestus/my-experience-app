import { type ImmutableObject } from 'jimu-core'
import { type JimuMapConfig } from 'jimu-ui/advanced/map'

export enum SceneQualityMode {
  auto = 'auto',
  low = 'low',
  medium = 'medium',
  high = 'high'
}

// export interface ScaleRange {
//   minScale?: number
//   maxScale?: number
// }

export interface Config extends JimuMapConfig {
  isUseCustomMapState: boolean
  popupDockPosition?: 'auto' | 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  sceneQualityMode: SceneQualityMode
  // webmap/webscene data source ids that enables client query
  clientQueryDataSourceIds?: string[]
  // scaleRange?: ScaleRange
}

export type IMConfig = ImmutableObject<Config>

export interface ToolConfig { [key: string]: boolean }
