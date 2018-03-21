'use strict';

import React from 'react';
import {
  ScrollView,
  RefreshControl,
  DeviceEventEmitter,
} from 'react-native';
import { connect } from 'react-redux';
import {
  List,
  ListItem,
} from 'react-native-elements';

import { EventRegister } from 'react-native-event-listeners';
import WalletHeader from './partials/WalletHeader';
import { WalletService, EthereumService } from '../../Services';
import { AppState } from '../../Store';

interface OwnProps {
  navigation: any;

}
interface ReduxProps {
  balanceVisibility: boolean;
  newWalletWarning: boolean;
  walletWarningDisplayed: () => void;
}

interface InternalState {
  wallet: any; // TODO object?
  refreshing: boolean;
}
class WalletView extends React.Component<ReduxProps & OwnProps, InternalState> {

  private walletListener;

  public constructor(props) {
    super(props);

    this.walletListener = null;

    this.state = {
      wallet: null,
      refreshing: false,
    };

    this.fetchData = this.fetchData.bind(this);
  }

  public componentWillMount() {

    this.walletListener = EventRegister.addEventListener('wallet.updated', (wallet) => {
      if (this.state.wallet.length && wallet.txs.length !== this.state.wallet.length) {
        DeviceEventEmitter.emit('showToast', 'New transaction confirmed.');
      }
      this.setState({ wallet, refreshing: false });
    });

    this.setState({ wallet: WalletService.getInstance().wallet });
    console.log(JSON.stringify(WalletService.getInstance().wallet));

    this.fetchData();
    EthereumService.getInstance().fireTimer();
  }

  public componentWillUnmount() {
    EthereumService.getInstance().invalidateTimer();
    EventRegister.removeEventListener(this.walletListener);
  }

  public componentDidMount() {
    if (!this.props.newWalletWarning) {
      this.props.navigation.navigate('WalletSuccess');
    }
  }
  private fetchData() {
    EthereumService.getInstance().sync(WalletService.getInstance().wallet);
  }

  private _onRefresh() {
    this.setState({ refreshing: true });
    this.fetchData();
  }

  public render() {
    const { navigation } = this.props;

    return (
      <ScrollView
        style={{ backgroundColor: 'white' }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
      >
        <WalletHeader
          name={this.state.wallet.name}
          address={this.state.wallet.address}
          balance={
            !this.props.balanceVisibility ?
              '$ ******' :
              this.state.wallet.ethPrice ? `$ ${this.state.wallet.balanceInUSD}` : '$ --'
          }
        />
        <List
          style={{ height: 578 }}
          containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0, borderBottomColor: 'transparent' }}
        >
          {
            this.state.wallet.tokens.map((t, i) => (
              <ListItem
                roundAvatar
                hideChevron={true}
                avatar={{ uri: t.icon }}
                avatarStyle={{ backgroundColor: 'white', borderColor: 'gray', borderWidth: 0.5, padding: 2 }}
                key={i}
                title={t.symbol}
                subtitle={t.name}
                rightTitle={(0 === i || t.price === 0) ?
                  (this.props.balanceVisibility ? t.balance.toFixed(6).toString() : '******') :
                  (
                    this.props.balanceVisibility ?
                      `${t.balance.toFixed(6).toString()}\n1 ETH = ${t.price} ${t.symbol}` :
                      `******\n1 ETH = ${t.price} ${t.symbol}`
                  )
                }
                rightTitleNumberOfLines={2}
                rightTitleStyle={{ fontWeight: 'bold', color: '#4A4A4A', textAlign: 'right' }}
                onPress={() => {
                  console.log(`navigate to : ${t.symbol}`);

                  navigation.navigate('WalletDetail', {
                    token: t,
                  });
                }}
              />
            ))
          }
        </List>
      </ScrollView>
    );
  }
}

const mapReduxStateToProps = (state: AppState) => {
  return {
    balanceVisibility: state.wallet.balanceVisibility,
    newWalletWarning: state.wallet.warningBackUpDone,
  };
};
const mergeProps = (reduxProps, dispatchProps, ownProps) => {
  return { ...reduxProps, ...dispatchProps, ...ownProps };
};

export default connect(mapReduxStateToProps, null, mergeProps)(WalletView);
