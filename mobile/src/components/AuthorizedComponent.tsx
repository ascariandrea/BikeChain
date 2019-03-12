import { Text } from 'native-base';
import * as React from 'react';
import { declareQueries } from 'react-avenger';
import { ActivityIndicator } from 'react-native';
import {
  NavigationContainerProps,
  NavigationNavigatorProps
} from 'react-navigation';
import { storageQueries } from '../queries';
import { ROUTES } from '../routes/routes';
import { foldQueryOpt } from '../utils/utils';

const queries = declareQueries({
  token: storageQueries.token
});

type Props = typeof queries.Props & {
  Component: React.ComponentClass<
    NavigationContainerProps<any> & NavigationNavigatorProps<any>
  >;
} & NavigationContainerProps<any> &
  NavigationNavigatorProps<any>;

class AuthorizedComponent extends React.Component<Props> {
  public render() {
    const { Component, token, ...props } = this.props;

    return foldQueryOpt(
      token,
      () => {
        setTimeout(() => {
          if (props.navigation) {
            props.navigation.navigate(ROUTES.LOGIN);
          }
        }, 0);
        return <Text>Redirecting...</Text>;
      },
      () => <Component {...props} />,
      () => <ActivityIndicator />
    );
  }
}

export default queries(AuthorizedComponent);
