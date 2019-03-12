import { Command } from 'avenger';
import { tryCatch } from 'fp-ts/lib/Task';
import { PermissionsAndroid } from 'react-native';
import { accessCoarseLocation } from '../queries/permissionQueries';

export const doAccessCoarseLocation = Command({
  params: {},
  invalidates: {
    accessCoarseLocation
  },
  run: () =>
    tryCatch(
      () =>
        PermissionsAndroid.request('android.permission.ACCESS_COARSE_LOCATION'),
      (e: unknown) => e as Error
    ).run()
});
