import { Command } from 'avenger';
import * as t from 'io-ts';
import { client } from '../API/Client';
import { Device } from '../models';
import { apiQueries } from '../queries';

export const createDevice = Command({
  params: {
    uuid: t.string,
    name: t.string
  },
  invalidates: { devices: apiQueries.devices },
  run: device =>
    client.post<Device>('/devices/create', device).run({ consumeError: true })
});

export const refreshDevices = Command({
  params: {},
  invalidates: { devices: apiQueries.devices },
  run: Promise.resolve.bind(Promise)
});
