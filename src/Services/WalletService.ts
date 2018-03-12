'use strict';

import '../../shim.js';

import { asyncRandomBytes } from 'react-native-secure-randombytes';
declare var window: any;
window.randomBytes = asyncRandomBytes;

import EthJs from 'ethereumjs-wallet-react-native';

import { addressFromJSONString, unlock } from '../Utils/Keys';
import { saveItem, readItem } from '../Utils/KeyStore';
import { SupportedTokens, MINIMUM_GAS_LIMIT } from '../Constants/index.js';
import { Token } from '../Models/index.js';

export class WalletService {

  public wallet;

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

  public resetActiveWallet() {
    this.wallet = null;
  }

  public async getActiveWallet() {
    const infoString = await readItem('wallets');

    if (infoString) {
      const info = JSON.parse(infoString);

      // TODO: select different wallet
      // 1. build basic wallet
      const wallet = {
        address: info[0].address,
        name: info[0].name,
        balance: 0,
        balanceInUSD: 0,
        gasLimit: MINIMUM_GAS_LIMIT,
        ethPrice: 0,
        tokens: [],
        txs: [],
        pendingTxHash: null,
      };

      // 2. add tokens
      for (const tokenData of SupportedTokens) {
        const token = new Token(tokenData.name,
          tokenData.icon, tokenData.symbol,
          tokenData.address, wallet.address, tokenData.decimals);
        wallet.tokens.push(token);
      }

      this.wallet = wallet;

      return wallet;
    } else {
      return null;
    }
  }

  public async getSeed(password) {
    const infoString = await readItem('wallets');

    if (infoString) {
      const info = JSON.parse(infoString);
      console.log(info[0]);

      try {
        const seed = unlock(info[0].v3, password, true);
        return seed;
      } catch (e) {
        return null;
      }
    } else {
      return null;
    }
  }

  public async getWalletJson(password) {
    const infoString = await readItem('wallets');

    if (infoString) {
      const info = JSON.parse(infoString);
      console.log(info[0]);

      try {
        const seed = unlock(info[0].v3, password, true);
        console.log('seed: ', seed);

        return info[0].v3;
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
      const keyString = JSON.stringify(json);
      const address = addressFromJSONString(keyString);
      const info = [
        { address, name, v3: keyString },
      ];

      // check if address equals.
      if (wallet.getAddressString() === `0x${json.address}`) {
        const infoString = JSON.stringify(info);
        this.wallet = { address, name };
        await saveItem('wallets', infoString);
        return true;
      }
    }
    return false;
  }

  public async generateV3Wallet(name, passphrase, options) {
    const wallet = await EthJs.generate();
    const json = await wallet.toV3(passphrase, { kdf: 'pbkdf2', c: 10240 });

    if (options.persistence) {
      const keyString = JSON.stringify(json);
      const address = addressFromJSONString(keyString);
      const info = [
        { address, name, v3: keyString },
      ];
      const infoString = JSON.stringify(info);

      this.wallet = { address, name };

      await saveItem('wallets', infoString);
    }

    return json;
  }

}
