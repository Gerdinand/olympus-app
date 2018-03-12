import abiDecoder from 'abi-decoder';
import * as Constants from '../Constants';
import { EthereumService } from '../Services';
import { SupportedTokens } from '../Constants';
// import SolidityCoder from 'web3/lib/solidity/coder';

abiDecoder.addABI(Constants.KYBER_ABI);
abiDecoder.addABI(Constants.ERC20);
export const decodeTx = async (tx) => {
  if (!tx.logs) {
    const receipt: { logs: any } = await EthereumService.getInstance().getTransactionReceipt(tx.hash);
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
      const amount = result.params.find((p) => ['srcAmount', '_amount', '_value'].some((n) => p.name === n)).value;

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
  return SupportedTokens.find((t) => t.address === address);
};
