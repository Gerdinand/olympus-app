'use strict';

import React from 'react';
import { StackNavigator } from 'react-navigation';
import MeView from '../Pages/Me/Me';
import Backup from '../Pages/Backup/Backup';
import SetGesture from '../Pages/Security/SetGesture';

const MeScreen = ({ navigation }) => (
  <MeView navigation={navigation} />
);

const BackupScreen = ({ navigation }) => (
  <Backup navigation={navigation} />
);

const SetGestureScreen = ({ navigation }) => (
  <SetGesture navigation={navigation} />
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
  SetGesture: {
    screen: SetGestureScreen,
    path: 'setgesture',
    navigationOptions: () => ({
      title: 'Set Gesture',
    }),
  },
});

export default MeTab;