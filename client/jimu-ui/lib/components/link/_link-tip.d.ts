/** @jsx jsx */
import { jsx } from 'jimu-core';
import { type TargetType, type Placement } from '../overlay/popper';
interface Props {
    open: boolean;
    reference: TargetType;
    placement?: Placement;
    className?: string;
    href: string;
}
export declare const LinkTip: ({ open, reference, placement, className, href }: Props) => jsx.JSX.Element;
export {};
