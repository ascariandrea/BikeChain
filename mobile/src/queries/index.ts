import { state } from '../state';
import * as apiQueries from './apiQueries';
import { BLEQueriesReader } from './bleQueries';
import * as permissionQueries from './permissionQueries';

const bleQueries = BLEQueriesReader.run({
  state
});

export { apiQueries, bleQueries, permissionQueries };
