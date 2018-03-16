'use strict';

import React from 'react';
import {
  AppRegistry,
  View,
  Image,
  AsyncStorage,
  DeviceEventEmitter,
  EmitterSubscription,
} from 'react-native';
import { Provider } from 'react-redux';

import { TabNavigator } from 'react-navigation';
import { EventRegister } from 'react-native-event-listeners';

import { WalletTab, MarketTab, MeTab } from './Navigators';
import Welcome from './Pages/Welcome/Welcome';
import { WalletService } from './Services';
import Toast, { DURATION } from 'react-native-easy-toast';
import { Store } from './Store';
import ConfirmationWallet from './Pages/Welcome/partials/ConfirmationWallet';

const Root = TabNavigator(
  {
    WalletTab: {
      screen: WalletTab,
      path: '/wallet',
      navigationOptions: {
        tabBarLabel: 'Wallet',
        tabBarIcon: ({ tintColor }) => (
          <Image source={require('../images/wallet.png')} style={{ tintColor }} />
        ),
      },
    },
    MarketTab: {
      screen: MarketTab,
      path: '/market',
      navigationOptions: {
        tabBarLabel: 'Market',
        tabBarIcon: ({ tintColor }) => (
          <Image source={require('../images/market.png')} style={{ tintColor }} />
        ),
      },
    },
    MeTab: {
      screen: MeTab,
      path: '/me',
      navigationOptions: {
        tabBarLabel: 'Me',
        tabBarIcon: ({ tintColor }) => (
          <Image source={require('../images/me.png')} style={{ tintColor }} />
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
  },
);

interface InternalState {
  loading: boolean;
  hasWallet: boolean;
}

export default class Olympus extends React.Component<null, InternalState> {

  private listener;
  private toastListener: EmitterSubscription;
  public refs: {
    toast: Toast;
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      hasWallet: false,
    };
  }

  public componentWillMount() {
    this.loadingWallet();
    this.listener = EventRegister.addEventListener('hasWallet', (data) => {
      console.log('[event] hasWallet');
      this.setState({
        hasWallet: data,
      });
    });
  }

  public componentDidMount() {
    this.toastListener = DeviceEventEmitter.addListener('showToast', (text) => {
      this.refs.toast.show(text, DURATION.LENGTH_LONG);
    });
  }

  public componentWillUnmount() {
    EventRegister.removeEventListener(this.listener);
    if (this.toastListener) {
      this.toastListener.remove();
    }
  }

  public async loadingWallet() {
    const isUsed = await AsyncStorage.getItem('used');
    if (isUsed) {
      const wallet = await WalletService.getInstance().getActiveWallet();
      this.setState({ loading: false, hasWallet: wallet != null });
    } else {
      this.setState({ loading: false, hasWallet: null });
    }
  }

  public render() {
    return (
      <Provider store={Store}>
        <View style={{ flex: 1, zIndex: 100 }}>
          {this.state.loading && <View />}
          {!this.state.loading && this.state.hasWallet && <Root />}
          {!this.state.loading && !this.state.hasWallet && <Welcome />}
          <Toast ref="toast" />
        </View>
      </Provider>
    );
  }
}

AppRegistry.registerComponent('Olympus', () => Olympus);
