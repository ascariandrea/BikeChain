import { available, Query } from 'avenger';
import { Device } from '../models/Device';
import { client } from './Client';

export const devices = Query({
  params: {},
  cacheStrategy: available,
  fetch: () =>
    client.get<Device[]>('/devices/getMany').run({ consumeError: true })
});
