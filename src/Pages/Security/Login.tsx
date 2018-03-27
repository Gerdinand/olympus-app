'use strict';

import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  BackHandler,
} from 'react-native';
import PasswordGesture from 'react-native-gesture-password';
import FingerprintScanner from 'react-native-fingerprint-scanner';

// import TouchID from 'react-native-touch-id';
import { connect } from 'react-redux';
import { AppState } from '../../reducer';

const Width = Dimensions.get('window').width;

enum LoginMethod {
  SKIP = 'skip',
  FINGER_PRINT = 'finger_print',
  GESTURE = 'gesture',
}

enum StatusType {
  NORMAL = 'normal',
  WRONG = 'wrong',
  RIGHT = 'right',
}

interface InternalProps {
  gesturePassword: string;
  fingerprintEnable: boolean;

  loginSucceed: () => any;
}

interface InternalState {
  success: boolean;
  status: string;
  fingerMessage: string;
  gestureMessage: string;
  loginMethod: LoginMethod;
}

class LoginView extends React.Component<InternalProps, InternalState> {
  public refs = {
    passwordGesture: PasswordGesture,
  };

  public constructor(props) {
    super(props);

    this.state = {
      success: false,
      fingerMessage: 'Scan your fingerprint on the device scanner',
      gestureMessage: 'Enter your gesture to confirm identity',
      status: StatusType.NORMAL,
      loginMethod: props.fingerprintEnable ? LoginMethod.FINGER_PRINT
        : props.gesturePassword ? LoginMethod.GESTURE : LoginMethod.SKIP,
    };

    this.handleAuthenticationAttempted = this.handleAuthenticationAttempted.bind(this);
    this.loginCancelled = this.loginCancelled.bind(this);
  }

  // check password
  public onEnd(password) {
    if (password === this.props.gesturePassword) {
      this.setState({
        status: StatusType.RIGHT,
        gestureMessage: 'Login successfully',
      });

      this.props.loginSucceed();
    } else {
      this.refs.passwordGesture.resetActive();
      this.setState({
        status: StatusType.WRONG,
        gestureMessage: 'Gesture is wrong, please try again',
      });
    }
  }

  public onStart() {
    this.setState({
      status: StatusType.NORMAL,
    });
  }

  public componentDidMount() {
    if (!this.state.success) {
      if (this.state.loginMethod === LoginMethod.FINGER_PRINT) {
        if (Platform.OS === 'ios') {
          this.loadFingerPrintScannerIos();
        } else if (Platform.OS === 'android') {
          this.loadFingerPrintScannerAndroid();
        }
      }
    }
  }

  private async loadFingerPrintScannerIos() {
    try {
      await FingerprintScanner.authenticate(
        { description: 'Scan your fingerprint on the device scanner to continue', fallbackEnabled: false },
      );

      await FingerprintScanner.release();
      this.setState({ success: true },
        () => this.props.loginSucceed());
    } catch (error) {
      if (error.Name === 'UserCancel') {
        this.loginCancelled();
        return;
      }

      this.setState({
        fingerMessage: 'Scan your fingerprint again',
      });
    }
  }

  private async loadFingerPrintScannerAndroid() {
    try {
      await FingerprintScanner.authenticate({ onAttempt: this.handleAuthenticationAttempted });
      await FingerprintScanner.release();
      this.setState({ success: true },
        () => this.props.loginSucceed());
    } catch (error) {
      if (error.Name === 'UserCancel') {
        this.loginCancelled();
        return;
      }
      this.setState({
        fingerMessage: 'Scan your fingerprint',
      });
    }
  }

  private handleAuthenticationAttempted() {
    this.setState({
      fingerMessage: 'Scan your fingerprint again',
    });
  }

  private loginCancelled() {
    BackHandler.exitApp();
  }

  private renderTouchIdView() {
    const isAndroid = Platform.OS === 'android';
    return (
      <View style={styles.container}>
        <View style={styles.fingermessagebox}>
          <Text style={styles.fingermessage}>
            {this.state.fingerMessage}
          </Text>
        </View>
        <View style={styles.fingerboard}>
          {
            isAndroid &&
            <Image
              source={require('../../../images/finger_print.png')}
            />
          }
        </View>

        {
          !!this.props.gesturePassword &&
          (<View style={styles.buttonboard}>
            <Text
              style={styles.button}
              onPress={() => this.setState({ loginMethod: LoginMethod.GESTURE })}
            >
              Enter gesture
            </Text>
          </View>)
        }
      </View>);
  }

  private renderGestureView() {
    return (
      <View style={styles.container}>
        <PasswordGesture
          textStyle={styles.gesturemessage}
          ref="passwordGesture"
          status={this.state.status}
          message={this.state.gestureMessage}
          onStart={() => this.onStart()}
          onEnd={(password) => this.onEnd(password)}
        />{
          this.props.fingerprintEnable &&
          (<View style={styles.buttonboard}>
            <Text
              style={styles.button}
              onPress={() => this.setState({ loginMethod: LoginMethod.FINGER_PRINT })}
            >
              Enter finger print
            </Text>
          </View>)
        }
      </View>);
  }
  public render() {
    if (this.state.loginMethod === LoginMethod.FINGER_PRINT) {
      return this.renderTouchIdView();
    } else if (this.state.loginMethod === LoginMethod.GESTURE) {
      return this.renderGestureView();
    } else {
      return null;
    }
  }
}

const mapReduxStateToProps = (state: AppState) => {
  return {
    gesturePassword: state.security.gesture,
    fingerprintEnable: state.security.fingerprint,
  };
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, ownProps, stateProps, dispatchProps);
}

export default connect(mapReduxStateToProps, null, mergeProps)(LoginView);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#292B38',
    flex: 1,
    flexDirection: 'column',
  },

  fingermessagebox: {
    flex: 0.2,
    width: Width,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  fingermessage: {
    alignContent: 'center',
    color: '#5FA8FC',
  },

  gesturemessage: {
    marginTop: 52,
    marginLeft: 12,
    marginRight: 12,
    alignContent: 'center',
  },

  fingerboard: {
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonboard: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  button: {
    color: '#FFFFFF',
  },
});
