import '../../shim.js'

import bip39 from 'react-native-bip39';
import hdkey from 'ethereumjs-wallet-react-native/hdkey';
import Wallet from 'ethereumjs-wallet-react-native';

class EthereumWalletService {
  createNewAddress(passphrase) {
    var newAddress = Wallet.generate();
    return newAddress.toV3(passphrase, {kdf: "pbkdf2", c: 10240});
  }
}

export default EthereumWalletService;
