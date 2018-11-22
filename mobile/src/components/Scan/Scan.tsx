import { none, Option, some } from 'fp-ts/lib/Option';
import * as React from 'react';
import {
  Button,
  FlatList,
  ListRenderItemInfo,
  PermissionsAndroid,
  Text,
  View
} from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';

interface State {
  isScanning: boolean;
  devices: Option<Device[]>;
}

export default class Scan extends React.Component<{}, State> {
  public state: State = {
    isScanning: false,
    devices: none
  };

  private manager: BleManager;

  constructor(props: {}) {
    super(props);
    this.manager = new BleManager({
      restoreStateIdentifier: 'id',
      // tslint:disable-next-line:no-console
      restoreStateFunction: console.log
    });
  }

  public render() {
    const { isScanning, devices } = this.state;
    return (
      <View style={{ flex: 1, width: '100%' }}>
        <View style={{ flex: 1, alignSelf: 'flex-end' }}>
          {!isScanning ? (
            <Button title="Start scanning" onPress={this.scanAndConnect} />
          ) : (
            <Button title="Stop scanning" onPress={this.stopScanning} />
          )}
        </View>
        <FlatList
          renderItem={this.renderDeviceItem}
          keyExtractor={this.keyExtractorId}
          data={devices.getOrElse([])}
        />
      </View>
    );
  }

  private onPress = (deviceId: string) => {
    this.manager.connectToDevice(deviceId);
  };

  private renderDeviceItem = ({ item }: ListRenderItemInfo<Device>) => (
    <View style={{ flexDirection: 'column', flex: 1 }}>
      <Text>{item.id}</Text>
      <Text>{item.name}</Text>
      <View>
        <Button title="Connect" onPress={() => this.onPress(item.id)} />
      </View>
    </View>
  );

  private keyExtractorId = (device: Device) => device.id;

  private stopScanning = () => {
    this.setState(
      {
        isScanning: false
      },
      this.manager.stopDeviceScan
    );
  };

  private scanAndConnect = async () => {
    const result = await PermissionsAndroid.request(
      'android.permission.ACCESS_COARSE_LOCATION'
    );

    if (result === 'granted') {
      setTimeout(() => {
        this.stopScanning();
      }, 10 * 1000);

      this.setState(
        {
          isScanning: true
        },
        () => {
          const subscription = this.manager.onStateChange(state => {
            if (state === 'PoweredOn') {
              this.manager.startDeviceScan(
                null,
                null,
                async (error, device) => {
                  if (error) {
                    // tslint:disable-next-line:no-console
                    console.log(error);
                    // Handle error (scanning will be stopped automatically)
                    return;
                  }

                  if (device.name === 'JINOUBeacon') {
                    if (
                      !this.state.devices.exists(
                        dvs => !!dvs.find(d => d.id === device.id)
                      )
                    ) {
                      this.setState({
                        devices: this.state.devices
                          .map(devices => devices.concat([device]))
                          .alt(some([device]))
                      });
                    }
                  }
                }
              );
              subscription.remove();
            }
          }, true);
        }
      );
    }
  };
}
