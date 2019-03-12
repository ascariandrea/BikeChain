import * as React from 'react';

export default {
  UIManager: {
    directEventTypes: jest.fn()
  }
};

class BaseButton extends React.Component<{}> {
  public render() {
    return React.createElement('BaseButton', this.props, this.props.children);
  }
}

export { BaseButton };
