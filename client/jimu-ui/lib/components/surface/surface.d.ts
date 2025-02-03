import { React } from 'jimu-core';
import { type StandardComponentProps } from '../types';
/**
 * The `Surface` component props.
 */
export interface SurfaceProps extends StandardComponentProps {
    /**
     * Defines the role added to the element.
     */
    role?: React.AriaRole | undefined;
    /**
     * The component or tag of the root of this component.
     * @default div
     */
    component?: React.ElementType;
    /**
     * The rounded corners of components
     * @default none
     */
    shape?: 'none' | 'shape1' | 'shape2';
    /**
     * Shadow depth, corresponds to dp in the spec.
     * @default shadow2
     */
    elevation?: 'none' | 'shadow1' | 'shadow2' | 'shadow3';
    /**
     * Surface variables used by background and text
     * @default paper
     */
    level?: 'background' | 'paper' | 'overlay';
    /**
     * The variant to use.
     * @default elevation
     */
    variant?: 'elevation' | 'outlined';
    /**
     * Defines the children of the element.
     */
    children?: React.ReactNode | undefined;
}
/**
 * The `Surface` component is a container for displaying content on an elevated surface.
 *
 * ```ts
 * import { Surface } from 'jimu-ui'
 * ```
 */
export declare const Surface: React.ForwardRefExoticComponent<SurfaceProps & React.RefAttributes<any>>;
