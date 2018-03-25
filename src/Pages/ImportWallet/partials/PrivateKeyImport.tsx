'use strict';

import React from 'react';
import { Wallet } from '../../../Models';
import { View, TextInput, Text, DeviceEventEmitter } from 'react-native';
import Colors from '../../../Constants/Colors';
import ImportPasswordInput from './ImportPasswordInput';
import AgreeWithTerms from './AgreeWithTerms';
import { Button } from 'react-native-elements';
import styles from './PrivateKeyImportStyle';
import { EthereumService, WalletService } from '../../../Services';

interface InternalProps {
  setWallet: (wallet: Wallet) => any;
}
interface InternalState {
  privateKey: string;
  walletPassword: string;
  walletPasswordConfirmation: string;
  termsAgreed: boolean;
}
export default class PrivateKeyImport extends React.Component<InternalProps, InternalState> {
  public constructor(props) {
    super(props);
    this.state = {
      privateKey: '',
      walletPassword: '',
      walletPasswordConfirmation: '',
      termsAgreed: false,
    };
  }

  private async recoverWallet() {
    const wsInstance = WalletService.getInstance();
    const passwordValidation =
      wsInstance.validatePassword(this.state.walletPassword, this.state.walletPasswordConfirmation);
    if (passwordValidation !== true) {
      DeviceEventEmitter.emit('showToast', passwordValidation);
      return;
    }
    try {
      await wsInstance
        .recoverFromPrivateKey(this.state.privateKey, this.state.walletPassword);
      const wallet = await WalletService.getInstance().wallet;
      EthereumService.getInstance().sync(wallet);
      this.props.setWallet(wallet);
    } catch (e) {
      DeviceEventEmitter.emit('showToast', 'Invalid private key.');
    }

  }

  public render() {
    return (
      <View>
        <TextInput
          placeholder={`Please enter your private key`}
          placeholderTextColor={Colors.inactiveText}
          multiline={true}
          style={styles.privateKeyInput}
          value={this.state.privateKey}
          onChangeText={(privateKey) => {
            this.setState({ privateKey });
          }}
        />
        <ImportPasswordInput
          placeholder={`Create a transaction password`}
          onTextChange={(walletPassword) => this.setState({ walletPassword })}
        />
        <ImportPasswordInput
          placeholder={`Repeat password`}
          onTextChange={(walletPasswordConfirmation) => this.setState({ walletPasswordConfirmation })}
        />
        <AgreeWithTerms
          toggleAgreed={() => this.setState({ termsAgreed: !this.state.termsAgreed })}
        />
        <Button
          buttonStyle={[styles.startImportButton, !this.state.termsAgreed && { backgroundColor: Colors.lightgray }]}
          title="Start importing"
          onPress={() => this.recoverWallet()}
        />
      </View>
    );
  }
}
