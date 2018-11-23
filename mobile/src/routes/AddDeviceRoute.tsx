import * as React from 'react';
import {
  NavigationScreenConfig,
  NavigationStackScreenOptions
} from 'react-navigation';
import AddDevice from '../components/AddDevice';

export class AddDeviceRoute extends React.Component {
  public static navigationOptions: NavigationScreenConfig<
    NavigationStackScreenOptions
  > = () => ({
    title: 'BikeChain'
  });

  public render() {
    return <AddDevice />;
  }
}
