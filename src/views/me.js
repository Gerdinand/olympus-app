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

const list = [
  {
    icon: <Image/>,
    title: 'Wallet Management'
  },
  {
    icon: <Image/>,
    title: 'Olympus Project'
  },
  {
    icon: <Image/>,
    title: 'Team'
  }
];

class MeView extends Component {
  render() {
    return (
      <ScrollView>
        <list>
        {
          list.map((l, i) => (
            <ListItem
              avatar={{image: l.icon}}
              title={l.title}
            />
          ))
        }
        </list>
      </ScrollView>
    );
  }
}

export default MeView;
