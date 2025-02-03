import { React } from 'jimu-core';
import { type ButtonSize, type ImageParam, type ButtonType, type StandardComponentProps } from 'jimu-ui';
/**
 * The `ImageSelector` component props.
 */
export interface ImageSelectorProps extends StandardComponentProps {
    /**
     * The ID of the widget using this component.
     */
    widgetId: string;
    /** @ignore */
    buttonClassName?: string;
    /** @ignore */
    buttonStyle?: React.CSSProperties;
    /**
     * The type of the button.
     */
    buttonType?: ButtonType;
    /**
     * The size of this component.
     * @default default
     */
    buttonSize?: ButtonSize;
    /**
     * The label for this component.
     */
    buttonLabel?: string;
    /**
     * The function will be called when the used image is being changed.
     */
    onChange?: (imageParam: ImageParam) => void;
    /**
     * If `true`, the component will be disabled.
     * @default false
     */
    disabled?: boolean;
    /**
     * Set selected image by default in this component.
     * This prop commonly comes from stored settings or `onChange` callback.
     */
    imageParam?: ImageParam;
    /**
     * If `left`, the side popper is next to left sidebar of builder.
     * If `right`, the side popper is next to right sidebar of builder.
     * @default right
     */
    position?: 'left' | 'right';
    /** @ignore */
    isSupportCrop?: boolean;
    /**
     * Identifies the element (or elements) that describes the object for accessibility purposes.
     */
    'aria-describedby'?: string;
    /**
     * To provide a label for interactive components for accessibility purposes.
     * By default, the accessible name is computed from any text content inside the element.
     */
    'aria-label'?: string;
    /**
     * This attribute is not required, most of the time we won't use it.
     * And this is a temporary solution for SidePopper.
     * Please see trigger props describe of SidePopper, they are the same.
     */
    trigger?: HTMLElement | HTMLElement[];
}
export declare const ImageSelector: (props: ImageSelectorProps) => React.JSX.Element;
