import { createStore, combineReducers } from 'redux';
import { walletReducer, WalletState } from '../Pages/Wallet/WalletReducer';

export interface AppState {
  wallet: WalletState;
}

// API of store is { subscribe, dispatch, getState }
const Store = createStore(combineReducers<AppState>({
  wallet: walletReducer,
}));

export { Store };
export * from '../Pages/Wallet/WalletActions';
