import * as React from 'react';
import { declareQueries } from 'react-avenger';
import { Text, View } from 'react-native';
import { state } from '../state';

const queries = declareQueries({ error: state.error.query });

type Props = typeof queries.Props;

function Toaster(props: Props) {
  const message = props.error.ready
    ? props.error.value && props.error.value.message
    : 'None';

  return (
    <View>
      <Text>Error: {message}</Text>
    </View>
  );
}

export default queries(Toaster);
