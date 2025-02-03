import { React } from 'jimu-core';
/**
 * The JimuMapViewSelector component props
 */
export interface JimuMapViewSelectorProps {
    /**
     * The array of map view IDs. It is returned from the onChange function.
     */
    useMapViewIds?: string[];
    /**
     * The function will be called when a map view item listed in this component is selected.
     */
    onChange?: (useMapViewId: string[]) => void;
    /**
     * To provide a label for the selector for accessibility purposes.
     */
    'aria-label'?: string;
}
/**
 * A component for selecting map views in a map. It is usually used on the settings page of a widget,
 * and works with JimuLayerViewSelector.
 * ```
 * import { JimuMapViewSelector } from 'jimu-ui/advanced/setting-components'
 * ```
 */
export declare const _JimuMapViewSelector: (props: JimuMapViewSelectorProps) => React.JSX.Element;
/**
 * A component for selecting map views in a map. It is usually used on the settings page of a widget,
 * and works with JimuLayerViewSelector.
 * ```
 * import { JimuMapViewSelector } from 'jimu-ui/advanced/setting-components'
 * ```
 */
export declare const JimuMapViewSelector: (props: JimuMapViewSelectorProps) => React.JSX.Element;
