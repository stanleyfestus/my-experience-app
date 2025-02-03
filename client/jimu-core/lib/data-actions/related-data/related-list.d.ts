import { jsx } from '@emotion/react';
import { type FeatureLayerDataSource, type FeatureDataRecord } from '../../data-sources/interfaces';
import { type UIComponents } from './index';
export interface RelatedListProps {
    widgetId: string;
    dataSource: FeatureLayerDataSource;
    records: FeatureDataRecord[];
    version: number;
    dataViewInfo: {
        [version: number]: FeatureLayerDataSource[];
    };
    uiComponents: UIComponents;
}
export default function RelatedList(props: RelatedListProps): jsx.JSX.Element;
