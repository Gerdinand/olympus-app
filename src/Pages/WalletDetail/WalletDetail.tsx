'use strict';

import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Modal,
  Alert,
  Image,
  Linking,
  DeviceEventEmitter,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Button,
  FormLabel,
  FormValidationMessage,
  Slider,
} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import ActionSheet from 'react-native-actionsheet';
import BigNumber from 'bignumber.js';
import { EventRegister } from 'react-native-event-listeners';
import { EthereumService, WalletService } from '../../Services';
import * as Constants from '../../Constants';
import { toEtherNumber, restrictTextToNumber, filterStringLessThanNumber, maxDecimals } from '../../Utils';
import { Row, Text } from '../_shared/layout';
import { AddressModal } from './partials/AddressModal';
import { FormInputWithButton, PasswordInput } from '../_shared/inputs';
import { TransactionList } from './partials/TransactionList';
import { GAS_LIMIT, MAX_GAS_PRICE } from '../../Constants';
import { Wallet, Tx, Token } from '../../Models';
import { PendingTx } from '../../Models/Wallet';

const GAS_MIN_BALANCE = 0.01;
const GAS_MIN_ERROR = `You need at least ${GAS_MIN_BALANCE} ETH to afford transactions fee.`;
const DECIMALS = 8; // Display number 8 decimals

interface InternalProps {
  navigation: any;
}

enum ExchangeType {
  NONE = '',
  ETH_TO_TOKEN = 'BID',
  TOKEN_TO_ETH = 'ASK',
}
interface InternalState {
  gasPrice: number;
  amountPlaceHolder: string;
  gasFee: number;
  options: any[]; // TODO type?
  cancelButtonIndex: number;
  sendModalVisible: boolean;
  scanModalVisible: boolean;
  receiveModalVisible: boolean;
  exchangeModalVisible: boolean;
  txs: Tx[];
  pendingTxs: PendingTx[];
  token: Token;
  balance: number;
  ETHBalance: number;
  sendAddress: string | null;
  // "0xf085e5aC2e58dC354021Fd9E2eC1e0377f0DB839", //"0x82A739B9c0da0462ddb0e087521693ab1aE48D32",  // test only
  sendAmount: string;
  password: string | null;
  sourceAmount: string;
  destAmount: number;
  sendAddressErrorMessage: string | null;
  sendAmountErrorMessage: string | null;
  sendPasswordErrorMessage: string | null;
  scanButtonDisable: boolean;
  sendButtonDisable: boolean;
  sendCancelButtonDisable: boolean;
  tradeButtonDisable: boolean;
  tradeCancelButtonDisable: boolean;
  tradeAmountErrorMessage: string | null;
  tradePasswordErrorMessage: string | null;
  exchangeType: ExchangeType;
  exchangeAmount: number; // TODO not in use?
  buttonGroupSelectedIndex: number; // TODO better name
}

export default class WalletDetailView extends React.Component<InternalProps, InternalState> {

  private scanner: any;
  private walletListener: any;
  public refs: {
    actionSheet: ActionSheet;
  };

  public constructor(props) {
    super(props);
    this.state = {
      gasPrice: Constants.MINIMUN_GAS_PRICE,
      amountPlaceHolder: '0',
      gasFee: 0,
      options: [],
      cancelButtonIndex: 0,
      sendModalVisible: false,
      scanModalVisible: false,
      receiveModalVisible: false,
      exchangeModalVisible: false,
      txs: [],
      pendingTxs: [],
      token: this.props.navigation.state.params.token,
      balance: 0,
      ETHBalance: WalletService.getInstance().wallet.balance,
      // "0xf085e5aC2e58dC354021Fd9E2eC1e0377f0DB839", //"0x82A739B9c0da0462ddb0e087521693ab1aE48D32",  // test only
      sendAddress: null,
      sendAmount: '',
      password: null,
      sourceAmount: '',
      destAmount: 0.0,
      sendAddressErrorMessage: null,
      sendAmountErrorMessage: null,
      sendPasswordErrorMessage: null,
      scanButtonDisable: false,
      sendButtonDisable: false,
      sendCancelButtonDisable: false,
      tradeButtonDisable: false,
      tradeCancelButtonDisable: false,
      tradeAmountErrorMessage: null,
      tradePasswordErrorMessage: null,
      exchangeType: ExchangeType.NONE,
      exchangeAmount: 0.0,
      buttonGroupSelectedIndex: 0,
    };
    this.scanner = null;

  }

  public componentWillMount() {
    this.walletListener = EventRegister.addEventListener('wallet.updated', this.reloadTxs);
    this.reloadTxs(WalletService.getInstance().wallet);
    this.setState({
      options: [`ETH -> ${this.state.token.symbol}`, `${this.state.token.symbol} -> ETH`, 'Cancel'],
      cancelButtonIndex: 2,
      ETHBalance: WalletService.getInstance().wallet.balance,
    });
  }

  public async componentDidMount() {
    // Gas price from API is too big, get half
    const gasPrice = Number(await EthereumService.getInstance().getGasPrice());
    await this.calcuateGasFee(gasPrice);
    this.setState({ gasPrice });
  }

  public componentWillUnmount() {
    EventRegister.removeEventListener(this.walletListener);
  }

  private async calcuateGasFee(gasPrice: number) {
    try {

      const gasFee: BigNumber | 0 = toEtherNumber(GAS_LIMIT * gasPrice);
      this.setState({
        gasFee: Number(gasFee), // TODO is this NUmber() cast correct?
      });
      return Number(gasFee);
    } catch (e) {

      return 0;
    }
  }

  private reloadTxs(wallet: Wallet) {
    if (!this.state) { return; } // Async call after component unmounted

    const { token } = this.state;
    const exchangeType = this.state.exchangeType;
    const ETHBalance = wallet.tokens.find((token) => token.address === Constants.ETHER_ADDRESS).balance;
    const txs = wallet.txs.filter((tx) => {
      // In case of eth, there is no input object
      if (this.state.token.address === Constants.ETHER_ADDRESS) {
        return (tx.from === token.ownerAddress || tx.to === token.ownerAddress)
          && ((typeof tx.input === 'string') || (tx.input.destToken && tx.input.destToken.symbol === Constants.ETH));
      }

      return (tx.from === token.ownerAddress || tx.to === token.ownerAddress)
        && (typeof tx.input === 'object')
        && ((tx.input.srcToken && tx.input.srcToken.symbol === token.symbol)
          || (tx.input.destToken && tx.input.destToken.symbol === token.symbol));
    });
    console.log(txs);
    let balance;
    if (exchangeType === ExchangeType.ETH_TO_TOKEN || token.address === Constants.ETHER_ADDRESS) {
      balance = ETHBalance;
    } else {
      balance = token.balance;
    }
    this.setState({
      txs, ETHBalance, balance,
    });
    this.updatePendingTransactions(wallet);
  }

  private updatePendingTransactions(wallet: Wallet) {
    this.setState({
      pendingTxs: wallet.pendingTxs.filter((pendingTx) => pendingTx.token.symbol === this.state.token.symbol),
    });
  }
  private onSend() {
    console.log('send modal');
    const balance = this.state.token.balance;
    this.setState({ sendModalVisible: true, balance });
  }

  private onReceive() {
    console.log('receive modal');
    this.setState({ receiveModalVisible: true });
  }

  private onExchange() {
    if (this.state.token.address === Constants.ETHER_ADDRESS) {
      return;
    }

    this.refs.actionSheet.show();
  }

  private handlePress(buttonIndex) {
    const ETHBalance = this.state.ETHBalance;
    const token = this.state.token;
    let balance;
    if (0 === buttonIndex) {
      balance = ETHBalance;
      this.setState({ exchangeType: ExchangeType.ETH_TO_TOKEN, exchangeModalVisible: true, balance });
    } else if (1 === buttonIndex) {
      balance = token.balance;
      this.setState({ exchangeType: ExchangeType.TOKEN_TO_ETH, exchangeModalVisible: true, balance });
    }
  }
  public onTapMax() {

    const sendAmount = this.getMaxBalance(this.state.gasFee).toString();

    this.setState({ sendAmount });
  }

  private getMaxBalance(gasFee: number) {
    const token = this.state.token;
    const exchangeType = this.state.exchangeType;
    const balance = new BigNumber(this.state.ETHBalance.toPrecision(15));
    let sendAmount;
    if (token.address === Constants.ETHER_ADDRESS || exchangeType === ExchangeType.ETH_TO_TOKEN) {
      const fee = new BigNumber((gasFee + GAS_MIN_BALANCE).toPrecision(15));
      sendAmount = Math.max(0, balance.minus(fee).toNumber());
    } else {
      sendAmount = Number(token.balance);
    }
    return sendAmount.toFixed(DECIMALS);
  }

  private updateEchangeAmountText(rawText: string, maxBalance: number) {
    const { text, textCorrect } = restrictTextToNumber(rawText);
    // TODO this is behaving as number and as text
    const sourceAmount: string = filterStringLessThanNumber(text, maxBalance);
    const destAmount: any = 0;
    if (!textCorrect) {
      return this.setState({ sourceAmount, destAmount });
    }

    this.setState({ sourceAmount });
    if (Number(text)) {
      this.calculateDestinationAmount(Number(sourceAmount));
    }

  }

  private calculateDestinationAmount(sourceAmount: number) {
    let destAmount;

    if (this.state.exchangeType === ExchangeType.ETH_TO_TOKEN) {
      destAmount = sourceAmount * this.state.token.price;
    } else {
      destAmount = sourceAmount * (1.0 / this.state.token.price);
    }
    destAmount = destAmount.toFixed(DECIMALS);
    this.setState({ destAmount });
  }
  private onExchangePress() {
    let sourceAmount = this.getMaxBalance(this.state.gasFee);
    let destAmount: any = 0; // TODO This is a text and string
    if (Number(sourceAmount)) {
      sourceAmount = Number(sourceAmount);
      if (this.state.exchangeType === ExchangeType.ETH_TO_TOKEN) {
        destAmount = sourceAmount * this.state.token.price;
      } else {
        destAmount = sourceAmount * (1.0 / this.state.token.price);
      }

      destAmount = destAmount.toFixed(DECIMALS);
      sourceAmount = sourceAmount.toString();
    }
    this.setState({ sourceAmount, destAmount });
  }

  private async onTradePress() {
    console.log('trade action');
    this.setState({
      tradeButtonDisable: true,
      tradeCancelButtonDisable: true,
    });

    const etherBlance = WalletService.getInstance().wallet.balance;
    const sourceAmount = Number(this.state.sourceAmount);
    let isValidate = true;

    // amount validation
    if (!sourceAmount || this.state.exchangeType === ExchangeType.ETH_TO_TOKEN && sourceAmount > etherBlance ||
      this.state.exchangeType === ExchangeType.TOKEN_TO_ETH && sourceAmount > this.state.token.balance) {
      isValidate = false;
      this.setState({ tradeAmountErrorMessage: 'Not enough to trade' });
    }

    // password validation
    const privateKey = await WalletService.getInstance().getSeed(this.state.password);
    if (privateKey === null) {
      isValidate = false;
      this.setState({ tradePasswordErrorMessage: 'Wrong password' });
    }

    console.log('validate end');
    if (isValidate) {
      // generate tx
      // const token = _.state.token;
      let tx: Tx = null;
      if (this.state.exchangeType === ExchangeType.ETH_TO_TOKEN) {
        // eth -> token
        tx = await EthereumService.getInstance().generateTradeFromEtherToTokenTx(
          sourceAmount,
          this.state.token.address,
          this.state.token.ownerAddress,
          this.state.gasPrice.toString(),
        ) as Tx;
      } else {
        // token -> eth
        // send approve tx
        const approveTx = await EthereumService.getInstance().generateApproveTokenTx(
          this.state.token.address,
          sourceAmount,
          this.state.token.ownerAddress,
          this.state.gasPrice.toString(),
        ) as Tx;
        try {
          await EthereumService.getInstance().sendTx(approveTx, privateKey);

          tx = await EthereumService.getInstance().generateTradeFromTokenToEtherTx(
            this.state.token.address,
            sourceAmount,
            this.state.token.ownerAddress,
            this.state.gasPrice.toString(),
          ) as Tx;
        } catch (e) {
          Alert.alert('Failed to trade', e.message, [{ text: 'Cancel', style: 'cancel' }]);
          this.closeModal();
          return;
        }
      }

      try {
        // send tx
        await EthereumService.getInstance().sendTx(tx, privateKey);
        const wallet = WalletService.getInstance().wallet;
        wallet.pendingTxs.push({ tx, token: this.state.token });
        this.setState({
          exchangeModalVisible: false,
          exchangeType: ExchangeType.NONE,
          password: null,
          sourceAmount: '',
          destAmount: 0.0,
          tradeAmountErrorMessage: null,
          tradePasswordErrorMessage: null,
        });
        this.updatePendingTransactions(wallet);
      } catch (e) {
        Alert.alert('Failed to trade', e.message, [{ text: 'Cancel', style: 'cancel' }]);
        this.closeModal();
        return;
      }
    }

    this.closeModal();
  }

  private closeModal() {
    this.setState({
      tradeButtonDisable: false,
      tradeCancelButtonDisable: false,
    });
  }
  private async onSendPress() {
    console.log('send action');
    this.setState({
      scanButtonDisable: true,
      sendButtonDisable: true,
      sendCancelButtonDisable: true,
    });

    let isValidate = true;

    // address validation
    if (!EthereumService.getInstance().isValidateAddress(this.state.sendAddress)) {
      isValidate = false;
      this.setState({ sendAddressErrorMessage: 'Invalid address' });
    } else {
      this.setState({ sendAddressErrorMessage: null });
    }
    const sendAmount = Number(this.state.sendAmount);

    // amount validation
    if (this.state.token.balance < sendAmount || sendAmount === 0 || !sendAmount) {
      isValidate = false;
      this.setState({ sendAmountErrorMessage: 'Insufficient balance' });
    } else {
      this.setState({ sendAmountErrorMessage: null });
    }

    // password validation
    const privateKey = await WalletService.getInstance().getSeed(this.state.password);
    if (!privateKey) {
      isValidate = false;
      this.setState({ sendPasswordErrorMessage: 'Invalid password' });
    } else {
      this.setState({ sendPasswordErrorMessage: null });
    }

    console.log('validate end');
    if (isValidate) {
      const token = this.state.token;
      let tx: Tx = null;
      if (token.symbol !== 'ETH') {
        // token from, to, value, decimals, contractAddress, gasLimit
        tx = await EthereumService.getInstance().generateTokenTx(
          token.ownerAddress,
          this.state.sendAddress,
          sendAmount,
          token.decimals,
          token.address,
          this.state.gasPrice.toString(),
        ) as Tx;
      } else {
        tx = await EthereumService.getInstance().generateTx(
          token.ownerAddress,
          this.state.sendAddress,
          sendAmount,
          this.state.gasPrice.toString(),
        ) as Tx;
      }

      // send tx
      try {
        await EthereumService.getInstance().sendTx(tx, privateKey);
        const wallet = WalletService.getInstance().wallet;
        wallet.pendingTxs.push({ tx, token: this.state.token });

        this.setState({
          sendModalVisible: false,
          sendAmount: '',
          password: null,
          sendAddress: null,
          sendAddressErrorMessage: null,
          sendAmountErrorMessage: null,
          sendPasswordErrorMessage: null,
        });
        this.updatePendingTransactions(wallet);
      } catch (e) {
        // console.error(e);
        Alert.alert(
          'Failed to send',
          e.message,
          [
            { text: 'Cancel', style: 'cancel' },
          ],
        );
      }
    }

    this.setState({
      scanButtonDisable: false,
      sendButtonDisable: false,
      sendCancelButtonDisable: false,
    });
  }

  private updateSendAmountText(rawText: string, maxBalance: number) {
    const { text, textCorrect } = restrictTextToNumber(rawText);
    const sendAmount: any = filterStringLessThanNumber(text, maxBalance);
    console.log('aaaa ', text, sendAmount, textCorrect);
    // Filtering non digital and dot characters
    if (!textCorrect) {
      return this.setState({ sendAmount });
    }

    this.setState({ sendAmount });
  }

  private openSendModal() {
    if (this.state.ETHBalance < GAS_MIN_BALANCE) {
      return DeviceEventEmitter.emit('showToast', GAS_MIN_ERROR);
    } else if (this.state.token.balance <= 0) {
      return DeviceEventEmitter.emit('showToast', `Your balance in ${this.state.token.symbol} is insufficient.`);
    }
    this.onSend();
  }

  private openReceiveModal() {
    this.onReceive();
  }

  private openExchangeModal() {
    if (!Token.supportExchange(this.state.token)) {
      return DeviceEventEmitter.emit('showToast', `We currently doent support exchanges for this token.`);
    }
    if (this.state.ETHBalance < GAS_MIN_BALANCE) {
      return DeviceEventEmitter.emit('showToast', GAS_MIN_ERROR);
    }
    this.onExchange();
  }

  private async onFeeSliderUpdate(gasPrice) {

    if (isNaN(gasPrice)) { return; }
    const gasFee = await this.calcuateGasFee(gasPrice);
    // Only one of them require to update at the same time
    if (this.state.sendModalVisible) {
      this.updateSendAmountText(this.state.sendAmount, this.getMaxBalance(gasFee));
    }
    if (this.state.exchangeModalVisible) {
      this.updateEchangeAmountText(this.state.sourceAmount, this.getMaxBalance(gasFee));
    }
    this.setState({ gasPrice });
  }

  private renderGasFeeSlider() {
    return (
      <View>
        <FormLabel>Gas Fee (est.): {this.state.gasFee.toFixed(DECIMALS)} eth</FormLabel>
        <Row style={{ alignItems: 'stretch', justifyContent: 'center' }}>
          <Slider
            style={{ width: '88%', marginTop: 12 }}
            value={this.state.gasPrice}
            step={100000000}
            minimumValue={0}
            maximumValue={MAX_GAS_PRICE}
            minimumTrackTintColor="#5589FF"
            thumbTintColor="#5589FF"
            onSlidingComplete={(gasPrice) => this.onFeeSliderUpdate(gasPrice)}
          />
        </Row>
      </View>
    );
  }

  private renderSendModal() {
    return (

      <Modal
        animationType={'fade'}
        transparent={true}
        visible={this.state.sendModalVisible}
        onShow={() => { this.setState({ amountPlaceHolder: '0' }); }}
        onRequestClose={() => { this.setState({ sendModalVisible: false, amountPlaceHolder: '0' }); }}
      >
        <ScrollView style={styles.modelContainer} keyboardShouldPersistTaps={'handled'}>
          <Card
            title={`SEND ${this.state.token.symbol}`}
          >
            <Image source={{ uri: this.state.token.icon }} style={styles.icon} />
            <FormLabel>To</FormLabel>
            <FormInputWithButton
              multiline
              inputStyle={{ width: '100%', fontSize: 12 }}
              value={this.state.sendAddress}
              onChangeText={(sendAddress) => this.setState({ sendAddress })}
              onButtonPress={() => {
                this.setState({ sendModalVisible: false, scanModalVisible: true, sendAddress: null });
                if (this.scanner) {
                  this.scanner.reactivate();
                }
              }}
            >
              <Icon
                name="md-qr-scanner"
                size={24}
                style={styles.inputButton}
                disabled={this.state.scanButtonDisable}
              />
            </FormInputWithButton>
            {
              this.state.sendAddressErrorMessage &&
              <FormValidationMessage>
                {this.state.sendAddressErrorMessage}
              </FormValidationMessage>
            }
            <FormLabel>Amount</FormLabel>
            <FormInputWithButton
              inputStyle={{ width: '100%' }}
              value={maxDecimals(this.state.sendAmount, 8)}
              placeholder={this.state.amountPlaceHolder}
              keyboardType={'numeric'}
              onChangeText={(rawText) => this.updateSendAmountText(rawText, this.getMaxBalance(this.state.gasFee))}
              onFocus={() => {
                this.setState({ amountPlaceHolder: `BAL: ${this.state.token.balance.toFixed(DECIMALS)}` });
              }}
              onBlur={() => {
                this.setState({ amountPlaceHolder: '0' });
              }}
              onButtonPress={() => this.onTapMax()}
            >
              <Text style={styles.inputButton}> Max </Text>
            </FormInputWithButton>
            {
              this.state.sendAmountErrorMessage &&
              <FormValidationMessage>
                {this.state.sendAmountErrorMessage}
              </FormValidationMessage>
            }
            <FormLabel>Password</FormLabel>
            <PasswordInput
              onChangeText={(password) => this.setState({ password })}
              placeholder="To unlock the wallet"
            />
            {
              this.state.sendPasswordErrorMessage &&
              <FormValidationMessage>
                {this.state.sendPasswordErrorMessage}
              </FormValidationMessage>
            }
            {this.renderGasFeeSlider()}
            <View
              style={{
                padding: 10,
              }}
            >
              <Button
                title={this.state.sendButtonDisable ? 'Sending...' : 'Send'}
                buttonStyle={styles.modalSendButton}
                // raised={true}
                disabled={this.state.sendButtonDisable}
                onPress={async () => this.onSendPress()}
              />
              <Button
                buttonStyle={styles.modalCloseButton}
                title={'Cancel'}
                disabled={this.state.sendCancelButtonDisable}
                onPress={() => {
                  this.setState({ sendModalVisible: false, sendAmount: '', password: null, sendAddress: null });
                }}
                color={'#4A4A4A'}
              />
            </View>
          </Card>
        </ScrollView>
      </Modal>
    );
  }

  private renderExchangeModal() {
    return (
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={this.state.exchangeModalVisible}
        onShow={() => { this.setState({ amountPlaceHolder: '0' }); }}
        onRequestClose={() => {
          this.setState({
            exchangeModalVisible: false,
            exchangeType: ExchangeType.NONE,
            amountPlaceHolder: '0',
          });
        }}
      >
        <View style={styles.modelContainer}>
          <Card
            title={this.state.exchangeType === ExchangeType.ETH_TO_TOKEN
              ? `ETH -> ${this.state.token.symbol}` : `${this.state.token.symbol} -> ETH`}
          >
            <FormLabel>Exchange</FormLabel>
            <FormInputWithButton
              inputStyle={{ width: '100%' }}
              placeholder={this.state.amountPlaceHolder}
              keyboardType={'numeric'}
              // Never max than getMax Balance (if fee gas changes it must)
              value={maxDecimals(this.state.sourceAmount, 8)}
              onChangeText={(text) => this.updateEchangeAmountText(text, this.getMaxBalance(this.state.gasFee))}
              onFocus={() => {
                const balance = this.state.exchangeType === ExchangeType.ETH_TO_TOKEN
                  ? this.state.ETHBalance : this.state.token.balance;
                this.setState({ amountPlaceHolder: `BAL: ${balance.toFixed(DECIMALS)}` });
              }}
              onBlur={() => {
                this.setState({ amountPlaceHolder: '0' });
              }}
              onButtonPress={() => this.onExchangePress()}
            >
              <Text style={styles.inputButton}> Max </Text>
            </FormInputWithButton>
            {
              this.state.tradeAmountErrorMessage &&
              <FormValidationMessage>
                {this.state.tradeAmountErrorMessage}
              </FormValidationMessage>
            }
            <FormLabel>
              Expected to receive {this.state.destAmount} {this.state.exchangeType === ExchangeType.ETH_TO_TOKEN ?
                this.state.token.symbol : 'ETH'}
            </FormLabel>
            <FormLabel>Password</FormLabel>
            <PasswordInput
              onChangeText={(password) => this.setState({ password })}
              placeholder="To unlock the wallet"
            />
            {
              this.state.tradePasswordErrorMessage &&
              <FormValidationMessage>
                {this.state.tradePasswordErrorMessage}
              </FormValidationMessage>
            }
            {this.renderGasFeeSlider()}
            <View style={{ padding: 10 }}>
              <Button
                title={this.state.tradeButtonDisable ? 'Trading...' : 'Trade'}
                buttonStyle={styles.modalSendButton}
                disabled={this.state.tradeButtonDisable}
                onPress={async () => this.onTradePress()}
              />
              <Button
                buttonStyle={styles.modalCloseButton}
                title="Cancel"
                disabled={this.state.tradeCancelButtonDisable}
                onPress={() => {
                  this.setState({
                    exchangeModalVisible: false,
                    exchangeType: ExchangeType.NONE,
                    sourceAmount: '',
                    password: null, exchangeAmount: 0.0,
                  });
                }}
                color={'#4A4A4A'}
              />
            </View>
          </Card>
        </View>
      </Modal >
    );
  }
  public render() {
    const isETHScreen = Token.isETH(this.state.token);
    const isExchangeSupported = Token.supportExchange(this.state.token);
    return (
      <ScrollView style={{ backgroundColor: 'white' }} keyboardShouldPersistTaps={'handled'}>
        {this.renderSendModal()}
        {this.renderExchangeModal()}
        <AddressModal
          title={'RECEIVE'}
          visible={this.state.receiveModalVisible}
          address={this.state.token.ownerAddress}
          onClose={(message) => {
            this.setState({ receiveModalVisible: false });
            if (message) {
              DeviceEventEmitter.emit('showToast', message);
            }
          }}
        />
        <Card>
          <Text style={styles.name}>{this.state.token.symbol}</Text>
          <Text style={styles.balance}>{this.state.token.balance.toFixed(DECIMALS)}</Text>
        </Card>
        <View style={styles.buttonGroup}>
          <Row alignItems="center">
            <TouchableOpacity
              style={[styles.buttonTouchable, styles.lateralBorder]}
              onPress={() => this.openSendModal()}
            >
              <Text style={styles.buttonGroupText} >Send</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonTouchable, !isETHScreen ? styles.lateralBorder : {}]}
              onPress={() => this.openReceiveModal()}
            >
              <Text style={styles.buttonGroupText} >Receive</Text>
            </TouchableOpacity>
            {!isETHScreen &&
              <TouchableOpacity
                style={[styles.buttonTouchable]}
                disabled={!isExchangeSupported}
                onPress={() => this.openExchangeModal()}
              >
                <Text style={[styles.buttonGroupText, !isExchangeSupported ? styles.groupButtonDisabled : {}]} >
                  Exchange
                </Text>
              </TouchableOpacity>}
          </Row>
        </View>
        <TransactionList
          token={this.state.token}
          pendingTxs={this.state.pendingTxs}
          txs={this.state.txs}
          onListItemPress={(hash) => {
            Linking.openURL(`https://${Constants.CHAIN_NAME}.etherscan.io/tx/${hash}`);
          }}
        />
        <ActionSheet
          ref="actionSheet"
          options={this.state.options}
          cancelButtonIndex={this.state.cancelButtonIndex}
          onPress={(buttonIndex) => this.handlePress(buttonIndex)}
        />
      </ScrollView >
    );
  }
}

const styles = StyleSheet.create({
  name: {
    fontSize: 30,
    color: '#4A4A4A',
    marginLeft: 15,
  },
  address: {
    fontSize: 10,
    color: '#4A4A4A',
    marginLeft: 15,
    marginTop: 6,
  },
  tips: {
    fontSize: 10,
    color: '#4A4A4A',
    marginLeft: 15,
    marginTop: 40,
  },
  balance: {
    fontSize: 40,
    color: '#4A4A4A',
    marginLeft: 15,
    marginTop: 6,
  },
  itemContainer: {
    flexDirection: 'row',
    height: 60,
  },
  truncatedText: {
    maxWidth: 240,
  },
  modelContainer: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalSendButton: {
    // marginTop: 30,
    marginTop: 0,
    marginBottom: 15,
    backgroundColor: '#5589FF',
  },
  modalCloseButton: {
    marginTop: 0,
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
  icon: {
    width: 24,
    height: 24,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  buttonGroup: {
    marginLeft: 8,
    marginRight: 8,
    marginTop: 40,
    borderRadius: 8,
    borderColor: '#AAAAAA',
    backgroundColor: '#EFEFEF',
    borderWidth: 0.5,
  },
  buttonTouchable: {
    paddingVertical: 16,
    flex: 1,
  },
  lateralBorder: {
    borderRightWidth: 1,
    borderColor: '#AAAAAA',
  },
  buttonGroupText: {
    color: '#626262',
    textAlign: 'center',
    fontSize: 14,
  },
  groupButtonDisabled: {
    color: '#BBBBBB',
  },
  inputButton: {
    color: '#58f',
    alignSelf: 'flex-end',
  },
});
