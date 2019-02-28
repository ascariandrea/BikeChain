import { Button, Text } from 'native-base';
import * as React from 'react';
import { declareCommands, declareQueries } from 'react-avenger';
import { View } from 'react-native';
import { apiCommands, bleCommands } from '../../commands';
import { state } from '../../state/index';
import { styles } from '../../styles';
import { foldQuery } from '../../utils/utils';
import { FlexView } from '../common/FlexView';
import DeviceServiceRow from './DeviceServiceRow';

const queries = declareQueries({
  device: state.device.query
});

const commands = declareCommands({ ...bleCommands, ...apiCommands });

type Props = typeof queries.Props & typeof commands.Props;

function DeviceDetails(props: Props) {
  return (
    <View style={styles.container}>
      <FlexView style={{ width: '100%' }}>
        {foldQuery(
          props.device,
          () => (
            <Text key="no-services">No services for this device</Text>
          ),
          d => (
            <FlexView>
              <FlexView>
                <FlexView>
                  <Text>{d.id}</Text>
                  <Text>{d.name}</Text>
                </FlexView>
                <Button
                  onPress={() =>
                    props.createDevice({ uuid: d.id, name: d.name })
                  }
                >
                  <Text>Register as mine</Text>
                </Button>
              </FlexView>
              <Button
                onPress={() =>
                  props.discoverAllServicesAndCharacteristicsForDevice({
                    deviceId: d.id
                  })
                }
              >
                <Text>Read</Text>
              </Button>
              {d.services.map(s => (
                <DeviceServiceRow
                  key={s.uuid}
                  service={s}
                  characteristics={d.characteristics.filter(
                    c => c.serviceUUID === s.uuid
                  )}
                  onCharacteristicPress={(serviceUUID, characteristicUUID) =>
                    props.readCharacteristicForDevice({
                      deviceId: d.id,
                      serviceUUID,
                      characteristicUUID
                    })
                  }
                />
              ))}
            </FlexView>
          ),
          () => (
            <Text>Loading device...</Text>
          )
        )}
      </FlexView>
    </View>
  );
}

export default commands(queries(DeviceDetails));
