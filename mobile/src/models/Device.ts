import * as t from 'io-ts';

const device = t.interface({
  id: t.string,
  name: t.string
});

export interface Device extends t.TypeOf<typeof device> {}
