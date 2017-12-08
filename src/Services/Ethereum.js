'use strict'

import Web3 from 'web3';
import Wallet from 'ethereumjs-wallet-react-native';

const promisify = (inner) =>
    new Promise((resolve, reject) =>
        inner((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    );

class EthereumService {
  constructor() {
    this.rpc = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/xiNNVkYQ6V3IsiPWTTNT ", 9000));
  }

  version() {
    return this.rpc.version.api;
  }

  async getBalance(address) {
    var balance;
    const wei = promisify(cb => this.rpc.eth.getBalance(address, cb));
    try {
      balance = web3.fromWei(await wei, 'ether');
      return balance;
    } catch (error) {
      return error;
    }
  }

  createNewAddress(passphrase) {
    var newAddress = Wallet.generate();
    return newAddress.toV3(passphrase, {kdf: "pbkdf2", c: 10240});
  }
}

export default EthereumService;
