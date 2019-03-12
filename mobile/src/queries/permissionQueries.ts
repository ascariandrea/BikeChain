import { available, Query } from 'avenger';
import { PermissionsAndroid } from 'react-native';

export const accessCoarseLocation = Query({
  params: {},
  cacheStrategy: available,
  fetch: () =>
    PermissionsAndroid.check('android.permission.ACCESS_COARSE_LOCATION')
});
