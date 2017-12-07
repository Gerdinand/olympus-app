'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView
} from 'react-native';
import {
  List,
  ListItem
} from 'react-native-elements';

class WalletDetailView extends Component {
  static navigationOptions = ({navigation}) => ({
    title: `${navigation.state.params.title}`,
    tabBar: {
      visible: false,
    }
  });

  render() {
    return (
      <View navigationBarHidden={true}>

      </View>
    );
  }
}

export default WalletDetailView;
