'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {
  Text,
} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Row } from '../Controls/index';
import { AddressModal } from '../Components/addressModal';
import Toast from 'react-native-simple-toast';

let styles = StyleSheet.create({
  container: {
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    paddingTop: 20,
    paddingBottom: 20,
    aspectRatio: 16 / 9,
    backgroundColor: '#4B5FFE',
    borderRadius: 8,
    borderWidth: 0,
    borderColor: 'transparent',
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
    marginRight: 5,
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
  },
  icon: {
    alignSelf: 'flex-end',
  },
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

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  render() {
    const { name, address, balance } = this.props;
    return (
      <View style={{ backgroundColor: 'transparent' }}>
        <View style={styles.container}>
          <Text style={styles.name}>{name}</Text>
          <Row
            onPress={() => { this.setState({ modalVisible: true }); }}
          >
            <Text style={styles.address}> {address}</Text>
            <Icon name="qrcode" color="white" size={22}
              style={styles.icon}
            />
          </Row>
          <Text style={styles.tips}>BALANCE</Text>
          <Text style={styles.assets}>{balance}</Text>
        </View>

        <AddressModal
          title={'My Address'}
          visible={this.state.modalVisible}
          address={address}
          onClose={(message) => {
            this.setState({ modalVisible: false });
            if (message) {
              Toast.show(message);
            }
          }}
        />
      </View >
    );
  }
}

export default WalletHeader;
