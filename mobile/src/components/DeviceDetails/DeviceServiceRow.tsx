import { fromNullable, fromPredicate } from 'fp-ts/lib/Option';
import * as React from 'react';
import { Text } from 'react-native';
import { Characteristic, Service } from '../../models';
import { FlexView } from '../common';

interface Props {
  service: Service;
  characteristics: Characteristic[];
  onCharacteristicPress(serviceUUID: string, characteristicUUID: string): void;
}

export default function DeviceServiceRow(props: Props) {
  const { service, characteristics } = props;
  return (
    <FlexView>
      <Text>{service.name}</Text>
      <FlexView>
        <Text>Characteristics</Text>
        {fromPredicate<Characteristic[]>(c => c.length > 0)(
          characteristics
        ).fold(
          [<Text key="no-characteristics">No charateristics</Text>],
          characterictics =>
            characterictics.map(c => (
              <FlexView key={c.name}>
                <Text>{c.name}</Text>
                <Text
                  onPress={() => {
                    props.onCharacteristicPress(service.uuid, c.uuid);
                  }}
                >
                  {c.description}
                </Text>
                {fromNullable(c.value).fold(null, v => (
                  <Text>{v}</Text>
                ))}
              </FlexView>
            ))
        )}
      </FlexView>
    </FlexView>
  );
}
