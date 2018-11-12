declare module 'react-native-ble-plx' {
  interface Device {
    id: string;
    name: string;
  }

  interface Subscription {
    remove(): void;
  }

  type BleManagerState = 'PoweredOn' | 'PoweredOff';
  type BleErrorCodeMessageMapping = {};

  interface BleRestoredState {
    connectedPeripherals: Array<Device>;
  }

  interface BleManagerOptions {
    restoreStateIdentifier?: string;
    restoreStateFunction?(restoredState: BleRestoredState): void;
    errorCodesToMessagesMapping?: BleErrorCodeMessageMapping;
  }

  interface ConnectOptions {
    autoConnect?: boolean;
    requestMTU?: boolean;
  }

  export class BleManager {
    constructor(options: BleManagerOptions);
    onStateChange(
      f: (state: BleManagerState) => void,
      flag: boolean
    ): Subscription;
    startDeviceScan(
      a: any,
      b: any,
      f: (error: Error, device: Device) => void
    ): void;
    stopDeviceScan(): void;
    connectToDevice(
      deviceIdentifier: string,
      options?: ConnectOptions
    ): Promise<Device>;
    cancelDeviceConnection(deviceIdentifier: string): Promise<Device>;
  }
}
