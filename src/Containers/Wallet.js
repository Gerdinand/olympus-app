'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
    AsyncStorage,
  Button
} from 'react-native';
import {
  List,
  ListItem
} from 'react-native-elements';

import { EventRegister } from 'react-native-event-listeners';
import { WalletHeader } from '../Components';
import { WalletService, EthereumNetService} from '../Services';
import Toast from '@remobile/react-native-toast';

class WalletView extends Component {

  constructor(props) {
    super(props);

    this.walletListener = null;

    this.state = {
      network: 'MAIN',
      wallet: null,
      mainWallet: null,
      refreshing: false,
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentWillMount() {
      AsyncStorage.getItem("network").then( async (net) => {
          switch (net) {
              case 'MAIN' :
                  this.setState({network: 'MAIN'});
                  break;

              case 'KOVAN' :
                  this.setState({network: 'KOVAN'});
                  break;
              default :
                  this.setState({network: 'MAIN'});
                  await AsyncStorage.setItem("network", 'MAIN');
          }
          this.setState({
              wallet: WalletService.getInstance(this.state.network).wallet,
          });
          this.fetchData();

      })
    var _ = this;
    this.networkListener = EventRegister.addEventListener("network.updated", async (net) =>  {
        _.setState({network: net});
        WalletService.getInstance(this.state.network).resetActiveWallet();
        await WalletService.getInstance(this.state.network).getActiveWallet();
        this.setState({
            wallet: WalletService.getInstance(this.state.network).wallet,
        });
        this.fetchData();
    });
    this.walletListener = EventRegister.addEventListener("wallet.updated", (wallet) =>  {
      if (wallet.txs.length != _.state.wallet.length) {
        Toast.showShortTop.bind(null, "New transaction confirmed.");
      }
      _.setState({ wallet: wallet, refreshing: false });
    });

    this.setState({
        wallet: WalletService.getInstance(this.state.network).wallet,
    });

    console.log(JSON.stringify(WalletService.getInstance(this.state.network).wallet));

    this.fetchData();
    EthereumNetService.getInstance(this.state.network).fireTimer();
  }

  componentWillUnmount() {
    EthereumNetService.getInstance(this.state.network).invalidateTimer();

    EventRegister.removeEventListener(this.networkListener);
    EventRegister.removeEventListener(this.walletListener);

  }



  fetchData() {
      EthereumNetService.getInstance(this.state.network).sync(WalletService.getInstance(this.state.network).wallet);
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.fetchData();
  }

  render() {
    const { navigation } = this.props;

    return (
      <ScrollView
        style={{backgroundColor: 'white'}}
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
          balance={this.state.wallet.ethPrice != 0 ? "$ " + this.state.wallet.balanceInUSD : "$ --"}
          network={this.state.network}
        />
        <List style={{height: 578}} containerStyle={{borderTopWidth: 0, borderBottomWidth: 0, borderBottomColor: 'transparent'}}>
        {
          this.state.wallet.tokens.map((t, i) => (
            <ListItem
              roundAvatar
              hideChevron={true}
              avatar={{uri: t.icon}}
              key={i}
              title={t.symbol}
              subtitle={t.name}
              rightTitle={(0 == i || t.price == 0) ? t.balance.toFixed(5).toString() : t.balance.toFixed(5).toString() + "\n1 ETH = " + t.price + " " + t.symbol}
              rightTitleNumberOfLines={2}
              rightTitleStyle={{fontWeight:'bold', color:'#4A4A4A', textAlign:'right'}}
              onPress={() => {
                console.log("navigate to : " + t.symbol);

                navigation.navigate('WalletDetail', {
                  token: t,
                })
              }}
            />
          ))
        }
        </List>
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  description: {
    fontSize: 20,
    textAlign: 'center',
    color: '#FFFFFF'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  }
});

export default WalletView;
