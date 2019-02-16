import { fromNullable } from 'fp-ts/lib/Option';

type Debug = <T>(o: T) => T;

export const debug: (k: string) => Debug = (m: string) => o => {
  // tslint:disable-next-line:no-console
  console.log(m, o);
  return o;
};

export const foldQuery = <T>(
  query: (
    | {
        ready: false;
      }
    | {
        ready: true;
        value: T;
      }) & {
    loading: boolean;
  },
  whenReadyAndNone: () => JSX.Element | JSX.Element[],
  whenReadyAndSome: (v: T) => JSX.Element | JSX.Element[],
  whenNotReady: () => JSX.Element | JSX.Element[]
): JSX.Element | JSX.Element[] =>
  query.ready
    ? fromNullable(query.value).foldL(whenReadyAndNone, whenReadyAndSome)
    : whenNotReady();
