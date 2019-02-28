import { Command, CommandReturn, runCommand } from 'avenger';
import { array, flatten } from 'fp-ts/lib/Array';
import { ask, Reader } from 'fp-ts/lib/Reader';
import { taskEither, TaskEither, tryCatch } from 'fp-ts/lib/TaskEither';
import { sequence } from 'fp-ts/lib/Traversable';
import { Tuple } from 'fp-ts/lib/Tuple';
import * as t from 'io-ts';
import { Characteristic, Service } from '../models';
import { bleQueries } from '../queries';
import { BLEManager } from '../services/ble';
import { GATTParser } from '../services/GATT';
import { State } from '../state';
import { device } from '../state/State';

const getBLECommands = ({
  BLEManager: BLEM,
  GATTParser: GATTP,
  state
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
                  value: (devices || []).concat(
                    device.encode({
                      ...d,
                      name: d.name || 'Unknown',
                      characteristics: [],
                      services: []
                    })
                  )
                }
              ),
            (e: unknown) => e as Error
          )
        )
        .run()
  }),
  stopScan: Command({
    params: {},
    run: () => BLEM.stopDeviceScan().run()
  }),
  connectToDevice: Command({
    params: {
      id: t.string
    },
    run: ({ id }) =>
      BLEM.connectToDevice(id, {
        requestMTU: 23
      })
        .map(d =>
          state.device.set({
            id: d.id,
            name: d.name || 'Unknown',
            services: [],
            characteristics: []
          })
        )
        .run()
  }),
  discoverAllServicesAndCharacteristicsForDevice: Command({
    params: {
      deviceId: t.string
    },
    invalidates: {
      device: state.device.query
    },
    run: ({ deviceId }) => {
      return BLEM.discoverAllServicesAndCharacteristicsForDevice(deviceId)
        .chain(d => {
          return GATTP.chain(parser =>
            BLEM.servicesForDevice(d.id).chain(services =>
              sequence(taskEither, array)(
                services.map(s =>
                  BLEM.characteristicsForDevice(s.deviceID, s.uuid)
                )
              )
                .map(flatten)
                .map(characteristics => {
                  return new Tuple(
                    (services || []).reduce(
                      (acc, s) =>
                        parser.parseService(s).fold(acc, _ => [...acc, _]),
                      [] as Service[]
                    ),
                    (characteristics || []).reduce(
                      (acc, c) =>
                        parser
                          .parseCharacteristic(c)
                          .fold(acc, _ => [...acc, _]),
                      [] as Characteristic[]
                    )
                  );
                })
            )
          ).map(tuple => new Tuple(tuple, d));
        })
        .map(result => {
          state.device.set({
            ...result.snd,
            name: result.snd.name || 'Unknown',
            services: result.fst.fst,
            characteristics: result.fst.snd
          });
        })
        .mapLeft(error => {
          // tslint:disable-next-line:no-console
          console.log('error', error);
        })
        .run();
    }
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
        .map(characteristic => {
          // todo: try to use lens
          const d = state.device.get();
          if (d) {
            state.device.set({
              ...d,
              characteristics: d.characteristics.map(c =>
                c.uuid === characteristic.uuid ? { ...characteristic, ...c } : c
              )
            });
          }
        })
        .run()
  })
});

interface BLECommandsConfig {
  BLEManager: BLEManager;
  GATTParser: TaskEither<Error, GATTParser>;

  state: State;
}

export const makeBLECommands: Reader<
  BLECommandsConfig,
  ReturnType<typeof getBLECommands>
> = ask<BLECommandsConfig>().map(getBLECommands);
