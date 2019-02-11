import { Command, CommandReturn, runCommand } from 'avenger';
import { array, flatten } from 'fp-ts/lib/Array';
import { ask, Reader } from 'fp-ts/lib/Reader';
import { taskEither, TaskEither, tryCatch } from 'fp-ts/lib/TaskEither';
import { sequence } from 'fp-ts/lib/Traversable';
import { Tuple } from 'fp-ts/lib/Tuple';
import * as t from 'io-ts';
import { bleQueries } from '../queries';
import { BLEManager } from '../services/ble';
import { GATTParser } from '../services/GATT';
import { state } from '../state';

const getBLECommands = ({
  BLEManager: BLEM,
  GATTParser: GATTP
}: BLECommandsConfig) => ({
  scan: Command({
    params: {},
    dependencies: { scannedDevices: bleQueries.scannedDevices },
    run: ({ scannedDevices: devices }) =>
      BLEM.startDeviceScanning()
        .chain(d =>
          tryCatch(
            () =>
              runCommand<void, CommandReturn<any, void>>(
                state.scannedDevices.command,
                {
                  value: (devices || []).concat(d)
                }
              ),
            (e: unknown) => e as Error
          )
        )
        .run()
  }),
  stopScan: Command({
    params: {},
    run: BLEM.stopDeviceScan().run
  }),
  connectToDevice: Command({
    params: {
      id: t.string
    },
    run: ({ id }) =>
      BLEM.connectToDevice(id, {
        autoConnect: false,
        requestMTU: 23
      })
        .map(d =>
          state.device.set({
            id: d.id,
            services: undefined,
            characteristics: undefined
          })
        )
        .run()
  }),
  discoverAllServicesAndCharacteristicsForDevice: Command({
    params: {
      deviceId: t.string
    },
    run: ({ deviceId }) =>
      BLEM.discoverAllServicesAndCharacteristicsForDevice(deviceId)
        .chain(device =>
          GATTP.chain(parser =>
            BLEM.servicesForDevice(device.id).chain(services =>
              sequence(taskEither, array)(
                services.map(s =>
                  BLEM.characteristicsForDevice(s.deviceID, s.uuid)
                )
              )
                .map(flatten)
                .map(
                  characteristics =>
                    new Tuple(
                      services.map(s => parser.parseService(s)),
                      characteristics.map(c => parser.parseCharateristic(c))
                    )
                )
            )
          )
        )
        .map(result => {
          state.device.set({
            id: deviceId,
            services: result.fst,
            characteristics: result.snd
          });
        })
        .run()
  }),
  readCharacteristicForDevice: Command({
    params: {
      deviceId: t.string,
      serviceUUID: t.string,
      characteristicUUID: t.string
    },
    invalidates: {
      device: state.device.query
    },
    run: ({ deviceId, serviceUUID, characteristicUUID }) =>
      BLEM.readCharacteristicForDevice(
        deviceId,
        serviceUUID,
        characteristicUUID
      )
        .map(() => undefined)
        .run()
  })
});

interface BLECommandsConfig {
  BLEManager: BLEManager;
  GATTParser: TaskEither<Error, GATTParser>;
}

export const makeBLECommands: Reader<
  BLECommandsConfig,
  ReturnType<typeof getBLECommands>
> = ask<BLECommandsConfig>().map(getBLECommands);
