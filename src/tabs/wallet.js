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

import WalletView from '../Views/Wallet';
import WalletDetailView from '../Views/WalletDetail';

const WalletHome = ({navigation}) => (
  <WalletView banner="Wallet" navigation={navigation}/>
);

const WalletDetail = ({navigation}) => (
  <WalletDetailView banner="Wallet Detail" navigation={navigation}/>
);

const WalletTab = StackNavigator({
  WalletHome: {
    screen: WalletHome,
    path: '/',
    navigationOptions: () => ({
      title: 'Wallet',
    }),
  },
  WalletDetail: {
    screen: WalletDetail,
    path: 'wallet_detail',
    navigationOptions: () => ({
      title: 'Asset',
    }),
  }
});

export default WalletTab;
