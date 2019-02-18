import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { styles } from '../styles';
import Scan from './Scan/index';

type Props = NavigationScreenProps;

interface State {
  uuid: string;
  name: string;
}

class AddDevice extends React.Component<Props, State> {
  public state: State = {
    uuid: '',
    name: ''
  };

  public render() {
    return (
      <View style={styles.container}>
        <Text>Register a device</Text>
        <Scan navigation={this.props.navigation} />
      </View>
    );
  }
}

export default AddDevice;
