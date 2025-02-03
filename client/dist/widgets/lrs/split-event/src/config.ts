import { type LrsLayer, type DefaultInfo } from 'widgets/shared-code/lrs'
import { type ImmutableObject } from 'seamless-immutable'

export interface SplitEventRequest {
  id?: number
  eventOid?: string
  routeId?: string
  measure?: number
  fromDate?: Date
  toDate?: Date
  attributes?: { [key: string]: string | number | Date }
  attributes2?: { [key: string]: string | number | Date }
}

export interface Config {
  lrsLayers: LrsLayer[]
  networkLayers: string[]
  eventLayers: string[]
  defaultEvent?: DefaultInfo
  conflictPreventionEnabled?: boolean
  hideEvent?: boolean
  hideNetwork?: boolean
  hideDate?: boolean
  useRouteStartDate?: boolean
}

export type IMConfig = ImmutableObject<Config>
