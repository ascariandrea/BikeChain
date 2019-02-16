import * as t from 'io-ts';

export const device = t.interface({
  id: t.string,
  name: t.string
});

export interface Device extends t.TypeOf<typeof device> {}

export const characteristic = t.interface({
  uuid: t.string,
  serviceUUID: t.string,
  name: t.string,
  type: t.string,
  description: t.string,
  value: t.union([t.undefined, t.string])
});

export type Characteristic = t.TypeOf<typeof characteristic>;

export const service = t.interface({
  uuid: t.string,
  name: t.string,
  type: t.string
});

export type Service = t.TypeOf<typeof service>;
