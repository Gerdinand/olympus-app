'use strict';

import React from 'react';
import {
  View,
  Text,
  DeviceEventEmitter,
  Clipboard,
  StyleSheet,
} from 'react-native';
import {
  FormLabel,
  FormInput,
  Button,
} from 'react-native-elements';
import { Hr } from '../Controls';

import EthereumWallet from '../Services/Wallet';

interface InternalProps {
  navigation: any; // Navigation Object?
}

interface InternalState {
  password: string;
  walletJson: string;
  unlockButtonDisable: boolean;
}
export default class BackupView extends React.PureComponent<InternalProps, InternalState> {

  constructor(props: InternalProps) {
    super(props);

    this.state = {
      password: null,
      walletJson: null,
      unlockButtonDisable: false,
    };
  }

  public render() {
    const _ = this;

    return (
      <View>
        {!this.state.walletJson && (<View>
          <FormLabel>Password</FormLabel>
          <FormInput
            secureTextEntry={true}
            placeholder="to unlock wallet"
            onChangeText={(password) => this.setState({ password })}
          />
          <View
            style={{
              padding: 10,
            }}
          >
            <Button
              buttonStyle={{ backgroundColor: '#5589FF' }}
              title={'Unlock'}
              disabled={this.state.unlockButtonDisable}
              onPress={async () => {
                if (_.state.password != null && _.state.password.length !== 0) {
                  this.setState({ unlockButtonDisable: true });
                  const v3json = await EthereumWallet.getInstance().getWalletJson(_.state.password);
                  // console.log(v3json);
                  this.setState({ unlockButtonDisable: false });
                  if (v3json) {
                    this.setState({ walletJson: v3json });
                    return;
                  }
                }

                this.setState({ unlockButtonDisable: false });
                DeviceEventEmitter.emit('showToast', 'Invalid password, please try agin.');
              }}
            />
          </View>
        </View>)}
        {this.state.walletJson && (<View>
          <View
            style={{
              margin: 16,
              padding: 12,
            }}
          >
            <Text style={styles.h1}> Notice</Text>
            <Text
              style={{
                marginTop: 12,
              }}
            >
              Please make sure you are alone without any camera around.

              Save the keystore to a safe place, offline is even better.
              Don't take screenshots or photos to save your keystore file.
              Don't send the keystore file through internet.

            </Text>
          </View>
          <Hr />
          <View
            style={{
              margin: 16,
              padding: 12,
              backgroundColor: '#eee',
            }}
          >
            <Text selectable>{this.state.walletJson}</Text>

            <Button
              buttonStyle={{ backgroundColor: '#5589FF', marginTop: 24 }}
              title="Copy keystore"
              onPress={() => {
                Clipboard.setString(this.state.walletJson);
                DeviceEventEmitter.emit('showToast', 'Keystore copied to clipboard.');
              }}
            />
          </View>
        </View>)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 16,
    color: 'darkblue',
    fontWeight: 'bold',
  },

});
