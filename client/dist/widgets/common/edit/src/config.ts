import {
  type ImmutableObject,
  type IMUseDataSource,
  type ImmutableArray,
  type IMFieldSchema
} from 'jimu-core'

export enum EditModeType {
  Attribute = 'ATTRIBUTE',
  Geometry = 'GEOMETRY'
}

export enum LayerHonorModeType {
  Webmap = 'WEBMAP',
  Custom = 'CUSTOM'
}

export enum SparkChangedType {
  Added = 'Added',
  Updated = 'Updated',
  Deleted = 'Deleted'
}

export enum ImportHintType {
  NoMap = 'NOMAP',
  NoLayer = 'NOEDITABLE'
}

export enum SnapSettingMode {
  Prescriptive = 'PRESCRIPTIVE',
  Flexible = 'FLEXIBLE'
}

export interface TreeFields extends IMFieldSchema {
  children?: TreeFields[]
  groupKey?: number
  editAuthority?: boolean
  subDescription?: string
  editable?: boolean
}

export interface LayersConfig {
  id: string
  name: string
  layerId?: string
  useDataSource: IMUseDataSource
  addRecords?: boolean
  deleteRecords?: boolean
  updateRecords?: boolean
  updateAttributes?: boolean
  updateGeometries?: boolean
  featureSnapping?: boolean
  showFields: IMFieldSchema[]
  groupedFields: TreeFields[]
  layerHonorMode: LayerHonorModeType
  layerEditingEnabled?: boolean
  isTable?: boolean
  parentViewId?: string
}

export interface MapViewConfig {
  parentViewId: string
  customizeLayers: boolean
  customJimuLayerViewIds?: string[]
  layersConfig?: ImmutableArray<LayersConfig>
}

export interface Config {
  layersConfig?: ImmutableArray<LayersConfig>
  mapViewsConfig?: {
    [jimuMapViewId: string]: ImmutableObject<MapViewConfig>
  }
  editMode: EditModeType
  selfSnapping?: boolean
  featureSnapping?: boolean
  defaultSelfEnabled?: boolean
  defaultFeatureEnabled?: boolean
  defaultSnapLayers?: string[]
  description: string
  noDataMessage: string
  snapSettingMode: SnapSettingMode
  tooltip?: boolean
  defaultTooltipEnabled?: boolean
  templateFilter?: boolean
  relatedRecords?: boolean
  liveDataEditing?: boolean
  initialReshapeMode?: boolean
}

export type IMConfig = ImmutableObject<Config>
