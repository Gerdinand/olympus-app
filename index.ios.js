'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  Image,
  AsyncStorage,
  DeviceEventEmitter,
} from 'react-native';

import { TabNavigator } from 'react-navigation';
import { EventRegister } from 'react-native-event-listeners';

import { WalletTab, MarketTab, MeTab } from './src/Tabs';
import { Welcome } from './src/Containers';
import { WalletService } from './src/Services';
import Toast, { DURATION } from 'react-native-easy-toast';

const Root = TabNavigator(
  {
    WalletTab: {
      screen: WalletTab,
      path: '/wallet',
      navigationOptions: {
        tabBarLabel: 'Wallet',
        tabBarIcon: ({ tintColor }) => (
          <Image source={require('./images/wallet.png')} style={{ tintColor }} />
        ),
      },
    },
    MarketTab: {
      screen: MarketTab,
      path: '/market',
      navigationOptions: {
        tabBarLabel: 'Market',
        tabBarIcon: ({ tintColor }) => (
          <Image source={require('./images/market.png')} style={{ tintColor }} />
        ),
      },
    },
    MeTab: {
      screen: MeTab,
      path: '/me',
      navigationOptions: {
        tabBarLabel: 'Me',
        tabBarIcon: ({ tintColor }) => (
          <Image source={require('./images/me.png')} style={{ tintColor }} />
        ),
      },
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

export default class Olympus extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      hasWallet: false,
    };
  }

  componentWillMount() {
    this.loadingWallet();
    this.listener = EventRegister.addEventListener('hasWallet', (data) => {
      console.log('[event] hasWallet');
      this.setState({
        hasWallet: data,
      });
    });
  }

  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener('showToast', (text) => {
      this.refs.toast.show(text, DURATION.LENGTH_LONG);
    });
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener);
    if (this.listener) {
      this.listener.remove();
    }
  }

  async loadingWallet() {
    const isUsed = await AsyncStorage.getItem('used');
    if (isUsed) {
      const wallet = await WalletService.getInstance().getActiveWallet();
      this.setState({ loading: false, hasWallet: wallet != null });
    } else {
      this.setState({ loading: false, hasWallet: null });
    }
  }

  render() {
    if (this.state.loading) {
      return <View />;
    }

    if (!this.state.hasWallet) {
      return (<Welcome />);
    } else {
      return (
        <View style={{ flex: 1, zIndex: 100 }}>
          <Toast ref="toast" />
          <Root />
        </View>
      );
    }
  }
}

AppRegistry.registerComponent('Olympus', () => Olympus);
