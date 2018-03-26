'use strict';

import React from 'react';
import {
  ScrollView,
} from 'react-native';
import { Text } from '../_shared/layout/Text';
import { connect } from 'react-redux';
import WalletActions from '../Wallet/WalletActions';
import { Wallet } from '../../Models';
import ImportWalletHeader, { ImportWalletTabs } from './partials/ImportWalletHeader';
import MnemonicImport from './partials/MnemonicImport';
import PrivateKeyImport from './partials/PrivateKeyImport';
import KeystoreWallet from './partials/KeystoreImport';
import styles from './ImportWalletStyle';
import { Margin } from '../_shared/layout';

interface InternalState {
  activeTab: ImportWalletTabs;
}

interface ReduxProps {
  setWallet: (wallet: Wallet) => void;
}
class ImportWalletView extends React.Component<ReduxProps, InternalState> {

  public static navigationOptions = {
    header: null,
  };

  public constructor(props) {
    super(props);

    this.state = {
      activeTab: ImportWalletTabs.MNEMONIC,
    };
  }

  public render() {
    return (
      <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.pagePadding}>
        <Margin marginTop={60} />
        <Text
          style={styles.pageHeader}
        >
          Import my wallet
        </Text>
        <Margin marginBottom={20} />

        <ImportWalletHeader
          onChangeTab={(activeTab: ImportWalletTabs) => {
            this.setState({ activeTab });
          }}
        />
        {this.state.activeTab === ImportWalletTabs.MNEMONIC ?
          <MnemonicImport setWallet={(wallet: Wallet) => this.props.setWallet(wallet)} /> :
          this.state.activeTab === ImportWalletTabs.PRIVATE_KEY ?
            <PrivateKeyImport setWallet={(wallet: Wallet) => this.props.setWallet(wallet)} /> :
            <KeystoreWallet setWallet={(wallet: Wallet) => this.props.setWallet(wallet)} />}
      </ScrollView>
    );
  }
}
const mapDispatchToProps = (dispatch: any) => {
  return {
    // If we import the wallet, we understand was backuped
    setWallet: (wallet: Wallet) => {
      dispatch(WalletActions.setWalletBackUpDone());
      dispatch(WalletActions.updateWalletRedux(wallet));
    },
  };
};

export default connect(null, mapDispatchToProps)(ImportWalletView);
