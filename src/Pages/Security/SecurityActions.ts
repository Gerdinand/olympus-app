export default class WalletActions {
  public static SET_GESTURE = 'set_gesture';
  public static SET_USER_LOGED = 'set_user_loged';
  public static ENABLE_FINGERPRINT = 'enable_fingerprint';

  public static setGestureRedux = (password: string | null) => {
    return {
      type: WalletActions.SET_GESTURE,
      payload: password,
    };
  }

  public static setUserLogedRedux = (isLoged: boolean | false) => {
    return {
      type: WalletActions.SET_USER_LOGED,
      payload: isLoged,
    };
  }

  public static enableFingerprintRedux = (enable: boolean | false) => {
    return {
      type: WalletActions.ENABLE_FINGERPRINT,
      payload: enable,
    };
  }
}
