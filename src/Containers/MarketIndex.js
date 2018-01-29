'use strict';

import React, { Component } from 'react';
import {
  ScrollView,
} from 'react-native';
import {
  List,
  ListItem,
} from 'react-native-elements';

const list = [
  {
    title: 'Bitcoin Index',
    value: '18,903',
  },
  {
    title: 'Kyber Index',
    value: '2,817',
  },
];

class MarketIndexView extends Component {
  render() {
    return (
      <ScrollView style={{ backgroundColor: '#F5F5F5' }}>
        <List>
          {
            list.map((l, i) => (
              <ListItem
                key={i}
                title={l.title}
                rightTitle={l.value}
              />
            ))
          }
        </List>
      </ScrollView>
    );
  }
}

export default MarketIndexView;
