'use strict';

import React, { Component } from 'react';
import {
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  List,
  ListItem,
} from 'react-native-elements';

import { EventRegister } from 'react-native-event-listeners';
import { WalletHeader } from '../Components';
import { WalletService, EthereumService } from '../Services';
import Toast from 'react-native-simple-toast';
import PropTypes from 'prop-types';

class WalletView extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.walletListener = null;

    this.state = {
      wallet: null,
      refreshing: false,
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentWillMount() {
    let _ = this;
    this.walletListener = EventRegister.addEventListener('wallet.updated', (wallet) => {
      if (_.state.wallet.length && wallet.txs.length != _.state.wallet.length) {
        Toast.show('New transaction confirmed.');
      }
      _.setState({ wallet, refreshing: false });
    });

    this.setState({ wallet: WalletService.getInstance().wallet });
    console.log(JSON.stringify(WalletService.getInstance().wallet));

    this.fetchData();
    EthereumService.getInstance().fireTimer();
  }

  componentWillUnmount() {
    EthereumService.getInstance().invalidateTimer();
    EventRegister.removeEventListener(this.walletListener);
  }

  fetchData() {
    EthereumService.getInstance().sync(WalletService.getInstance().wallet);
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    this.fetchData();
  }

  render() {
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
                key={i}
                title={t.symbol}
                subtitle={t.name}
                rightTitle={(0 == i || t.price == 0) ? t.balance.toFixed(5).toString() : `${t.balance.toFixed(5).toString()}\n1 ETH = ${t.price} ${t.symbol}`}
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

export default WalletView;
