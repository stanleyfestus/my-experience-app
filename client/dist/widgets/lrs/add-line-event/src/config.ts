import { type SearchMethod, type LrsLayer, type AttributeSets } from 'widgets/shared-code/lrs'
import { type ImmutableObject } from 'seamless-immutable'

export enum OperationType {
  single = 'SINGLE',
  multiple = 'MULTIPLE'
}

export interface DefaultInfo {
  index: number
  name: string
}

export interface Config {
  lrsLayers: LrsLayer[]
  networkLayers: string[]
  eventLayers: string[]
  intersectionLayers: string[]
  lineEventLayers: string[]
  attributeSets?: AttributeSets
  defaultAttributeSet: string
  defaultEvent?: DefaultInfo
  defaultNetwork?: DefaultInfo
  defaultFromMethod?: SearchMethod
  defaultToMethod?: SearchMethod
  defaultType?: OperationType
  conflictPreventionEnabled?: boolean
  hideMethod?: boolean
  hideEvent?: boolean
  hideNetwork?: boolean
  hideType?: boolean
  hideAttributeSet?: boolean
  hideMeasures?: boolean
  hideDates?: boolean
  useRouteStartEndDate?: boolean
}

export type IMConfig = ImmutableObject<Config>
