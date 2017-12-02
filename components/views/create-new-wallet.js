'use strict';

import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button
} from 'react-native-elements';

class NewWallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      nameErrorMessage: null,
      password1: null,
      passwordErrorMessage1: null,
      password2: null,
      passwordErrorMessage2: null,
    };
  }
  static navigationOptions = {
    title: 'Create new wallet',
  };
  render() {
    return (
      <View>
        <FormLabel>Wallet Name</FormLabel>
        <FormInput placeholder="Please enter your new wallet name"/>
        {this.state.nameErrorMessage &&
          <FormValidationMessage>
            {this.state.nameErrorMessage}
          </FormValidationMessage>
        }
        <FormLabel>Password</FormLabel>
        <FormInput placeholder="Please enter password"/>
        {this.state.passwordErrorMessage1 &&
          <FormValidationMessage>
            {this.state.passwordErrorMessage1}
          </FormValidationMessage>
        }
        <FormLabel>Repeat Password</FormLabel>
        <FormInput placeholder="Please re-enter password"/>
        {this.state.passwordErrorMessage2 &&
          <FormValidationMessage>
            {this.state.passwordErrorMessage2}
          </FormValidationMessage>
        }
        <View style={{
          padding: 10,
        }}>
          <Button
            raised
            title={"Create New Wallet"}
          />
        </View>
      </View>
    );
  }
}

module.exports = NewWallet;
