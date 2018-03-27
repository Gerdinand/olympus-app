'use strict';

import React from 'react';
import {
  StyleSheet,
  View,
  DeviceEventEmitter,
  TouchableOpacity,
  Image,
} from 'react-native';
import { connect } from 'react-redux';

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
                <TouchableOpacity
                  onPress={() => this.props.changeBalanceVisibility()}
                >
                  <Image
                    source={
                      this.props.balanceVisibility ? require('../../../../images/eye_icon.png')
                        : require('../../../../images/eye_closed_icon.png')}
                    style={[styles.image, styles.eyeSize]}
                  />
                </TouchableOpacity>
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
              <Image
                source={require('../../../../images/qrcode.png')}
                style={styles.qrcodeIcon}
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
  image: {
    flex: 1,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  eyeSize: {
    width: 16,
  },
  qrcodeIcon: {
    width: 16,
  },
});
