'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';

import {
  Icon,
  Button,
} from 'react-native-elements';

var styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContent: {
    fontSize: 20,
    textAlign: 'center',
    color: '#4A4A4A',
  },
  fixedSpace: {
    paddingTop: 100,
    backgroundColor: 'transparent'
  }
});

class NewWalletWarningView extends Component {
  static navigationOptions = {
    title: 'Warning',
  };
  render() {
    return (
      <View style={styles.textContainer}>
        <Icon color="black" name="invert-colors" size={62} />
        <Text style={styles.textContent}>You are about to see the mnemonic of your new wallet.</Text>
        <Text style={styles.textContent}>Be careful the eyes behind you!</Text>
        <View style={styles.fixedSpace}></View>
        <Button
          raised
          backgroundColor={'#5589FF'}
          title='Show me the mnemonic'
          onPress={() => {

          }}
        />
      </View>
    );
  }
}

export default NewWalletWarningView
