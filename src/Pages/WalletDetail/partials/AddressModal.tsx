
import React from 'react';
import {
  View,
  Modal,
  Clipboard,
  StyleSheet,
} from 'react-native';
import {
  Card,
  Button,
} from 'react-native-elements';
import QRCode from 'react-native-qrcode';
import { Text } from '../../_shared/layout';

interface InternalProps {
  visible: boolean;
  onClose?: (message: string) => void;
  address: string;
  title: string;
}

export class AddressModal extends React.PureComponent<InternalProps> {

  public constructor(props) {
    super(props);
  }

  private close(message = null) {
    this.props.onClose && this.props.onClose(message);
  }

  public render() {
    return (
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => { this.close(); }}
      >
        <View style={styles.modelContainer}>
          <Card title={this.props.title}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ flex: 1, maxWidth: 200, flexDirection: 'row', justifyContent: 'space-between' }}>
                <QRCode
                  value={this.props.address}
                  size={200}
                  bgColor="black"
                  fgColor="white"
                />
              </View>
            </View>
            <Text style={{ color: 'black', fontSize: 12, textAlign: 'center', marginTop: 15 }}>
              {this.props.address}
            </Text>
            <View style={{ padding: 10 }}>
              <Button
                title={'Copy address'}
                buttonStyle={styles.modalSendButton}
                onPress={() => {
                  Clipboard.setString(this.props.address);
                  this.close('Address copied to clipboard.');
                }}
              />
              <Button
                buttonStyle={styles.modalCloseButton}
                title={'Cancel'}
                onPress={() => { this.close(); }}
                color={'#4A4A4A'}
              />
            </View>
          </Card>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modelContainer: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalSendButton: {
    marginTop: 30,
    backgroundColor: '#5589FF',
  },
  modalCloseButton: {
    marginTop: 15,
    backgroundColor: 'transparent',
  },
});
