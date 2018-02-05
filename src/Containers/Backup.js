'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  DeviceEventEmitter,
} from 'react-native';
import {
  FormLabel,
  FormInput,
  Button,
} from 'react-native-elements';

import EthereumWallet from '../Services/Wallet';

class BackupView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      password: null,
      walletJson: null,
      unlockButtonDisable:false,
    };
  }

  render() {
    let _ = this;

    return (
      <View>
        <FormLabel>Password</FormLabel>
        <FormInput
          secureTextEntry={true}
          placeholder="to unlock wallet"
          onChangeText={(password) => this.setState({ password })}
        />
        <View style={{
          padding: 10,
        }}
        >
          <Button buttonStyle={{ backgroundColor: '#5589FF' }}
            title={'Unlock'}
            disabled={this.state.unlockButtonDisable}
            onPress={async () => {
              if (_.state.password != null && _.state.password.length != 0) {
                this.setState({unlockButtonDisable:true});
                const v3json = await EthereumWallet.getInstance().getWalletJson(_.state.password);
                // console.log(v3json);
                this.setState({unlockButtonDisable:false});
                if (v3json) {
                  this.setState({ walletJson: v3json });
                }
                else{
                  DeviceEventEmitter.emit('showToast', 'Invalid password, please try agin.');
                }
              }
              else{
                this.setState({unlockButtonDisable:false});
                DeviceEventEmitter.emit('showToast', 'Invalid password, please try agin.');
              }
            }}
          />
        </View>
        {this.state.walletJson &&
          <View style={{
            padding: 10,
          }}
          >
            <Text
              selectable
            >{this.state.walletJson}</Text>
          </View>
        }
      </View>
    );
  }
}

export default BackupView;
