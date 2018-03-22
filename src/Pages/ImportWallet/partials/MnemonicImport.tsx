'use strict';

import React from 'react';
import { Wallet } from '../../../Models';
import { View, TextInput, Text } from 'react-native';
import { Button } from 'react-native-elements';
import styles from './MnemonicImportStyle';
import Colors from '../../../Constants/Colors';

import bip39 from 'react-native-bip39';
import hdkey from 'ethereumjs-wallet-react-native/hdkey';
import { WalletService, EthereumService } from '../../../Services';

interface InternalProps {
  setWallet: (wallet: Wallet) => any;
}
interface InternalState {
  mnemonic: string;
  password: string;
  errorMessage: string;
  derivePath: string;
  walletPassword: string;
  walletPasswordConfirmation: string;
}
export default class MnemonicImport extends React.Component<InternalProps, InternalState> {
  public constructor(props) {
    super(props);
    this.state = {
      mnemonic: '',
      password: '',
      errorMessage: '',
      // Derive PATH should be the following:
      // https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#path-levels.
      // m/purpose'/coin_type'/account'/change/address_index.
      // m is a constant, should always be m.
      // purpose' should always be 44, according to BIP43 recommendation.
      // coin_type', should be 60 for Ethereum mainnet.
      // Should be different for the different testnets, but doesn't matter too much.
      // account', starts from 0. is used as child index in BIP32. So take care when importing multiple wallets.
      // change: 0 for external chain, 1 for internal.
      // Index: should start from 0, is used as child index in BIP32, so take care when importing multiple wallets.
      derivePath: `m/44'/60'/0'/0/0`,
      walletPassword: '',
      walletPasswordConfirmation: '',
    };
  }

  private validateInput() {
    if (!(bip39.validateMnemonic(this.state.mnemonic.trim()))) {
      this.setState({ errorMessage: 'Invalid seed phrase' });
      return false;
    } else if (this.state.walletPassword !== this.state.walletPasswordConfirmation) {
      this.setState({ errorMessage: 'Wallet passwords do not match' });
      return false;
    }
    return true;
  }

  private async recoverWallet() {
    // Guard
    if (!this.validateInput()) {
      return;
    }
    this.setState({ errorMessage: '' });
    let seed;
    let hdWallet;
    try {
      seed = bip39.mnemonicToSeed(this.state.mnemonic.trim(), this.state.password);
      hdWallet = hdkey.fromMasterSeed(seed).derivePath(this.state.derivePath).getWallet();
    } catch (error) {
      this.setState({ errorMessage: (error as Error).message });
      return;
    }
    try {
      await WalletService.getInstance()
        .HDKeyToV3Wallet(hdWallet, this.state.walletPassword);
      const wallet = await WalletService.getInstance().wallet;
      EthereumService.getInstance().sync(wallet);
      this.props.setWallet(wallet);
    } catch (e) {
      console.error(e);
    }
    return;
  }

  public render() {
    return (
      <View>
        <TextInput
          placeholder={`Insert your seed words, separated by spaces, here.`}
          placeholderTextColor={Colors.gray}
          multiline={true}
          style={styles.seedWordsInput}
          value={this.state.mnemonic}
          onChangeText={(mnemonic) => {
            this.setState({ mnemonic });
          }}
        />
        <TextInput
          placeholder={`Password (if applicable)`}
          style={styles.passwordInput}
          value={this.state.password}
          secureTextEntry={true}
          onChangeText={(password) => {
            this.setState({ password });
          }}
        />
        <TextInput
          placeholder={`Wallet password`}
          style={styles.passwordInput}
          value={this.state.walletPassword}
          secureTextEntry={true}
          onChangeText={(walletPassword) => {
            this.setState({ walletPassword });
          }}
        />
        <TextInput
          placeholder={`Wallet password confirmation`}
          style={styles.passwordInput}
          value={this.state.walletPasswordConfirmation}
          secureTextEntry={true}
          onChangeText={(walletPasswordConfirmation) => {
            this.setState({ walletPasswordConfirmation });
          }}
        />
        {!!this.state.errorMessage &&
          <Text style={styles.errorText}>{this.state.errorMessage}</Text>
        }
        <Button
          buttonStyle={styles.startImportButton}
          title="Start importing wallet"
          onPress={() => this.recoverWallet()}
        />
      </View>
    );
  }
}
