'use strict';

import React from 'react';
import {
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { updateWalletRedux } from '../Wallet/WalletActions';
import { Wallet } from '../../Models';
import ImportWalletHeader, { ACTIVE_TABS } from './partials/ImportWalletHeader';
import MnemonicImport from './partials/MnemonicImport';
import PrivateKeyImport from './partials/PrivateKeyImport';
import JSONImport from './partials/JSONImport';

interface InternalState {
  activeTab: ACTIVE_TABS;
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
      activeTab: ACTIVE_TABS.MNEMONIC,
    };
  }

  public render() {
    return (
      <ScrollView keyboardShouldPersistTaps={'handled'} style={{ padding: 10 }}>
        <ImportWalletHeader
          onChangeTab={(activeTab: ACTIVE_TABS) => {
            this.setState({ activeTab });
          }}
        />
        {this.state.activeTab === ACTIVE_TABS.MNEMONIC ?
          <MnemonicImport setWallet={(wallet: Wallet) => this.props.setWallet(wallet)} /> :
          this.state.activeTab === ACTIVE_TABS.PRIVATE_KEY ?
            <PrivateKeyImport setWallet={(wallet: Wallet) => this.props.setWallet(wallet)} /> :
            <JSONImport setWallet={(wallet: Wallet) => this.props.setWallet(wallet)} />}
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
