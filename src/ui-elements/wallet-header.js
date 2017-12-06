'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {
  Text
} from 'react-native-elements';

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
  },
  name: {
    fontSize: 30,
    color: 'white',
    marginLeft: 15,
  },
  address: {
    fontSize: 10,
    color: 'white',
    marginLeft: 15,
    marginTop: 6,
  },
  tips: {
    fontSize: 10,
    color: 'white',
    marginLeft: 15,
    marginTop: 40,
  },
  assets: {
    fontSize: 40,
    color: 'white',
    marginLeft: 15,
    marginTop: 6,
  }
});

class WalletHeader extends Component {
  render() {
    return (
      <View>
        <View style={styles.container}>
          <Text style={styles.name}>NeoWallet</Text>
          <Text style={styles.address}>0x7d401a85103a43a41e74a8E2314909333C8a4099</Text>
          <Text style={styles.tips}>Total assets</Text>
          <Text style={styles.assets}>$1,023</Text>
        </View>
      </View>
    );
  }
}

export default WalletHeader;
