import { type ServiceDefinition } from 'jimu-core';
import { type ArcGISCapabilities, type ArcGISQueryCapabilities } from '../interfaces';
import { CapabilitiesImpl, type CapabilitiesConstructorOptions } from './capabilities-impl';
export interface ArcGISCapabilitiesConstructorOptions extends CapabilitiesConstructorOptions {
    layerDefinition: ServiceDefinition;
    isClientSide: boolean;
}
export declare class ArcGISCapabilitiesImpl extends CapabilitiesImpl implements ArcGISCapabilities {
    private readonly layerDefinition;
    private readonly isClientSide;
    getQueryCapabilities(): ArcGISQueryCapabilities;
}
