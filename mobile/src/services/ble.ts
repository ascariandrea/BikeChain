import { ask, Reader } from 'fp-ts/lib/Reader';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import {
  BleManager,
  BleManagerOptions,
  ConnectOptions,
  Device,
  Error
} from 'react-native-ble-plx';

const errorHandler = (e: unknown): Error => {
  // tslint:disable-next-line:no-console
  console.log(e);
  return e as Error;
};

const taskifiedBLEManager = (bleM: BleManager) => ({
  startDeviceScanning: () => {
    return tryCatch(
      () =>
        new Promise<Device>((resolve, reject) => {
          const subscription = bleM.onStateChange(bleState => {
            if (bleState === 'PoweredOn') {
              bleM.startDeviceScan(null, null, (error, device) => {
                if (error) {
                  // tslint:disable-next-line:no-console
                  console.log(error);
                  // Handle error (scanning will be stopped automatically)
                  return reject(error);
                }

                if (device.name === 'JINOUBeacon') {
                  return resolve(device);
                }
              });
              subscription.remove();
            }
          }, true);
        }),
      (reason: unknown) => reason as Error
    );
  },
  stopDeviceScan: () =>
    tryCatch(() => Promise.resolve(bleM.stopDeviceScan()), errorHandler),
  connectToDevice: (deviceId: string, opt?: ConnectOptions) =>
    tryCatch(() => bleM.connectToDevice(deviceId, opt), errorHandler),
  discoverAllServicesAndCharacteristicsForDevice: (deviceId: string) =>
    tryCatch(
      () => bleM.discoverAllServicesAndCharacteristicsForDevice(deviceId),
      errorHandler
    ),
  servicesForDevice: (deviceId: string) =>
    tryCatch(() => bleM.servicesForDevice(deviceId), errorHandler),
  characteristicsForDevice: (deviceId: string, serviceUUID: string) =>
    tryCatch(
      () => bleM.characteristicsForDevice(deviceId, serviceUUID),
      errorHandler
    ),
  readCharacteristicForDevice: (
    deviceId: string,
    serviceUUID: string,
    characteristicUUID: string
  ) =>
    tryCatch(
      () =>
        bleM.readCharacteristicForDevice(
          deviceId,
          serviceUUID,
          characteristicUUID
        ),
      errorHandler
    )
});

export type BLEManager = ReturnType<typeof taskifiedBLEManager>;

export const BLEManagerReader: Reader<BleManagerOptions, BLEManager> = ask<
  BleManagerOptions
>().map(c => taskifiedBLEManager(new BleManager(c)));
