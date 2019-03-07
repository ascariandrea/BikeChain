import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import Scan from '../components/Scan';
import { ROUTES } from './routes';

export default class ScanRoute extends React.Component<NavigationScreenProps> {
  public render() {
    return (
      <Scan
        onDevicePress={() =>
          this.props.navigation.navigate(ROUTES.DEVICE_DETAILS)
        }
      />
    );
  }
}
