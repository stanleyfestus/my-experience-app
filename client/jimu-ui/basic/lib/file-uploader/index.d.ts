import { React } from 'jimu-core';
interface Props {
    accept: string;
    className?: string;
    onUploadSuccess?: (csv: CsvFileInfo) => void;
}
export interface CsvFileInfo {
    name: string;
    id: string;
    records: Array<{
        [key: string]: unknown;
    }>;
}
export declare class FileUploader extends React.PureComponent<Props, unknown> {
    onUploadSuccess: (result: any, file: any, xhr: any) => void;
    render(): React.JSX.Element;
}
export {};
