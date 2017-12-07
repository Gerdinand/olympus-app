'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView
} from 'react-native';
import {
  List,
  ListItem
} from 'react-native-elements';

const txs = [
  {
    from: '0x7d401a85103a43a41e74a8E2314909333C8a4099',
    to: '0x277A304D7C69e03898120567937245d1406D5F36',
    when: '2017/12/04 12:08',
    amount: 21.2,
    operation: 'send'
  },
  {
    from: '0x7d401a85103a43a41e74a8E2314909333C8a4099',
    to: '0x5185129f2872C6ef729a3B5C89CC41e997036115',
    when: '2017/12/03 3:32',
    amount: 4.79,
    operation: 'send'
  },
  {
    from: '0xC07cAACC6414A676a1929916Ad1AbDa5E9D3d0eD',
    to: '0x7d401a85103a43a41e74a8E2314909333C8a4099',
    when: '2017/11/27 20:41',
    amount: 174,
    operation: 'receive'
  }
];

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
    backgroundColor: 'white',
  }
});

class WalletDetailView extends Component {
  static navigationOptions = ({navigation}) => ({
    title: `${navigation.state.params.title}`,
    tabBar: {
      visible: false,
    }
  });

  render() {
    return (
      <ScrollView style={{backgroundColor: 'white'}}>
        <View>
        </View>
        <List>
        {
          txs.map((l, i) => (
            <ListItem
              // roundAvatar
              hideChevron={true}
              key={i}
              title={(l.operation == 'receive') ? l.from : l.to}
              subtitle={l.when}
              rightTitle={l.amount.toString()}
              rightTitleStyle={{fontWeight:'bold', color:'#4A4A4A'}}
            />
          ))
        }
        </List>
      </ScrollView>
    );
  }
}

export default WalletDetailView;
