import { available, Query } from 'avenger';
import { AxiosError } from 'axios';
import { Either, left, right } from 'fp-ts/lib/Either';
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
            .foldTask<Either<AxiosError, User>>(
              l => task.of(left(l)),
              r => task.of(right(r))
            )
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
            .foldTask<Either<AxiosError, Device[]>>(
              l => task.of(left(l)),
              r => task.of(right(r))
            )
        )
        .run()
  })
});

type APIQueries = ReturnType<typeof makeAPIQueries>;

export const APIQueriesReader: Reader<APIQueriesConfig, APIQueries> = ask<
  APIQueriesConfig
>().map(makeAPIQueries);
