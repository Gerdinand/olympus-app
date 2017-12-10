'use strict';

import '../../shim.js'

import { asyncRandomBytes } from 'react-native-secure-randombytes';

window.randomBytes = asyncRandomBytes

import bip39 from 'react-native-bip39';
import hdkey from 'ethereumjs-wallet-react-native/hdkey';
import EthJs from 'ethereumjs-wallet-react-native';

import { addressFromJSONString } from '../Utils/Keys';
import { saveItem, readItem } from '../Utils/KeyStore';

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
      const result = { address: info[0].address, name: info[0].name };

      this.wallet = result;

      return result;
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
