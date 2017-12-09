'use strict';

import SInfo from 'react-native-sensitive-info';

export async function saveItem(key, value) {
  console.log(key);
  console.log(value);
  await SInfo.setItem(key, value, {});
}

export async function readItem(key) {
  return await SInfo.getItem(key, {});
}
