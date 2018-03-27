'use strict';

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  RefreshControl,
  DeviceEventEmitter,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import {
  List,
  ListItem,
} from 'react-native-elements';

import { EventRegister } from 'react-native-event-listeners';
import WalletHeader from './partials/WalletHeader';
import { WalletService, EthereumService } from '../../Services';
import { AppState } from '../../reducer';
import { Wallet, Token } from '../../Models';
import { Text } from '../_shared/layout';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../Constants/Colors';
interface OwnProps {
  navigation: any;

}
interface ReduxProps {
  balanceVisibility: boolean;
  newWalletWarning: boolean;
  walletWarningDisplayed: () => void;
  previousWallet: Wallet;
}

interface InternalState {
  wallet: Wallet;
  refreshing: boolean;
}
class WalletView extends React.Component<ReduxProps & OwnProps, InternalState> {

  private walletListener;

  public static navigationOptions = ({ navigation }) => ({
    title: 'Wallet',
    headerRight: (
      <Icon
        name="ios-add-circle"
        size={12}
        color={Colors.buttonBlue}
        onPress={() => navigation.navigate('AddToken')}
      />
    ),
  })

  public constructor(props: ReduxProps & OwnProps) {
    super(props);

    this.walletListener = null;

    // Wallet is manage from the state, but we retreive from redux the storage wallet on starting
    this.state = {
      wallet: props.previousWallet,
      refreshing: EthereumService.getInstance().isWalletSyncing,
    };
    this.fetchData = this.fetchData.bind(this);
  }

  public componentWillMount() {

    this.walletListener = EventRegister.addEventListener('wallet.updated', (wallet) => {
      if (_.isEmpty(wallet)) {
        DeviceEventEmitter.emit('showToast', 'Synchronization failed.');
        this.setState({ refreshing: false });
        return;
      }
      if (this.state.wallet.txs.length && wallet.txs.length !== this.state.wallet.txs.length) {
        DeviceEventEmitter.emit('showToast', 'New transaction confirmed.');
      }
      this.setState({ wallet, refreshing: false });
    });

    this.setState({ wallet: WalletService.getInstance().wallet });
    console.log(JSON.stringify(WalletService.getInstance().wallet));

    this.fetchData();
    EthereumService.getInstance().fireTimer();
  }
  public componentWillReceiveProps(_newProps) {
    // We detect some change in the wallet that require reloading.
    const wallet = WalletService.getInstance().wallet;
    if (wallet.forceReoload) {
      wallet.forceReoload = false;
      EthereumService.getInstance().sync(wallet);
      this.setState({ refreshing: true, wallet });
    }
  }
  public componentWillUnmount() {
    EthereumService.getInstance().invalidateTimer();
    EventRegister.removeEventListener(this.walletListener);
  }

  public componentDidMount() {
    if (!this.props.newWalletWarning) {
      this.props.navigation.navigate('WalletSuccess');
    }
  }
  private fetchData() {
    EthereumService.getInstance().sync(WalletService.getInstance().wallet);
  }

  private onRefresh() {
    this.setState({ refreshing: true });
    this.fetchData();
  }

  public render() {
    const { navigation } = this.props;

    return (
      <ScrollView
        style={{ backgroundColor: 'white' }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => this.onRefresh()}
          />
        }
      >
        <WalletHeader wallet={this.state.wallet} />
        {!this.state.wallet.ethPrice && !this.state.refreshing &&
          <View >
            <Text numberOfLines={3} style={styles.errorText}>
              Error updating your wallet, try to refresh or import it one more time.
              </Text>
          </View>
        }
        <List
          style={{ height: 578 }}
          containerStyle={styles.listContainer}
        >
          {this.state.wallet.tokens.filter((token) => !!token).map((token, i) => {
            const hasRightSubtitle = i === 0 || (token.price === 0 && Token.supportExchange(token));

            // Ether and tokens with no price have different style
            if (hasRightSubtitle) {
              return (
                <ListItem
                  key={i}
                  hideChevron={true}
                  roundAvatar
                  avatar={{ uri: token.icon }}
                  title={token.symbol}
                  subtitle={token.name}
                  rightTitle={this.props.balanceVisibility ? token.balance.toFixed(6).toString() : '******'}
                  onPress={() => navigation.navigate('WalletDetail', { token })}
                  containerStyle={styles.itemContainer}
                  avatarStyle={styles.itemAvatar}
                  titleStyle={styles.itemTitle}
                  rightTitleStyle={styles.itemTitle}
                  subtitleStyle={styles.subtitle}
                />);
            }

            return (
              <ListItem
                key={i}
                hideChevron={true}
                roundAvatar
                avatar={{ uri: token.icon }}
                title={
                  <View style={styles.itemFlex}>
                    <Text style={styles.itemTitle}>{token.symbol}</Text>
                    <Text style={styles.itemTitle}>
                      {this.props.balanceVisibility ? token.balance.toFixed(6).toString() : '******'}
                    </Text>
                  </View>}
                subtitle={
                  <View style={styles.itemFlex}>
                    <Text style={styles.subtitle}>{token.name}</Text>
                    <Text style={[styles.subtitle, { textAlign: 'left' }]}>
                      {!Token.supportExchange(token) && `Exchange not supported`}
                      {token.price > 0 && `1 ETH = ${token.price} ${token.symbol}`}
                    </Text>
                  </View>}
                onPress={() => navigation.navigate('WalletDetail', { token })}
                containerStyle={styles.itemContainer}
                avatarStyle={styles.itemAvatar}
              />);
          })}

        </List>
      </ScrollView>
    );
  }
}

const mapReduxStateToProps = (state: AppState) => {
  return {
    balanceVisibility: state.wallet.balanceVisibility,
    newWalletWarning: state.wallet.warningBackUpDone,
    previousWallet: state.wallet.wallet,
  };
};
const mergeProps = (reduxProps, dispatchProps, ownProps) => {
  return { ...reduxProps, ...dispatchProps, ...ownProps };
};

export default connect(mapReduxStateToProps, null, mergeProps)(WalletView);

const styles = StyleSheet.create({
  listContainer: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
  },
  itemContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#999',
  },
  itemFlex: {
    flex: 1,
    display: 'flex'
    ,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginRight: 6,
  },
  itemAvatar: {
    backgroundColor: 'white',
    borderColor: Colors.borderColor,
    borderWidth: 0.5,
    padding: 2,
  },
  itemTitle: {
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  subtitle: {
    color: '#999',
    fontSize: 12,
  },
  errorText: {
    padding: 24,
    color: Colors.errorText,
    fontSize: 16,
    textAlign: 'center',
  },
});
