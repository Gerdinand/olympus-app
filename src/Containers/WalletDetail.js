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
  FormInput
} from 'react-native-elements';

import QRCode from 'react-native-qrcode';
import { EthereumService, WalletService } from '../Services';

const txs = [
  // {
  //   from: '0x7d401a85103a43a41e74a8E2314909333C8a4099',
  //   to: '0x277A304D7C69e03898120567937245d1406D5F36',
  //   when: '2017/12/04 12:08',
  //   amount: 21.2,
  //   operation: 'send'
  // },
  // {
  //   from: '0x7d401a85103a43a41e74a8E2314909333C8a4099',
  //   to: '0x5185129f2872C6ef729a3B5C89CC41e997036115',
  //   when: '2017/12/03 3:32',
  //   amount: 4.79,
  //   operation: 'send'
  // },
  // {
  //   from: '0xC07cAACC6414A676a1929916Ad1AbDa5E9D3d0eD',
  //   to: '0x7d401a85103a43a41e74a8E2314909333C8a4099',
  //   when: '2017/11/27 20:41',
  //   amount: 174,
  //   operation: 'receive'
  // }
];

class WalletDetailView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sendModalVisible: false,
      receiveModalVisible: false,
      exchangeModalVisible: false,
      txs: txs,
      token: this.props.navigation.state.params.token,
      address: this.props.navigation.state.params.address,
      sendAddress: "0x82A739B9c0da0462ddb0e087521693ab1aE48D32",  // test only
      sendAmount: 0.1,
      password: null,
      sourceAmount: 0.0,
      destAmount: 0.0,
    };
  }

  static navigationOptions = ({navigation}) => ({
    title: "Asset",
    tabBar: {
      visible: false,
    }
  });

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
    return (
      <ScrollView style={{backgroundColor: 'white'}}>
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
                multiline
                inputStyle={{width: '100%'}}
                placeholder="0x0abc..."
                // onChangeText={(text) => this.state.sendAddress = text}
                value={this.state.sendAddress}
              />
              <FormLabel>Amount</FormLabel>
              <FormInput
                inputStyle={{width: '100%'}}
                placeholder="0"
                keyboardType={"numeric"}
                onChangeText={(text) => this.state.sendAmount = Number(text)}
              />
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
                  title={"Send"}
                  buttonStyle={styles.modalSendButton}
                  raised
                  onPress={async () => {
                    console.log("send action");
                    var isValidate = true;

                    // TODO: address validation
                    // TODO: amount validation
                    // TODO: passwrd validation

                    console.log("validate end");
                    if (isValidate) {
                      // generate tx
                      const privateKey = await WalletService.getInstance().getSeed(this.state.password);
                      const token = this.state.token;
                      var tx = null;
                      if (token.symbol != "ETH") {
                        // token from, to, value, decimals, contractAddress, gasLimit
                        tx = await EthereumService.getInstance().generateTokenTx(
                          this.state.address,
                          this.state.sendAddress,
                          this.state.sendAmount,
                          token.decimals,
                          token.address,
                          "40000"
                        );
                      } else {
                        tx = await EthereumService.getInstance().generateTx(
                          this.state.address,
                          this.state.sendAddress,
                          this.state.sendAmount,
                          "40000"
                        );
                      }

                      // sign tx
                      tx.sign(privateKey);

                      // send tx
                      await EthereumService.getInstance().sendTx(tx);

                      this.setState({sendModalVisible: false, sendAmount: 0, password: null});
                    }
                  }}
                />
                <Button buttonStyle={styles.modalCloseButton}
                  title={"Cancel"}
                  onPress={() => {this.setState({sendModalVisible: false, sendAmount: 0, password: null})}}
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
                    value={this.state.address}
                    size={200}
                    bgColor='black'
                    fgColor='white'
                  />
                </View>
              </View>
              <Text style={{color: "black", fontSize: 12, textAlign: 'center', marginTop: 15}}>{this.state.address}</Text>
              <View style={{
                padding: 10,
              }}>
                <Button
                  title={"Copy address"}
                  buttonStyle={styles.modalSendButton}
                  raised
                  onPress={() => {
                    Clipboard.setString(this.state.address)
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
                  onPress={async () => {
                    console.log("trade action");
                    var isValidate = true;

                    // TODO: address validation
                    // TODO: amount validation
                    // TODO: passwrd validation

                    console.log("validate end");
                    if (isValidate) {
                      // generate tx
                      const privateKey = await WalletService.getInstance().getSeed(this.state.password);
                      const token = this.state.token;
                      var tx = null;
                      if (this.state.exchangeType == "BID") {
                        // token from, to, value, decimals, contractAddress, gasLimit
                        tx = await EthereumService.getInstance().generateTradeFromEtherToTokenTx(
                          this.state.sourceAmount,
                          this.state.token.address,
                          this.state.address
                        );
                      } else {
                        tx = await EthereumService.getInstance().generateTradeFromTokenToEtherTx(
                          this.state.token.address,
                          this.state.sourceAmount,
                          this.state.address
                        );
                      }

                      // sign tx
                      tx.sign(privateKey);

                      // send tx
                      await EthereumService.getInstance().sendTx(tx);
                    }
                    this.setState({exchangeModalVisible: false, password: null, sourceAmount: 0.0, destAmount: 0.0})
                  }}
                />
                <Button buttonStyle={styles.modalCloseButton}
                  title="Cancel"
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
        {
          txs.map((l, i) => (
            <ListItem
              hideChevron={true}
              key={i}
              title={(l.operation == "receive") ? l.from : l.to}
              subtitle={l.when}
              rightTitle={l.amount.toString()}
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
