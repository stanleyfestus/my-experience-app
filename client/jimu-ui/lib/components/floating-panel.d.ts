import { React } from 'jimu-core';
import { type Size, type ResizeHandle } from './resizable';
import { type ControlPosition } from './draggable';
import { type DraggableBounds, type DraggableEventHandler, type PositionOffsetControlPosition } from 'react-draggable';
import { type OverlayManagerProps } from './overlay/manager/overlays';
export interface _FloatingPanelProps extends Omit<React.HtmlHTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'title' | 'onResize'> {
    /**
     * The title displayed in the header.
     */
    headerTitle?: React.ReactNode;
    /**
     * The class name of the header.
     */
    headerClassName?: string;
    /**
     * If `false`, hide the close button on the header.
     * @default true
     */
    showHeaderClose?: boolean;
    /**
     * if `true`, show a collapse button on the header.
     * @default false
     */
    showHeaderCollapse?: boolean;
    /**
     * Called when clicking on the close button.
     */
    onHeaderClose?: (e?: React.MouseEvent<HTMLDivElement>) => void;
    /**
     * Set the minimum size of the panel.
     * @default { width: 50, height: 50 }
     */
    minSize?: Size;
    /**
     * Specifies the width and height of the panel at start.
     *
     * Note: defaultSize will be ignored when size is set.
     * @default { width: 50, height: 50 }
     */
    defaultSize?: Size;
    /**
     * Set the size of the panel.
     * Use size if you need to control size state by yourself.
     */
    size?: Size;
    /**
     * If true, defaultSize and size won't work, and resizing will be disabled.
     * @default false
     */
    autoSize?: boolean;
    /**
     * Specifies the left and top of the panel at start.
     *
     * Note: defaultPosition will be ignored when position set.
     * @default { left: 0, top: 0 }
     */
    defaultPosition?: ControlPosition;
    /**
     * Set the position of the panel.
     * Use position if you need to control position state by yourself.
     */
    position?: ControlPosition;
    /**
     * A position offset to start with. Useful for giving an initial position
     * to the element. Differs from `defaultPosition` in that it does not
     * affect the position returned in draggable callbacks, and in that it
     * accepts strings, like `{x: '10%', y: '10%'}`.
     */
    positionOffset?: PositionOffsetControlPosition;
    /**
     * If `true`, the panel cannot be resized.
     * @default false
     */
    disableResize?: boolean;
    /**
     * If `true`, the panel cannot be dragged.
     * @default false
     */
    disableDraggable?: boolean;
    /**
     * Specifies the x and y that resizing should snap to.
     */
    resizeGrid?: [number, number];
    /**
     * Provide a resize handle for the bottom right corner.
     * Flipped handles will be applied for the other corners.
     * A handle can be an icon, an image, or any other valid ReactElement.
     */
    resizeHandle?: React.ReactElement;
    /**
     * Called when resizing starts.
     */
    onResizeStart?: (size: Size, position?: ControlPosition) => void;
    /**
     * Called while resizing.
     */
    onResize?: (size: Size, position?: ControlPosition) => void;
    /**
     * Called when resizing stops.
     */
    onResizeStop?: (size: Size, position?: ControlPosition) => void;
    /**
     * A list of resize handles: 'top-left', 'top-right', 'bottom-left' and 'bottom-right'.
     * @default ['bottom-right']
     */
    resizeHandles?: ResizeHandle[];
    /**
     *
     * Specifies movement boundaries. Accepted values:
     * - `parent` restricts movement within the node's offsetParent
     *   (nearest node with position relative or absolute), or
     * - a selector, restricts movement within the targeted node
     * - An object with `left, top, right, and bottom` properties.
     *  These indicate how far in each direction the draggable
     *   can be moved.
     */
    dragBounds?: DraggableBounds | string | false;
    /**
     * Specifies the x and y that dragging should snap to.
     */
    dragGrid?: [number, number];
    /**
     * If desired, you can provide your own offsetParent for drag calculations.
     * By default, we use the Draggable's offsetParent. This can be useful for elements
     * with odd display types or floats.
     */
    dragOffsetParent?: HTMLElement;
    /**
     * Called when dragging starts.
     * @event
     */
    onDragStart?: DraggableEventHandler;
    /**
     * Called while dragging.
     * @event
     */
    onDrag?: (position: ControlPosition) => void;
    /**
     * Called when dragging stops.
     * @event
     */
    onDragStop?: DraggableEventHandler;
    /**
     * Specifies the scale of the canvas your are dragging this element on. This allows
     * you to, for example, get the correct drag deltas while you are zoomed in or out via
     * a transform or matrix in the parent of this element.
     * @default 1
     */
    dragScale?: number;
    /**
   * Loop within the focusable elements inside the `Popper` when the `Tab` key is pressed.
   * @ignore
   * @default true
   */
    trapFocus?: boolean;
    /**
     * Whether to automatically focus on the first focusable element when `Popper` is open.
     * @ignore
     * @default true
     */
    autoFocus?: boolean;
    /**
     * @ignore
     * If this function is provided, clicking `Escape` twice triggers it instead of `onHeaderClose`.
     * It is for accessibility purposes.
     */
    onLeave?: () => void;
    /**
     * The content of this component.
     */
    children: React.ReactElement;
    /**
     * Only activate the overlay when click on the header.
     * @default false
     * @ignore
     */
    activateOnlyForHeader?: boolean;
    /**
     * Be invoked when clicking the header
     * @ignore
     */
    onHeaderClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;
}
export type FloatingPanelProps = _FloatingPanelProps & Omit<OverlayManagerProps, 'openOverlayOnMount'>;
/**
 * A component for resizing and positioning
 */
export declare const _FloatingPanel: React.ForwardRefExoticComponent<_FloatingPanelProps & Omit<OverlayManagerProps, "openOverlayOnMount"> & React.RefAttributes<unknown>>;
/**
 * A component for resizing and positioning
 */
export declare const FloatingPanel: import("@emotion/styled").StyledComponent<_FloatingPanelProps & Omit<OverlayManagerProps, "openOverlayOnMount"> & React.RefAttributes<unknown>, {}, {}>;
