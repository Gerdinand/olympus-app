import WalletActions from './WalletActions';

import { Wallet } from '../../Models';

export interface WalletState {
  balanceVisibility: boolean;
  warningBackUpDone: boolean;
  wallet: Wallet;
}

const initialWalletState: WalletState = {
  balanceVisibility: true,
  warningBackUpDone: false,
  wallet: null,
};

export const walletReducer = (state: WalletState = initialWalletState, action) => {
  // Log in main reducer for testing
  console.log('REDUCER ', state, action.type, action.payload);

  switch (action.type) {

    case WalletActions.BALANCE_VISIBILITY:
      return { ...state, balanceVisibility: !state.balanceVisibility };

    case WalletActions.BACKUP_DONE: return { ...state, warningBackUpDone: true };

    case WalletActions.LOGOUT: return initialWalletState;

    case WalletActions.UPDATE_WALLET: {
      return { ...state, wallet: Wallet.cloneWallet(action.payload) };
    }

    default:
      return state;
  }
};
