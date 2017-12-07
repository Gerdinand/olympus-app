'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import {
  Button
} from 'react-native-elements';
import { StackNavigator } from 'react-navigation';
import { EventRegister } from 'react-native-event-listeners';

import NewWalletWarningView from './new-wallet-warning';
var NewWallet = require('./create-new-wallet');
var ImportWallet = require('./import-exist-wallet');

// Style
var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:50,
    marginBottom:50,
    marginLeft:15,
    marginRight:15,
    borderRadius: 10,
    justifyContent: 'space-around',
    alignItems: 'stretch',
  },
  titleContainer: {
    flex: 2
  },
  title: {
    color: '#4A4A4A',
    fontSize: 30,
    textAlign: 'left',
  },
  bottomLine: {
    marginTop: 10,
    backgroundColor: '#5589FF',
    width: 50,
    height: 3,
  },
  button1: {
    paddingTop: 15,
    backgroundColor: '#5589FF',
  },
  button2: {
    marginTop: 15,
    backgroundColor: 'transparent',
  },
});

class Welcome extends Component {
  static navigationOptions = {
    title: 'Welcome',
    header: null,
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Welcome to Olympus
          </Text>
          <View style={styles.bottomLine}></View>
        </View>
        <Button
          buttonStyle={styles.button1}
          raised
          primary1={true}
          title={"Create new wallet"}
          onPress={() => {
            EventRegister.emit('hasWallet', true);
          }}
        />
        <Button buttonStyle={styles.button2}
          title="Import exist wallet"
          onPress={() => navigate('ImportWallet')}
          color={'#4A4A4A'}
        />
      </View>
    );
  }
}

module.exports = StackNavigator({
  Home: { screen: Welcome },
  NewWalletWarning: { screen: NewWalletWarningView },
  NewWallet: { screen: NewWallet },
  ImportWallet: { screen: ImportWallet },
}, {
  cardStyle: {backgroundColor: 'white'}
});