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

import { StackNavigator } from 'react-navigation';

import { Wallet, WalletDetail } from '../Containers';

const WalletScreen = ({navigation}) => (
  <Wallet banner="Wallet" navigation={navigation}/>
);

const WalletDetailScreen = ({navigation}) => (
  <WalletDetail banner="Wallet Detail" navigation={navigation}/>
);

const WalletTab = StackNavigator({
  WalletHome: {
    screen: WalletScreen,
    path: '/',
    navigationOptions: () => ({
      title: 'Wallet',
    }),
  },
  WalletDetail: {
    screen: WalletDetailScreen,
    path: 'wallet_detail',
    navigationOptions: () => ({
      title: 'Asset',
    }),
  }
});

export default WalletTab;
