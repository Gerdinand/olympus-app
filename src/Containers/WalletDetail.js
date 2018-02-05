'use strict';

import React, { Component } from 'react';
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
  List,
  ListItem,
  Card,
  ButtonGroup,
  Button,
  FormLabel,
  FormInput,
  FormValidationMessage,
  Slider,
} from 'react-native-elements';
import { Text, Row } from '../Controls';
// import Icon from 'react-native-vector-icons/Feather';
import ActionSheet from 'react-native-actionsheet';
import QRCodeScanner from 'react-native-qrcode-scanner';
import BigNumber from 'bignumber.js';
import Moment from 'moment';
import { EventRegister } from 'react-native-event-listeners';
import { EthereumService, WalletService } from '../Services';
import PropTypes from 'prop-types';
import { AddressModal } from '../Components';
import Constants from '../Services/Constants';
import { toEtherNumber } from '../Utils';

class WalletDetailView extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Asset',
    tabBar: {
      visible: false,
    },
  });

  constructor(props) {
    super(props);

    this.state = {
      value: 0.21,
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
      sendAddress: null, // "0xf085e5aC2e58dC354021Fd9E2eC1e0377f0DB839", //"0x82A739B9c0da0462ddb0e087521693ab1aE48D32",  // test only
      sendAmount: 0.0,
      password: null,
      sourceAmount: 0.0,
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
    };

    this.scanner = null;
    
    // bind methods
    this.reloadTxs = this.reloadTxs.bind(this);
  }

  componentWillMount() {
    this.walletListener = EventRegister.addEventListener('wallet.updated', this.reloadTxs);
    this.reloadTxs(WalletService.getInstance().wallet);
    this.setState({
      options: [`ETH -> ${this.state.token.symbol}`, `${this.state.token.symbol} -> ETH`, 'Cancel'],
      cancelButtonIndex: 2,
    });
  }

  async componentDidMount() {
    await this.calcuateGasFee();
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.walletListener);
  }

  async calcuateGasFee(gasLimit = Constants.GAS_LIMIT) {
    const gasPrice = await EthereumService.getInstance().getGasPrice().catch(() => { });
    this.setState({
      gasFee: toEtherNumber(gasLimit * gasPrice),
    });
  }

  reloadTxs(wallet) {
    const token = wallet.tokens.find((token) => token.address === this.state.token.address);
    const txs = wallet.txs.filter((tx) => {
      if (this.state.token.address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
        // ETH shows all trading history
        return tx.from === token.ownerAddress || tx.to === token.ownerAddress;
      }

      return (tx.from === token.ownerAddress || tx.to === token.ownerAddress)
        && (typeof tx.input === 'object')
        && (tx.input.srcToken.symbol === token.symbol || tx.input.destToken.symbol === token.symbol);
    });
    this.setState({ token, txs, pendingTxHash: wallet.pendingTxHash });
  }

  onSend() {
    console.log('send modal');
    this.setState({ sendModalVisible: true });
  }

  onReceive() {
    console.log('receive modal');
    this.setState({ receiveModalVisible: true });
  }

  onExchange() {
    if (this.state.token.address == '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
      return;
    }

    this.ActionSheet.show();
  }

  handlePress(buttonIndex) {
    let _ = this;
    if (0 == buttonIndex) {
      _.setState({ exchangeType: 'BID', exchangeModalVisible: true });
    } else if (1 == buttonIndex) {
      _.setState({ exchangeType: 'ASK', exchangeModalVisible: true });
    }
  }

  formatAddress(address) {
    return address.replace(/(0x.{6}).{29}/, '$1****');
  }

  render() {
    let _ = this;

    return (
      <ScrollView style={{ backgroundColor: 'white' }} keyboardShouldPersistTaps={'handled'}>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.scanModalVisible}
          onRequestClose={() => { this.setState({ scanModalVisible: false }); }}
        >
          <View style={styles.modelContainer}>
            <Card title="SCAN">
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ flex: 1, maxWidth: 300, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <QRCodeScanner
                    ref={(node) => { this.scanner = node; }}
                    cameraStyle={{ width: 300, height: 300 }}
                    onRead={(e) => {
                      const data = e.data;
                      console.log('read: ', data);
                      if (EthereumService.getInstance().isValidateAddress(data)) {
                        console.log('is an address');
                        this.setState({ sendModalVisible: true, scanModalVisible: false, sendAddress: data });
                      } else {
                        console.log('is not an address');
                        this.scanner.reactivate();
                      }
                    }}
                  />
                </View>
              </View>
              <Button buttonStyle={styles.modalCloseButton}
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
          onRequestClose={() => { this.setState({ sendModalVisible: false }); }}
        >
          <View style={styles.modelContainer}>
            <Card
              title={`SEND ${this.state.token.symbol}`}
            >
              <Image source={{ uri: this.state.token.icon }} style={styles.icon} />
              <FormLabel>To</FormLabel>
              <FormInput
                multiline
                inputStyle={{ width: '100%' }}
                value={this.state.sendAddress}
                onChangeText={(sendAddress) => this.setState({ sendAddress })}
              />
              {
                this.state.sendAddressErrorMessage &&
                <FormValidationMessage>
                  {this.state.sendAddressErrorMessage}
                </FormValidationMessage>
              }
              <FormLabel>Amount</FormLabel>
              <FormInput
                inputStyle={{ width: '100%' }}
                placeholder={this.state.amountPlaceHolder}
                keyboardType={'numeric'}
                onChangeText={(text) => this.setState({ sendAmount: Number(text) })}
                onFocus={() => {
                  this.setState({ amountPlaceHolder: `BAL: ${this.state.token.balance.toFixed(4)}` });
                }}
                onBlur={() => {
                  this.setState({ amountPlaceHolder: '0' });
                }}
              />
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
              <FormLabel>Gas Fee: {this.state.gasFee.toFixed(8)} eth</FormLabel>
              <Row style={{ alignItems: 'stretch', justifyContent: 'center' }}>
                <Slider
                  style={{ width: '88%', marginTop: 12 }}
                  value={this.state.value}
                  step={0.01}
                  minimumTrackTintColor="#5589FF"
                  thumbTintColor="#5589FF"
                  onValueChange={(value) => {
                    if (isNaN(value)) { return; }
                    this.calcuateGasFee(value * 100000);
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
                  title={'Send'}
                  buttonStyle={styles.modalSendButton}
                  // raised={true}
                  disabled={this.state.sendButtonDisable}
                  onPress={async () => {
                    console.log('send action');
                    _.setState({
                      scanButtonDisable: true,
                      sendButtonDisable: true,
                      sendCancelButtonDisable: true,
                    });

                    let isValidate = true;

                    // address validation
                    if (!EthereumService.getInstance().isValidateAddress(_.state.sendAddress)) {
                      isValidate = false;
                      _.setState({ sendAddressErrorMessage: 'Invalid address' });
                    } else {
                      _.setState({ sendAddressErrorMessage: null });
                    }

                    // amount validation
                    if (_.state.token.balance < _.state.sendAmount || _.state.sendAmount == 0) {
                      isValidate = false;
                      _.setState({ sendAmountErrorMessage: 'Insufficient balance' });
                    } else {
                      _.setState({ sendAmountErrorMessage: null });
                    }

                    // password validation
                    const privateKey = await WalletService.getInstance().getSeed(_.state.password);
                    if (!privateKey) {
                      isValidate = false;
                      _.setState({ sendPasswordErrorMessage: 'Invalid password' });
                    } else {
                      _.setState({ sendPasswordErrorMessage: null });
                    }

                    console.log('validate end');
                    if (isValidate) {
                      const token = _.state.token;
                      let tx = null;
                      if (token.symbol != 'ETH') {
                        // token from, to, value, decimals, contractAddress, gasLimit
                        tx = await EthereumService.getInstance().generateTokenTx(
                          token.ownerAddress,
                          _.state.sendAddress,
                          _.state.sendAmount,
                          token.decimals,
                          token.address,
                          '40000'
                        );
                      } else {
                        tx = await EthereumService.getInstance().generateTx(
                          token.ownerAddress,
                          _.state.sendAddress,
                          _.state.sendAmount,
                          '40000'
                        );
                      }

                      // sign tx
                      tx.sign(privateKey);

                      // send tx
                      try {
                        await EthereumService.getInstance().sendTx(tx);
                        _.setState({
                          sendModalVisible: false,
                          sendAmount: 0,
                          password: null,
                          sendAddress: null,
                          sendAddressErrorMessage: null,
                          sendAmountErrorMessage: null,
                          sendPasswordErrorMessage: null,
                        });
                      } catch (e) {
                        // console.error(e);
                        Alert.alert(
                          'Failed to send',
                          e.message,
                          [
                            { text: 'Cancel', style: 'cancel' },
                          ]
                        );
                      }
                    }

                    _.setState({
                      scanButtonDisable: false,
                      sendButtonDisable: false,
                      sendCancelButtonDisable: false,
                    });
                  }}
                />
                <Button buttonStyle={styles.modalCloseButton}
                  title={'Scan'}
                  disabled={this.state.scanButtonDisable}
                  onPress={() => {
                    this.setState({ sendModalVisible: false, scanModalVisible: true, sendAddress: null });
                    if (this.scanner) {
                      this.scanner.reactivate();
                    }
                  }}
                  color={'#4A4A4A'}
                />
                <Button buttonStyle={styles.modalCloseButton}
                  title={'Cancel'}
                  disabled={this.state.sendCancelButtonDisable}
                  onPress={() => { this.setState({ sendModalVisible: false, sendAmount: 0, password: null, sendAddress: null }); }}
                  color={'#4A4A4A'}
                />
              </View>
            </Card>
          </View>
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
          onRequestClose={() => { this.setState({ exchangeModalVisible: false }); }}
        >
          <View style={styles.modelContainer}>
            <Card title={this.state.exchangeType == 'BID' ? `ETH -> ${this.state.token.symbol}` : `${this.state.token.symbol} -> ETH`}>
              <FormLabel>Exchange</FormLabel>
              <FormInput
                inputStyle={{ width: '100%' }}
                placeholder="Amount to exchange"
                keyboardType={'numeric'}
                onChangeText={(text) => {
                  const sourceAmount = Number(text);
                  let destAmount = 0;
                  if (this.state.exchangeType == 'BID') {
                    destAmount = sourceAmount * this.state.token.price;
                  } else {
                    destAmount = sourceAmount * (1.0 / this.state.token.price);
                  }

                  destAmount = destAmount.toFixed(4);

                  this.setState({ sourceAmount, destAmount });
                }}
              />
              {
                this.state.tradeAmountErrorMessage &&
                <FormValidationMessage>
                  {this.state.tradeAmountErrorMessage}
                </FormValidationMessage>
              }
              <FormLabel>Expected to receive {this.state.destAmount} {this.state.exchangeType == 'BID' ? this.state.token.symbol : 'ETH'}</FormLabel>
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
              <View style={{
                padding: 10,
              }}
              >
                <Button
                  title={'Trade'}
                  buttonStyle={styles.modalSendButton}
                  raised
                  disabled={this.state.tradeButtonDisable}
                  onPress={async () => {
                    console.log('trade action');
                    _.setState({
                      tradeButtonDisable: true,
                      tradeCancelButtonDisable: true,
                    });

                    const etherBlance = WalletService.getInstance().wallet.balance;

                    let isValidate = true;

                    // amount validation
                    if (_.state.exchangeType == 'BID' && _.state.sourceAmount > etherBlance ||
                      _.state.exchangeType == 'ASK' && _.state.sourceAmount > _.state.token.balance) {
                      isValidate = false;
                      _.setState({ tradeAmountErrorMessage: 'Not enough to trade' });
                    }

                    // password validation
                    const privateKey = await WalletService.getInstance().getSeed(_.state.password);
                    if (privateKey == null) {
                      isValidate = false;
                      _.setState({ tradePasswordErrorMessage: 'Wrong password' });
                    }

                    console.log('validate end');
                    if (isValidate) {
                      // generate tx
                      // const token = _.state.token;
                      let tx = null;
                      if (_.state.exchangeType == 'BID') {
                        // eth -> token
                        tx = await EthereumService.getInstance().generateTradeFromEtherToTokenTx(
                          _.state.sourceAmount,
                          _.state.token.address,
                          _.state.token.ownerAddress
                        );
                      } else {
                        // token -> eth
                        // send approve tx
                        let approveTx = await EthereumService.getInstance().generateApproveTokenTx(
                          _.state.token.address,
                          _.state.sourceAmount,
                          _.state.token.ownerAddress
                        );
                        approveTx.sign(privateKey);
                        await EthereumService.getInstance().sendTx(approveTx);

                        tx = await EthereumService.getInstance().generateTradeFromTokenToEtherTx(
                          _.state.token.address,
                          _.state.sourceAmount,
                          _.state.token.ownerAddress
                        );
                      }

                      // sign tx
                      tx.sign(privateKey);

                      try {
                        // send tx
                        await EthereumService.getInstance().sendTx(tx);
                        _.setState({
                          exchangeModalVisible: false,
                          password: null,
                          sourceAmount: 0.0,
                          destAmount: 0.0,
                          tradeAmountErrorMessage: null,
                          tradePasswordErrorMessage: null,
                        });
                      } catch (e) {
                        // console.error(e);
                        Alert.alert(
                          'Failed to trade',
                          e.message,
                          [
                            { text: 'Cancel', style: 'cancel' },
                          ]
                        );
                      }
                    }

                    _.setState({
                      tradeButtonDisable: false,
                      tradeCancelButtonDisable: false,
                    });
                  }}
                />
                <Button buttonStyle={styles.modalCloseButton}
                  title="Cancel"
                  disabled={this.state.tradeCancelButtonDisable}
                  onPress={() => {
                    this.setState({ exchangeModalVisible: false, password: null, exchangeAmount: 0.0 });
                  }}
                  color={'#4A4A4A'}
                />
              </View>
            </Card>
          </View>
        </Modal>

        <Card style={{ backgroundColor: 'transparent' }}>
          <Text style={styles.name}>{this.state.token.symbol}</Text>
          <Text style={styles.balance}>{this.state.token.balance.toFixed(6)}</Text>
        </Card>
        <View style={{ marginTop: 20 }}>
          <ButtonGroup
            textStyle={{ fontSize: 13 }}
            onPress={(selectedIndex) => {
              if (0 == selectedIndex) {
                this.onSend();
              } else if (1 == selectedIndex) {
                this.onReceive();
              } else if (2 == selectedIndex) {
                this.onExchange();
              }
            }}
            buttons={this.state.token.address == '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' ? ['Send', 'Receive'] : ['Send', 'Receive', 'Exchange']}
          />
        </View>
        <List>
          {this.state.pendingTxHash &&
            <ListItem
              hideChevron={true}
              key={-1}
              title={'PENDING'}
              subtitle={'wait for a minute'}
            />
          }
          {/* {
            <FlatList
              data={this.state.txs}
              keyExtractor={(x, i) => i}
              renderItem={({ item }) => {
                const isSending = item.from == this.state.token.ownerAddress;
                return (
                  <Row style={styles.itemContainer}>
                    <Icon
                      name={isSending ? 'corner-up-left' : 'corner-down-right'}
                      size={24}
                      color={'gray'}
                    />
                    <View>
                      <Text style={styles.truncatedText}>
                        {isSending ? item.to : item.from}
                      </Text>
                      <Text>
                        {Moment(Number(`${item.timeStamp}000`)).fromNow()}
                      </Text>
                    </View>
                    <View>
                      <Text>
                        {(isSending ? '-' : '') +
                          (new BigNumber(item.value)).div(1000000000000000000).toString()}
                      </Text>
                      <Text>
                        {`${(new BigNumber(item.cumulativeGasUsed)).div(1000000).toString()}ETH`}
                      </Text>
                    </View>
                  </Row>);
              }}
            />
          } */}
          {
            this.state.txs.map((l, i) => {
              let isSending;
              let amount;
              let tokenAmount;
              debugger;

              if (l.logs && l.logs.length > 0) {
                console.log(l);
                const ethReceival = l.logs.find((log) => log.name === 'EtherReceival');
                const trade = l.logs.find((log) => log.name === 'Trade');
                const isETH = this.state.token.symbol === 'ETH';

                if (ethReceival) {
                  if (isETH) {
                    isSending = false;
                    tokenAmount = ethReceival.events.find((evt) => evt.name === 'amount').value;
                  } else {
                    isSending = true;
                    tokenAmount = trade.events.find((evt) => evt.name === 'actualSrcAmount').value;
                  }
                } else if (trade) {
                  let key;
                  if (isETH) {
                    isSending = l.input.srcToken.symbol === 'ETH';
                  } else {
                    isSending = l.input.srcToken.symbol === this.state.token.symbol;
                  }
                  key = isSending ? 'actualSrcAmount' : 'actualDestAmount';
                  tokenAmount = trade.events.find((evt) => evt.name === key).value;
                }
              } else {
                isSending = l.from === this.state.token.ownerAddress;
                tokenAmount = l.value;
              }
              amount = (new BigNumber(tokenAmount)).div(Math.pow(10, this.state.token.decimals)).toFixed(6);
              const dest = this.formatAddress(isSending ? l.to : l.from);
              const time = Moment(Number(`${l.timeStamp}000`)).fromNow();
              let direction = isSending ? '-' : '+';

              return (
                <ListItem
                  roundAvatar
                  leftIcon={{
                    name: isSending ? 'arrow-top-right' : 'arrow-bottom-right',
                    type: 'material-community',
                    color: 'rgb(89,139,246)',
                  }}
                  leftIconUnderlayColor="red"
                  key={i}
                  title={dest}
                  subtitle={time}
                  rightTitle={`${direction}${amount} ${this.state.token.symbol}`}
                  rightTitleStyle={{ fontWeight: 'bold', color: isSending ? 'red' : 'green' }}
                  onPress={() => {
                    Linking.openURL(`https://ropsten.etherscan.io/tx/${l.hash}`);
                  }}
                />);
            })
          }
        </List>
        <ActionSheet
          ref={o => this.ActionSheet = o}
          options={this.state.options}
          cancelButtonIndex={this.state.cancelButtonIndex}
          onPress={this.handlePress.bind(this)}
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
    marginTop: 30,
    backgroundColor: '#5589FF',
  },
  modalCloseButton: {
    marginTop: 15,
    backgroundColor: 'transparent',
  },
  icon: {
    width: 24,
    height: 24,
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default WalletDetailView;
