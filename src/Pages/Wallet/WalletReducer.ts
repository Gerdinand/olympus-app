import WalletActions from './WalletActions';

export interface WalletState {
  balanceVisibility: boolean;
  warningBackUpDone: boolean;
}

const initialWalletState: WalletState = {
  balanceVisibility: true,
  warningBackUpDone: false,
};

export const walletReducer = (state: WalletState = initialWalletState, action: { type: string, payload: any }) => {
  // For testing
  console.log(state, action.type, action.payload);
  switch (action.type) {
    case WalletActions.BALANCE_VISIBILITY:
      return {
        ...state,
        balanceVisibility: !state.balanceVisibility,
      };
    case WalletActions.BACKUP_DONE: return { ...state, warningBackUpDone: true };
    case WalletActions.LOGOUT: return initialWalletState;

    default:
      return state;
  }
};
