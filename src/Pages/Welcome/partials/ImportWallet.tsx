'use strict';

import React from 'react';
import {
  View,
  AsyncStorage,
  ScrollView,
  DeviceEventEmitter,
} from 'react-native';
import {
  FormLabel,
  FormInput,
  Button,
} from 'react-native-elements';
import { EventRegister } from 'react-native-event-listeners';

import { WalletService } from '../../../Services';
import { PasswordInput } from '../../_shared/inputs';
import WalletActions from '../../Wallet/WalletActions';
import { connect } from 'react-redux';

interface ReduxProps {
  walletRestored: () => void;
}
interface InternalState {
  name: string | null;
  password: string | null;
  json: string;
  importDisable: boolean;
  importButtonName: string;
}
class ImportWalletView extends React.Component<ReduxProps, InternalState> {

  public static navigationOptions = {
    title: 'Import wallet',
  };

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
          // await AsyncStorage.setItem('used', 'true');
          const wallet = await WalletService.getInstance().getActiveWallet();
          await AsyncStorage.setItem('used', 'true');
          EventRegister.emit('hasWallet', wallet);
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
      <ScrollView keyboardShouldPersistTaps={'handled'}>
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
      </ScrollView>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    // If we import the wallet, we understand was backuped
    walletRestored: () => dispatch(WalletActions.setWalletBackUpDone()),
  };
};

export default connect(null, mapDispatchToProps)(ImportWalletView);
