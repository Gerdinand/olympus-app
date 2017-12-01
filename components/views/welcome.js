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
        <View style={{flex: 2}}>
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
          onPress={() => navigate('NewWallet')}
        />
        <Button buttonStyle={styles.button2}
          title="Import exist wallet"
          onPress={() => navigate('ImportWallet')}
        />
      </View>
    );
  }
}

module.exports = StackNavigator({
  Home: { screen: Welcome },
  NewWallet: { screen: NewWallet },
  ImportWallet: { screen: ImportWallet },
}, {
  cardStyle: {backgroundColor: 'white'}
});
