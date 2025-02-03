/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { type NavButtonGroupProps } from '../pagination';
interface _ScrollListProps extends NavButtonGroupProps {
    /**
     * Defines the role added to the element.
     * @default tablist
     */
    role?: string;
    /**
     * Display items vertically or not.
     * @default false
     */
    vertical?: boolean;
    /**
     * The duration of the animation when scrolling.
     * @default 300
     */
    duration?: number;
    /**
     * If `true`, hide scroll arrows on both sides.
     * @default false
     */
    hideArrow?: boolean;
    /**
     * If `true`, when scrolling to the start or end point, hide the corresponding arrow.
     * @default true
     */
    autoArrow?: boolean;
    /**
     * A set of react elements that need to be scrolled.
     */
    items: React.ReactElement[];
    /**
     * Whether to use the wheel to scroll.
     * @default false
     */
    useWhell?: boolean;
    /**
     * The tag name of the scroll list.
     * @default div
     */
    listTag?: React.ElementType<any>;
}
/**
 * The ScrollList component props.
 */
export type ScrollListProps = Omit<_ScrollListProps, 'hideArrow'>;
export declare const _ScrollList: (props: _ScrollListProps) => jsx.JSX.Element;
/**
 * The `ScrollList` provides the user with the ability to scroll through internal items
 *
 * ```ts
 * import { ScrollList } from 'jimu-ui'
 * ```
 */
export declare const ScrollList: (props: ScrollListProps) => jsx.JSX.Element;
export {};
