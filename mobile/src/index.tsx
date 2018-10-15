import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import ScanRoute from './ScanRoute';

const onScan = () => undefined;

export default class App extends React.Component {
  public render() {
    return (
      <View style={styles.container}>
        <ScanRoute onScan={onScan} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  }
});
