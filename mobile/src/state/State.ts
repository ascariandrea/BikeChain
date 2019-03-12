import * as t from 'io-ts';
import * as models from '../models';
import { MemoryValue } from './memoryValue';

export const error = t.interface({
  message: t.string
});
export type Error = typeof error;

export const scannedDevices = t.array(
  t.interface({
    id: t.string,
    name: t.string
  })
);
export type ScannedDevices = typeof scannedDevices;

export const services = t.array(models.service);
export type Services = typeof services;

export const characteristics = t.array(models.characteristic);
export type Characteristics = typeof characteristics;

export const device = t.interface({
  id: t.string,
  name: t.string,
  services,
  characteristics
});
type Device = typeof device;

export interface State {
  error: MemoryValue<Error>;
  scannedDevices: MemoryValue<ScannedDevices>;
  device: MemoryValue<Device>;
  services: MemoryValue<Services>;
  characteristics: MemoryValue<Characteristics>;
}
