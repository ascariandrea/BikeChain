import * as React from 'react';
import { declareCommands, declareQueries } from 'react-avenger';
import { bleCommands } from '../commands';
import { bleQueries } from '../queries';
import { FlexView } from './common';
import Scan from './Scan';

const queries = declareQueries({
  scannedDevices: bleQueries.scannedDevices
});

const commands = declareCommands({
  scan: bleCommands.scan
});

type Props = typeof queries.Props & typeof commands.Props;

class AddDevice extends React.Component<Props> {
  public render() {
    return (
      <FlexView>
        <Scan onDevicePress={() => undefined} />
      </FlexView>
    );
  }
}

export default queries(commands(AddDevice));
