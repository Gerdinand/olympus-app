'use strict';

import '../../shim.js'

import { asyncRandomBytes } from 'react-native-secure-randombytes';

window.randomBytes = asyncRandomBytes

import bip39 from 'react-native-bip39';
import hdkey from 'ethereumjs-wallet-react-native/hdkey';
import EthJs from 'ethereumjs-wallet-react-native';

class EthereumWalletService {
  async generateV3Wallet(passphrase) {
    const wallet = await EthJs.generate();
    const json = await wallet.toV3(passphrase, {kdf: "pbkdf2", c: 10240});
    return json;
  }
}

export default EthereumWalletService;
