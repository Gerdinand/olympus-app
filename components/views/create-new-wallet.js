'use strict';

import React, { Component } from 'react';
import {
  FlatList,
  View,
  Text,
} from 'react-native';
import {
  List,
  ListItem
} from 'react-native-elements';

class NewWallet extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
  }
  static navigationOptions = {
    title: 'Create new wallet',
  };
  render() {
    return (
      <List>
        <FlatList
          data={ this.state.data }
          renderItem={({ item }) => {
            <ListItem
              title={'!'}
              subtitle={'???'}
            />
          }}
        />
      </List>
    );
  }
}

module.exports = NewWallet;
