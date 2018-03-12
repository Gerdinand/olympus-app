import '../../shim.js';

import React from 'react';
import { Button, Text, StyleSheet, View } from 'react-native';

import bip39 from 'react-native-bip39';

interface InternalState {
  mnemonic: string;
}
export default class GenMnemonic extends React.Component<null, InternalState> {

  public constructor(props) {
    super(props);
    this.state = { mnemonic: '' };
  }

  private async generateMnemonic(): Promise<boolean> {
    try {
      this.setState({ mnemonic: await bip39.generateMnemonic() });
      return true;
    } catch (e) {
      return false;
    }
  }

  public render() {
    return (
      <View style={styles.container} >

        {/*<TextInput*/}
        {/*style={{height: 40}}*/}
        {/*placeholder="Type here to translate!"*/}
        {/*onChangeText={(text) => this.setState({text})}*/}
        {/*value={this.state.text}*/}
        {/*/>*/}
        <Text
          selectable={true}
        >
          {this.state.mnemonic}
        </Text>

        < Button
          onPress={() => this.generateMnemonic()}
          title="Press Me Generate Mnemonic"
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    //   // flex: 1,
    //   // justifyContent: 'center',
  },
});
