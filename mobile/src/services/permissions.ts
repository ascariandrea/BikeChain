import { TaskEither, tryCatch } from 'fp-ts/lib/TaskEither';
import { PermissionsAndroid } from 'react-native';

export const requestWriteAccess = (): TaskEither<Error, string> =>
  tryCatch(
    () =>
      PermissionsAndroid.request('android.permission.WRITE_EXTERNAL_STORAGE'),
    (e: unknown) => e as Error
  );
