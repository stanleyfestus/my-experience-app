import { Label } from "@amcharts/amcharts4/core";
import { LineSeries } from "@amcharts/amcharts4/charts";
import { DataLabelUpdateProps } from "../interfaces";
/**
 * Creates the data labels on a series
 * @param Series The series on which to initialize the data label
 */
export declare function initializeScatterPlotDataLabel(series: LineSeries): Label;
/**
 * Updates a scatter series data labels style and format.
 * @param props Set of properties necessary to update the data label
 */
export declare function updateScatterPlotDataLabel(props: DataLabelUpdateProps): void;
