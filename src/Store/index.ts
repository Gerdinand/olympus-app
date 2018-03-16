import { createStore, combineReducers } from 'redux';
import { walletReducer, WalletState } from './Reducers';

export interface AppState {
  wallet: WalletState;
}

// API of store is { subscribe, dispatch, getState }
const Store = createStore(combineReducers<AppState>({
  wallet: walletReducer,
}));

export { Store };
export * from './Actions';
