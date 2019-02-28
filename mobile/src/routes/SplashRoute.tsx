import * as React from 'react';
import {
  NavigationScreenConfig,
  NavigationScreenProps,
  NavigationStackScreenOptions
} from 'react-navigation';
import Splash from '../components/Splash';

export class SplashRoute extends React.Component<
  NavigationScreenProps<{}, {}>
> {
  public static navigationOptions: NavigationScreenConfig<
    NavigationStackScreenOptions
  > = () => ({
    header: null
  });

  public render() {
    return <Splash navigation={this.props.navigation} />;
  }
}
