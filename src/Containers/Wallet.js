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

import { WalletHeader } from '../Components';
import { WalletService, EthereumService } from '../Services';

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

const list = [
  {
    symbol: 'eth',
    name: 'Ethereum',
    avatar: 'https://files.coinmarketcap.com/static/img/coins/32x32/ethereum.png',
    balance: 2.34
  },
  {
    symbol: 'knc',
    name: 'Kyber Network',
    avatar: 'https://files.coinmarketcap.com/static/img/coins/32x32/kyber-network.png',
    balance: 3201
  },
  {
    symbol: 'snt',
    name: 'Status',
    avatar: 'https://files.coinmarketcap.com/static/img/coins/32x32/status.png',
    balance: 3431
  },
];

class WalletView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: "",
      address: "",
    };
  }

  componentWillMount() {
    const wallet = WalletService.getInstance().wallet;
    const eth = EthereumService.getInstance();

    this.setState({ name: wallet.name, address: wallet.address });

    eth.watch(wallet.address);
  }

  componentWillUnmount() {

  }

  render() {
    const { navigation } = this.props;

    return (
      <ScrollView style={{backgroundColor: 'white'}}>
        <WalletHeader
          name={this.state.name}
          address={this.state.address}
          balance={"$ " + 0}
        />
        <List style={{height: 578}} containerStyle={{borderTopWidth: 0, borderBottomWidth: 0, borderBottomColor: 'transparent'}}>
        {
          list.map((l, i) => (
            <ListItem
              roundAvatar
              hideChevron={true}
              avatar={{uri: l.avatar}}
              key={i}
              title={l.symbol.toUpperCase()}
              subtitle={l.name}
              rightTitle={l.balance.toString()}
              rightTitleStyle={{fontWeight:'bold', color:'#4A4A4A'}}
              onPress={() => {
                console.log(l.symbol);
                navigation.navigate('WalletDetail', {
                  symbol: l.symbol,
                  address: WalletService.getInstance().wallet.address,
                  balance: l.balance,
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

export default WalletView;
