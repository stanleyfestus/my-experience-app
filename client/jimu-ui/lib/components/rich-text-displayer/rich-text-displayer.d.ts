import { React, type RepeatedDataSource, type UseDataSource, type ImmutableArray, type IMExpressionMap, type ImmutableObject, type DataRecord } from 'jimu-core';
import { type RichDisplayerProps } from './rich-displayer';
import { type LinkParam } from 'jimu-ui/advanced/setting-components';
/**
 * The RichTextDisplayer components props.
 */
export interface RichTextDisplayerProps extends RichDisplayerProps {
    /**
     * The data source inherited from the parent widget to parse expressions in rich text.
     */
    repeatedDataSource?: RepeatedDataSource;
    /**
     * The data source of the widget where the component is located to parse expressions in rich text.
     */
    useDataSources?: ImmutableArray<UseDataSource>;
    /**
     * If included, it will use these `records` to resolve the expression.
     * If not, it will use `useDataSources` to create the data source instances, then use these data sources to resolve the expression.
     *
     * Must pass in one of `useDataSources` and `records`.
     */
    records?: {
        [dataSourceId: string]: DataRecord[];
    };
    /**
     * The id of the widget where the component is located.
     */
    widgetId?: string;
    /**
     * Rich text to display in this component.
     */
    value: string;
    /**
     * If the value is empty, placeholder will be displayed.
     */
    placeholder?: string;
}
export declare const useClickLinkHandler: (onClick: (evt: any) => void) => [HTMLLinkElement, LinkParam | string, (evt?: React.MouseEvent<HTMLElement>) => void];
export declare const useParsedExpressions: (html: string) => IMExpressionMap;
export declare const useResolvedHtml: (propHtml: string, values: ImmutableObject<{
    [id: string]: string;
}>) => string;
/**
 * The `RichTextDisplayer` component provides the user the ability to show the results of the `RichTextEditor`.
 *
 * Note: This component will handle the jump of the link and the parsing of the expression together.
 * If you just display pure rich text, please use component `RichDisplayer`.
 *
 * ```ts
 * import { RichTextDisplayer } from 'jimu-ui'
 * ```
 */
export declare const RichTextDisplayer: React.MemoExoticComponent<React.ForwardRefExoticComponent<RichTextDisplayerProps & React.RefAttributes<HTMLDivElement>>>;
