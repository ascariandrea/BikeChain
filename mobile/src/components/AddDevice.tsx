import * as React from 'react';
import { declareCommands, declareQueries } from 'react-avenger';
import { Button, Text, View } from 'react-native';
import { createDevice } from '../API/commands';
import { devices } from '../API/queries';
import { Device } from '../models/Device';

const queries = declareQueries({ devices });
const commands = declareCommands({ createDevice });

type Props = typeof commands.Props & typeof queries.Props;

function AddDevice(props: Props) {
  const handlePress = () => {
    props.createDevice({ uuid: 'first-uuid', name: 'first-device' });
  };

  return (
    <View>
      <Button onPress={handlePress} title="Create Device" />
      {props.devices.ready ? (
        props.devices.value.fold<JSX.Element | JSX.Element[]>(
          () => (
            <View>
              <Text>No devices :/</Text>
            </View>
          ),
          (ds: Device[]) =>
            ds.map((d, k) => (
              <View key={k}>
                <Text>{d.id}</Text>
                <Text>{d.name}</Text>
              </View>
            ))
        )
      ) : (
        <View>
          <Text>Loading devices...</Text>
        </View>
      )}
    </View>
  );
}

export default queries(commands(AddDevice));
