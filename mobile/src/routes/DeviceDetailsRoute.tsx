import * as React from 'react';
import {
  NavigationScreenConfig,
  NavigationStackScreenOptions
} from 'react-navigation';
import DeviceDetails from '../components/DeviceDetails';

export class DeviceDetailsRoute extends React.Component {
  public static navigationOptions: NavigationScreenConfig<
    NavigationStackScreenOptions
  > = () => ({
    title: 'Device Details'
  });

  public render() {
    return <DeviceDetails />;
  }
}
