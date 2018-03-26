'use strict';

import React from 'react';
import {
  View,
  TouchableOpacity,
} from 'react-native';
import { Text } from '../../_shared/layout/Text';
import style from './ImportWalletHeaderStyle';
import { Margin, Row } from '../../_shared/layout';
interface InternalState {
  activeTab: ImportWalletTabs;
}
interface InternalProps {
  onChangeTab: (newTab: string) => void;
}

const availableTabs = [
  ImportWalletTabs.MNEMONIC,
  ImportWalletTabs.PRIVATE_KEY,
  ImportWalletTabs.KEYSTORE_WALLET,
];
export const enum ImportWalletTabs {
  MNEMONIC = 'Mnemonic',
  PRIVATE_KEY = 'Private key',
  KEYSTORE_WALLET = 'Keystore',
}

export default class ImportWalletHeader extends React.Component<InternalProps, InternalState> {
  public constructor(props) {
    super(props);

    this.state = {
      activeTab: ImportWalletTabs.MNEMONIC,
    };
  }

  public render() {
    return (
      <View>
        <Margin key={'margin1'} marginTop={16} />
        <Row
          key={'content'}
          alignItems={'center'}
          justifyContent={'center'}
        >
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
        </Row>
        <Margin key={'margin2'} marginBottom={16} />
      </View>);
  }
}
