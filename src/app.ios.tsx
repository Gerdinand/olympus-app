'use strict';

import React from 'react';
import {
  AppRegistry,
  View,
  Image,
  DeviceEventEmitter,
  EmitterSubscription,
  AppState,
  AppStateStatus,
} from 'react-native';
import { Provider } from 'react-redux';

import { TabNavigator, StackNavigator } from 'react-navigation';
import FingerprintScanner from 'react-native-fingerprint-scanner';

import { WalletTab, MarketTab, MeTab } from './Navigators';
import Welcome from './Pages/Welcome/Welcome';
import Toast, { DURATION } from 'react-native-easy-toast';
import LoginGesture from './Pages/Security/LoginGesture';
import WalletSuccess from './Pages/WalletSuccess/WalletSuccess';

import { store, persistor, AppState as ReducerState } from './reducer';
import { PersistGate } from 'redux-persist/integration/react';
import { connect } from 'react-redux';
import { Wallet } from './Models';
import { WalletService } from './Services';
import Colors from './Constants/Colors';

const TabRoot = TabNavigator({
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

const RootNavigation = StackNavigator({
  tabs: {
    screen: TabRoot, navigationOptions: { header: null },
  },
  WalletSuccess: {
    screen: WalletSuccess,
    path: '/confirmation',
    navigationOptions: {
      headerLeft: null,
      title: 'Wallet Success',
      headerStyle: { backgroundColor: 'white' },
      headerTintColor: Colors.navigationHeaderBack,
      headerTitleStyle: { color: Colors.navigationHeaderTitle },
    },
  },
});
interface InternalProps {
  wallet: Wallet;
}
interface InternalState {
  loading: boolean;
  isSecurityProtect: boolean;
  hasWallet: boolean;
  appState: AppStateStatus;
}

class Root extends React.Component<InternalProps, InternalState> {

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

  public render() {
    const hasWallet = this.props.wallet !== null;
    return (
      <View style={{ flex: 1, zIndex: 100 }}>

        {!hasWallet && <Welcome />}

        {hasWallet && this.state.isSecurityProtect &&
          <LoginGesture loginSucceed={() => this.setState({ isSecurityProtect: false })} />}

        {hasWallet && !this.state.isSecurityProtect &&
          <RootNavigation />}

        <Toast ref="toast" />
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
