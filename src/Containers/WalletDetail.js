'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Modal,
  Clipboard,
  ActionSheetIOS
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
} from 'react-native-elements';

import QRCodeScanner from 'react-native-qrcode-scanner';
import BigNumber from "bignumber.js";
import Moment from 'moment';
import { EventRegister } from 'react-native-event-listeners';
import QRCode from 'react-native-qrcode';
import { EthereumService, WalletService } from '../Services';

class WalletDetailView extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
    };

    this.sendAddressInput = null;
    this.scanner = null;

    // bind methods
    this.reloadTxs = this.reloadTxs.bind(this);
  }

  static navigationOptions = ({navigation}) => ({
    title: "Asset",
    tabBar: {
      visible: false,
    }
  });

  reloadTxs(wallet) {
    for (var i = 0; i < wallet.tokens.length; i++) {
      const token = wallet.tokens[i];
      if (token.address == this.state.token.address) {
        var txs = [];
        for (var j = 0; j < wallet.txs.length; j++) {
          const tx = wallet.txs[j];
          if (tx.from == token.ownerAddress || tx.to == token.ownerAddress) {
            txs.push(tx);
          }
        }
        this.setState({ token: token, txs: txs, pendingTxHash: wallet.pendingTxHash });
        break;
      }
    }
  }

  componentWillMount() {
    var _ = this;
    this.walletListener = EventRegister.addEventListener("wallet.updated", (wallet) =>  {
      for (var i = 0; i < wallet.tokens.length; i++) {
        const token = wallet.tokens[i];
        if (token.address == _.state.token.address) {
          var txs = [];
          for (var j = 0; j < wallet.txs.length; j++) {
            const tx = wallet.txs[j];
            if (tx.from == token.ownerAddress || tx.to == token.ownerAddress) {
              txs.push(tx);
            }
          }
          _.setState({ token: token, txs: txs, pendingTxHash: wallet.pendingTxHash });
          break;
        }
      }
    });

    this.reloadTxs(WalletService.getInstance().wallet);
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.walletListener);
  }

  onSend() {
    console.log("send modal");
    this.setState({sendModalVisible: true});
  }

  onReceive() {
    console.log("receive modal");
    this.setState({receiveModalVisible: true});
  }

  onExchange() {
    if (this.state.token.address == "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
      return ;
    }

    var _ = this;
    ActionSheetIOS.showActionSheetWithOptions({
      options: ["ETH -> " + _.state.token.symbol, _.state.token.symbol + " -> ETH", "Cancel"],
      cancelButtonIndex: 2,
    }, (buttonIndex) => {
      if (0 == buttonIndex) {
        _.setState({ exchangeType: "BID", exchangeModalVisible: true });
      } else if (1 == buttonIndex) {
        _.setState({ exchangeType: "ASK", exchangeModalVisible: true });
      }
    });
  }

  render() {
    var _ = this;

    return (
      <ScrollView style={{backgroundColor: 'white'}}>
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.scanModalVisible}
          onRequestClose={() => {this.setState({scanModalVisible: false})}}
        >
          <View style={styles.modelContainer}>
            <Card title="SCAN">
              <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center'}}>
                <View style={{flex:1, maxWidth: 300, flexDirection:'row', justifyContent:'space-between'}}>
                  <QRCodeScanner
                    ref={(node) => { this.scanner = node }}
                    cameraStyle={{width: 300, height: 300}}
                    onRead={(e) => {
                      const data = e.data;
                      console.log("read: ", data);
                      if (EthereumService.getInstance().isValidateAddress(data)) {
                        console.log("is an address");
                        this.sendAddressInput.text = data;
                        this.setState({sendModalVisible: true, scanModalVisible: false, sendAddress: data})
                      } else {
                        console.log("is not an address");
                        this.scanner.reactivate();
                      }
                    }}
                  />
                </View>
              </View>
              <Button buttonStyle={styles.modalCloseButton}
                title={"Cancel"}
                onPress={() => {this.setState({sendModalVisible: true, scanModalVisible: false})}}
                color={'#4A4A4A'}
              />
            </Card>
          </View>
        </Modal>
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.sendModalVisible}
          onRequestClose={() => {this.setState({sendModalVisible: false})}}
          >
          <View style={styles.modelContainer}>
            <Card title="SEND">
              <FormLabel>To</FormLabel>
              <FormInput
                ref={(ref) => this.sendAddressInput = ref}
                multiline
                inputStyle={{width: '100%'}}
                onChangeText={(text) => this.state.sendAddress = text}
              />
              {
                this.state.sendAddressErrorMessage &&
                <FormValidationMessage>
                  {this.state.sendAddressErrorMessage}
                </FormValidationMessage>
              }
              <FormLabel>Amount</FormLabel>
              <FormInput
                inputStyle={{width: '100%'}}
                placeholder="0"
                keyboardType={"numeric"}
                onChangeText={(text) => this.state.sendAmount = Number(text)}
              />
              {
                this.state.sendAmountErrorMessage &&
                <FormValidationMessage>
                  {this.state.sendAmountErrorMessage}
                </FormValidationMessage>
              }
              <FormLabel>Password</FormLabel>
              <FormInput
                inputStyle={{width: '100%'}}
                placeholder="To unlock the wallet"
                onChangeText={(text) => this.state.password = text}
              />
              {
                this.state.sendPasswordErrorMessage &&
                <FormValidationMessage>
                  {this.state.sendPasswordErrorMessage}
                </FormValidationMessage>
              }
              <View style={{
                padding: 10,
              }}>
                <Button
                  title={"Send"}
                  buttonStyle={styles.modalSendButton}
                  raised
                  disabled={this.state.sendButtonDisable}
                  onPress={async () => {
                    console.log("send action");
                    _.setState({
                      scanButtonDisable: true,
                      sendButtonDisable: true,
                      sendCancelButtonDisable: true,
                    });

                    var isValidate = true;

                    // address validation
                    if (!EthereumService.getInstance().isValidateAddress(_.state.sendAddress)) {
                      isValidate = false;
                      _.setState({sendAddressErrorMessage: "Invalidate address"});
                    } else {
                      _.setState({sendAddressErrorMessage: null});
                    }

                    // amount validation
                    if (_.state.token.balance < _.state.sendAmount || _.state.sendAmount == 0) {
                      isValidate = false;
                      _.setState({sendAmountErrorMessage: "Wrong amount"});
                    } else {
                      _.setState({sendAmountErrorMessage: null});
                    }

                    // password validation
                    const privateKey = await WalletService.getInstance().getSeed(_.state.password);
                    if (!privateKey) {
                      isValidate = false;
                      _.setState({sendPasswordErrorMessage: "Wrong password"});
                    } else {
                      _.setState({sendPasswordErrorMessage: null});
                    }

                    console.log("validate end");
                    if (isValidate) {
                      const token = _s.state.token;
                      var tx = null;
                      if (token.symbol != "ETH") {
                        // token from, to, value, decimals, contractAddress, gasLimit
                        tx = await EthereumService.getInstance().generateTokenTx(
                          token.ownerAddress,
                          _.state.sendAddress,
                          _.state.sendAmount,
                          token.decimals,
                          token.address,
                          "40000"
                        );
                      } else {
                        tx = await EthereumService.getInstance().generateTx(
                          token.ownerAddress,
                          _.state.sendAddress,
                          _.state.sendAmount,
                          "40000"
                        );
                      }

                      // sign tx
                      tx.sign(privateKey);

                      // send tx
                      await EthereumService.getInstance().sendTx(tx);

                      _.setState({sendModalVisible: false,
                        sendAmount: 0,
                        password: null,
                        sendAddress: null,
                        sendAddressErrorMessage: null,
                        sendAmountErrorMessage: null,
                        sendPasswordErrorMessage: null,
                      });
                    }

                    _.setState({
                      scanButtonDisable: false,
                      sendButtonDisable: false,
                      sendCancelButtonDisable: false,
                    });
                  }}
                />
                <Button buttonStyle={styles.modalCloseButton}
                  title={"Scan"}
                  disabled={this.state.scanButtonDisable}
                  onPress={() => {
                    this.setState({sendModalVisible: false, scanModalVisible: true, sendAddress: null})
                    if (this.scanner) {
                        this.scanner.reactivate();
                    }
                  }}
                  color={'#4A4A4A'}
                />
                <Button buttonStyle={styles.modalCloseButton}
                  title={"Cancel"}
                  disabled={this.state.sendCancelButtonDisable}
                  onPress={() => {this.setState({sendModalVisible: false, sendAmount: 0, password: null, sendAddress: null})}}
                  color={'#4A4A4A'}
                />
              </View>
            </Card>
          </View>
        </Modal>

        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.receiveModalVisible}
          onRequestClose={() => {this.setState({receiveModalVisible: false})}}
          >
          <View style={styles.modelContainer}>
            <Card title="RECEIVE">
              <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center'}}>
                <View style={{flex:1, maxWidth: 200, flexDirection:'row', justifyContent:'space-between'}}>
                  <QRCode
                    value={this.state.token.ownerAddress}
                    size={200}
                    bgColor='black'
                    fgColor='white'
                  />
                </View>
              </View>
              <Text style={{color: "black", fontSize: 12, textAlign: 'center', marginTop: 15}}>{this.state.token.ownerAddress}</Text>
              <View style={{
                padding: 10,
              }}>
                <Button
                  title={"Copy address"}
                  buttonStyle={styles.modalSendButton}
                  raised
                  onPress={() => {
                    Clipboard.setString(this.state.token.ownerAddress)
                    this.setState({receiveModalVisible: false});
                  }}
                />
                <Button buttonStyle={styles.modalCloseButton}
                  title={"Cancel"}
                  onPress={() => {this.setState({receiveModalVisible: false})}}
                  color={'#4A4A4A'}
                />
              </View>
            </Card>
          </View>
        </Modal>

        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.exchangeModalVisible}
          onRequestClose={() => {this.setState({exchangeModalVisible: false})}}
          >
          <View style={styles.modelContainer}>
            <Card title={this.state.exchangeType == "BID" ? "ETH -> " + this.state.token.symbol : this.state.token.symbol + " -> ETH"}>
              <FormLabel>Exchange</FormLabel>
              <FormInput
                inputStyle={{width: '100%'}}
                placeholder="Amount to exchange"
                keyboardType={"numeric"}
                onChangeText={(text) => {
                  const sourceAmount = Number(text);
                  var destAmount = 0;
                  if (this.state.exchangeType == "BID") {
                    destAmount = sourceAmount * this.state.token.price;
                  } else {
                    destAmount = sourceAmount * (1.0 / this.state.token.price);
                  }

                  destAmount = destAmount.toFixed(4);

                  this.setState({ sourceAmount: sourceAmount, destAmount : destAmount });
                }}
              />
              <FormLabel>Expected to receive {this.state.destAmount} {this.state.exchangeType == "BID" ? this.state.token.symbol : "ETH"}</FormLabel>
              <FormLabel>Password</FormLabel>
              <FormInput
                inputStyle={{width: '100%'}}
                placeholder="To unlock the wallet"
                onChangeText={(text) => this.state.password = text}
              />
              <View style={{
                padding: 10,
              }}>
                <Button
                  title={"Trade"}
                  buttonStyle={styles.modalSendButton}
                  raised
                  disabled={this.state.tradeButtonDisable}
                  onPress={async () => {
                    console.log("trade action");
                    _.setState({
                      tradeButtonDisable: true,
                      tradeCancelButtonDisable: true
                    });

                    var isValidate = true;

                    // amount validation
                    isValidate = isValidate & (_.state.sourceAmount <= _.state.token.balance);

                    // password validation
                    const privateKey = await WalletService.getInstance().getSeed(_.state.password);
                    isValidate = isValidate & (privateKey != null);

                    console.log("validate end");
                    if (isValidate) {
                      // generate tx
                      const token = _.state.token;
                      var tx = null;
                      if (_.state.exchangeType == "BID") {
                        // token from, to, value, decimals, contractAddress, gasLimit
                        tx = await EthereumService.getInstance().generateTradeFromEtherToTokenTx(
                          _.state.sourceAmount,
                          _.state.token.address,
                          _.state.token.ownerAddress
                        );
                      } else {
                        // send approve tx
                        var approveTx = await EthereumService.getInstance().generateApproveTokenTx(
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

                      // send tx
                      await EthereumService.getInstance().sendTx(tx);

                      _.setState({exchangeModalVisible: false, password: null, sourceAmount: 0.0, destAmount: 0.0})
                    }

                    _.setState({
                      tradeButtonDisable: false,
                      tradeCancelButtonDisable: false
                    });
                  }}
                />
                <Button buttonStyle={styles.modalCloseButton}
                  title="Cancel"
                  disabled={this.state.tradeCancelButtonDisable}
                  onPress={() => {
                    this.setState({exchangeModalVisible: false, password: null, exchangeAmount: 0.0})
                  }}
                  color={'#4A4A4A'}
                />
              </View>
            </Card>
          </View>
        </Modal>

        <Card style={{backgroundColor: 'transparent'}}>
          <Text style={styles.name}>{this.state.token.symbol}</Text>
          <Text style={styles.balance}>{this.state.token.balance.toFixed(5)}</Text>
        </Card>
        <View style={{ marginTop: 20 }}>
          <ButtonGroup
            textStyle={{ fontSize: 13 }}
            onPress= {(selectedIndex) => {
              if (0 == selectedIndex) {
                this.onSend();
              } else if (1 == selectedIndex) {
                this.onReceive();
              } else if (2 == selectedIndex) {
                this.onExchange();
              }
            }}
            buttons={this.state.token.address == "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" ? ["Send", "Receive"] : ["Send", "Receive", "Exchange"]}
          />
        </View>
        <List>
        {this.state.pendingTxHash &&
          <ListItem
            hideChevron={true}
            key={-1}
            title={"PENDING"}
            subtitle={"wait for a minute"}
          />
        }
        {
          this.state.txs.map((l, i) => (
            <ListItem
              hideChevron={true}
              key={i}
              title={(l.from == this.state.token.ownerAddress) ? "SENT" : "RECEIVED"}
              subtitle={(l.from == this.state.token.ownerAddress) ? l.to : l.from}
              rightTitle={(new BigNumber(l.value)).div(1000000000000000000).toString()}
              rightTitleStyle={{fontWeight:'bold', color:'#4A4A4A'}}
            />
          ))
        }
        </List>
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  modelContainer: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
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
  modalSendButton: {
    marginTop: 30,
    backgroundColor: '#5589FF',
  },
  modalCloseButton: {
    marginTop: 15,
    backgroundColor: 'transparent',
  },
});

export default WalletDetailView;
