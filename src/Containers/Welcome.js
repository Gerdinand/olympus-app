'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import {
  Button,
} from 'react-native-elements';
import { StackNavigator } from 'react-navigation';

import CreateWalletView from './CreateWallet';
import ImportWalletView from './ImportWallet';
import PropTypes from 'prop-types';

// Style
let styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    marginBottom: 50,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 10,
    justifyContent: 'space-around',
    alignItems: 'stretch',
  },
  titleContainer: {
    flex: 2,
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

class WelcomeView extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  }

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
          <View style={styles.bottomLine} />
        </View>
        <Button
          buttonStyle={styles.button1}
          primary1={true}
          title={'Create new wallet'}
          onPress={() => navigate('CreateWallet')}
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

const WelcomeNav = StackNavigator({
  Home: { screen: WelcomeView },
  CreateWallet: { screen: CreateWalletView },
  ImportWallet: { screen: ImportWalletView },
}, { cardStyle: { backgroundColor: 'white' } });

export default WelcomeNav;
