'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  TabBarIOS,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
} from 'react-native';
import { TabNavigator } from 'react-navigation';
var Welcome = require('./src/views/welcome');
import WalletTab from './src/tabs/wallet';
import MeTab from './src/tabs/me';

const Root = TabNavigator(
  {
    WalletTab: {
      screen: WalletTab,
      path: '/wallet',
      navigationOptions: {
        tabBarLabel: 'Wallet',
        tabBarIcon: ({ tintColor }) => (
          <Image source={require('./images/wallet.png')} style={{tintColor: tintColor}}/>
        )
      }
    },
    MeTab: {
      screen: MeTab,
      path: '/me',
      navigationOptions: {
        tabBarLabel: 'Me',
        tabBarIcon: ({ tintColor }) => (
          <Image source={require('./images/me.png')} style={{tintColor: tintColor}}/>
        )
      }
    },
  },
  {
    initialRouteName: 'WalletTab',
    animationEnabled: false,
    swipeEnabled: true,
    tabBarOptions: {
      activeTintColor: '#5589FF',
    },
  }
);

export default class Hora extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'wallet'
    };
  }

  render() {
    if (1) {
      return (<Welcome/>);
    } else {
      return (<Root/>);
    }
  }
}

AppRegistry.registerComponent('Hora', () => Hora);
