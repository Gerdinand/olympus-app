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
import { AppState } from '../../Store';
import { Text } from '../_shared/layout/Text';

interface OwnProps {
  navigation: any;

}
interface ReduxProps {
  balanceVisibility: boolean;
  newWalletWarning: boolean;
  walletWarningDisplayed: () => void;
}

interface InternalState {
  wallet: any; // TODO object?
  refreshing: boolean;
}
class WalletView extends React.Component<ReduxProps & OwnProps, InternalState> {

  private walletListener;

  public constructor(props) {
    super(props);

    this.walletListener = null;

    this.state = {
      wallet: null,
      refreshing: false,
    };

    this.fetchData = this.fetchData.bind(this);
  }

  public componentWillMount() {

    this.walletListener = EventRegister.addEventListener('wallet.updated', (wallet) => {
      if (this.state.wallet.length && wallet.txs.length !== this.state.wallet.length) {
        DeviceEventEmitter.emit('showToast', 'New transaction confirmed.');
      }
      this.setState({ wallet, refreshing: false });
    });

    this.setState({ wallet: WalletService.getInstance().wallet });
    console.log(JSON.stringify(WalletService.getInstance().wallet));

    this.fetchData();
    EthereumService.getInstance().fireTimer();
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

  private _onRefresh() {
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
            onRefresh={this._onRefresh.bind(this)}
          />
        }
      >
        <WalletHeader
          name={this.state.wallet.name}
          address={this.state.wallet.address}
          balance={
            !this.props.balanceVisibility ?
              '$ ******' :
              this.state.wallet.ethPrice ? `$ ${this.state.wallet.balanceInUSD}` : '$ --'
          }
        />
        <List
          style={{ height: 578 }}
          containerStyle={styles.listContainer}
        >
          {this.state.wallet.tokens.filter((token) => !!token).map((token, i) => {
            if (i === 0 || token.price === 0) {
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
                    <Text style={styles.subtitle}>{`1 ETH = ${token.price} ${token.symbol}`}</Text>
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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginRight: 6,
  },
  itemAvatar: {
    backgroundColor: 'white',
    borderColor: '#999',
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
});
