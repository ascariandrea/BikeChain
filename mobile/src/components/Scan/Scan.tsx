import * as React from 'react';
import { declareCommands, declareQueries } from 'react-avenger';
import {
  Button,
  FlatList,
  ListRenderItemInfo,
  PermissionsAndroid,
  Text,
  View
} from 'react-native';
import { Device } from 'react-native-ble-plx';
import { bleCommands } from '../../commands';
import { bleQueries } from '../../queries';
import { FlexView } from '../common/FlexView';

const queries = declareQueries({ scannedDevices: bleQueries.scannedDevices });
const commands = declareCommands(bleCommands);

type Props = typeof queries.Props & typeof commands.Props;

interface State {
  isScanning: boolean;
}

class Scan extends React.Component<Props, State> {
  public state: State = {
    isScanning: false
  };

  public render() {
    const { scannedDevices } = this.props;

    return (
      <View style={{ flex: 1, width: '100%' }}>
        <View style={{ flex: 1, alignSelf: 'flex-end' }}>
          {!scannedDevices.loading ? (
            <Button title="Start scanning" onPress={this.scanAndConnect} />
          ) : (
            <Button title="Stop scanning" onPress={this.stopScanning} />
          )}
        </View>
        {scannedDevices.ready ? (
          <FlatList
            renderItem={this.renderDeviceItem}
            keyExtractor={this.keyExtractorId}
            data={scannedDevices.value}
          />
        ) : (
          <Text>No values</Text>
        )}
      </View>
    );
  }

  private onPress = (deviceId: string) => {
    this.props.connectToDevice({ id: deviceId });
  };

  private renderDeviceItem = ({ item }: ListRenderItemInfo<Device>) => (
    <FlexView style={{ flexDirection: 'row', flex: 1 }}>
      <FlexView>
        <Text>{item.id}</Text>
        <Text>{item.name}</Text>
      </FlexView>
      <FlexView>
        <Button title="Connect" onPress={() => this.onPress(item.id)} />
      </FlexView>
    </FlexView>
  );

  private keyExtractorId = (device: Device) => device.id;

  private stopScanning = () => {
    this.props.stopScan({});
  };

  private scanAndConnect = async () => {
    const result = await PermissionsAndroid.request(
      'android.permission.ACCESS_COARSE_LOCATION'
    );

    if (result === 'granted') {
      setTimeout(() => {
        this.stopScanning();
      }, 60 * 1000);

      this.props.scan({});
    }
  };
}

export default queries(commands(Scan));
