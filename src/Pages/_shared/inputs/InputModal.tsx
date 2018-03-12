'use strict';
import React from 'react';
import {
  View,
  Text,
  GestureResponderEvent,
  StyleSheet,
} from 'react-native';
import {
  FormInput,
  FormValidationMessage,
} from 'react-native-elements';

interface InternalProps {
  onInputChangeText: (text: string) => void;
  onTextPress?: (gestureEvent: GestureResponderEvent) => void;
  sendAmount: string;
  sendAmountErrorMessage: string;
  balance: number;
}

interface InternalState {
  amountPlaceHolder: string;
}
export class InputModal extends React.PureComponent<InternalProps, InternalState> {

  public constructor(props) {
    super(props);
    this.state = {
      amountPlaceHolder: '0',
    };
  }
  private textPress(gestureEvent: GestureResponderEvent) {
    this.props.onTextPress && this.props.onTextPress(gestureEvent);
  }

  private inputChangeText(text: string) {
    this.props.onInputChangeText && this.props.onInputChangeText(text);
  }

  public render() {
    return (
      <View >
        <Text style={styles.maxText} onPress={(gestureEvent) => this.textPress(gestureEvent)}>max</Text>
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

const styles = StyleSheet.create({
  maxText: { position: 'relative', top: 30, left: '85%', color: 'rgb(85,137,255)', zIndex: 200 },
});
