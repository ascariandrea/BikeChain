import * as t from 'io-ts';
import { memoryValue } from '../state/memoryValue';

const error = t.interface({
  message: t.string
});

const scannedDevices = t.array(
  t.interface({
    id: t.string,
    name: t.string
  })
);

const services = t.array(t.any);
const characteristics = t.array(t.any);

const device = t.interface({
  id: t.string,
  services: t.any,
  characteristics: t.any
});

export const state = {
  error: memoryValue(error),
  scannedDevices: memoryValue(scannedDevices),
  device: memoryValue(device),
  services: memoryValue(services),
  characteristics: memoryValue(characteristics)
};
