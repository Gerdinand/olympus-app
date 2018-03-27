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

import { TabNavigator, StackNavigator } from 'react-navigation';

import { WalletTab, MarketTab, MeTab } from './Navigators';
import Welcome from './Pages/Welcome/Welcome';
import Toast, { DURATION } from 'react-native-easy-toast';
import Login from './Pages/Security/Login';
import WalletSuccess from './Pages/WalletSuccess/WalletSuccess';
import { store, persistor, AppState as ReducerState } from './reducer';
import { PersistGate } from 'redux-persist/integration/react';
import { connect } from 'react-redux';
import { Wallet } from './Models';
import { WalletService, MasterDataService } from './Services';
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
  gesturePassword: string;
  fingerprintPassword: boolean;
}
interface InternalState {
  loading: boolean;
  hasGestureProtect: boolean;
  hasFingerPrintProtect: boolean;
  userLoged: boolean;
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
      userLoged: false,
      hasWallet: false,
      hasGestureProtect: false,
      hasFingerPrintProtect: false,
      appState: AppState.currentState,
    };
    this._handleAppStateChange = this._handleAppStateChange.bind(this);
    this.loginSucceed = this.loginSucceed.bind(this);
    // Restore the wallet which came from redux , whatever is null or not.
    WalletService.getInstance().setWallet(props.wallet);
  }

  public componentWillMount() {
    this.loadingSecurityProtects();
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  public async componentDidMount() {
    this.toastListener = DeviceEventEmitter.addListener('showToast', (text) => {
      this.refs.toast.show(text, DURATION.LENGTH_LONG);
    });

    await MasterDataService.get().updateMasterData();
  }

  public componentWillUnmount() {
    if (this.toastListener) {
      this.toastListener.remove();
    }
  }
  private _handleAppStateChange(nextAppState) {
    if (this.state.appState.match(/background/)
      && nextAppState === 'active') {
      // console.log('App has come to the foreground!');

      this.loadingSecurityProtects();
    }

    this.setState({ appState: nextAppState });
  }

  private loadingSecurityProtects() {
    // load passwords setting
    const gesturePassword = this.props.gesturePassword;
    const fingerprintPassword = this.props.fingerprintPassword;
    this.setState({
      hasGestureProtect: gesturePassword != null,
      hasFingerPrintProtect: fingerprintPassword,
      userLoged: gesturePassword === null && !fingerprintPassword,
    });
  }

  private loginSucceed() {
    this.setState({ userLoged: true });
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

        {hasWallet && !this.state.userLoged &&
          <Login loginSucceed={() => this.loginSucceed()} />}

        {hasWallet && this.state.userLoged &&
          <RootNavigation />}

        <Toast ref="toast" />
      </View>
    );
  }
}
const mapReduxStateToProps = (state: ReducerState) => {
  return {
    wallet: state.wallet.wallet,
    gesturePassword: state.security.gesture,
    fingerprintPassword: state.security.fingerprint,
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
