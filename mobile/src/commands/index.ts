import { client } from '../API';
import { BLEManager, GATTParser } from '../services';
import { state } from '../state';
import { APICommandsReader } from './apiCommands';
import { makeBLECommands as BLECommandsReader } from './bleCommands';
import * as permissionCommands from './permissionCommands';

const apiCommands = APICommandsReader.run({
  client
});

const bleCommands = BLECommandsReader.run({
  BLEManager,
  GATTParser,
  state
});

export { apiCommands, bleCommands, permissionCommands };
