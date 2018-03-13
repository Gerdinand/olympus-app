'use strict';

import BigNumber from 'bignumber.js';

function acceptableTyping(number) {
  // ends with a dot
  if (number.length > 0 && number[number.length - 1] === '.') {
    return true;
  }

  // TODO refactor format
  // zero suffixed with real number
  // if (number.length > 0 && number[number.length - 1] === "0") {
  //   for (var i = 0; i < number.length; i++) {
  //     if (number[i] === ".") {
  //       return true
  //     }
  //   }
  // }
  return false;
}

export function toTWei(number) {
  const bigNumber = new BigNumber(number);
  if (bigNumber.isNaN() || !bigNumber.isFinite()) {
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
  if (bigNumber.isNaN() || !bigNumber.isFinite()) {
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
  return toEtherNumber(number).toString();
}

export function toEtherNumber(number) {
  const bigNumber = new BigNumber(number.toPrecision(15));
  if (bigNumber.isNaN() || !bigNumber.isFinite()) {
    return 0;
  } else {
    return bigNumber.dividedBy(1000000000000000000);
  }
}

export function gweiToWei(number) {
  const bigNumber = new BigNumber(number);
  if (bigNumber.isNaN() || !bigNumber.isFinite()) {
    return number;
  } else if (acceptableTyping(number)) {
    return number;
  } else {
    return bigNumber.times(1000000000).toString();
  }
}

export function weiToGwei(number) {
  const bigNumber = new BigNumber(number);
  if (bigNumber.isNaN() || !bigNumber.isFinite()) {
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

/*
 * Restricts a text to a number if value is not correct also retuns the flag
 */
export function restrictTextToNumber(text: string): { text: string, textCorrect: boolean } {
  text = text.replace(/[^(\d.)]*/ig, '');
  if (/^\./.test(text)) {
    return { text: '', textCorrect: false };
  }
  if (/\.\d*\./.test(text)) {
    return { text: text.split('.').slice(0, 2).join('.'), textCorrect: false };
  }
  if (/\d+\.$/.test(text)) {
    return { text, textCorrect: false };
  }

  return { text, textCorrect: true };
}

export function filterStringLessThanNumber(value: string, max: number) {

  if (value === '' || value === '.' || (/^(\d)*\.$/.test(value)) || !Number(value)) {
    return value; // The cast would return no decimals, but that could be annoying
  }

  console.log(Number(value), max, Math.min(Number(value), max));
  return Math.min(Number(value), max).toString();
}

/**
 * Big difference between toFixed(2), is that here you dont add 0
 * to complete the max of decimals. Just cut if they are more.
 */
export function maxDecimals(value: string, maxDecimals: number) {
  const [integer, decimals] = value.split('.');
  // 1 => 1
  if (!decimals) { return value; }
  if (decimals.length <= maxDecimals) { return value; }

  return integer + '.' + decimals.substr(0, maxDecimals);
}
