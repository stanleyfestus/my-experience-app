import { type LrsLayer, type DefaultInfo } from 'widgets/shared-code/lrs'
import { type ImmutableObject } from 'seamless-immutable'

export interface MergeEventsRequest {
  id?: number
  objectIds?: number[]
  objectIdToPreserve?: number
  fromDate?: Date
  toDate?: Date
  attributes?: { [key: string]: string | number | Date }
}

export interface MergeEventsResult {
  objectIds: number[]
}

export interface DisplayConfig {
  hideEvent: boolean
}

export interface Config {
  lrsLayers: LrsLayer[]
  networkLayers: string[]
  eventLayers: string[]
  intersectionLayers: string[]
  defaultEvent?: DefaultInfo
  displayConfig?: DisplayConfig
  conflictPreventionEnabled?: boolean
}

export type IMConfig = ImmutableObject<Config>
