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
    this.rpc = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/xiNNVkYQ6V3IsiPWTTNT", 9000));
    this.erc20Contract = this.rpc.eth.contract(Constants.ERC20);

    // method bind
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
    console.log("address: " + address);
    const nonce = await Promisify(cb => this.rpc.eth.getTransactionCount(address, this.rpc.eth.defaultBlock, cb));
    console.log("nonce: " + nonce);
    return nonce
  }

  async getGasPrice() {
    const gasPrice = await Promisify(cb => this.rpc.eth.getGasPrice(cb));
    console.log("gapPrice: " + gasPrice);
    return gasPrice;
  }

  async generateTx(from, to, value, gasLimit) {
    let rawTx = {
      nonce: this.rpc.toHex(await this.getNonce(from)),
      gasPrice: this.rpc.toHex(await this.getGasPrice()),
      gasLimit: this.rpc.toHex(gasLimit),
      to: to,
      value: this.rpc.toHex(this.rpc.toWei(value, "ether")),
      data: "",
      chainId: 42,
    };
    console.log("raw tx: " + JSON.stringify(rawTx));
    const tx = new EthereumTx(rawTx);

    return tx;
  }

  async sendTx(tx) {
    let serializedTx = tx.serialize();
    const result = await Promisify(cb => this.rpc.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), cb));
    console.log(result);
  }

  async getBalance(address) {
    try {
      const balanceInWei = await Promisify(cb => this.rpc.eth.getBalance(address, cb));
      const balance = this.rpc.fromWei(balanceInWei);
      console.log("balance: " + address + ", " + balance);

      return balance;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async getTokenBalance(address, ownerAddress) {
    console.log(this);
    var instance = this.erc20Contract.at(address);
    console.log("token instance: " + instance);
    try {
      const balance = await Promisify(cb => instance.balanceOf(ownerAddress, cb));
      console.log("token balance: " + balance);

      return balance;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async sync(wallet) {
    wallet.balance = await this.getBalance(wallet.address);
    console.log("eth balance: ", wallet.balance);

    for (var i = 1; i < wallet.tokens.length; i++) {
      wallet.tokens[i].balance = await this.getTokenBalance(wallet.tokens[i].address, wallet.ownerAddress);
      console.log("token " + wallet.tokens[i].symbol + " balance: " + wallet.tokens[i].balance);
    }

    return wallet;
  }

  watch(address) {
    // var self = this;
    // this.rpc.eth.filter("latest").watch(async function() {
    //   const currentBalance = await self.getBalance(address) ;
    // });
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
