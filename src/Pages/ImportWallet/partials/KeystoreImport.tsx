'use strict';

import React from 'react';
import { View, DeviceEventEmitter, TextInput, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { WalletService, EthereumService } from '../../../Services';
import { Wallet } from '../../../Models';
import Colors from '../../../Constants/Colors';
import ImportPasswordInput from './ImportPasswordInput';
import AgreeWithTerms from './AgreeWithTerms';
import styles from './KeystoreImportStyle';
interface InternalProps {
  setWallet: (wallet: Wallet) => any;
}
interface InternalState {
  password: string;
  keystore: string;
  termsAgreed: boolean;
}
export default class JSONImport extends React.Component<InternalProps, InternalState> {
  public constructor(props) {
    super(props);
    this.state = {
      password: '',
      keystore: '',
      termsAgreed: false,
    };
  }

  private async importWallet() {
    if (
      this.state.password != null &&
      this.state.password.length !== 0 &&
      this.state.keystore != null &&
      this.state.keystore.length !== 0) {
      setTimeout(async () => {
        try {
          await WalletService.getInstance()
            .importV3Wallet(JSON.parse(this.state.keystore), this.state.password);
          // Order of the calls matter
          const wallet = await WalletService.getInstance().wallet;
          EthereumService.getInstance().sync(wallet);
          this.props.setWallet(wallet);

        } catch (e) {
          DeviceEventEmitter.emit('showToast', 'Failed to import, check your JSON and password.');
        }
      }, 100);
    } else {
      setTimeout(() => {
        DeviceEventEmitter.emit('showToast', 'Failed to import, check your JSON and password.');
      }, 1000);
    }

  }

  public render() {
    return (
      <View>
        <TextInput
          placeholder={`Please enter your keystore`}
          placeholderTextColor={Colors.inactiveText}
          multiline={true}
          style={styles.keystoreInput}
          value={this.state.keystore}
          onChangeText={(keystore) => {
            this.setState({ keystore });
          }}
        />
        <ImportPasswordInput
          placeholder={`Keystore password`}
          onTextChange={(password) => this.setState({ password })}
        />
        <Text style={styles.passwordDisclaimer}>This is also your transaction password</Text>
        <AgreeWithTerms
          toggleAgreed={() => this.setState({ termsAgreed: !this.state.termsAgreed })}
        />
        <Button
          buttonStyle={[styles.startImportButton, !this.state.termsAgreed && { backgroundColor: Colors.lightgray }]}
          title="Start importing"
          onPress={() => this.importWallet()}
        />
      </View>
    );
  }
}
