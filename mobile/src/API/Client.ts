import { CommandReturn, runCommand } from 'avenger';
import Axios, {
  AxiosError,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios';
import { ask, Reader } from 'fp-ts/lib/Reader';
import { ReaderTaskEither, tryCatch } from 'fp-ts/lib/ReaderTaskEither';
import { state } from './global';

interface ClientConfig {
  baseURL: string;
  responseMapper<T>(res: AxiosResponse<any>): T;
  onError(e: AxiosError): void;
}
interface ClientMethodsConfig {
  consumeError: boolean;
}

export interface Client {
  get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): ReaderTaskEither<ClientMethodsConfig, AxiosError, T>;
  post<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): ReaderTaskEither<ClientMethodsConfig, AxiosError, T>;
}

const handlePromise = (clientConfig: ClientConfig) => <T>(
  p: AxiosPromise<any>
): Promise<T> => p.then(res => clientConfig.responseMapper<T>(res));

const handleError = (clientConfig: ClientConfig) => (
  e: unknown,
  opt: ClientMethodsConfig
): AxiosError => {
  const axiosError = e as AxiosError;
  if (opt.consumeError) {
    clientConfig.onError(axiosError);
  }
  return axiosError;
};

const makeClient: Reader<ClientConfig, Client> = ask<ClientConfig>().map(
  clientConfig => {
    const axiosInstance = Axios.create(clientConfig);
    return {
      get: <T>(
        url: string,
        config?: AxiosRequestConfig
      ): ReaderTaskEither<ClientMethodsConfig, AxiosError, T> =>
        tryCatch(
          () => handlePromise(clientConfig)(axiosInstance.get(url, config)),
          handleError(clientConfig)
        ),
      post: <T>(
        url: string,
        data: any,
        config?: AxiosRequestConfig
      ): ReaderTaskEither<ClientMethodsConfig, AxiosError, T> =>
        tryCatch(
          () =>
            handlePromise(clientConfig)(axiosInstance.post(url, data, config)),
          handleError(clientConfig)
        )
    };
  }
);

export const client = makeClient.run({
  baseURL: 'http://localhost:8080',
  responseMapper(res) {
    return res.data;
  },
  onError(e: AxiosError) {
    // tslint:disable-next-line:no-console
    console.dir(e);
    runCommand<void, CommandReturn<any, void>>(state.error.command, {
      value: e
    });
  }
});
