'use strict';

import React from 'react';
import {

  ScrollView,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { Column, Text, Margin } from '../_shared/layout';
import { Button } from 'react-native-elements';
import { EventRegister } from 'react-native-event-listeners';
import WalletActions from '../Wallet/WalletActions';
import { AppState } from '../../reducer';

interface InternalProps {
  navigation: any;
  newWalletWarning: boolean;
  walletWarningDisplayed: () => void;
}
class WalletSuccess extends React.Component<InternalProps> {

  public constructor(props: InternalProps) {
    super(props);
  }
  // Handle scenarios like we have come back accidentaly by navigator
  public componentWillMount() {
    if (this.props.newWalletWarning) {
      this.props.navigation.navigate('WalletHome');
    }
  }

  public componentDidMount() {
    this.props.walletWarningDisplayed();
  }

  public render() {
    return (
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        style={{ flex: 1, flexDirection: 'column' }}
      >
        <Column style={{ padding: 16, justifyContent: 'space-between' }}>

          <Margin margin={16} />

          <Column alignItems="center" >

            <Icon
              name="ios-checkmark-circle"
              color="#5589FF"
              size={96}
            />
            <Margin margin={4} />

            <Text style={styles.header}>New wallet created successfully</Text>
            <Margin margin={4} />
            <Text style={styles.paragraph} numberOfLines={4}>
              It is strongly recommended that you make a backup before using the wallet,
               and export the “Recovery Phrase”.
              This will allow you to recover your wallet even if you ever forget your password.
          </Text>
          </Column>

          <Margin margin={16} />

          <Column  >

            <Button
              containerViewStyle={{ alignSelf: 'stretch' }}
              buttonStyle={{ backgroundColor: '#5589FF', alignSelf: 'stretch' }}
              title={'Backup Wallet'}
              onPress={() => {
                EventRegister.emit('hasWallet', { wallet: true });
                this.props.navigation.navigate('Backup');
              }}
            />
            <Margin margin={8} />
            <Button
              buttonStyle={{ backgroundColor: '#5589FF' }}
              title={'Backup Recovery Phrase'}
              onPress={() => console.log('AA')}
              disabled={true}

            />
          </Column>
          <Margin margin={8} />

          <Column alignItems="flex-end">
            <Text
              style={styles.link}
              onPress={() => console.log('AA')}

            >
              How to backup your wallet
            </Text>
          </Column>
        </Column>

      </ScrollView >
    );
  }
}

const mapReduxStateToProps = (state: AppState) => {
  return {
    newWalletWarning: state.wallet.warningBackUpDone,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    walletWarningDisplayed: () => dispatch(WalletActions.setWalletBackUpDone()),
  };
};
export default connect(mapReduxStateToProps, mapDispatchToProps)(WalletSuccess);

const styles = StyleSheet.create({

  header: { fontSize: 18 },
  paragraph: { color: '#86939a', fontWeight: '400', fontSize: 12, lineHeight: 20 },
  skip: { color: 'blue', marginLeft: 12 },
  link: {
    color: '#999999', // No is disabled, when provide functionality change to #5589FF
    fontWeight: '400',
    fontSize: 10,
    marginRight: 12, // Align with the button
  },

});
