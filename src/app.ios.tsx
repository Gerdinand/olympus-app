'use strict';

import React from 'react';
import {
  AppRegistry,
  View,
  Image,
  AsyncStorage,
  DeviceEventEmitter,
  EmitterSubscription,
  AppState,
  AppStateStatus,
} from 'react-native';
import { Provider } from 'react-redux';

import { TabNavigator, StackNavigator } from 'react-navigation';
import { EventRegister } from 'react-native-event-listeners';
import FingerprintScanner from 'react-native-fingerprint-scanner';

import { WalletTab, MarketTab, MeTab } from './Navigators';
import Welcome from './Pages/Welcome/Welcome';
import { WalletService } from './Services';
import Toast, { DURATION } from 'react-native-easy-toast';
import LoginGesture from './Pages/Security/LoginGesture';
import { Store } from './Store';
import WalletSuccess from './Pages/WalletSuccess/WalletSuccess';

const TabRoot = TabNavigator(
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
    swipeEnabled: false,
    tabBarOptions: {
      activeTintColor: '#5589FF',
    },
  },
);

const Root = StackNavigator({
  tabs: {
    screen: TabRoot, navigationOptions: { header: null },
  },
  WalletSuccess: {
    screen: WalletSuccess,
    path: '/confirmation',
    navigationOptions: {
      headerLeft: null,
      title: 'Wallet Success',
    },
  },
});
interface InternalState {
  loading: boolean;
  isSecurityProtect: boolean;
  hasWallet: boolean;
  appState: AppStateStatus;
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
      isSecurityProtect: false,
      appState: AppState.currentState,
    };

    this._handleAppStateChange = this._handleAppStateChange.bind(this);
  }

  public componentWillMount() {
    this.loadingWallet();
    AppState.addEventListener('change', this._handleAppStateChange);
    this.listener = EventRegister.addEventListener('hasWallet', (data) => {
      console.log('[event] hasWallet');
      this.setState({
        hasWallet: data ? true : false,
      });
    });
  }

  public componentDidMount() {
    this.toastListener = DeviceEventEmitter.addListener('showToast', (text) => {
      this.refs.toast.show(text, DURATION.LENGTH_LONG);
    });

    FingerprintScanner
      .isSensorAvailable()
      .then(() => {
        FingerprintScanner
          .authenticate({ description: 'Scan your fingerprint on the device scanner to continue' })
          .then(() => {
            this.setState({ isSecurityProtect: false });
          })
          .catch((error) => {
            this.setState({ isSecurityProtect: true });
            console.log(error.message);
          });
      })
      .catch((error) => console.log(error.message));
  }

  public componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    EventRegister.removeEventListener(this.listener);
    if (this.toastListener) {
      this.toastListener.remove();
    }
  }
  private _handleAppStateChange(nextAppState) {
    let isSecurityProtect = false;
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');

      isSecurityProtect = true;
    }
    this.setState({ appState: nextAppState, isSecurityProtect });
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
          {!this.state.loading && this.state.isSecurityProtect && this.state.hasWallet
            && <LoginGesture loginSucceed={() => this.setState({ isSecurityProtect: false })} />}
          {!this.state.loading && !this.state.isSecurityProtect && this.state.hasWallet && <Root />}
          {!this.state.loading && !this.state.hasWallet && <Welcome />}
          <Toast ref="toast" />
        </View>
      </Provider>
    );
  }
}

AppRegistry.registerComponent('Olympus', () => Olympus);
