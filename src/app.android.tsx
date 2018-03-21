'use strict';

import React from 'react';
import {
  AppRegistry,
  View,
  Image,
  DeviceEventEmitter,
  StatusBar,
  EmitterSubscription,
  AppState,
  AppStateStatus,
} from 'react-native';
import { Provider } from 'react-redux';

import { TabNavigator, TabBarBottom } from 'react-navigation';
import FingerprintScanner from 'react-native-fingerprint-scanner';

import { WalletTab, MarketTab, MeTab } from './Navigators';
import Welcome from './Pages/Welcome/Welcome';
import { WalletService, FcmService } from './Services';
import Toast, { DURATION } from 'react-native-easy-toast';
import LoginGesture from './Pages/Security/LoginGesture';
import { FCM, FCMEvent } from './fcm';
import { Wallet } from './Models';
import { store, persistor, AppState as ReducerState } from './reducer';
import { PersistGate } from 'redux-persist/integration/react';
import { connect } from 'react-redux';

const RootNavigation = TabNavigator(
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
}
interface InternalProps {
  wallet: Wallet;
}
class Root extends React.Component<InternalProps, InternalState> {

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
    };

    this._handleAppStateChange = this._handleAppStateChange.bind(this);
    // Restore the wallet which came from redux , whatever is null or not.
    WalletService.getInstance().setWallet(props.wallet);
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
      FcmService.uploadFcmToken(token, this.props.wallet);
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

  public render() {
    const hasWallet = this.props.wallet !== null;

    return (
      <View style={{ flex: 1, zIndex: 100 }}>
        <StatusBar
          backgroundColor="white"
          barStyle="dark-content"
        />
        {!hasWallet && <Welcome />}

        {hasWallet && this.state.isSecurityProtect &&
          <LoginGesture loginSucceed={() => this.setState({ isSecurityProtect: false })} />}

        {hasWallet && !this.state.isSecurityProtect &&
          <RootNavigation />}

        < Toast ref="toast" />
      </View>

    );
  }
}
const mapReduxStateToProps = (state: ReducerState) => {
  return {
    wallet: state.wallet.wallet,
  };
};
const RootWithReducer = connect(mapReduxStateToProps, null)(Root);

/* tslint:disable:max-classes-per-file */
class Olympus extends React.PureComponent {
  public render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RootWithReducer />
        </PersistGate >
      </Provider >
    );
  }
}
/* tslint:enable:max-classes-per-file */

AppRegistry.registerComponent('Olympus', () => Olympus);
