import { Button, List, ListItem, Text } from 'native-base';
import * as React from 'react';
import { declareCommands, declareQueries } from 'react-avenger';
import { apiCommands } from '../commands';
import { Device } from '../models/Device';
import { apiQueries } from '../queries';
import { FlexView } from './common/FlexView';

const commands = declareCommands({
  refreshDevices: apiCommands.refreshDevices
});
const queries = declareQueries({ devices: apiQueries.devices });

type Props = typeof queries.Props & typeof commands.Props;

function Devices(props: Props) {
  return (
    <FlexView direction="row">
      {props.devices.ready ? (
        props.devices.value.fold<JSX.Element | JSX.Element[]>(
          () => <Text>No devices :/</Text>,
          (ds: Device[]) => (
            <FlexView>
              <List
                dataArray={ds}
                renderRow={(d, k) => (
                  <ListItem key={k} noIndent={true}>
                    <Text>{d.name}</Text>
                  </ListItem>
                )}
              />
            </FlexView>
          )
        )
      ) : (
        <FlexView>
          <Text>Loading devices...</Text>
        </FlexView>
      )}
      <FlexView style={{ alignItems: 'center', alignContent: 'center' }}>
        <Button onPress={() => props.refreshDevices({})}>
          <Text>Refresh</Text>
        </Button>
      </FlexView>
    </FlexView>
  );
}

export default queries(commands(Devices));
