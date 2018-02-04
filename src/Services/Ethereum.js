'use strict';

import '../../shim.js';

import Web3 from 'web3';
import Promisify from '../Utils/Promisify';
import Constants from './Constants';
import EthereumTx from 'ethereumjs-tx';
import { EventRegister } from 'react-native-event-listeners';
import { getETHPrice } from './Currency';
import WalletService from './Wallet';
import { decodeTx } from '../Utils';

let BigNumber;

class EthereumService {
  constructor() {
    this.rpc = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/xiNNVkYQ6V3IsiPWTTNT', 9000));
    BigNumber = this.rpc.BigNumber;
    this.erc20Contract = this.rpc.eth.contract(Constants.ERC20);
    this.kyberAddress = Constants.KYBER_NETWORK_ADDRESS;
    this.kyberContract = this.rpc.eth.contract(Constants.KYBER_ABI).at(this.kyberAddress);
    this.intervalID = null;
    this.isSyncing = false;

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
    return this.rpc.version.api;
  }

  isValidateAddress(address) {
    return this.rpc.isAddress(address);
  }

  async getTransactionReceipt(tx) {
    const log = await Promisify(cb => this.rpc.eth.getTransactionReceipt(tx, cb));
    return log;
  }

  async getNonce(address) {
    const nonce = await Promisify(cb => this.rpc.eth.getTransactionCount(address, this.rpc.eth.defaultBlock, cb));
    return nonce;
  }

  async getGasPrice() {
    const gasPrice = await Promisify(cb => this.rpc.eth.getGasPrice(cb));
    return gasPrice;
  }

  async generateTx(from, to, value, gasLimit, txData = '') {
    const gasPrice = await this.getGasPrice();
    console.log(`gas price: ${gasPrice} x 3`);
    console.log('limit: ', gasLimit);

    let rawTx = {
      nonce: this.rpc.toHex(await this.getNonce(from)),
      gasPrice: this.rpc.toHex(gasPrice * 3),
      gasLimit: this.rpc.toHex(gasLimit),
      to,
      value: this.rpc.toHex(this.rpc.toWei(value, 'ether')),
      data: txData,
      chainId: Constants.CHAIN_ID, // now we use ropsten, not kovan 42,
    };

    const tx = new EthereumTx(rawTx);
    return tx;
  }

  toAscII(hex) {
    return this.rpc.toAscii(hex);
  }

  async generateTokenTx(source, dest, value, decimals, contractAddress, gasLimit) {
    console.log(dest);
    const bigValue = new BigNumber(value);
    let base = new BigNumber(10);
    const amount = bigValue.times(base.pow(decimals));
    const contract = this.erc20Contract.at(contractAddress);

    let rawTx = {
      from: source,
      nonce: this.rpc.toHex(await this.getNonce(source)),
      gasPrice: this.rpc.toHex(await this.getGasPrice() * 30),
      gasLimit: this.rpc.toHex(gasLimit * 2),
      to: contractAddress,
      value: '0x0',
      data: contract.transfer.getData(dest, amount),
      chainId: Constants.CHAIN_ID, // now we use ropsten, not kovan 42,
    };

    const tx = new EthereumTx(rawTx);
    return tx;
  }

  async sendTx(tx) {
    let serializedTx = tx.serialize();
    const hash = await Promisify(cb => this.rpc.eth.sendRawTransaction(`0x${serializedTx.toString('hex')}`, cb));
    WalletService.getInstance().wallet.pendingTxHash = hash;
    this.sync(WalletService.getInstance().wallet);
    console.log(`tx hash: ${hash}`);
  }

  async getBalance(address) {
    try {
      const balanceInWei = await Promisify(cb => this.rpc.eth.getBalance(address, cb));
      const balance = this.rpc.fromWei(balanceInWei, 'ether');

      return balance.toNumber();
    } catch (e) {
      return e;
    }
  }

  async getTokenBalance(address, ownerAddress, decimals) {
    let instance = this.erc20Contract.at(address);
    const balance = await Promisify(cb => instance.balanceOf(ownerAddress, cb));

    const bigBalance = new BigNumber(balance);
    let base = new BigNumber(10);
    const readableBalance = bigBalance.div(base.pow(decimals)).toNumber();

    return readableBalance;
  }

  runloop() {
    this.sync(WalletService.getInstance().wallet);
  }

  fireTimer() {
    this.runloop();
    this.intervalID = setInterval(this.runloop.bind(this), 10000);
  }

  invalidateTimer() {
    window.clearInterval(this.intervalID);
  }

  async sync(wallet) {
    if (this.isSyncing) {
      return;
    }
    this.isSyncing = true;

    const balance = await this.getBalance(wallet.address);
    wallet.balance = balance;
    wallet.tokens[0].balance = balance;
    console.log('ETH balance: ', wallet.balance);

    const ethPrice = await getETHPrice();
    wallet.ethPrice = ethPrice;
    console.log('ETH price: ', ethPrice);

    let balanceInUSD = ethPrice * balance;
    console.log('USD: ', balanceInUSD);

    for (let i = 1; i < wallet.tokens.length; i++) {
      let token = wallet.tokens[i];
      let tokenBalance = await this.getTokenBalance(token.address, token.ownerAddress, token.decimals);
      token.balance = tokenBalance;

      const priceInWei = await this.getExpectedRate(Constants.ETHER_ADDRESS, token.address);

      const tokenPrice = this.rpc.fromWei(priceInWei, 'ether').toFixed(2);
      token.price = tokenPrice;

      balanceInUSD += (1.0 / tokenPrice) * ethPrice * tokenBalance;

      console.log(`${token.symbol} price: ${token.price}`);
      console.log(`${token.symbol} balance: ${token.balance}`);
    }

    wallet.balanceInUSD = balanceInUSD.toFixed(2);

    const url = `https://ropsten.etherscan.io/api?module=account&action=txlist&address=${wallet.address}&sort=desc&apikey=18V3SM2K3YVPRW83BBX2ICYWM6HY4YARK4`;
    const response = await fetch(url, { method: 'GET' }).catch(console.warn.bind(console));
    wallet.txs = response ? (await response.json()).result : [];
    await Promise.all(wallet.txs.map(decodeTx));

    if (wallet.pendingTxHash) {
      let hasPacked = false;
      for (let i = 0; i < wallet.txs.length; i++) {
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

    EventRegister.emit('wallet.updated', wallet);

    return wallet;
  }

  // Kyber Integraiton
  async getExpectedRate(source, dest) {
    // this now returns 2 numbers.
    // The function returns the expected and worse case conversion rate between source and dest tokens,
    // where source and dest are 20 bytes addresses.
    const result = (await Promisify(cb => this.kyberContract.getExpectedRate(source, dest, 1, cb)));
    return result[0];
  }

  async generateTradeTx(
    sourceToken,
    sourceAmount,
    destToken,
    destAddress,
    maxDestAmount,
    minConversionRate,
    walletId,
    throwOnFailure,
    gasLimit,
    nonce) {

    const amount = this.rpc.toWei(sourceAmount, 'ether');

    // address,uint256,address,address,uint256,uint256,address
    const exchangeData = this.kyberContract.trade.getData(
      sourceToken,
      amount,
      destToken,
      destAddress,
      maxDestAmount,
      minConversionRate,
      walletId,
      // throwOnFailure,
      // 0
    );

    let rawTx = {
      nonce: this.rpc.toHex(nonce),
      gasPrice: this.rpc.toHex(await this.getGasPrice()),
      gasLimit: this.rpc.toHex(gasLimit),
      to: this.kyberAddress,
      value: sourceToken == '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' ? this.rpc.toHex(amount) : 0,
      data: exchangeData,
      chainId: Constants.CHAIN_ID, // now we use ropsten, not kovan 42,
    };

    console.log(JSON.stringify(rawTx));

    const tx = new EthereumTx(rawTx);
    return tx;
  }

  async newNonce(address) {
    return await this.getNonce(address);
  }

  async generateApproveTokenTx(sourceToken, sourceAmount, destAddress) {
    const amount = this.rpc.toWei(sourceAmount, 'ether');
    const tokenContract = this.erc20Contract.at(sourceToken);
    const approveData = tokenContract.approve.getData(this.kyberAddress, amount);

    const rawTx = {
      nonce: this.rpc.toHex(await this.newNonce(destAddress)),
      gasPrice: this.rpc.toHex(await this.getGasPrice()),
      gasLimit: this.rpc.toHex(300000),
      to: sourceToken,
      value: 0,
      data: approveData,
      chainId: Constants.CHAIN_ID, // now we use ropsten, not kovan 42,
    };

    console.log(JSON.stringify(rawTx));

    const tx = new EthereumTx(rawTx);
    return tx;
  }

  async generateTradeFromTokenToEtherTx(sourceToken, sourceAmount, destAddress) {
    const tx = await this.generateTradeTx(
      sourceToken,
      sourceAmount,
      '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      destAddress,
      (new BigNumber(2)).pow(255),
      await this.getExpectedRate(sourceToken, '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'),
      Constants.KYBER_EXCHANGES.binance, // todo: use binance for now.
      true,
      1000000,
      await this.newNonce(destAddress) + 1,
    );

    return tx;
  }

  async generateTradeFromEtherToTokenTx(sourceAmount, destToken, destAddress) {
    const tx = await this.generateTradeTx(
      '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      sourceAmount,
      destToken,
      destAddress,
      (new BigNumber(2)).pow(255),
      await this.getExpectedRate('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', destToken),
      Constants.KYBER_EXCHANGES.binance, // todo: use binance for now.
      true,
      1000000,
      await this.newNonce(destAddress),
    );

    return tx;
  }
}

export default EthereumService;
