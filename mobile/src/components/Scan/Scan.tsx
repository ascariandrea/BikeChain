import { Button, List, Text, Title } from 'native-base';
import * as React from 'react';
import { declareCommands, declareQueries } from 'react-avenger';
import { ActivityIndicator } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NavigationScreenProps } from 'react-navigation';
import { bleCommands, permissionCommands } from '../../commands';
import { bleQueries, permissionQueries } from '../../queries';
import { ROUTES } from '../../routes/routes';
import { FlexView } from '../common/FlexView';

const queries = declareQueries({
  scannedDevices: bleQueries.scannedDevices,
  accessCoarseLocation: permissionQueries.accessCoarseLocation
});
const commands = declareCommands({ ...bleCommands, ...permissionCommands });

type Props = typeof queries.Props &
  typeof commands.Props &
  NavigationScreenProps;

interface State {
  isScanning: boolean;
}

class Scan extends React.Component<Props, State> {
  public state: State = {
    isScanning: false
  };

  public render() {
    const { isScanning } = this.state;
    const { scannedDevices, accessCoarseLocation } = this.props;

    return (
      <FlexView style={{ width: '100%' }}>
        <FlexView style={{ alignSelf: 'flex-end' }}>
          {!isScanning && accessCoarseLocation.ready ? (
            <Button
              primary
              onPress={this.scanAndConnect(accessCoarseLocation.value)}
            >
              <Text>Start</Text>
            </Button>
          ) : (
            <Button primary onPress={this.stopScanning}>
              <Text>Stop</Text>
            </Button>
          )}
        </FlexView>
        <FlexView
          style={{
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {scannedDevices.loading ? (
            <ActivityIndicator />
          ) : !scannedDevices.ready ? (
            <Text>No values</Text>
          ) : scannedDevices.value ? (
            <List
              style={{ flex: 1, width: '100%' }}
              renderRow={this.renderDeviceItem}
              dataArray={scannedDevices.value}
            />
          ) : (
            <Text>No values!</Text>
          )}
        </FlexView>
      </FlexView>
    );
  }

  private onPress = (deviceId: string) => {
    this.props.connectToDevice({ id: deviceId }).then(result => {
      result.map(() => {
        this.props.navigation.navigate(ROUTES.DEVICE_DETAILS);
      });
    });
  };

  private renderDeviceItem = (item: Device) => (
    <FlexView direction="column" style={{ width: '100%' }}>
      <FlexView>
        <Text>{item.name}</Text>
        <Text>{item.id}</Text>
      </FlexView>
      <FlexView>
        <Button onPress={() => this.onPress(item.id)}>
          <Title>DETAILS</Title>
        </Button>
      </FlexView>
    </FlexView>
  );

  private stopScanning = () => {
    this.setState(
      {
        isScanning: false
      },
      () => this.props.stopScan({})
    );
  };

  private scanAndConnect = (coarseLocationGranted: boolean) => () => {
    if (coarseLocationGranted) {
      setTimeout(() => {
        this.stopScanning();
      }, 60 * 1000);

      this.setState(
        {
          isScanning: true
        },
        () => this.props.scan({})
      );
    } else {
      this.props.doAccessCoarseLocation({});
    }
  };
}

export default queries(commands(Scan));
