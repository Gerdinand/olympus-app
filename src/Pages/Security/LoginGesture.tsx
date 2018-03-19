'use strict';

import React from 'react';
import PasswordGesture from 'react-native-gesture-password';

interface InternalProps {
  loginSucceed: () => void;
}

interface InternalState {
  status: string;
  message: string;
}

export default class LoginGesture extends React.Component<InternalProps, InternalState> {
  public constructor(props) {
    super(props);

    this.state = {
      message: 'Please enter your gesture to confirm identity',
      status: 'normal',
    };
  }
  // check password
  public onEnd(password) {
    if (password === '123') {
      this.setState({
        status: 'right',
        message: 'Login successfully',
      });

      this.props.loginSucceed();
    } else {
      this.setState({
        status: 'wrong',
        message: 'Gesture is wrong, please try again',
      });
    }
  }

  public onStart() {
    this.setState({
      status: 'normal',
      message: 'Please set your gesture',
    });
  }

  public onReset() {
    this.setState({
      status: 'normal',
      message: 'Please set your gesture (again).',
    });
  }

  public render() {
    return (
      <PasswordGesture
        ref="pg"
        status={this.state.status}
        message={this.state.message}
        onStart={() => this.onStart()}
        onEnd={(password) => this.onEnd(password)}
      />
    );
  }
}
