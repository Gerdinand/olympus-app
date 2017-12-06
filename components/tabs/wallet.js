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
import WalletTabVew from '../views/wallet';

const WalletTab = StackNavigator({
  Home: {
    screen: ListsTabView,
    path: '/',
    navigationOptions: () => ({
      title: 'Lists',
    }),
  }
  },
});

export default WalletTab;
