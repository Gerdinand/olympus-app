'use strict';

import React from 'react';
import Colors from '../../../Constants/Colors';
import { TextInput, TouchableOpacity, View, Image, ViewStyle } from 'react-native';

import styles from './ImportPasswordInputStyle';

interface InternalProps {
  onTextChange: (password: string) => void;
  placeholder: string;
  style?: ViewStyle;
}
interface InternalState {
  passwordSecure: boolean;
  password: string;
}
export default class ImportPasswordInput extends React.Component<InternalProps, InternalState> {
  public constructor(props) {
    super(props);
    this.state = {
      password: '',
      passwordSecure: true,
    };
  }

  private switchPasswordSecure() {
    // Hackfix for ios, because of the issues with the secure entry and whitespaces
    this.setState({
      passwordSecure: !this.state.passwordSecure,
      password: this.state.password + ' ',
    }, () => this.setState({
      password: this.state.password.substring(0, this.state.password.length - 1),
    }));
  }

  public render() {
    return (
      <View style={[styles.passwordInputContainer, this.props.style ? this.props.style : {}]}>
        <Image
          source={require('../../../../images/lock_icon.jpg')}
          style={[styles.image, styles.lockSize]}
        />
        <TextInput
          placeholder={this.props.placeholder}
          placeholderTextColor={Colors.inactiveText}
          autoCapitalize={'none'}
          style={styles.passwordInput}
          value={this.state.password}
          secureTextEntry={this.state.passwordSecure}
          onChangeText={(password) => {
            this.setState({ password });
            this.props.onTextChange(password);
          }}
        />
        <TouchableOpacity
          onPress={() => this.switchPasswordSecure()}
        >
          <Image
            source={
              this.state.passwordSecure ? require('../../../../images/eye_icon.jpg')
                : require('../../../../images/eye_closed_icon.jpg')}
            style={[styles.image, styles.eyeSize]}
          />
        </TouchableOpacity>
      </View>);
  }
}
