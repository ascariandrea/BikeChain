import { BLEManager, GATTParser } from '../services';
import * as apiQueries from './apiQueries';
import { BLEQueriesReader } from './bleQueries';
import * as permissionQueries from './permissionQueries';

const bleQueries = BLEQueriesReader.run({
  BLEManager,
  GATTParser
});

export { apiQueries, bleQueries, permissionQueries };
