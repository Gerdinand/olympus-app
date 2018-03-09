import '../../shim.js';

import React from 'react';
import { Button, Text, TextInput, StyleSheet, View } from 'react-native';

import bip39 from 'react-native-bip39';
import hdkey from 'ethereumjs-wallet-react-native/hdkey';
import ethW from 'ethereumjs-wallet-react-native';

interface InternalState {
  mnemonic: string;
  privateKey: string;
  address: string;
  hardPath: string;
  password: string;
}

export default class GenWallet extends React.Component<null, InternalState> {

  constructor(props) {
    super(props);
    this.state = {
      mnemonic: 'walnut adjust swallow labor menu return coffee between asset wool remember skin',
      privateKey: '',
      address: '',
      password: '',
      hardPath: 'm/44\'/0\'/0/1',
    };
  }
  private generateWallet(): void {
    const seed = bip39.mnemonicToSeed(this.state.mnemonic.trim(), this.state.password);
    const wallet = hdkey.fromMasterSeed(seed).derivePath(this.state.hardPath);

    const privateKey = wallet._hdkey.privateKey.toString('hex');
    const address = `0x${ethW.fromPrivateKey(wallet._hdkey.privateKey).getAddress().toString('hex')}`;
    this.setState({
      privateKey,
      address,
    });
  }
  public render() {
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
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
        />
        <TextInput
          style={{ height: 40 }}
          placeholder="Type hardPath here!"
          onChangeText={(hardPath) => this.setState({ hardPath })}
          value={this.state.hardPath}
        />
        <Text

          selectable={true}
        >
          Private Key: {this.state.privateKey}
        </Text>
        <Text selectable={true}>
          Address: {this.state.address}
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
