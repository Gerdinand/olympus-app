'use strict';
import React, { PureComponent } from 'react';
import {
  List,
  ListItem,
} from 'react-native-elements';
import BigNumber from 'bignumber.js';
import Moment from 'moment';
import { Tx, Token } from '../../../Models';

interface InternalProps {
  onListItemPress: (txHash: string) => void;
  pendingTxHash: string;
  txs: Tx[];
  token: Token;
}
export class TransactionList extends PureComponent<InternalProps> {

  public constructor(props) {
    super(props);
  }

  private formatAddress(address: string) {
    return address.replace(/(0x.{6}).{29}/, '$1****');
  }

  private renderLine(tx) {
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
      tokenAmount = tx.input.amount;
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

  public render() {
    console.log('Transactions ', this.props.txs);
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
        {this.props.txs.map((tx) => this.renderLine(tx))}
      </List>
    );
  }
}
