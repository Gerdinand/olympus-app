'use strict';

import '../../shim.js'

import Web3 from 'web3';
import EthJs from 'ethereumjs-wallet-react-native';
import Tx from 'ethereumjs-tx';
import Promisify from '../Utils/Promisify';
import Constants from './Constants';
import { numberToHex, hexToNumber } from '../Utils/Converter';

class EthereumService {

  constructor() {
    this.rpc = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/xiNNVkYQ6V3IsiPWTTNT", 9000));
    this.erc20Contract = this.rpc.eth.contract(Constants.ERC20);


    this.getBalance = this.getBalance.bind(this);
  }

  static myInstance = null;

  static getInstance() {
    if (this.myInstance == null) {
      this.myInstance = new EthereumService();
    }

    return this.myInstance;
  }

  version() {
    return this.rpc.version.api
  }

  async getNonce(address) {
    return await this.rpc.eth.getTransactionCount(address);
  }

  async getGasPrice() {
    return await this.rpc.eth.getGasPrice();
  }

  async generateTx(address, value, gasLimit) {
    let rawTx = {
      nonce: numberToHex(await this.getNonce),
      gasPrice: numberToHex(await this.getGasPrice),
      gasLimit: numberToHex(gasLimit),
      to: address,
      value: numberToHex(this.rpc.utils.toWei(value, 'ether')),
      data:'',
      chainId: 3
    };
    console.log("raw tx: " + rawTx);
    const tx = new EthereumTx(rawTx);

    return tx;
  }

  sendTx(tx) {
    let serializedTx = tx.serialize();
    this.rpc.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
      .on('receipt', function(data) {
        console.log(data.transactionHash)
      });
  }

  async getBalance(address) {
    try {
      const balance = await Promisify(cb => this.rpc.eth.getBalance(address, cb));
      console.log("balance: " + address + ", " + balance);

      return balance;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async getTokenBalance(address, ownerAddr) {
    var instance = this.erc20Contract.at(address)
    try {
      const balance = await Promisify(cb => instance.balanceOf(ownerAddr, cb));
      console.log("token balance: " + balance);

      return balance;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  watch(address) {
    var self = this;
    this.rpc.eth.filter("latest").watch(async function() {
      const currentBalance = await self.getBalance(address) ;
    });
  }

  actAndWatch(error, result) {
    if (error != null) {
      console.error(error);
    } else {
      console.log(result);
    }
  }
}

export default EthereumService;
