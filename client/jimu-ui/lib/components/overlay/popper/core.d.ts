import { React } from 'jimu-core';
import { type Options, type State, type Instance, type VirtualElement, type PositioningStrategy, type Modifier, type Placement, type BasePlacement } from '@popperjs/core';
export type PopperState = State;
export type Modifiers = Array<Partial<Modifier<any, any>>>;
export type PopperOptions = Partial<Options>;
export type PopperInstance = Instance;
export type { Modifier, Placement, BasePlacement, PositioningStrategy };
/**
 * The PopperCore component props
 */
export interface PopperCoreProps {
    /**
     * Reference node used to set the position of popper
     */
    reference: Element | VirtualElement;
    /**
     * All the useful functionalities provided by the library are implemented as Popper modifiers.
     * They are plugins, or middlewares, that can hook into the lifecycle of Popper,
     * and add additional logic to the positioning operations provided by default by Popper.
     * They effectively "modify" the popper state in some fashion, adding functionality, hence the term "modifiers".
     *
     * To learn how to create a modifier, [Modifiers documentation](https://popper.js.org/docs/v2/modifiers/).
     */
    modifiers?: Modifiers;
    /**
     * Describes the positioning strategy to use. By default, it is absolute,
     * which in the simplest cases does not require repositioning of the popper.
     * If your reference element is in a fixed container, use the fixed strategy
     * @default absolute
     */
    strategy?: PositioningStrategy;
    /**
     * If all you need is a callback ran after Popper positioned the element the first time, you can use the onFirstUpdate hook.
     * @event
     */
    onFirstUpdate?: (state: PopperState) => void;
    /**
     * Describes the preferred placement of the popper. Modifiers like flip may change the placement of the popper to make it fit better.
     *
     * [Placement documentation](https://popper.js.org/docs/v2/constructors/#placement).
     */
    placement?: Placement;
    /**
     * When this value changes, call `instance.update`
     */
    version?: number;
    /**
     * Popper render function.
     */
    children: (props: PopperRenderProps) => React.ReactNode;
}
export interface PopperRenderProps {
    poppered: boolean;
    ref: React.Dispatch<any>;
    style: {
        [key: string]: any;
    };
    attributes: {
        [key: string]: any;
    };
    boxStyle: Partial<React.CSSProperties>;
    placement: Placement;
    hasPopperEscaped: boolean;
    isReferenceHidden: boolean;
    arrowProps: {
        style: {
            [key: string]: any;
        };
        ref: React.Dispatch<any>;
    };
    forceUpdate: () => void;
    update: () => Promise<Partial<State>>;
}
export declare const PopperCore: React.ForwardRefExoticComponent<PopperCoreProps & React.RefAttributes<Instance>>;
