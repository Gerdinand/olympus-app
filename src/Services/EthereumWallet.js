'use strict';

import '../../shim.js'

import { asyncRandomBytes } from 'react-native-secure-randombytes';

window.randomBytes = asyncRandomBytes

import bip39 from 'react-native-bip39';
import hdkey from 'ethereumjs-wallet-react-native/hdkey';
import EthJs from 'ethereumjs-wallet-react-native';

import { addressFromJSONString } from '../Utils/Keys';
import { saveItem, readItem } from '../Utils/KeyStore';

class EthereumWalletService {

  static myInstance = null;

  static getInstance() {
    if (this.myInstance == null) {
      this.myInstance = new EthereumWalletService();
    }

    return this.myInstance;
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

      await saveItem("wallets", infoString);
    }

    return json;
  }
}

export default EthereumWalletService;
