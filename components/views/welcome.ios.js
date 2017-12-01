'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button
} from 'react-native';

var styles = StyleSheet.create({
  description: {
    fontSize: 20,
    textAlign: 'center',
    color: '#FFFFFF'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#123456',
  }
});

class Welcome extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          Welcome to Olympus Wallet!
        </Text>
        <Button
          title="Create new wallet"
          onPress={() => {}}
        />
        <Button
          title="Import exsit wallet"
          onPress={() => {}}
        />
      </View>
    );
  }
}

module.exports = Welcome;
