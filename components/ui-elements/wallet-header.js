'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

var styles = StyleSheet.create({
  container: {
    marginRight:10,
    marginLeft:10,
    marginTop:10,
    paddingTop:20,
    paddingBottom:20,
    aspectRatio: 16/9,
    backgroundColor:'#4B5FFE',
    borderRadius:8,
    borderWidth: 0,
    borderColor: 'transparent'
  }
});

class WalletHeader extends Component {
  render() {
    return (
      <View>
        <View style={styles.container}>

        </View>
      </View>
    );
  }
}

export default WalletHeader;
