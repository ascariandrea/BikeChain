import { tryCatch as tryCatchException } from 'fp-ts/lib/Exception';
import { IO } from 'fp-ts/lib/IO';
import { fromNullable, none, Option } from 'fp-ts/lib/Option';
import { Task, tryCatch } from 'fp-ts/lib/Task';
import { AsyncStorage } from 'react-native';
import { debug } from '../utils/utils';

export const STORAGE_KEYS = {
  TOKEN: 'token'
};

export const getItem = <T>(key: string): Task<Option<T>> => {
  return tryCatch(() => AsyncStorage.getItem(key), debug('AsyncStorage error.'))
    .map(result => {
      return result
        .map(v => {
          return fromNullable(v).map(i =>
            tryCatchException(new IO(() => JSON.parse(i)))
              .map(e => e.mapLeft(debug('parsing error')).getOrElse(none))
              .run()
          );
        })
        .getOrElse(none);
    })
    .map(debug('token'));
};

export const getAuth = () => getItem<string>(STORAGE_KEYS.TOKEN);

export const setItem = (key: string, item: any): Task<void> => {
  return tryCatch(
    () => AsyncStorage.setItem(key, JSON.stringify(item)),
    debug(`AsyncStorage failed to set item ${key}`)
  ).map(result => result.getOrElse(undefined));
};
