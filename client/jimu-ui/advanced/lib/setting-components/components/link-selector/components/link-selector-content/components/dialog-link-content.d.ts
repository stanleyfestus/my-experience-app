import { React, type IMAppConfig, type IntlShape } from 'jimu-core';
import { type IMLinkParam } from '../../../types';
interface Props {
    linkParam: IMLinkParam;
    originLinkParam: IMLinkParam;
    onLinkParamChange: any;
    appConfig: IMAppConfig;
    intl: IntlShape;
}
export default class DialogLinkContent extends React.PureComponent<Props, unknown> {
    componentDidMount(): void;
    componentDidUpdate(prevProps: Props): void;
    getInitLinkParam: () => IMLinkParam;
    setLinkParam: (newSelectItem: any) => void;
    render(): React.JSX.Element;
}
export {};
