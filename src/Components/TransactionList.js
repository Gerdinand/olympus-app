'use strict';
import React, { PureComponent } from 'react';
import {
  ActivityIndicator,
  ListView,
  AsyncStorage,
} from 'react-native';
import {
  List,
  ListItem,
} from 'react-native-elements';
import PropTypes from 'prop-types';
import _ from 'lodash';
import BigNumber from 'bignumber.js';
import Moment from 'moment';
import { decodeTx } from '../Utils';

let isActive =true;

export class TransactionList extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    onListItemPress: PropTypes.func,
    pendingTxHash: PropTypes.string,
    txs: PropTypes.array,
    token: PropTypes.object,
    wallet: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const txList = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      page: 1,
      pageSize: 5,
      txList,
      isLoadingMore: false,
      isRefreshing: false,
      isNoMore: false,
    };

    this._list = [];
    this.intervalID = null;
  }

  async componentDidMount() {
    isActive =true;
    this.fireTimer();
  }

  componentWillUnmount() {
    isActive = false;
    this.invalidateTimer();
  }

  formatAddress(address) {
    return address.replace(/(0x.{6}).{29}/, '$1****');
  }

  async loadTxs (page, pageSize, t) {
    const wallet = this.props.wallet;
    // const url = `https://api-${Constants.CHAIN_NAME}.etherscan.io/api?module=account&action=txlist&address=${wallet.address}&sort=desc&apikey=18V3SM2K3YVPRW83BBX2ICYWM6HY4YARK4`;
    const url = `http://34.224.71.191:8080/tx/address/${wallet.address}?page_size=${pageSize}&page=${page}`;
    // console.log(url);
    const response = await fetch(url, { method: 'GET' }).catch((err) => t>5 ? console.error(err) : this.loadTxs(page, pageSize));
    // wallet.txs = response ? (await response.json()).result : [];
    const txs = response ? (await response.json()).msg.tx : [];
    await Promise.all(txs.map(decodeTx));
    return txs;
  }

  async runloop() {
    let page = this.state.page;
    page--;
    let isNoMore = this.state.isNoMore;
    let pageSize=this.state.pageSize;
    if (page > 0) { pageSize *= page;}
    const txs = await this.loadTxs(1, pageSize, 1);
    if (!this.state.isLoadingMore && txs.length >= this._list.length) {
      this._list = txs;
      AsyncStorage.setItem('txs', JSON.stringify(txs));
      if(txs.length < pageSize){ isNoMore = true; }
      if (!isActive) return;
      this.setState({
        isNoMore,
        txList: this.state.txList.cloneWithRows(txs),
      });
    }
  }

  async fireTimer() {
    const txs = await AsyncStorage.getItem('txs');
    if (txs) {
      try {
        const txList = JSON.parse(txs);
        this._list = _.filter(txList, (v, i) => i < this.state.pageSize);
        if (!isActive) return;
        this.setState({
          txList: this.state.txList.cloneWithRows(this._list),
        });
      } catch(e) {
        console.error(e);
      }
    }
    this.runloop();
    this.intervalID = setInterval(this.runloop.bind(this), 10000);
  }

  invalidateTimer() {
    window.clearInterval(this.intervalID);
  }

  async _toEnd() {
    if (this.state.isLoadingMore || this.state.isRefreshing || this.state.isNoMore) {
      return;
    }
    this.setState({ isLoadingMore: true});
    let page = this.state.page;
    if (page == 1) page++;
    let isNoMore = this.state.isNoMore;
    const pageSize=this.state.pageSize;
    const txs = await this.loadTxs(page, pageSize, 1);
    this._list = _.uniqBy(this._list.concat(txs),'hash');
    AsyncStorage.setItem('txs', JSON.stringify(this._list));
    page++;
    if(txs.length < pageSize){ isNoMore = true; }
    if (!isActive) return;
    this.setState({
      page,
      isNoMore,
      isLoadingMore: false,
      txList: this.state.txList.cloneWithRows(this._list),
    });
  }

  _renderFooter() {
    const { isLoadingMore, isRefreshing, isNoMore } = this.state;
    if (isRefreshing || isNoMore) {
      return null;
    }
    if (isLoadingMore) {
      return <ActivityIndicator style={{height: 50}} animating={this.state.isLoadingMore} color="rgb(89,139,246)" />;
    } else {
      return null;
    }
  }

  renderLine(tx) {
    let isSending;
    let tokenAmount;
    let isExchange = false;

    if (tx.logs && tx.logs.length > 0) {
      const ethReceival = tx.logs.find((log) => log.name === 'EtherReceival');
      const trade = tx.logs.find((log) => log.name === 'Trade');
      const isETH = this.props.token.symbol === 'ETH';

      // Must be an exchange if we have one of those methods invoked so far.
      isExchange = trade || ethReceival;

      if (ethReceival) {
        if (isETH) {
          isSending = false;
          tokenAmount = ethReceival.events.find((evt) => evt.name === 'amount').value;
        } else {
          isSending = true;
          tokenAmount = trade.events.find((evt) => evt.name === 'actualSrcAmount').value;
        }
      } else if (trade) {
        if (isETH) {
          isSending = (tx.input.srcToken && tx.input.srcToken.symbol === 'ETH');
        } else {
          isSending = (tx.input.srcToken && tx.input.srcToken.symbol === this.props.token.symbol);
        }
        const key = isSending ? 'actualSrcAmount' : 'actualDestAmount';
        tokenAmount = trade.events.find((evt) => evt.name === key).value;
      } else {
        isSending = tx.from === this.props.token.ownerAddress;
        tokenAmount = tx.input.amount;
      }
    } else {
      isSending = tx.from === this.props.token.ownerAddress;
      tokenAmount = tx.value;
    }
    const amount = (new BigNumber(tokenAmount)).div(Math.pow(10, this.props.token.decimals)).toFixed(6);
    const dest = this.formatAddress(isSending ? tx.to : tx.from);
    const time = Moment(Number(`${tx.timestamp}000`)).fromNow();
    // const time = Moment(Number(`${tx.timeStamp}000`)).fromNow();
    const direction = isSending ? '-' : '+';

    return (
      <ListItem
        roundAvatar
        leftIcon={{
          name: isExchange ? 'exchange' : (isSending ? 'arrow-top-right' : 'arrow-bottom-right'),
          type: isExchange ? 'font-awesome' : 'material-community',
          color: 'rgb(89,139,246)',
        }}
        leftIconUnderlayColor="red"
        key={tx.hash}
        title={dest}
        subtitle={time}
        rightTitle={`${direction}${amount}`}
        rightTitleStyle={{ fontWeight: 'bold', color: isSending ? 'red' : 'green' }}
        onPress={() => {
          this.props.onListItemPress && this.props.onListItemPress(tx.hash);
        }}
      />);
  }

  render() {
    return (
      <List>
        {this.props.pendingTxHash &&
          <ListItem
            leftIcon={{
              name: 'lan-pending',
              type: 'material-community',
              color: 'rgb(89,139,246)',
            }}
            hideChevron={true}
            key={-1}
            title={'PENDING'}
            subtitle={'wait for a minute...'}
          />
        }
        <ListView
          onEndReached={this._toEnd.bind(this)}
          onEndReachedThreshold={10}
          dataSource={this.state.txList}
          renderRow={this.renderLine.bind(this)}
          renderFooter={this._renderFooter.bind(this)}
          enableEmptySections={true}
        />
        {/* {this.props.txs.map((tx, i) => this.renderLine(tx, i))} */}
      </List>
    );
  }
}
