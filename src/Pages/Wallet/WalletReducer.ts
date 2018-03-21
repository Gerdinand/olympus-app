import { BALANCE_VISIBILITY, UPDATE_WALLET } from './WalletActions';
import { Wallet } from '../../Models';

export interface WalletState {
  balanceVisibility: boolean;
  wallet: Wallet;
}

const initialWalletState: WalletState = {
  balanceVisibility: true,
  wallet: null,
};

export const walletReducer = (state: WalletState = initialWalletState, action) => {
  // Log in main reducer for testing
  console.log('REDUCER ', state, action.type, action.payload);

  switch (action.type) {
    case BALANCE_VISIBILITY:
      return {
        ...state,
        balanceVisibility: !state.balanceVisibility,
      };
    case UPDATE_WALLET: {

      return {
        ...state,
        wallet: cloneWallet(action.payload),
      };
    }
    default:
      return state;
  }
};

const cloneWallet = (wallet: Wallet): Wallet => {
  if (!wallet) { return null; }

  return {
    ...wallet,
    txs: [...wallet.txs], // logs is nested array, change in log wont update the wallet
    tokens: [...wallet.tokens],
    pendingTxs: [...wallet.pendingTxs],
  };
};
