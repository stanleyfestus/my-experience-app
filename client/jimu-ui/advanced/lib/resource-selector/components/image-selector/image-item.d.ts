/** @jsx jsx */
import { jsx } from 'jimu-core';
import { type ImageResourceItemInfo } from 'jimu-for-builder';
interface ImageItemProps {
    item: ImageResourceItemInfo;
    selected: boolean;
    disableRemove: boolean;
    removeTitle: string;
    onClick: (item: ImageResourceItemInfo, selected: boolean) => void;
    onRemove: (item: ImageResourceItemInfo) => void;
}
export declare const ImageItem: (props: ImageItemProps) => jsx.JSX.Element;
export {};
