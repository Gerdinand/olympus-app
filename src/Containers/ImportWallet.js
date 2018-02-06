'use strict';

import React, { Component } from 'react';
import {
  View,
  AsyncStorage,
  ScrollView,
  DeviceEventEmitter,
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
    const _ = this;

    return (
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <FormLabel>Name</FormLabel>
        <FormInput
          onChangeText={(name) => this.setState({ name })}
        />
        <FormLabel>Password</FormLabel>
        <FormInput
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password })}
        />
        <FormLabel>Paste wallet json</FormLabel>
        <FormInput
          multiline
          inputStyle={{ width: '100%' }}
          onChangeText={(json) => this.setState({ json })}
        />
        <View style={{
          padding: 10,
        }}
        >
          <Button buttonStyle={{ backgroundColor: '#5589FF' }}
            title={'Import'}
            onPress={async () => {
              if (_.state.name != null &&
                _.state.name.length != 0 &&
                _.state.password != null &&
                _.state.password.length != 0 &&
                _.state.json != null &&
                _.state.json.length != 0) {

                try {
                  const done = await WalletService.getInstance().importV3Wallet(_.state.name, JSON.parse(_.state.json), _.state.password);

                  if (!done) {
                    throw new Error();
                  }
                  // await AsyncStorage.setItem('used', 'true');
                  await WalletService.getInstance().getActiveWallet();
                  await AsyncStorage.setItem('used', 'true');
                  EventRegister.emit('hasWallet', true);
                } catch (e) {
                  DeviceEventEmitter.emit('showToast', 'Failed to import, check your JSON and password.');
                }
              }
            }}
          />
        </View>
      </ScrollView>
    );
  }
}

export default ImportWalletView;
