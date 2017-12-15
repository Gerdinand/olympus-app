'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {
  Text,
  Button,
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
    fontSize: 13,
    color: 'white',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 6,
  },
  tips: {
    fontSize: 12,
    color: 'white',
    marginLeft: 15,
    marginTop: 30,
  },
  assets: {
    fontSize: 40,
    color: 'white',
    marginLeft: 15,
    marginTop: 6,
  }
});

class WalletHeader extends Component {

  static propTypes = {
    name: React.PropTypes.string.isRequired,
    address: React.PropTypes.string.isRequired,
    balance: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]).isRequired,
  }

  render() {
    const { name, address, balance } = this.props;
    return (
      <View style={{backgroundColor: 'transparent'}}>
        <View style={styles.container}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.address}>{address}</Text>
          <Text style={styles.tips}>BALANCE</Text>
          <Text style={styles.assets}>{balance}</Text>
        </View>
      </View>
    );
  }
}

export default WalletHeader;
