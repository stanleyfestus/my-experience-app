/** @jsx jsx */
import { React, type IMThemeVariables, ReactRedux, type IMSelection, jsx } from 'jimu-core';
import { type Modifiers, type PopperCoreProps } from 'jimu-ui';
export interface SidePopperProps extends Omit<PopperCoreProps, 'open' | 'reference' | 'position' | 'toggle' | 'children'> {
    /**
     * If `left`, the side popper is next to left sidebar of builder.
     * If `right`, the side popper is next to right sidebar of builder.
     */
    position: 'left' | 'right';
    /**
     * If `true`, the side popper is visible.
     */
    isOpen: boolean;
    /**
     * Toggle to open/close the side popper.
     */
    toggle: () => void;
    /**
     * Element which triggers side popper.
     *
     * By default, clicking left/right sidebar of builder will close the side popper automatically.
     * Clicking `trigger` won't close the side popper.
     */
    trigger: HTMLElement | HTMLElement[];
    /**
     * An element to focus after the side popper is closed.
     * `backToFocusNode` is for accessibility purposes.
     *
     * If don't pass in `backToFocusNode`, will focus `trigger` after side popper is closed.
     */
    backToFocusNode?: HTMLElement;
    /**
     * If current selected widget is not the widget, will close the side popper.
     */
    widgetId?: string;
    /**
     * Provide a uniform header.
     */
    title?: React.ReactNode;
    /**
     * @ignore
     * @default false
     * Add the FOCUSABLE_CONTAINER_CLASS to the title to make the close button focused in case of 508 problems.
     *
     * Only needs this prop if the components in the content of the SidePopper uses FOCUSABLE_CONTAINER_CLASS.
     */
    addFocusableContainerClass?: boolean;
    /**
     * @ignore
     */
    className?: string;
    /**
     * A ref that points to the used popper instance.
     */
    children?: React.ReactNode;
    /**
     * To provide a label for the side popper for accessibility purposes.
     */
    'aria-label'?: string;
}
interface ExtraProps {
    leftSidebarCollapse: boolean;
    rightSidebarCollapse: boolean;
    dispatch: any;
    isTemplatePage: boolean;
    theme?: IMThemeVariables;
    layoutSelection?: IMSelection;
}
/**
 * The `SidePopper` component is a popper which reference node is left/right side panel of builder.
 *
 * ```ts
 * import { SidePopper } from 'jimu-ui/advanced/setting-components'
 * ```
 */
export declare class _SidePopper extends React.PureComponent<SidePopperProps & ExtraProps, unknown> {
    closeBtnRef: React.RefObject<HTMLButtonElement>;
    popperRef: React.RefObject<HTMLDivElement>;
    componentDidMount(): void;
    componentDidUpdate(prevProps: SidePopperProps & ExtraProps): void;
    componentWillUnmount(): void;
    handleDocumentMousedown: (evt: MouseEvent) => void;
    getReference(position: 'left' | 'right'): HTMLElement;
    getPlacement(position: 'left' | 'right'): "right-start" | "left-start";
    toggle: () => void;
    keepFocusAfterClose: () => void;
    onKeyDown: (e: any) => void;
    render(): jsx.JSX.Element;
}
export declare const SidePopper: ReactRedux.ConnectedComponent<import("@emotion/styled").StyledComponent<SidePopperProps & ExtraProps, {}, {}>, {
    position: "left" | "right";
    className?: string;
    title?: React.ReactNode;
    'aria-label'?: string;
    children?: React.ReactNode;
    version?: number;
    theme?: IMThemeVariables;
    widgetId?: string;
    trigger: HTMLElement | HTMLElement[];
    toggle: () => void;
    isOpen: boolean;
    modifiers?: Modifiers;
    strategy?: import("jimu-ui").PositioningStrategy;
    onFirstUpdate?: (state: import("jimu-ui").PopperState) => void;
    placement?: import("jimu-ui").Placement;
    backToFocusNode?: HTMLElement;
    addFocusableContainerClass?: boolean;
    context?: React.Context<ReactRedux.ReactReduxContextValue<any, import("redux").UnknownAction>>;
    store?: import("redux").Store;
}>;
export {};
