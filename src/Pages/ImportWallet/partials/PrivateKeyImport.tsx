'use strict';

import React from 'react';
import { Wallet } from '../../../Models';
import { View, TextInput, Text } from 'react-native';
import Colors from '../../../Constants/Colors';
import PasswordInput from './PasswordInput';
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
  errorMessage: string;
}
export default class PrivateKeyImport extends React.Component<InternalProps, InternalState> {
  public constructor(props) {
    super(props);
    this.state = {
      privateKey: '',
      walletPassword: '',
      walletPasswordConfirmation: '',
      termsAgreed: false,
      errorMessage: '',
    };
  }

  private async recoverWallet() {
    await WalletService.getInstance()
      .recoverFromPrivateKey(this.state.privateKey, this.state.walletPassword);
    const wallet = await WalletService.getInstance().wallet;
    EthereumService.getInstance().sync(wallet);
    this.props.setWallet(wallet);
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
        <PasswordInput
          placeholder={`Create a transaction password`}
          onTextChange={(walletPassword) => this.setState({ walletPassword })}
        />
        <PasswordInput
          placeholder={`Repeat password`}
          onTextChange={(walletPasswordConfirmation) => this.setState({ walletPasswordConfirmation })}
        />
        <AgreeWithTerms
          toggleAgreed={() => this.setState({ termsAgreed: !this.state.termsAgreed })}
        />

        {!!this.state.errorMessage &&
          <Text style={styles.errorText}>{this.state.errorMessage}</Text>
        }
        <Button
          buttonStyle={[styles.startImportButton, !this.state.termsAgreed && { backgroundColor: Colors.lightgray }]}
          title="Start importing"
          onPress={() => this.recoverWallet()}
        />
      </View>
    );
  }
}
