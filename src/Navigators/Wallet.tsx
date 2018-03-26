'use strict';

import React from 'react';
import { StyleSheet } from 'react-native';

import { StackNavigator } from 'react-navigation';
import WalletView from '../Pages/Wallet/Wallet';
import WalletDetail from '../Pages/WalletDetail/WalletDetail';
import Icon from 'react-native-vector-icons/Ionicons';
import AddToken from '../Pages/AddToken/AddToken';
import Colors from '../Constants/Colors';

const WalletScreen = ({ navigation }) => (
  <WalletView navigation={navigation} />
);

const WalletDetailScreen = ({ navigation }) => (
  <WalletDetail navigation={navigation} />
);
const AddTokenScreen = ({ navigation }) => (
  <AddToken navigation={navigation} />
);
const WalletTab = StackNavigator({

  WalletHome: {
    screen: WalletScreen,
    path: '/',
    navigationOptions: ({ navigation }) => ({
      title: 'Wallet',
      headerRight: (
        <Icon
          name="ios-add-circle-outline"
          style={style.addTokenIcon}
          color="#5589FF"
          size={32}
          onPress={() => navigation.navigate('AddToken')}
        />),
    }),
  },
  WalletDetail: {
    screen: WalletDetailScreen,
    path: 'wallet_detail',
    navigationOptions: () => ({
      title: 'Asset',
      tabBarVisible: false,
    }),
  },
  AddToken: {
    screen: AddTokenScreen,
    path: 'wallet_detail',
    navigationOptions: () => ({
      title: 'Add Token',
      tabBarVisible: false,

    }),
  },
}, {
    navigationOptions: {
      headerStyle: { backgroundColor: 'white' },
      headerTintColor: Colors.navigationHeaderBack,
      headerTitleStyle: { color: Colors.navigationHeaderTitle },
    },
  });

export default WalletTab;

const style = StyleSheet.create({
  addTokenIcon: {
    marginRight: 24,
  },
});
