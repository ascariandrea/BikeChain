import * as React from 'react';
import { StyleSheet, View, ViewProperties } from 'react-native';

export class FlexView extends React.Component<ViewProperties> {
  public render() {
    const { children, style, ...rest } = this.props;

    return (
      <View style={StyleSheet.flatten([{ flex: 1 }, style])} {...rest}>
        {children}
      </View>
    );
  }
}
