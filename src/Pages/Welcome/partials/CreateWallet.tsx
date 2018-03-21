'use strict';

import React from 'react';
import {
  View,
  ScrollView,
} from 'react-native';
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button,
} from 'react-native-elements';
import { connect } from 'react-redux';
import { WalletService } from '../../../Services';
import { PasswordInput } from '../../_shared/inputs';
import { Wallet } from '../../../Models';
import WalletActions from '../../Wallet/WalletActions';

interface InternalState {
  name: string | null;
  nameErrorMessage: string | null;
  password1: string | null;
  passwordErrorMessage1: string | null;
  password2: string | null;
  passwordErrorMessage2: string | null;
}

interface ReduxProps {
  setWallet: (wallet: Wallet) => void;
}
class CreateWalletView extends React.Component<ReduxProps, InternalState> {

  private eth: WalletService;

  public static navigationOptions = {
    title: 'Create new wallet',
  };

  public constructor(props) {
    super(props);
    this.state = {
      name: null,
      nameErrorMessage: null,
      password1: null,
      passwordErrorMessage1: null,
      password2: null,
      passwordErrorMessage2: null,
    };
    this.eth = WalletService.getInstance();
  }

  private isValidate() {
    this.setState({ nameErrorMessage: null, passwordErrorMessage1: null, passwordErrorMessage2: null });

    if (this.state.name === null || this.state.name.length === 0) {
      this.setState({ nameErrorMessage: 'Name required' });
    } else if (this.state.password1 === null || this.state.password1.length === 0) {
      this.setState({ passwordErrorMessage1: 'Password required' });
    } else if (this.state.password2 === null || this.state.password2.length === 0) {
      this.setState({ passwordErrorMessage2: 'Please retype password' });
    } else if (this.state.password1 !== this.state.password2) {
      this.setState({ passwordErrorMessage2: 'Password is different' });
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(this.state.password1)) {
      this.setState({
        passwordErrorMessage1:
          'Password should at least have 6 characters, and it should contain one number, \
          one lowercase and one uppercase letter.',
      });
    } else {
      return true;
    }

    return false;
  }

  private async createWallet() {

    if (this.isValidate()) {
      const name = this.state.name;
      const password = this.state.password1;
      try {
        /*const json = */
        await this.eth.generateV3Wallet(name, password);
        const wallet = await WalletService.getInstance().wallet;
        this.props.setWallet(wallet);
      } catch (e) {
        console.error(e);
      }
    }
  }

  public render() {
    return (
      <ScrollView keyboardShouldPersistTaps={'handled'} >
        <FormLabel>Wallet Name </FormLabel>
        < FormInput
          placeholder="Give your wallet a name"
          onChangeText={(name) => this.setState({ name })}
        // value={this.state.name}
        />
        {
          this.state.nameErrorMessage &&
          <FormValidationMessage>
            {this.state.nameErrorMessage}
          </FormValidationMessage>
        }
        <FormLabel>Password </FormLabel>
        <PasswordInput onChangeText={(password1) => this.setState({ password1 })} />
        {
          this.state.passwordErrorMessage1 &&
          <FormValidationMessage>
            {this.state.passwordErrorMessage1}
          </FormValidationMessage>
        }
        <FormLabel>Retype Password </FormLabel>
        <PasswordInput
          onChangeText={(password2) => this.setState({ password2 })}
          placeholder="Retype your password"
        />
        {
          this.state.passwordErrorMessage2 &&
          <FormValidationMessage>
            {this.state.passwordErrorMessage2}
          </FormValidationMessage>
        }
        <View style={{ padding: 10 }}>
          <Button
            buttonStyle={{ backgroundColor: '#5589FF' }}
            title={'Create New Wallet'}
            onPress={() => this.createWallet()}
          />
        </View>
      </ScrollView>
    );
  }
}
const mapDispatchToProps = (dispatch: any) => {
  return {
    setWallet: (wallet: Wallet) => dispatch(WalletActions.updateWalletRedux(wallet)),
  };
};

export default connect(null, mapDispatchToProps)(CreateWalletView);
