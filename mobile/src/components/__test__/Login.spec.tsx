import * as React from 'react';
// tslint:disable-next-line:no-implicit-dependencies
import * as renderer from 'react-test-renderer';
import { navigation } from '../../../__mocks__/mocks';
import Login from '../Login';

test('should renders correctly', () => {
  const appComponent = renderer.create(<Login navigation={navigation} />);
  const tree = appComponent.toJSON();
  expect(tree).toMatchSnapshot();
});
