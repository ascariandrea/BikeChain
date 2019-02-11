import * as React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { AddDeviceRoute } from './routes/AddDeviceRoute';
import { DeviceDetailsRoute } from './routes/DeviceDetailsRoute';
import { DevicesRoute } from './routes/DevicesRoute';
import { ROUTES } from './routes/routes';

const AppContainer = createAppContainer(
  createStackNavigator({
    [ROUTES.DEVICES]: DevicesRoute,
    [ROUTES.ADD_DEVICE]: AddDeviceRoute,
    [ROUTES.DEVICE_DETAILS]: DeviceDetailsRoute
  })
);

export default class App extends React.Component {
  public render() {
    return <AppContainer />;
  }
}
