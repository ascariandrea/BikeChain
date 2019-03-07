import { Button, List, Text } from 'native-base';
import * as React from 'react';
import { Device } from '../models';
import { FlexView } from './common';

interface Props {
  devices: Device[];
  onPress(d: Device): void;
}

export default function BLEDeviceList(props: Props) {
  return (
    <List
      style={{ flex: 1, width: '100%' }}
      renderRow={BLEDeviceItem(props.onPress)}
      dataArray={props.devices}
    />
  );
}

const BLEDeviceItem = (onPress: Props['onPress']) => (item: Device) => (
  <FlexView direction="column" style={{ width: '100%' }}>
    <FlexView>
      <Text>{item.name}</Text>
      <Text>{item.id}</Text>
    </FlexView>
    <FlexView>
      <Button onPress={() => onPress(item)}>
        <Text>DETAILS</Text>
      </Button>
    </FlexView>
  </FlexView>
);
