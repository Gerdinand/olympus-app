import '../../shim.js';

import React, { Component } from 'react';
import { Button, Text, TextInput, StyleSheet, View } from 'react-native';

import ethW from 'ethereumjs-wallet-react-native';
import Tx from 'ethereumjs-tx';

import Web3 from 'web3';
import Constants from '../Services/Constants';
const web3 = new Web3();

class SendTx extends Component {
  constructor(props) {
    super(props);
    web3.setProvider(new web3.providers.HttpProvider('https://api.myetherapi.com/rop'));
    this.state = {
      privKey: 'f7c3f2f28e93bda1f16e5e716dcbcac525c72843b4d0415fc12d27ced1f52a7f',
      unlockAddr: '0xD68FFEd5a8757B83130FD18D0a5A814B04974cbC',
      addr: '0x82A739B9c0da0462ddb0e087521693ab1aE48D32',
      gasLimit: Constants.GAS_LIMIT.toString(),
      value: '0.01',
    };
  }
  unlockAddress() {
    const unlockAddr = `0x${ethW.fromPrivateKey(Buffer(this.state.privKey, 'hex')).getAddress().toString('hex')}`;
    this.setState({ unlockAddr });
  }
  genreateTx() {
    const nonce = web3.eth.getTransactionCount(this.state.unlockAddr);
    const gasPrice = web3.eth.getGasPrice();
    const _ = this;
    new Promise.all([nonce, gasPrice]).then((results) => {
      const rawTx = {
        nonce: web3.utils.numberToHex(results[0]),
        gasPrice: web3.utils.numberToHex(results[1]),
        gasLimit: web3.utils.numberToHex(_.state.gasLimit),
        to: _.state.addr,
        value: web3.utils.numberToHex(web3.utils.toWei(_.state.value, 'ether')),
        data: '',
        chainId: Constants.CHAIN_ID, // now we use ropsten, not kovan 42,
      };
      const tx = new Tx(rawTx);
      tx.sign(Buffer(_.state.privKey, 'hex'));
      const serializedTx = tx.serialize();
      web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`)
        .on('receipt', function (data) {
          console.log(data.transactionHash);
          if (data.transactionHash) {
            _.sendMsg = 'send success';
            _.tranHash = data.transactionHash;
          }
        });
      console.log(rawTx);
    });

  }
  render() {
    return (
      <View style={styles.container}>
        <Text>PrivateKey</Text>
        <TextInput
          style={{ height: 40 }}
          multiline={true}
          placeholder="Past privateKey here!"
          onChangeText={(privKey) => this.setState({ privKey })}
          value={this.state.privKey}
        />
        <Text selectable={true}>
          unlockAddress:{this.state.unlockAddr}
        </Text>
        <Button
          onPress={this.unlockAddress.bind(this)}
          title="Press Me to Unlock Address"
        />
        <Text>Receice Address</Text>
        <TextInput
          style={{ height: 40 }}
          placeholder="Past receive address here!"
          onChangeText={(addr) => this.setState({ addr })}
          value={this.state.addr}
        />

        <Text>value</Text>
        <TextInput
          style={{ height: 40 }}
          placeholder="Type transfer value here!"
          onChangeText={(value) => this.setState({ value })}
          defaultValue={this.state.value}
        />

        <Text>gal limit</Text>
        <TextInput
          style={{ height: 40 }}
          placeholder="Type gas limit here!"
          onChangeText={(gasLimit) => this.setState({ gasLimit })}
          value={this.state.gasLimit}
        />

        <Button
          onPress={this.genreateTx.bind(this)}
          title="Press Me Generate Tx"
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    //   // flex: 1,
    //   // justifyContent: 'center',
  },
});
module.exports = SendTx;
