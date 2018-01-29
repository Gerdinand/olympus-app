import '../../shim.js';

import React, { Component } from 'react';
import { Button, Text, StyleSheet, View } from 'react-native';

import bip39 from 'react-native-bip39';
class GenMnemonic extends Component {
  constructor(props) {
    super(props);
    this.state = { mnemonic: '' };
  }

  async generateMnemonic() {
    try {
      this.setState({ mnemonic: await bip39.generateMnemonic() });
    } catch (e) {
      return false;
    }
  }

  render() {
    return (
      <View style={styles.container}>

        {/*<TextInput*/}
        {/*style={{height: 40}}*/}
        {/*placeholder="Type here to translate!"*/}
        {/*onChangeText={(text) => this.setState({text})}*/}
        {/*value={this.state.text}*/}
        {/*/>*/}
        <Text
          multiline={true}
          selectable={true}
        >
          {this.state.mnemonic}
        </Text>

        <Button
          onPress={this.generateMnemonic.bind(this)}
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
module.exports = GenMnemonic;
