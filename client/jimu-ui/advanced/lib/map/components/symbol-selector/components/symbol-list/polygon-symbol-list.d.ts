import { React, type IntlShape, type IMThemeVariables } from 'jimu-core';
import { type JimuSymbol, type JimuPolygonSymbol } from 'jimu-ui/advanced/map';
interface Props {
    intl?: IntlShape;
    theme: IMThemeVariables;
    symbol?: JimuPolygonSymbol;
    onSymbolChanged: (symbol: JimuSymbol) => void;
    onA11yFocus: () => void;
}
interface States {
    apiLoaded: boolean;
    currentIndex: number;
}
export declare class PolygonSymbolList extends React.PureComponent<Props, States> {
    jsonUtils: typeof __esri.jsonUtils;
    constructor(props: any);
    componentDidMount(): void;
    handleSymbolSelected: (index: number, symbol: any) => void;
    renderPolygonSymbolList: () => React.JSX.Element[];
    getPolygonSymbolParamsSetting: () => React.JSX.Element;
    updateSymbolOutLineWeight: (value: any) => void;
    updateSymbolOutLineColor: (color: string) => void;
    updateSymbolFillColor: (color: string) => void;
    updateSymbolOpacity: (value: any) => void;
    render(): React.JSX.Element;
}
export {};
