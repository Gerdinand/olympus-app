'use strict';

import '../../shim.js'

import Web3 from 'web3';
import EthJs from 'ethereumjs-wallet-react-native';
import * as ethUtil from 'ethereumjs-util';
import Tx from 'ethereumjs-tx';
import Promisify from '../Utils/Promisify';
import Constants from './Constants';
import { numberToHex, hexToNumber, toTWei, toT } from '../Utils/Converter';
import EthereumTx from 'ethereumjs-tx';

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
    const nonce = await Promisify(cb => this.rpc.eth.getTransactionCount(address, cb));
    console.log("nonce: " + nonce);
    return nonce
  }

  async getGasPrice() {
    const gasPrice = await Promisify(cb => this.rpc.eth.getGasPrice(cb));
    console.log("gapPrice: " + gasPrice);
    return gasPrice;
  }

  async generateTx(address, value, gasLimit) {
    let rawTx = {
      nonce: numberToHex(await this.getNonce(address)),
      gasPrice: numberToHex(await this.getGasPrice()),
      gasLimit: numberToHex(gasLimit),
      to: address,
      value: numberToHex(toTWei()),
      data:'',
      chainId: 3
    };
    console.log("raw tx: " + JSON.stringify(rawTx));
    const tx = new EthereumTx(rawTx);

    return tx;
  }

  sendTx(tx) {
    let serializedTx = tx.serialize();
    this.rpc.eth.sendRawTransaction(ethUtil.bufferToHex(serializedTx), (error, hash) => {
        if (error != null) {
          console.error(error);
        } else {
          console.log(hash);
        }
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
