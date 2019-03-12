import { available, Query } from 'avenger';
import { none, Option, some } from 'fp-ts/lib/Option';
import { ask, Reader } from 'fp-ts/lib/Reader';
import { task } from 'fp-ts/lib/Task';
import { storageQueries } from '.';
import { ClientRequestReader } from '../API/Client';
import { Device, User } from '../models';
import { debug } from '../utils/utils';

interface APIQueriesConfig {
  client: ClientRequestReader;
}

const makeAPIQueries = ({ client }: APIQueriesConfig) => ({
  user: Query({
    params: {},
    dependencies: { token: storageQueries.token },
    cacheStrategy: available,
    fetch: ({ token }) =>
      token
        .foldL(
          () => task.of(none),
          t =>
            client
              .run({ token: some(t), consumeError: true })
              .get<User>('/users/me')
              .map(debug('my user'))
              .foldTask<Option<User>>(_ => task.of(none), r => task.of(some(r)))
        )
        .run()
  }),
  devices: Query({
    params: {},
    dependencies: { token: storageQueries.token },
    cacheStrategy: available,
    fetch: ({ token }) => {
      return token
        .foldL(
          () => task.of(none),
          t =>
            client
              .run({ consumeError: true, token: some(t) })
              .get<Device[]>('/devices/getMany')
              .foldTask<Option<Device[]>>(
                _ => task.of(none),
                r => task.of(some(r))
              )
        )
        .run();
    }
  })
});

type APIQueries = ReturnType<typeof makeAPIQueries>;

export const APIQueriesReader: Reader<APIQueriesConfig, APIQueries> = ask<
  APIQueriesConfig
>().map(makeAPIQueries);
