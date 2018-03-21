'use strict';

import React from 'react';
import {
  View,
  ScrollView,
  DeviceEventEmitter,
} from 'react-native';
import {
  FormLabel,
  FormInput,
  Button,
} from 'react-native-elements';
import { connect } from 'react-redux';
import { WalletService, EthereumService } from '../../../Services';
import { PasswordInput } from '../../_shared/inputs';
import { updateWalletRedux } from '../../Wallet/WalletActions';
import { Wallet } from '../../../Models';

interface InternalState {
  name: string | null;
  password: string | null;
  json: string;
  importDisable: boolean;
  importButtonName: string;
}

interface ReduxProps {
  setWallet: (wallet: Wallet) => void;
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

  public render() {
    const _ = this;

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
        <View
          style={{
            padding: 10,
          }}
        >
          <Button
            buttonStyle={{ backgroundColor: '#5589FF' }}
            title={this.state.importButtonName}
            disabled={this.state.importDisable}
            onPress={() => {
              _.setState({
                importButtonName: 'Importing...',
                importDisable: true,
              });
              if (_.state.name != null &&
                _.state.name.length !== 0 &&
                _.state.password != null &&
                _.state.password.length !== 0 &&
                _.state.json != null &&
                _.state.json.length !== 0) {
                setTimeout(async () => {
                  try {
                    const done = await WalletService.getInstance()
                      .importV3Wallet(_.state.name, JSON.parse(_.state.json), _.state.password);
                    if (!done) {
                      throw new Error();
                    }
                    // Order of the calls matter
                    const wallet = await WalletService.getInstance().wallet;
                    EthereumService.getInstance().sync(wallet);
                    this.props.setWallet(wallet);

                  } catch (e) {
                    _.setState({ importButtonName: 'Import', importDisable: false });
                    DeviceEventEmitter.emit('showToast', 'Failed to import, check your JSON and password.');
                  }
                }, 100);
              } else {
                setTimeout(() => {
                  _.setState({ importButtonName: 'Import', importDisable: false });
                  DeviceEventEmitter.emit('showToast', 'Failed to import, check your JSON and password.');
                }, 1000);
              }
            }}
          />
        </View>
      </ScrollView>
    );
  }
}
const mapDispatchToProps = (dispatch: any) => {
  return {
    setWallet: (wallet: Wallet) => dispatch(updateWalletRedux(wallet)),
  };
};

export default connect(null, mapDispatchToProps)(ImportWalletView);
