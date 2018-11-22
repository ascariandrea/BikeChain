import * as t from 'io-ts';
import { memoryValue } from '../state/memoryValue';

const error = t.interface({
  message: t.string
});

export const state = {
  error: memoryValue(error)
};
