'use strict';

import React from 'react';
import { Wallet } from '../../../Models';
import { View, TextInput, Text } from 'react-native';
import { Button } from 'react-native-elements';
import styles from './MnemonicImportStyle';

import bip39 from 'react-native-bip39';
import hdkey from 'ethereumjs-wallet-react-native/hdkey';
import ethW from 'ethereumjs-wallet-react-native';

interface InternalProps {
  setWallet: (wallet: Wallet) => any;
}
interface InternalState {
  mnemonic: string;
  password: string;
  errorMessage: string;
}
export default class MnemonicImport extends React.Component<InternalProps, InternalState> {
  public constructor(props) {
    super(props);
    this.state = {
      mnemonic: '',
      password: '',
      errorMessage: '',
    };
  }

  private recoverWallet() {
    // Guard
    if (this.state.mnemonic.trim().split(/\s+/g).length !== 12) {
      this.setState({ errorMessage: 'Invalid seed phrase' });
      return;
    }
    console.log(this.state.mnemonic.trim(), this.state.password);
    const seed = bip39.mnemonicToSeed(this.state.mnemonic.trim(), this.state.password);
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
    const wallet = hdkey.fromMasterSeed(seed).derivePath(`m/44'/60'/0'/0/0`);

    // const privateKey = wallet._hdkey.privateKey.toString('hex');
    const address = `0x${ethW.fromPrivateKey(wallet._hdkey.privateKey).getAddress().toString('hex')}`;
    console.log('wallet', wallet);
    console.log('address', address);
    this.props.setWallet(wallet);
  }

  public render() {
    return (
      <View>
        <TextInput
          placeholder={`Insert your seed words, separated by comma's, here.`}
          placeholderTextColor={'#ccc'}
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
