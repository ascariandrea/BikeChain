import { Button, List, ListItem, Text } from 'native-base';
import * as React from 'react';
import { declareCommands, declareQueries } from 'react-avenger';
import { ActivityIndicator } from 'react-native';
import { apiCommands } from '../commands';
import { Device } from '../models';
import { apiQueries } from '../queries';
import { foldQueryOpt } from '../utils/utils';
import { FlexView } from './common/FlexView';

const commands = declareCommands({
  refreshDevices: apiCommands.refreshDevices
});
const queries = declareQueries({ devices: apiQueries.devices });

type Props = typeof queries.Props & typeof commands.Props;

function Devices(props: Props) {
  return (
    <FlexView direction="row">
      {foldQueryOpt(
        props.devices,
        () => (
          <Text>No devices :/</Text>
        ),
        (ds: Device[]) => (
          <FlexView>
            <List
              dataArray={ds}
              renderRow={(d, k) => (
                <ListItem key={k} noIndent={true}>
                  <Text>{d.name}</Text>
                </ListItem>
              )}
              renderFooter={() => (
                <FlexView
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Button onPress={() => props.refreshDevices({})}>
                    <Text>Refresh</Text>
                  </Button>
                </FlexView>
              )}
            />
          </FlexView>
        ),
        () => (
          <ActivityIndicator />
        )
      )}
    </FlexView>
  );
}

export default queries(commands(Devices));
