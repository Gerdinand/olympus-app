'use strict';
import React from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Image,
} from 'react-native';
import {
  Card,
  Button,
} from 'react-native-elements';
import PropTypes from 'prop-types';
import QRCodeScanner from 'react-native-qrcode-scanner';

const styles = StyleSheet.create({
  modalCloseButton: {
    marginTop: 0,
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
});

let isActive = true;

export class ScanCode extends React.PureComponent {
  static propTypes = {
    isShowScanBar: PropTypes.bool,
    isAnimatedActive: PropTypes.bool,
    animateTime: PropTypes.number,
    onCancelPress: PropTypes.func,
    onScanRead: PropTypes.func,
    onScannerChange: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state={
      top: new Animated.Value(0),
      isActive: true,
    };
    this.scannerLineMove = this.scannerLineMove.bind(this);
  }

  componentDidMount() {
    isActive = true;
    this.scannerLineMove();
  }

  componentWillUnmount() {
    isActive = false;
  }

  _renderScanBar() {
    if(!this.props.isShowScanBar) return;
    return <Image style={{resizeMode: 'contain', width: '100%'}} source={require('../../images/scanBar.png')} />;
  }

  scannerLineMove() {
    this.state.top.setValue(0);//重置动画值为0
    console.log('scanLine animated start...');
    Animated.timing(this.state.top, {
      toValue: 240,
      duration: this.props.animateTime||2500,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => isActive ? this.scannerLineMove() : null );
  }

  render() {
    return (
      <Card title="SCAN">
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ flex: 1, maxWidth: 300, flexDirection: 'row', justifyContent: 'space-between' }}>
            <QRCodeScanner
              ref={(node) => this.props.onScannerChange && this.props.onScannerChange(node)}
              cameraStyle={{ width: 300, height: 300 }}
              showMarker={true}
              onRead={(e) => this.props.onScanRead && this.props.onScanRead(e)}
            />
            <View style={{ position: 'absolute', left: '10%', right: '10%', top: '10%', bottom: 0 }}>
              <Animated.View style={{ width: '100%',
                height: 2,
                transform: [{
                  translateY: this.state.top,
                }]}}
              >
                {this._renderScanBar()}
              </Animated.View>
            </View>
            {/* <Barcode
              ref={(node) => { this.scanner = node; }}
              style={{width: 300, height: 300 }}
              onBarCodeRead={(e) => {
                console.log(`e.nativeEvent.data.type = ${e.nativeEvent.data.type}, e.nativeEvent.data.code = ${e.nativeEvent.data.code}`);
                const data = e.nativeEvent.data;
                console.log('read: ', data);
                this.scanner.stopScan();
                if (data.type == 'QR_CODE') {
                  const reg = /^iban:/;
                  let address = data.code;
                  if (EthereumService.getInstance().isValidateAddress(address)) {
                    console.log('is an address');
                    this.setState({ sendModalVisible: true, scanModalVisible: false, sendAddress: address });
                  } else if (reg.test(address)) {
                    address = `0x${(address.replace(reg, '') || '')}`;
                    console.log(address);
                    if (EthereumService.getInstance().isValidateAddress(address)) {
                      console.log('is an address');
                      this.setState({ sendModalVisible: true, scanModalVisible: false, sendAddress: address });
                    } else {
                      console.log('is not an address');
                      this.scanner.startScan();
                    }
                  } else {
                    console.log('is not an address');
                    this.scanner.startScan();
                  }
                } else {
                  this.scanner.startScan();
                }
              }}
            /> */}
          </View>
        </View>
        <Button buttonStyle={styles.modalCloseButton}
          title={'Cancel'}
          onPress={() => this.props.onCancelPress && this.props.onCancelPress()}
          color={'#4A4A4A'}
        />
      </Card>
    );
  }
}
