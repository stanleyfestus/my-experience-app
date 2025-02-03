import { React, type IMAppConfig, type IntlShape, type ImmutableArray } from 'jimu-core';
import { type IMLinkParam, OpenTypes } from '../../../types';
interface Props {
    linkParam: IMLinkParam;
    originLinkParam: IMLinkParam;
    onLinkParamChange: any;
    appConfig: IMAppConfig;
    intl: IntlShape;
    openTypes: ImmutableArray<OpenTypes>;
}
export default class PageLinkContent extends React.PureComponent<Props, unknown> {
    componentDidMount(): void;
    getInitLinkParam: () => IMLinkParam;
    setLinkParam: (newSelectItem: any) => void;
    render(): React.JSX.Element;
}
export {};
