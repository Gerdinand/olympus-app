import { Wallet } from '../../Models';

export default class WalletActions {

  public static BALANCE_VISIBILITY = 'balance_visibility';
  public static BACKUP_DONE = 'backup_done';
  public static LOGOUT = 'LOGOUT';
  public static UPDATE_WALLET = 'UPDATE_WALLET';
  public static setBalanceVisibility() {
    return {
      type: this.BALANCE_VISIBILITY,
    };
  }

  public static setWalletBackUpDone() {
    return { type: this.BACKUP_DONE };
  }

  // TODO that shall be into AppActions in next loop
  public static logout() {
    return { type: this.LOGOUT };
  }

  /**
   * @param wallet  Wallet object or null to reset
   */
  public static updateWalletRedux(wallet: Wallet | null) {
    return { type: this.UPDATE_WALLET, payload: wallet };
  }
}
