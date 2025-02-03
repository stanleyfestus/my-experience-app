import { React, type IntlShape } from 'jimu-core';
import MobilePanelManager from './mobile-panel-manager';
import { type VirtualReference, type PopperProps } from '../overlay/popper';
interface _MobilePanelProps extends Pick<PopperProps, 'toggle'> {
    /**
     * Defines the class names added to the component.
     */
    className?: string;
    /**
     * The title of the panel.
     */
    title?: string;
    /**
     * Whether the panel is open.
     */
    open?: boolean;
    /**
     * @ignore
     * Whether unmount the panel when it is closed.
     */
    keepMount?: boolean;
    /**
     * @ignore
     * The content of the panel.
     */
    children?: React.ReactNode;
    /**
     * Callback fired when the panel is clicked.
     */
    onClick?: (evt?: any) => void;
    /**
     * Callback fired when the panel is closed.
     */
    onClose?: (evt?: any) => void;
    /**
     * The map widget id used to identify the map widget.
     * Used when use a map widget as the container of the panel.
     * @ignore
     */
    mapWidgetId?: string;
}
export type MobilePanelProps = _MobilePanelProps & {
    /**
     * @ignore
     */
    intl: IntlShape;
};
export declare enum ExpandStage {
    INITSCREEN = "initscreen",
    HALFSCREEN = "halfscreen",
    FULLSCREEN = "fullscreen"
}
interface States {
    parentReferenceHeight: number;
    currentExpandStage: ExpandStage;
    mobilePanelHeight: number;
    generation: number;
}
export declare class _MobilePanel extends React.PureComponent<MobilePanelProps, States> {
    id: string;
    groupId: string;
    currentBottomPanelHeight: number;
    resizeTimeout: any;
    startDrag: boolean;
    moveY: number;
    startY: number;
    sliding: boolean;
    _isMounted: boolean;
    _retryMapWidgetIdTimes: number;
    parentReference: VirtualReference | HTMLElement;
    resizeObserver: ResizeObserver;
    panelContentRef: React.RefObject<HTMLDivElement>;
    constructor(props: any);
    updateProperties: () => {
        mobilePanelHeight: any;
        generation: any;
        parentReferenceHeight: any;
    };
    getExpectedHeightForStage: (currentStage: ExpandStage) => number;
    handleClose: (evt?: React.MouseEvent<HTMLElement>) => void;
    handleToggle: (evt?: React.MouseEvent<HTMLElement>, type?: "clickOutside" | "pageOrSizeMode" | "appMode") => void;
    componentDidMount(): void;
    resize: () => void;
    actualResize: () => void;
    componentDidUpdate(prevProps: MobilePanelProps, prevState: States): void;
    componentWillUnmount(): void;
    start: (event: any, type: any) => void;
    preventTouchMove: (event: TouchEvent) => void;
    move: (event: any, type: any) => void;
    end: (event: any, type: any) => void;
    onMobilePanelContainerResize: (width: any, height: any) => void;
    getReferenceWidth: () => number;
    changeMobilePanelHeightInMap: (targetExpandStage: ExpandStage) => void;
    render(): React.JSX.Element;
}
export declare const MobilePanel: import("@emotion/styled").StyledComponent<Omit<MobilePanelProps, "intl"> & {
    forwardedRef?: React.Ref<any>;
}, {}, {}>;
export { MobilePanelManager };
