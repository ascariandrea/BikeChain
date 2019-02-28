import { memoryValue } from '../state/memoryValue';
import {
  characteristics,
  device,
  error,
  scannedDevices,
  services,
  State
} from './State';

export const state: State = {
  error: memoryValue(error),
  scannedDevices: memoryValue(scannedDevices),
  device: memoryValue(device),
  services: memoryValue(services),
  characteristics: memoryValue(characteristics)
};

export { State };
