import * as React from 'react';
import { StyleSheet, View } from 'react-native';
// import ScanRoute from './routes/ScanRoute';
import AddDevice from './components/AddDevice';
import Toaster from './components/Toaster';

export default class App extends React.Component {
  public render() {
    return (
      <View style={styles.container}>
        <Toaster />
        <AddDevice />
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
