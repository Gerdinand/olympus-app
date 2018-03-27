'use strict';
import Config from '../Config/env';
import { Platform } from 'react-native';

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};
export let FcmService = {
  async uploadFcmToken(token, wallet) {
    if (!token || !wallet) {
      return null;
    }
    return await fetch(Config[process.env.NODE_ENV].server + '/api/user/notificationToken', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        token,
        platform: Platform.OS,
        address: wallet.address,
      }),
    });
  },
};
