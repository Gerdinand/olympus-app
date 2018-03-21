import { Token } from '.';

// TODO, eventually  new transaction send is different of transactions lists.
// At the moment both get sumarize the same here

/**
 * There are several types of transactions, and get to know which one is which is not trivial, this long comment
 * will try to help new developer in understanding the transactions.
 * This information can change if the contract change.
 *
 * ===== Etherium Direct Send or Receive Transactions =====
 *  (The most basics)
 *  Logs are empty
 *  Input is '0x'.
 *  One of the directions belongs to you.
 *  Value is the ETH
 *
 * ===== Other token To ETH: =====
 *   Logs has a lot of information:
 *       1. Transfer
 *       2. Transfer
 *       3. Ether Receival
 *       4. Trade
 * Input:
 *    1. Amount
 *    2. Dest amount   The money you receive (Etherium)
 *    3. Src amount The money you exchange (Token)
 *  Value is 0
 *
 *
 * ===== Other token To ETH: =====
 *   Logs has a lot of information:
 *       1. Transfer
 *       2. Transfer
 *       3. Trade
 * Input:
 *    1. Amount
 *    2. Dest amount   The money you receive (Token)
 *    3. Src amount The money you exchange (Etherium)
 *  Value is 0
 *
 * ===== Direct transfer Send of Token =====
 *  Logs: Transfer
 *  Input Src and Dest are both corresponding to the Token
 *
 * ===== Direct transfer Receive of Token =====
 *  This transactions are not comming from the server =S so cant be display
 *
 * ==== In case of error ====
 * In case of Error isError value is "1" (true, but is an string)
 * There wont be logs, so we depend of the input to know if is
 *   ETH transfer (no input)
 *   Transaction (input with diferent coins)
 *   Token transfer (input same coins)
 */

export interface Tx {
  hash: string;
  blockHash: string;
  blockNumber: string;
  confirmations: number;
  contractAddress: string;
  from: string; // address
  gas: string;
  gasPrice: string;
  gasLimit: string;
  data: any;
  chainId: number;
  isError: string;
  logs: any[]; // TODO
  input: '0x0' | {
    destToken: Token;
    srcToken: Token;
    amount: string;
  };
  nonce: string;
  timeStamp: string;
  to: string;
  transactionIndex: string;
  txreceipt_status: string;
  value: number | '0x' | '0x0';
}
