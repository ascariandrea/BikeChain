import Axios, {
  AxiosError,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios';
import { Option } from 'fp-ts/lib/Option';
import { ask, Reader } from 'fp-ts/lib/Reader';
import { TaskEither, tryCatch } from 'fp-ts/lib/TaskEither';

type ResponseMapper = <T>(res: AxiosResponse<any>) => T;
type ErrorHandler = (e: AxiosError) => void;

interface ClientConfig {
  baseURL: string;
  // authToken: Option<string>;
  responseMapper: ResponseMapper;
  onError: ErrorHandler;
}

interface ClientRequestConfig {
  auth: Option<string>;
  consumeError: boolean;
}

export interface Client {
  get<T>(url: string, config?: AxiosRequestConfig): TaskEither<AxiosError, T>;
  post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): TaskEither<AxiosError, T>;
}

const makeURL = (b: string, p: string) => `${b}${p}`;

const patchAxiosRequestConfig = (
  auth: Option<string>,
  arc: AxiosRequestConfig | undefined
): AxiosRequestConfig => ({
  ...arc,
  headers: auth.fold({}, a => ({ Authorization: `Token token=${a}` }))
});

const handlePromise = (f: ResponseMapper) => <T>(
  p: AxiosPromise<any>
): Promise<T> => p.then(res => f<T>(res));

const handleError = (f: ErrorHandler, consumeError: boolean) => (
  e: unknown
): AxiosError => {
  const axiosError = e as AxiosError;
  if (consumeError) {
    f(axiosError);
  }
  return axiosError;
};

export type ClientRequestReader = Reader<ClientRequestConfig, Client>;
export const ClientReader: Reader<ClientConfig, ClientRequestReader> = ask<
  ClientConfig
>().map(({ baseURL, responseMapper, onError }) => {
  return ask<ClientRequestConfig>().map(({ auth, consumeError }) => {
    return {
      get: <T>(
        url: string,
        axiosReqConfig?: AxiosRequestConfig
      ): TaskEither<AxiosError, T> =>
        tryCatch(
          () =>
            handlePromise(responseMapper)(
              Axios.get(
                makeURL(baseURL, url),
                patchAxiosRequestConfig(auth, axiosReqConfig)
              )
            ),
          handleError(onError, consumeError)
        ),
      post: <T>(
        url: string,
        data: any,
        axiosReqConfig?: AxiosRequestConfig
      ): TaskEither<AxiosError, T> =>
        tryCatch(
          () =>
            handlePromise(responseMapper)(
              Axios.post(
                makeURL(baseURL, url),
                data,
                patchAxiosRequestConfig(auth, axiosReqConfig)
              )
            ),
          handleError(onError, consumeError)
        )
    };
  });
});
