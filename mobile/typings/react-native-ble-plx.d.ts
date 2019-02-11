declare module 'react-native-ble-plx' {
  type UUID = string;
  interface Characteristic {
    deviceID: string;
    id: number;
    isIndicatable: boolean;
    isNotifiable: boolean;
    isNotifying: boolean;
    isReadable: boolean;
    isWritableWithResponse: boolean;
    isWritableWithoutResponse: boolean;
    serviceID: number;
    serviceUUID: UUID;
    uuid: UUID;
    value: any;
  }

  interface Service {
    deviceID: string;
    id: number;
    isPrimary: boolean;
    uuid: string;
    characteristics(): Promise<Characteristic[]>;
  }

  interface Device {
    id: string;
    name: string;
    isConnected(): Promise<boolean>;
    discoverAllServicesAndCharateristics(): Promise<Device>;
    services(): Promise<Service[]>;
    characteristicsForService(serviceUUID: UUID): Promise<Characteristic[]>;
  }

  interface Subscription {
    remove(): void;
  }

  type BleManagerState = 'PoweredOn' | 'PoweredOff';
  interface BleErrorCodeMessageMapping {}

  interface BleRestoredState {
    connectedPeripherals: Device[];
  }

  interface BleManagerOptions {
    restoreStateIdentifier?: string;
    errorCodesToMessagesMapping?: BleErrorCodeMessageMapping;
    restoreStateFunction?(restoredState: BleRestoredState): void;
  }

  interface ConnectOptions {
    autoConnect?: boolean;
    requestMTU?: number;
  }

  interface ScanOptions {
    allowDuplicates?: boolean;
  }

  export class BleManager {
    constructor(options: BleManagerOptions);
    public onStateChange(
      f: (state: BleManagerState) => void,
      flag: boolean
    ): Subscription;
    public startDeviceScan(
      UUIDs: UUID[] | null,
      b: ScanOptions | null,
      f: (error: Error, device: Device) => void
    ): void;
    public stopDeviceScan(): Promise<void>;
    public connectToDevice(
      deviceIdentifier: string,
      options?: ConnectOptions
    ): Promise<Device>;
    public cancelDeviceConnection(deviceIdentifier: string): Promise<Device>;
    public discoverAllServicesAndCharacteristicsForDevice(
      deviceId: Device['id']
    ): Promise<Device>;
    public readCharacteristicForDevice(
      deviceIdentifier: Device['id'],
      serviceUUID: UUID,
      characteristicUUID: UUID
    ): Promise<Characteristic>;
    public servicesForDevice(
      deviceIdentifier: Device['id']
    ): Promise<Service[]>;

    public characteristicsForDevice(
      deviceId: Device['id'],
      serviceUUID: UUID
    ): Promise<Characteristic[]>;
  }
}
