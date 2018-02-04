import abiDecoder from 'abi-decoder';
import Constants from '../Services/Constants';
import Tokens from '../Services/SupportedTokens';

abiDecoder.addABI(Constants.KYBER_ABI);
export const decodeTx = (txInput) => {
  if (typeof txInput !== 'string') {
    return txInput;
  }
  const result = abiDecoder.decodeMethod(txInput);
  if (result) {
    const source = result.params.find((p) => p.name === 'source');
    const dest = result.params.find((p) => p.name === 'dest');
    const amount = result.params.find((p) => p.name === 'srcAmount').value;
    const srcToken = findToken(source.value);
    const destToken = findToken(dest.value);

    return { srcToken, destToken, amount };
  }

  return null;
};


export const findToken = (address) => {
  return Tokens.find((t) => t.address === address);
};
