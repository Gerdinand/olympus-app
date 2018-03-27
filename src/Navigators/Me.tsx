'use strict';

import React from 'react';
import { StackNavigator } from 'react-navigation';
import MeView from '../Pages/Me/Me';
import Backup from '../Pages/Backup/Backup';
import SetGesture from '../Pages/Security/SetGesture';
import SetFingerprint from '../Pages/Security/SetFingerprint';
import Colors from '../Constants/Colors';

const MeScreen = ({ navigation }) => (
  <MeView navigation={navigation} />
);

const BackupScreen = ({ navigation }) => (
  <Backup navigation={navigation} />
);

const SetGestureScreen = ({ navigation }) => (
  <SetGesture navigation={navigation} />
);

const SetFingerprintScreen = ({ navigation }) => (
  <SetFingerprint navigation={navigation} />
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
  SetFingerprint: {
    screen: SetFingerprintScreen,
    path: 'setFingerprint',
    navigationOptions: () => ({
      title: 'Set Fingerprint',
    }),
  },
}, {
    navigationOptions: {
      headerStyle: { backgroundColor: 'white' },
      headerTintColor: Colors.navigationHeaderBack,
      headerTitleStyle: { color: Colors.navigationHeaderTitle },
    },
  });

export default MeTab;
