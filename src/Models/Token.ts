import { ETH } from '../Constants';

export enum TokenExchanges {
  KYBER = 'Kyber',
  SHAPE_SHIFT = 'Shape_shift',
}
export class Token {
  // Coming from masterdata
  public name: string;
  public icon: string;
  public symbol: string;
  public address: string;
  public decimals: number;
  public supportedExchanges: TokenExchanges[];
  // Set on importing
  public ownerAddress: string;
  // Need to init
  public balance: number;
  public price: number;
  constructor(
    name: string,
    icon: string,
    symbol: string,
    address: string,
    ownerAddress: string,
    decimals: number = 18,
    balance: number = 0,
    price: number = 0,
    supportedExchanges: TokenExchanges[] = []) {

    this.name = name;
    this.icon = icon;
    this.symbol = symbol;
    this.address = address;
    this.ownerAddress = ownerAddress;
    this.decimals = decimals;
    this.balance = balance;
    this.price = price;
    this.supportedExchanges = supportedExchanges;
  }

  // Creates a clone of the token with the data required for the wallet
  public static initTokenForWallet(token: Token, ownerAddress): Token {
    return { ...token, balance: 0, price: 0, ownerAddress };
  }

  public static supportExchange(token: Token): boolean {
    return token.supportedExchanges.length > 0;
  }
  public static isETH(token: Token): boolean {
    return token.symbol === ETH;
  }

}
