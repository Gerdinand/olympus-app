'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  TabBarIOS,
  StyleSheet,
  Text,
  View,
  ScrollView,
  NavigatorIOS
} from 'react-native';
import { TabNavigator } from 'react-navigation';
var Welcome = require('./components/views/welcome');
import WalletTab from './components/tabs/wallet';
import MeTab from './components/tabs/me';

const Root = TabNavigator(
  {
    WalletTab: {
      screen: WalletTab,
      path: '/wallet',
      navigationOptions: {
        tabBarLabel: 'Wallet',
      }
    },
    MeTab: {
      screen: MeTab,
      path: '/me',
      navigationOptions: {
        tabBarLabel: 'Me',
      }
    },
  },
  {
    initialRouteName: 'WalletTab',
    animationEnabled: false,
    swipeEnabled: true,
    tabBarOptions: {
      activeTintColor: '#e91e63',
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
    if (0) {
      return (<Welcome/>);
    } else {
      return (<Root/>);
    }
  }
}

AppRegistry.registerComponent('Hora', () => Hora);
