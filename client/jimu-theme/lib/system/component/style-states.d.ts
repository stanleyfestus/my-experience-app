import type { ButtonGroupProps, ButtonProps, LinkProps, NavbarProps, NavItemProps, NavLinkProps, NavMenuProps, NavProps } from 'jimu-ui';
export type ComponentsProps = {
    [Name in keyof ComponentsStyleStateList]?: Partial<ComponentsStyleStateList[Name]>;
};
export interface ComponentsStyleStateList {
    Button: ButtonProps;
    ButtonGroup: ButtonGroupProps;
    Link: LinkProps;
    Nav: NavProps;
    Navbar: NavbarProps;
    NavItem: NavItemProps;
    NavMenu: NavMenuProps;
    NavLink: NavLinkProps;
}
