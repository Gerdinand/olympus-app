'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import {
  List,
  ListItem
} from 'react-native-elements';

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
    amount: 2.34
  },
  {
    symbol: 'knc',
    name: 'Kyber Network',
    avatar: 'https://files.coinmarketcap.com/static/img/coins/32x32/kyber-network.png',
    amount: 3201
  },
  {
    symbol: 'snt',
    name: 'Status',
    avatar: 'https://files.coinmarketcap.com/static/img/coins/32x32/status.png',
    amount: 3431
  },
];

class Wallet extends Component {
  render() {
    return (
      <List style={{flex: 1}} containerStyle={{borderTopWidth: 0, borderBottomWidth: 0, borderBottomColor: 'transparent'}}>
        {
          list.map((l, i) => (
            <ListItem
              roundAvatar
              hideChevron={true}
              avatar={{uri: l.avatar}}
              key={i}
              title={l.symbol.toUpperCase()}
              subtitle={l.name}
              rightTitle={l.amount.toString()}
            />
          ))
        }
      </List>
      // <View style={styles.container}>
      //   <Text style={styles.description}>
      //     Welcome to Olympus Wallet!
      //   </Text>
      // </View>
    );
  }
}

module.exports = Wallet;
