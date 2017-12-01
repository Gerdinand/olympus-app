'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button
} from 'react-native';
import { StackNavigator } from 'react-navigation';
var NewWallet = require('./create-new-wallet');

var styles = StyleSheet.create({
  description: {
    fontSize: 20,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

class Welcome extends Component {
  static navigationOptions = {
    title: 'Welcome',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          Welcome to Olympus Wallet!
        </Text>
        <Button
          title="Create new wallet"
          onPress={() => navigate('NewWallet')}
        />
        <Button
          title="Import exsit wallet"
          onPress={() => {}}
        />
      </View>
    );
  }
}

module.exports = StackNavigator({
  Home: { screen: Welcome },
  NewWallet: { screen: NewWallet },
});
