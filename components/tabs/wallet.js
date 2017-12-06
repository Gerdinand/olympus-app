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

import WalletHome from '../views/wallet';

const WalletTabView = ({navigation}) => (
  <WalletHome banner="Wallet" navigation={navigation}/>
);

const WalletTab = StackNavigator({
  Home: {
    screen: WalletTabView,
    path: '/',
    navigationOptions: () => ({
      title: 'Wallet',
    }),
  }
});

export default WalletTab;
