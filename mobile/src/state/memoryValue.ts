import { Command, CommandReturn, Query, QueryReturn } from 'avenger';
import * as t from 'io-ts';

interface IOTSParams {
  [k: string]: t.Type<any, any>;
}

type IOTSDictToType<O extends IOTSParams> = { [k in keyof O]: t.TypeOf<O[k]> };
export interface StateReturnValue<T extends t.Type<any, any>> {
  query: QueryReturn<IOTSDictToType<{}>, T['_A']>;
  command: CommandReturn<
    IOTSDictToType<{
      value: T;
    }> &
      IOTSDictToType<{}>,
    void
  >;
  set(value: t.TypeOf<T>): void;
  clear(): void;
  get(): undefined | t.TypeOf<T>;
}

export type MemoryValue<T extends t.Type<any, any>> = ReturnType<
  (value: T) => StateReturnValue<T>
>;

export function memoryValue<T extends t.Type<any, any>>(
  valueType: T,
  debugId?: string
): StateReturnValue<T> {
  const store: { value?: t.TypeOf<T> } = {};
  const get = () => {
    return store.value as undefined | t.TypeOf<T>;
  };
  const set = (value: t.TypeOf<T>) => {
    store.value = value;
  };
  const clear = () => {
    delete store.value;
  };
  const query = Query({
    debugId,
    params: {},
    fetch: () =>
      store.hasOwnProperty('value')
        ? Promise.resolve(store.value as t.TypeOf<T>)
        : Promise.resolve(null)
  });
  const command = Command({
    params: { value: valueType },
    invalidates: { query },
    run: ({ value }) => {
      set(value);
      return Promise.resolve();
    }
  });
  return { query, command, get, set, clear };
}
