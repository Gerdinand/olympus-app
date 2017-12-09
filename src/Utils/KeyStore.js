'use strict';

import * as Keychain from 'react-native-keychain';

export async function saveItem(key, value) {
  await Keychain.setGenericPassword(key, value);
}

export async function readItem(key) {
  const json = await Keychain.getGenericPassword();
  return json.password;
}
