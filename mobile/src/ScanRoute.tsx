import * as React from 'react';
import { Button, View } from 'react-native';

interface Props {
  onScan(): void;
}
export default function ScanRoute(props: Props) {
  const { onScan } = props;
  return (
    <View>
      <Button title="Scan" onPress={onScan} />
    </View>
  );
}
