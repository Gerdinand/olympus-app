'use strict';

import React from 'react';
import {
  AppRegistry,
  View,
  Image,
  AsyncStorage,
  DeviceEventEmitter,
  StatusBar,
  EmitterSubscription,
  AppState,
  AppStateStatus,
} from 'react-native';
import { Provider } from 'react-redux';

import { TabNavigator, TabBarBottom } from 'react-navigation';
import { EventRegister } from 'react-native-event-listeners';
import FingerprintScanner from 'react-native-fingerprint-scanner';

import { WalletTab, MarketTab, MeTab } from './Navigators';
import Welcome from './Pages/Welcome/Welcome';
import { WalletService, FcmService } from './Services';
import Toast, { DURATION } from 'react-native-easy-toast';
import LoginGesture from './Pages/Security/LoginGesture';
import { FCM, FCMEvent } from './fcm';
import { Wallet } from './Models';
import { Store } from './Store';

const Root = TabNavigator(
  {
    WalletTab: {
      screen: WalletTab,
      path: '/wallet',
      navigationOptions: {
        tabBarLabel: 'Wallet',
        title: 'Wallet',
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
        title: 'Market',
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
    tabBarPosition: 'bottom',
    tabBarComponent: TabBarBottom,
    initialRouteName: 'WalletTab',
    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: {
      showIcon: true,
      activeTintColor: 'rgb(89,139,246)',
      inactiveTintColor: 'rgb(145,145,145)',
      indicatorStyle: {
        height: 0,
      },
      iconStyle: {
        marginTop: -2,
      },
      labelStyle: {
        marginTop: 4,
      },
      style: {
        backgroundColor: '#fff',
        height: 54,
      },
      // activeTintColor: '#5589FF',
    },
  },
);
let FcmNotificationListener;
interface InternalState {
  loading: boolean;
  isSecurityProtect: boolean;
  hasWallet: boolean;
  appState: AppStateStatus;

  token: string;
  wallet: Wallet;
}
export default class Olympus extends React.Component<null, InternalState> {

  private listener;
  private toastListener: EmitterSubscription;
  public refs: {
    toast: Toast;
  };
  public constructor(props) {
    super(props);

    this.state = {
      loading: true,
      hasWallet: false,
      isSecurityProtect: false,
      appState: AppState.currentState,
      token: null,
      wallet: null,
    };

    this._handleAppStateChange = this._handleAppStateChange.bind(this);

  }

  public componentWillMount() {
    this.loadingWallet();
    AppState.addEventListener('change', this._handleAppStateChange);
    this.listener = EventRegister.addEventListener('hasWallet', (data) => {
      console.log('[event] hasWallet');
      if (data) {
        this.setState({ wallet: data });
        FcmService.uploadFcmToken(this.state.token, data);
      }
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
          .authenticate({ onAttempt: () => this.setState({ isSecurityProtect: true }) })
          .then(() => {
            this.setState({ isSecurityProtect: false });
          })
          .catch((error) => {
            this.setState({ isSecurityProtect: true });
            console.log(error.message);
          });
      })
      .catch((error) => console.log(error.message));
    FCM.requestPermissions().then(
      () => console.log('granted')).catch(() => console.log('notification permission rejected'));

    FCM.getFCMToken().then((token) => {
      FcmService.uploadFcmToken(token, this.state.wallet);
      this.setState({
        token,
      });
    });

    FcmNotificationListener = FCM.on(FCMEvent.Notification, async (notification) => {
      console.log('notification' + JSON.stringify(notification));
      notification.finish();
    });

    /*
     initial notification contains the notification that launchs the app.
    If user launchs app by clicking banner, the banner notification info will be here rather than through FCM.on event
     sometimes Android kills activity when app goes to background,
      and when resume it broadcasts notification before JS is run.
      You can use FCM.getInitialNotification() to capture those missed events.
     initial notification will be triggered all the time even
     when open app by icon so send some action identifier when you send notification
    */
    FCM.getInitialNotification().then((notif) => {
      console.log(notif);
    });
  }

  public componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    EventRegister.removeEventListener(this.listener);
    if (this.toastListener) {
      this.toastListener.remove();
    }
    FingerprintScanner.release();
  }

  private _handleAppStateChange(nextAppState) {
    let isSecurityProtect = false;
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');

      isSecurityProtect = true;
    }
    this.setState({ appState: nextAppState, isSecurityProtect });
    FcmNotificationListener.remove();
  }

  private async loadingWallet() {
    const isUsed = await AsyncStorage.getItem('used');
    if (isUsed) {
      const wallet = await WalletService.getInstance().getActiveWallet();
      FcmService.uploadFcmToken(this.state.token, wallet);
      this.setState({ loading: false, wallet, hasWallet: wallet != null });
    } else {
      this.setState({ loading: false, hasWallet: null });
    }
  }

  public render() {
    return (
      <Provider store={Store}>
        <View style={{ flex: 1, zIndex: 100 }}>
          <StatusBar
            backgroundColor="white"
            barStyle="dark-content"
          />
          {this.state.loading && <View />}
          {!this.state.loading && this.state.isSecurityProtect && this.state.hasWallet
            && <LoginGesture loginSucceed={() => this.setState({ isSecurityProtect: false })} />}
          {!this.state.loading && !this.state.isSecurityProtect && this.state.hasWallet && <Root />}
          {!this.state.loading && !this.state.hasWallet && <Welcome />}
          < Toast ref="toast" />
        </View>
      </Provider>
    );
  }
}
AppRegistry.registerComponent('Olympus', () => Olympus);
