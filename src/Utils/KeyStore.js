'use strict';

import * as Keychain from 'react-native-keychain';

export function saveItem(key, value) {
  console.log("key: " + key);
  console.log("value: " + value);
  Keychain
    .setGenericPassword(key, value)
    .then(function() {
      console.log('Credentials saved successfully!');
    });
}

export async function readItem(key) {
  return await Keychain.getGenericPassword();
}
