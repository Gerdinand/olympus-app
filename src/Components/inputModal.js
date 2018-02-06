'use strict';
import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import {
  FormInput,
  FormValidationMessage,
} from 'react-native-elements';
import PropTypes from 'prop-types';

export class InputModal extends React.PureComponent {
  static propTypes = {
    onInputChangeText: PropTypes.func,
    onTextPress: PropTypes.func,
    sendAmount:PropTypes.string,
    sendAmountErrorMessage:PropTypes.string,
    balance:PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      amountPlaceHolder:'0',
    };
  }
  textPress(e) {
    this.props.onTextPress && this.props.onTextPress(e);
  }

  inputChangeText(text){
    this.props.onInputChangeText && this.props.onInputChangeText(text);
  }

  render(){
    return (
      <View >
        <Text style={{position: 'relative',top:30,left:'85%',color:'rgb(85,137,255)',zIndex:200}} onPress={this.textPress.bind(this)}>max</Text>
        <FormInput
          inputStyle={{ width: '100%' }}
          placeholder={this.state.amountPlaceHolder}
          // keyboardType={'numeric'}
          value={this.props.sendAmount}
          onChangeText={(text) => {
            this.inputChangeText(text);
          }}
          onFocus={() => {
            this.setState({ amountPlaceHolder: `BAL: ${this.props.balance.toFixed(4)}` });
          }}
          onBlur={() => {
            this.setState({ amountPlaceHolder: '0' });
          }}
        />
        {
          this.props.sendAmountErrorMessage &&
          <FormValidationMessage>
            {this.props.sendAmountErrorMessage}
          </FormValidationMessage>
        }
      </View>
    );
  }
}