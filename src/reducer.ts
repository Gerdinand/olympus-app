import { createStore, combineReducers } from 'redux';
import { walletReducer, WalletState } from './Pages/Wallet/WalletReducer';
import { securityReducer, SecurityState } from './Pages/Security/SecurityReducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export interface AppState {
  wallet: WalletState;
  security: SecurityState;
}

// API of store is { subscribe, dispatch, getState }
const appStore = combineReducers<AppState>({
  wallet: walletReducer,
  security: securityReducer,
});
// Persists
const persistConfig = {
  key: 'olympus-root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, appStore);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
