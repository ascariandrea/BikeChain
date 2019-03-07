import { Button, Text } from 'native-base';
import * as React from 'react';
import { declareCommands, declareQueries } from 'react-avenger';
import { ActivityIndicator } from 'react-native';
import { apiCommands } from '../commands';
import { apiQueries } from '../queries';
import { foldQuery } from '../utils/utils';
import { FlexView } from './common';

const queries = declareQueries({
  user: apiQueries.user
});

const commands = declareCommands({
  doLogout: apiCommands.doLogout
});

type Props = typeof queries.Props & typeof commands.Props;

class UserProfile extends React.Component<Props> {
  public render() {
    const { user, doLogout } = this.props;
    return (
      <FlexView>
        {foldQuery(
          user,
          () => (
            <Text>No user available</Text>
          ),
          result =>
            result.fold(<Text>No user available</Text>, u => (
              <FlexView>
                <Text>{u.email}</Text>
                <Button onPress={() => doLogout({})}>
                  <Text>Logout</Text>
                </Button>
              </FlexView>
            )),
          () => (
            <ActivityIndicator />
          )
        )}
      </FlexView>
    );
  }
}

export default queries(commands(UserProfile));
