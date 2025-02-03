import { type ImmutableObject } from 'jimu-core'

export interface Config {
  displayLabel?: boolean
  filterDataSources?: boolean
  longNames?: boolean
  position?: string
}

export type IMConfig = ImmutableObject<Config>
