import * as React from 'react';
import { Text } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { ROUTES } from '../routes/routes';
import { storage } from '../services';
import { FlexView } from './common';

type Props = NavigationScreenProps;
class Splash extends React.Component<Props> {
  public componentDidMount() {
    storage
      .getAuth()
      .map(authOpt => {
        if (authOpt.isSome()) {
          this.props.navigation.navigate(ROUTES.SCAN);
        } else {
          this.props.navigation.navigate(ROUTES.LOGIN);
        }
      })
      .run();
  }
  public render() {
    return (
      <FlexView direction="row" style={{ alignItems: 'center' }}>
        <Text>Bikechain</Text>
      </FlexView>
    );
  }
}
export default Splash;
