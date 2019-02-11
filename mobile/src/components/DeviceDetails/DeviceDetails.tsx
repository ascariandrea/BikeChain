import { fromNullable } from 'fp-ts/lib/Option';
import { Text } from 'native-base';
import * as React from 'react';
import { declareCommands, declareQueries } from 'react-avenger';
import { bleCommands } from '../../commands';
import { state } from '../../state';
import { FlexView } from '../common/FlexView';
import DeviceServiceRow from './DeviceServiceRow';

const queries = declareQueries({
  device: state.device.query
});

const commands = declareCommands({
  readCharacteristicForDevice: bleCommands.readCharacteristicForDevice
});

type Props = typeof queries.Props & typeof commands.Props;

function DeviceDetails(props: Props) {
  if (props.device.ready) {
    const deviceId = props.device.value.id;
    return (
      <FlexView>
        {fromNullable(props.device.value.services).fold(
          [<Text key="no-services">No services for this device</Text>],
          services =>
            services.map(s => (
              <DeviceServiceRow
                key={s.uuid}
                service={s}
                onCharacteristicPress={(serviceUUID, characteristicUUID) =>
                  props.readCharacteristicForDevice({
                    deviceId,
                    serviceUUID,
                    characteristicUUID
                  })
                }
              />
            ))
        )}
      </FlexView>
    );
  } else {
    return <Text>Loading</Text>;
  }
}

export default commands(queries(DeviceDetails));
