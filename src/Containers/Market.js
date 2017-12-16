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
    icon: <Image source={require('../../images/index.png')}/>,
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
              height={80}
              key={i}
              leftIcon={{image: l.icon}}
              title={l.title}
            />
          ))
        }
        </List>
      </ScrollView>
    );
  }
}

export default MeView;
