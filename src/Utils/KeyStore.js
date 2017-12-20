'use strict';

import * as Keychain from 'react-native-keychain';

export async function saveItem(key, value) {
  await Keychain.setGenericPassword(key, value);
}

export async function readItem(key) {
  const json = await Keychain.getGenericPassword();
  if (json.username == key) {
    return json.password;
  } else {
    return null;
  }
}

export async function removeItem(key) {
  await Keychain.resetGenericPassword();
}
