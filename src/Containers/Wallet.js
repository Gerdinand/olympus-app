'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView
} from 'react-native';
import {
  List,
  ListItem
} from 'react-native-elements';

import { EventRegister } from 'react-native-event-listeners';
import { WalletHeader } from '../Components';
import { WalletService, EthereumService, SupportedTokens } from '../Services';

class WalletView extends Component {

  constructor(props) {
    super(props);

    this.walletListener = null;

    this.state = {
      wallet: null,
    };
  }

  componentWillMount() {
    var _ = this;
    this.walletListener = EventRegister.addEventListener("wallet.updated", (wallet) =>  {
      console.log("event wallet.updated " + JSON.stringify(wallet));
      _.setState({ wallet: wallet });
    });

    const wallet = WalletService.getInstance().wallet;
    const eth = EthereumService.getInstance();

    this.setState({ wallet: wallet });

    eth.sync(wallet);
    // eth.watch(wallet);
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.walletListener);
  }

  render() {
    const { navigation } = this.props;

    return (
      <ScrollView style={{backgroundColor: 'white'}}>
        <WalletHeader
          name={this.state.wallet.name}
          address={this.state.wallet.address}
          balance={"$ --"}
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
              rightTitle={t.balance.toString()}
              rightTitleStyle={{fontWeight:'bold', color:'#4A4A4A'}}
              onPress={() => {
                console.log("navigate to : " + t.symbol);

                navigation.navigate('WalletDetail', {
                  address: WalletService.getInstance().wallet.address,
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
