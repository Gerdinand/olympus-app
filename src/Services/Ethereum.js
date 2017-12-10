'use strict';

import '../../shim.js'

import Web3 from 'web3';
import EthJs from 'ethereumjs-wallet-react-native';
import Tx from 'ethereumjs-tx'

class EthereumService {

  constructor() {
    this.rpc = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/xiNNVkYQ6V3IsiPWTTNT", 9000));
  }

  static myInstance = null;

  static getInstance() {
    if (this.myInstance == null) {
      this.myInstance = new EthereumService();
    }
    
    return this.myInstance;
  }

  async getBalance(address) {
    const balance = await this.rpc.eth.getBalance(address);
    console.log("balance: " + balance);
    return balance;
  }
}

export default EthereumService;
