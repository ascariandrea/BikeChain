import { BLEManager, GATTParser } from '../services';
import * as apiCommands from './apiCommands';
import { makeBLECommands as BLECommandsReader } from './bleCommands';
import * as permissionCommands from './permissionCommands';

const bleCommands = BLECommandsReader.run({
  BLEManager,
  GATTParser
});

export { apiCommands, bleCommands, permissionCommands };
