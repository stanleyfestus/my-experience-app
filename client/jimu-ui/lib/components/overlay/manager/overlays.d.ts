import { React, type ImmutableArray } from 'jimu-core';
export declare const ModalOverlayIdContext: React.Context<string>;
export declare const baseOverlayZindex = 1;
export declare const TooltipZindex = 2001;
export declare const isTargetInContainer: (target: HTMLElement, container: HTMLElement) => boolean;
export declare const getOverlayZIndex: (overlays: ImmutableArray<string>, uniqueId: string, baseZindex: number) => number;
export interface OverlayManagerProps {
    /**
     * If `true`, disables portal behavior, keeping children within their parent DOM hierarchy.
     * If `false`, children are appended to `document.body`.
     * @default false
     */
    disablePortal?: boolean;
    /**
     * If `true`, prevents activating the overlay when clicking on the popper body.
     * @default false
     */
    disableActivateOverlay?: boolean;
    /**
     * If `true`, disables z-index management via `state.overlays`.
     * @default false
     */
    disableOverlayManager?: boolean;
    /**
     * If `true`, adds the popper to `state.overlays` when mounted.
     * @default true
     */
    openOverlayOnMount?: boolean;
    /**
     * @ignore
     */
    zIndex?: number;
}
interface OverlayManagerResult {
    overlayId: string;
    zIndex: number;
    openOverlay: () => void;
    activateOverlay: () => void;
    closeOverlay: () => void;
}
export declare const useOverlayManager: (type: "modal" | "popper", disableOverlayManager: OverlayManagerProps["disableOverlayManager"], disableActivateOverlay: OverlayManagerProps["disableActivateOverlay"], openOverlayOnMount?: OverlayManagerProps["openOverlayOnMount"], baseZindex?: number) => OverlayManagerResult;
/**
 * Return the portal container according to whether it is fullscreen or not.
 */
export declare const usePortalContainer: (disablePortal: boolean, panelRef: React.MutableRefObject<HTMLElement>) => Element;
export {};
