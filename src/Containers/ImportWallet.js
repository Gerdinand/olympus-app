'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button
} from 'react-native';

class ImportWalletView extends Component {
  static navigationOptions = {
    title: 'Create new wallet',
  };
  render() {
    return (
      <View>
        <Text>
          Import Exist Wallet!
        </Text>
      </View>
    );
  }
}

export default ImportWalletView;
