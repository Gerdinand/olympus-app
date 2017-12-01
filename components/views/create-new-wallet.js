'use strict';

import React, { Component } from 'react';
import {
  FlatList,
  View,
  Text,
} from 'react-native';
import {
  FormLabel,
  FormInput,
  Button
} from 'react-native-elements';

class NewWallet extends Component {
  static navigationOptions = {
    title: 'Create new wallet',
  };
  render() {
    return (
      <View>
        <FormLabel>Wallet Name</FormLabel>
        <FormInput/>
        <FormLabel>Password</FormLabel>
        <FormInput/>
        <FormLabel>Repeat Password</FormLabel>
        <FormInput/>
        <View style={{padding: 10}}>
          <Button
            raised
            title={"Create New Wallet"}
          />
        </View>
      </View>
    );
  }
}

module.exports = NewWallet;
