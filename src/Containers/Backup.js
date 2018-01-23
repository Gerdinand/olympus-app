'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Linking
} from 'react-native';
import {
  FormLabel,
  FormInput,
  Button
} from 'react-native-elements';

import EthereumWallet from '../Services/Wallet';

class BackupView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      password: null,
      walletJson: null
    };
  }

  render() {
    var _ = this;

    return (
      <View>
        <FormLabel>Password</FormLabel>
        <FormInput
				 	secureTextEntry={true}
          placeholder="to unlock wallet"
          onChangeText={(text) => this.state.password = text}
        />
        <View style={{
          padding: 10,
        }}>
          <Button buttonStyle={{backgroundColor: '#5589FF'}}
            raised
            title={"Unlock"}
            onPress={async () => {
              if (_.state.password != null && _.state.password.length != 0) {
                const v3json = await EthereumWallet.getInstance().getWalletJson(_.state.password);
                console.log(v3json);
                if (v3json) {
                  this.setState({walletJson: v3json});
                }
              }
            }}
          />
        </View>
        {this.state.walletJson &&
          <View style={{
            padding: 10,
          }}>
            <Text
              selectable
            >{this.state.walletJson}</Text>
          </View>
        }
      </View>
    )
  };
}

export default BackupView;
