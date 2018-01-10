'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
    Picker,
    AsyncStorage,
  ScrollView,
  Image,
  Linking
} from 'react-native';
import {
  FormLabel,
  FormInput,
  Button
} from 'react-native-elements';
import EthereumWallet from '../Services/Wallet';
import {EventRegister} from "react-native-event-listeners";

class NetworkView extends Component {
    constructor(props) {
    super(props)

    this.state = {
        network: null,
      password: null,
      walletJson: null
    };
    }
    componentWillMount() {
        AsyncStorage.getItem("network").then( async (net) => {
            switch (net) {
                case 'MAIN' :
                    this.setState({network: 'MAIN'});
                    break;

                case 'KOVAN' :
                    this.setState({network: 'KOVAN'});
                    break;
                default :
                    this.setState({network: 'MAIN'});
                    await AsyncStorage.setItem("network", 'MAIN');
            }
        })
  }
  render() {
    var _ = this;

    return (
      <View>
          <FormLabel>Please choose a network for your wallet:</FormLabel>
          <Picker
              selectedValue={this.state.network}
              onValueChange={async (net) => {
                  this.setState({network: net})
                  await AsyncStorage.setItem("network", net);
                  EventRegister.emit("network.updated", net);
                }
              }>
              <Picker.Item label="MAIN NETWORK" value="MAIN" />
              <Picker.Item label="KOVAN TESTNET" value="KOVAN" />
          </Picker>
      </View>
    )
  };
}

export default NetworkView;
