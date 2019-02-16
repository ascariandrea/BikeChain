import { available, Query } from 'avenger';
import { client } from '../API/Client';
import { Device } from '../models';

export const devices = Query({
  params: {},
  cacheStrategy: available,
  fetch: () =>
    client.get<Device[]>('/devices/getMany').run({ consumeError: true })
});
