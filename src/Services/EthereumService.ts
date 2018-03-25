'use strict';

import '../../shim.js';

import Web3 from 'web3';
import Promisify from '../Utils/Promisify';
import * as Constants from '../Constants';
import EthereumTx from 'ethereumjs-tx';
import { EventRegister } from 'react-native-event-listeners';
import { getETHPrice } from './Currency';
import { WalletService } from './WalletService';
import { decodeTx } from '../Utils';
import { Wallet } from '../Models/index.js';
import { Tx } from '../Models/Tx.js';
import { store } from '../reducer';
import { GAS_LIMIT } from '../Constants';
import WalletActions from '../Pages/Wallet/WalletActions.js';

let BigNumber;

export class EthereumService {
  private rpc;
  private erc20Contract;
  private kyberContract;
  private kyberAddress;
  private intervalID: number | null;
  private isSyncing;

  private constructor() {
    this.rpc = new Web3(
      new Web3.providers.HttpProvider(`https://${Constants.CHAIN_NAME}.infura.io/xiNNVkYQ6V3IsiPWTTNT`, 9000));
    BigNumber = this.rpc.BigNumber;
    BigNumber.config({ ERRORS: false });

    this.erc20Contract = this.rpc.eth.contract(Constants.ERC20);
    this.kyberAddress = Constants.KYBER_NETWORK_ADDRESS;
    this.kyberContract = this.rpc.eth.contract(Constants.KYBER_ABI).at(this.kyberAddress);
    this.intervalID = null;
    this.isSyncing = false;

    // method bind
    this.getBalance = this.getBalance.bind(this);
  }

  public get isWalletSyncing() {
    return this.isSyncing;
  }
  private static myInstance = null;

  public static getInstance(): EthereumService {
    if (this.myInstance === null) {
      this.myInstance = new EthereumService();
    }

    return this.myInstance;
  }

  public version() {
    return this.rpc.version.api;
  }

  public isValidateAddress(address) {
    return this.rpc.isAddress(address);
  }

  public async getTransactionReceipt(tx): Promise<{ logs: any }> {
    const log = await Promisify((cb) => this.rpc.eth.getTransactionReceipt(tx, cb)) as { logs: any };
    return log;
  }

  public async getNonce(address): Promise<number> {
    const nonce = await Promisify((cb) =>
      this.rpc.eth.getTransactionCount(address, this.rpc.eth.defaultBlock, cb)) as number;
    return nonce;
  }

  public async getGasPrice(): Promise<BigNumber> {
    const gasPrice = await Promisify((cb) => this.rpc.eth.getGasPrice(cb)) as BigNumber;
    return gasPrice;
  }

  public async getGasLimit(): Promise<number> {
    const block: any = await Promisify((cb) => this.rpc.eth.getBlock('latest', cb));
    const gasLimit = block.gasLimit;

    return gasLimit;
  }

  public async generateTx(from, to, value, gasPrice: string, txData = ''): Promise<Partial<Tx>> {

    const tx: Partial<Tx> = {
      nonce: this.rpc.toHex(await this.getNonce(from)),
      gasPrice: this.rpc.toHex(gasPrice),
      gasLimit: this.rpc.toHex(GAS_LIMIT),
      to,
      value: this.rpc.toHex(this.rpc.toWei(value, 'ether')),
      data: txData,
      chainId: Constants.CHAIN_ID, // now we use ropsten, not kovan 42,
    };

    return tx;
  }

  public toAscII(hex) {
    return this.rpc.toAscii(hex);
  }

  public async generateTokenTx(source, dest, value, decimals, contractAddress, gasPrice): Promise<Partial<Tx>> {
    console.log(dest);
    const bigValue = new BigNumber(value);
    const base = new BigNumber(10);
    const amount = bigValue.times(base.pow(decimals));
    const contract = this.erc20Contract.at(contractAddress);

    const tx: Partial<Tx> = {
      from: source,
      nonce: this.rpc.toHex(await this.getNonce(source)),
      gasPrice: this.rpc.toHex(gasPrice),
      gasLimit: this.rpc.toHex(GAS_LIMIT),
      to: contractAddress,
      value: '0x0',
      data: contract.transfer.getData(dest, amount),
      chainId: Constants.CHAIN_ID, // now we use ropsten, not kovan 42,
    };

    return tx;
  }

  public async sendTx(tx: Tx, privateKey: Buffer): Promise<Tx> {
    const ethTx = new EthereumTx(tx);
    ethTx.sign(privateKey);
    const serializedTx = ethTx.serialize();
    tx.hash = await Promisify((cb) =>
      this.rpc.eth.sendRawTransaction(`0x${serializedTx.toString('hex')}`, cb)) as string;
    this.sync(WalletService.getInstance().wallet);
    console.log(`tx hash: ${tx.hash}`);

    return tx;
  }

  public async getBalance(address) {
    try {
      const balanceInWei = await Promisify((cb) => this.rpc.eth.getBalance(address, cb));
      const balance = this.rpc.fromWei(balanceInWei, 'ether');
      console.log('Balance: ', balance.toNumber());

      return balance.toNumber();
    } catch (e) {
      return e;
    }
  }

  public async getTokenBalance(address, ownerAddress, decimals) {
    const instance = this.erc20Contract.at(address);
    const balance = await Promisify((cb) => instance.balanceOf(ownerAddress, cb));

    const bigBalance = new BigNumber(balance);
    const base = new BigNumber(10);
    const readableBalance = bigBalance.div(base.pow(decimals)).toNumber();

    return readableBalance;
  }

  public runloop() {
    this.sync(WalletService.getInstance().wallet);
  }

  public fireTimer() {
    this.runloop();
    this.intervalID = setInterval(this.runloop.bind(this), 10000);
  }

  public invalidateTimer() {
    clearInterval(this.intervalID);
    this.intervalID = null;
  }

  public async sync(wallet: Wallet): Promise<Wallet | {}> {

    if (this.isSyncing) {
      return {};
    }

    if (!wallet || wallet.tokens.length === 0) {
      EventRegister.emit('wallet.updated', {});
      return {};
    }
    try {
      this.isSyncing = true;

      const balance = await this.getBalance(wallet.address);
      wallet.balance = balance;
      wallet.tokens[0].balance = balance;
      wallet.gasLimit = GAS_LIMIT;

      const ethPrice = await getETHPrice();
      wallet.ethPrice = ethPrice;
      let balanceInUSD = ethPrice * balance;

      for (let i = 1; i < wallet.tokens.length; i++) {
        const token = wallet.tokens[i];
        const tokenBalance = await this.getTokenBalance(token.address, token.ownerAddress, token.decimals);
        token.balance = tokenBalance;
        const priceInWei = await this.getExpectedRate(Constants.ETHER_ADDRESS, token.address);

        const tokenPrice = Number(this.rpc.fromWei(priceInWei, 'ether').toFixed(2));
        token.price = tokenPrice;

        if (tokenPrice !== 0) {
          balanceInUSD += (1.0 / tokenPrice) * ethPrice * tokenBalance;
        }
        // console.log(`${token.symbol} price: ${token.price}  balance: ${token.balance}`);
      }

      wallet.balanceInUSD = Number(balanceInUSD !== 0 ? balanceInUSD.toFixed(2) : 0);

      // tslint:disable-next-line:max-line-length
      const url = `https://api-${Constants.CHAIN_NAME}.etherscan.io/api?module=account&action=txlist&address=${wallet.address}&sort=desc&apikey=18V3SM2K3YVPRW83BBX2ICYWM6HY4YARK4`;
      const response = await fetch(url, { method: 'GET' }).catch(console.warn.bind(console));
      wallet.txs = response ? (await response.json()).result : [];
      await Promise.all(wallet.txs.map(decodeTx));
      // Update pending transactions
      wallet.pendingTxs = wallet.pendingTxs.filter((pendingTx) =>
        !wallet.txs.find((tx) => tx.hash === pendingTx.tx.hash),
      );

      this.isSyncing = false;
      // If the user logout while the update was already fired.
      if (!this.intervalID) {
        return {};
      }
      EventRegister.emit('wallet.updated', wallet);
      // We inform to redux that the wallet has been updated also
      store.dispatch(WalletActions.updateWalletRedux(wallet));
    } catch (e) {
      EventRegister.emit('wallet.updated', {});
      console.warn('Error on sync', e);
      this.isSyncing = false;
    }
    return wallet;
  }

  // Kyber Integraiton
  public async getExpectedRate(source, dest) {
    // this now returns 2 numbers.
    // The function returns the expected and worse case conversion rate between source and dest tokens,
    // where source and dest are 20 bytes addresses.
    const result = (await Promisify((cb) => this.kyberContract.getExpectedRate(source, dest, 1, cb)));
    return result[0];
  }

  public async generateTradeTx(
    sourceToken,
    sourceAmount,
    destToken,
    destAddress,
    maxDestAmount,
    minConversionRate,
    walletId,
    _throwOnFailure, // Need to be used later
    gasPrice,
    nonce): Promise<Partial<Tx>> {

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

    const tx: Partial<Tx> = {
      nonce: this.rpc.toHex(nonce),
      gasPrice: this.rpc.toHex(gasPrice),
      gasLimit: this.rpc.toHex(GAS_LIMIT),
      to: this.kyberAddress,
      value: sourceToken === Constants.ETHER_ADDRESS ? this.rpc.toHex(amount) : 0,
      data: exchangeData,
      chainId: Constants.CHAIN_ID, // now we use ropsten, not kovan 42,
    };
    return tx;
  }

  public async newNonce(address) {
    return await this.getNonce(address);
  }

  public async generateApproveTokenTx(sourceToken, sourceAmount, destAddress, gasPrice): Promise<Partial<Tx>> {
    const amount = this.rpc.toWei(sourceAmount, 'ether');
    const tokenContract = this.erc20Contract.at(sourceToken);
    const approveData = tokenContract.approve.getData(this.kyberAddress, amount);

    const tx: Partial<Tx> = {
      nonce: this.rpc.toHex(await this.newNonce(destAddress)),
      gasPrice: this.rpc.toHex(gasPrice),
      gasLimit: this.rpc.toHex(GAS_LIMIT),
      to: sourceToken,
      value: 0,
      data: approveData,
      chainId: Constants.CHAIN_ID, // now we use ropsten, not kovan 42,
    };

    console.log(JSON.stringify(tx));

    return tx;
  }

  public async generateTradeFromTokenToEtherTx(sourceToken, sourceAmount, destAddress, gasPrice): Promise<Partial<Tx>> {
    const tx = await this.generateTradeTx(
      sourceToken,
      sourceAmount,
      Constants.ETHER_ADDRESS,
      destAddress,
      (new BigNumber(2)).pow(255),
      await this.getExpectedRate(sourceToken, Constants.ETHER_ADDRESS),
      '0x0', // todo: use 0 for test, mainnet should apply to kyber.
      true,
      gasPrice,
      await this.newNonce(destAddress) + 1,
    );

    return tx;
  }

  public async generateTradeFromEtherToTokenTx(sourceAmount, destToken, destAddress, gasPrice): Promise<Partial<Tx>> {
    const tx = await this.generateTradeTx(
      Constants.ETHER_ADDRESS,
      sourceAmount,
      destToken,
      destAddress,
      (new BigNumber(2)).pow(255),
      await this.getExpectedRate(Constants.ETHER_ADDRESS, destToken),
      '0x0', // 0 for testnet, mainnet should apply to kyber.
      true,
      gasPrice,
      await this.newNonce(destAddress),
    );

    return tx;
  }
}
