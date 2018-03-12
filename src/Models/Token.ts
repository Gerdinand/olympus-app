'use strict';

export class Token {
  public name: string;
  public icon: string;
  public symbol: string;
  public address: string;
  public ownerAddress: string;
  public decimals: number;
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
    price: number = 0) {

    this.name = name;
    this.icon = icon;
    this.symbol = symbol;
    this.address = address;
    this.ownerAddress = ownerAddress;
    this.decimals = decimals;
    this.balance = balance;
    this.price = price;
  }
}
