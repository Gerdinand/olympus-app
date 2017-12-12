'use strict';

import Promisify from '../Utils/Promisify';

class Token {
  constructor(name, icon, symbol, address, ownerAddress, decimals = 18, balance = 0) {
    this.name = name;
    this.icon = icon;
    this.symbol = symbol;
    this.address = address;
    this.ownerAddress = ownerAddress;
    this.decimals = decimals;
    this.balance = balance;
  }

  async sync(eth) {
    const balance = await Promisify(cb => eth.getTokenBalance(this.address, this.ownerAddress, cb));
    this.balance = balance;
  }
}

export default Token;
