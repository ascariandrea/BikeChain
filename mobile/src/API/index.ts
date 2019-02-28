import { CommandReturn, runCommand } from 'avenger';
import { AxiosError } from 'axios';
import { config } from '../config';
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
    runCommand<void, CommandReturn<any, void>>(state.error.command, {
      value: e
    });
  }
});
