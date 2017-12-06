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

import MeView from '../views/me';

const MeTabView = ({navigation}) => (
  <MeView banner="Me" navigation={navigation}/>
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
