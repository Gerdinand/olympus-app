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
    title: 'Index'
  },
  {
    icon: require('../../images/index.png'),
    title: 'Lending'
  },
  {
    icon: require('../../images/index.png'),
    title: 'Futures'
  },
  {
    icon: require('../../images/index.png'),
    title: 'Options'
  },
];

class MarketView extends Component {
  render() {
    const { navigation } = this.props;

    return (
      <ScrollView style={{backgroundColor: '#F5F5F5'}}>
        <List>
        {
          list.map((l, i) => (
            <ListItem
              key={i}
              avatar={l.icon}
              title={l.title}
              onPress={() => {
                if (i == 0) {
                  navigation.navigate('MarketIndex');
                }
              }}
            />
          ))
        }
        </List>
      </ScrollView>
    );
  }
}

export default MarketView;
