'use strict';

import '../../shim.js';

import { asyncRandomBytes } from 'react-native-secure-randombytes';
declare var window: any;
window.randomBytes = asyncRandomBytes;

import EthJs from 'ethereumjs-wallet-react-native';

import { addressFromJSON, unlock } from '../Utils/Keys';
import { saveItem, readItem } from '../Utils/KeyStore';
import { SupportedTokens, GAS_LIMIT } from '../Constants/index.js';
import { Token, Wallet } from '../Models/index.js';

const WALLET_JSON_KEY = 'walletJson';
export class WalletService {

  public wallet: Wallet;

  private constructor() {
    this.wallet = null;
  }

  private static myInstance = null;

  public static getInstance(): WalletService {
    if (this.myInstance === null) {
      this.myInstance = new WalletService();
    }

    return this.myInstance;
  }

  // When it comes restore from redux.
  public setWallet(wallet: Wallet) {
    this.wallet = wallet;
  }

  // Logout
  public resetActiveWallet() {
    this.wallet = null;
  }

  // Called on creation or on import
  private async initializeWallet(name: string, address: string, walletJson: string) {
    // Wallet default values
    this.wallet = {
      address,
      name,
      balance: 0,
      balanceInUSD: 0,
      gasLimit: GAS_LIMIT,
      ethPrice: 0,
      tokens: [],
      txs: [],
      pendingTxs: [],
    } as Wallet;

    // Initalize the json
    for (const tokenData of SupportedTokens) {
      const token = new Token(tokenData.name,
        tokenData.icon, tokenData.symbol,
        tokenData.address, this.wallet.address, tokenData.decimals);
      this.wallet.tokens.push(token);
    }
    // Save the JSOn in a secure KeyChain
    await saveItem(WALLET_JSON_KEY, JSON.stringify(walletJson));

  }
  public async getSeed(password) {
    const infoString = await readItem(WALLET_JSON_KEY);

    if (infoString) {
      const info = JSON.parse(infoString);
      try {
        const seed = unlock(info, password, true);
        return seed;
      } catch (e) {
        return null;
      }
    } else {
      return null;
    }
  }

  public async getWalletJson(password): Promise<object | null> {
    const jsonString = await readItem(WALLET_JSON_KEY);

    if (jsonString) {
      const json = JSON.parse(jsonString);
      try {
        const seed = unlock(jsonString, password, true); // TODO, the result shall be directly the infostring
        console.log('seed: ', seed);
        return json;
      } catch (e) {
        return null;
      }
    } else {
      return null;
    }
  }

  public async importV3Wallet(name, json, password) {
    const wallet = await EthJs.fromV3(json, password);
    if (wallet) {
      const address = addressFromJSON(json);
      // check if address equals.
      if (wallet.getAddressString() === `0x${json.address}`) {
        this.initializeWallet(name, address, json);
        return true;
      }
    }
    return false;
  }

  public async generateV3Wallet(name, password) {
    const wallet = await EthJs.generate();
    const json = await wallet.toV3(password, { kdf: 'pbkdf2', c: 10240 });
    const address = addressFromJSON(json);
    this.initializeWallet(name, address, json);
    return json;
  }

  public static formatAddress(address: string) {
    return address.replace(/(0x.{6}).{29}/, '$1****');
  }
}
