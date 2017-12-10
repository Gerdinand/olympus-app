'use strict';

import '../../shim.js'

import Web3 from 'web3';
import EthJs from 'ethereumjs-wallet-react-native';
import Tx from 'ethereumjs-tx';
import Promisify from '../Utils/Promisify';

class EthereumService {

  constructor() {
    this.rpc = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/xiNNVkYQ6V3IsiPWTTNT", 9000));

    this.getBalance = this.getBalance.bind(this);
  }

  static myInstance = null;

  static getInstance() {
    if (this.myInstance == null) {
      this.myInstance = new EthereumService();
    }

    return this.myInstance;
  }

  async getBalance(address) {
    try {
      console.log("begin getBalance: " + address);
      const balance = await Promisify(cb => this.rpc.eth.getBalance(address, cb));
      console.log("end getBalance: " + balance);
      return balance;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  watch(address) {
    var self = this;
    this.rpc.eth.filter("latest").watch(async function() {
      console.log("watch address: " + address);
      const currentBalance = await self.getBalance(address) ;
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
