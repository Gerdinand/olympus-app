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
} from 'react-native';
import {
  Card,
  ButtonGroup,
  Button,
  FormLabel,
  FormInput,
  FormValidationMessage,
  Slider,
} from 'react-native-elements';
import { Text, Row } from '../Controls';
import Icon from 'react-native-vector-icons/Ionicons';
import ActionSheet from 'react-native-actionsheet';
import QRCodeScanner from 'react-native-qrcode-scanner';
import BigNumber from 'bignumber.js';
import { EventRegister } from 'react-native-event-listeners';
import { EthereumService, WalletService } from '../Services';
import { AddressModal, FormInputWithButton, TransactionList } from '../Components';
import Constants from '../Services/Constants';
import { toEtherNumber } from '../Utils';

const minBalance = 0.1;

interface InternalProps {
  navigation: any;
}

interface InternalState {
  value: number;
  amountPlaceHolder: string;
  gasFee: number;
  options: any[]; // TODO type?
  cancelButtonIndex: number;
  sendModalVisible: boolean;
  scanModalVisible: boolean;
  receiveModalVisible: boolean;
  exchangeModalVisible: boolean;
  txs: any[]; // TODO type?
  pendingTxHash: string | null;
  token: any;
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
  exchangeType: string;
  exchangeAmount: number; // TODO not in use?
  buttonGroupSelectedIndex: number; // TODO better name
}

export default class WalletDetailView extends React.Component<InternalProps, InternalState> {

  private scanner: any;
  private walletListener: any;
  public refs: {
    actionSheet: ActionSheet;
  };
  public static navigationOptions = (_navigationOptions: { navigation: any }) => ({
    title: 'Asset',
    tabBar: {
      visible: false,
    },
  })

  public constructor(props) {
    super(props);
    this.state = {
      value: Constants.MINIMUM_GAS_LIMIT,
      amountPlaceHolder: '0',
      gasFee: 0,
      options: [],
      cancelButtonIndex: 0,
      sendModalVisible: false,
      scanModalVisible: false,
      receiveModalVisible: false,
      exchangeModalVisible: false,
      txs: [],
      pendingTxHash: null,
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
      exchangeType: '', // TODO Correct?
      exchangeAmount: 0.0,
      buttonGroupSelectedIndex: 0,
    };
    this.scanner = null;

    // bind methods
    this.reloadTxs = this.reloadTxs.bind(this);
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
    await this.calcuateGasFee(this.state.value);
  }

  public componentWillUnmount() {
    EventRegister.removeEventListener(this.walletListener);
  }

  private async calcuateGasFee(gasLimit = Constants.MINIMUM_GAS_LIMIT) {
    const gasPrice = await EthereumService.getInstance().getGasPrice().catch(() => {
      //
    });
    const value = gasLimit * gasPrice * 2;
    this.setState({
      gasFee: Number(toEtherNumber(value)), // TODO is this NUmber() cast correct?
    });
    return toEtherNumber(value);
  }

  private reloadTxs(wallet) {
    const token = wallet.tokens.find((token) => token.address === this.state.token.address);
    const exchangeType = this.state.exchangeType;
    const ETHBalance = wallet.tokens.find((token) => token.address === Constants.ETHER_ADDRESS).balance;
    const txs = wallet.txs.filter((tx) => {
      if (this.state.token.address === Constants.ETHER_ADDRESS) {
        // ETH shows all trading history
        return tx.from === token.ownerAddress || tx.to === token.ownerAddress;
      }

      return (tx.from === token.ownerAddress || tx.to === token.ownerAddress)
        && (typeof tx.input === 'object')
        && ((tx.input.srcToken && tx.input.srcToken.symbol === token.symbol)
          || (tx.input.destToken && tx.input.destToken.symbol === token.symbol));
    });
    let balance;
    if (exchangeType === 'BID' || token.address === Constants.ETHER_ADDRESS) {
      balance = ETHBalance;
    } else {
      balance = token.balance;
    }
    this.setState({ token, txs, ETHBalance, balance, pendingTxHash: wallet.pendingTxHash });
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
    const _ = this;
    const ETHBalance = this.state.ETHBalance;
    const token = this.state.token;
    let balance;
    if (0 === buttonIndex) {
      balance = ETHBalance;
      _.setState({ exchangeType: 'BID', exchangeModalVisible: true, balance });
    } else if (1 === buttonIndex) {
      balance = token.balance;
      _.setState({ exchangeType: 'ASK', exchangeModalVisible: true, balance });
    }
  }

  // TODO not in use?
  public formatAddress(address) {
    return address.replace(/(0x.{6}).{29}/, '$1****');
  }

  // TODO is being called?
  public onTapMax() {
    const sendAmount = (this.getMaxBalance()).toString();
    this.setState({ sendAmount });
  }

  private getMaxBalance() {
    const token = this.state.token;
    const exchangeType = this.state.exchangeType;
    const fee = new BigNumber(this.state.gasFee.toPrecision(15));
    const balance = new BigNumber(this.state.ETHBalance.toPrecision(15));
    let sendAmount;
    if (token.address === Constants.ETHER_ADDRESS || exchangeType === 'BID') {
      sendAmount = balance.minus(fee).toNumber();
    } else {
      sendAmount = Number(token.balance);
    }
    return sendAmount.toFixed(6);
  }

  private onExchangeTextChanged(text: string) {
    // TODO this is behaving as number and as text
    let sourceAmount: any = text;
    let destAmount: any = 0;

    if (Number(text)) {
      sourceAmount = Number(text);
      const maxBalance = this.getMaxBalance();
      if (sourceAmount > maxBalance) { sourceAmount = maxBalance; }
      if (this.state.exchangeType === 'BID') {
        destAmount = sourceAmount * this.state.token.price;
      } else {
        destAmount = sourceAmount * (1.0 / this.state.token.price);
      }

      sourceAmount = sourceAmount.toString();
      destAmount = destAmount.toFixed(6);
    }
    this.setState({ sourceAmount, destAmount });
  }

  private onExchangeButtonPress() {
    let sourceAmount = this.getMaxBalance();
    let destAmount: any = 0; // TODO This is a text and string
    if (Number(sourceAmount)) {
      sourceAmount = Number(sourceAmount);
      if (this.state.exchangeType === 'BID') {
        destAmount = sourceAmount * this.state.token.price;
      } else {
        destAmount = sourceAmount * (1.0 / this.state.token.price);
      }

      destAmount = destAmount.toFixed(6);
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
    if (!sourceAmount || this.state.exchangeType === 'BID' && sourceAmount > etherBlance ||
      this.state.exchangeType === 'ASK' && sourceAmount > this.state.token.balance) {
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
      let tx = null;
      if (this.state.exchangeType === 'BID') {
        // eth -> token
        tx = await EthereumService.getInstance().generateTradeFromEtherToTokenTx(
          sourceAmount,
          this.state.token.address,
          this.state.token.ownerAddress,
          (this.state.value * 2).toString(),
        );
      } else {
        // token -> eth
        // send approve tx
        const approveTx = await EthereumService.getInstance().generateApproveTokenTx(
          this.state.token.address,
          sourceAmount,
          this.state.token.ownerAddress,
          (this.state.value * 2).toString(),
        );
        approveTx.sign(privateKey);
        await EthereumService.getInstance().sendTx(approveTx);

        tx = await EthereumService.getInstance().generateTradeFromTokenToEtherTx(
          this.state.token.address,
          sourceAmount,
          this.state.token.ownerAddress,
          (this.state.value * 2).toString(),
        );
      }

      // sign tx
      tx.sign(privateKey);

      try {
        // send tx
        const hash = await EthereumService.getInstance().sendTx(tx);
        this.setState({
          exchangeModalVisible: false,
          exchangeType: '',
          password: null,
          sourceAmount: '',
          destAmount: 0.0,
          tradeAmountErrorMessage: null,
          tradePasswordErrorMessage: null,
          pendingTxHash: hash,
        });
      } catch (e) {
        // console.error(e);
        Alert.alert(
          'Failed to trade',
          e.message,
          [
            { text: 'Cancel', style: 'cancel' },
          ],
        );
      }
    }

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
      let tx = null;
      if (token.symbol !== 'ETH') {
        // token from, to, value, decimals, contractAddress, gasLimit
        tx = await EthereumService.getInstance().generateTokenTx(
          token.ownerAddress,
          this.state.sendAddress,
          sendAmount,
          token.decimals,
          token.address,
          (this.state.value * 2).toString(),
        );
      } else {
        tx = await EthereumService.getInstance().generateTx(
          token.ownerAddress,
          this.state.sendAddress,
          sendAmount,
          (this.state.value * 2).toString(),
        );
      }

      // sign tx
      tx.sign(privateKey);

      // send tx
      try {
        const hash = await EthereumService.getInstance().sendTx(tx);
        this.setState({
          sendModalVisible: false,
          sendAmount: '',
          password: null,
          sendAddress: null,
          sendAddressErrorMessage: null,
          sendAmountErrorMessage: null,
          sendPasswordErrorMessage: null,
          pendingTxHash: hash,
        });
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

  private onActionsButtonPress(selectedIndex: number) {
    this.setState({ buttonGroupSelectedIndex: selectedIndex });
    if (0 === selectedIndex) {
      if (this.state.ETHBalance < minBalance) {
        return DeviceEventEmitter.emit('showToast', 'your balance in ETH is insufficient');
      } else if (this.state.token.balance <= 0) {
        return DeviceEventEmitter.emit('showToast', `your balance in ${this.state.token.symbol} is insufficient`);
      } else {
        this.onSend();
      }
    } else if (1 === selectedIndex) {
      this.onReceive();
    } else if (2 === selectedIndex) {
      if (this.state.ETHBalance < minBalance) {
        return DeviceEventEmitter.emit('showToast', 'your balance in ETH is insufficient');
      } else {
        this.onExchange();
      }
    }
  }

  public render() {

    return (
      <ScrollView style={{ backgroundColor: 'white' }} keyboardShouldPersistTaps={'handled'}>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.scanModalVisible}
          onShow={() => { this.setState({ amountPlaceHolder: '0' }); }}
          onRequestClose={() => { this.setState({ scanModalVisible: false, amountPlaceHolder: '0' }); }}
        >
          <View style={styles.modelContainer}>
            <Card title="SCAN">
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ flex: 1, maxWidth: 300, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <QRCodeScanner
                    ref={(node) => { this.scanner = node; }}
                    cameraStyle={{ width: 300, height: 300 }}
                    onRead={(e) => {
                      let data = e.data;
                      const reg = /^iban:/;
                      console.log('read: ', data);
                      if (EthereumService.getInstance().isValidateAddress(data)) {
                        console.log('is an address');
                        this.setState({ sendModalVisible: true, scanModalVisible: false, sendAddress: data });
                      } else if (reg.test(data)) {
                        data = `0x${(data.replace(reg, '') || '')}`;
                        console.log(data);
                        if (EthereumService.getInstance().isValidateAddress(data)) {
                          console.log('is an address');
                          this.setState({ sendModalVisible: true, scanModalVisible: false, sendAddress: data });
                        } else {
                          console.log('is not an address');
                          this.scanner.reactivate();
                        }
                      } else {
                        console.log('is not an address');
                        this.scanner.reactivate();
                      }
                    }}
                  />
                </View>
              </View>
              <Button
                buttonStyle={styles.modalCloseButton}
                title={'Cancel'}
                onPress={() => { this.setState({ sendModalVisible: true, scanModalVisible: false }); }}
                color={'#4A4A4A'}
              />
            </Card>
          </View>
        </Modal>
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
                value={this.state.sendAmount}
                placeholder={this.state.amountPlaceHolder}
                keyboardType={'numeric'}
                onChangeText={(text) => {
                  let sendAmount: any = text; // TODO number | text
                  if (Number(text)) {
                    sendAmount = Number(text);
                    const max = this.getMaxBalance();
                    if (sendAmount > max) { sendAmount = max; }
                    sendAmount = sendAmount.toString();
                  }
                  this.setState({ sendAmount });
                }}
                onFocus={() => {
                  this.setState({ amountPlaceHolder: `BAL: ${this.state.token.balance.toFixed(6)}` });
                }}
                onBlur={() => {
                  this.setState({ amountPlaceHolder: '0' });
                }}
                onButtonPress={() => {
                  const max = this.getMaxBalance();
                  this.setState({ sendAmount: max });
                }}
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
              <FormInput
                inputStyle={{ width: '100%' }}
                secureTextEntry={true}
                placeholder="To unlock the wallet"
                onChangeText={(password) => this.setState({ password })}
              />
              {
                this.state.sendPasswordErrorMessage &&
                <FormValidationMessage>
                  {this.state.sendPasswordErrorMessage}
                </FormValidationMessage>
              }
              <FormLabel>Gas Fee (est.): {this.state.gasFee.toFixed(8)} eth</FormLabel>
              <Row style={{ alignItems: 'stretch', justifyContent: 'center' }}>
                <Slider
                  style={{ width: '88%', marginTop: 12 }}
                  value={this.state.value}
                  step={1000}
                  minimumValue={0}
                  maximumValue={WalletService.getInstance().wallet.gasLimit}
                  minimumTrackTintColor="#5589FF"
                  thumbTintColor="#5589FF"
                  onValueChange={(value) => {
                    if (isNaN(value)) { return; }
                    this.calcuateGasFee(value);
                    this.setState({ value });
                  }}
                />
              </Row>
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

        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.exchangeModalVisible}
          onShow={() => { this.setState({ amountPlaceHolder: '0' }); }}
          onRequestClose={() => {
            this.setState({
              exchangeModalVisible: false,
              exchangeType: '', amountPlaceHolder: '0',
            });
          }}
        >
          <View style={styles.modelContainer}>
            <Card
              title={this.state.exchangeType === 'BID'
                ? `ETH -> ${this.state.token.symbol}` : `${this.state.token.symbol} -> ETH`}
            >
              <FormLabel>Exchange</FormLabel>
              <FormInputWithButton
                inputStyle={{ width: '100%' }}
                placeholder={this.state.amountPlaceHolder}
                keyboardType={'numeric'}
                value={this.state.sourceAmount}
                onChangeText={(text) => this.onExchangeTextChanged(text)}
                onFocus={() => {
                  const balance = this.state.exchangeType === 'BID' ? this.state.ETHBalance : this.state.token.balance;
                  this.setState({ amountPlaceHolder: `BAL: ${balance.toFixed(6)}` });
                }}
                onBlur={() => {
                  this.setState({ amountPlaceHolder: '0' });
                }}
                onButtonPress={() => this.onExchangeButtonPress()}
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
                Expected to receive {this.state.destAmount} {this.state.exchangeType === 'BID' ?
                  this.state.token.symbol : 'ETH'}
              </FormLabel>
              <FormLabel>Password</FormLabel>
              <FormInput
                inputStyle={{ width: '100%' }}
                secureTextEntry={true}
                placeholder="To unlock the wallet"
                onChangeText={(password) => this.setState({ password })}
              />
              {
                this.state.tradePasswordErrorMessage &&
                <FormValidationMessage>
                  {this.state.tradePasswordErrorMessage}
                </FormValidationMessage>
              }
              <FormLabel>Gas Fee (est.): {this.state.gasFee.toFixed(8)} eth</FormLabel>
              <Row style={{ alignItems: 'stretch', justifyContent: 'center' }}>
                <Slider
                  style={{ width: '88%', marginTop: 12 }}
                  value={this.state.value}
                  step={1000}
                  minimumValue={0}
                  maximumValue={WalletService.getInstance().wallet.gasLimit}
                  minimumTrackTintColor="#5589FF"
                  thumbTintColor="#5589FF"
                  onValueChange={(value) => {
                    if (isNaN(value)) { return; }
                    this.calcuateGasFee(value);
                    this.setState({ value });
                  }}
                />
              </Row>
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
                      exchangeModalVisible: false, exchangeType: '',
                      sourceAmount: '', password: null, exchangeAmount: 0.0,
                    });
                  }}
                  color={'#4A4A4A'}
                />
              </View>
            </Card>
          </View>
        </Modal>

        <Card>
          <Text style={styles.name}>{this.state.token.symbol}</Text>
          <Text style={styles.balance}>{this.state.token.balance.toFixed(6)}</Text>
        </Card>
        <View style={{ marginTop: 20 }}>
          <ButtonGroup
            textStyle={{ fontSize: 13 }}
            selectedIndex={this.state.buttonGroupSelectedIndex}
            onPress={(selectedIndex) => this.onActionsButtonPress(selectedIndex)}
            buttons={this.state.token.address === Constants.ETHER_ADDRESS ?
              ['Send', 'Receive'] : ['Send', 'Receive', 'Exchange']}
          />
        </View>
        <TransactionList
          token={this.state.token}
          pendingTxHash={this.state.pendingTxHash}
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
  inputButton: {
    color: 'rgb(85,137,255)',
    alignSelf: 'flex-end',
  },
});
