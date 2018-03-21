'use strict';

import React from 'react';
import { Wallet } from '../../../Models';
interface InternalProps {
  setWallet: (wallet: Wallet) => any;
}
export default class PrivateKeyImport extends React.Component<InternalProps, null> {
  public constructor(props) {
    super(props);
  }

  public render() {
    return null;
  }
}
