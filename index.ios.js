'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  TabBarIOS,
  StyleSheet,
  Text,
  View,
  ScrollView,
  NavigatorIOS
} from 'react-native';
var Welcome = require('./components/views/welcome');
var Wallet = require('./components/views/wallet');
var Me = require('./components/views/me');

export default class Hora extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'wallet'
    };
  }

  render() {
    if (1) {
      return (<Welcome/>);
    } else {
      return (
        <TabBarIOS selectedTab = {this.state.selectedTab}>
          <TabBarIOS.Item
            selected = {this.state.selectedTab === 'wallet'}
            title = 'Wallet'
            systemIcon = 'featured'
            onPress = {() => {
              this.setState({
                selectedTab: 'wallet',
              });
            }}>
            <NavigatorIOS
              initialRoute={{
                component: Wallet,
                title: 'Wallet',
              }}
              style={{flex: 1}}
            />
          </TabBarIOS.Item>
          <TabBarIOS.Item
            selected = {this.state.selectedTab === 'me'}
            title = 'Me'
            systemIcon = 'contacts'
            onPress = {() => {
              this.setState({
                selectedTab: 'me',
              });
            }}>
            <NavigatorIOS
              initialRoute={{
                component: Me,
                title: 'Me',
              }}
              style={{flex: 1}}
            />
          </TabBarIOS.Item>
        </TabBarIOS>
      );
    }
  }
}

AppRegistry.registerComponent('Hora', () => Hora);
