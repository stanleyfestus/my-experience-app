import {
  type ImmutableObject, type ImmutableArray, type IMSqlExpression, type IMGroupSqlExpression,
  type IMUseDataSource, type IMIconResult, type ClauseLogic
} from 'jimu-core'

export enum FilterArrangeType {
  Block = 'BLOCK',
  Inline = 'INLINE',
  Popper = 'POPPER',
}

export enum FilterTriggerType {
  Toggle = 'TOGGLE',
  Button = 'BUTTON'
}

export enum FilterItemType {
  Single = 'SINGLE',
  Group = 'GROUP',
  Custom = 'CUSTOM'
}

// eslint-disable-next-line  @typescript-eslint/naming-convention
export interface filterItemConfig {
  icon?: IMIconResult
  name: string
  type: FilterItemType
  useDataSources: IMUseDataSource[]
  sqlExprObj?: IMSqlExpression
  sqlExprObjForGroup?: IMGroupSqlExpression
  exprInvert?: boolean
  autoApplyWhenWidgetOpen?: boolean
  collapseFilterExprs?: boolean
}

// eslint-disable-next-line  @typescript-eslint/naming-convention
export interface filterConfig {
  id: string
  arrangeType: FilterArrangeType
  triggerType: FilterTriggerType
  wrap?: boolean // only for inline arrangement
  omitInternalStyle: boolean
  filterItems?: ImmutableArray<filterItemConfig>
  logicalOperator: ClauseLogic
  groupByLayer: boolean
  custom: boolean
  resetAll: boolean
  turnOffAll: boolean
}

export type IMConfig = ImmutableObject<filterConfig>
