'use strict';

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  RefreshControl,
  DeviceEventEmitter,
  Text,
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

interface InternalProps {
  navigation: any;
  balanceVisibility: boolean;
}

interface InternalState {
  wallet: any; // TODO object?
  refreshing: boolean;
}
class WalletView extends React.Component<InternalProps, InternalState> {

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
    const _ = this;
    this.walletListener = EventRegister.addEventListener('wallet.updated', (wallet) => {
      if (_.state.wallet.length && wallet.txs.length !== _.state.wallet.length) {
        DeviceEventEmitter.emit('showToast', 'New transaction confirmed.');
      }
      _.setState({ wallet, refreshing: false });
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
          {this.state.wallet.tokens.map((t, i) => {
            if (i === 0 || t.price === 0) {
              return (
                <ListItem
                  key={i}
                  hideChevron={true}
                  roundAvatar
                  avatar={{ uri: t.icon }}
                  title={t.symbol}
                  subtitle={t.name}
                  rightTitle={this.props.balanceVisibility ? t.balance.toFixed(6).toString() : '******'}
                  onPress={() => navigation.navigate('WalletDetail', { token: t })}
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
                avatar={{ uri: t.icon }}
                title={
                  <View style={styles.itemFlex}>
                    <Text style={styles.itemTitle}>{t.symbol}</Text>
                    <Text style={styles.itemTitle}>
                      {this.props.balanceVisibility ? t.balance.toFixed(6).toString() : '******'}
                    </Text>
                  </View>}
                subtitle={
                  <View style={styles.itemFlex}>
                    <Text style={styles.subtitle}>{t.name}</Text>
                    <Text style={styles.subtitle}>{`1 ETH = ${t.price} ${t.symbol}`}</Text>
                  </View>}
                onPress={() => navigation.navigate('WalletDetail', { token: t })}
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
  };
};

export default connect(mapReduxStateToProps, null)(WalletView);

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
    marginRight: 5,
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
    fontWeight: '500',
    color: '#999',
  },
});
