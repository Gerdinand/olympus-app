'use strict';

import React from 'react';
import {
  ScrollView,
  RefreshControl,
  DeviceEventEmitter,
} from 'react-native';
import {
  List,
  ListItem,
} from 'react-native-elements';

import { EventRegister } from 'react-native-event-listeners';
import { WalletHeader } from '../Components';
import { WalletService, EthereumService } from '../Services';

interface InternalProps {
  navigation: any;
}

interface InternalState {
  wallet: any; // TODO object?
  refreshing: boolean;
}
export default class WalletView extends React.Component<InternalProps, InternalState> {

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
    const _ = this;
    this.walletListener = EventRegister.addEventListener('wallet.updated', (wallet) => {
      if (_.state.wallet.length && wallet.txs.length != _.state.wallet.length) {
        DeviceEventEmitter.emit('showToast', 'New transaction confirmed.');
      }
      _.setState({ wallet, refreshing: false });
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
          balance={this.state.wallet.ethPrice != 0 ? `$ ${this.state.wallet.balanceInUSD}` : '$ --'}
        />
        <List style={{ height: 578 }} containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0, borderBottomColor: 'transparent' }}>
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
                rightTitle={(0 === i || t.price === 0) ? t.balance.toFixed(6).toString() : `${t.balance.toFixed(6).toString()}\n1 ETH = ${t.price} ${t.symbol}`}
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

