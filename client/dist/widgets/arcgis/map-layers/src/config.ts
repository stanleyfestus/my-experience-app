import { type ImmutableObject } from 'jimu-core'

export interface Config {
  goto?: boolean
  label?: boolean
  opacity?: boolean
  information?: boolean
  setVisibility?: boolean
  useMapWidget?: boolean
  enableLegend?: boolean
  useTickBoxes?: boolean
  showAllLegend?: boolean
  reorderLayers?: boolean
  searchLayers?: boolean
  showTables?: boolean
  popup?: boolean
  customizeLayerOptions?: {
    [jimuMapViewId: string]: CustomizeLayerOption
  }
}

export interface CustomizeLayerOption {
  isEnabled: boolean
  hiddenJimuLayerViewIds?: string[]
  // After 2024.R3 we will use white-list for customization, see #21494.
  showJimuLayerViewIds?: string[]
}
export type IMConfig = ImmutableObject<Config>
