'use strict';

import React from 'react';
import {
  View,
  TouchableOpacity,
} from 'react-native';
import { Text } from '../../_shared/layout/Text';
import style from './ImportWalletHeaderStyle';
interface InternalState {
  activeTab: ActiveTabs;
}
interface InternalProps {
  onChangeTab: (newTab: string) => any;
}

const availableTabs = [
  ActiveTabs.MNEMONIC,
  ActiveTabs.PRIVATE_KEY,
  ActiveTabs.KEYSTORE_WALLET,
];
export const enum ActiveTabs {
  MNEMONIC = 'Mnemonic',
  PRIVATE_KEY = 'Private key',
  KEYSTORE_WALLET = 'Keystore',
}

export default class ImportWalletHeader extends React.Component<InternalProps, InternalState> {
  public constructor(props) {
    super(props);

    this.state = {
      activeTab: ActiveTabs.MNEMONIC,
    };
  }

  public render() {
    return (
      <View style={style.flexRow}>
        {availableTabs.map((tab, index) => {
          return (
            <TouchableOpacity
              key={tab + index}
              style={this.state.activeTab === tab ? [style.flexColumn, style.selected] : style.flexColumn}
              onPress={() => {
                this.setState({ activeTab: tab });
                this.props.onChangeTab(tab);
              }}
            >
              <Text style={this.state.activeTab === tab ? style.bold : style.text}>
                {tab}
              </Text>
            </TouchableOpacity>);
        })}
      </View>
    );
  }
}
