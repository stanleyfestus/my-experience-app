/** @jsx jsx */
import { React, jsx, type IMThemeVariables } from 'jimu-core';
export interface WindowTemplatePopperProps {
    theme: IMThemeVariables;
    referenceElement: HTMLElement;
    formatMessage: (id: string, values?: {
        [key: string]: any;
    }) => string;
    onItemSelect: (item: any) => void;
    onClose: () => void;
}
interface State {
    open: boolean;
}
export declare class WindowTemplatePopper extends React.PureComponent<WindowTemplatePopperProps, State> {
    constructor(props: any);
    togglePopper: () => void;
    onItemSelect: (templateJson: any) => void;
    render(): jsx.JSX.Element;
}
export {};
