import {
  fromNullable,
  fromPredicate,
  none,
  Option,
  some
} from 'fp-ts/lib/Option';

type Debug = <T>(o: T) => T;

export const debug: (k: string) => Debug = (m: string) => o => {
  // tslint:disable-next-line:no-console
  console.log(m, o);
  return o;
};

type Query<T> = (
  | {
      ready: false;
    }
  | {
      ready: true;
      value: T;
    }) & {
  loading: boolean;
};

export const fromEmptyString = fromPredicate<string>(s => !!s && s.length > 0);

export const foldQuery = <T, U>(
  query: Query<T>,
  whenReadyAndNone: () => U,
  whenReadyAndSome: (v: T) => U,
  whenNotReady: () => U
): U =>
  query.ready
    ? fromNullable(query.value).foldL(whenReadyAndNone, whenReadyAndSome)
    : whenNotReady();

export const queryAsOption = <T>(query: Query<T>): Option<T> =>
  foldQuery(query, () => none, some, () => none);
