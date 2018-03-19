'use strict';

import React from 'react';
import PasswordGesture from 'react-native-gesture-password';

interface InternalProps {
  navigation;
}

interface InternalState {
  password: string;
  status: string;
  message: string;
}

export default class SetGesture extends React.Component<InternalProps, InternalState> {

  public constructor(props: InternalProps) {
    super(props);

    this.state = {
      password: '',
      message: 'Please set your gesture',
      status: 'normal',
    };
  }

  public onEnd(password) {
    if (this.state.password === '') {
      // The first password
      this.setState({
        password,
        status: 'normal',
        message: 'Please set your gesture again',
      });
    } else {
      // The second password
      if (password === this.state.password) {
        this.setState({
          status: 'right',
          message: 'Your gesture is set successfully',
        }, () => {
          // save the password to redux store

        });
      } else {
        this.setState({
          status: 'wrong',
          message: 'Gestures are not the same, please try again',
        });
      }
    }
  }

  public onStart() {
    if (this.state.password === '') {
      this.setState({
        message: 'Please set your gesture',
      });
    } else {
      this.setState({
        message: 'Please set your gesture again',
      });
    }
  }

  public render() {
    return (
      <PasswordGesture
        style={{ marginTop: - 30 }}
        textStyle={{ marginTop: 60 }}
        ref="pg"
        status={this.state.status}
        message={this.state.message}
        onStart={() => this.onStart()}
        onEnd={(password) => this.onEnd(password)}
      />
    );
  }
}
