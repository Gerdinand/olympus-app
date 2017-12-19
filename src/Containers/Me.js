'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Linking
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
    title: 'Wallet Backup',
  },
];

const list2 = [
  {
    icon: <Image source={require('../../images/wallet.png')}/>,
    title: 'Olympus Project',
  },
  {
    icon: <Image source={require('../../images/wallet.png')}/>,
    title: 'Team'
  }
];

class MeView extends Component {

  onPress(list, index) {
    if (list == list1) {
      if (index == 0) {
        // backup
        this.props.navigation.navigate("Backup");
      }
    } else if (list  == list2) {
      if (index == 0) {
        // homepage
        Linking.openURL("https://olympuslabs.io");
      } else if (index == 1) {
        // homepage#team
        Linking.openURL("https://olympuslabs.io/web/team");
      }
    }
  }

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
              onPress={() => {
                this.onPress(list1, i);
              }}
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
              onPress={() => {
                this.onPress(list2, i);
              }}
            />
          ))
        }
        </List>
      </ScrollView>
    );
  }
}

export default MeView;
