import { Button, Text } from 'native-base';
import * as React from 'react';
import { declareCommands, declareQueries } from 'react-avenger';
import { ActivityIndicator } from 'react-native';
import { bleCommands, permissionCommands } from '../commands';
import { Device } from '../models';
import { bleQueries, permissionQueries } from '../queries';
import { foldQuery } from '../utils/utils';
import BLEDeviceList from './BLEDeviceList';
import { FlexView } from './common/FlexView';

const queries = declareQueries({
  scannedDevices: bleQueries.scannedDevices,
  accessCoarseLocation: permissionQueries.accessCoarseLocation
});
const commands = declareCommands({ ...bleCommands, ...permissionCommands });

type Props = typeof queries.Props &
  typeof commands.Props & { onDevicePress(d: Device): void };

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
        <FlexView
          style={{
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {foldQuery(
            scannedDevices,
            () => (
              <Text>No values</Text>
            ),
            devices => (
              <BLEDeviceList devices={devices} onPress={this.onPress} />
            ),
            () => (
              <ActivityIndicator />
            )
          )}
        </FlexView>
        <FlexView style={{ alignSelf: 'center' }}>
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
      </FlexView>
    );
  }

  private onPress = (d: Device) => {
    this.props.connectToDevice({ id: d.id }).then(result => {
      result.map(() => {
        this.props.onDevicePress(d);
      });
    });
  };

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
