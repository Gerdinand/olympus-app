'use strict';
import React, { PureComponent } from 'react';
import {
  List,
  ListItem,
} from 'react-native-elements';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import Moment from 'moment';

export class TransactionList extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    onListItemPress: PropTypes.func,
    pendingTxHash: PropTypes.string,
    txs: PropTypes.array,
    token: PropTypes.object,
  };

  constructor(props) {
    super(props);
  }

  formatAddress(address) {
    return address.replace(/(0x.{6}).{29}/, '$1****');
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
          isSending = tx.input.srcToken.symbol === 'ETH';
        } else {
          isSending = tx.input.srcToken.symbol === this.props.token.symbol;
        }
        const key = isSending ? 'actualSrcAmount' : 'actualDestAmount';
        tokenAmount = trade.events.find((evt) => evt.name === key).value;
      }
    } else {
      isSending = tx.from === this.props.token.ownerAddress;
      tokenAmount = tx.value;
    }
    const amount = (new BigNumber(tokenAmount)).div(Math.pow(10, this.props.token.decimals)).toFixed(6);
    const dest = this.formatAddress(isSending ? tx.to : tx.from);
    const time = Moment(Number(`${tx.timeStamp}000`)).fromNow();
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
        {this.props.txs.map((tx, i) => this.renderLine(tx, i))}
      </List>
    );
  }
}
