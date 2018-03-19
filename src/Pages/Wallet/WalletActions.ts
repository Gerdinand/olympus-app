
export default class WalletActions {

  public static BALANCE_VISIBILITY = 'balance_visibility';
  public static BACKUP_DONE = 'backup_done';
  public static LOGOUT = 'LOGOUT';

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
}
