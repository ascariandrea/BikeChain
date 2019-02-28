import { Command } from 'avenger';
import { none } from 'fp-ts/lib/Option';
import { ask, Reader } from 'fp-ts/lib/Reader';
import { right } from 'fp-ts/lib/TaskEither';
import * as t from 'io-ts';
import { ClientRequestReader } from '../API/Client';
import { Auth, Device } from '../models';
import { apiQueries } from '../queries';
import { getAuth, setItem, STORAGE_KEYS } from '../storage';

interface APICommandsConfig {
  client: ClientRequestReader;
}

const makeAPICommands = ({ client }: APICommandsConfig) => ({
  login: Command({
    params: {
      email: t.string,
      password: t.string
    },
    invalidates: { user: apiQueries.user },
    run: body =>
      client
        .run({ auth: none, consumeError: true })
        .post<Auth>('/users/login', body)
        .chain(auth => right(setItem(STORAGE_KEYS.TOKEN, auth.token)))
        .run()
  }),

  createDevice: Command({
    params: {
      uuid: t.string,
      name: t.string
    },
    invalidates: { devices: apiQueries.devices },
    run: device =>
      getAuth()
        .map(auth =>
          client
            .run({
              consumeError: true,
              auth
            })
            .post<Device>('/devices/create', device)
        )
        .run()
  }),
  refreshDevices: Command({
    params: {},
    invalidates: { devices: apiQueries.devices },
    run: Promise.resolve.bind(Promise)
  })
});

type APICommands = ReturnType<typeof makeAPICommands>;

export const APICommandsReader: Reader<APICommandsConfig, APICommands> = ask<
  APICommandsConfig
>().map(makeAPICommands);
