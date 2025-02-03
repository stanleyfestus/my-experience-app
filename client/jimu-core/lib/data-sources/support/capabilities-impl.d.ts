import { type Capabilities, type QueryCapabilities } from '../interfaces';
export interface CapabilitiesConstructorOptions {
}
export declare class CapabilitiesImpl implements Capabilities {
    constructor(options: CapabilitiesConstructorOptions);
    getQueryCapabilities(): QueryCapabilities;
}
