import * as t from 'io-ts';
import { memoryValue } from '../state/memoryValue';

const error = t.interface({
  message: t.string
});

const scannedDevices = t.array(
  t.type({
    id: t.string,
    name: t.string
  })
);

export const state = {
  error: memoryValue(error),
  scannedDevices: memoryValue(scannedDevices)
};
