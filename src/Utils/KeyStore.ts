'use strict';

import * as Keychain from 'react-native-keychain';

export async function saveItem(key, value) {
  const result = await Keychain.setGenericPassword(key, value);
  return result;
}

export async function readItem(key) {
  const json = await Keychain.getGenericPassword();
  if (typeof (json) !== 'boolean' && json.username === key) {
    return json.password;
  } else {
    return null;
  }
}

// TODO what does this key do?
export async function removeItem(_key) {
  await Keychain.resetGenericPassword();
}
