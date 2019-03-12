import { client } from '../API';
import { state } from '../state';
import { APIQueriesReader } from './apiQueries';
import { BLEQueriesReader } from './bleQueries';
import * as permissionQueries from './permissionQueries';
import * as storageQueries from './storageQueries';

const apiQueries = APIQueriesReader.run({
  client
});
const bleQueries = BLEQueriesReader.run({
  state
});

export { apiQueries, bleQueries, permissionQueries, storageQueries };
