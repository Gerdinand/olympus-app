'use strict';

import '../../shim.js'

import Web3 from 'web3';

class NetworkService {

  constructor() {
    this.kovanRpc = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/xiNNVkYQ6V3IsiPWTTNT", 9000));
    this.mainRpc = new Web3(new Web3.providers.HttpProvider("https://main.infura.io/xiNNVkYQ6V3IsiPWTTNT", 9000));
  }

  static myInstance = null;

  static getInstance() {
    if (this.myInstance == null) {
      this.myInstance = new NetworkService();
    }
    return this.myInstance;
  }

  getNetwork(net) {
    if(net === 'MAIN') {
      return this.mainRpc;
    } else {
      return this.kovanRpc;
    }
  }
}

export default NetworkService;
