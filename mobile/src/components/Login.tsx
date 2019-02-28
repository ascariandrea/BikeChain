import { none, Option } from 'fp-ts/lib/Option';
import { Button, Form, Input, Item, Text } from 'native-base';
import * as React from 'react';
import { declareCommands } from 'react-avenger';
import { NavigationScreenProps } from 'react-navigation';
import { apiCommands } from '../commands';
import { ROUTES } from '../routes/routes';
import { fromEmptyString } from '../utils/utils';
import { FlexView } from './common';

const commands = declareCommands({
  login: apiCommands.login
});

type Props = typeof commands.Props & NavigationScreenProps;

interface State {
  email: Option<string>;
  password: Option<string>;
}
class Login extends React.Component<Props, State> {
  public state: State = {
    email: none,
    password: none
  };

  public onLoginPress = (email: string, password: string) => {
    this.props.login({ email, password }).then(result => {
      if (result.isRight()) {
        this.props.navigation.navigate(ROUTES.DEVICES);
      }
    });
  };
  public render() {
    const { email, password } = this.state;
    const emailValue = email.getOrElse('');
    const passwordValue = password.getOrElse('');

    return (
      <FlexView direction="row">
        <Form>
          <Item>
            <Input
              placeholder="Username"
              value={emailValue}
              onChangeText={t => {
                this.setState({
                  email: fromEmptyString(t)
                });
              }}
            />
          </Item>
          <Item last>
            <Input
              placeholder="Password"
              value={passwordValue}
              onChangeText={t => {
                this.setState({
                  password: fromEmptyString(t)
                });
              }}
              secureTextEntry={true}
            />
          </Item>
          <Button onPress={() => this.onLoginPress(emailValue, passwordValue)}>
            <Text>LOGIN</Text>
          </Button>
        </Form>
      </FlexView>
    );
  }
}

export default commands(Login);
