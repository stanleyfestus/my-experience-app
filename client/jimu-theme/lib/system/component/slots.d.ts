import type { ButtonGroupSlots, ButtonSlots, NavLinkSlots, NavMenuSlots } from 'jimu-ui';
export interface ComponentNameToSlotKey {
    [key: string]: string;
    CssBaseline: 'root';
    Header: 'root';
    Footer: 'root';
    Button: ButtonSlots;
    ButtonGroup: ButtonGroupSlots;
    Link: 'root';
    Nav: 'root';
    Navbar: 'root';
    NavItem: 'root';
    NavMenu: NavMenuSlots;
    NavLink: NavLinkSlots;
}
