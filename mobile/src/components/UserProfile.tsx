import { Text } from 'native-base';
import * as React from 'react';
import { declareQueries } from 'react-avenger';
import { apiQueries } from '../queries';
import { foldQuery } from '../utils/utils';
import { FlexView } from './common';

const queries = declareQueries({
  user: apiQueries.user
});
type Props = typeof queries.Props;

class UserProfile extends React.Component<Props> {
  public render() {
    const { user } = this.props;

    return (
      <FlexView>
        {foldQuery(
          user,
          () => (
            <Text>No user available</Text>
          ),
          result =>
            result.fold(<Text>No user available</Text>, u => (
              <Text>{u.email}</Text>
            )),
          () => (
            <Text>Loading</Text>
          )
        )}
      </FlexView>
    );
  }
}

export default queries(UserProfile);
