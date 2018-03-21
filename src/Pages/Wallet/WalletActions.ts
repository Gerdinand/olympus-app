import { Wallet } from '../../Models';

export const BALANCE_VISIBILITY = 'balance_visibility';
export const UPDATE_WALLET = 'update_wallet';

export const setBalanceVisibility = () => {
  return {
    type: BALANCE_VISIBILITY,
  };
};

/**
 * @param wallet  Wallet object or null to reset
 */
export const updateWalletRedux = (wallet: Wallet | null) => {
  return {
    type: UPDATE_WALLET,
    payload: wallet,
  };
};
