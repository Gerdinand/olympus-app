'use strict';

import React from 'react';
import PasswordGesture from 'react-native-gesture-password';
import WalletActions from './SecurityActions';
import { connect } from 'react-redux';
import { AppState } from '../../reducer';

interface InternalProps {
  navigation;
  gesturePassword: string;

  setGesture: (password) => any;
}

interface InternalState {
  status: string;
  message: string;
}

enum GestureStep {
  CURRENT_PASSWORD = 'CURRENT_PASSWORD',
  NEW_PASSWORD = 'NEW_PASSWORD',
  CONFIRM_PASSWORD = 'CONFIRM_PASSWORD',
}

class SetGestureView extends React.Component<InternalProps, InternalState> {
  private new_password: string;
  private step: GestureStep;

  public refs = {
    passwordGesture: PasswordGesture,
  };

  public constructor(props: InternalProps) {
    super(props);
    this.new_password = '';

    this.state = {
      message: 'Please set your gesture',
      status: 'normal',
    };
  }

  public componentWillMount() {
    this.step = this.props.gesturePassword !== null ? GestureStep.CURRENT_PASSWORD : GestureStep.NEW_PASSWORD;
    if (this.step === GestureStep.CURRENT_PASSWORD) {
      this.setState({
        message: 'Please enter your current gesture',
        status: 'normal',
      });
    } else {
      this.setState({
        message: 'Please set your gesture',
        status: 'normal',
      });
    }
  }

  public onEnd(password) {
    if (this.step === GestureStep.CURRENT_PASSWORD) {
      // Check current password
      if (this.props.gesturePassword === password) {
        this.step = GestureStep.NEW_PASSWORD;
        this.setState({
          status: 'normal',
          message: 'Please set your gesture',
        });
      } else {
        this.setState({
          status: 'wrong',
          message: 'Current gesture is wrong, please try again',
        });
      }
      this.refs.passwordGesture.resetActive();

    } else if (this.step === GestureStep.NEW_PASSWORD) {
      // The first password
      this.step = GestureStep.CONFIRM_PASSWORD;
      this.new_password = password;
      this.refs.passwordGesture.resetActive();
      this.setState({
        status: 'normal',
        message: 'Please set your gesture again',
      });
    } else if (this.step === GestureStep.CONFIRM_PASSWORD) {
      // The second password
      if (password === this.new_password) {
        this.setState({
          status: 'right',
          message: 'Your gesture is set successfully',
        }, () => {
          // save the password to keychain
          this.props.setGesture(password);
          const { navigate } = this.props.navigation;
          navigate('Home');
        });
      } else {
        this.refs.passwordGesture.resetActive();
        this.setState({
          status: 'wrong',
          message: 'Gestures are not the same, please try again',
        });
      }
    }
  }

  public onStart() {
    this.setState({
      status: 'normal',
    });
  }

  public render() {
    return (
      <PasswordGesture
        style={{ marginTop: - 30 }}
        textStyle={{ marginTop: 50 }}
        ref="passwordGesture"
        status={this.state.status}
        message={this.state.message}
        onStart={() => this.onStart()}
        onEnd={(password) => this.onEnd(password)}
      />
    );
  }
}

const mapReduxStateToProps = (state: AppState) => {
  return {
    gesturePassword: state.security.gesture,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setGesture: (password) => dispatch(WalletActions.setGestureRedux(password)),
  };
};

export default connect(mapReduxStateToProps, mapDispatchToProps)(SetGestureView);
