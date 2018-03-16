import { BALANCE_VISIBILITY } from './Actions';

export interface WalletState {
  balanceVisibility: boolean;
}

const initialWalletState: WalletState = {
  balanceVisibility: true,
};

export const walletReducer = (state: WalletState = initialWalletState, action) => {
  switch (action.type) {
    case BALANCE_VISIBILITY:
      return {
        ...state,
        balanceVisibility: !state.balanceVisibility,
      };
    default:
      return state;
  }
};
