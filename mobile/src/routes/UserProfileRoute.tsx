import * as React from 'react';
import {
  NavigationScreenConfig,
  NavigationScreenProps,
  NavigationStackScreenOptions
} from 'react-navigation';
import UserProfile from '../components/UserProfile';

export class UserProfileRoute extends React.Component<
  NavigationScreenProps<{}, {}>
> {
  public static navigationOptions: NavigationScreenConfig<
    NavigationStackScreenOptions
  > = () => ({
    title: 'Login'
  });

  public render() {
    return <UserProfile />;
  }
}
