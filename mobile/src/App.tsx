import * as React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { AddDeviceRoute } from './routes/AddDeviceRoute';
import { DeviceDetailsRoute } from './routes/DeviceDetailsRoute';
import { DevicesRoute } from './routes/DevicesRoute';
import { LoginRoute } from './routes/LoginRoute';
import { ROUTES } from './routes/routes';
import { SplashRoute } from './routes/SplashRoute';

const AppContainer = createAppContainer(
  createStackNavigator({
    [ROUTES.SPLASH]: SplashRoute,
    [ROUTES.LOGIN]: LoginRoute,
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
