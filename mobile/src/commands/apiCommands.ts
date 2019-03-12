import { Command } from 'avenger';
import { left, right } from 'fp-ts/lib/Either';
import { none } from 'fp-ts/lib/Option';
import { ask, Reader } from 'fp-ts/lib/Reader';
import { task } from 'fp-ts/lib/Task';
import * as t from 'io-ts';
import { ClientRequestReader } from '../API/Client';
import { Auth, Device } from '../models';
import { apiQueries, storageQueries } from '../queries';
import { storage } from '../services';

interface APICommandsConfig {
  client: ClientRequestReader;
}

const makeAPICommands = ({ client }: APICommandsConfig) => ({
  doLogin: Command({
    params: {
      email: t.string,
      password: t.string
    },
    run: body =>
      client
        .run({ token: none, consumeError: true })
        .post<Auth>('/users/login', body)
        .foldTask(
          e => task.of(left(e)),
          auth =>
            storage
              .setItem(storage.STORAGE_KEYS.TOKEN, auth.token)
              .map(() => right(auth))
        )
        .run()
  }),
  createDevice: Command({
    params: {
      uuid: t.string,
      name: t.string
    },
    invalidates: { devices: apiQueries.devices },
    dependencies: { token: storageQueries.token },
    run: ({ uuid, name, token }) =>
      client
        .run({
          consumeError: true,
          token
        })
        .post<Device>('/devices/create', { uuid, name })
        .foldTask(e => task.of(left(e)), d => task.of(right(d)))
        .run()
  }),
  refreshDevices: Command({
    params: {},
    invalidates: { devices: apiQueries.devices },
    run: Promise.resolve.bind(Promise)
  }),
  doLogout: Command({
    params: {},
    invalidates: { user: apiQueries.user, token: storageQueries.token },
    dependencies: { token: storageQueries.token },
    run: ({ token }) =>
      client
        .run({ consumeError: true, token })
        .post<Auth>('/users/logout', {})
        .foldTask(
          e => task.of(left(e)),
          () => storage.removeItem(storage.STORAGE_KEYS.TOKEN).map(right)
        )
        .run()
  })
});

type APICommands = ReturnType<typeof makeAPICommands>;

export const APICommandsReader: Reader<APICommandsConfig, APICommands> = ask<
  APICommandsConfig
>().map(makeAPICommands);
