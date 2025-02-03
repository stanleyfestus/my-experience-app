import { React } from 'jimu-core';
import { type FloatingPanelProps } from '../../floating-panel';
import { type OverlayManagerProps } from '../manager/overlays';
interface _PopperChildrenProps extends Omit<FloatingPanelProps, 'onMouseDown'> {
    /**
     *
     * Whether to use floating panel as container
     * @default false
     */
    floating?: boolean;
    /**
     * Only activate the overlay when click on the header.
     * Note: only valid when `floating` is true.
     * @default false
     * @ignore
     */
    activateOnlyForHeader?: boolean;
}
export type PopperChildrenProps = _PopperChildrenProps & OverlayManagerProps;
export declare const PopperChildren: React.ForwardRefExoticComponent<_PopperChildrenProps & OverlayManagerProps & React.RefAttributes<HTMLDivElement>>;
export {};
