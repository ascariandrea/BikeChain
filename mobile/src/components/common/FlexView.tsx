import * as React from 'react';
import { StyleSheet, View, ViewProperties } from 'react-native';

interface Props extends ViewProperties {
  direction?: 'column' | 'row';
}

export class FlexView extends React.Component<Props> {
  public render() {
    const { children, style, direction = 'row', ...rest } = this.props;
    const finalStyle = StyleSheet.flatten([{ flex: 1 }, style]);
    return (
      <View style={finalStyle} {...rest}>
        {children}
      </View>
    );
  }
}
