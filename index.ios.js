'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  TabBarIOS,
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';
var Wallet = require('./components/views/wallet.ios');
var Me = require('./components/views/me.ios');

export default class Hora extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'wallet'
        };
    }

    render() {
        return (
          <TabBarIOS selectedTab = {this.state.selectedTab}>
            <TabBarIOS.Item
                selected = {this.state.selectedTab === 'wallet'}
                title = 'Wallet'
                onPress = {() => {
                    this.setState({
                        selectedTab: 'wallet',
                    });
                }}>
                <Wallet/>
            </TabBarIOS.Item>
            <TabBarIOS.Item
                selected = {this.state.selectedTab === 'me'}
                title = 'Me'
                onPress = {() => {
                    this.setState({
                        selectedTab: 'me',
                    });
                }}>
            <Me/>
            </TabBarIOS.Item>
          </TabBarIOS>
        );
    }
}

AppRegistry.registerComponent('Hora', () => Hora);
