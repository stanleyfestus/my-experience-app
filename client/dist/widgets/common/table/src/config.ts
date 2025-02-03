import {
  type ImmutableObject,
  type ImmutableArray,
  type IMFieldSchema,
  type DataSource,
  type UseDataSource
} from 'jimu-core'

export enum TableModeType {
  Layer = 'LAYER',
  Map = 'MAP'
}

export enum TableArrangeType {
  Dropdown = 'DROPDOWN',
  Tabs = 'TABS'
}

export enum SelectionModeType {
  Single = 'SINGLE',
  Multiple = 'MULTIPLE'
}

export enum LayerHonorModeType {
  Webmap = 'WEBMAP',
  Custom = 'CUSTOM'
}

export interface Suggestion {
  suggestionHtml: string | Element
  suggestion: string
}

export interface TableFieldsSchema extends IMFieldSchema {
  editAuthority?: boolean
  editable?: boolean
  visible?: boolean
}

export enum ResponsiveType {
  Fit = 'FIT',
  Fixed = 'FIXED'
}

export interface ColumnSizing {
  responsiveType: ResponsiveType
  columnWidth: number
}

export interface HeaderAttrs {
  backgroundColor: string
  fontSize: number
  bold: boolean
  color: string
}

export enum TableDataActionType {
  View = 'VIEW',
  Add = 'ADD'
}

export interface LayersConfig {
  id: string
  name: string
  useDataSource?: UseDataSource
  allFields: IMFieldSchema[]
  tableFields?: TableFieldsSchema[]
  enableAttachments: boolean
  enableSearch: boolean
  searchFields?: string[]
  searchExact?: boolean
  searchHint?: string
  enableEdit: boolean
  enableRefresh: boolean
  enableSelect: boolean
  enableDelete: boolean
  selectMode: SelectionModeType
  showCount?: boolean
  updateText?: boolean
  allowCsv: boolean
  dataActionObject?: any
  dataActionType?: TableDataActionType
  dataActionDataSource?: DataSource
  headerFontSetting?: HeaderAttrs
  columnSetting?: ColumnSizing
  layerHonorMode?: LayerHonorModeType
  parentViewId?: string
}

export interface MapViewConfig {
  parentViewId: string
  customizeLayers: boolean
  customJimuLayerViewIds?: string[]
  layersConfig?: ImmutableArray<LayersConfig>
}

export interface Config {
  tableMode: TableModeType
  layersConfig?: ImmutableArray<LayersConfig>
  mapViewsConfig?: {
    [jimuMapViewId: string]: ImmutableObject<MapViewConfig>
  }
  enableMapExtentFilter?: boolean
  defaultExtentFilterEnabled?: boolean
  arrangeType: TableArrangeType
}

export type IMConfig = ImmutableObject<Config>
