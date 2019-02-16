import { memoryValue } from '../state/memoryValue';
import {
  characteristics,
  device,
  error,
  scannedDevices,
  services
} from './State';

export const state = {
  error: memoryValue(error),
  scannedDevices: memoryValue(scannedDevices),
  device: memoryValue(device),
  services: memoryValue(services),
  characteristics: memoryValue(characteristics)
};

export type State = typeof state;
