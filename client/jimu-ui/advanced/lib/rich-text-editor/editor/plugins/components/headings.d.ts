import { React } from 'jimu-core';
import { type StandardComponentProps } from 'jimu-ui';
import { HeaderValue } from '../../../type';
interface Props extends StandardComponentProps {
    title?: string;
    value?: HeaderValue;
    'aria-label'?: string;
    onChange?: (value: HeaderValue) => void;
}
export declare const Headings: (props: Props) => React.JSX.Element;
export {};
