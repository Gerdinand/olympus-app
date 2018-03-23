'use strict';

import React from 'react';
import { View, DeviceEventEmitter } from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import { PasswordInput } from '../../_shared/inputs';
import { WalletService, EthereumService } from '../../../Services';
import { Wallet } from '../../../Models';
interface InternalProps {
  setWallet: (wallet: Wallet) => any;
}
interface InternalState {
  name: string | null;
  password: string | null;
  json: string;
  importDisable: boolean;
  importButtonName: string;
}
export default class JSONImport extends React.Component<InternalProps, InternalState> {
  public constructor(props) {
    super(props);
    this.state = {
      name: null,
      password: null,
      json: null,
      importDisable: false,
      importButtonName: 'Import',
    };
  }

  private importWallet() {
    this.setState({
      importButtonName: 'Importing...',
      importDisable: true,
    });
    if (this.state.name != null &&
      this.state.name.length !== 0 &&
      this.state.password != null &&
      this.state.password.length !== 0 &&
      this.state.json != null &&
      this.state.json.length !== 0) {
      setTimeout(async () => {
        try {
          const done = await WalletService.getInstance()
            .importV3Wallet(this.state.name, JSON.parse(this.state.json), this.state.password);
          if (!done) {
            throw new Error();
          }
          // Order of the calls matter
          const wallet = await WalletService.getInstance().wallet;
          EthereumService.getInstance().sync(wallet);
          this.props.setWallet(wallet);

        } catch (e) {
          this.setState({ importButtonName: 'Import', importDisable: false });
          DeviceEventEmitter.emit('showToast', 'Failed to import, check your JSON and password.');
        }
      }, 100);
    } else {
      setTimeout(() => {
        this.setState({ importButtonName: 'Import', importDisable: false });
        DeviceEventEmitter.emit('showToast', 'Failed to import, check your JSON and password.');
      }, 1000);
    }

  }

  public render() {
    return (
      <View>
        <FormLabel>Name</FormLabel>
        <FormInput
          onChangeText={(name) => this.setState({ name })}
        />
        <FormLabel>Password</FormLabel>
        <PasswordInput onChangeText={(password) => this.setState({ password })} />
        <FormLabel>Paste wallet json</FormLabel>
        <FormInput
          multiline={true}
          inputStyle={{ width: '100%', height: 150 }}
          onChangeText={(json) => this.setState({ json })}
        />
        <View style={{ padding: 10 }}>
          <Button
            buttonStyle={{ backgroundColor: '#5589FF' }}
            title={this.state.importButtonName}
            disabled={this.state.importDisable}
            onPress={() => this.importWallet()}
          />
        </View>
      </View>
    );
  }
}
