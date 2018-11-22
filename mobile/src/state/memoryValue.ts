import { Command, Query } from 'avenger';
import { Type, TypeOf } from 'io-ts';

export function memoryValue<T extends Type<any, any>>(
  valueType: T,
  debugId?: string
) {
  const store: { value?: TypeOf<T> } = {};
  const get = () => {
    return store.value as undefined | TypeOf<T>;
  };
  const set = (value: TypeOf<T>) => {
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
        ? Promise.resolve(store.value as TypeOf<T>)
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
