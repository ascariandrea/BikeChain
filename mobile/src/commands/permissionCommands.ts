import { Command } from 'avenger';
import { tryCatch } from 'fp-ts/lib/Task';
import { PermissionsAndroid } from 'react-native';

export const accessFineLocation = Command({
  params: {},
  run: () =>
    tryCatch(
      () =>
        PermissionsAndroid.request('android.permission.ACCESS_COARSE_LOCATION'),
      (e: unknown) => e as Error
    ).run()
});
