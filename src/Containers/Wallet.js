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
import { WalletService, EthereumService, SupportedTokens } from '../Services';

class WalletView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: "",
      address: "",
      tokens: [],
    };
  }

  componentWillMount() {
    const wallet = WalletService.getInstance().wallet;
    const eth = EthereumService.getInstance();

    this.setState({ name: wallet.name, address: wallet.address, tokens: SupportedTokens });

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
          this.state.tokens.map((l, i) => (
            <ListItem
              roundAvatar
              hideChevron={true}
              avatar={{uri: l.icon}}
              key={i}
              title={l.symbol}
              subtitle={l.name}
              // rightTitle={l.balance.toString()}
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
