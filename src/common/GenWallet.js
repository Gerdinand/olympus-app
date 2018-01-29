import '../../shim.js';

import React, { Component } from 'react';
import { Button, Text, TextInput, StyleSheet, View } from 'react-native';

import bip39 from 'react-native-bip39';
import hdkey from 'ethereumjs-wallet-react-native/hdkey';
import ethW from 'ethereumjs-wallet-react-native';

class GenWallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mnemonic: 'walnut adjust swallow labor menu return coffee between asset wool remember skin',
      privKey: '',
      addr: '',
      pass: '',
      hardPath: 'm/44\'/0\'/0/1',
    };
  }
  generateWallet() {
    let seed = bip39.mnemonicToSeed(this.state.mnemonic.trim(), this.state.pass);
    let wallet = hdkey.fromMasterSeed(seed).derivePath(this.state.hardPath);

    let priv = wallet._hdkey.privateKey.toString('hex');
    let addr = `0x${ethW.fromPrivateKey(wallet._hdkey.privateKey).getAddress().toString('hex')}`;
    this.setState({
      privKey: priv,
      addr,
    });
  }
  render() {
    return (
      <View style={styles.container}>

        <TextInput
          style={{ height: 40 }}
          multiline={true}
          placeholder="Past mnemonic here!"
          onChangeText={(mnemonic) => this.setState({ mnemonic })}
          value={this.state.mnemonic}
        />
        <TextInput
          style={{ height: 40 }}
          placeholder="Type passworld here!"
          onChangeText={(pass) => this.setState({ pass })}
          value={this.state.pass}
        />
        <TextInput
          style={{ height: 40 }}
          placeholder="Type hardPath here!"
          onChangeText={(hardPath) => this.setState({ hardPath })}
          value={this.state.hardPath}
        />
        <Text
          multiline={true}
          selectable={true}
        >
          privKey:{this.state.privKey}
        </Text>
        <Text selectable={true}>
          address:{this.state.addr}
        </Text>

        <Button
          onPress={this.generateWallet.bind(this)}
          title="Press Me Generate Wallet"
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    //   // flex: 1,
    //   // justifyContent: 'center',
  },
});
module.exports = GenWallet;
