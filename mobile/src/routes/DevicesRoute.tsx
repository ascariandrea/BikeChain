import * as React from 'react';
import { Button } from 'react-native';
import {
  NavigationScreenConfig,
  NavigationStackScreenOptions
} from 'react-navigation';
import Devices from '../components/Devices';
import { ROUTES } from './routes';

export class DevicesRoute extends React.Component {
  public static navigationOptions: NavigationScreenConfig<
    NavigationStackScreenOptions
  > = ({ navigation }) => ({
    title: 'Devices',
    headerRight: (
      <Button
        title="Add Device"
        onPress={() => navigation.navigate(ROUTES.ADD_DEVICE)}
      />
    )
  });

  public render() {
    return <Devices />;
  }
}
