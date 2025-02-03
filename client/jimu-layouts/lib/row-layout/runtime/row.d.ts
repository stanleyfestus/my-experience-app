/** @jsx jsx */
import { React, type IMLayoutJson } from 'jimu-core';
import { type LayoutProps, type RowLayoutSetting } from '../../types';
import { type ChildRect } from '../types';
type RowLayoutProps = LayoutProps & {
    layout: IMLayoutJson;
    transformedLayout: IMLayoutJson;
    isMultiRow: boolean;
};
export declare class Row extends React.PureComponent<RowLayoutProps> {
    childRects: ChildRect[];
    flipLeftRight: boolean;
    constructor(props: any);
    collectBounds(): ChildRect[];
    getConfig(): RowLayoutSetting;
    createItem(childRects: ChildRect[], index: number, layoutStyle: any): JSX.Element;
    render(): JSX.Element;
}
export {};
