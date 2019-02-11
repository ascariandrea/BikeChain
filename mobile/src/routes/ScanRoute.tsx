import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import Scan from '../components/Scan/index';

export default class ScanRoute extends React.Component<NavigationScreenProps> {
  public render() {
    return <Scan navigation={this.props.navigation} />;
  }
}
