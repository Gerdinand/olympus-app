import '../../shim.js';

import React from 'react';
import { Button, TextInput, StyleSheet, View } from 'react-native';
import { Text } from '../../_shared/layout/Text';

import ethW from 'ethereumjs-wallet-react-native';
import Tx from 'ethereumjs-tx';

import Web3 from 'web3';
import * as Constants from '../../../Constants';

const web3 = new Web3();

interface InternalState {
  privateKey: string;
  unlockAddress: string;
  address: string;
  gasLimit: string;
  value: string;
}

const DEFAULT_PRIVATE_KEY = 'f7c3f2f28e93bda1f16e5e716dcbcac525c72843b4d0415fc12d27ced1f52a7f';
const DEFAULT_UNLOCK_ADDRESS = '0xD68FFEd5a8757B83130FD18D0a5A814B04974cbC';
const DEFAULT_ADDRESS = '0x82A739B9c0da0462ddb0e087521693ab1aE48D32';

export default class SendTx extends React.Component<null, InternalState> {

  // Not used, may in future?
  public sendMessage = '';
  public tranHash = '';

  public constructor(props) {
    super(props);
    web3.setProvider(new web3.providers.HttpProvider('https://api.myetherapi.com/rop'));
    this.state = {
      privateKey: DEFAULT_PRIVATE_KEY,
      unlockAddress: DEFAULT_UNLOCK_ADDRESS,
      address: DEFAULT_ADDRESS,
      gasLimit: Constants.GAS_LIMIT.toString(),
      value: '0.01',
    };
  }
  private unlockAddress() {
    const unlockAddress = `0x${ethW.fromPrivateKey(
      new Buffer(this.state.privateKey, 'hex')).getAddress().toString('hex')}`
      ;
    this.setState({ unlockAddress });
  }
  private generateTx() {
    const nonce = web3.eth.getTransactionCount(this.state.unlockAddress);
    const gasPrice = web3.eth.getGasPrice();
    const _ = this;
    Promise.all([nonce, gasPrice]).then((results) => {
      const rawTx = {
        nonce: web3.utils.numberToHex(results[0]),
        gasPrice: web3.utils.numberToHex(results[1]),
        gasLimit: web3.utils.numberToHex(_.state.gasLimit),
        to: _.state.address,
        value: web3.utils.numberToHex(web3.utils.toWei(_.state.value, 'ether')),
        data: '',
        chainId: Constants.CHAIN_ID, // now we use ropsten, not kovan 42,
      };
      const tx = new Tx(rawTx);
      tx.sign(new Buffer(_.state.privateKey, 'hex'));
      const serializedTx = tx.serialize();
      web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`)
        .on('receipt', (data) => {
          console.log(data.transactionHash);
          if (data.transactionHash) {
            _.sendMessage = 'send success';
            _.tranHash = data.transactionHash;
          }
        });
      console.log(rawTx);
    });

  }
  public render() {
    return (
      <View style={styles.container}>
        <Text>PrivateKey</Text>
        <TextInput
          style={{ height: 40 }}
          multiline={true}
          placeholder="Past privateKey here!"
          onChangeText={(privateKey) => this.setState({ privateKey })}
          value={this.state.privateKey}
        />
        <Text selectable={true}>
          unlockAddress:{this.state.unlockAddress}
        </Text>
        <Button
          onPress={() => this.unlockAddress()}
          title="Press Me to Unlock Address"
        />
        <Text>Receice Address</Text>
        <TextInput
          style={{ height: 40 }}
          placeholder="Past receive address here!"
          onChangeText={(address) => this.setState({ address })}
          value={this.state.address}
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
          onPress={() => this.generateTx()}
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
