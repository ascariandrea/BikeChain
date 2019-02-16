import { ask, Reader } from 'fp-ts/lib/Reader';
import { State } from '../state';

const getBLEQueries = ({ state }: BLEQueriesConfig) => ({
  scannedDevices: state.scannedDevices.query
});

type BLEQueries = ReturnType<typeof getBLEQueries>;

interface BLEQueriesConfig {
  state: State;
}

export const BLEQueriesReader: Reader<BLEQueriesConfig, BLEQueries> = ask<
  BLEQueriesConfig
>().map(getBLEQueries);
