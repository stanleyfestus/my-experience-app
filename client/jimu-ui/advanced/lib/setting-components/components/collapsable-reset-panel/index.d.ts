/** @jsx jsx */
import { jsx } from 'jimu-core';
import { type CollapsablePanelProps } from 'jimu-ui';
interface LabelResetProps {
    label: string;
    isEmpty: boolean;
    onReset: () => void;
}
interface CollapsableResetPanelProps extends LabelResetProps, Omit<CollapsablePanelProps, 'label'> {
    children?: React.ReactNode;
}
export declare function CollapsableResetPanel(props: CollapsableResetPanelProps): jsx.JSX.Element;
export declare function LabelReset(props: LabelResetProps): jsx.JSX.Element;
export {};
