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

import { Me } from '../Containers';

const MeScreen = ({navigation}) => (
  <Me banner="Me" navigation={navigation}/>
);

const MeTab = StackNavigator({
  Home: {
    screen: MeScreen,
    path: '/',
    navigationOptions: () => ({
      title: 'Me',
    }),
  }
});

export default MeTab;
