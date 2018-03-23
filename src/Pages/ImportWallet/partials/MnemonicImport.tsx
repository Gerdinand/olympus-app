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
  passwordSecure: boolean;
  errorMessage: string;
  derivePaths: Array<{ path: string, wallets: string }>;
  walletPassword: string;
  walletPasswordSecure: boolean;
  walletPasswordConfirmation: string;
  walletPasswordConfirmationSecure: boolean;
}
export default class MnemonicImport extends React.Component<InternalProps, InternalState> {
  private hdWallet: Wallet;
  public constructor(props) {
    super(props);
    this.state = {
      modalVisible: true,
      mnemonic: '',
      password: '',
      passwordSecure: true,
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

  private async recoverWallet() {
    // Guard
    if (!this.validateMnemonic()) {
      return;
    }
    this.setState({ errorMessage: '' });
    let seed;
    try {
      seed = bip39.mnemonicToSeed(this.state.mnemonic.trim(), this.state.password);
      this.hdWallet = hdkey.fromMasterSeed(seed).derivePath(this.state.derivePaths[0].path).getWallet();
      this.setState({
        modalVisible: true,
      });
    } catch (error) {
      this.setState({ errorMessage: (error as Error).message });
      return;
    }

    return;
  }

  private async confirmTransactionPassword() {
    if (this.state.walletPassword !== this.state.walletPasswordConfirmation) {
      this.setState({ errorMessage: 'Wallet passwords do not match' });
      return false;
    }
    try {
      await WalletService.getInstance()
        .HDKeyToV3Wallet(this.hdWallet, this.state.walletPassword);
      const wallet = await WalletService.getInstance().wallet;
      EthereumService.getInstance().sync(wallet);
      this.props.setWallet(wallet);

    } catch (e) {
      this.setState({ errorMessage: e && e.message ? e.message : 'Something went wrong' });
      return false;
    }
    return true;
  }

  private switchWalletPasswordSecure() {
    // Hackfix for ios, because of the issues with the secure entry and whitespaces
    this.setState({
      walletPasswordSecure: !this.state.walletPasswordSecure,
      walletPassword: this.state.walletPassword + ' ',
    }, () => this.setState({
      walletPassword: this.state.walletPassword.substring(0, this.state.walletPassword.length - 1),
    }));
  }

  private switchWalletPasswordConfirmationSecure() {
    // Hackfix for ios, because of the issues with the secure entry and whitespaces
    this.setState({
      walletPasswordConfirmationSecure: !this.state.walletPasswordConfirmationSecure,
      walletPasswordConfirmation: this.state.walletPasswordConfirmation + ' ',
    }, () => this.setState({
      walletPasswordConfirmation:
        this.state.walletPasswordConfirmation.substring(
          0, this.state.walletPasswordConfirmation.length - 1),
    }));
  }

  private switchPasswordSecure() {
    // Hackfix for ios, because of the issues with the secure entry and whitespaces
    this.setState({
      passwordSecure: !this.state.passwordSecure,
      password: this.state.password + ' ',
    }, () => this.setState({
      password: this.state.password.substring(0, this.state.password.length - 1),
    }));
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
                onPress={() => this.switchWalletPasswordSecure()}
              >
                <Image
                  source={
                    this.state.walletPasswordSecure ? require('../../../../images/eye_icon.jpg')
                      : require('../../../../images/eye_closed_icon.jpg')}
                  style={[styles.image, styles.eyeSize]}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.passwordInputContainer}>
              <Image source={require('../../../../images/lock_icon.jpg')} style={[styles.image, styles.lockSize]} />
              <TextInput
                placeholder={`Repeat password`}
                placeholderTextColor={Colors.inactiveText}
                style={styles.passwordInput}
                value={this.state.walletPasswordConfirmation}
                secureTextEntry={this.state.walletPasswordConfirmationSecure}
                onChangeText={(walletPasswordConfirmation) => {
                  this.setState({ walletPasswordConfirmation });
                }}
              />
              <TouchableOpacity
                onPress={() => this.switchWalletPasswordConfirmationSecure()}
              >
                <Image
                  source={
                    this.state.walletPasswordConfirmationSecure ? require('../../../../images/eye_icon.jpg')
                      : require('../../../../images/eye_closed_icon.jpg')}
                  style={[styles.image, styles.eyeSize]}
                />
              </TouchableOpacity>
            </View>
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
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => this.confirmTransactionPassword()}
            >
              <Text style={styles.confirmText}>OK</Text>
            </TouchableOpacity>
          </View>
        </ModalContainer>
        <TextInput
          placeholder={`Please enter your mnemonic phrase`}
          placeholderTextColor={Colors.inactiveText}
          multiline={true}
          style={styles.seedWordsInput}
          value={this.state.mnemonic}
          onChangeText={(mnemonic) => {
            this.setState({ mnemonic });
          }}
        />
        <View style={styles.passwordInputContainer}>
          <Image
            source={require('../../../../images/lock_icon.jpg')}
            style={[styles.image, styles.lockSize]}
          />
          <TextInput
            placeholder={`Please enter your password (optional)`}
            placeholderTextColor={Colors.inactiveText}
            style={[styles.passwordInput]}
            value={this.state.password}
            secureTextEntry={this.state.passwordSecure}
            onChangeText={(password) => {
              this.setState({ password });
            }}
          />
          <TouchableOpacity
            onPress={() => this.switchPasswordSecure()}
          >
            <Image
              source={
                this.state.passwordSecure ? require('../../../../images/eye_icon.jpg')
                  : require('../../../../images/eye_closed_icon.jpg')}
              style={[styles.image, styles.eyeSize]}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.termsAgreeText}>I have carefuly read and agree to the terms and conditions</Text>

        {!!this.state.errorMessage &&
          <Text style={styles.errorText}>{this.state.errorMessage}</Text>
        }
        <Button
          buttonStyle={styles.startImportButton}
          title="Start importing"
          onPress={() => this.recoverWallet()}
        />
      </View>
    );
  }
}
