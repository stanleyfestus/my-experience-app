import { React } from 'jimu-core';
import { type ButtonGroupProps, TextAlignValue, type ButtonType } from 'jimu-ui';
type TextAlignmentProps = Omit<ButtonGroupProps, 'onChange'> & {
    buttonType?: ButtonType;
    textAlign?: TextAlignValue;
    onChange?: (value: TextAlignValue) => void;
    showJustify?: boolean;
    autoFlip?: boolean;
};
export declare const TextAlignment: (props: TextAlignmentProps) => React.JSX.Element;
export {};
