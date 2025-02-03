import { React, type ImmutableArray, type Expression, type IntlShape, type UseDataSource } from 'jimu-core';
import { type UrlInputResult } from 'jimu-ui';
import { type IMLinkParam, OpenTypes } from '../../../types';
interface Props {
    linkParam: IMLinkParam;
    originLinkParam: IMLinkParam;
    onLinkParamChange: any;
    intl: IntlShape;
    openTypes: ImmutableArray<OpenTypes>;
    widgetId?: string;
    useDataSources?: ImmutableArray<UseDataSource>;
}
interface State {
    isExpPopupOpen: boolean;
    url: string;
}
export default class WebAddressLinkContent extends React.PureComponent<Props, State> {
    constructor(props: any);
    componentDidMount(): void;
    componentDidUpdate(prevProps: Props): void;
    getInitLinkParam: () => IMLinkParam;
    webAddressInputChange: (res: UrlInputResult) => void;
    webAddressExpressionChange: (e: Expression) => void;
    openExpPopup: () => void;
    closeExpPopup: () => void;
    getDefaultExp: () => Expression;
    onUrlChange: (res: UrlInputResult) => void;
    render(): React.JSX.Element;
}
export {};
