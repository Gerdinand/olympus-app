'use strict';

import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import SecurityActions from './SecurityActions';
import { connect } from 'react-redux';
import { AppState } from '../../reducer';

interface InternalProps {
  navigation;
  enable: boolean;
  setFingerprint: (on: boolean) => any;
}

interface InternalState {
  on: boolean;
}

class SetFingerprintView extends React.Component<InternalProps, InternalState> {
  public constructor(props: InternalProps) {
    super(props);
    this.state = {
      on: props.enable,
    };
  }

  public render() {
    return (
      <View style={styles.container}>
        <ToggleSwitch
          isOn={this.state.on}
          onColor="green"
          offColor="gray"
          label="Enable fingerprint"
          labelStyle={{ color: 'black', fontWeight: '900' }}
          size="large"
          onToggle={(isOn) => this.props.setFingerprint(isOn)}
        />
      </View>);
  }
}

const mapReduxStateToProps = (state: AppState) => {
  return {
    enable: state.security.fingerprint,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFingerprint: (on: boolean) => dispatch(SecurityActions.enableFingerprintRedux(on)),
  };
};

export default connect(mapReduxStateToProps, mapDispatchToProps)(SetFingerprintView);

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
});
