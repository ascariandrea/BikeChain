import { Query } from 'avenger';
import { Option } from 'fp-ts/lib/Option';
import { storage } from '../services';

export const token = Query<{}, Option<string>>({
  params: {},
  fetch: () =>
    storage
      .getItem<string>(storage.STORAGE_KEYS.TOKEN)
      // .map(t => t.toUndefined() as string)
      .run()
});
