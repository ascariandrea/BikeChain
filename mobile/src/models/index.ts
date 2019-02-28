import * as t from 'io-ts';

const auth = t.interface({
  token: t.string
});

export interface Auth extends t.TypeOf<typeof auth> {}

const user = t.interface({
  email: t.string,
  password: t.string
});

export interface User extends t.TypeOf<typeof user> {}
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
