'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image
} from 'react-native';
import {
  List,
  ListItem
} from 'react-native-elements';

const list = [
  {
    icon: require('../../images/index.png'),
    title: 'Market Index'
  },
];

class MarketView extends Component {
  render() {
    return (
      <ScrollView style={{backgroundColor: '#F5F5F5'}}>
        <List>
        {
          list.map((l, i) => (
            <ListItem
              key={i}
              avatar={l.icon}
              title={l.title}
            />
          ))
        }
        </List>
      </ScrollView>
    );
  }
}

export default MarketView;
