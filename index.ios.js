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
  AsyncStorage,
} from 'react-native';

import { TabNavigator } from 'react-navigation';
import { EventRegister } from 'react-native-event-listeners';

import Welcome from './src/Views/Welcome';
import WalletTab from './src/Tabs/Wallet';
import MeTab from './src/Tabs/Me';
import WalletService from './src/Services/Wallet';

const Root = TabNavigator(
  {
    WalletTab: {
      screen: WalletTab,
      path: "/wallet",
      navigationOptions: {
        tabBarLabel: "Wallet",
        tabBarIcon: ({ tintColor }) => (
          <Image source={require("./images/wallet.png")} style={{tintColor: tintColor}}/>
        )
      }
    },
    MeTab: {
      screen: MeTab,
      path: "/me",
      navigationOptions: {
        tabBarLabel: "Me",
        tabBarIcon: ({ tintColor }) => (
          <Image source={require("./images/me.png")} style={{tintColor: tintColor}}/>
        )
      }
    },
  },
  {
    initialRouteName: "WalletTab",
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
      loading: true,
      hasWallet: false,
    };
  }

  componentWillMount() {
    this.loadingWallet();
    this.listener = EventRegister.addEventListener("hasWallet", (data) => {
      console.log("[event] hasWallet");
      this.setState({
        hasWallet: data,
      })
    });
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener);
  }

  async loadingWallet() {
    const isUsed = await AsyncStorage.getItem("used");
    if (isUsed) {
      const wallet = await WalletService.getInstance().getActiveWallet();
      this.setState({ loading: false, hasWallet: wallet != null });
    } else {
      this.setState({ loading: false, hasWallet: null });
    }
  }

  render() {
    if (this.state.loading) {
      return <View />
    }

    if (!this.state.hasWallet) {
      return (<Welcome/>);
    } else {
      return (<Root/>);
    }
  }
}

AppRegistry.registerComponent("Hora", () => Hora);
