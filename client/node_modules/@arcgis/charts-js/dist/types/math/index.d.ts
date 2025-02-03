import { WebChartBin } from "@arcgis/charts-spec";
import { NormalDistributionProps } from "./interfaces";
/**
 * Function Definition: https://js.tensorflow.org/api/0.6.1/#linspace
 * Returns empty array when number of points are <= 0 or range is 0
 */
export declare function linspace(start: number, end: number, numberOfPoints: number): number[];
/**
 * Calculates the y values of the normal distribution curve
 * @param param0
 */
export declare function calculateNormalDistribution({ x, mean, stddev, scalingFactor }: NormalDistributionProps): number;
/**
 * Valid only for "equal-interval" type histogram classification
 * @param histogram
 * @param summaryStatistics
 */
export declare function calculateScalingFactor(bins: WebChartBin[]): number;
