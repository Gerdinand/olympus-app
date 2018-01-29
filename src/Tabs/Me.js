'use strict';

import React from 'react';

import { StackNavigator } from 'react-navigation';

import { Me, Backup } from '../Containers';

const MeScreen = ({ navigation }) => (
  <Me banner="Me" navigation={navigation} />
);

const BackupScreen = ({ navigation }) => (
  <Backup banner="Backup" navigation={navigation} />
);

const MeTab = StackNavigator({
  Home: {
    screen: MeScreen,
    path: '/',
    navigationOptions: () => ({
      title: 'Me',
    }),
  },
  Backup: {
    screen: BackupScreen,
    path: 'backup',
    navigationOptions: () => ({
      title: 'Backup',
    }),
  },
});

export default MeTab;
