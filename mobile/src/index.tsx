import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import ScanRoute from './routes/ScanRoute';

export default class App extends React.Component {
  public render() {
    return (
      <View style={styles.container}>
        <ScanRoute />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
