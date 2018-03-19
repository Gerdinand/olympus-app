'use strict';
import Config from '../Config';
import { Platform } from 'react-native';

export let FcmService = {
  async uploadFcmToken(token, wallet) {
    if (!token || !wallet) {
      return null;
    }
    return await fetch(Config[process.env.NODE_ENV].server + '/api/user/notificationToken', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        platform: Platform.OS,
        address: wallet.address,
      }),
    });
  },
};
