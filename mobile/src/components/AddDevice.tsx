import * as React from 'react';
import { declareCommands } from 'react-avenger';
import { Text, View } from 'react-native';
import { apiCommands } from '../commands';
import { styles } from '../styles';
import Scan from './Scan/index';

const commands = declareCommands({ createDevice: apiCommands.createDevice });

type Props = typeof commands.Props;

interface State {
  uuid: string;
  name: string;
}

class AddDevice extends React.Component<Props, State> {
  public state: State = {
    uuid: '',
    name: ''
  };

  public onSubmit = () => {
    this.props.createDevice(this.state);
  };

  public render() {
    return (
      <View style={styles.container}>
        <Text>Register a device</Text>
        <Scan />
      </View>
    );
  }
}

export default commands(AddDevice);
