'use strict';

import '../../shim.js'

import { asyncRandomBytes } from 'react-native-secure-randombytes';

window.randomBytes = asyncRandomBytes

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

  async getActiveWallet() {
    const infoString = await readItem("wallets");

    if (infoString) {
      const info = JSON.parse(infoString);

      // TODO: select different wallet
      // 1. build basic wallet
      var wallet = {
        address: info[0].address,
        name: info[0].name,
        balance: 0,
        balanceInUSD: 0,
        ethPrice: 0,
        tokens: [],
        txs: []
      };

      // 2. add tokens
      for (var i = 0; i < SupportedTokens.length; i++) {
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
    const infoString = await readItem("wallets");

    if (infoString) {
      const info = JSON.parse(infoString);
      console.log(info[0]);

      const seed = unlock(info[0].v3, password, true);
      console.log(seed);

      return seed;
    } else {
      return null;
    }
  }

  async generateV3Wallet(name, passphrase, options) {
    const wallet = await EthJs.generate();
    const json = await wallet.toV3(passphrase, {kdf: "pbkdf2", c: 10240});

    if (options.persistence) {
      const keyString = JSON.stringify(json);
      const address = addressFromJSONString(keyString);
      const info = [
        { address: address, name: name, v3: keyString }
      ];
      const infoString = JSON.stringify(info);

      this.wallet = { address: address, name: name };

      await saveItem("wallets", infoString);
    }

    return json;
  }
}

export default WalletService;
