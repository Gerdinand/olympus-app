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
    icon: require('../../images/index.png'),
    title: 'Index',
  },
  {
    icon: require('../../images/lending.png'),
    title: 'Lending',
  },
  {
    icon: require('../../images/future.png'),
    title: 'Futures',
  },
  {
    icon: require('../../images/option.png'),
    title: 'Options',
  },
];

class MarketView extends Component {
  render() {
    const { navigation } = this.props;

    return (
      <ScrollView style={{ backgroundColor: '#F5F5F5' }}>
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
