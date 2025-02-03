import { React, type ImmutableArray, type JimuFieldType, type WidgetJson } from 'jimu-core';
import { type Editor, type Formats, type RichSelection } from 'jimu-ui/advanced/rich-text-editor';
interface Props {
    editor: Editor;
    className?: string;
    types?: ImmutableArray<JimuFieldType>;
    selectWidgets?: WidgetJson[];
    selection: RichSelection;
    formats?: Formats;
}
export declare const _UrlInfoSelector: (props: Props) => React.ReactElement;
export declare const UrlInfoSelector: import("@emotion/styled").StyledComponent<Props, {}, {}>;
export {};
