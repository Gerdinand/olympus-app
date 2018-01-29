'use strict';

export default class Token {
  constructor(name, icon, symbol, address, ownerAddress, decimals = 18, balance = 0, price = 0) {
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
