'use strict';

import React, { Component } from 'react';
import {
  Alert,
  View,
  AsyncStorage,
} from 'react-native';
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button,
} from 'react-native-elements';

import { EventRegister } from 'react-native-event-listeners';
import { WalletService } from '../Services';

class CreateWalletView extends Component {
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
    this.eth = WalletService.getInstance();
  }

  static navigationOptions = {
    title: 'Create new wallet',
  };

  isValidate() {
    this.setState({nameErrorMessage: null, passwordErrorMessage1: null, passwordErrorMessage2: null});

    if (this.state.name == null || this.state.name.length == 0) {
      this.setState({nameErrorMessage: "Name required"});
    } else if (this.state.password1 == null || this.state.password1.length == 0) {
      this.setState({passwordErrorMessage1: "Password required"});
    } else if (this.state.password2 == null || this.state.password2.length == 0) {
      this.setState({passwordErrorMessage2: "Please retype password"});
    } else if (this.state.password1 != this.state.password2) {
      this.setState({passwordErrorMessage2: "Password is different"});
    } else {
      return true;
    }

    return false;
  }

  render() {
    return (
      <View>
        <FormLabel>Wallet Name</FormLabel>
        <FormInput
          placeholder="Give your wallet a name"
          onChangeText={(text) => this.state.name = text}
          // value={this.state.name}
        />
        {
          this.state.nameErrorMessage &&
          <FormValidationMessage>
            {this.state.nameErrorMessage}
          </FormValidationMessage>
        }
        <FormLabel>Passphrase</FormLabel>
        <FormInput
          placeholder="Type in your passphrase"
          onChangeText={(text) => this.state.password1 = text}
        />
        {
          this.state.passwordErrorMessage1 &&
          <FormValidationMessage>
            {this.state.passwordErrorMessage1}
          </FormValidationMessage>
        }
        <FormLabel>Retype Passphrase</FormLabel>
        <FormInput
          placeholder="Retype your passphrase"
          onChangeText={(text) => this.state.password2 = text}
        />
        {
          this.state.passwordErrorMessage2 &&
          <FormValidationMessage>
            {this.state.passwordErrorMessage2}
          </FormValidationMessage>
        }
        <View style={{
          padding: 10,
        }}>
          <Button buttonStyle={{backgroundColor: '#5589FF'}}
            raised
            title={"Create New Wallet"}
            onPress={async () => {
              if (this.isValidate()) {
                const name = this.state.name;
                const password = this.state.password1;
                try {
                  const json = await this.eth.generateV3Wallet(name, password, { persistence: true });
                  await AsyncStorage.setItem("used", "true");
                  await WalletService.getInstance().getActiveWallet();
                  EventRegister.emit("hasWallet", true);
                } catch (e) {
                  console.error(e);
                }
              }
            }}
          />
        </View>
      </View>
    );
  }
}

export default CreateWalletView;
