'use strict';

import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import {
  Button,
} from 'react-native-elements';
import { StackNavigator } from 'react-navigation';

import CreateWalletView from '../CreateWallet/CreateWallet';
import ImportWalletView from '../ImportWallet/ImportWallet';
import styles from './WelcomeStyle';
import PropTypes from 'prop-types';

interface InternalProps {
  navigation;
}
class WelcomeView extends React.Component<InternalProps> {
  public static propTypes = {
    navigation: PropTypes.object,
  };

  public static navigationOptions = {
    title: 'Welcome',
    header: null,
  };

  public render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Welcome to Olympus
          </Text>
          <View style={styles.bottomLine} />
        </View>
        <Button
          buttonStyle={styles.button1}
          title="Import existing wallet"
          onPress={() => navigate('ImportWallet')}
        />
      </View>
    );
  }
}

const WelcomeNav = StackNavigator({
  Home: { screen: WelcomeView },
  CreateWallet: { screen: CreateWalletView },
  ImportWallet: { screen: ImportWalletView },

}, { cardStyle: { backgroundColor: 'white' } });

export default WelcomeNav;
