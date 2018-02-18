import abiDecoder from 'abi-decoder';
import Constants from '../Services/Constants';
import { EthereumService } from '../Services';
import Tokens from '../Services/SupportedTokens';
// import SolidityCoder from 'web3/lib/solidity/coder';

abiDecoder.addABI(Constants.KYBER_ABI);
abiDecoder.addABI(Constants.ERC20);
export const decodeTx = async (tx) => {
  if (!tx.logs) {
    const receipt = await EthereumService.getInstance().getTransactionReceipt(tx.hash);
    if (receipt && receipt.logs) {
      tx.logs = abiDecoder.decodeLogs(receipt.logs).filter((log) => log);
    }
  }
  tx.input = decodeInput(tx);
};

export const decodeInput = (tx) => {
  const txInput = tx.input;
  if (typeof txInput === 'string') {
    const result = abiDecoder.decodeMethod(txInput);
    if (result) {
      let source = result.params.find((p) => p.name === 'source');
      let dest = result.params.find((p) => p.name === 'dest');
      const amount = result.params.find((p) => p.name === 'srcAmount' || p.name === '_amount').value;

      if (!source && !dest) {
        // token transfer
        source = dest = { value: tx.to };
      }

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
