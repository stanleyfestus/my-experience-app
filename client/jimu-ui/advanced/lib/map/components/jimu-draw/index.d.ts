/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import type { JimuDrawProps } from './contexts-bridge';
import { Arrangement } from './components/layouts';
import { JimuDrawCreationMode, DrawingElevationMode3D } from './components/sketch';
import type { JimuDrawingOptions, JimuDrawCreatedDescriptor, DrawingUpdatedDescriptor, JimuDrawVisibleElements } from './components/sketch';
import { useMeasurementsUnitsInfos } from './components/measurements';
import type { MeasurementsUnitsInfo, MeasurementsPropsInfo, MDecimalPlaces } from './components/measurements';
export { type JimuDrawProps, type JimuDrawingOptions, JimuDrawCreationMode, Arrangement, DrawingElevationMode3D, type JimuDrawVisibleElements, type JimuDrawCreatedDescriptor, type DrawingUpdatedDescriptor, useMeasurementsUnitsInfos, type MDecimalPlaces };
export type { MeasurementsPropsInfo, MeasurementsUnitsInfo };
export declare const JimuDraw: React.MemoExoticComponent<(props: JimuDrawProps) => jsx.JSX.Element>;
