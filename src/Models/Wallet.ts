import { Token, Tx } from '.';

export class Wallet {
  public address: string;
  public balance: number;
  public balanceInUSD: number;
  public ethPrice: number;
  public gasLimit: number;
  public name: string;
  public pendingTxs: PendingTx[];
  public tokens: Token[] = [];
  public txs: Tx[] = [];
  public forceReoload: boolean;

  public static cloneWallet = (wallet: Wallet): Wallet => {
    if (!wallet) { return null; }

    return {
      ...wallet,
      txs: [...wallet.txs], // logs is nested array, change in log wont update the wallet
      tokens: [...wallet.tokens],
      pendingTxs: [...wallet.pendingTxs],
    };
  }
}

export interface PendingTx { tx: Tx; token: Token; }
