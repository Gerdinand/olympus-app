'use strict';

import BigNumber from 'bignumber.js';

function acceptableTyping(number) {
  // ends with a dot
  if (number.length > 0 && number[number.length - 1] == '.') {
    return true;
  }

  // TODO refactor format
  // zero suffixed with real number
  // if (number.length > 0 && number[number.length - 1] == "0") {
  //   for (var i = 0; i < number.length; i++) {
  //     if (number[i] == ".") {
  //       return true
  //     }
  //   }
  // }
  return false;
}

export function toTWei(number) {
  const bigNumber = new BigNumber(number);
  if (bigNumber == 'NaN' || bigNumber == 'Infinity') {
    return number;
  } else if (acceptableTyping(number)) {
    return number;
  } else {
    return bigNumber.times(1000000000000000000).toString();
  }
}

export function toT(number, precision) {
  const bigNumber = new BigNumber(number);
  let result;
  if (bigNumber == 'NaN' || bigNumber == 'Infinity') {
    return number;
  } else if (acceptableTyping(number)) {
    return number;
  } else {
    result = bigNumber.div(1000000000000000000);
  }
  if (precision) {
    return result.toFixed(precision);
  } else {
    return result.toString();
  }
}

export function toEther(number) {
  const bigNumber = new BigNumber(number);
  if (bigNumber == 'NaN' || bigNumber == 'Infinity') {
    return '0';
  } else {
    return bigNumber.dividedBy(1000000000000000000).toString();
  }
}

export function toEtherNumber(number) {
  const bigNumber = new BigNumber(number.toPrecision(15));
  if (bigNumber == 'NaN' || bigNumber == 'Infinity') {
    return 0;
  } else {
    return bigNumber.dividedBy(1000000000000000000);
  }
}

export function gweiToWei(number) {
  const bigNumber = new BigNumber(number);
  if (bigNumber == 'NaN' || bigNumber == 'Infinity') {
    return number;
  } else if (acceptableTyping(number)) {
    return number;
  } else {
    return bigNumber.times(1000000000).toString();
  }
}

export function weiToGwei(number) {
  const bigNumber = new BigNumber(number);
  if (bigNumber == 'NaN' || bigNumber == 'Infinity') {
    return number;
  } else if (acceptableTyping(number)) {
    return number;
  } else {
    return bigNumber.div(1000000000).toString();
  }
}

export function numberToHex(number) {
  return `0x${(new BigNumber(number)).toString(16)}`;
}

export function hexToNumber(hex) {
  return new BigNumber(hex).toNumber();
}
