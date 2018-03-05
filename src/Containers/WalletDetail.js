'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Modal,
  Alert,
  // Image,
  Linking,
  DeviceEventEmitter,
  Animated,
  // AppState,
  // Easing,
  // Image,
} from 'react-native';
import {
  Card,
  ButtonGroup,
  // Button,
  // FormLabel,
  // FormInput,
  // FormValidationMessage,
  // Slider,
} from 'react-native-elements';
import {
  Text,
  // Row,
} from '../Controls';
// import Icon from 'react-native-vector-icons/Ionicons';
import ActionSheet from 'react-native-actionsheet';
// import QRCodeScanner from 'react-native-qrcode-scanner';
// import Barcode from 'react-native-smart-barcode';
import BigNumber from 'bignumber.js';
import { EventRegister } from 'react-native-event-listeners';
import { EthereumService, WalletService } from '../Services';
import PropTypes from 'prop-types';
import {
  AddressModal,
  // FormInputWithButton,
  TransactionList,
  SendCard,
  ExchangeCard,
  ScanCode,
} from '../Components';
import Constants from '../Services/Constants';
import { toEtherNumber, gweiToWei } from '../Utils';

const minBalance = 0.1;
const defaultGasPrice = 9;

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
      value: defaultGasPrice,
      top: new Animated.Value(0),
      isShowScanBar: false,
      amountPlaceHolder: '0',
      gasFee: 0,
      maxGasPrice: 100,
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
      sendAddress: null, // "0xf085e5aC2e58dC354021Fd9E2eC1e0377f0DB839", //"0x82A739B9c0da0462ddb0e087521693ab1aE48D32",  // test only
      sendAmount: '',
      password: null,
      sourceAmount: '',
      destAmount: '0',
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
    // this._handleAppStateChange = this._handleAppStateChange.bind(this);
  }

  componentWillMount() {
    this.walletListener = EventRegister.addEventListener('wallet.updated', this.reloadTxs);
    this.reloadTxs(WalletService.getInstance().wallet);
    this.setState({
      options: [`ETH -> ${this.state.token.symbol}`, `${this.state.token.symbol} -> ETH`, 'Cancel'],
      cancelButtonIndex: 2,
      ETHBalance: WalletService.getInstance().wallet.balance,
    });
  }

  async componentDidMount() {
    // AppState.addEventListener('change', this._handleAppStateChange);
    // this.scannerLineMove();
    await this.calcuateGasFee(this.state.value);
  }

  componentWillUnmount() {
    // AppState.removeEventListener('change', this._handleAppStateChange);
    EventRegister.removeEventListener(this.walletListener);
    if (this.scanner) {
      // this.scanner.stopScan();
    }
  }

  // _handleAppStateChange(nextAppState) {
  //   const scanModalVisible = this.state.scanModalVisible;
  //   if (scanModalVisible && nextAppState == 'background') {
  //     if (this.scanner) {
  //       this.scanner.stopScan();
  //     }
  //     this.setState({ sendModalVisible: true, scanModalVisible: false });
  //   }
  // }

  // _renderScanBar() {
  //   if(!this.state.isShowScanBar) return;
  //   return <Image style={{resizeMode: 'contain', width: '100%'}} source={require('../../images/scanBar.png')} />;
  // }

  // scannerLineMove() {
  //   this.state.top.setValue(0);  //重置Rotate动画值为0
  //   Animated.timing(this.state.top, {
  //     toValue: 240,
  //     duration: 2000,
  //     // useNativeDriver: true,
  //     easing: Easing.linear,
  //   }).start(() => this.scannerLineMove());
  // }

  async calcuateGasFee(gasPrice) {
    const gasLimit = Constants.MINIMUM_GAS_LIMIT;
    gasPrice = Number(gweiToWei(gasPrice));
    // const gasPrice = await EthereumService.getInstance().getGasPrice().catch(() => { });
    const value = gasLimit * gasPrice * 2;
    this.setState({
      gasFee: toEtherNumber(value),
    });
    return toEtherNumber(value);
  }

  reloadTxs(wallet) {
    const token = wallet.tokens.find((token) => token.address === this.state.token.address);
    const exchangeType = this.state.exchangeType;
    const ETHBalance = wallet.tokens.find(token => token.address == Constants.ETHER_ADDRESS).balance;
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
    if (exchangeType == 'BID' || token.address == Constants.ETHER_ADDRESS) { balance = ETHBalance; }
    else { balance = token.balance; }
    this.setState({ token, txs, ETHBalance, balance, pendingTxHash: wallet.pendingTxHash });
  }

  onSend() {
    console.log('send modal');
    const balance = this.state.token.balance;
    this.setState({ sendModalVisible: true, balance });
  }

  onReceive() {
    console.log('receive modal');
    this.setState({ receiveModalVisible: true });
  }

  onExchange() {
    if (this.state.token.address === Constants.ETHER_ADDRESS) {
      return;
    }

    this.ActionSheet.show();
  }

  handlePress(buttonIndex) {
    const _ = this;
    const ETHBalance = this.state.ETHBalance;
    const token = this.state.token;
    let balance;
    if (0 == buttonIndex) {
      balance = ETHBalance;
      _.setState({ exchangeType: 'BID', exchangeModalVisible: true, balance });
    } else if (1 == buttonIndex) {
      balance = token.balance;
      _.setState({ exchangeType: 'ASK', exchangeModalVisible: true, balance });
    }
  }

  formatAddress(address) {
    return address.replace(/(0x.{6}).{29}/, '$1****');
  }

  onTapMax(e) {
    const sendAmount = (this.getMaxBalance()).toString();
    this.setState({ sendAmount });
  }

  getMaxBalance() {
    BigNumber.config({ ERRORS: false });

    const token = this.state.token;
    const exchangeType = this.state.exchangeType;
    const fee = new BigNumber(this.state.gasFee.toPrecision(15));
    const balance = new BigNumber(this.state.ETHBalance.toPrecision(15));
    let sendAmount;
    if (token.address == Constants.ETHER_ADDRESS || exchangeType == 'BID') {
      sendAmount = balance.minus(fee).toNumber();
    }
    else {
      sendAmount = Number(token.balance);
    }
    return sendAmount.toFixed(6);
  }

  checkIsNumber(text) {
    const positions = [];
    let pos = text.indexOf('.');
    while(pos>-1){
      positions.push(pos);
      pos = text.indexOf('.',pos+1);
    }
    if(positions.length<2)
      return false;
    return true;
  }

  render() {
    const _ = this;

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
            <ScanCode
              isShowScanBar={this.state.isShowScanBar}
              animateTime={2500}
              onCancelPress={() => {this.setState({ sendModalVisible: true, scanModalVisible: false, isShowScanBar:false });}}
              onScannerChange={(node) => { this.scanner = node; }}
              onScanRead={(e) => {
                let data = e.data;
                const reg = /^iban:/;
                console.log('read: ', data);
                this.setState({ isShowScanBar:false });
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
                    this.setState({ isShowScanBar: true });
                    this.scanner.reactivate();
                  }
                } else {
                  console.log('is not an address');
                  this.setState({ isShowScanBar: true });
                  this.scanner.reactivate();
                }
              }}
            />
            {/* <Card title="SCAN">
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ flex: 1, maxWidth: 300, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <QRCodeScanner
                    ref={(node) => { this.scanner = node; }}
                    cameraStyle={{ width: 300, height: 300 }}
                    showMarker={true}
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
                  <View style={{ position: 'absolute', left: '10%', right: '10%', top: '10%', bottom: 0 }}>
                    <Animated.View style={{ width: '100%',
                      height: 2,
                      // zIndex: 300,
                      //backgroundColor: 'rgb(93,255,93)',
                      transform: [{
                        // translateY: this.state.top.interpolate({
                        //   inputRange: [0, 1],
                        //   outputRange: [0, 240],
                        // }),
                        translateY: this.state.top,
                      }]}}
                    >
                      {this._renderScanBar()}
                    </Animated.View>
                  </View>
                  <Barcode
                    ref={(node) => { this.scanner = node; }}
                    style={{width: 300, height: 300 }}
                    onBarCodeRead={(e) => {
                      console.log(`e.nativeEvent.data.type = ${e.nativeEvent.data.type}, e.nativeEvent.data.code = ${e.nativeEvent.data.code}`);
                      const data = e.nativeEvent.data;
                      console.log('read: ', data);
                      this.scanner.stopScan();
                      if (data.type == 'QR_CODE') {
                        const reg = /^iban:/;
                        let address = data.code;
                        if (EthereumService.getInstance().isValidateAddress(address)) {
                          console.log('is an address');
                          this.setState({ sendModalVisible: true, scanModalVisible: false, sendAddress: address });
                        } else if (reg.test(address)) {
                          address = `0x${(address.replace(reg, '') || '')}`;
                          console.log(address);
                          if (EthereumService.getInstance().isValidateAddress(address)) {
                            console.log('is an address');
                            this.setState({ sendModalVisible: true, scanModalVisible: false, sendAddress: address });
                          } else {
                            console.log('is not an address');
                            this.scanner.startScan();
                          }
                        } else {
                          console.log('is not an address');
                          this.scanner.startScan();
                        }
                      } else {
                        this.scanner.startScan();
                      }
                    }}
                  />
                </View>
              </View>
              <Button buttonStyle={styles.modalCloseButton}
                title={'Cancel'}
                onPress={() => {
                  if (this.scanner) {
                    // this.scanner.stopScan();
                  }
                  this.setState({ sendModalVisible: true, scanModalVisible: false, isShowScanBar:false });
                }}
                color={'#4A4A4A'}
              />
            </Card> */}
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
            <SendCard
              cardTitle={`SEND ${this.state.token.symbol}`}
              iconPath={this.state.token.icon}
              sendAddress={this.state.sendAddress}
              sendAddressErrorMessage={this.state.sendAddressErrorMessage}
              sendAmount={this.state.sendAmount}
              sendAmountErrorMessage={this.state.sendAmountErrorMessage}
              sendPasswordErrorMessage={this.state.sendPasswordErrorMessage}
              gasFee={this.state.gasFee.toFixed(8)}
              maxGasPrice={this.state.maxGasPrice}
              gasValue={this.state.value}
              scanButtonDisable={this.state.scanButtonDisable}
              sendButtonDisable={this.state.sendButtonDisable}
              sendCancelButtonDisable={this.state.sendCancelButtonDisable}
              token={this.state.token}
              onToChange={(sendAddress) => this.setState({ sendAddress })}
              onToPress={() => {
                this.setState({ sendModalVisible: false, scanModalVisible: true, sendAddress: null, isShowScanBar:true });
                if (this.scanner) {
                  this.scanner.reactivate();
                  // this.scanner.startScan();
                }
              }}
              onAmountChange={(text) => {
                let sendAmount = text;
                if (text && text[text.length-1] != '.' && Number(text)) {
                  sendAmount = Number(text);
                  const max = _.getMaxBalance();
                  if (sendAmount > max) sendAmount = max;
                  sendAmount = sendAmount.toString();
                } else if (text && this.checkIsNumber(text)) {
                  sendAmount = this.state.sendAmount;
                }
                this.setState({ sendAmount });
              }}
              onAmountPress={(input) => {
                const max = this.getMaxBalance();
                this.setState({ sendAmount: max });
              }}
              onPasswordChange={(password) => this.setState({ password })}
              onGasValueChange={(value) => {
                if (isNaN(value)) { return; }
                this.calcuateGasFee(value);
                this.setState({ value });
              }}
              onCancelButtonPress={() => {
                this.calcuateGasFee(defaultGasPrice);
                this.setState({ sendModalVisible: false, sendAmount: '', password: null, sendAddress: null, value: Constants.MINIMUM_GAS_LIMIT});
              }}
              onSendButtonPress={async () => {
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
                const sendAmount = Number(_.state.sendAmount);

                // amount validation
                if (_.state.token.balance < sendAmount || sendAmount == 0 || !sendAmount) {
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
                      sendAmount,
                      token.decimals,
                      token.address,
                      (this.state.value * 2).toString(),
                    );
                  } else {
                    tx = await EthereumService.getInstance().generateTx(
                      token.ownerAddress,
                      _.state.sendAddress,
                      sendAmount,
                      (this.state.value * 2).toString(),
                    );
                  }

                  // sign tx
                  tx.sign(privateKey);

                  // send tx
                  try {
                    const hash = await EthereumService.getInstance().sendTx(tx);
                    _.setState({
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
            {/* <Card
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
                <Icon name="md-qr-scanner" size={24} style={styles.inputButton}
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
                  let sendAmount = text;
                  if (Number(text)) {
                    sendAmount = Number(text);
                    const max = _.getMaxBalance();
                    if (sendAmount > max) sendAmount = max;
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
                onButtonPress={(input) => {
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
                  //raised={true}
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
                    const sendAmount = Number(_.state.sendAmount);

                    // amount validation
                    if (_.state.token.balance < sendAmount || sendAmount == 0 || !sendAmount) {
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
                          sendAmount,
                          token.decimals,
                          token.address,
                          (this.state.value * 2).toString(),
                        );
                      } else {
                        tx = await EthereumService.getInstance().generateTx(
                          token.ownerAddress,
                          _.state.sendAddress,
                          sendAmount,
                          (this.state.value * 2).toString(),
                        );
                      }

                      // sign tx
                      tx.sign(privateKey);

                      // send tx
                      try {
                        const hash = await EthereumService.getInstance().sendTx(tx);
                        _.setState({
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
                  title={'Cancel'}
                  disabled={this.state.sendCancelButtonDisable}
                  onPress={() => { this.setState({ sendModalVisible: false, sendAmount: '', password: null, sendAddress: null }); }}
                  color={'#4A4A4A'}
                />
              </View>
            </Card> */}
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
          onRequestClose={() => { this.setState({ exchangeModalVisible: false, exchangeType: '', amountPlaceHolder: '0' }); }}
        >
          <View style={styles.modelContainer}>
            <ExchangeCard
              cardTitle={this.state.exchangeType == 'BID' ? `ETH -> ${this.state.token.symbol}` : `${this.state.token.symbol} -> ETH`}
              ETHBalance={this.state.ETHBalance}
              balance={this.state.token.balance}
              exchangeType={this.state.exchangeType}
              tradeAmountErrorMessage={this.state.tradeAmountErrorMessage}
              sourceAmount={this.state.sourceAmount}
              destAmount={this.state.destAmount}
              tradePasswordErrorMessage={this.state.tradePasswordErrorMessage}
              gasFee={this.state.gasFee.toFixed(8)}
              maxGasPrice={this.state.maxGasPrice}
              gasValue={this.state.value}
              tradeButtonDisable={this.state.tradeButtonDisable}
              tradeCancelButtonDisable={this.state.tradeCancelButtonDisable}
              token={this.state.token}
              onAmountChange={(text) => {
                let sourceAmount = text;
                let destAmount = '0';
                if (text && text[text.length-1] != '.' && Number(text)) {
                  sourceAmount = Number(text);
                  const maxBalance = this.getMaxBalance();
                  if (sourceAmount > maxBalance) sourceAmount = maxBalance;
                  if (this.state.exchangeType == 'BID') {
                    destAmount = sourceAmount * this.state.token.price;
                  } else {
                    destAmount = sourceAmount * (1.0 / this.state.token.price);
                  }

                  sourceAmount = sourceAmount.toString();
                  destAmount = destAmount.toFixed(6);
                } else if (text && this.checkIsNumber(text)) {
                  sourceAmount = this.state.sourceAmount;
                  destAmount = this.state.destAmount;
                }
                this.setState({ sourceAmount, destAmount });
              }}
              onAmountPress={(input) => {
                let sourceAmount = this.getMaxBalance();
                let destAmount = '0';
                if (Number(sourceAmount)) {
                  sourceAmount = Number(sourceAmount);
                  if (this.state.exchangeType == 'BID') {
                    destAmount = sourceAmount * this.state.token.price;
                  } else {
                    destAmount = sourceAmount * (1.0 / this.state.token.price);
                  }

                  destAmount = destAmount.toFixed(6);
                  sourceAmount = sourceAmount.toString();
                }
                this.setState({ sourceAmount, destAmount });
              }}
              onPasswordChange={(password) => this.setState({ password })}
              onGasValueChange={(value) => {
                if (isNaN(value)) { return; }
                this.calcuateGasFee(value);
                this.setState({ value });
              }}
              onCancelButtonPress={() => {
                this.calcuateGasFee(defaultGasPrice);
                this.setState({ exchangeModalVisible: false, exchangeType: '', sourceAmount: '', password: null, destAmount: '0', value: Constants.MINIMUM_GAS_LIMIT });
              }}
              onTradeButtonPress={async () => {
                console.log('trade action');
                _.setState({
                  tradeButtonDisable: true,
                  tradeCancelButtonDisable: true,
                });

                const etherBlance = WalletService.getInstance().wallet.balance;
                const sourceAmount = Number(_.state.sourceAmount);
                let isValidate = true;

                // amount validation
                if (!sourceAmount || _.state.exchangeType == 'BID' && sourceAmount > etherBlance ||
                  _.state.exchangeType == 'ASK' && sourceAmount > _.state.token.balance) {
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
                      sourceAmount,
                      _.state.token.address,
                      _.state.token.ownerAddress,
                      (this.state.value * 2).toString(),
                    );
                  } else {
                    // token -> eth
                    // send approve tx
                    const approveTx = await EthereumService.getInstance().generateApproveTokenTx(
                      _.state.token.address,
                      sourceAmount,
                      _.state.token.ownerAddress,
                      (this.state.value * 2).toString(),
                    );
                    approveTx.sign(privateKey);
                    await EthereumService.getInstance().sendTx(approveTx);

                    tx = await EthereumService.getInstance().generateTradeFromTokenToEtherTx(
                      _.state.token.address,
                      sourceAmount,
                      _.state.token.ownerAddress,
                      (this.state.value * 2).toString(),
                    );
                  }

                  // sign tx
                  tx.sign(privateKey);

                  try {
                    // send tx
                    const hash = await EthereumService.getInstance().sendTx(tx);
                    _.setState({
                      exchangeModalVisible: false,
                      exchangeType: '',
                      password: null,
                      sourceAmount: '',
                      destAmount: '0',
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
            {/* <Card title={this.state.exchangeType == 'BID' ? `ETH -> ${this.state.token.symbol}` : `${this.state.token.symbol} -> ETH`}>
              <FormLabel>Exchange</FormLabel>
              <FormInputWithButton
                inputStyle={{ width: '100%' }}
                placeholder={this.state.amountPlaceHolder}
                keyboardType={'numeric'}
                value={this.state.sourceAmount}
                onChangeText={(text) => {
                  let sourceAmount = text;
                  let destAmount = 0;
                  if (Number(text)) {
                    sourceAmount = Number(text);
                    const maxBalance = this.getMaxBalance();
                    if (sourceAmount > maxBalance) sourceAmount = maxBalance;
                    if (this.state.exchangeType == 'BID') {
                      destAmount = sourceAmount * this.state.token.price;
                    } else {
                      destAmount = sourceAmount * (1.0 / this.state.token.price);
                    }

                    sourceAmount = sourceAmount.toString();
                    destAmount = destAmount.toFixed(6);
                  }
                  this.setState({ sourceAmount, destAmount });
                }}
                onFocus={() => {
                  const balance = this.state.exchangeType == 'BID' ? this.state.ETHBalance : this.state.token.balance;
                  this.setState({ amountPlaceHolder: `BAL: ${balance.toFixed(6)}` });
                }}
                onBlur={() => {
                  this.setState({ amountPlaceHolder: '0' });
                }}
                onButtonPress={(input) => {
                  let sourceAmount = this.getMaxBalance();
                  let destAmount = 0;
                  if (Number(sourceAmount)) {
                    sourceAmount = Number(sourceAmount);
                    if (this.state.exchangeType == 'BID') {
                      destAmount = sourceAmount * this.state.token.price;
                    } else {
                      destAmount = sourceAmount * (1.0 / this.state.token.price);
                    }

                    destAmount = destAmount.toFixed(6);
                    sourceAmount = sourceAmount.toString();
                  }
                  this.setState({ sourceAmount, destAmount });
                }}
              >
                <Text style={styles.inputButton}> Max </Text>
              </FormInputWithButton>
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
              <View style={{
                padding: 10,
              }}
              >
                <Button
                  title={this.state.tradeButtonDisable ? 'Trading...' : 'Trade'}
                  buttonStyle={styles.modalSendButton}
                  disabled={this.state.tradeButtonDisable}
                  onPress={async () => {
                    console.log('trade action');
                    _.setState({
                      tradeButtonDisable: true,
                      tradeCancelButtonDisable: true,
                    });

                    const etherBlance = WalletService.getInstance().wallet.balance;
                    const sourceAmount = Number(_.state.sourceAmount);
                    let isValidate = true;

                    // amount validation
                    if (!sourceAmount || _.state.exchangeType == 'BID' && sourceAmount > etherBlance ||
                      _.state.exchangeType == 'ASK' && sourceAmount > _.state.token.balance) {
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
                          sourceAmount,
                          _.state.token.address,
                          _.state.token.ownerAddress,
                          (this.state.value * 2).toString(),
                        );
                      } else {
                        // token -> eth
                        // send approve tx
                        const approveTx = await EthereumService.getInstance().generateApproveTokenTx(
                          _.state.token.address,
                          sourceAmount,
                          _.state.token.ownerAddress,
                          (this.state.value * 2).toString(),
                        );
                        approveTx.sign(privateKey);
                        await EthereumService.getInstance().sendTx(approveTx);

                        tx = await EthereumService.getInstance().generateTradeFromTokenToEtherTx(
                          _.state.token.address,
                          sourceAmount,
                          _.state.token.ownerAddress,
                          (this.state.value * 2).toString(),
                        );
                      }

                      // sign tx
                      tx.sign(privateKey);

                      try {
                        // send tx
                        const hash = await EthereumService.getInstance().sendTx(tx);
                        _.setState({
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
                    this.setState({ exchangeModalVisible: false, exchangeType: '', sourceAmount: '', password: null, exchangeAmount: 0.0 });
                  }}
                  color={'#4A4A4A'}
                />
              </View>
            </Card> */}
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
                if (_.state.ETHBalance < minBalance) {
                  return DeviceEventEmitter.emit('showToast', 'your balance in ETH is insufficient');
                }
                else if (_.state.token.balance <= 0) {
                  return DeviceEventEmitter.emit('showToast', `your balance in ${_.state.token.symbol} is insufficient`);
                }
                else {
                  this.onSend();
                }
              } else if (1 == selectedIndex) {
                this.onReceive();
              } else if (2 == selectedIndex) {
                if (_.state.ETHBalance < minBalance) {
                  return DeviceEventEmitter.emit('showToast', 'your balance in ETH is insufficient');
                }
                else {
                  this.onExchange();
                }
              }
            }}
            buttons={this.state.token.address == Constants.ETHER_ADDRESS ? ['Send', 'Receive'] : ['Send', 'Receive', 'Exchange']}
          />
        </View>
        <TransactionList
          token={_.state.token}
          pendingTxHash={_.state.pendingTxHash}
          txs={_.state.txs}
          onListItemPress={(hash) => {
            Linking.openURL(`https://${Constants.CHAIN_NAME}.etherscan.io/tx/${hash}`);
          }}
        />
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
  /* modalSendButton: {
    // marginTop: 30,
    marginTop: 0,
    marginBottom: 15,
    backgroundColor: '#5589FF',
  }, */
  modalCloseButton: {
    marginTop: 0,
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
  /* icon: {
    width: 24,
    height: 24,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  inputButton: {
    color: 'rgb(85,137,255)',
    alignSelf: 'flex-end',
  }, */
});

export default WalletDetailView;
