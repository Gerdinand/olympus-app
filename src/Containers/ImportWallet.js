'use strict';

import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import {
  FormLabel,
  FormInput,
  Button,
} from 'react-native-elements';

import WalletService from '../Services/Wallet';
import { EventRegister } from 'react-native-event-listeners';

class ImportWalletView extends Component {

  static navigationOptions = {
    title: 'Import wallet',
  };

  constructor(props) {
    super(props);

    this.state = {
      name: null,
      password: null,
      json: null,
    };
  }

  render() {
    let _ = this;

    return (
      <View>
        <FormLabel>Name</FormLabel>
        <FormInput
          onChangeText={(text) => this.state.name = text}
        />
        <FormLabel>Password</FormLabel>
        <FormInput
          secureTextEntry={true}
          onChangeText={(text) => this.state.password = text}
        />
        <FormLabel>Paste wallet json</FormLabel>
        <FormInput
          multiline
          inputStyle={{ width: '100%' }}
          onChangeText={(text) => this.state.json = text}
        />
        <View style={{
          padding: 10,
        }}
        >
          <Button buttonStyle={{ backgroundColor: '#5589FF' }}
            raised
            title={'Import'}
            onPress={async () => {
              if (_.state.name != null &&
                _.state.name.length != 0 &&
                _.state.password != null &&
                _.state.password.length != 0 &&
                _.state.json != null &&
                _.state.json.length != 0) {

                const done = await WalletService.getInstance().importV3Wallet(_.state.name, JSON.parse(_.state.json), _.state.password);
                if (done) {
                  await WalletService.getInstance().getActiveWallet();
                  EventRegister.emit('hasWallet', true);
                }
              }
            }}
          />
        </View>
      </View>
    );
  }
}

export default ImportWalletView;
