/** @jsx jsx */
import { React, jsx, type ThemeNavType, css, type ThemePaper, type ImmutableObject } from 'jimu-core'
import { Navigation, type NavigationVariant } from 'jimu-ui'
import { type DrawerMenuProps, DrawerMenu } from './drawer-menu'
import {
  useAvtivePage,
  useNavigationData,
  useAnchor,
  useNavAdvanceStyle
} from './utils'
const { useMemo } = React

export type MenuNavigationType = 'nav' | 'drawer'

export type MenuNavigationStandard = Omit<
DrawerMenuProps,
'advanced' | 'variant' | 'paper' | 'data'
> & {
  subMenu?: MenuNavigationStandard
}

export interface MenuNavigationProps {
  /**
   * Directions of navigation
   */
  vertical?: boolean
  /**
   * Type of navigation, optional values:  'nav' | 'drawer';
   */
  type: MenuNavigationType
  /**
   * Subtypes of each type
   * nav: 'default', 'underline', 'pills'
   * drawer: 'default'
   */
  menuStyle: ThemeNavType
  /**
   * Configurable parameters for `Navigation` and `DrawerMenu`
   */
  standard?: ImmutableObject<MenuNavigationStandard>
  /**
   * Whether to enable advanced style (override the style provided by the component in the widget)
   */
  advanced?: boolean

  paper?: ImmutableObject<ThemePaper>
  /**
   * Configurable variables in advanced style
   *
   */
  variant?: ImmutableObject<NavigationVariant>
}

const useStyle = (vertical: boolean) => {
  return useMemo(() => {
    return css`
      width: 100%;
      height: 100%;
      max-width: 100vw;
      max-height: 100vh;
      .nav-item {
        ${!vertical && `
          .nav-link:hover {
            position: relative;
            &::before {
              content: "";
              position: absolute;
              left: 0;
              right: 0;
              top: -1000px;
              bottom: 100%;
            }
            &::after {
              content: "";
              position: absolute;
              left: 0;
              right: 0;
              top: 100%;
              bottom: -1000px;
            }
          }
        `}
      }
    `
  }, [vertical])
}

export const MenuNavigation = (props: MenuNavigationProps) => {
  const {
    type,
    menuStyle,
    vertical,
    standard,
    advanced,
    paper,
    variant
  } = props

  const data = useNavigationData()
  const isActive = useAvtivePage()

  const { icon, anchor: _anchor, ...others } = standard.asMutable({ deep: true })
  const anchor = useAnchor(_anchor)

  const style = useStyle(vertical)

  const navStyle = useNavAdvanceStyle(advanced, menuStyle, variant, vertical)
  return (
    <div className='menu-navigation' css={[style, navStyle]}>
      {type === 'nav' && (
        <Navigation
          role="menu"
          data={data}
          vertical={vertical}
          isActive={isActive}
          showTitle={true}
          isUseNativeTitle={true}
          scrollable
          right={true}
          {...others}
          type={menuStyle}
        />
      )}
      {type === 'drawer' && (
        <DrawerMenu
          data={data}
          advanced={advanced}
          variant={variant}
          paper={paper}
          type={menuStyle}
          vertical={vertical}
          isActive={isActive}
          scrollable={false}
          icon={icon}
          anchor={anchor}
          {...others}
        />
      )}
    </div>
  )
}
