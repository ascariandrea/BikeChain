import { Icon } from 'native-base';
import * as React from 'react';
import {
  createAppContainer,
  createBottomTabNavigator,
  createStackNavigator,
  createSwitchNavigator
} from 'react-navigation';
import { AddDevicesRoute } from './routes/AddDevicesRoute';
import { DeviceDetailsRoute } from './routes/DeviceDetailsRoute';
import { DevicesRoute } from './routes/DevicesRoute';
import { LoginRoute } from './routes/LoginRoute';
import { ROUTES } from './routes/routes';
import ScanRoute from './routes/ScanRoute';
import { SplashRoute } from './routes/SplashRoute';
import { UserProfileRoute } from './routes/UserProfileRoute';

const getIconNameFromRouteName = (routeName: string): string => {
  switch (routeName) {
    case ROUTES.SCAN: {
      return 'qr-scanner';
    }
    case ROUTES.DEVICES: {
      return 'pricetags';
    }
    default:
      return 'person';
  }
};

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      [ROUTES.SPLASH]: SplashRoute,
      [ROUTES.LOGIN]: LoginRoute,
      Auth: createBottomTabNavigator(
        {
          [ROUTES.SCAN]: ScanRoute,
          [ROUTES.DEVICES]: createStackNavigator(
            {
              [ROUTES.DEVICES]: DevicesRoute,
              [ROUTES.ADD_DEVICE]: AddDevicesRoute,
              [ROUTES.DEVICE_DETAILS]: DeviceDetailsRoute
            },
            { initialRouteName: ROUTES.DEVICES }
          ),
          Profile: createStackNavigator({
            [ROUTES.USER_PROFILE]: UserProfileRoute
          })
        },
        {
          initialRouteName: ROUTES.SCAN,
          defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
              const iconName = getIconNameFromRouteName(
                navigation.state.routeName
              );

              return (
                <Icon
                  name={iconName}
                  color={tintColor || undefined}
                  fontSize={27}
                  active={focused}
                />
              );
            }
          }),
          tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray'
          }
        }
      )
    },
    { initialRouteName: ROUTES.SPLASH, backBehavior: 'none' }
  )
);

export default class App extends React.Component {
  public render() {
    return <AppContainer />;
  }
}
