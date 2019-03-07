import { available, Query } from 'avenger';
import { none, Option, some } from 'fp-ts/lib/Option';
import { ask, Reader } from 'fp-ts/lib/Reader';
import { task } from 'fp-ts/lib/Task';
import { ClientRequestReader } from '../API/Client';
import { Device, User } from '../models';
import { getAuth } from '../storage';

interface APIQueriesConfig {
  client: ClientRequestReader;
}

const makeAPIQueries = ({ client }: APIQueriesConfig) => ({
  user: Query({
    params: {},
    cacheStrategy: available,
    fetch: () =>
      getAuth()
        .chain(auth =>
          client
            .run({ auth, consumeError: true })
            .get<User>('/users/me')
            .foldTask<Option<User>>(_ => task.of(none), r => task.of(some(r)))
        )
        .run()
  }),
  devices: Query({
    params: {},
    cacheStrategy: available,
    fetch: () =>
      getAuth()
        .chain(auth =>
          client
            .run({ consumeError: true, auth })
            .get<Device[]>('/devices/getMany')
            .foldTask<Option<Device[]>>(
              _ => task.of(none),
              r => task.of(some(r))
            )
        )
        .run()
  })
});

type APIQueries = ReturnType<typeof makeAPIQueries>;

export const APIQueriesReader: Reader<APIQueriesConfig, APIQueries> = ask<
  APIQueriesConfig
>().map(makeAPIQueries);
