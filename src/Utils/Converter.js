'use strict';

import BigNumber from 'bignumber.js'

export function numberToHex(number) {
  return "0x" + (new BigNumber(number)).toString(16)
}

export function hexToNumber(hex) {
  return new BigNumber(hex).toNumber()
}
