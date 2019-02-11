import { ask, Reader } from 'fp-ts/lib/Reader';
import { state } from '../state';

const getBLEQueries = () => ({
  scannedDevices: state.scannedDevices.query
});

type BLEQueries = ReturnType<typeof getBLEQueries>;

export const BLEQueriesReader: Reader<BLEQueries, BLEQueries> = ask<
  BLEQueries
>().map(getBLEQueries);
