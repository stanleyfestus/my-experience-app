/** @jsx jsx */
import { jsx } from 'jimu-core';
import { type ImageResourceItemInfo } from 'jimu-for-builder';
import { type ImageParam } from 'jimu-ui';
export interface ImageListProps {
    imageResources: {
        [key: string]: ImageResourceItemInfo;
    };
    selectedItem: ImageParam;
    onClickItem: (item: ImageResourceItemInfo, selected: boolean) => void;
    onRemoveItem: (item: ImageResourceItemInfo) => void;
}
export default function ImageList(props: ImageListProps): jsx.JSX.Element;
