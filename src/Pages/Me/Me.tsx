'use strict';

import React from 'react';
import {
  ScrollView,
  Linking,
  View,
  Platform,
} from 'react-native';
import {
  List,
  ListItem,
} from 'react-native-elements';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import { connect } from 'react-redux';
import ActionSheet from 'react-native-actionsheet';

import { WalletService, EthereumService } from '../../Services';
import WalletActions from '../Wallet/WalletActions';

const list1 = [
  {
    icon: { name: 'wallet', type: 'entypo' },
    title: 'Wallet Backup',
  },
];

const list2 = [
  {
    icon: { name: 'home' },
    title: 'Olympus Project',
  },
  {
    icon: { name: 'ios-people', type: 'ionicon' },
    title: 'Team',
  },
];

const list3 = [
  {
    icon: { name: 'ios-grid', type: 'ionicon' },
    title: 'Gesture',
  },
  {
    icon: { name: 'ios-hand', type: 'ionicon' },
    title: 'Fingerprint',
  },
];

const list4 = [
  {
    icon: { name: 'log-out', type: 'entypo' },
    title: 'Sign out',
  },
];

const options = ['Sign out', 'Cancel'];
const CANCEL_INDEX = 1;
const destructiveButtonIndex = 0;

interface InternalProps {
  navigation: any; // Navigation Object
}

interface ReduxProps {
  logout: () => void;
}

interface InternalState {
  hasSensor: boolean;
}

class MeView extends React.Component<InternalProps & ReduxProps, InternalState> {

  public refs = {
    actionSheet: ActionSheet,
  };

  public constructor(props) {
    super(props);

    this.state = { hasSensor: false };
  }

  public async componentDidMount() {
    try {
      await FingerprintScanner.isSensorAvailable();
      this.setState({ hasSensor: true });
    } catch (error) {
      console.log(error.message);
    }
  }

  public componentWillUnmount() {
    if (Platform.OS === 'ios') {
      //
    } else if (Platform.OS === 'android') {
      FingerprintScanner.release();
    }
  }

  public onPress(list, index) {
    if (list === list1) {
      if (index === 0) {
        // backup
        this.props.navigation.navigate('Backup');
      }
    } else if (list === list2) {
      if (index === 0) {
        // homepage
        Linking.openURL('https://olympuslabs.io');
      } else if (index === 1) {
        // homepage#team
        Linking.openURL('https://olympuslabs.io/web/team');
      }
    } else if (list === list3) {
      if (index === 0) {
        this.props.navigation.navigate('SetGesture');
      } else if (index === 1) {
        this.props.navigation.navigate('SetFingerprint');
      }
    } else if (list === list4) {
      if (index === 0) {
        // sign out
        this.refs.actionSheet.show();
      }
    }
  }

  public actionSheetHandle(buttonIndex) {
    // Logout from Actionsheet
    if (0 === buttonIndex) {
      EthereumService.getInstance().invalidateTimer();
      WalletService.getInstance().resetActiveWallet();
      this.props.logout();
    }
  }

  private renderLogout() {
    if (!__DEV__) {
      return null;
    }
    // Only for local testing
    return (
      <View>
        <List>
          {
            list4.map((l, i) => (
              <ListItem
                key={i}
                leftIcon={l.icon}
                title={l.title}
                onPress={() => {
                  this.onPress(list4, i);
                }}
              />
            ))
          }
        </List>
        <ActionSheet
          ref="actionSheet"
          title={''}
          options={options}
          cancelButtonIndex={CANCEL_INDEX}
          destructiveButtonIndex={destructiveButtonIndex}
          onPress={(buttonIndex) => this.actionSheetHandle(buttonIndex)}
        />
      </View>
    );
  }
  public render() {
    return (
      <ScrollView style={{ backgroundColor: '#F5F5F5' }}>
        <List>
          {
            list1.map((l, i) => (
              <ListItem
                key={i}
                leftIcon={l.icon}
                title={l.title}
                onPress={() => {
                  this.onPress(list1, i);
                }}
              />
            ))
          }
        </List>
        <List>
          {
            list2.map((l, i) => (
              <ListItem
                key={i}
                leftIcon={l.icon}
                title={l.title}
                onPress={() => {
                  this.onPress(list2, i);
                }}
              />
            ))
          }
        </List>
        <List>
          {
            list3.map((l, i) => (
              (i !== 1 || this.state.hasSensor) && <ListItem
                key={i}
                leftIcon={l.icon}
                title={l.title}
                onPress={() => {
                  this.onPress(list3, i);
                }}
              />
            ))
          }
        </List>
        {this.renderLogout()}
      </ScrollView >
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    logout: () => dispatch(WalletActions.logout()), // If we import the wallet, we understand was backuped
  };
};
const mergeProps = (reduxProps, dispatchProps, ownProps) => {
  return { ...reduxProps, ...dispatchProps, ...ownProps };
};
export default connect(null, mapDispatchToProps, mergeProps)(MeView);
