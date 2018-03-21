'use strict';

import React from 'react';
import { Wallet } from '../../../Models';
import { View, Text } from 'react-native';
interface InternalProps {
  setWallet: (wallet: Wallet) => any;
}
export default class MnemonicImport extends React.Component<InternalProps, null> {
  public constructor(props) {
    super(props);
  }

  public render() {
    return (
      <View>
        <Text>hello</Text>
      </View>
    );
  }
}
