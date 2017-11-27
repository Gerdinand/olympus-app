'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text
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
    backgroundColor: '#765432',
  }
});

class Me extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          This could be Me!
        </Text>
      </View>
    );
  }
}

module.exports = Me;
