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
import { StackNavigator } from 'react-navigation';
import MeHome from '../views/wallet';

const MeTabView = ({navigation}) => (
  <MeHome banner="Me" navigation={navigation}/>
);

const MeTab = StackNavigator({
  Home: {
    screen: MeTabView,
    path: '/',
    navigationOptions: () => ({
      title: 'Me',
    }),
  }
});

export default MeTab;
