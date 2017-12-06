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

var styles = StyleSheet.create({
  description: {
    fontSize: 20,
    textAlign: 'center',
    color: '#FFFFFF'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#765432',
  }
});

const list1 = [
  {
    icon: <Image source={require('../../images/wallet.png')}/>,
    title: 'Wallet Management'
  },
];

const list2 = [
  {
    icon: <Image source={require('../../images/wallet.png')}/>,
    title: 'Olympus Project'
  },
  {
    icon: <Image source={require('../../images/wallet.png')}/>,
    title: 'Team'
  }
];

class MeView extends Component {
  render() {
    return (
      <ScrollView style={{backgroundColor: '#F5F5F5'}}>
        <List>
        {
          list1.map((l, i) => (
            <ListItem
              key={i}
              leftIcon={{image: l.icon}}
              title={l.title}
            />
          ))
        }
        </List>
        <List>
        {
          list2.map((l, i) => (
            <ListItem
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
