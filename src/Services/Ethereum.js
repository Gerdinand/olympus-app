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
import BigNumber from "bignumber.js";

class EthereumService {

  constructor() {
    this.rpc = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/xiNNVkYQ6V3IsiPWTTNT", 9000));
    this.erc20Contract = this.rpc.eth.contract(Constants.ERC20);
    this.intervalID = null;
    this.filter = null;

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
    const nonce = await Promisify(cb => this.rpc.eth.getTransactionCount(address, this.rpc.eth.defaultBlock, cb));
    return nonce
  }

  async getGasPrice() {
    const gasPrice = await Promisify(cb => this.rpc.eth.getGasPrice(cb));
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

    const tx = new EthereumTx(rawTx);

    return tx;
  }

  async sendTx(tx) {
    let serializedTx = tx.serialize();
    const hash = await Promisify(cb => this.rpc.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), cb));
    console.log("tx hash: " + hash);
  }

  async getBalance(address) {
    try {
      const balanceInWei = await Promisify(cb => this.rpc.eth.getBalance(address, cb));
      const balance = this.rpc.fromWei(balanceInWei, "ether");

      return balance.toNumber();
    } catch (e) {
      return e;
    }
  }

  async getTokenBalance(address, ownerAddress, decimals) {
    var instance = this.erc20Contract.at(address);
    const balance = await Promisify(cb => instance.balanceOf(ownerAddress, cb));

    const bigBalance = new BigNumber(balance);
    var base = new BigNumber(10);
    const readableBalance = bigBalance.div(base.pow(decimals)).toNumber();

    return readableBalance;
  }

  async sync(wallet) {
    var hasChanged = false;
    const balance = await this.getBalance(wallet.address);
    if (wallet.balance != balance) {
      wallet.balance = balance;
      hasChanged = true;
    }
    console.log("ETH balance: ", wallet.balance);

    for (var i = 1; i < wallet.tokens.length; i++) {
      var token = wallet.tokens[i];
      var tokenBalance = await this.getTokenBalance(token.address, token.ownerAddress, token.decimals);
      if (token.balance != tokenBalance) {
          token.balance = tokenBalance;
          hasChanged = true;
      }
      console.log(token.symbol + " balance: " + token.balance);
    }

    return wallet;
  }

  watch(wallet) {
    var _ = this;
    this.rpc.eth.filter({ address: wallet.address }, async function(error, result) {
      if (error) {
        console.error(error);
        _.rpc.eth.filter.stopWatching();
      } else {
        console.log("filter called");
        const syncedWallet = await _.sync(wallet);
      }
    });
  }
}

export default EthereumService;
