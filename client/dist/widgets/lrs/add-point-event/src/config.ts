import { type ImmutableObject } from 'seamless-immutable'
import { type LrsLayer, type SearchMethod, type AttributeSets } from 'widgets/shared-code/lrs'

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
  attributeSets?: AttributeSets
  defaultAttributeSet: string
  defaultEvent?: DefaultInfo
  defaultNetwork?: DefaultInfo
  defaultMethod?: SearchMethod
  defaultType?: OperationType
  conflictPreventionEnabled?: boolean
  hideMethod?: boolean
  hideEvent?: boolean
  hideNetwork?: boolean
  hideType?: boolean
  hideAttributeSet?: boolean
  hideDates?: boolean
  useRouteStartEndDate?: boolean
}

export type IMConfig = ImmutableObject<Config>
