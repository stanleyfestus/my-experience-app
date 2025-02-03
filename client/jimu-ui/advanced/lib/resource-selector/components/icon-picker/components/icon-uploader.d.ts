import { React } from 'jimu-core';
import { type ResourceItemInfo, type ImageResourceItemInfo } from 'jimu-for-builder';
interface IconUploaderProps {
    widgetId: string;
    className?: string;
    title?: string;
    onSuccess?: (result: ImageResourceItemInfo) => void;
    onError?: () => void;
    onSizeExceeded?: () => void;
    closeAlert?: () => void;
}
export declare class IconUploader extends React.PureComponent<IconUploaderProps> {
    onChange: (resourceInfo: ResourceItemInfo) => void;
    render(): React.JSX.Element;
}
export {};
