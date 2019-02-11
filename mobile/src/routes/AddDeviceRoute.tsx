import * as React from 'react';
import {
  NavigationScreenConfig,
  NavigationScreenProps,
  NavigationStackScreenOptions
} from 'react-navigation';
import AddDevice from '../components/AddDevice';

export class AddDeviceRoute extends React.Component<
  NavigationScreenProps<{}, {}>
> {
  public static navigationOptions: NavigationScreenConfig<
    NavigationStackScreenOptions
  > = () => ({
    title: 'BikeChain'
  });

  public render() {
    return <AddDevice navigation={this.props.navigation} />;
  }
}
