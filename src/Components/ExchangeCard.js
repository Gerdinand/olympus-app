'use strict';
import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  Card,
  FormInput,
  Button,
  FormLabel,
  FormValidationMessage,
  Slider,
} from 'react-native-elements';
import { Text, Row } from '../Controls';
import PropTypes from 'prop-types';
import { FormInputWithButton } from '../Components';

const styles = StyleSheet.create({
  modalSendButton: {
    // marginTop: 30,
    marginTop: 0,
    marginBottom: 15,
    backgroundColor: '#5589FF',
  },
  modalCloseButton: {
    marginTop: 0,
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
  inputButton: {
    color: 'rgb(85,137,255)',
    alignSelf: 'flex-end',
  },
});

export class ExchangeCard extends React.PureComponent {
  static propTypes = {
    cardTitle: PropTypes.string,
    ETHBalance: PropTypes.number,
    balance: PropTypes.number,
    exchangeType: PropTypes.string,
    tradeAmountErrorMessage: PropTypes.string,
    sourceAmount: PropTypes.string,
    destAmount: PropTypes.string,
    tradePasswordErrorMessage: PropTypes.string,
    gasFee: PropTypes.string,
    maxGasPrice: PropTypes.number,
    gasValue: PropTypes.number,
    tradeButtonDisable: PropTypes.bool,
    tradeCancelButtonDisable: PropTypes.bool,
    token: PropTypes.object,
    onAmountChange: PropTypes.func,
    onAmountPress: PropTypes.func,
    onPasswordChange: PropTypes.func,
    onGasValueChange: PropTypes.func,
    onTradeButtonPress: PropTypes.func,
    onCancelButtonPress: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state={
      amountPlaceHolder: '0',
    };
  }

  render() {
    return (
      <Card title={this.props.cardTitle}>
        <FormLabel>Exchange</FormLabel>
        <FormInputWithButton
          inputStyle={{ width: '100%' }}
          placeholder={this.state.amountPlaceHolder}
          keyboardType={'numeric'}
          value={this.props.sourceAmount}
          onChangeText={(text) => this.props.onAmountChange && this.props.onAmountChange(text)}
          onFocus={() => {
            const balance = this.props.exchangeType == 'BID' ? this.props.ETHBalance : this.props.token.balance;
            this.setState({ amountPlaceHolder: `BAL: ${balance.toFixed(6)}` });
          }}
          onBlur={() => {
            this.setState({ amountPlaceHolder: '0' });
          }}
          onButtonPress={(input) => this.props.onAmountPress && this.props.onAmountPress(input)}
        >
          <Text style={styles.inputButton}> Max </Text>
        </FormInputWithButton>
        {
          this.props.tradeAmountErrorMessage &&
          <FormValidationMessage>
            {this.props.tradeAmountErrorMessage}
          </FormValidationMessage>
        }
        <FormLabel>Expected to receive {this.props.destAmount} {this.props.exchangeType == 'BID' ? this.props.token.symbol : 'ETH'}</FormLabel>
        <FormLabel>Password</FormLabel>
        <FormInput
          inputStyle={{ width: '100%' }}
          secureTextEntry={true}
          placeholder="To unlock the wallet"
          onChangeText={(password) => this.props.onPasswordChange && this.props.onPasswordChange(password)}
        />
        {
          this.props.tradePasswordErrorMessage &&
          <FormValidationMessage>
            {this.props.tradePasswordErrorMessage}
          </FormValidationMessage>
        }
        <FormLabel>Gas Fee (est.): {this.props.gasFee} eth</FormLabel>
        <Row style={{ alignItems: 'stretch', justifyContent: 'center' }}>
          <Slider
            style={{ width: '88%', marginTop: 12 }}
            value={this.props.gasValue}
            step={1}
            minimumValue={8}
            maximumValue={this.props.maxGasPrice}
            minimumTrackTintColor="#5589FF"
            thumbTintColor="#5589FF"
            onValueChange={(value) => this.props.onGasValueChange && this.props.onGasValueChange(value)}
          />
        </Row>
        <View style={{
          padding: 10,
        }}
        >
          <Button
            title={this.props.tradeButtonDisable ? 'Trading...' : 'Trade'}
            buttonStyle={styles.modalSendButton}
            disabled={this.props.tradeButtonDisable}
            onPress={() => this.props.onTradeButtonPress && this.props.onTradeButtonPress()}
          />
          <Button buttonStyle={styles.modalCloseButton}
            title="Cancel"
            disabled={this.props.tradeCancelButtonDisable}
            onPress={() => this.props.onCancelButtonPress && this.props.onCancelButtonPress()}
            color={'#4A4A4A'}
          />
        </View>
      </Card>
    );
  }
}
