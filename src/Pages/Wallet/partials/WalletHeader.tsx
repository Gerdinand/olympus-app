'use strict';

import React from 'react';
import {
  StyleSheet,
  View,
  DeviceEventEmitter,
} from 'react-native';
import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import { AddressModal } from '../../WalletDetail/partials/AddressModal';
import { Row, Column, Margin, Text } from '../../_shared/layout';
import { AppState } from '../../../reducer';
import WalletActions from '../WalletActions';
import { WalletService } from '../../../Services';
import Colors from '../../../Constants/Colors';
import { Wallet } from '../../../Models';

const ALMOST_EQUAL = '\u2248';
interface InternalProps {
  wallet: Wallet;
}
interface ReduxProps {
  balanceVisibility: boolean;
  changeBalanceVisibility: () => void;
}
interface InternalState {
  modalVisible: boolean;
}
class WalletHeader extends React.Component<ReduxProps & InternalProps, InternalState> {

  public constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  public render() {
    const wallet = this.props.wallet;

    return (
      <View style={{ backgroundColor: 'transparent' }}>

        <View style={styles.walletContainer}>
          <Column justifyContent="space-between" style={{ flex: 1 }} >

            <View>
              <Row>
                <Text style={styles.tips}>Total Assets(ETH) </Text>
                <Icon
                  size={16}
                  color="white"
                  name={this.props.balanceVisibility ? 'eye' : 'eye-slash'}
                  onPress={() => this.props.changeBalanceVisibility()}
                />
              </Row>
              <Text style={styles.assets}>
                {this.props.balanceVisibility ? wallet.balance.toFixed(6) : '********'}

              </Text>
              <Row>
                <Text style={styles.tips}>
                  {this.props.balanceVisibility ? `${ALMOST_EQUAL}$${wallet.balanceInUSD}` : `${ALMOST_EQUAL}$*******`}
                </Text>
              </Row>
            </View>
            <Row
              onPress={() => { this.setState({ modalVisible: true }); }}
              alignItems="center"
            >
              <Text style={styles.address}> {WalletService.formatAddressLong(wallet.address)}</Text>
              <Margin margin={12} />
              <Icon
                name="qrcode"
                color={Colors.subTitle}
                size={28}
              />
            </Row>
          </Column >
        </View>

        <AddressModal
          title={'My Address'}
          visible={this.state.modalVisible}
          address={wallet.address}
          onClose={(message) => {
            this.setState({ modalVisible: false });
            if (message) {
              DeviceEventEmitter.emit('showToast', message);
            }
          }}
        />
      </View >
    );
  }
}

const mapReduxStateToProps = (state: AppState) => {
  return {
    balanceVisibility: state.wallet.balanceVisibility,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    changeBalanceVisibility: () => dispatch(WalletActions.setBalanceVisibility()),
  };
};

const mergeProps = (reduxStatePros, dispatchProps, ownProps) => {
  return { ...ownProps, ...reduxStatePros, ...dispatchProps };
};
export default connect(mapReduxStateToProps, mapDispatchToProps, mergeProps)(WalletHeader);

const styles = StyleSheet.create({
  walletContainer: {
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    paddingHorizontal: 24,
    paddingVertical: 32,
    aspectRatio: 16 / 9,
    backgroundColor: '#4B5FFE',
    borderRadius: 8,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  address: {
    fontSize: 12,
    color: Colors.subTitle,
  },
  tips: {
    fontSize: 12,
    color: Colors.subTitle,
  },
  assets: {
    fontSize: 48,
    fontFamily: 'ArialNarrow',
    fontWeight: '600',
    color: 'white',
  },

});
