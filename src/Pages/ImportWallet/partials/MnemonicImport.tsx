'use strict';

import React from 'react';
import { Wallet } from '../../../Models';
import { View, TextInput, Text, TouchableOpacity, Image } from 'react-native';
import { Button } from 'react-native-elements';
import styles from './MnemonicImportStyle';
import Colors from '../../../Constants/Colors';

import bip39 from 'react-native-bip39';
import hdkey from 'ethereumjs-wallet-react-native/hdkey';
import { WalletService, EthereumService } from '../../../Services';
import ModalContainer from '../../_shared/layout/ModalContainer';

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
const derivePaths: Array<{ path: string, wallets: string }> = [
  {
    path: `m/44'/60'/0'/0/0`,
    wallets: 'Jaxx, Metamask, Exodus, imToken, TREZOR (ETH) & Digital Bitbox',
  },
  {
    path: `m/44'/60'/0'`,
    wallets: `Ledger (ETH)`,
  },
];
interface InternalProps {
  setWallet: (wallet: Wallet) => any;
}
interface InternalState {
  modalVisible: boolean;
  mnemonic: string;
  password: string;
  errorMessage: string;
  derivePaths: Array<{ path: string, wallets: string }>;
  walletPassword: string;
  walletPasswordSecure: boolean;
  walletPasswordConfirmation: string;
  walletPasswordConfirmationSecure: boolean;
}
export default class MnemonicImport extends React.Component<InternalProps, InternalState> {
  private testRef;
  public constructor(props) {
    super(props);
    this.state = {
      modalVisible: true,
      mnemonic: '',
      password: '',
      errorMessage: '',
      derivePaths,
      walletPassword: '',
      walletPasswordSecure: true,
      walletPasswordConfirmation: '',
      walletPasswordConfirmationSecure: true,
    };
  }
  private validateMnemonic() {
    if (!(bip39.validateMnemonic(this.state.mnemonic.trim()))) {
      this.setState({ errorMessage: 'Invalid seed phrase' });
      return false;
    }
    return true;

  }
  private validatePasswords() {
    if (this.state.walletPassword !== this.state.walletPasswordConfirmation) {
      this.setState({ errorMessage: 'Wallet passwords do not match' });
      return false;
    }
    return true;
  }

  private async recoverWallet() {
    // Guard
    if (!this.validateMnemonic()) {
      return;
    }
    this.setState({ errorMessage: '' });
    let seed;
    let hdWallet;
    try {
      seed = bip39.mnemonicToSeed(this.state.mnemonic.trim(), this.state.password);
      hdWallet = hdkey.fromMasterSeed(seed).derivePath(this.state.derivePaths[0].path).getWallet();
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

  private switchPasswordSecure() {
    this.setState({
      walletPasswordSecure: !this.state.walletPasswordSecure,
    }, () => this.testRef.blur());
  }

  public render() {
    return (
      <View>
        <ModalContainer visible={this.state.modalVisible} style={styles.modalStyle}>
          <View style={styles.modalInnerContainer}>
            <Text style={styles.modalTitle}>Create a password</Text>
            <View style={[styles.passwordInputContainer, styles.marginTop]}>
              <Image source={require('../../../../images/lock_icon.jpg')} style={[styles.image, styles.lockSize]} />
              <TextInput
                ref={(ref) => this.testRef = ref}
                placeholder={`Create a transaction password`}
                placeholderTextColor={Colors.inactiveText}
                style={styles.passwordInput}
                value={this.state.walletPassword}
                secureTextEntry={this.state.walletPasswordSecure}
                onChangeText={(walletPassword) => {
                  this.setState({ walletPassword });
                }}
              />
              <TouchableOpacity
                onPress={() => this.switchPasswordSecure()}
              >
                <Image
                  source={
                    this.state.walletPasswordSecure ? require('../../../../images/eye_icon.jpg')
                      : require('../../../../images/eye_closed_icon.jpg')}
                  style={[styles.image, styles.eyeSize]}
                />
              </TouchableOpacity>
            </View>
            {/* <View style={[styles.passwordInputContainer, styles.marginBottom]}>
              <Image source={require('../../../../images/lock_icon.jpg')} />
              <TextInput
                placeholder={`Repeat password`}
                placeholderTextColor={Colors.inactiveText}
                style={styles.passwordInput}
                value={this.state.walletPasswordConfirmation}
                secureTextEntry={true}
                onChangeText={(walletPasswordConfirmation) => {
                  this.setState({ walletPasswordConfirmation });
                }}
              />
              <Image source={require('../../../../images/eye_icon.jpg')} />
            </View> */}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                this.setState({ modalVisible: false });
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton}>
              <Text style={styles.confirmText}>OK</Text>
            </TouchableOpacity>
          </View>
        </ModalContainer>
        <TextInput
          placeholder={`Insert your seed words, separated by spaces, here.`}
          placeholderTextColor={Colors.inactiveText}
          multiline={true}
          style={styles.seedWordsInput}
          value={this.state.mnemonic}
          onChangeText={(mnemonic) => {
            this.setState({ mnemonic });
          }}
        />
        <TextInput
          placeholder={`Phrase Password (if applicable)`}
          placeholderTextColor={Colors.inactiveText}
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
