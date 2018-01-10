'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Linking,
  ActionSheetIOS,
} from 'react-native';
import {
  List,
  ListItem
} from 'react-native-elements';

import { removeItem } from '../Utils/KeyStore';
import { EventRegister } from 'react-native-event-listeners';
import { WalletService, EthereumService } from '../Services';

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
    {
        icon: <Image source={require('../../images/wallet.png')}/>,
        title: 'Net Work',
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

const list3 = [
  {
    icon: <Image source={require('../../images/wallet.png')}/>,
    title: "Sign out"
  }
]

class MeView extends Component {

  onPress(list, index) {
    if (list == list1) {

      switch (index) {
          case 0 :
              this.props.navigation.navigate("Backup");
              break;
          case 1 :
              this.props.navigation.navigate("Network");
              break;
      }
      // if (index == 0) {
      //   // backup
      //   this.props.navigation.navigate("Backup");
      // }
    } else if (list  == list2) {
      if (index == 0) {
        // homepage
        Linking.openURL("https://olympuslabs.io");
      } else if (index == 1) {
        // homepage#team
        Linking.openURL("https://olympuslabs.io/web/team");
      }
    } else if (list == list3) {
      if (index == 0) {
        // sign out
        var _ = this;
        ActionSheetIOS.showActionSheetWithOptions({
          options: ["Sign out", "Cancel"],
          destructiveButtonIndex: 0,
          cancelButtonIndex: 1,
        }, (buttonIndex) => {
          if (0 == buttonIndex) {
            EthereumService.getInstance().invalidateTimer();
            WalletService.getInstance().resetActiveWallet();
            removeItem("wallets");
            EventRegister.emit("hasWallet", false);
          }
        });
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
        <List>
        {
          list3.map((l, i) => (
            <ListItem
              key={i}
              leftIcon={{image: l.icon}}
              title={l.title}
              onPress={() => {
                this.onPress(list3, i);
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
