import { Command } from 'avenger';
import * as t from 'io-ts';
import { Device } from '../models/Device';
import { client } from './Client';
import { devices } from './queries';

export const createDevice = Command({
  params: {
    uuid: t.string,
    name: t.string
  },
  invalidates: { devices },
  run: device =>
    client.post<Device>('/devices/create', device).run({ consumeError: true })
});
