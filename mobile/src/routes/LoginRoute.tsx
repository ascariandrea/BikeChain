import * as React from 'react';
import {
  NavigationScreenConfig,
  NavigationScreenProps,
  NavigationStackScreenOptions
} from 'react-navigation';
import Login from '../components/Login';

export class LoginRoute extends React.Component<NavigationScreenProps<{}, {}>> {
  public static navigationOptions: NavigationScreenConfig<
    NavigationStackScreenOptions
  > = () => ({
    title: 'Login'
  });

  public render() {
    return <Login navigation={this.props.navigation} />;
  }
}
