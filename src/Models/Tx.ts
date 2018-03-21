import { Token } from '.';

// TODO, eventually  new transaction send is different of transactions lists.
// At the moment both get sumarize the same here
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
  value: number | '0x0';
}
