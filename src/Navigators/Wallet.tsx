'use strict';

import React from 'react';
import { StackNavigator } from 'react-navigation';
import WalletView from '../Pages/Wallet/Wallet';
import WalletDetail from '../Pages/WalletDetail/WalletDetail';
import Colors from '../Constants/Colors';

const WalletScreen = ({ navigation }) => (
  <WalletView navigation={navigation} />
);

const WalletDetailScreen = ({ navigation }) => (
  <WalletDetail navigation={navigation} />
);

const WalletTab = StackNavigator({

  WalletHome: {
    screen: WalletScreen,
    path: '/',
    navigationOptions: () => ({
      title: 'Wallet',
    }),
  },
  WalletDetail: {
    screen: WalletDetailScreen,
    path: 'wallet_detail',
    navigationOptions: () => ({
      title: 'Asset',
    }),
  },
}, {
    navigationOptions: {
      headerTintColor: Colors.navigationHeaderBack,
      headerTitleStyle: { color: Colors.navigationHeaderTitle },
    },
  });

export default WalletTab;
