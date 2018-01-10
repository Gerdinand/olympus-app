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
import { EventRegister } from 'react-native-event-listeners';
import { getETHPrice } from './Currency';
import WalletService from './Wallet';

let network = 'MAIN';
class EthereumNetService {

  constructor() {
    this.kovanRpc = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/xiNNVkYQ6V3IsiPWTTNT", 9000));
    this.mainRpc = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/xiNNVkYQ6V3IsiPWTTNT", 9000));
    this.rpc = this.mainRpc; //default network
    this.erc20Contract = this.rpc.eth.contract(Constants.ERC20);
    this.kyberAddress = Constants.KYBER_NETWORK_ADDRESS;
    this.kyberContract = this.kovanRpc.eth.contract(Constants.KYBER_ABI).at(this.kyberAddress);
    this.intervalID = null;
    this.isSyncing = false;

    // method bind
    this.getBalance = this.getBalance.bind(this);
  }

  static myInstance = null;

  static getInstance(net) {
    if (this.myInstance == null) {
      this.myInstance = new EthereumNetService();
    }

    if (net === 'MAIN') {
      network = 'MAIN';
    } else {
      network = 'KOVAN';
    }
    return this.myInstance;
  }

  version() {
    let rpc = network === 'MAIN' ? this.mainRpc : this.kovanRpc;
    return rpc.version.api
  }

  isValidateAddress(address) {
      let rpc = network === 'MAIN' ? this.mainRpc : this.kovanRpc;
    return rpc.isAddress(address);
  }

  async getNonce(address) {
      let rpc = network === 'MAIN' ? this.mainRpc : this.kovanRpc;
    const nonce = await Promisify(cb => rpc.eth.getTransactionCount(address, rpc.eth.defaultBlock, cb));
    return nonce
  }

  async getGasPrice() {
      let rpc = network === 'MAIN' ? this.mainRpc : this.kovanRpc;
    const gasPrice = await Promisify(cb => rpc.eth.getGasPrice(cb));
    return gasPrice;
  }

  async generateTx(from, to, value, gasLimit, txData="") {
      let rpc = network === 'MAIN' ? this.mainRpc : this.kovanRpc;
      let chainId = network === 'MAIN' ? 1 : 42;
    const gasPrice = await this.getGasPrice();
    console.log("gas price: " + gasPrice + " x 3");
    console.log("limit: ", gasLimit);

    let rawTx = {
      nonce: rpc.toHex(await this.getNonce(from)),
      gasPrice: rpc.toHex(gasPrice * 3),
      gasLimit: rpc.toHex(gasLimit),
      to: to,
      value: rpc.toHex(rpc.toWei(value, "ether")),
      data: txData,
      chainId: chainId,
    };

    const tx = new EthereumTx(rawTx);
    return tx;
  }

  async generateTokenTx(source, dest, value, decimals, contractAddress, gasLimit) {
      let rpc = network === 'MAIN' ? this.mainRpc : this.kovanRpc;
      let chainId = network === 'MAIN' ? 1 : 42;
    console.log(dest);
    const bigValue = new BigNumber(value);
    var base = new BigNumber(10);
    const amount = bigValue.times(base.pow(decimals));
    // const contract = this.erc20Contract.at(contractAddress);
      const contract = rpc.eth.contract(Constants.ERC20).at(contractAddress);

    let rawTx = {
      from: source,
      nonce: this.rpc.toHex(await this.getNonce(source)),
      gasPrice: this.rpc.toHex(await this.getGasPrice() * 30),
      gasLimit: this.rpc.toHex(gasLimit * 2),
      to: contractAddress,
      value: "0x0",
      data: contract.transfer.getData(dest, amount),
      chainId: chainId,
    };

    const tx = new EthereumTx(rawTx);
    return tx;
  }

  async sendTx(tx) {
      let rpc = network === 'MAIN' ? this.mainRpc : this.kovanRpc;
    let serializedTx = tx.serialize();
    const hash = await Promisify(cb => rpc.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), cb));
    WalletService.getInstance(network).wallet.pendingTxHash = hash;
    this.sync(WalletService.getInstance(network).wallet);
    console.log("tx hash: " + hash);
  }

  async getBalance(address) {
    let rpc = network === 'MAIN' ? this.mainRpc : this.kovanRpc;
    try {
      const balanceInWei = await Promisify(cb => rpc.eth.getBalance(address, cb));
      const balance = rpc.fromWei(balanceInWei, "ether");

      return balance.toNumber();
    } catch (e) {
      return e;
    }
  }

  async getTokenBalance(address, ownerAddress, decimals) {
      let rpc = network === 'MAIN' ? this.mainRpc : this.kovanRpc;
    var instance = rpc.eth.contract(Constants.ERC20).at(address);
    // var instance = this.erc20Contract.at(address);
    const balance = await Promisify(cb => instance.balanceOf(ownerAddress, cb));

    const bigBalance = new BigNumber(balance);
    var base = new BigNumber(10);
    const readableBalance = bigBalance.div(base.pow(decimals)).toNumber();

    return readableBalance;
  }

  runloop() {
    this.sync(WalletService.getInstance(network).wallet);
  }

  fireTimer () {
    this.runloop();
    this.intervalID = setInterval(this.runloop.bind(this), 10000);
  }

  invalidateTimer () {
    window.clearInterval(this.intervalID);
  }

  async sync(wallet) {
      let rpc = network === 'MAIN' ? this.mainRpc : this.kovanRpc;
    if (this.isSyncing) {
      return ;
    }
    this.isSyncing = true;

    const balance = await this.getBalance(wallet.address);
    console.log(balance);
    wallet.balance = balance;
    wallet.tokens[0].balance = balance;
    console.log("ETH balance: ", wallet.balance);

    const ethPrice = await getETHPrice();

    wallet.ethPrice = ethPrice;
    console.log("ETH price: ", ethPrice);

    var balanceInUSD = ethPrice * balance;
    console.log("USD: ", balanceInUSD);

    for (var i = 1; i < wallet.tokens.length; i++) {
      var token = wallet.tokens[i];
      var tokenBalance = await this.getTokenBalance(token.address, token.ownerAddress, token.decimals);
      token.balance = tokenBalance;


      if (network === 'MAIN') {
          const tokenPrice = await this.getRate(`eth_${token.symbol.toLowerCase()}`);
          token.price = parseFloat(tokenPrice).toFixed(2);
      } else {
          const priceInWei = await this.getPrice(Constants.ETHER_ADDRESS, token.address);
          const tokenPrice = this.rpc.fromWei(priceInWei, "ether").toFixed(2);
          token.price = tokenPrice;
      }


      balanceInUSD += (1.0 / token.price) * ethPrice * tokenBalance;

      console.log(token.symbol + " price: " + token.price);
      console.log(token.symbol + " balance: " + token.balance);
    }

    wallet.balanceInUSD = balanceInUSD.toFixed(2);


    const url = network === 'MAIN' ?
        "http://api.etherscan.io/api?module=account&action=txlist&address="+ wallet.address +"&sort=desc&apikey=18V3SM2K3YVPRW83BBX2ICYWM6HY4YARK4" :
        "http://kovan.etherscan.io/api?module=account&action=txlist&address="+ wallet.address +"&sort=desc&apikey=18V3SM2K3YVPRW83BBX2ICYWM6HY4YARK4";

    const response = await fetch(url, {method: "GET"});
    const responseText = await response.text();

    if (response.status == 200) {
      wallet.txs = JSON.parse(responseText).result;
    }

    if (wallet.pendingTxHash) {
      var hasPacked = false;
      for (var i = 0; i < wallet.txs.length; i++) {
        if (wallet.txs[i].hash == wallet.pendingTxHash) {
          hasPacked = true;
          break;
        }
      }

      if (hasPacked) {
        wallet.pendingTxHash = null;
      }
    }

    this.isSyncing = false;

    EventRegister.emit("wallet.updated", wallet);

    return wallet;
  }

  // Kyber Integraiton
  async getPrice(source, dest) {
    const result = await Promisify(cb => this.kyberContract.getPrice(source, dest, cb));
    return result;
  }
    // ShapeShift Integraiton
  async getRate(paire) {
    let response = await fetch(`http://shapeshift.io/rate/${paire}`);
    let responseJson = await response.json();

    return responseJson.rate;
  }

  async generateTradeTx(
    sourceToken,
    sourceAmount,
    destToken,
    destAddress,
    maxDestAmount,
    minConversionRate,
    throwOnFailure,
    gasLimit,
    nonce) {

    const amount = this.kovanRpc.toWei(sourceAmount, "ether");

    const exchangeData = this.kyberContract.walletTrade.getData(
      sourceToken,
      amount,
      destToken,
      destAddress,
      maxDestAmount,
      minConversionRate,
      throwOnFailure,
      0
    );

    let rawTx = {
      nonce: this.kovanRpc.toHex(nonce),
      gasPrice: this.kovanRpc.toHex(await this.getGasPrice()),
      gasLimit: this.kovanRpc.toHex(gasLimit),
      to: this.kyberAddress,
      value: sourceToken == "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" ? this.rpc.toHex(amount) : 0,
      data: exchangeData,
      chainId: 42,
    };

    const tx = new EthereumTx(rawTx);
    return tx;
  }

  async newNonce(address) {
    return await this.getNonce(address);
  }

  async generateApproveTokenTx(sourceToken, sourceAmount, destAddress) {
    const amount = this.rpc.toWei(sourceAmount, "ether");
    const tokenContract = this.erc20Contract.at(sourceToken);
    const approveData = tokenContract.approve.getData(this.kyberAddress, amount);

    const rawTx = {
      nonce: this.rpc.toHex(await this.newNonce(destAddress)),
      gasPrice: this.rpc.toHex(await this.getGasPrice()),
      gasLimit: this.rpc.toHex(300000),
      to: sourceToken,
      value: 0,
      data: approveData,
      chainId: 42,
    }

    console.log(JSON.stringify(rawTx));

    const tx = new EthereumTx(rawTx);
    return tx;
  }

  async generateTradeFromTokenToEtherTx(sourceToken, sourceAmount, destAddress) {
      const tx = await this.generateTradeTx(
        sourceToken,
        sourceAmount,
        "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        destAddress,
        (new BigNumber(2)).pow(255),
        await this.getPrice(sourceToken, "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"),
        true,
        1000000,
        await this.newNonce(destAddress) + 1,
      );

      return tx;
  }

  async generateTradeFromEtherToTokenTx(sourceAmount, destToken, destAddress) {
    const tx = await this.generateTradeTx(
      "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      sourceAmount,
      destToken,
      destAddress,
      (new BigNumber(2)).pow(255),
      await this.getPrice("0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", destToken),
      true,
      1000000,
      await this.newNonce(destAddress),
    );

    return tx;
  }
}

export default EthereumNetService;
