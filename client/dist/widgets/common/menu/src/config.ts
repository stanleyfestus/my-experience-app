import { type MenuNavigationProps } from './runtime/menu-navigation'
import { type ImmutableObject } from 'seamless-immutable'

export enum MenuType {
  Icon = 'ICON',
  Vertical = 'VERTICAL',
  Horizontal = 'HORIZONTAL'
}

export type IMConfig = ImmutableObject<MenuNavigationProps>
