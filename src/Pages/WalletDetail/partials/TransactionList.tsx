'use strict';
import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import {
  List,
  ListItem,
} from 'react-native-elements';
import BigNumber from 'bignumber.js';
import Moment from 'moment';
import { Tx, Token } from '../../../Models';
import { PendingTx } from '../../../Models/Wallet';

const TRADE = 'Trade';
const ETHER_RECEIVAL = 'EtherReceival';
const TOKEN_ETHER = 'ETH';
const INPUT_DECIMALS = 18; // Input decimals are always 18, independent than number of decimlas of token
const APPROVAL = 'Approval';
interface InternalProps {
  onListItemPress: (txHash: string) => void;
  pendingTxs: PendingTx[];
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

  private getTransactionInformation(tx: Tx): { isSending: boolean, tokenAmount: any, isExchange: boolean } {

    let isSending;
    let tokenAmount;
    // No logs case
    if (!tx.logs || tx.logs.length === 0) {
      return {
        isSending:
          typeof tx.input !== 'string' ?
            tx.input.srcToken.symbol === this.props.token.symbol : // In a case of a exchange that fails, with no logs
            tx.from === this.props.token.ownerAddress, // in last situation where there are no more hints
        tokenAmount: this.amountfromInputAmount(tx) || tx.value, // input amount is better, in few cases is undefined,
        isExchange: typeof tx.input !== 'string' ? true : false,
      };
    }

    const ethReceival = tx.logs.find((log) => log.name === ETHER_RECEIVAL);
    const trade = tx.logs.find((log) => log.name === TRADE);
    const isETH = this.props.token.symbol === TOKEN_ETHER;
    // Trading information
    if (ethReceival) {
      if (isETH) {
        isSending = false;
        tokenAmount = ethReceival.events.find((evt) => evt.name === 'amount').value;
      } else {
        isSending = true;
        tokenAmount = trade.events.find((evt) => evt.name === 'actualSrcAmount').value;
      }
      return { isSending, tokenAmount, isExchange: true };
    }
    // Second scenario is trade
    if (trade && typeof tx.input !== 'string') {
      isSending = isETH ?
        (tx.input.srcToken && tx.input.srcToken.symbol === TOKEN_ETHER) :
        (tx.input.srcToken && tx.input.srcToken.symbol === this.props.token.symbol);
      const eventAmountKey = isSending ? 'actualSrcAmount' : 'actualDestAmount';
      tokenAmount = trade.events.find((evt) => evt.name === eventAmountKey).value;
      return { isSending, tokenAmount, isExchange: true };
    }
    // Final case
    return {
      tokenAmount: this.amountfromInputAmount(tx),
      isSending: tx.from === this.props.token.ownerAddress,
      isExchange: false,
    };

  }

  // Nomrally decimals are just 18. In some cases like
  // POWR, are 6, but in input are still 18. So here we remove the 12 missing.
  private amountfromInputAmount(tx) {
    if (!tx.input.amount) { return undefined; }

    return new BigNumber(tx.input.amount).
      div(Math.pow(10, INPUT_DECIMALS - this.props.token.decimals)).toString();
  }

  private renderLine(tx: Tx) {

    // Ignore approval logs
    if (tx.logs && tx.logs.find((log) => log.name === APPROVAL)) {
      return null;
    }

    const { isSending, tokenAmount, isExchange } = this.getTransactionInformation(tx);
    const amount = (new BigNumber(tokenAmount)).div(Math.pow(10, this.props.token.decimals)).toFixed(6);

    const dest = this.formatAddress(isSending ? tx.to : tx.from);
    const time = Moment(Number(`${tx.timeStamp}000`)).fromNow();
    const direction = isSending ? '-' : '+';
    const avatar = isExchange ?
      require('../../../../images/exchange.png') // is transfer (recived or send)
      : isSending ? require('../../../../images/flow-out.png') // is send
        : require('../../../../images/flow-in.png'); // Is recived

    return (
      <ListItem
        avatar={avatar}
        avatarStyle={{ width: 20, height: 20 }}
        avatarOverlayContainerStyle={{ backgroundColor: 'rgba(0,0,0,0)' }}
        avatarContainerStyle={
          { backgroundColor: isSending ? '#FCD850' : '#5589FF', width: 36, height: 36, borderRadius: 18 }}
        leftIconUnderlayColor="red"
        key={tx.hash}
        title={dest}
        subtitle={time}
        rightTitle={tx.isError === '1' ? 'Error' : `${direction}${amount}`}
        rightTitleStyle={{ fontWeight: 'bold', color: isSending ? 'red' : 'green' }}
        onPress={() => {
          this.props.onListItemPress && this.props.onListItemPress(tx.hash);
        }}
        containerStyle={styles.itemContainer}
        titleStyle={styles.itemTitle}
        subtitleStyle={styles.subtitle}
      />);
  }

  public render() {
    return (
      <List>
        {this.props.pendingTxs.map((pendingTx) => (
          <ListItem
            leftIcon={{
              name: 'lan-pending',
              type: 'material-community',
              color: 'rgb(89,139,246)',
            }}
            hideChevron={true}
            key={'pending' + pendingTx.tx.hash}
            title={`PENDING ${this.formatAddress(pendingTx.tx.to)}`}
            subtitle={'wait for a minute...'}
            onPress={() => {
              this.props.onListItemPress && this.props.onListItemPress(pendingTx.tx.hash);
            }}
            containerStyle={styles.itemContainer}
            titleStyle={styles.itemTitle}
            subtitleStyle={styles.subtitle}
          />
        ),
        )
        }
        {this.props.txs.map((tx) => this.renderLine(tx))}
      </List>
    );
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#999',
  },
  itemTitle: {
    color: '#4A4A4A',
  },
  subtitle: {
    fontWeight: '300',
    color: '#999',
    fontSize: 12,
  },
});
