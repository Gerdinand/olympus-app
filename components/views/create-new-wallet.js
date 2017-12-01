'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button
} from 'react-native';

class NewWallet extends Component {
  static navigationOptions = {
    title: 'Create new wallet',
  };
  render() {
    return (
      <View>
        <Text>
          Create New Wallet!
        </Text>
      </View>
    );
  }
}

module.exports = NewWallet;
