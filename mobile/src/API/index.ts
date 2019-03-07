import { CommandReturn, runCommand } from 'avenger';
import { AxiosError } from 'axios';
import { config } from '../config';
import { storage } from '../services';
import { state } from '../state';
import { ClientReader } from './Client';

export const client = ClientReader.run({
  baseURL: config.baseURL,
  responseMapper(res) {
    return res.data;
  },
  onError(e: AxiosError) {
    // tslint:disable-next-line:no-console
    console.dir(e);
    if (e.response) {
      switch (e.response.status) {
        case 401: {
          storage.removeItem(storage.STORAGE_KEYS.TOKEN).run();
        }
      }
    }

    runCommand<void, CommandReturn<any, void>>(state.error.command, {
      value: e
    });
  }
});
