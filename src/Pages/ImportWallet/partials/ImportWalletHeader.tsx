'use strict';

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import style from './ImportWalletHeaderStyle';
interface InternalState {
  activeTab: ACTIVE_TABS;
}
interface InternalProps {
  onChangeTab: (newTab: string) => any;
}

const availableTabs = [
  ACTIVE_TABS.MNEMONIC,
  ACTIVE_TABS.PRIVATE_KEY,
  ACTIVE_TABS.JSONWALLET,
];
export const enum ACTIVE_TABS {
  MNEMONIC = 'Mnemonic',
  PRIVATE_KEY = 'Private key',
  JSONWALLET = 'JSON',
}

export default class ImportWalletHeader extends React.Component<InternalProps, InternalState> {
  public constructor(props) {
    super(props);

    this.state = {
      activeTab: ACTIVE_TABS.MNEMONIC,
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
              <Text style={this.state.activeTab === tab ? style.bold : {}}>
                {tab}
              </Text>
            </TouchableOpacity>);
        })}
      </View>
    );
  }
}
