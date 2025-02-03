/** @jsx jsx */
import { jsx } from 'jimu-core';
import { type JimuLayerView, type JimuLayerViews } from 'jimu-arcgis';
/**
 * The JimuLayerViewSelector and JimuLayerViewSelectorDropdown component props.
 */
export interface JimuLayerViewSelectorProps {
    /** @ignore */
    className?: string;
    /**
     * The id of a jimuMapView, it is usually returned by selecting from a jimuMapViewSelector component.
     */
    jimuMapViewId: string;
    /**
     * Callback when selected layers are changed.
     */
    onChange: (jimuLayerViewIds: string[]) => void;
    /**
     * Selected values.
     */
    selectedValues?: string[];
    /**
     * Whether to hide some types of jimuLayerView.
     * @param jimuLayerView: the current layer.
     * @param jimuLayerViews: all the layers that from a jimuMapView.
     * @default false
     */
    hideLayers?: (jimuLayerView: JimuLayerView, jimuLayerViews: JimuLayerViews) => boolean;
    /**
     * Whether to disable some types of jimuLayerView, which are not selectable.
     * @param jimuLayerView: the current layer.
     * @param jimuLayerViews: all the layers that from a jimuMapView.
     * @default false
     */
    disableLayers?: (jimuLayerView: JimuLayerView, jimuLayerViews: JimuLayerViews) => boolean;
    /**
     * Whether or not allow to select multi items.
     *  @default false
     */
    isMultiSelection?: boolean;
    /**
     * Whether or not is used in the JimuLayerViewSelectorDropdown component. This property is used for height style calculation.
     * @ignore
     * @default false
     */
    isInDropdown?: boolean;
    /**
     * Whether or not to show the tables.
     * @default false
     */
    isShowTables?: boolean;
}
/**
 * A component for selecting layers in a map view. It is usually used in the
 * setting page to get the layer id.
 * ```
 * import { JimuLayerViewSelector } from 'jimu-ui/advanced/setting-components'
 * ```
 */
export declare const _JimuLayerViewSelector: (props: JimuLayerViewSelectorProps) => jsx.JSX.Element;
/**
 * A component for selecting layers in a map view. It is usually used on the settings page of a widget.
 * It includes a dropdown button to display the selected values and JimuLayerViewSelector component to select the layer.
 * ```
 * import { JimuLayerViewSelector } from 'jimu-ui/advanced/setting-components'
 * ```
 */
export declare const JimuLayerViewSelector: import("@emotion/styled").StyledComponent<JimuLayerViewSelectorProps, {}, {}>;
