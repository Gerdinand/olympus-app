'use strict';

import '../../shim.js';

import { asyncRandomBytes } from 'react-native-secure-randombytes';

window.randomBytes = asyncRandomBytes;

import EthJs from 'ethereumjs-wallet-react-native';

import { addressFromJSONString, unlock } from '../Utils/Keys';
import { saveItem, readItem } from '../Utils/KeyStore';
import SupportedTokens from './SupportedTokens';
import Token from './Token';

class WalletService {

  constructor(props) {
    this.wallet = null;
  }

  static myInstance = null;

  static getInstance() {
    if (this.myInstance == null) {
      this.myInstance = new WalletService();
    }

    return this.myInstance;
  }

  resetActiveWallet() {
    this.wallet = null;
  }

  async getActiveWallet() {
    const infoString = await readItem('wallets');

    if (infoString) {
      const info = JSON.parse(infoString);

      // TODO: select different wallet
      // 1. build basic wallet
      let wallet = {
        address: info[0].address,
        name: info[0].name,
        balance: 0,
        balanceInUSD: 0,
        ethPrice: 0,
        tokens: [],
        txs: [],
        pendingTxHash: null,
      };

      // 2. add tokens
      for (let i = 0; i < SupportedTokens.length; i++) {
        const t = SupportedTokens[i];
        const token = new Token(t.name, t.icon, t.symbol, t.address, wallet.address, t.decimals);
        wallet.tokens.push(token);
      }

      this.wallet = wallet;

      return wallet;
    } else {
      return null;
    }
  }

  async getSeed(password) {
    const infoString = await readItem('wallets');

    if (infoString) {
      const info = JSON.parse(infoString);
      console.log(info[0]);

      try {
        const seed = unlock(info[0].v3, password, true);
        console.log('seed: ', seed);

        return seed;
      } catch (e) {
        return null;
      }
    } else {
      return null;
    }
  }

  async getWalletJson(password) {
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

  async importV3Wallet(name, json, password) {
    const wallet = await EthJs.fromV3(json, password);
    if (wallet) {
      const keyString = JSON.stringify(json);
      const address = addressFromJSONString(keyString);
      const info = [
        { address, name, v3: keyString },
      ];
      const infoString = JSON.stringify(info);

      this.wallet = { address, name };

      await saveItem('wallets', infoString);
      return true;
    } else {
      return false;
    }
  }

  async generateV3Wallet(name, passphrase, options) {
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

export default WalletService;
