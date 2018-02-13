import abiDecoder from 'abi-decoder';
import Constants from '../Services/Constants';
import { EthereumService } from '../Services';
import Tokens from '../Services/SupportedTokens';
// import SolidityCoder from 'web3/lib/solidity/coder';

abiDecoder.addABI(Constants.KYBER_ABI);
export const decodeTx = async (tx) => {
  if (!tx.logs) {
    const receipt = await EthereumService.getInstance().getTransactionReceipt(tx.hash);
    if (receipt && receipt.logs) {
      tx.logs = abiDecoder.decodeLogs(receipt.logs).filter((log) => log);
    }
  }
  tx.input = decodeInput(tx.input);
};

export const decodeInput = (txInput) => {
  if (typeof txInput === 'string') {
    const result = abiDecoder.decodeMethod(txInput);
    if (result) {
      const source = result.params.find((p) => p.name === 'source');
      const dest = result.params.find((p) => p.name === 'dest');
      const amount = result.params.find((p) => p.name === 'srcAmount').value;
      const srcToken = findToken(source.value);
      const destToken = findToken(dest.value);

      return { srcToken, destToken, amount };
    }
  }

  return txInput;
};

export const findToken = (address) => {
  return Tokens.find((t) => t.address === address);
};
