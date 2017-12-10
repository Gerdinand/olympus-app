'use strict';

import '../../shim.js'

import Web3 from 'web3';
import EthJs from 'ethereumjs-wallet-react-native';
import Tx from 'ethereumjs-tx'

class EthereumService {

  constructor() {
    this.rpc = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/xiNNVkYQ6V3IsiPWTTNT", 9000));
    this.pendingTransactionsSubscription = null;
    this.newBlockHeadersSubscription = null;
  }

  static myInstance = null;

  static getInstance() {
    if (this.myInstance == null) {
      this.myInstance = new EthereumService();
    }

    return this.myInstance;
  }

  getBalance(address) {
    const balance = this.rpc.eth.getBalance(address);
    console.log("balance: " + balance);
    return balance;
  }

  async watch(address) {
    this.rpc.eth.filter("latest").watch(function() {
      const currentBalance = web3.eth.getBalance(address);
      console.log("watch balance: " + currentBalance);
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
