import * as apiCommands from './apiCommands';
import { makeBLECommands } from './bleCommands';

const bleCommands = makeBLECommands.run({
  restoreStateIdentifier: 'id',
  // tslint:disable-next-line:no-console
  restoreStateFunction: console.log
});

export { apiCommands, bleCommands };
