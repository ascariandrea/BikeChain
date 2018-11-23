import { Command, CommandReturn, runCommand } from 'avenger';
import { compose } from 'fp-ts/lib/function';
import { ask, Reader } from 'fp-ts/lib/Reader';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import * as t from 'io-ts';
import { BleManager, BleManagerOptions } from 'react-native-ble-plx';
import { bleQueries } from '../queries';
import { state } from '../state';

const getBLEManager = (bleOpt: BleManagerOptions) => new BleManager(bleOpt);

const getBLECommands = (bleManager: BleManager) => {
  return {
    scan: Command({
      params: {},
      dependencies: { scannedDevices: bleQueries.scannedDevices },
      run: ({ scannedDevices: devices }) =>
        tryCatch(
          () =>
            new Promise<void>((resolve, reject) => {
              const subscription = bleManager.onStateChange(bleState => {
                if (bleState === 'PoweredOn') {
                  bleManager.startDeviceScan(null, null, (error, device) => {
                    if (error) {
                      // tslint:disable-next-line:no-console
                      console.log(error);
                      // Handle error (scanning will be stopped automatically)
                      return reject(error);
                    }

                    if (device.name === 'JINOUBeacon') {
                      runCommand<void, CommandReturn<any, void>>(
                        state.scannedDevices.command,
                        {
                          value: (devices || []).concat(device)
                        }
                      );
                      return resolve();
                    }
                  });
                  subscription.remove();
                }
              }, true);
            }),
          (reason: unknown) => reason as Error
        ).run()
    }),
    stopScan: Command({
      params: {},
      run: () => Promise.resolve(bleManager.stopDeviceScan())
    }),
    connectToDevice: Command({
      params: {
        id: t.string
      },
      run: ({ id }) =>
        tryCatch(
          () => bleManager.connectToDevice(id),
          (reason: unknown) => reason as Error
        ).run()
    })
  };
};

export const makeBLECommands: Reader<
  BleManagerOptions,
  ReturnType<typeof getBLECommands>
> = ask<BleManagerOptions>().map(
  compose(
    getBLECommands,
    getBLEManager
  )
);
