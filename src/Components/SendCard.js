'use strict';
import React from 'react';
import {
  View,
  StyleSheet,
  Image,
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
import Icon from 'react-native-vector-icons/Ionicons';

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
  icon: {
    width: 24,
    height: 24,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  inputButton: {
    color: 'rgb(85,137,255)',
    alignSelf: 'flex-end',
  },
});

export class SendCard extends React.PureComponent {
  static propTypes = {
    cardTitle: PropTypes.string,
    iconPath: PropTypes.string,
    sendAddress: PropTypes.string,
    sendAddressErrorMessage: PropTypes.string,
    sendAmount: PropTypes.string,
    sendAmountErrorMessage: PropTypes.string,
    sendPasswordErrorMessage: PropTypes.string,
    gasFee: PropTypes.string,
    maxGasPrice: PropTypes.number,
    gasValue: PropTypes.number,
    scanButtonDisable: PropTypes.bool,
    sendButtonDisable: PropTypes.bool,
    sendCancelButtonDisable: PropTypes.bool,
    token: PropTypes.object,
    onToChange: PropTypes.func,
    onToPress: PropTypes.func,
    onAmountChange: PropTypes.func,
    onAmountPress: PropTypes.func,
    onPasswordChange: PropTypes.func,
    onGasValueChange: PropTypes.func,
    onSendButtonPress: PropTypes.func,
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
      <Card
        title={this.props.cardTitle}
      >
        <Image source={{ uri: this.props.iconPath }} style={styles.icon} />
        <FormLabel>To</FormLabel>
        <FormInputWithButton
          multiline
          inputStyle={{ width: '100%', fontSize: 12 }}
          value={this.props.sendAddress}
          onChangeText={(sendAddress) => this.props.onToChange && this.props.onToChange(sendAddress)}
          onButtonPress={() => this.props.onToPress && this.props.onToPress()}
        >
          <Icon name="md-qr-scanner" size={24} style={styles.inputButton}
            disabled={this.props.scanButtonDisable}
          />
        </FormInputWithButton>
        {
          this.props.sendAddressErrorMessage &&
          <FormValidationMessage>
            {this.props.sendAddressErrorMessage}
          </FormValidationMessage>
        }
        <FormLabel>Amount</FormLabel>
        <FormInputWithButton
          inputStyle={{ width: '100%' }}
          value={this.props.sendAmount}
          placeholder={this.state.amountPlaceHolder}
          keyboardType={'numeric'}
          onChangeText={(text) => this.props.onAmountChange && this.props.onAmountChange(text)}
          onFocus={() => {
            this.setState({ amountPlaceHolder: `BAL: ${this.props.token.balance.toFixed(6)}` });
          }}
          onBlur={() => {
            this.setState({ amountPlaceHolder: '0' });
          }}
          onButtonPress={(input) => this.props.onAmountPress && this.props.onAmountPress(input)}
        >
          <Text style={styles.inputButton}> Max </Text>
        </FormInputWithButton>
        {
          this.props.sendAmountErrorMessage &&
          <FormValidationMessage>
            {this.props.sendAmountErrorMessage}
          </FormValidationMessage>
        }
        <FormLabel>Password</FormLabel>
        <FormInput
          inputStyle={{ width: '100%' }}
          secureTextEntry={true}
          placeholder="To unlock the wallet"
          onChangeText={(password) => this.props.onPasswordChange && this.props.onPasswordChange(password)}
        />
        {
          this.props.sendPasswordErrorMessage &&
          <FormValidationMessage>
            {this.props.sendPasswordErrorMessage}
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
        <View
          style={{
            padding: 10,
          }}
        >
          <Button
            title={this.props.sendButtonDisable ? 'Sending...' : 'Send'}
            buttonStyle={styles.modalSendButton}
            //raised={true}
            disabled={this.props.sendButtonDisable}
            onPress={() => this.props.onSendButtonPress && this.props.onSendButtonPress()}
          />
          <Button buttonStyle={styles.modalCloseButton}
            title={'Cancel'}
            disabled={this.props.sendCancelButtonDisable}
            onPress={() => this.props.onCancelButtonPress && this.props.onCancelButtonPress()}
            color={'#4A4A4A'}
          />
        </View>
      </Card>
    );
  }
}
